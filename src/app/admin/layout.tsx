import { redirect } from "next/navigation";
import { getSessao } from "@/lib/sessao";
import { ROTAS } from "@/constants/rotas";
import { isAdmin } from "@/constants/papeis";
import { BarraSessao } from "@/modules/auth/BarraSessao";

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

  return (
    <div className="min-h-screen bg-stone-50">
      <BarraSessao
        nome={sessao.nome_completo}
        email={sessao.email}
        tituloArea="Conta administrativa"
        hrefArea={ROTAS.ADMIN}
        rotuloArea="Painel admin"
        navItems={[
          { href: ROTAS.ADMIN, label: "Painel" },
          { href: ROTAS.ADMIN_ANUNCIOS, label: "Anúncios" },
          { href: ROTAS.ADMIN_ANALISE_CADASTRAL, label: "Análise cadastral" },
          { href: ROTAS.ADMIN_TICKETS, label: "Tickets" },
          { href: ROTAS.ADMIN_MODERACAO_AVALIACOES, label: "Avaliações" },
          { href: ROTAS.ADMIN_MODERACAO_NEGOCIACOES, label: "Negociações" },
        ]}
      />
      {children}
    </div>
  );
}
