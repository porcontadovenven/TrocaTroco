import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { listarNegociacoesDaEmpresa } from "@/modules/negociacoes/actions";
import { ROTAS } from "@/constants/rotas";
import { AutoRefreshClient } from "@/modules/app/AutoRefreshClient";
import { formatarMoedaBRL } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  em_andamento: "Em andamento",
  operacao_encerrada: "Operação encerrada",
  finalizada: "Finalizada",
  cancelada: "Cancelada",
};

const STATUS_MOD_LABEL: Record<string, string> = {
  nao_acionada: "Sem moderação",
  acionada: "Moderação acionada",
  em_acompanhamento: "Moderação em acompanhamento",
  encerrada: "Moderação encerrada",
};

function BlocoVazio({ mensagem }: { mensagem: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white px-5 py-8 text-center text-sm text-stone-400">
      {mensagem}
    </div>
  );
}

export default async function PaginaNegociacoes() {
  const { negociacoes, error } = await listarNegociacoesDaEmpresa();

  const abertas = negociacoes.filter((negociacao) => negociacao.status !== "finalizada" && negociacao.status !== "cancelada");
  const concluidas = negociacoes.filter((negociacao) => negociacao.status === "finalizada" || negociacao.status === "cancelada");

  return (
    <main className="min-h-screen bg-stone-50/50 px-6 py-10">
      <AutoRefreshClient tabelas={["negociacoes", "avaliacoes", "solicitacoes"]} intervaloMs={12000} />
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-stone-400">
            <MessageSquareText className="h-3.5 w-3.5" />
            Negociações
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Minhas negociações</h1>
          <p className="mt-1 text-sm text-stone-500">
            Acompanhe negociações ativas e consulte o histórico das concluídas. Após concluir, o chat fica somente para leitura.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mb-10">
          <h2 className="mb-4 text-base font-semibold text-stone-800">Em andamento</h2>
          {abertas.length === 0 ? (
            <BlocoVazio mensagem="Nenhuma negociação ativa no momento." />
          ) : (
            <div className="flex flex-col gap-3">
              {abertas.map((negociacao) => (
                <CardNegociacao key={negociacao.id} negociacao={negociacao} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-base font-semibold text-stone-800">Concluídas e arquivadas</h2>
          {concluidas.length === 0 ? (
            <BlocoVazio mensagem="Nenhuma negociação concluída ainda." />
          ) : (
            <div className="flex flex-col gap-3">
              {concluidas.map((negociacao) => (
                <CardNegociacao key={negociacao.id} negociacao={negociacao} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function CardNegociacao({
  negociacao,
}: {
  negociacao: Awaited<ReturnType<typeof listarNegociacoesDaEmpresa>>["negociacoes"][number];
}) {
  const autora = negociacao.empresa_autora;
  const contraparte = negociacao.empresa_contraparte;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-xs font-semibold text-stone-700">
          {STATUS_LABEL[negociacao.status] ?? negociacao.status}
        </span>
        <span className="rounded-full border border-sky-100 bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
          {STATUS_MOD_LABEL[negociacao.status_moderacao] ?? negociacao.status_moderacao}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-4 text-sm">
        <span className="font-semibold text-stone-900">{formatarMoedaBRL(negociacao.valor_negociado)}</span>
        <span className="text-stone-500">{negociacao.meio_pagamento}</span>
        <span className="text-stone-500">{new Date(negociacao.criada_em).toLocaleDateString("pt-BR")}</span>
      </div>

      <div className="mb-3 flex flex-wrap gap-4 text-sm text-stone-600">
        {autora && (
          <Link
            href={ROTAS.EMPRESA_PERFIL(autora.slug_publico ?? autora.id)}
            className="underline-offset-4 hover:underline"
          >
            Anunciante: {autora.razao_social}
          </Link>
        )}
        {contraparte && (
          <Link
            href={ROTAS.EMPRESA_PERFIL(contraparte.slug_publico ?? contraparte.id)}
            className="underline-offset-4 hover:underline"
          >
            Solicitante: {contraparte.razao_social}
          </Link>
        )}
      </div>

      <Link
        href={ROTAS.NEGOCIACAO(negociacao.id)}
        className="inline-flex rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-700"
      >
        Abrir histórico da negociação
      </Link>
    </div>
  );
}