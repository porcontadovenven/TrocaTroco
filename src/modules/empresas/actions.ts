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
  total_negociacoes_concluidas: number;
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

  // Avaliações aprovadas (comentário aprovado ou sem comentário)
  const { data: avaliacoes } = await supabase
    .from("avaliacoes")
    .select(
      "id, nota, texto_comentario, criada_em, empresa_avaliadora_id",
    )
    .eq("empresa_avaliada_id", empresa.id)
    .or("status_comentario.eq.aprovado,texto_comentario.is.null")
    .order("criada_em", { ascending: false })
    .limit(50);

  // Busca razao_social das avaliadoras
  const avaliadoras_ids = (avaliacoes ?? []).map((a) => a.empresa_avaliadora_id);
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
  const notas = (avaliacoes ?? []).map((a) => a.nota);
  const media_nota =
    notas.length > 0
      ? Math.round((notas.reduce((s, n) => s + n, 0) / notas.length) * 10) / 10
      : null;

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
    avaliacoes: (avaliacoes ?? []).map((a) => ({
      id: a.id,
      nota: a.nota,
      texto_comentario: a.texto_comentario ?? null,
      empresa_avaliadora: { razao_social: avaliadoras[a.empresa_avaliadora_id] ?? "—" },
      criada_em: a.criada_em,
    })),
    media_nota,
    total_negociacoes_concluidas: totalNeg ?? 0,
  };

  return { perfil, error: null };
}
