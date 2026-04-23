"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSessao } from "@/lib/sessao";
import { ROTAS } from "@/constants/rotas";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type TipoAnuncio = "oferta" | "necessidade";
export type TipoItemDinheiro = "cedula" | "moeda";
export type StatusAnuncio =
  | "ativo"
  | "em_negociacao"
  | "concluido"
  | "cancelado"
  | "expirado";

export type ItemComposicao = {
  tipo_item: TipoItemDinheiro;
  valor_unitario: number;
  quantidade: number;
};

export type AnuncioResumo = {
  id: string;
  tipo: TipoAnuncio;
  status: StatusAnuncio;
  valor_total: number;
  valor_remanescente: number;
  permite_parcial: boolean;
  rotulo_regiao: string | null;
  disponibilidade_texto: string | null;
  expira_em: string | null;
  publicado_em: string;
  empresa: {
    id: string;
    slug_publico?: string | null;
    razao_social: string;
    cidade: string | null;
    estado: string | null;
  } | null;
  itens: ItemComposicaoDetalhe[];
};

export type ItemComposicaoDetalhe = {
  id: string;
  tipo_item: TipoItemDinheiro;
  valor_unitario: number;
  quantidade: number;
  subtotal_valor: number;
  ordem_exibicao: number | null;
};

export type ResultadoAcao =
  | { ok: true; anuncio_id?: string }
  | { ok: false; erro: string };

const EPSILON_VALOR = 0.000001;

export async function recalcularStatusAnuncio(anuncioId: string, agora = new Date().toISOString()) {
  const supabase = await getSupabaseServerClient();

  const { data: anuncio, error: anuncioError } = await supabase
    .from("anuncios")
    .select("id, status, valor_remanescente, concluido_em")
    .eq("id", anuncioId)
    .single();

  if (anuncioError || !anuncio) {
    return { ok: false as const, error: "Anúncio não encontrado." };
  }

  const { count: negociacoesAbertas, error: negError } = await supabase
    .from("negociacoes")
    .select("id", { count: "exact", head: true })
    .eq("anuncio_id", anuncioId)
    .in("status", ["em_andamento", "operacao_encerrada"]);

  if (negError) {
    return { ok: false as const, error: "Erro ao recalcular status do anúncio." };
  }

  const remanescente = Number(anuncio.valor_remanescente ?? 0);
  const semRemanescente = remanescente <= EPSILON_VALOR;
  const possuiNegociacoesAbertas = (negociacoesAbertas ?? 0) > 0;

  const novoStatus: StatusAnuncio = semRemanescente
    ? possuiNegociacoesAbertas
      ? "em_negociacao"
      : "concluido"
    : possuiNegociacoesAbertas
      ? "em_negociacao"
      : "ativo";

  const concluidoEm = novoStatus === "concluido"
    ? anuncio.concluido_em ?? agora
    : null;

  const { error: updateError } = await supabase
    .from("anuncios")
    .update({
      status: novoStatus,
      concluido_em: concluidoEm,
    })
    .eq("id", anuncioId);

  if (updateError) {
    return { ok: false as const, error: "Erro ao atualizar anúncio." };
  }

  return { ok: true as const, status: novoStatus };
}

// ---------------------------------------------------------------------------
// criar_anuncio
// Fase 5 — Matriz Operacional, seção 6
// Regras:
//   - empresa deve estar aprovada (layout já garante)
//   - valor_remanescente = valor_total ao criar
//   - composição é obrigatória (mínimo 1 item)
//   - anuncio de oferta: define aceita_local_proprio e permite_parcial
// ---------------------------------------------------------------------------
export async function criarAnuncio(
  _estado: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const supabase = await getSupabaseServerClient();
  const sessao = await getSessao();

  if (!sessao?.empresa_id) return { ok: false, erro: "Sessão inválida." };
  if (sessao.status_empresa !== "aprovada") {
    return { ok: false, erro: "Apenas empresas aprovadas podem criar anúncios." };
  }

  const tipo = String(formData.get("tipo") ?? "") as TipoAnuncio;
  if (!["oferta", "necessidade"].includes(tipo)) {
    return { ok: false, erro: "Tipo de anúncio inválido." };
  }

  const valor_total = parseFloat(String(formData.get("valor_total") ?? "0"));
  if (!valor_total || valor_total <= 0) {
    return { ok: false, erro: "Valor total deve ser maior que zero." };
  }

  const permite_parcial = formData.get("permite_parcial") === "true";
  const aceita_local_proprio =
    tipo === "oferta"
      ? formData.get("aceita_local_proprio") === "true"
      : null;
  const rotulo_regiao = String(formData.get("rotulo_regiao") ?? "") || null;
  const disponibilidade_texto =
    String(formData.get("disponibilidade_texto") ?? "") || null;
  const expira_em = String(formData.get("expira_em") ?? "") || null;

  // Itens de composição — enviados como JSON serializado
  const itensRaw = String(formData.get("itens_composicao") ?? "[]");
  let itens: ItemComposicao[] = [];
  try {
    itens = JSON.parse(itensRaw);
  } catch {
    return { ok: false, erro: "Composição inválida." };
  }

  if (!itens.length) {
    return { ok: false, erro: "Informe ao menos um item de composição." };
  }

  // Valida subtotal dos itens vs valor_total (tolerância de R$ 0,01)
  const somaItens = itens.reduce(
    (acc, i) => acc + i.valor_unitario * i.quantidade,
    0,
  );
  if (Math.abs(somaItens - valor_total) > 0.01) {
    return {
      ok: false,
      erro: `A soma dos itens (R$ ${somaItens.toFixed(2)}) não corresponde ao valor total (R$ ${valor_total.toFixed(2)}).`,
    };
  }

  // Insere anúncio
  const { data: novoAnuncio, error: erroAnuncio } = await supabase
    .from("anuncios")
    .insert({
      empresa_id: sessao.empresa_id,
      tipo,
      valor_total,
      valor_remanescente: valor_total,
      permite_parcial,
      aceita_local_proprio,
      rotulo_regiao,
      disponibilidade_texto,
      expira_em: expira_em ? new Date(expira_em).toISOString() : null,
      status: "ativo",
    })
    .select("id")
    .single();

  if (erroAnuncio || !novoAnuncio) {
    return { ok: false, erro: "Erro ao criar anúncio. Tente novamente." };
  }

  // Insere itens de composição
  const itensParaInserir = itens.map((item, idx) => ({
    anuncio_id: novoAnuncio.id,
    tipo_item: item.tipo_item,
    valor_unitario: item.valor_unitario,
    quantidade: item.quantidade,
    subtotal_valor: item.valor_unitario * item.quantidade,
    ordem_exibicao: idx + 1,
  }));

  const { error: erroItens } = await supabase
    .from("itens_composicao_anuncio")
    .insert(itensParaInserir);

  if (erroItens) {
    // Rollback manual: remove anúncio criado
    await supabase.from("anuncios").delete().eq("id", novoAnuncio.id);
    return {
      ok: false,
      erro: "Erro ao salvar composição do anúncio. Tente novamente.",
    };
  }

  revalidatePath(ROTAS.MEUS_ANUNCIOS);
  redirect(ROTAS.MEUS_ANUNCIOS);
}

