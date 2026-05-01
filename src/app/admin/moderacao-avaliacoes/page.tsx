import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessao } from "@/lib/sessao";
import { isAdmin } from "@/constants/papeis";
import { ROTAS } from "@/constants/rotas";
import { listarAvaliacoesPendentes } from "@/modules/admin/actions";
import { BotoesModeracao } from "@/modules/admin/AcoesAdmin";

function Estrelas({ nota }: { nota: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= nota ? "text-amber-400" : "text-stone-200"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default async function PaginaModeracaoAvaliacoes() {
  const sessao = await getSessao();
  if (!sessao || !isAdmin(sessao.papel)) redirect(ROTAS.DASHBOARD);

  const { avaliacoes, error } = await listarAvaliacoesPendentes();

  return (
    <main className="min-h-screen bg-stone-50/50 px-6 py-10 dark:bg-[#09090f]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
              Moderação de avaliações
            </h1>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {avaliacoes.length} comentário{avaliacoes.length !== 1 ? "s" : ""} aguardando moderação
            </p>
          </div>
          <Link
            href={ROTAS.ADMIN}
            className="text-sm text-stone-500 underline-offset-4 hover:underline dark:text-stone-400"
          >
            ← Painel admin
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {avaliacoes.length === 0 && (
          <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center dark:border-stone-700/60 dark:bg-stone-900">
            <p className="text-sm text-stone-400 dark:text-stone-500">
              Nenhum comentário aguardando moderação.
            </p>
          </div>
        )}

        <ul className="flex flex-col gap-5">
          {avaliacoes.map((av) => (
            <li
              key={av.id}
              className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-700/60 dark:bg-stone-900"
            >
              {/* Cabeçalho */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-300">
                  Pendente moderação
                </span>
                <span className="ml-auto text-xs text-stone-400 dark:text-stone-500">
                  {new Date(av.criada_em).toLocaleDateString("pt-BR")}
                </span>
              </div>

              {/* Empresas */}
              <div className="mb-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-stone-100 bg-stone-50 px-3 py-2 dark:border-stone-800 dark:bg-stone-800/60">
                  <p className="text-[10px] uppercase tracking-wide text-stone-400 dark:text-stone-500">
                    Avaliadora
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-stone-700 dark:text-stone-200">
                    {av.empresa_avaliadora?.razao_social ?? "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-stone-100 bg-stone-50 px-3 py-2 dark:border-stone-800 dark:bg-stone-800/60">
                  <p className="text-[10px] uppercase tracking-wide text-stone-400 dark:text-stone-500">
                    Avaliada
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-stone-700 dark:text-stone-200">
                    {av.empresa_avaliada?.razao_social ?? "—"}
                  </p>
                </div>
              </div>

              {/* Nota e negociação */}
              <div className="mb-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Estrelas nota={av.nota} />
                  <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                    {av.nota}/5
                  </span>
                </div>
                <Link
                  href={ROTAS.NEGOCIACAO(av.negociacao_id)}
                  className="text-xs text-stone-400 underline-offset-4 hover:text-stone-600 hover:underline dark:text-stone-500 dark:hover:text-stone-300"
                >
                  Ver negociação →
                </Link>
              </div>

              {/* Comentário */}
              <div className="mb-5 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-800/60">
                <p className="text-xs font-medium text-stone-500 mb-1 dark:text-stone-400">Comentário submetido</p>
                <p className="text-sm text-stone-700 dark:text-stone-300">{av.texto_comentario}</p>
              </div>

              {/* Ações */}
              <BotoesModeracao avaliacaoId={av.id} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
