"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSessao } from "@/lib/sessao";
import { isAdmin, type PapelUsuario } from "@/constants/papeis";
import { ROTAS } from "@/constants/rotas";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
export interface ResultadoAcao {
  ok: boolean;
  erro?: string;
}

type TipoOrigemTicket = "perfil_empresa" | "administrativo" | "outro_contexto";

// ---------------------------------------------------------------------------
// abrirTicket — ação do usuário empresa para abrir denúncia/ticket
// ---------------------------------------------------------------------------
export async function abrirTicket(
  _state: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const supabase = await getSupabaseServerClient();
  const sessao = await getSessao();
  if (!sessao?.empresa_id) return { ok: false, erro: "Sessão inválida." };

  const assunto = (formData.get("assunto") as string)?.trim();
  const descricao = (formData.get("descricao") as string)?.trim();
  const tipoOrigemInformado = (formData.get("tipo_origem") as string) || "perfil_empresa";
  const tipo_origem: TipoOrigemTicket = ["perfil_empresa", "administrativo", "outro_contexto"].includes(tipoOrigemInformado)
    ? (tipoOrigemInformado as TipoOrigemTicket)
    : "perfil_empresa";
  const origem_id = (formData.get("origem_id") as string)?.trim();

  if (!assunto) return { ok: false, erro: "Informe o assunto." };
  if (assunto.length > 200) return { ok: false, erro: "Assunto deve ter no máximo 200 caracteres." };
  if (!descricao) return { ok: false, erro: "Descreva o problema." };
  if (descricao.length > 3000) return { ok: false, erro: "Descrição deve ter no máximo 3000 caracteres." };
  if (!origem_id) return { ok: false, erro: "Referência inválida." };

  const { data: resultadoAbertura, error } = await supabase.rpc("abrir_ticket_atomico", {
    p_tipo_origem: tipo_origem,
    p_origem_id: origem_id,
    p_assunto: assunto,
    p_descricao: descricao,
  });

  const ticketCriado = Array.isArray(resultadoAbertura) ? resultadoAbertura[0] : resultadoAbertura;

  if (error || !ticketCriado?.ticket_id) {
    return { ok: false, erro: error?.message ?? "Erro ao abrir ticket." };
  }

  revalidatePath(ROTAS.TICKETS);
  revalidatePath(ROTAS.ADMIN_TICKETS);
  return { ok: true };
}


export interface TicketResumo {
  id: string;
  tipo_origem: string;
  origem_id: string;
  assunto: string | null;
  descricao: string | null;
  status: string;
  aberto_em: string;
  encerrado_em: string | null;
  resumo_resolucao: string | null;
  empresa_origem: { razao_social: string } | null;
  eventos: TicketEvento[];
  empresa_pode_responder?: boolean;
}

export interface TicketEvento {
  id: string;
  tipo_evento: string;
  corpo_evento: string | null;
  criado_em: string;
  ator: { nome_completo: string; papel: string } | null;
}

export interface AvaliacaoPendente {
  id: string;
  nota: number;
  texto_comentario: string;
  status_comentario: string;
  criada_em: string;
  empresa_avaliadora: { id: string; razao_social: string } | null;
  empresa_avaliada: { id: string; razao_social: string } | null;
  negociacao_id: string;
}

export interface NegociacaoModeracaoResumo {
  id: string;
  status: string;
  status_moderacao: string;
  valor_negociado: number;
  meio_pagamento: string;
  local_troca: string;
  criada_em: string;
  empresa_autora: { id: string; razao_social: string } | null;
  empresa_contraparte: { id: string; razao_social: string } | null;
}

async function registrarEventoTicket(
  ticketId: string,
  atorUsuarioId: string,
  tipoEvento: string,
  corpoEvento?: string | null,
) {
  const supabase = await getSupabaseServerClient();

  return supabase.from("eventos_ticket_moderacao").insert({
    ticket_moderacao_id: ticketId,
    ator_usuario_id: atorUsuarioId,
    tipo_evento: tipoEvento,
    corpo_evento: corpoEvento ?? null,
  });
}

