import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessao } from "@/lib/sessao";
import { isAdmin } from "@/constants/papeis";
import { ROTAS } from "@/constants/rotas";
import { obterContadoresAdmin } from "@/modules/admin/actions";

function Contador({
  valor,
  label,
  alerta,
}: {
  valor: number;
  label: string;
  alerta?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-5 py-4 ${
        alerta && valor > 0
          ? "border-amber-200 bg-amber-50"
          : "border-stone-200 bg-white"
      }`}
    >
      <p
        className={`text-3xl font-bold ${
          alerta && valor > 0 ? "text-amber-700" : "text-stone-900"
        }`}
      >
        {valor}
      </p>
      <p className="mt-1 text-xs text-stone-500">{label}</p>
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
      className="flex flex-col gap-1 rounded-2xl border border-stone-200 bg-white px-5 py-4 hover:border-stone-300 hover:bg-stone-50 transition-colors"
    >
      <span className="text-sm font-semibold text-stone-800">{titulo}</span>
      <span className="text-xs text-stone-400">{descricao}</span>
    </Link>
  );
}

export default async function PaginaAdmin() {
  const sessao = await getSessao();
  if (!sessao || !isAdmin(sessao.papel)) redirect(ROTAS.DASHBOARD);

  const contadores = await obterContadoresAdmin();

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900">
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
            />
            <Contador
              valor={contadores.tickets_abertos}
              label="Tickets abertos"
              alerta
            />
            <Contador
              valor={contadores.comentarios_pendentes}
              label="Comentários pendentes"
              alerta
            />
            <Contador
              valor={contadores.negociacoes_moderacao}
              label="Negociações c/ moderação"
              alerta
            />
          </div>
        </section>

        {/* Módulos principais */}
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Módulos administrativos
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
