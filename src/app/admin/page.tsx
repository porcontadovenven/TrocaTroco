import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Star,
  TicketCheck,
} from "lucide-react";
import { getSessao } from "@/lib/sessao";
import { isAdmin } from "@/constants/papeis";
import { ROTAS } from "@/constants/rotas";
import { obterContadoresAdmin } from "@/modules/admin/actions";

function Contador({
  valor,
  label,
  alerta,
  icon,
}: {
  valor: number;
  label: string;
  alerta?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border p-5 ${
        alerta && valor > 0
          ? "border-amber-200 bg-amber-50"
          : "border-stone-200 bg-white"
      }`}
    >
      {icon && (
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${alerta && valor > 0 ? "bg-amber-100" : "bg-stone-100"}`}>
          <span className={alerta && valor > 0 ? "text-amber-600" : "text-stone-500"}>{icon}</span>
        </div>
      )}
      <div>
        <p
          className={`text-3xl font-bold tracking-tight ${
            alerta && valor > 0 ? "text-amber-700" : "text-stone-900"
          }`}
        >
          {valor}
        </p>
        <p className="mt-1 text-xs text-stone-500">{label}</p>
      </div>
    </div>
  );
}

function LinkAdmin({
  href,
  titulo,
  descricao,
}: {
  href: string;
  titulo: string;
  descricao: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-2 rounded-2xl border border-stone-200 bg-white px-5 py-4 transition-all hover:border-stone-300 hover:bg-stone-50"
    >
      <div>
        <span className="text-sm font-semibold text-stone-800">{titulo}</span>
        <p className="mt-0.5 text-xs text-stone-400">{descricao}</p>
      </div>
      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-stone-300 opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

export default async function PaginaAdmin() {
  const sessao = await getSessao();
  if (!sessao || !isAdmin(sessao.papel)) redirect(ROTAS.DASHBOARD);

  const contadores = await obterContadoresAdmin();

  return (
    <main className="min-h-screen bg-stone-50/50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-stone-400">
            <LayoutDashboard className="h-3.5 w-3.5" />
            Painel administrativo
          </div>
          <h1 className="text-2xl font-bold text-stone-900">
            Painel administrativo
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Área restrita a administradores e moderadores.
          </p>
        </div>

        {/* Contadores de atenção */}
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Pendências
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Contador
              valor={contadores.empresas_pendentes}
              label="Empresas em análise"
              alerta
              icon={<BadgeCheck className="h-4 w-4" />}
            />
            <Contador
              valor={contadores.tickets_abertos}
              label="Tickets abertos"
              alerta
              icon={<TicketCheck className="h-4 w-4" />}
            />
            <Contador
              valor={contadores.comentarios_pendentes}
              label="Comentários pendentes"
              alerta
              icon={<Star className="h-4 w-4" />}
            />
            <Contador
              valor={contadores.negociacoes_moderacao}
              label="Negociações c/ moderação"
              alerta
              icon={<MessageSquare className="h-4 w-4" />}
            />
          </div>
        </section>

        {/* Módulos principais */}
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Módulos administrativos
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <LinkAdmin
              href={ROTAS.ADMIN_ANALISE_CADASTRAL}
              titulo="Análise cadastral"
              descricao="Aprovar ou reprovar empresas submetidas"
            />
            <LinkAdmin
              href={ROTAS.ADMIN_TICKETS}
              titulo="Tickets / denúncias"
              descricao="Acompanhar e encerrar casos abertos"
            />
            <LinkAdmin
              href={ROTAS.ADMIN_MODERACAO_AVALIACOES}
              titulo="Moderação de avaliações"
              descricao="Aprovar ou barrar comentários pendentes"
            />
            <LinkAdmin
              href={ROTAS.ADMIN_MODERACAO_NEGOCIACOES}
              titulo="Moderação de negociações"
              descricao="Acompanhar negociações com moderação acionada"
            />
          </div>
        </section>

        {/* Acesso complementar */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Acesso complementar
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <LinkAdmin
              href={ROTAS.ANUNCIOS}
              titulo="Anúncios"
              descricao="Visão pública dos anúncios"
            />
            <LinkAdmin
              href={ROTAS.SOLICITACOES}
              titulo="Solicitações"
              descricao="Histórico de solicitações"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
