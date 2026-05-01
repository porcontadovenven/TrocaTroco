import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSessao } from "@/lib/sessao";
import { aprovarSubmissao } from "@/modules/cadastro/actions";
import { FormReprovacao } from "@/modules/cadastro/FormReprovacao";
import { redirect } from "next/navigation";
import { ROTAS } from "@/constants/rotas";
import { isAdmin } from "@/constants/papeis";

export default async function PaginaAnaliseCadastral() {
  const sessao = await getSessao();
  if (!sessao || !isAdmin(sessao.papel)) redirect(ROTAS.DASHBOARD);

  const supabase = await getSupabaseServerClient();

  // Lista empresas com submissão vigente em análise
  const { data: submissoes } = await supabase
    .from("submissoes_cadastrais")
    .select(
      `
      id,
      numero_submissao,
      status,
      dados_submetidos,
      motivo_reprovacao_texto,
      enviada_em,
      empresas (
        id,
        cnpj,
        razao_social,
        status
      )
    `,
    )
    .eq("status", "em_analise")
    .order("enviada_em", { ascending: true });

  return (
    <main className="min-h-screen bg-stone-50/50 px-6 py-10 dark:bg-[#09090f]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
              Análise cadastral
            </h1>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {submissoes?.length ?? 0} empresa(s) aguardando análise
            </p>
          </div>
          <a
            href={ROTAS.ADMIN}
            className="text-sm text-stone-500 underline-offset-4 hover:underline dark:text-stone-400"
          >
            ← Painel admin
          </a>
        </div>

        {!submissoes?.length && (
          <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-400 dark:border-stone-700/60 dark:bg-stone-900 dark:text-stone-500">
            Nenhuma empresa aguardando análise.
          </div>
        )}

        <div className="flex flex-col gap-6">
          {submissoes?.map((sub) => {
            const empresa = Array.isArray(sub.empresas)
              ? sub.empresas[0]
              : sub.empresas;
            const dados = sub.dados_submetidos as {
              empresa?: Record<string, string>;
              responsavel?: Record<string, string>;
            };

            return (
              <div
                key={sub.id}
                className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-700/60 dark:bg-stone-900"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-stone-900 dark:text-stone-50">
                      {empresa?.razao_social}
                    </p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      CNPJ: {empresa?.cnpj} — Envio nº {sub.numero_submissao}{" "}
                      em{" "}
                      {new Date(sub.enviada_em).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-300">
                    Em análise
                  </span>
                </div>

                <div className="mb-5 grid gap-5 sm:grid-cols-2">
                  <SecaoDados titulo="Dados da empresa" dados={dados.empresa} />
                  <SecaoDados
                    titulo="Dados do responsável"
                    dados={dados.responsavel}
                  />
                </div>

                {/* Ação de aprovação via server action inline */}
                <div className="flex flex-col gap-4 border-t border-stone-100 pt-4 sm:flex-row sm:items-start sm:gap-6 dark:border-stone-800">
                  <form
                    action={async () => {
                      "use server";
                      await aprovarSubmissao(empresa?.id ?? "", sub.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                    >
                      Aprovar cadastro
                    </button>
                  </form>

                  <div className="flex-1">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Reprovar
                    </p>
                    <FormReprovacao
                      empresaId={empresa?.id ?? ""}
                      submissaoId={sub.id}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function SecaoDados({
  titulo,
  dados,
}: {
  titulo: string;
  dados?: Record<string, string>;
}) {
  if (!dados) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {titulo}
      </p>
      <dl className="flex flex-col gap-1">
        {Object.entries(dados)
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="grid grid-cols-2 gap-1 text-sm">
              <dt className="text-stone-400 dark:text-stone-500">{k.replace(/_/g, " ")}</dt>
              <dd className="text-stone-800 dark:text-stone-200">{v}</dd>
            </div>
          ))}
      </dl>
    </div>
  );
}