// ---------------------------------------------------------------------------
// listarTickets
// ---------------------------------------------------------------------------
export async function listarTickets(status?: string): Promise<{
  tickets: TicketResumo[];
  error: string | null;
}> {
  const sessao = await getSessao();
  if (!sessao || !isAdmin(sessao.papel)) {
    return { tickets: [], error: "Acesso negado." };
  }

  const supabase = await getSupabaseServerClient();

  let query = supabase
    .from("tickets_moderacao")
    .select(
      "id, tipo_origem, origem_id, assunto, descricao, status, aberto_em, encerrado_em, resumo_resolucao, aberto_por_empresa_id",
    )
    .order("aberto_em", { ascending: true });

  if (status) {
    query = query.eq("status", status);
  }

  const { data: tickets, error } = await query.limit(100);

  if (error) return { tickets: [], error: error.message };

  const ticketIds = (tickets ?? []).map((ticket) => ticket.id);

  const { data: eventos } = ticketIds.length
    ? await supabase
        .from("eventos_ticket_moderacao")
        .select("id, ticket_moderacao_id, tipo_evento, corpo_evento, criado_em, ator_usuario_id")
        .in("ticket_moderacao_id", ticketIds)
        .order("criado_em", { ascending: true })
    : {
        data: [] as Array<{
          id: string;
          ticket_moderacao_id: string;
          tipo_evento: string;
          corpo_evento: string | null;
          criado_em: string;
          ator_usuario_id: string;
        }>,
      };

  const usuarioIds = Array.from(
    new Set((eventos ?? []).map((evento) => evento.ator_usuario_id).filter(Boolean)),
  );

  const usuarios: Record<string, { nome_completo: string; papel: string }> = {};
  if (usuarioIds.length > 0) {
    const { data: usuariosData } = await supabase
      .from("usuarios")
      .select("id, nome_completo, papel")
      .in("id", usuarioIds);

    for (const usuario of usuariosData ?? []) {
      usuarios[usuario.id] = {
        nome_completo: usuario.nome_completo,
        papel: usuario.papel,
      };
    }
  }

  const eventosPorTicket = new Map<string, TicketEvento[]>();
  for (const evento of eventos ?? []) {
    const lista = eventosPorTicket.get(evento.ticket_moderacao_id) ?? [];
    lista.push({
      id: evento.id,
      tipo_evento: evento.tipo_evento,
      corpo_evento: evento.corpo_evento,
      criado_em: evento.criado_em,
      ator: usuarios[evento.ator_usuario_id] ?? null,
    });
    eventosPorTicket.set(evento.ticket_moderacao_id, lista);
  }

  // Busca nome das empresas
  const empresa_ids = (tickets ?? [])
    .map((t) => t.aberto_por_empresa_id)
    .filter(Boolean) as string[];

  const empresas: Record<string, string> = {};
  if (empresa_ids.length > 0) {
    const { data: emps } = await supabase
      .from("empresas")
      .select("id, razao_social")
      .in("id", empresa_ids);
    if (emps) {
      for (const e of emps) empresas[e.id] = e.razao_social;
    }
  }

  return {
    tickets: (tickets ?? []).map((t) => ({
      id: t.id,
      tipo_origem: t.tipo_origem,
      origem_id: t.origem_id,
      assunto: t.assunto ?? null,
      descricao: t.descricao ?? null,
      status: t.status,
      aberto_em: t.aberto_em,
      encerrado_em: t.encerrado_em ?? null,
      resumo_resolucao: t.resumo_resolucao ?? null,
      empresa_origem: t.aberto_por_empresa_id
        ? { razao_social: empresas[t.aberto_por_empresa_id] ?? "—" }
        : null,
      eventos: eventosPorTicket.get(t.id) ?? [],
    })),
    error: null,
  };
}