// ---------------------------------------------------------------------------
// listar_anuncios_publicos
// Fase 5 — Matriz Operacional, seção 6
// Regras:
//   - paginação simples
//   - apenas anúncios com status ativo ou em_negociacao
//   - ordenado por publicado_em desc
// ---------------------------------------------------------------------------
export async function listarAnunciosPublicos(
  pagina = 1,
  porPagina = 20,
  tipo?: TipoAnuncio,
) {
  const supabase = await getSupabaseServerClient();
  const offset = (pagina - 1) * porPagina;

  let query = supabase
    .from("anuncios")
    .select(
      `id, tipo, status, valor_total, valor_remanescente, permite_parcial,
       rotulo_regiao, disponibilidade_texto, expira_em, publicado_em,
       empresas ( id, slug_publico, razao_social, cidade, estado ),
       itens_composicao_anuncio ( id, tipo_item, valor_unitario, quantidade, subtotal_valor, ordem_exibicao )`,
      { count: "exact" },
    )
    .in("status", ["ativo", "em_negociacao"])
    .order("publicado_em", { ascending: false });

  if (tipo) {
    query = query.eq("tipo", tipo);
  }

  const { data, error, count } = await query.range(offset, offset + porPagina - 1);

  return { anuncios: (data ?? []) as unknown as AnuncioResumo[], total: count ?? 0, error };
}

// ---------------------------------------------------------------------------
// listar_meus_anuncios
// Fase 5 — Matriz Operacional, seção 6
// Regras:
//   - lista apenas anúncios da empresa logada
//   - todos os status
// ---------------------------------------------------------------------------
export async function listarMeusAnuncios() {
  const supabase = await getSupabaseServerClient();
  const sessao = await getSessao();

  if (!sessao?.empresa_id) return { anuncios: [], error: "Sessão inválida." };

  const { data, error } = await supabase
    .from("anuncios")
    .select(
      `id, tipo, status, valor_total, valor_remanescente, permite_parcial,
       rotulo_regiao, disponibilidade_texto, expira_em, publicado_em,
       itens_composicao_anuncio ( id, tipo_item, valor_unitario, quantidade, subtotal_valor, ordem_exibicao )`,
    )
    .eq("empresa_id", sessao.empresa_id)
    .order("publicado_em", { ascending: false });

  return {
    anuncios: (data ?? []) as unknown as (Omit<AnuncioResumo, "empresa"> & { empresa: null })[],
    error: error?.message ?? null,
  };
}

// ---------------------------------------------------------------------------
// obter_detalhe_anuncio
// Fase 5 — Matriz Operacional, seção 6
// ---------------------------------------------------------------------------
export async function obterDetalheAnuncio(anuncioId: string) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("anuncios")
    .select(
      `id, tipo, status, valor_total, valor_remanescente, permite_parcial,
       aceita_local_proprio, rotulo_regiao, disponibilidade_texto, expira_em, publicado_em,
       empresas ( id, slug_publico, razao_social, cidade, estado ),
       itens_composicao_anuncio ( id, tipo_item, valor_unitario, quantidade, subtotal_valor, ordem_exibicao )`,
    )
    .eq("id", anuncioId)
    .single();

  return { anuncio: data as unknown as (AnuncioResumo & { aceita_local_proprio: boolean | null }) | null, error };
}
