"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSessao } from "@/lib/sessao";
import { ROTAS } from "@/constants/rotas";
import { isAdmin } from "@/constants/papeis";
import { recalcularStatusAnuncio } from "@/modules/anuncios/actions";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type StatusNegociacao =
  | "em_andamento"
  | "operacao_encerrada"
  | "finalizada"
  | "cancelada";

export type StatusModeracaoNegociacao =
  | "nao_acionada"
  | "acionada"
  | "em_acompanhamento"
  | "encerrada";

export type TipoAtorMensagem =
  | "usuario_empresa"
  | "usuario_admin"
  | "usuario_moderador"
  | "usuario_admin_moderador";

export type ResultadoAcao =
  | { ok: true }
  | { ok: false; erro: string };

export interface NegociacaoHistoricoResumo {
  id: string;
  status: StatusNegociacao;
  status_moderacao: StatusModeracaoNegociacao;
  valor_negociado: number;
  meio_pagamento: string;
  local_troca: string;
  criada_em: string;
  operacao_encerrada_em: string | null;
  finalizada_em: string | null;
  anuncio: { id: string; tipo: string } | null;
  empresa_autora: { id: string; slug_publico: string | null; razao_social: string } | null;
  empresa_contraparte: { id: string; slug_publico: string | null; razao_social: string } | null;
}

async function registrarMensagemSistemaNegociacao(
  negociacaoId: string,
  atorUsuarioId: string,
  tipoAtor: TipoAtorMensagem,
  textoMensagem: string,
) {
  const supabase = await getSupabaseServerClient();

  return supabase.from("mensagens_negociacao").insert({
    negociacao_id: negociacaoId,
    ator_usuario_id: atorUsuarioId,
    tipo_ator: tipoAtor,
    texto_mensagem: textoMensagem,
  });
}

// ---------------------------------------------------------------------------
// Helper — verifica se o usuário participa da negociação
// ---------------------------------------------------------------------------
async function verificarParticipante(negociacaoId: string) {
  const supabase = await getSupabaseServerClient();
  const sessao = await getSessao();
  if (!sessao?.empresa_id) return { ok: false as const, erro: "Sessão inválida." };

  const { data: neg } = await supabase
    .from("negociacoes")
    .select(
      `id, status, status_moderacao,
       empresa_autora_id, empresa_contraparte_id,
       valor_negociado, meio_pagamento, local_troca,
       anuncio_id,
       anuncios ( tipo ),
       empresa_autora:empresas!negociacoes_empresa_autora_id_fkey ( id, razao_social ),
       empresa_contraparte:empresas!negociacoes_empresa_contraparte_id_fkey ( id, razao_social ),
       solicitacao_id`,
    )
    .eq("id", negociacaoId)
    .single();

  if (!neg) return { ok: false as const, erro: "Negociação não encontrada." };

  const participa =
    neg.empresa_autora_id === sessao.empresa_id ||
    neg.empresa_contraparte_id === sessao.empresa_id;

  if (!participa) return { ok: false as const, erro: "Sem permissão para acessar esta negociação." };

  return { ok: true as const, neg, sessao };
}

async function verificarAcessoChat(negociacaoId: string) {
  const supabase = await getSupabaseServerClient();
  const sessao = await getSessao();
  if (!sessao) return { ok: false as const, erro: "Sessão inválida." };

  const { data: neg } = await supabase
    .from("negociacoes")
    .select(
      `id, status, status_moderacao,
       empresa_autora_id, empresa_contraparte_id,
       valor_negociado, meio_pagamento, local_troca,
       anuncio_id,
       anuncios ( tipo ),
       solicitacao_id`,
    )
    .eq("id", negociacaoId)
    .single();

  if (!neg) return { ok: false as const, erro: "Negociação não encontrada." };

  const participa =
    sessao.empresa_id === neg.empresa_autora_id ||
    sessao.empresa_id === neg.empresa_contraparte_id;

  if (!participa && !isAdmin(sessao.papel)) {
    return { ok: false as const, erro: "Sem permissão para acessar esta negociação." };
  }

  return { ok: true as const, neg, sessao };
}