export async function listarTicketsDaEmpresa(): Promise<{
  tickets: TicketResumo[];
  error: string | null;
}> {
  const sessao = await getSessao();
  if (!sessao?.empresa_id) {
    return { tickets: [], error: "Sessão inválida." };
  }

  const supabase = await getSupabaseServerClient();
  const { data: tickets, error } = await supabase
    .from("tickets_moderacao")
    .select(
      "id, tipo_origem, origem_id, assunto, descricao, status, aberto_em, encerrado_em, resumo_resolucao, aberto_por_empresa_id",
    )
    .eq("aberto_por_empresa_id", sessao.empresa_id)
    .order("aberto_em", { ascending: false })
    .limit(100);

  if (error) return { tickets: [], error: error.message };

  const ticketIds = (tickets ?? []).map((ticket) => ticket.id);
  const { data: eventos } = ticketIds.length
    ? await supabase
        .from("eventos_ticket_moderacao")
        .select("id, ticket_moderacao_id, tipo_evento, corpo_evento, criado_em, ator_usuario_id")
        .in("ticket_moderacao_id", ticketIds)
        .order("criado_em", { ascending: true })
    : {
        data: [] as Array<{
          id: string;
          ticket_moderacao_id: string;
          tipo_evento: string;
          corpo_evento: string | null;
          criado_em: string;
          ator_usuario_id: string;
        }>,
      };

  const usuarioIds = Array.from(
    new Set((eventos ?? []).map((evento) => evento.ator_usuario_id).filter(Boolean)),
  );
  const usuarios: Record<string, { nome_completo: string; papel: string }> = {};

  if (usuarioIds.length > 0) {
    const { data: usuariosData } = await supabase
      .from("usuarios")
      .select("id, nome_completo, papel")
      .in("id", usuarioIds);

    for (const usuario of usuariosData ?? []) {
      usuarios[usuario.id] = {
        nome_completo: usuario.nome_completo,
        papel: usuario.papel,
      };
    }
  }

  const eventosPorTicket = new Map<string, TicketEvento[]>();
  for (const evento of eventos ?? []) {
    const lista = eventosPorTicket.get(evento.ticket_moderacao_id) ?? [];
    lista.push({
      id: evento.id,
      tipo_evento: evento.tipo_evento,
      corpo_evento: evento.corpo_evento,
      criado_em: evento.criado_em,
      ator: usuarios[evento.ator_usuario_id] ?? null,
    });
    eventosPorTicket.set(evento.ticket_moderacao_id, lista);
  }

  return {
    tickets: (tickets ?? []).map((t) => {
      const eventosTicket = eventosPorTicket.get(t.id) ?? [];
      const ultimoEvento = eventosTicket.at(-1) ?? null;
      const ultimaInteracaoFoiDaModeração =
        ultimoEvento?.tipo_evento === "mensagem" &&
        !!ultimoEvento.ator &&
        isAdmin(ultimoEvento.ator.papel as Parameters<typeof isAdmin>[0]);

      return {
        id: t.id,
        tipo_origem: t.tipo_origem,
        origem_id: t.origem_id,
        assunto: t.assunto ?? null,
        descricao: t.descricao ?? null,
        status: t.status,
        aberto_em: t.aberto_em,
        encerrado_em: t.encerrado_em ?? null,
        resumo_resolucao: t.resumo_resolucao ?? null,
        empresa_origem: null,
        eventos: eventosTicket,
        empresa_pode_responder: t.status !== "encerrado" && ultimaInteracaoFoiDaModeração,
      };
    }),
    error: null,
  };
}

// ---------------------------------------------------------------------------
// encerrarTicket
// ---------------------------------------------------------------------------
export async function encerrarTicket(
  _state: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const sessao = await getSessao();
  if (!sessao || !isAdmin(sessao.papel)) return { ok: false, erro: "Acesso negado." };

  const ticket_id = formData.get("ticket_id") as string;
  const resumo_resolucao = (formData.get("resumo_resolucao") as string)?.trim();

  if (!ticket_id) return { ok: false, erro: "ID do ticket inválido." };
  if (!resumo_resolucao) return { ok: false, erro: "Informe a resolução antes de encerrar." };

  const supabase = await getSupabaseServerClient();

  const { data: ticketAtualizado, error } = await supabase
    .from("tickets_moderacao")
    .update({
      status: "encerrado",
      resumo_resolucao,
      encerrado_em: new Date().toISOString(),
    })
    .eq("id", ticket_id)
    .neq("status", "encerrado")
    .select("id")
    .maybeSingle();

  if (error) return { ok: false, erro: error.message };
  if (!ticketAtualizado) {
    return { ok: false, erro: "O ticket não pôde ser encerrado. Atualize a tela e tente novamente." };
  }

  await registrarEventoTicket(ticket_id, sessao.id, "encerramento", resumo_resolucao);

  revalidatePath(ROTAS.ADMIN_TICKETS);
  return { ok: true };
}

