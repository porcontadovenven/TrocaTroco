"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
export interface AnuncioPublico {
  id: string;
  tipo: "oferta" | "necessidade";
  valor_total: number;
  valor_remanescente: number;
  permite_parcial: boolean;
  rotulo_regiao: string | null;
  publicado_em: string;
}

export interface AvaliacaoPublica {
  id: string;
  nota: number;
  texto_comentario: string | null;
  comentario_publico: boolean;
  empresa_avaliadora: { razao_social: string } | null;
  criada_em: string;
}

export interface PerfilEmpresa {
  id: string;
  slug_publico: string;
  razao_social: string;
  nome_fantasia: string | null;
  cidade: string;
  estado: string;
  foto_perfil_url: string | null;
  anuncios: AnuncioPublico[];
  avaliacoes: AvaliacaoPublica[];
  media_nota: number | null;
  total_avaliacoes: number;
  total_negociacoes_concluidas: number;
}

export interface EmpresaPublicaResumo {
  id: string;
  slug_publico: string;
  razao_social: string;
  nome_fantasia: string | null;
  cidade: string;
  estado: string;
  foto_perfil_url: string | null;
  media_nota: number | null;
  total_avaliacoes: number;
  total_negociacoes_concluidas: number;
}

export async function listarEmpresasPublicas(): Promise<{
  empresas: EmpresaPublicaResumo[];
  error: string | null;
}> {
  const supabase = getSupabaseAdminClient();

  const { data: empresas, error: empresasError } = await supabase
    .from("empresas")
    .select("id, slug_publico, razao_social, nome_fantasia, cidade, estado, foto_perfil_url")
    .eq("status", "aprovada")
    .order("razao_social", { ascending: true });

  if (empresasError) {
    return { empresas: [], error: "Erro ao carregar empresas." };
  }

  const empresasAprovadas = empresas ?? [];
  if (empresasAprovadas.length === 0) {
    return { empresas: [], error: null };
  }

  const idsEmpresas = empresasAprovadas.map((empresa) => empresa.id);

  const [{ data: avaliacoes }, { data: negociacoesFinalizadas }] = await Promise.all([
    supabase
      .from("avaliacoes")
      .select("empresa_avaliada_id, nota")
      .in("empresa_avaliada_id", idsEmpresas),
    supabase
      .from("negociacoes")
      .select("empresa_autora_id, empresa_contraparte_id")
      .eq("status", "finalizada"),
  ]);

  const notasPorEmpresa = new Map<string, number[]>();
  for (const avaliacao of avaliacoes ?? []) {
    const notasAtuais = notasPorEmpresa.get(avaliacao.empresa_avaliada_id) ?? [];
    notasAtuais.push(avaliacao.nota);
    notasPorEmpresa.set(avaliacao.empresa_avaliada_id, notasAtuais);
  }

  const negociacoesPorEmpresa = new Map<string, number>();
  for (const negociacao of negociacoesFinalizadas ?? []) {
    negociacoesPorEmpresa.set(
      negociacao.empresa_autora_id,
      (negociacoesPorEmpresa.get(negociacao.empresa_autora_id) ?? 0) + 1,
    );
    negociacoesPorEmpresa.set(
      negociacao.empresa_contraparte_id,
      (negociacoesPorEmpresa.get(negociacao.empresa_contraparte_id) ?? 0) + 1,
    );
  }

  const empresasOrdenadas = empresasAprovadas
    .map((empresa) => {
      const notas = notasPorEmpresa.get(empresa.id) ?? [];
      const media = notas.length > 0
        ? Math.round((notas.reduce((soma, nota) => soma + nota, 0) / notas.length) * 10) / 10
        : null;

      return {
        id: empresa.id,
        slug_publico: empresa.slug_publico,
        razao_social: empresa.razao_social,
        nome_fantasia: empresa.nome_fantasia ?? null,
        cidade: empresa.cidade,
        estado: empresa.estado,
        foto_perfil_url: empresa.foto_perfil_url ?? null,
        media_nota: media,
        total_avaliacoes: notas.length,
        total_negociacoes_concluidas: negociacoesPorEmpresa.get(empresa.id) ?? 0,
      };
    })
    .sort((a, b) => {
      const mediaA = a.media_nota ?? -1;
      const mediaB = b.media_nota ?? -1;
      if (mediaB !== mediaA) return mediaB - mediaA;
      if (b.total_avaliacoes !== a.total_avaliacoes) return b.total_avaliacoes - a.total_avaliacoes;
      if (b.total_negociacoes_concluidas !== a.total_negociacoes_concluidas) {
        return b.total_negociacoes_concluidas - a.total_negociacoes_concluidas;
      }
      return a.razao_social.localeCompare(b.razao_social, "pt-BR");
    });

  return { empresas: empresasOrdenadas, error: null };
}

