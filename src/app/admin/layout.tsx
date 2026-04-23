import { redirect } from "next/navigation";
import { getSessao } from "@/lib/sessao";
import { ROTAS } from "@/constants/rotas";
import { isAdmin } from "@/constants/papeis";

/**
 * Layout para todas as rotas do painel administrativo.
 * Cobre: /admin, /admin/analise-cadastral, /admin/tickets, /admin/moderacao-avaliacoes
 *
 * Regras — Fase 5, seção 7.4:
 * - Sem sessão → /login
 * - Papel empresa → /dashboard (empresa comum não entra em admin)
 * - Papel deve ser admin, moderador ou admin_moderador
 */
export default async function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessao = await getSessao();

  if (!sessao) {
    redirect(ROTAS.LOGIN);
  }

  if (!isAdmin(sessao.papel)) {
    redirect(ROTAS.DASHBOARD);
  }

  return <>{children}</>;
}
