import Link from "next/link";
import { Building2, Star } from "lucide-react";
import { listarEmpresasPublicas } from "@/modules/empresas/actions";
import { ROTAS } from "@/constants/rotas";

function EstrelasResumo({ nota }: { nota: number | null }) {
  if (nota === null) {
    return <span className="text-xs text-stone-400">Sem avaliações</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="flex gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((valor) => (
          <span key={valor} className={valor <= Math.round(nota) ? "opacity-100" : "opacity-25"}>★</span>
        ))}
      </span>
      <span className="text-sm font-semibold text-stone-700">{nota.toFixed(1)}</span>
    </div>
  );
}

export default async function PaginaEmpresas() {
  const { empresas, error } = await listarEmpresasPublicas();

  return (
    <main className="min-h-screen bg-stone-50/50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">
              Diretório público
            </p>
            <h1 className="text-2xl font-bold text-stone-900">Empresas cadastradas</h1>
            <p className="mt-1 text-sm text-stone-500">
              Perfis públicos ordenados inicialmente pela melhor reputação.
            </p>
          </div>
          <Link
            href={ROTAS.ANUNCIOS}
            className="text-sm font-medium text-stone-600 underline-offset-4 hover:underline"
          >
            Ver marketplace
          </Link>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!error && empresas.length === 0 && (
          <div className="rounded-3xl border border-stone-200 bg-white px-6 py-16 text-center">
            <Building2 className="mx-auto mb-3 h-8 w-8 text-stone-300" />
            <p className="text-sm text-stone-500">Nenhuma empresa pública disponível no momento.</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {empresas.map((empresa) => (
            <Link
              key={empresa.id}
              href={ROTAS.EMPRESA_PERFIL(empresa.slug_publico ?? empresa.id)}
              className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-5 transition-colors hover:border-stone-300 hover:bg-stone-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-stone-900">
                    {empresa.nome_fantasia ?? empresa.razao_social}
                  </p>
                  {empresa.nome_fantasia && (
                    <p className="text-xs text-stone-400">{empresa.razao_social}</p>
                  )}
                </div>
                <Star className="h-4 w-4 text-amber-400" />
              </div>

              <p className="text-sm text-stone-500">
                {empresa.cidade}, {empresa.estado}
              </p>

              <div className="flex flex-col gap-2 rounded-2xl bg-stone-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-stone-400">Reputação</span>
                  <EstrelasResumo nota={empresa.media_nota} />
                </div>
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>{empresa.total_avaliacoes} avaliação{empresa.total_avaliacoes !== 1 ? "ões" : ""}</span>
                  <span>{empresa.total_negociacoes_concluidas} operação{empresa.total_negociacoes_concluidas !== 1 ? "ões" : ""}</span>
                </div>
              </div>

              <span className="text-sm font-medium text-stone-600 underline-offset-4 hover:underline">
                Abrir perfil público
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}