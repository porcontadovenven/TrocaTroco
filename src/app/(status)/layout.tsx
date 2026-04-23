import { redirect } from "next/navigation";
import { getSessao } from "@/lib/sessao";
import { ROTAS } from "@/constants/rotas";
import { isAdmin } from "@/constants/papeis";
import { BarraSessao } from "@/modules/auth/BarraSessao";

/**
 * Layout para rotas de empresa em análise ou reprovada.
 * Cobre: /status-cadastral
 *
 * Regras — Fase 5, seção 7:
 * - Sem sessão → /login
 * - Papel admin → /admin
 * - Empresa aprovada → /dashboard (já pode operar)
 */
export default async function LayoutStatusCadastral({
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

  if (sessao.status_empresa === "aprovada") {
    redirect(ROTAS.DASHBOARD);
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <BarraSessao
        nome={sessao.nome_completo}
        email={sessao.email}
        tituloArea="Conta conectada"
        hrefArea={ROTAS.STATUS_CADASTRAL}
        rotuloArea="Status cadastral"
      />
      {children}
    </div>
  );
}
