import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PapelUsuario } from "@/constants/papeis";

export type SessaoUsuario = {
  id: string;
  id_usuario_autenticacao: string;
  papel: PapelUsuario;
  empresa_id: string | null;
  empresa_slug_publico: string | null;
  nome_completo: string;
  email: string;
  status_empresa: "em_analise" | "aprovada" | "reprovada" | null;
};

/**
 * Retorna o usuário autenticado vinculado à tabela `usuarios`.
 * Retorna null se não houver sessão ou se o usuário não tiver registro na tabela.
 * Toda escrita e leitura sensível passa por aqui — Fase 5, seção 8.
 */
export async function getSessao(): Promise<SessaoUsuario | null> {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: usuario } = await supabase
    .from("usuarios")
    .select(
      `
      id,
      id_usuario_autenticacao,
      papel,
      empresa_id,
      nome_completo,
      email,
      empresas (
        status,
        slug_publico
      )
    `,
    )
    .eq("id_usuario_autenticacao", user.id)
    .eq("ativo", true)
    .single();

  if (!usuario) return null;

  const empresasRaw = usuario.empresas as unknown;
  const statusEmpresa = Array.isArray(empresasRaw)
    ? (empresasRaw[0]?.status ?? null)
    : (empresasRaw as { status: string } | null)?.status ?? null;
  const slugEmpresa = Array.isArray(empresasRaw)
    ? (empresasRaw[0]?.slug_publico ?? null)
    : (empresasRaw as { slug_publico?: string } | null)?.slug_publico ?? null;

  return {
    id: usuario.id,
    id_usuario_autenticacao: usuario.id_usuario_autenticacao,
    papel: usuario.papel as PapelUsuario,
    empresa_id: usuario.empresa_id,
    empresa_slug_publico: slugEmpresa,
    nome_completo: usuario.nome_completo,
    email: usuario.email,
    status_empresa: statusEmpresa
      ? (statusEmpresa as SessaoUsuario["status_empresa"])
      : null,
  };
}
