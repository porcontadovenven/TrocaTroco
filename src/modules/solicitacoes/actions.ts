"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSessao } from "@/lib/sessao";
import { ROTAS } from "@/constants/rotas";
import { recalcularStatusAnuncio } from "@/modules/anuncios/actions";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type LocalTroca = "empresa_autora" | "empresa_solicitante";
export type StatusSolicitacao =
  | "pendente"
  | "aceita"
  | "recusada"
  | "cancelada"
  | "expirada";

export type ItemComposicaoSol = {
  tipo_item: "cedula" | "moeda";
  valor_unitario: number;
  quantidade: number;
};

export type ResultadoAcao =
  | { ok: true }
  | { ok: false; erro: string };

// Janela de cancelamento pela solicitante: 15 minutos (Fase 4, seção 5.3)
const JANELA_CANCELAMENTO_MS = 15 * 60 * 1000;
// Prazo de resposta da solicitação: até 12 horas (US-025)
const PRAZO_RESPOSTA_MS = 12 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// criar_solicitacao
// Fase 5 — Matriz Operacional, seção 6
// Regras:
//   - empresa solicitante deve ser aprovada e não ser a autora do anúncio
//   - solicitação pendente não reserva saldo (Fase 5, 2.1)
//   - registra meio_pagamento e local_troca obrigatoriamente
//   - prazo_cancelamento_em = criada_em + 15 min
// ---------------------------------------------------------------------------
export async function criarSolicitacao(
  _estado: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const supabase = await getSupabaseServerClient();
  const sessao = await getSessao();

  if (!sessao?.empresa_id) return { ok: false, erro: "Sessão inválida." };
  if (sessao.status_empresa !== "aprovada") {
    return { ok: false, erro: "Apenas empresas aprovadas podem fazer solicitações." };
  }

  const anuncioId = String(formData.get("anuncio_id") ?? "");
  const valorSolicitado = parseFloat(String(formData.get("valor_solicitado") ?? "0"));
  const parcial = formData.get("parcial") === "true";
  const meio_pagamento = String(formData.get("meio_pagamento") ?? "");
  const local_troca = String(formData.get("local_troca") ?? "") as LocalTroca;

  if (!anuncioId) return { ok: false, erro: "Anúncio não identificado." };
  if (!valorSolicitado || valorSolicitado <= 0)
    return { ok: false, erro: "Valor solicitado deve ser maior que zero." };
  if (!meio_pagamento) return { ok: false, erro: "Informe o meio de pagamento." };
  if (meio_pagamento.length > 200) return { ok: false, erro: "Meio de pagamento inválido." };
  if (!["empresa_autora", "empresa_solicitante"].includes(local_troca))
    return { ok: false, erro: "Local da troca inválido." };

  // Verifica que a empresa solicitante não é a autora do anúncio
  const { data: anuncio } = await supabase
    .from("anuncios")
    .select("id, empresa_id, status, valor_remanescente, permite_parcial")
    .eq("id", anuncioId)
    .single();

  if (!anuncio) return { ok: false, erro: "Anúncio não encontrado." };
  if (anuncio.empresa_id === sessao.empresa_id)
    return { ok: false, erro: "Você não pode solicitar seu próprio anúncio." };
  if (anuncio.status !== "ativo")
    return { ok: false, erro: "Este anúncio não está disponível." };
  if (!anuncio.permite_parcial && valorSolicitado < anuncio.valor_remanescente)
    return { ok: false, erro: "Este anúncio não aceita solicitações parciais." };
  if (valorSolicitado > anuncio.valor_remanescente)
    return { ok: false, erro: `Valor solicitado excede o disponível (R$ ${anuncio.valor_remanescente.toFixed(2)}).` };

  // Itens de composição (se parcial, são obrigatórios)
  const itensRaw = String(formData.get("itens_composicao") ?? "[]");
  if (itensRaw.length > 10000) {
    return { ok: false, erro: "Dados de composição inválidos." };
  }
  let itens: ItemComposicaoSol[] = [];
  try {
    itens = JSON.parse(itensRaw);
  } catch {
    itens = [];
  }

  if (parcial && itens.length === 0)
    return { ok: false, erro: "Informe a composição desejada para solicitação parcial." };

  const agora = new Date();
  const prazoCancelamento = new Date(agora.getTime() + JANELA_CANCELAMENTO_MS);
  const expiraEm = new Date(agora.getTime() + PRAZO_RESPOSTA_MS);

  const { data: novaSol, error: erroSol } = await supabase
    .from("solicitacoes")
    .insert({
      anuncio_id: anuncioId,
      empresa_solicitante_id: sessao.empresa_id,
      valor_solicitado: valorSolicitado,
      parcial,
      meio_pagamento,
      local_troca,
      status: "pendente",
      expira_em: expiraEm.toISOString(),
      prazo_cancelamento_em: prazoCancelamento.toISOString(),
    })
    .select("id")
    .single();

  if (erroSol || !novaSol) {
    return { ok: false, erro: "Erro ao criar solicitação. Tente novamente." };
  }

  // Insere itens de composição, se houver
  if (itens.length > 0) {
    await supabase.from("itens_composicao_solicitacao").insert(
      itens.map((item, idx) => ({
        solicitacao_id: novaSol.id,
        tipo_item: item.tipo_item,
        valor_unitario: item.valor_unitario,
        quantidade: item.quantidade,
        subtotal_valor: item.valor_unitario * item.quantidade,
        ordem_exibicao: idx + 1,
      })),
    );
  }

  revalidatePath(ROTAS.SOLICITACOES);
  redirect(ROTAS.SOLICITACOES);
}

