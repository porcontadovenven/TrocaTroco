import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessao } from "@/lib/sessao";
import { isAdmin } from "@/constants/papeis";
import { ROTAS } from "@/constants/rotas";
import { listarNegociacoesModeracao } from "@/modules/admin/actions";
import { BotaoEncerrarModeracao } from "@/modules/negociacoes/AcoesNegociacao";
import { formatarMoedaBRL, pluralizar } from "@/lib/format";

const STATUS_NEGOCIACAO_LABEL: Record<string, string> = {
  em_andamento: "Em andamento",
  operacao_encerrada: "Operação encerrada",
  finalizada: "Finalizada",
  cancelada: "Cancelada",
};

const STATUS_MODERACAO_LABEL: Record<string, string> = {
  acionada: "Acionada",
  em_acompanhamento: "Em acompanhamento",
  encerrada: "Encerrada",
};

export default async function PaginaModeracaoNegociacoes() {
  const sessao = await getSessao();
  if (!sessao || !isAdmin(sessao.papel)) redirect(ROTAS.DASHBOARD);

  const { negociacoes, error } = await listarNegociacoesModeracao();

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">
              Moderação de negociações
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              {pluralizar(negociacoes.length, "negociação com moderação ativa", "negociações com moderação ativa")}
            </p>
          </div>
          <Link
            href={ROTAS.ADMIN}
            className="text-sm text-stone-500 underline-offset-4 hover:underline"
          >
            ← Painel admin
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {negociacoes.length === 0 && (
          <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center">
            <p className="text-sm text-stone-400">
              Nenhuma negociação com moderação acionada.
            </p>
          </div>
        )}

        <ul className="flex flex-col gap-5">
          {negociacoes.map((negociacao) => (
            <li
              key={negociacao.id}
              className="rounded-2xl border border-stone-200 bg-white p-5"
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  {STATUS_MODERACAO_LABEL[negociacao.status_moderacao] ?? negociacao.status_moderacao}
                </span>
                <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-xs text-stone-600">
                  {STATUS_NEGOCIACAO_LABEL[negociacao.status] ?? negociacao.status}
                </span>
                <span className="ml-auto text-xs text-stone-400">
                  {new Date(negociacao.criada_em).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-stone-100 bg-stone-50 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-stone-400">
                    Empresa autora
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-stone-700">
                    {negociacao.empresa_autora?.razao_social ?? "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-stone-100 bg-stone-50 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-stone-400">
                    Empresa contraparte
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-stone-700">
                    {negociacao.empresa_contraparte?.razao_social ?? "—"}
                  </p>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
                <div>
                  <span className="text-stone-400">Valor: </span>
                  <span className="font-medium text-stone-800">
                    {formatarMoedaBRL(negociacao.valor_negociado)}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400">Pagamento: </span>
                  <span className="font-medium text-stone-800">{negociacao.meio_pagamento}</span>
                </div>
                <div>
                  <span className="text-stone-400">Local: </span>
                  <span className="font-medium text-stone-800">{negociacao.local_troca}</span>
                </div>
              </div>

              <Link
                href={ROTAS.NEGOCIACAO(negociacao.id)}
                className="text-sm text-stone-500 underline-offset-4 hover:text-stone-700 hover:underline"
              >
                Abrir negociação →
              </Link>

              <div className="mt-4">
                {negociacao.status_moderacao === "acionada" ? (
                  <p className="text-sm text-amber-700">
                    Abra a negociação e envie uma mensagem no chat para iniciar o acompanhamento.
                  </p>
                ) : (
                  <BotaoEncerrarModeracao negociacaoId={negociacao.id} />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}