"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSessao } from "@/lib/sessao";
import { isAdmin } from "@/constants/papeis";
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
  | { ok: true; anuncio_id?: string; mensagem?: string }
  | { ok: false; erro: string };

export type ResultadoEdicaoAnuncio = {
  anuncio: (AnuncioResumo & { aceita_local_proprio?: boolean | null }) | null;
  error: string | null;
  pode_editar: boolean;
  motivo_bloqueio: string | null;
};

type ResultadoValidacaoAnuncio = { ok: false; erro: string };

type PayloadAnuncioValidado = {
  tipo: TipoAnuncio;
  valor_total: number;
  permite_parcial: boolean;
  aceita_local_proprio: boolean | null;
  rotulo_regiao: string | null;
  disponibilidade_texto: string | null;
  expira_em: string | null;
  itens: ItemComposicao[];
};

type AnuncioRow = {
  id: string;
  empresa_id?: string;
  tipo: TipoAnuncio;
  status: StatusAnuncio;
  valor_total: number;
  valor_remanescente: number;
  permite_parcial: boolean;
  aceita_local_proprio?: boolean | null;
  rotulo_regiao: string | null;
  disponibilidade_texto: string | null;
  expira_em: string | null;
  publicado_em: string;
  empresas?:
    | {
        id: string;
        slug_publico?: string | null;
        razao_social: string;
        cidade: string | null;
        estado: string | null;
      }
    | {
        id: string;
        slug_publico?: string | null;
        razao_social: string;
        cidade: string | null;
        estado: string | null;
      }[]
    | null;
  itens_composicao_anuncio?: ItemComposicaoDetalhe[] | null;
};

const EPSILON_VALOR = 0.000001;

function validarPayloadAnuncio(
  formData: FormData,
): PayloadAnuncioValidado | ResultadoValidacaoAnuncio {
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

  if (rotulo_regiao && rotulo_regiao.length > 200) {
    return { ok: false, erro: "Rótulo de região muito longo (máximo 200 caracteres)." };
  }
  if (disponibilidade_texto && disponibilidade_texto.length > 500) {
    return { ok: false, erro: "Disponibilidade muito longa (máximo 500 caracteres)." };
  }

  const itensRaw = String(formData.get("itens_composicao") ?? "[]");
  if (itensRaw.length > 10000) {
    return { ok: false, erro: "Composição inválida." };
  }

  let itens: ItemComposicao[] = [];
  try {
    itens = JSON.parse(itensRaw);
  } catch {
    return { ok: false, erro: "Composição inválida." };
  }

  if (!itens.length) {
    return { ok: false, erro: "Informe ao menos um item de composição." };
  }

  const somaItens = itens.reduce(
    (acc, item) => acc + item.valor_unitario * item.quantidade,
    0,
  );
  if (Math.abs(somaItens - valor_total) > 0.01) {
    return {
      ok: false,
      erro: `A soma dos itens (R$ ${somaItens.toFixed(2)}) não corresponde ao valor total (R$ ${valor_total.toFixed(2)}).`,
    };
  }

  return {
    tipo,
    valor_total,
    permite_parcial,
    aceita_local_proprio,
    rotulo_regiao,
    disponibilidade_texto,
    expira_em,
    itens,
  };
}

async function carregarAnuncioAutorizado(anuncioId: string) {
  const [sessao, supabase] = await Promise.all([
    getSessao(),
    Promise.resolve(getSupabaseAdminClient()),
  ]);

  if (!sessao) {
    return { sessao: null, anuncio: null, erro: "Sessão inválida." };
  }

  const { data, error } = await supabase
    .from("anuncios")
    .select(
      `id, empresa_id, tipo, status, valor_total, valor_remanescente, permite_parcial,
       aceita_local_proprio, rotulo_regiao, disponibilidade_texto, expira_em, publicado_em,
       empresas ( id, slug_publico, razao_social, cidade, estado ),
       itens_composicao_anuncio ( id, tipo_item, valor_unitario, quantidade, subtotal_valor, ordem_exibicao )`,
    )
    .eq("id", anuncioId)
    .single();

  if (error || !data) {
    return { sessao, anuncio: null, erro: "Anúncio não encontrado." };
  }

  const anuncio = normalizarAnuncio(data as unknown as AnuncioRow);
  const empresaId = (data as AnuncioRow).empresa_id ?? anuncio.empresa?.id ?? null;
  const ehAutora = !!sessao.empresa_id && sessao.empresa_id === empresaId;

  if (!ehAutora && !isAdmin(sessao.papel)) {
    return { sessao, anuncio: null, erro: "Você não pode alterar este anúncio." };
  }

  return { sessao, anuncio, erro: null };
}