// ---------------------------------------------------------------------------
// enviar_mensagem_negociacao
// Fase 5 — Matriz Operacional, seção 6
// Regras:
//   - chat só existe dentro da negociação (Fase 5, 6.2)
//   - mensagem associada ao usuario_id, não ao empresa_id
//   - tipo_ator derivado do papel do usuário
// ---------------------------------------------------------------------------
export async function enviarMensagem(
  _estado: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const negociacaoId = String(formData.get("negociacao_id") ?? "");
  const texto = String(formData.get("texto_mensagem") ?? "").trim();

  if (!texto) return { ok: false, erro: "Mensagem não pode ser vazia." };
  if (texto.length > 2000) return { ok: false, erro: "Mensagem muito longa (máximo 2000 caracteres)." };

  const resultado = await verificarAcessoChat(negociacaoId);
  if (!resultado.ok) return { ok: false, erro: resultado.erro };

  const { neg, sessao } = resultado;
  let iniciouAcompanhamento = false;

  if (neg.status !== "em_andamento" && neg.status !== "operacao_encerrada") {
    return { ok: false, erro: "Não é possível enviar mensagens nesta negociação." };
  }

  const supabase = await getSupabaseServerClient();

  if (isAdmin(sessao.papel) && neg.status_moderacao === "acionada") {
    const { data: moderacaoAtualizada, error: erroModeracao } = await supabase
      .from("negociacoes")
      .update({ status_moderacao: "em_acompanhamento", atualizada_em: new Date().toISOString() })
      .eq("id", negociacaoId)
      .eq("status_moderacao", "acionada")
      .select("id")
      .maybeSingle();

    if (erroModeracao) {
      return { ok: false, erro: "Erro ao iniciar o acompanhamento da moderação." };
    }
    if (!moderacaoAtualizada) {
      return { ok: false, erro: "A moderação já foi alterada. Atualize a tela e tente novamente." };
    }

    iniciouAcompanhamento = true;
  }

  if (iniciouAcompanhamento) {
    const { error: erroMensagemSistema } = await registrarMensagemSistemaNegociacao(
      negociacaoId,
      sessao.id,
      sessao.papel as TipoAtorMensagem,
      "A moderação entrou na negociação e iniciou o acompanhamento no chat.",
    );

    if (erroMensagemSistema) {
      return { ok: false, erro: "Erro ao registrar entrada da moderação no chat." };
    }
  }

  const { error } = await supabase.from("mensagens_negociacao").insert({
    negociacao_id: negociacaoId,
    tipo_ator: sessao.papel as TipoAtorMensagem,
    ator_usuario_id: sessao.id,
    texto_mensagem: texto,
  });

  if (error) return { ok: false, erro: "Erro ao enviar mensagem." };

  revalidatePath(ROTAS.NEGOCIACAO(negociacaoId));

  if (isAdmin(sessao.papel)) {
    revalidatePath(ROTAS.ADMIN);
    revalidatePath(ROTAS.ADMIN_MODERACAO_NEGOCIACOES);
  }

  return { ok: true };
}

// ---------------------------------------------------------------------------
// chamar_moderador
// Fase 5 — Matriz Operacional, seção 6
// Regras:
//   - mediação ocorre no mesmo chat (Fase 5, 6.3)
//   - não abre ticket — reflete por status_moderacao
//   - status: nao_acionada → acionada
// ---------------------------------------------------------------------------
export async function chamarModerador(
  _estado: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const negociacaoId = String(formData.get("negociacao_id") ?? "");

  const resultado = await verificarParticipante(negociacaoId);
  if (!resultado.ok) return { ok: false, erro: resultado.erro };

  const { neg } = resultado;

  if (neg.status !== "em_andamento") {
    return { ok: false, erro: "Moderação só pode ser chamada em negociações em andamento." };
  }
  if (neg.status_moderacao !== "nao_acionada") {
    return { ok: false, erro: "Moderação já foi acionada para esta negociação." };
  }

  const supabase = await getSupabaseServerClient();

  const { data: negociacaoAtualizada, error } = await supabase
    .from("negociacoes")
    .update({ status_moderacao: "acionada", atualizada_em: new Date().toISOString() })
    .eq("id", negociacaoId)
    .select("id")
    .maybeSingle();

  if (error) return { ok: false, erro: "Erro ao acionar moderação." };
  if (!negociacaoAtualizada) {
    return { ok: false, erro: "A negociação não pôde ser atualizada. Atualize a tela e tente novamente." };
  }

  const { error: erroMensagemSistema } = await registrarMensagemSistemaNegociacao(
    negociacaoId,
    resultado.sessao.id,
    resultado.sessao.papel as TipoAtorMensagem,
    "A empresa solicitou apoio da moderação nesta negociação.",
  );

  if (erroMensagemSistema) {
    return { ok: false, erro: "Erro ao registrar o chamado da moderação no chat." };
  }

  revalidatePath(ROTAS.NEGOCIACAO(negociacaoId));
  revalidatePath(ROTAS.ADMIN);
  revalidatePath(ROTAS.ADMIN_MODERACAO_NEGOCIACOES);
  return { ok: true };
}