// ---------------------------------------------------------------------------
// aceitar_solicitacao
// Fase 5 — Matriz Operacional, seção 6
// Regras:
//   - apenas a empresa autora do anúncio pode aceitar
//   - aceite cria negociação (Fase 5, 2.1)
//   - atualiza valor_remanescente do anúncio
//   - se remanescente = 0, anúncio passa para em_negociacao
// ---------------------------------------------------------------------------
export async function aceitarSolicitacao(
  _estado: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const supabase = await getSupabaseServerClient();
  const sessao = await getSessao();

  if (!sessao?.empresa_id) return { ok: false, erro: "Sessão inválida." };

  const solicitacaoId = String(formData.get("solicitacao_id") ?? "");
  if (!solicitacaoId) return { ok: false, erro: "Solicitação não identificada." };

  const agora = new Date().toISOString();

  const { data: resultadoRpc, error: erroAceite } = await supabase.rpc(
    "aceitar_solicitacao_atomica",
    {
      p_solicitacao_id: solicitacaoId,
      p_empresa_autora_id: sessao.empresa_id,
    },
  );

  const resultado = Array.isArray(resultadoRpc) ? resultadoRpc[0] : resultadoRpc;

  if (erroAceite || !resultado?.negociacao_id || !resultado?.anuncio_id) {
    return { ok: false, erro: erroAceite?.message ?? "Erro ao aceitar solicitação." };
  }

  await recalcularStatusAnuncio(resultado.anuncio_id, agora);

  revalidatePath(ROTAS.SOLICITACOES);
  revalidatePath(ROTAS.MEUS_ANUNCIOS);
  revalidatePath(ROTAS.ANUNCIO_DETALHE(resultado.anuncio_id));
  redirect(ROTAS.NEGOCIACAO(resultado.negociacao_id));
}