async function obterTotaisRelacionadosAnuncio(anuncioId: string) {
  const supabase = getSupabaseAdminClient();

  const [{ count: totalSolicitacoes, error: errorSolicitacoes }, { count: totalNegociacoes, error: errorNegociacoes }] = await Promise.all([
    supabase
      .from("solicitacoes")
      .select("id", { count: "exact", head: true })
      .eq("anuncio_id", anuncioId),
    supabase
      .from("negociacoes")
      .select("id", { count: "exact", head: true })
      .eq("anuncio_id", anuncioId),
  ]);

  if (errorSolicitacoes || errorNegociacoes) {
    return { totalSolicitacoes: 0, totalNegociacoes: 0, erro: "Erro ao verificar histórico do anúncio." };
  }

  return {
    totalSolicitacoes: totalSolicitacoes ?? 0,
    totalNegociacoes: totalNegociacoes ?? 0,
    erro: null,
  };
}

function avaliarBloqueioEdicao(
  anuncio: AnuncioResumo & { aceita_local_proprio?: boolean | null },
  totalSolicitacoes: number,
  totalNegociacoes: number,
) {
  if (anuncio.status === "em_negociacao") {
    return "Anúncios em negociação não podem ser editados.";
  }

  if (totalSolicitacoes > 0 || totalNegociacoes > 0) {
    return "Este anúncio já possui histórico operacional e não pode mais ser editado.";
  }

  return null;
}

function normalizarAnuncio(row: AnuncioRow): AnuncioResumo & { aceita_local_proprio?: boolean | null } {
  const empresa = Array.isArray(row.empresas) ? row.empresas[0] ?? null : row.empresas ?? null;
  const itens = Array.isArray(row.itens_composicao_anuncio) ? row.itens_composicao_anuncio : [];

  return {
    id: row.id,
    tipo: row.tipo,
    status: row.status,
    valor_total: row.valor_total,
    valor_remanescente: row.valor_remanescente,
    permite_parcial: row.permite_parcial,
    aceita_local_proprio: row.aceita_local_proprio ?? null,
    rotulo_regiao: row.rotulo_regiao,
    disponibilidade_texto: row.disponibilidade_texto,
    expira_em: row.expira_em,
    publicado_em: row.publicado_em,
    empresa,
    itens,
  };
}

export async function recalcularStatusAnuncio(anuncioId: string, agora = new Date().toISOString()) {
  const supabase = getSupabaseAdminClient();

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

  const payload = validarPayloadAnuncio(formData);
  if ("ok" in payload) {
    return payload;
  }

  const {
    tipo,
    valor_total,
    permite_parcial,
    aceita_local_proprio,
    rotulo_regiao,
    disponibilidade_texto,
    expira_em,
    itens,
  } = payload;

  const { data: resultadoCriacao, error: erroCriacao } = await supabase.rpc(
    "criar_anuncio_atomico",
    {
      p_tipo: tipo,
      p_valor_total: valor_total,
      p_permite_parcial: permite_parcial,
      p_aceita_local_proprio: aceita_local_proprio,
      p_rotulo_regiao: rotulo_regiao,
      p_disponibilidade_texto: disponibilidade_texto,
      p_expira_em: expira_em ? new Date(expira_em).toISOString() : null,
      p_itens: itens,
    },
  );

  const anuncioCriado = Array.isArray(resultadoCriacao)
    ? resultadoCriacao[0]
    : resultadoCriacao;

  if (erroCriacao || !anuncioCriado?.anuncio_id) {
    return { ok: false, erro: erroCriacao?.message ?? "Erro ao criar anúncio. Tente novamente." };
  }

  revalidatePath(ROTAS.MEUS_ANUNCIOS);
  redirect(ROTAS.MEUS_ANUNCIOS);
}