export async function encerrarModeracaoNegociacao(
  _estado: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const negociacaoId = String(formData.get("negociacao_id") ?? "");
  const sessao = await getSessao();

  if (!sessao || !isAdmin(sessao.papel)) {
    return { ok: false, erro: "Acesso negado." };
  }

  if (!negociacaoId) {
    return { ok: false, erro: "Negociação não identificada." };
  }

  const supabase = await getSupabaseServerClient();
  const { data: neg } = await supabase
    .from("negociacoes")
    .select("id, status_moderacao")
    .eq("id", negociacaoId)
    .maybeSingle();

  if (!neg) {
    return { ok: false, erro: "Negociação não encontrada." };
  }

  if (neg.status_moderacao === "nao_acionada") {
    return { ok: false, erro: "Esta negociação não possui moderação ativa." };
  }

  if (neg.status_moderacao === "encerrada") {
    return { ok: false, erro: "A moderação desta negociação já foi encerrada." };
  }

  if (neg.status_moderacao !== "em_acompanhamento") {
    return {
      ok: false,
      erro: "A moderação só pode ser encerrada após o acompanhamento ser iniciado no chat.",
    };
  }

  const { data: negociacaoAtualizada, error } = await supabase
    .from("negociacoes")
    .update({ status_moderacao: "encerrada", atualizada_em: new Date().toISOString() })
    .eq("id", negociacaoId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { ok: false, erro: "Erro ao encerrar moderação da negociação." };
  }
  if (!negociacaoAtualizada) {
    return { ok: false, erro: "A moderação não pôde ser encerrada. Atualize a tela e tente novamente." };
  }

  const { error: erroMensagemSistema } = await registrarMensagemSistemaNegociacao(
    negociacaoId,
    sessao.id,
    sessao.papel as TipoAtorMensagem,
    "A moderação encerrou o acompanhamento desta negociação.",
  );

  if (erroMensagemSistema) {
    return { ok: false, erro: "Erro ao registrar encerramento da moderação no chat." };
  }

  revalidatePath(ROTAS.NEGOCIACAO(negociacaoId));
  revalidatePath(ROTAS.ADMIN);
  revalidatePath(ROTAS.ADMIN_MODERACAO_NEGOCIACOES);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// encerrar_operacao_negociacao
// Fase 5 — Matriz Operacional, seção 6
// Regras:
//   - encerramento operacional pode ocorrer antes da finalização completa
//   - status: em_andamento → operacao_encerrada
//   - ambas as partes podem encerrar
// ---------------------------------------------------------------------------
export async function encerrarOperacaoNegociacao(
  _estado: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const negociacaoId = String(formData.get("negociacao_id") ?? "");

  const resultado = await verificarParticipante(negociacaoId);
  if (!resultado.ok) return { ok: false, erro: resultado.erro };

  const { neg } = resultado;

  if (neg.status !== "em_andamento") {
    return { ok: false, erro: "Apenas negociações em andamento podem ser encerradas." };
  }

  const supabase = await getSupabaseServerClient();
  const agora = new Date().toISOString();

  const { data: negociacaoAtualizada, error } = await supabase
    .from("negociacoes")
    .update({
      status: "operacao_encerrada",
      operacao_encerrada_em: agora,
      atualizada_em: agora,
    })
    .eq("id", negociacaoId)
    .select("id")
    .maybeSingle();

  if (error) return { ok: false, erro: "Erro ao encerrar negociação." };
  if (!negociacaoAtualizada) {
    return { ok: false, erro: "A negociação não pôde ser encerrada. Atualize a tela e tente novamente." };
  }

  const { error: erroMensagemSistema } = await registrarMensagemSistemaNegociacao(
    negociacaoId,
    resultado.sessao.id,
    resultado.sessao.papel as TipoAtorMensagem,
    "A operação foi marcada como concluída. O chat permanecerá aberto até a avaliação.",
  );

  if (erroMensagemSistema) {
    return { ok: false, erro: "Erro ao registrar o encerramento da operação no chat." };
  }

  revalidatePath(ROTAS.NEGOCIACAO(negociacaoId));
  return { ok: true };
}

// ---------------------------------------------------------------------------
// enviar_avaliacao
// Fase 5 — Matriz Operacional, seção 6
// Regras:
//   - avaliação só após encerramento operacional (Fase 5, 7.1)
//   - nota obrigatória (1–5), comentário opcional
//   - nota entra na reputação imediatamente (Fase 5, 7.4)
//   - comentário nasce como pendente_moderacao se existir (Fase 5, 7.3)
//   - 1 avaliação por empresa por negociação (constraint UNIQUE no banco)
// ---------------------------------------------------------------------------
export async function enviarAvaliacao(
  _estado: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const negociacaoId = String(formData.get("negociacao_id") ?? "");
  const nota = parseInt(String(formData.get("nota") ?? "0"), 10);
  const comentario = String(formData.get("texto_comentario") ?? "").trim();

  if (!nota || nota < 1 || nota > 5) {
    return { ok: false, erro: "Nota deve ser entre 1 e 5." };
  }

  const resultado = await verificarParticipante(negociacaoId);
  if (!resultado.ok) return { ok: false, erro: resultado.erro };

  const { neg, sessao } = resultado;

  if (neg.status !== "operacao_encerrada" && neg.status !== "finalizada") {
    return {
      ok: false,
      erro: "A avaliação só pode ser enviada após o encerramento operacional.",
    };
  }

  const empresaAutoraRaw = (neg as unknown as {
    empresa_autora?: { id: string; razao_social: string }[] | { id: string; razao_social: string } | null;
  }).empresa_autora;
  const empresaContraparteRaw = (neg as unknown as {
    empresa_contraparte?: { id: string; razao_social: string }[] | { id: string; razao_social: string } | null;
  }).empresa_contraparte;

  const empresaAutora = Array.isArray(empresaAutoraRaw)
    ? empresaAutoraRaw[0] ?? null
    : empresaAutoraRaw ?? null;

  const empresaContraparte = Array.isArray(empresaContraparteRaw)
    ? empresaContraparteRaw[0] ?? null
    : empresaContraparteRaw ?? null;

  const nomeEmpresaAvaliadora = sessao.empresa_id === neg.empresa_autora_id
    ? (empresaAutora?.razao_social ?? "A empresa anunciante")
    : (empresaContraparte?.razao_social ?? "A empresa solicitante");

  // Empresa avaliada = a contraparte
  const empresaAvaliada =
    sessao.empresa_id === neg.empresa_autora_id
      ? neg.empresa_contraparte_id
      : neg.empresa_autora_id;

  const supabase = await getSupabaseServerClient();
  const agora = new Date().toISOString();

  const statusComentario = comentario ? "pendente_moderacao" : null;

  const { error } = await supabase.from("avaliacoes").insert({
    negociacao_id: negociacaoId,
    empresa_avaliadora_id: sessao.empresa_id as string,
    empresa_avaliada_id: empresaAvaliada,
    nota,
    texto_comentario: comentario || null,
    status_comentario: statusComentario,
    criada_em: agora,
    atualizada_em: agora,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, erro: "Você já avaliou esta negociação." };
    }
    return { ok: false, erro: "Erro ao enviar avaliação." };
  }

  await registrarMensagemSistemaNegociacao(
    negociacaoId,
    sessao.id,
    sessao.papel as TipoAtorMensagem,
    `${nomeEmpresaAvaliadora} registrou a avaliação desta negociação.`,
  );

  if (neg.status !== "finalizada") {
    await supabase
      .from("negociacoes")
      .update({
        status: "finalizada",
        finalizada_em: agora,
        status_moderacao:
          neg.status_moderacao !== "nao_acionada" ? "encerrada" : neg.status_moderacao,
        atualizada_em: agora,
      })
      .eq("id", negociacaoId);

    await registrarMensagemSistemaNegociacao(
      negociacaoId,
      sessao.id,
      sessao.papel as TipoAtorMensagem,
      "A negociação foi concluída. O chat agora está somente para leitura.",
    );

    await recalcularStatusAnuncio(neg.anuncio_id, agora);
  }

  revalidatePath(ROTAS.NEGOCIACAO(negociacaoId));
  revalidatePath(ROTAS.MEUS_ANUNCIOS);
  revalidatePath(ROTAS.ANUNCIOS);
  revalidatePath(ROTAS.ANUNCIO_DETALHE(neg.anuncio_id));
  revalidatePath(ROTAS.ADMIN);
  revalidatePath(ROTAS.ADMIN_MODERACAO_NEGOCIACOES);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Consulta completa da negociação para a tela
// ---------------------------------------------------------------------------
export async function obterNegociacao(negociacaoId: string) {
  const sessao = await getSessao();
  const supabase = getSupabaseAdminClient();

  const { data: neg, error } = await supabase
    .from("negociacoes")
    .select(
      `id, status, status_moderacao, valor_negociado, meio_pagamento, local_troca,
       operacao_encerrada_em, finalizada_em, criada_em,
       empresa_autora_id, empresa_contraparte_id,
       anuncio_id,
       anuncios ( id, tipo ),
       empresa_autora:empresas!negociacoes_empresa_autora_id_fkey ( id, slug_publico, razao_social ),
       empresa_contraparte:empresas!negociacoes_empresa_contraparte_id_fkey ( id, slug_publico, razao_social ),
       mensagens_negociacao (
         id, texto_mensagem, tipo_ator, criada_em,
         usuarios:ator_usuario_id ( id, nome_completo, empresa_id )
       ),
       avaliacoes ( id, empresa_avaliadora_id, nota, texto_comentario, status_comentario )`,
    )
    .eq("id", negociacaoId)
    .single();

  return { neg, sessao, error };
}

export async function listarNegociacoesDaEmpresa(): Promise<{
  negociacoes: NegociacaoHistoricoResumo[];
  error: string | null;
}> {
  const sessao = await getSessao();
  if (!sessao?.empresa_id) {
    return { negociacoes: [], error: "Sessão inválida." };
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("negociacoes")
    .select(
      `id, status, status_moderacao, valor_negociado, meio_pagamento, local_troca,
       criada_em, operacao_encerrada_em, finalizada_em,
       anuncios ( id, tipo ),
       empresa_autora:empresas!negociacoes_empresa_autora_id_fkey ( id, slug_publico, razao_social ),
       empresa_contraparte:empresas!negociacoes_empresa_contraparte_id_fkey ( id, slug_publico, razao_social )`,
    )
    .or(`empresa_autora_id.eq.${sessao.empresa_id},empresa_contraparte_id.eq.${sessao.empresa_id}`)
    .order("criada_em", { ascending: false });

  if (error) {
    return { negociacoes: [], error: "Erro ao carregar histórico de negociações." };
  }

  return {
    negociacoes: (data ?? []).map((negociacao) => ({
      id: negociacao.id,
      status: negociacao.status as StatusNegociacao,
      status_moderacao: negociacao.status_moderacao as StatusModeracaoNegociacao,
      valor_negociado: negociacao.valor_negociado,
      meio_pagamento: negociacao.meio_pagamento,
      local_troca: negociacao.local_troca,
      criada_em: negociacao.criada_em,
      operacao_encerrada_em: negociacao.operacao_encerrada_em,
      finalizada_em: negociacao.finalizada_em,
      anuncio: Array.isArray(negociacao.anuncios) ? negociacao.anuncios[0] ?? null : negociacao.anuncios,
      empresa_autora: Array.isArray(negociacao.empresa_autora)
        ? negociacao.empresa_autora[0] ?? null
        : negociacao.empresa_autora,
      empresa_contraparte: Array.isArray(negociacao.empresa_contraparte)
        ? negociacao.empresa_contraparte[0] ?? null
        : negociacao.empresa_contraparte,
    })),
    error: null,
  };
}
