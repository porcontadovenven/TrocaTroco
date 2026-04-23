import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import {
  listarSolicitacoesEnviadas,
  listarSolicitacoesRecebidas,
} from "@/modules/solicitacoes/actions";
import {
  BotoesRecebida,
  BotaoCancelar,
} from "@/modules/solicitacoes/BotoesSolicitacao";
import { ROTAS } from "@/constants/rotas";
import type { StatusSolicitacao } from "@/modules/solicitacoes/actions";

const STATUS_LABEL: Record<StatusSolicitacao, string> = {
  pendente: "Aguardando resposta",
  aceita: "Aceita",
  recusada: "Recusada",
  cancelada: "Cancelada",
  expirada: "Expirada",
};

const STATUS_COR: Record<StatusSolicitacao, string> = {
  pendente: "bg-amber-50 border-amber-200 text-amber-800",
  aceita: "bg-emerald-50 border-emerald-200 text-emerald-800",
  recusada: "bg-red-50 border-red-200 text-red-700",
  cancelada: "bg-stone-100 border-stone-200 text-stone-500",
  expirada: "bg-stone-50 border-stone-200 text-stone-400",
};

const LOCAL_LABEL: Record<string, string> = {
  empresa_autora: "Na empresa anunciante",
  empresa_solicitante: "Na minha empresa",
};

const TIPO_LABEL: Record<string, string> = {
  oferta: "Oferta",
  necessidade: "Necessidade",
};

export default async function PaginaSolicitacoes() {
  const [enviadas, recebidas] = await Promise.all([
    listarSolicitacoesEnviadas(),
    listarSolicitacoesRecebidas(),
  ]);

  return (
    <main className="min-h-screen bg-stone-50/50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-stone-400">
            <Bell className="h-3.5 w-3.5" />
            Solicitações
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Solicitações</h1>
          <p className="mt-1 text-sm text-stone-500">
            Gerencie as solicitações que você enviou e recebeu.
          </p>
        </div>

        {/* ---- ENVIADAS ---- */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-stone-800">
            Enviadas
            <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-600">
              {enviadas.length}
            </span>
          </h2>

          {enviadas.length === 0 && (
            <Empty mensagem="Você ainda não enviou nenhuma solicitação." />
          )}

          <div className="flex flex-col gap-3">
            {enviadas.map((sol) => {
              const anuncio = (Array.isArray((sol as unknown as { anuncios: unknown }).anuncios)
                ? (sol as unknown as { anuncios: { id: string; tipo: string; empresas: { razao_social: string }[] | { razao_social: string } }[] }).anuncios[0]
                : (sol as unknown as { anuncios: { id: string; tipo: string; empresas: { razao_social: string }[] | { razao_social: string } } }).anuncios);

              const empresa = anuncio
                ? (Array.isArray(anuncio.empresas) ? anuncio.empresas[0] : anuncio.empresas)
                : null;

              const negs = (sol as unknown as { negociacoes: { id: string }[] | null }).negociacoes;
              const negId = Array.isArray(negs) ? negs[0]?.id : null;

              const status = sol.status as StatusSolicitacao;

              return (
                <div
                  key={sol.id}
                  className="rounded-2xl border border-stone-200 bg-white p-4"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {anuncio && (
                      <span className="text-xs text-stone-500">
                        {TIPO_LABEL[anuncio.tipo]} — {empresa?.razao_social}
                      </span>
                    )}
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COR[status]}`}>
                      {STATUS_LABEL[status]}
                    </span>
                  </div>

                  <div className="mb-2 flex flex-wrap gap-4 text-sm">
                    <span className="font-semibold text-stone-900">
                      R$ {sol.valor_solicitado.toFixed(2)}
                    </span>
                    <span className="text-stone-500">
                      {LOCAL_LABEL[sol.local_troca] ?? sol.local_troca}
                    </span>
                    <span className="text-stone-500">{sol.meio_pagamento}</span>
                  </div>

                  <p className="mb-2 text-xs text-stone-400">
                    {new Date(sol.criada_em).toLocaleString("pt-BR")}
                  </p>

                  {/* Acesso à negociação se aceita */}
                  {status === "aceita" && negId && (
                    <Link
                      href={ROTAS.NEGOCIACAO(negId)}
                      className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      Abrir negociação <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}

                  {/* Cancelamento dentro da janela */}
                  {status === "pendente" && (
                    <BotaoCancelar
                      solicitacaoId={sol.id}
                      prazoCancelamento={sol.prazo_cancelamento_em}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ---- RECEBIDAS ---- */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-stone-800">
            Recebidas
            <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-600">
              {recebidas.length}
            </span>
          </h2>

          {recebidas.length === 0 && (
            <Empty mensagem="Você ainda não recebeu nenhuma solicitação." />
          )}

          <div className="flex flex-col gap-3">
            {recebidas.map((sol) => {
              const anuncio = (Array.isArray((sol as unknown as { anuncios: unknown }).anuncios)
                ? (sol as unknown as { anuncios: { id: string; tipo: string }[] }).anuncios[0]
                : (sol as unknown as { anuncios: { id: string; tipo: string } }).anuncios);

              const solicitante = (sol as unknown as { empresas: { razao_social: string }[] | { razao_social: string } | null }).empresas;
              const nomeEmpresa = Array.isArray(solicitante)
                ? solicitante[0]?.razao_social
                : solicitante?.razao_social;

              const negs = (sol as unknown as { negociacoes: { id: string }[] | null }).negociacoes;
              const negId = Array.isArray(negs) ? negs[0]?.id : null;

              const status = sol.status as StatusSolicitacao;

              return (
                <div
                  key={sol.id}
                  className="rounded-2xl border border-stone-200 bg-white p-4"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {anuncio && (
                      <span className="text-xs text-stone-500">
                        {TIPO_LABEL[anuncio.tipo]}
                      </span>
                    )}
                    <span className="text-xs font-medium text-stone-700">
                      {nomeEmpresa}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COR[status]}`}>
                      {STATUS_LABEL[status]}
                    </span>
                  </div>

                  <div className="mb-2 flex flex-wrap gap-4 text-sm">
                    <span className="font-semibold text-stone-900">
                      R$ {sol.valor_solicitado.toFixed(2)}
                    </span>
                    {sol.parcial && (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                        Parcial
                      </span>
                    )}
                    <span className="text-stone-500">
                      {LOCAL_LABEL[sol.local_troca] ?? sol.local_troca}
                    </span>
                    <span className="text-stone-500">{sol.meio_pagamento}</span>
                  </div>

                  <p className="mb-3 text-xs text-stone-400">
                    {new Date(sol.criada_em).toLocaleString("pt-BR")}
                  </p>

                  {/* Ações para pendente */}
                  {status === "pendente" && (
                    <BotoesRecebida solicitacaoId={sol.id} />
                  )}

                  {/* Link para negociação se aceita */}
                  {status === "aceita" && negId && (
                    <Link
                      href={ROTAS.NEGOCIACAO(negId)}
                      className="inline-block rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-700"
                    >
                      Abrir negociação →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function Empty({ mensagem }: { mensagem: string }) {
  return (
    <div className="rounded-2xl border border-stone-100 bg-white py-8 text-center text-sm text-stone-400">
      {mensagem}
    </div>
  );
}