export async function registrarMensagemTicket(
  _state: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const sessao = await getSessao();
  if (!sessao) return { ok: false, erro: "Acesso negado." };

  const ticket_id = formData.get("ticket_id") as string;
  const mensagem = (formData.get("mensagem") as string)?.trim();

  if (!ticket_id) return { ok: false, erro: "ID do ticket inválido." };
  if (!mensagem) return { ok: false, erro: "Informe a mensagem do histórico." };

  const supabase = await getSupabaseServerClient();
  const { data: ticket, error: ticketError } = await supabase
    .from("tickets_moderacao")
    .select("id, status, aberto_por_empresa_id")
    .eq("id", ticket_id)
    .maybeSingle();

  if (ticketError || !ticket) return { ok: false, erro: "Ticket não encontrado." };
  const podeResponder =
    isAdmin(sessao.papel) ||
    (!!sessao.empresa_id && ticket.aberto_por_empresa_id === sessao.empresa_id);

  if (!podeResponder) {
    return { ok: false, erro: "Sem permissão para responder este ticket." };
  }

  if (ticket.status === "encerrado") {
    return { ok: false, erro: "Não é possível registrar mensagens em ticket encerrado." };
  }

  if (!isAdmin(sessao.papel)) {
    const { data: eventos, error: eventosError } = await supabase
      .from("eventos_ticket_moderacao")
      .select("tipo_evento, ator_usuario_id, usuarios:ator_usuario_id ( papel )")
      .eq("ticket_moderacao_id", ticket_id)
      .order("criado_em", { ascending: false })
      .limit(1);

    if (eventosError) {
      return { ok: false, erro: "Erro ao validar permissão de resposta do ticket." };
    }

    const ultimoEvento = Array.isArray(eventos) ? eventos[0] : null;
    const usuariosRelacionados = ultimoEvento?.usuarios;
    const ultimoAtor = Array.isArray(usuariosRelacionados)
      ? usuariosRelacionados[0]
      : usuariosRelacionados;
    const papelUltimoAtor =
      typeof ultimoAtor?.papel === "string" ? (ultimoAtor.papel as PapelUsuario) : null;
    const adminSolicitouMaisInfo =
      ultimoEvento?.tipo_evento === "mensagem" &&
      !!papelUltimoAtor &&
      isAdmin(papelUltimoAtor);

    if (!adminSolicitouMaisInfo) {
      return {
        ok: false,
        erro: "A resposta fica liberada quando a moderação solicitar mais informações.",
      };
    }
  }

  const { error } = await registrarEventoTicket(ticket_id, sessao.id, "mensagem", mensagem);
  if (error) return { ok: false, erro: "Erro ao registrar mensagem." };

  revalidatePath(ROTAS.ADMIN_TICKETS);
  revalidatePath(ROTAS.TICKETS);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// atualizarStatusTicket (aberto → em_analise)
// ---------------------------------------------------------------------------
export async function assumirTicket(
  _state: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const sessao = await getSessao();
  if (!sessao || !isAdmin(sessao.papel)) return { ok: false, erro: "Acesso negado." };

  const ticket_id = formData.get("ticket_id") as string;
  if (!ticket_id) return { ok: false, erro: "ID inválido." };

  const supabase = await getSupabaseServerClient();

  const { data: ticketAtualizado, error } = await supabase
    .from("tickets_moderacao")
    .update({ status: "em_analise", atribuido_para_usuario_id: sessao.id })
    .eq("id", ticket_id)
    .eq("status", "aberto")
    .select("id")
    .maybeSingle();

  if (error) return { ok: false, erro: error.message };
  if (!ticketAtualizado) {
    return { ok: false, erro: "O ticket não pôde ser assumido. Atualize a tela e tente novamente." };
  }

  await registrarEventoTicket(ticket_id, sessao.id, "assuncao", "Ticket assumido para análise.");

  revalidatePath(ROTAS.ADMIN_TICKETS);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// listarAvaliacoesPendentes
// ---------------------------------------------------------------------------
export async function listarAvaliacoesPendentes(): Promise<{
  avaliacoes: AvaliacaoPendente[];
  error: string | null;
}> {
  const sessao = await getSessao();
  if (!sessao || !isAdmin(sessao.papel)) {
    return { avaliacoes: [], error: "Acesso negado." };
  }

  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("avaliacoes")
    .select(
      "id, nota, texto_comentario, status_comentario, criada_em, empresa_avaliadora_id, empresa_avaliada_id, negociacao_id",
    )
    .eq("status_comentario", "pendente_moderacao")
    .not("texto_comentario", "is", null)
    .order("criada_em", { ascending: true })
    .limit(100);

  if (error) return { avaliacoes: [], error: error.message };

  // Busca empresas envolvidas
  const ids = new Set<string>();
  for (const a of data ?? []) {
    ids.add(a.empresa_avaliadora_id);
    ids.add(a.empresa_avaliada_id);
  }
  const empresas: Record<string, string> = {};
  if (ids.size > 0) {
    const { data: emps } = await supabase
      .from("empresas")
      .select("id, razao_social")
      .in("id", Array.from(ids));
    if (emps) {
      for (const e of emps) empresas[e.id] = e.razao_social;
    }
  }

  return {
    avaliacoes: (data ?? [])
      .filter((a) => a.texto_comentario !== null)
      .map((a) => ({
        id: a.id,
        nota: a.nota,
        texto_comentario: a.texto_comentario as string,
        status_comentario: a.status_comentario ?? "pendente_moderacao",
        criada_em: a.criada_em,
        empresa_avaliadora: {
          id: a.empresa_avaliadora_id,
          razao_social: empresas[a.empresa_avaliadora_id] ?? "—",
        },
        empresa_avaliada: {
          id: a.empresa_avaliada_id,
          razao_social: empresas[a.empresa_avaliada_id] ?? "—",
        },
        negociacao_id: a.negociacao_id,
      })),
    error: null,
  };
}

export async function listarNegociacoesModeracao(): Promise<{
  negociacoes: NegociacaoModeracaoResumo[];
  error: string | null;
}> {
  const sessao = await getSessao();
  if (!sessao || !isAdmin(sessao.papel)) {
    return { negociacoes: [], error: "Acesso negado." };
  }

  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("negociacoes")
    .select(
      "id, status, status_moderacao, valor_negociado, meio_pagamento, local_troca, criada_em, empresa_autora_id, empresa_contraparte_id",
    )
    .in("status_moderacao", ["acionada", "em_acompanhamento"])
    .order("criada_em", { ascending: false })
    .limit(100);

  if (error) return { negociacoes: [], error: error.message };

  const ids = new Set<string>();
  for (const negociacao of data ?? []) {
    ids.add(negociacao.empresa_autora_id);
    ids.add(negociacao.empresa_contraparte_id);
  }

  const empresas: Record<string, string> = {};
  if (ids.size > 0) {
    const { data: emps } = await supabase
      .from("empresas")
      .select("id, razao_social")
      .in("id", Array.from(ids));

    if (emps) {
      for (const empresa of emps) empresas[empresa.id] = empresa.razao_social;
    }
  }

  return {
    negociacoes: (data ?? []).map((negociacao) => ({
      id: negociacao.id,
      status: negociacao.status,
      status_moderacao: negociacao.status_moderacao,
      valor_negociado: negociacao.valor_negociado,
      meio_pagamento: negociacao.meio_pagamento,
      local_troca: negociacao.local_troca,
      criada_em: negociacao.criada_em,
      empresa_autora: {
        id: negociacao.empresa_autora_id,
        razao_social: empresas[negociacao.empresa_autora_id] ?? "—",
      },
      empresa_contraparte: {
        id: negociacao.empresa_contraparte_id,
        razao_social: empresas[negociacao.empresa_contraparte_id] ?? "—",
      },
    })),
    error: null,
  };
}

// ---------------------------------------------------------------------------
// aprovarComentario
// ---------------------------------------------------------------------------
export async function aprovarComentario(
  _state: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const sessao = await getSessao();
  if (!sessao || !isAdmin(sessao.papel)) return { ok: false, erro: "Acesso negado." };

  const avaliacao_id = formData.get("avaliacao_id") as string;
  if (!avaliacao_id) return { ok: false, erro: "ID inválido." };

  const supabase = await getSupabaseServerClient();

  const { data: avaliacaoAtualizada, error } = await supabase
    .from("avaliacoes")
    .update({
      status_comentario: "aprovado",
      moderado_por_usuario_id: sessao.id,
      moderado_em: new Date().toISOString(),
    })
    .eq("id", avaliacao_id)
    .eq("status_comentario", "pendente_moderacao")
    .select("id")
    .maybeSingle();

  if (error) return { ok: false, erro: error.message };
  if (!avaliacaoAtualizada) {
    return { ok: false, erro: "O comentário não pôde ser aprovado. Atualize a tela e tente novamente." };
  }

  revalidatePath(ROTAS.ADMIN_MODERACAO_AVALIACOES);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// barrarComentario
// ---------------------------------------------------------------------------
export async function barrarComentario(
  _state: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const sessao = await getSessao();
  if (!sessao || !isAdmin(sessao.papel)) return { ok: false, erro: "Acesso negado." };

  const avaliacao_id = formData.get("avaliacao_id") as string;
  const motivo_moderacao = (formData.get("motivo_moderacao") as string)?.trim();

  if (!avaliacao_id) return { ok: false, erro: "ID inválido." };

  const supabase = await getSupabaseServerClient();

  const { data: avaliacaoAtualizada, error } = await supabase
    .from("avaliacoes")
    .update({
      status_comentario: "barrado",
      motivo_moderacao: motivo_moderacao || null,
      moderado_por_usuario_id: sessao.id,
      moderado_em: new Date().toISOString(),
    })
    .eq("id", avaliacao_id)
    .eq("status_comentario", "pendente_moderacao")
    .select("id")
    .maybeSingle();

  if (error) return { ok: false, erro: error.message };
  if (!avaliacaoAtualizada) {
    return { ok: false, erro: "O comentário não pôde ser barrado. Atualize a tela e tente novamente." };
  }

  revalidatePath(ROTAS.ADMIN_MODERACAO_AVALIACOES);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// contadores para o dashboard admin
// ---------------------------------------------------------------------------
export async function obterContadoresAdmin(): Promise<{
  empresas_pendentes: number;
  tickets_abertos: number;
  comentarios_pendentes: number;
  negociacoes_moderacao: number;
}> {
  const supabase = await getSupabaseServerClient();

  const [
    { count: empresas_pendentes },
    { count: tickets_abertos },
    { count: comentarios_pendentes },
    { count: negociacoes_moderacao },
  ] = await Promise.all([
    supabase
      .from("submissoes_cadastrais")
      .select("id", { count: "exact", head: true })
      .eq("status", "em_analise"),
    supabase
      .from("tickets_moderacao")
      .select("id", { count: "exact", head: true })
      .in("status", ["aberto", "em_analise"]),
    supabase
      .from("avaliacoes")
      .select("id", { count: "exact", head: true })
      .eq("status_comentario", "pendente_moderacao"),
    supabase
      .from("negociacoes")
      .select("id", { count: "exact", head: true })
      .in("status_moderacao", ["acionada", "em_acompanhamento"]),
  ]);

  return {
    empresas_pendentes: empresas_pendentes ?? 0,
    tickets_abertos: tickets_abertos ?? 0,
    comentarios_pendentes: comentarios_pendentes ?? 0,
    negociacoes_moderacao: negociacoes_moderacao ?? 0,
  };
}