export async function obterAnuncioParaEdicao(anuncioId: string): Promise<ResultadoEdicaoAnuncio> {
  const { anuncio, erro } = await carregarAnuncioAutorizado(anuncioId);

  if (erro || !anuncio) {
    return {
      anuncio: null,
      error: erro,
      pode_editar: false,
      motivo_bloqueio: erro,
    };
  }

  const { totalSolicitacoes, totalNegociacoes, erro: erroRelacionamentos } = await obterTotaisRelacionadosAnuncio(anuncioId);

  if (erroRelacionamentos) {
    return {
      anuncio,
      error: erroRelacionamentos,
      pode_editar: false,
      motivo_bloqueio: erroRelacionamentos,
    };
  }

  const motivoBloqueio = avaliarBloqueioEdicao(anuncio, totalSolicitacoes, totalNegociacoes);

  return {
    anuncio,
    error: null,
    pode_editar: !motivoBloqueio,
    motivo_bloqueio: motivoBloqueio,
  };
}

export async function listarAnunciosGerenciaveis() {
  const sessao = await getSessao();

  if (!sessao || !isAdmin(sessao.papel)) {
    return { anuncios: [], error: "Acesso administrativo obrigatório." };
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("anuncios")
    .select(
      `id, empresa_id, tipo, status, valor_total, valor_remanescente, permite_parcial,
       aceita_local_proprio, rotulo_regiao, disponibilidade_texto, expira_em, publicado_em,
       empresas ( id, slug_publico, razao_social, cidade, estado ),
       itens_composicao_anuncio ( id, tipo_item, valor_unitario, quantidade, subtotal_valor, ordem_exibicao )`,
    )
    .order("publicado_em", { ascending: false });

  return {
    anuncios: (data ?? []).map((anuncio) => normalizarAnuncio(anuncio as unknown as AnuncioRow)),
    error: error?.message ?? null,
  };
}

export async function atualizarAnuncio(
  _estado: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const anuncioId = String(formData.get("anuncio_id") ?? "").trim();
  if (!anuncioId) {
    return { ok: false, erro: "Anúncio inválido." };
  }

  const { anuncio, erro } = await carregarAnuncioAutorizado(anuncioId);
  if (erro || !anuncio) {
    return { ok: false, erro: erro ?? "Anúncio não encontrado." };
  }

  const { totalSolicitacoes, totalNegociacoes, erro: erroRelacionamentos } = await obterTotaisRelacionadosAnuncio(anuncioId);
  if (erroRelacionamentos) {
    return { ok: false, erro: erroRelacionamentos };
  }

  const motivoBloqueio = avaliarBloqueioEdicao(anuncio, totalSolicitacoes, totalNegociacoes);
  if (motivoBloqueio) {
    return { ok: false, erro: motivoBloqueio };
  }

  const payload = validarPayloadAnuncio(formData);
  if ("ok" in payload) {
    return payload;
  }

  const {
    tipo,
    valor_total,
    permite_parcial,
    aceita_local_proprio,
    rotulo_regiao,
    disponibilidade_texto,
    expira_em,
    itens,
  } = payload;

  const supabase = getSupabaseAdminClient();

  const { error: updateError } = await supabase
    .from("anuncios")
    .update({
      tipo,
      valor_total,
      valor_remanescente: valor_total,
      permite_parcial,
      aceita_local_proprio,
      rotulo_regiao,
      disponibilidade_texto,
      expira_em: expira_em ? new Date(expira_em).toISOString() : null,
      status: "ativo",
      cancelado_em: null,
    })
    .eq("id", anuncioId);

  if (updateError) {
    return { ok: false, erro: updateError.message ?? "Erro ao atualizar anúncio." };
  }

  const { error: deleteItemsError } = await supabase
    .from("itens_composicao_anuncio")
    .delete()
    .eq("anuncio_id", anuncioId);

  if (deleteItemsError) {
    return { ok: false, erro: deleteItemsError.message ?? "Erro ao atualizar composição do anúncio." };
  }

  const { error: insertItemsError } = await supabase
    .from("itens_composicao_anuncio")
    .insert(
      itens.map((item: ItemComposicao, index: number) => ({
        anuncio_id: anuncioId,
        tipo_item: item.tipo_item,
        valor_unitario: item.valor_unitario,
        quantidade: item.quantidade,
        subtotal_valor: item.valor_unitario * item.quantidade,
        ordem_exibicao: index,
      })),
    );

  if (insertItemsError) {
    return { ok: false, erro: insertItemsError.message ?? "Erro ao salvar itens do anúncio." };
  }

  revalidatePath(ROTAS.MEUS_ANUNCIOS);
  revalidatePath(ROTAS.ANUNCIOS);
  revalidatePath(ROTAS.ANUNCIO_DETALHE(anuncioId));
  revalidatePath(ROTAS.ADMIN_ANUNCIOS);

  return { ok: true, anuncio_id: anuncioId, mensagem: "Anúncio atualizado com sucesso." };
}

export async function excluirAnuncio(
  _estado: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const anuncioId = String(formData.get("anuncio_id") ?? "").trim();
  if (!anuncioId) {
    return { ok: false, erro: "Anúncio inválido." };
  }

  const { anuncio, erro } = await carregarAnuncioAutorizado(anuncioId);
  if (erro || !anuncio) {
    return { ok: false, erro: erro ?? "Anúncio não encontrado." };
  }

  const { totalSolicitacoes, totalNegociacoes, erro: erroRelacionamentos } = await obterTotaisRelacionadosAnuncio(anuncioId);
  if (erroRelacionamentos) {
    return { ok: false, erro: erroRelacionamentos };
  }

  const supabase = getSupabaseAdminClient();

  if (totalSolicitacoes > 0 || totalNegociacoes > 0 || anuncio.status === "em_negociacao" || anuncio.status === "concluido") {
    const { error: cancelError } = await supabase
      .from("anuncios")
      .update({
        status: "cancelado",
        cancelado_em: new Date().toISOString(),
      })
      .eq("id", anuncioId);

    if (cancelError) {
      return { ok: false, erro: cancelError.message ?? "Erro ao cancelar anúncio." };
    }

    revalidatePath(ROTAS.MEUS_ANUNCIOS);
    revalidatePath(ROTAS.ANUNCIOS);
    revalidatePath(ROTAS.ANUNCIO_DETALHE(anuncioId));
    revalidatePath(ROTAS.ADMIN_ANUNCIOS);

    return {
      ok: true,
      mensagem: "O anúncio foi cancelado para preservar o histórico operacional já vinculado.",
    };
  }

  const { error: deleteItemsError } = await supabase
    .from("itens_composicao_anuncio")
    .delete()
    .eq("anuncio_id", anuncioId);

  if (deleteItemsError) {
    return { ok: false, erro: deleteItemsError.message ?? "Erro ao excluir itens do anúncio." };
  }

  const { error: deleteAdError } = await supabase
    .from("anuncios")
    .delete()
    .eq("id", anuncioId);

  if (deleteAdError) {
    return { ok: false, erro: deleteAdError.message ?? "Erro ao excluir anúncio." };
  }

  revalidatePath(ROTAS.MEUS_ANUNCIOS);
  revalidatePath(ROTAS.ANUNCIOS);
  revalidatePath(ROTAS.ANUNCIO_DETALHE(anuncioId));
  revalidatePath(ROTAS.ADMIN_ANUNCIOS);

  return { ok: true, mensagem: "Anúncio excluído com sucesso." };
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
  const supabase = getSupabaseAdminClient();
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

  return {
    anuncios: (data ?? []).map((anuncio) => normalizarAnuncio(anuncio as unknown as AnuncioRow)),
    total: count ?? 0,
    error,
  };
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
    anuncios: (data ?? []).map((anuncio) => normalizarAnuncio(anuncio as unknown as AnuncioRow)),
    error: error?.message ?? null,
  };
}

// ---------------------------------------------------------------------------
// obter_detalhe_anuncio
// Fase 5 — Matriz Operacional, seção 6
// ---------------------------------------------------------------------------
export async function obterDetalheAnuncio(anuncioId: string) {
  const [supabase, sessao] = await Promise.all([
    Promise.resolve(getSupabaseAdminClient()),
    getSessao(),
  ]);

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

  const anuncio = data ? normalizarAnuncio(data as unknown as AnuncioRow) : null;
  const empresa = anuncio?.empresa ?? null;
  const ehAutora = !!sessao?.empresa_id && sessao.empresa_id === empresa?.id;
  const podeVerNaoPublico = !!sessao && (ehAutora || isAdmin(sessao.papel));

  if (
    anuncio &&
    !["ativo", "em_negociacao"].includes(anuncio.status) &&
    !podeVerNaoPublico
  ) {
    return { anuncio: null, error: { message: "Anúncio não encontrado." } };
  }

  return { anuncio, error };
}