// ---------------------------------------------------------------------------
// recusar_solicitacao
// Fase 5 — Matriz Operacional, seção 6
// Regras:
//   - apenas a empresa autora do anúncio pode recusar
//   - solicitação pendente → recusada
// ---------------------------------------------------------------------------
export async function recusarSolicitacao(
  _estado: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const supabase = await getSupabaseServerClient();
  const sessao = await getSessao();

  if (!sessao?.empresa_id) return { ok: false, erro: "Sessão inválida." };

  const solicitacaoId = String(formData.get("solicitacao_id") ?? "");
  if (!solicitacaoId) return { ok: false, erro: "Solicitação não identificada." };

  const { data: sol } = await supabase
    .from("solicitacoes")
    .select(`id, status, anuncios ( empresa_id )`)
    .eq("id", solicitacaoId)
    .single();

  if (!sol) return { ok: false, erro: "Solicitação não encontrada." };
  if (sol.status !== "pendente") return { ok: false, erro: "Solicitação não está mais pendente." };

  const anuncio = Array.isArray(sol.anuncios) ? sol.anuncios[0] : sol.anuncios as unknown as { empresa_id: string };
  if (!anuncio || anuncio.empresa_id !== sessao.empresa_id)
    return { ok: false, erro: "Sem permissão para recusar esta solicitação." };

  const agora = new Date().toISOString();
  const { error } = await supabase
    .from("solicitacoes")
    .update({ status: "recusada", recusada_em: agora, atualizada_em: agora })
    .eq("id", solicitacaoId);

  if (error) return { ok: false, erro: "Erro ao recusar solicitação." };

  revalidatePath(ROTAS.SOLICITACOES);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// cancelar_solicitacao
// Fase 5 — Matriz Operacional, seção 6
// Regras:
//   - apenas a empresa solicitante pode cancelar
//   - apenas dentro da janela de 15 minutos (prazo_cancelamento_em)
//   - solicitação deve estar pendente
// ---------------------------------------------------------------------------
export async function cancelarSolicitacao(
  _estado: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const supabase = await getSupabaseServerClient();
  const sessao = await getSessao();

  if (!sessao?.empresa_id) return { ok: false, erro: "Sessão inválida." };

  const solicitacaoId = String(formData.get("solicitacao_id") ?? "");
  if (!solicitacaoId) return { ok: false, erro: "Solicitação não identificada." };

  const { data: sol } = await supabase
    .from("solicitacoes")
    .select("id, status, empresa_solicitante_id, prazo_cancelamento_em")
    .eq("id", solicitacaoId)
    .single();

  if (!sol) return { ok: false, erro: "Solicitação não encontrada." };
  if (sol.empresa_solicitante_id !== sessao.empresa_id)
    return { ok: false, erro: "Sem permissão para cancelar esta solicitação." };
  if (sol.status !== "pendente")
    return { ok: false, erro: "Apenas solicitações pendentes podem ser canceladas." };

  const agora = new Date();
  const prazo = new Date(sol.prazo_cancelamento_em);
  if (agora > prazo)
    return { ok: false, erro: "O prazo de cancelamento de 15 minutos já expirou." };

  const { error } = await supabase
    .from("solicitacoes")
    .update({
      status: "cancelada",
      cancelada_em: agora.toISOString(),
      atualizada_em: agora.toISOString(),
    })
    .eq("id", solicitacaoId);

  if (error) return { ok: false, erro: "Erro ao cancelar solicitação." };

  revalidatePath(ROTAS.SOLICITACOES);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Consultas para a tela de solicitações
// ---------------------------------------------------------------------------

export async function listarSolicitacoesEnviadas() {
  const supabase = await getSupabaseServerClient();
  const sessao = await getSessao();
  if (!sessao?.empresa_id) return [];

  const { data } = await supabase
    .from("solicitacoes")
    .select(
      `id, status, valor_solicitado, parcial, meio_pagamento, local_troca,
       criada_em, prazo_cancelamento_em,
       anuncios ( id, tipo, empresas ( id, razao_social ) ),
       negociacoes ( id )`,
    )
    .eq("empresa_solicitante_id", sessao.empresa_id)
    .order("criada_em", { ascending: false });

  return data ?? [];
}

export async function listarSolicitacoesRecebidas() {
  const supabase = await getSupabaseServerClient();
  const sessao = await getSessao();
  if (!sessao?.empresa_id) return [];

  // Busca anúncios da empresa para depois buscar solicitações vinculadas
  const { data: anuncioIds } = await supabase
    .from("anuncios")
    .select("id")
    .eq("empresa_id", sessao.empresa_id);

  if (!anuncioIds?.length) return [];

  const ids = anuncioIds.map((a) => a.id);

  const { data } = await supabase
    .from("solicitacoes")
    .select(
      `id, status, valor_solicitado, parcial, meio_pagamento, local_troca,
       criada_em,
       anuncios ( id, tipo ),
       empresas:empresa_solicitante_id ( id, razao_social ),
       negociacoes ( id )`,
    )
    .in("anuncio_id", ids)
    .order("criada_em", { ascending: false });

  return data ?? [];
}
