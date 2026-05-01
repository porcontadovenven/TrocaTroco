import { getSessao } from "@/lib/sessao";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function PaginaStatusCadastral() {
  const sessao = await getSessao();
  const supabase = await getSupabaseServerClient();

  // Busca a submissão mais recente para exibir motivo de reprovação
  const { data: submissao } = sessao?.empresa_id
    ? await supabase
        .from("submissoes_cadastrais")
        .select("status, motivo_reprovacao_texto, numero_submissao, enviada_em")
        .eq("empresa_id", sessao.empresa_id)
        .order("numero_submissao", { ascending: false })
        .limit(1)
        .single()
    : { data: null };

  const status = sessao?.status_empresa;

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-16 dark:bg-[#09090f]">
      <div className="w-full max-w-lg rounded-3xl border border-stone-900/10 bg-white p-8 shadow-sm dark:border-stone-700/60 dark:bg-stone-900">
        <h1 className="mb-6 text-xl font-semibold text-stone-900 dark:text-stone-50">
          Status do cadastro
        </h1>

        {/* Estado: em análise */}
        {status === "em_analise" && (
          <div className="flex flex-col gap-4">
            <Badge cor="amarelo" texto="Em análise" />
            <p className="text-sm leading-7 text-stone-600 dark:text-stone-400">
              Seu cadastro foi enviado e está aguardando validação pela equipe{" "}
              administrativa. Você receberá uma atualização assim que a análise
              for concluída.
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Enquanto isso, o acesso à área operacional permanece bloqueado.
            </p>
            {submissao?.enviada_em && (
              <p className="text-xs text-stone-400 dark:text-stone-500">
                Envio nº {submissao.numero_submissao} —{" "}
                {new Date(submissao.enviada_em).toLocaleDateString("pt-BR")}
              </p>
            )}
          </div>
        )}

        {/* Estado: reprovada */}
        {status === "reprovada" && (
          <div className="flex flex-col gap-4">
            <Badge cor="vermelho" texto="Reprovado" />
            <p className="text-sm leading-7 text-stone-600 dark:text-stone-400">
              Seu cadastro foi reprovado. Corrija as informações indicadas e
              reenvie para uma nova análise.
            </p>
            {submissao?.motivo_reprovacao_texto && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/50">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                  Motivo indicado
                </p>
                <p className="text-sm text-red-800 dark:text-red-300">
                  {submissao.motivo_reprovacao_texto}
                </p>
              </div>
            )}
            <a
              href="/cadastro"
              className="inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Corrigir e reenviar
            </a>
          </div>
        )}

        {/* Estado: aprovada — não deveria aparecer (layout redireciona), mas por segurança */}
        {status === "aprovada" && (
          <div className="flex flex-col gap-4">
            <Badge cor="verde" texto="Aprovada" />
            <p className="text-sm leading-7 text-stone-600 dark:text-stone-400">
              Sua empresa está aprovada e pode operar na plataforma.
            </p>
            <a
              href="/dashboard"
              className="inline-block rounded-xl bg-emerald-700 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Ir para o dashboard
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

function Badge({ cor, texto }: { cor: "amarelo" | "verde" | "vermelho"; texto: string }) {
  const classes = {
    amarelo: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/50 dark:border-amber-900/60 dark:text-amber-300",
    verde: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-900/60 dark:text-emerald-300",
    vermelho: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-900/60 dark:text-red-400",
  };
  return (
    <span className={`w-fit rounded-full border px-4 py-1.5 text-sm font-semibold ${classes[cor]}`}>
      {texto}
    </span>
  );
}
