import { redirect } from "next/navigation";
import { getSessao } from "@/lib/sessao";
import { ROTAS } from "@/constants/rotas";
import { isAdmin } from "@/constants/papeis";
import { BarraSessao } from "@/modules/auth/BarraSessao";
import { AtualizacoesEmpresaClient } from "@/modules/app/AtualizacoesEmpresaClient";

/**
 * Layout para rotas de empresa autenticada e aprovada.
 * Cobre: /dashboard, /anunciar, /meus-anuncios, /solicitacoes, /negociacoes, /negociacoes/*
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

  return (
    <div className="min-h-screen bg-stone-50">
      <AtualizacoesEmpresaClient />
      <BarraSessao
        nome={sessao.nome_completo}
        email={sessao.email}
        tituloArea="Conta conectada"
        hrefArea={ROTAS.DASHBOARD}
        rotuloArea="Dashboard"
        navItems={[
          { href: ROTAS.DASHBOARD, label: "Dashboard" },
          { href: ROTAS.ANUNCIAR, label: "Anunciar" },
          {
            label: "Operações",
            children: [
              { href: ROTAS.MEUS_ANUNCIOS, label: "Meus anúncios" },
              { href: ROTAS.SOLICITACOES, label: "Solicitações" },
              { href: ROTAS.NEGOCIACOES, label: "Negociações" },
            ],
          },
          { href: ROTAS.ANUNCIOS, label: "Anúncios" },
          { href: ROTAS.EMPRESAS, label: "Empresas" },
          {
            href: ROTAS.EMPRESA_PERFIL(sessao.empresa_slug_publico ?? sessao.empresa_id ?? ""),
            label: "Minha empresa",
          },
        ]}
      />
      {children}
    </div>
  );
}