// ---------------------------------------------------------------------------
// obterPerfilEmpresa
// ---------------------------------------------------------------------------
export async function obterPerfilEmpresa(empresaIdentificador: string): Promise<{
  perfil: PerfilEmpresa | null;
  error: string | null;
}> {
  const supabase = getSupabaseAdminClient();

  // Dados da empresa
  let { data: empresa, error: errEmpresa } = await supabase
    .from("empresas")
    .select("id, slug_publico, razao_social, nome_fantasia, cidade, estado, foto_perfil_url, status")
    .eq("slug_publico", empresaIdentificador)
    .maybeSingle();

  if (!empresa) {
    const fallback = await supabase
      .from("empresas")
      .select("id, slug_publico, razao_social, nome_fantasia, cidade, estado, foto_perfil_url, status")
      .eq("id", empresaIdentificador)
      .maybeSingle();

    empresa = fallback.data;
    errEmpresa = fallback.error;
  }

  if (errEmpresa || !empresa) {
    return { perfil: null, error: "Empresa não encontrada." };
  }

  // Só exibe perfil de empresas aprovadas
  if (empresa.status !== "aprovada") {
    return { perfil: null, error: "Perfil não disponível." };
  }

  // Anúncios ativos ou em negociação
  const { data: anuncios } = await supabase
    .from("anuncios")
    .select(
      "id, tipo, valor_total, valor_remanescente, permite_parcial, rotulo_regiao, publicado_em",
    )
    .eq("empresa_id", empresa.id)
    .in("status", ["ativo", "em_negociacao"])
    .order("publicado_em", { ascending: false })
    .limit(20);

  // Todas as notas entram imediatamente na reputação pública.
  const { data: avaliacoesReputacao } = await supabase
    .from("avaliacoes")
    .select(
      "id, nota, texto_comentario, status_comentario, criada_em, empresa_avaliadora_id",
    )
    .eq("empresa_avaliada_id", empresa.id)
    .order("criada_em", { ascending: false })
    .limit(50);

  // Busca razao_social das avaliadoras
  const avaliadoras_ids = (avaliacoesReputacao ?? []).map((a) => a.empresa_avaliadora_id);
  const avaliadoras: Record<string, string> = {};
  if (avaliadoras_ids.length > 0) {
    const { data: emp } = await supabase
      .from("empresas")
      .select("id, razao_social")
      .in("id", avaliadoras_ids);
    if (emp) {
      for (const e of emp) avaliadoras[e.id] = e.razao_social;
    }
  }

  // Média e total de negociações concluídas
  const notas = (avaliacoesReputacao ?? []).map((a) => a.nota);
  const media_nota =
    notas.length > 0
      ? Math.round((notas.reduce((s, n) => s + n, 0) / notas.length) * 10) / 10
      : null;

  const avaliacoesPublicas = (avaliacoesReputacao ?? []).map((a) => {
    const comentarioPublico = !a.texto_comentario || a.status_comentario === "aprovado";

    return {
      id: a.id,
      nota: a.nota,
      texto_comentario: comentarioPublico ? a.texto_comentario ?? null : null,
      comentario_publico: comentarioPublico,
      empresa_avaliadora: { razao_social: avaliadoras[a.empresa_avaliadora_id] ?? "—" },
      criada_em: a.criada_em,
    };
  });

  const { count: totalNeg } = await supabase
    .from("negociacoes")
    .select("id", { count: "exact", head: true })
    .eq("status", "finalizada")
    .or(
      `empresa_autora_id.eq.${empresa.id},empresa_contraparte_id.eq.${empresa.id}`,
    );

  const perfil: PerfilEmpresa = {
    id: empresa.id,
    slug_publico: empresa.slug_publico,
    razao_social: empresa.razao_social,
    nome_fantasia: empresa.nome_fantasia ?? null,
    cidade: empresa.cidade,
    estado: empresa.estado,
    foto_perfil_url: empresa.foto_perfil_url ?? null,
    anuncios: (anuncios ?? []).map((a) => ({
      id: a.id,
      tipo: a.tipo as "oferta" | "necessidade",
      valor_total: a.valor_total,
      valor_remanescente: a.valor_remanescente,
      permite_parcial: a.permite_parcial,
      rotulo_regiao: a.rotulo_regiao ?? null,
      publicado_em: a.publicado_em,
    })),
    avaliacoes: avaliacoesPublicas,
    media_nota,
    total_avaliacoes: notas.length,
    total_negociacoes_concluidas: totalNeg ?? 0,
  };

  return { perfil, error: null };
}
