import { redirect } from "next/navigation";
import { getSessao } from "@/lib/sessao";
import { ROTAS } from "@/constants/rotas";
import { isAdmin } from "@/constants/papeis";

/**
 * Layout para rotas de empresa autenticada e aprovada.
 * Cobre: /dashboard, /anunciar, /meus-anuncios, /solicitacoes, /negociacoes/*
 *
 * Regras — Fase 5, seção 7:
 * - Sem sessão → /login
 * - Papel admin → /admin (admin não usa fluxo de empresa)
 * - Empresa em análise → /status-cadastral
 * - Empresa reprovada → /status-cadastral
 */
export default async function LayoutEmpresa({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessao = await getSessao();

  if (!sessao) {
    redirect(ROTAS.LOGIN);
  }

  if (isAdmin(sessao.papel)) {
    redirect(ROTAS.ADMIN);
  }

  if (
    sessao.status_empresa === "em_analise" ||
    sessao.status_empresa === "reprovada"
  ) {
    redirect(ROTAS.STATUS_CADASTRAL);
  }

  return <>{children}</>;
}
