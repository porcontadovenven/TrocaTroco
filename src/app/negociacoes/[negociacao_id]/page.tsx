import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { obterNegociacao } from "@/modules/negociacoes/actions";
import {
  ChatInput,
  BotaoChamarModerador,
  BotaoEncerrarModeracao,
  BotaoEncerrarOperacao,
  FormAvaliacao,
} from "@/modules/negociacoes/AcoesNegociacao";
import { ChatMensagensClient } from "@/modules/negociacoes/ChatMensagensClient";
import { ROTAS } from "@/constants/rotas";
import { isAdmin } from "@/constants/papeis";

const STATUS_LABEL: Record<string, string> = {
  em_andamento: "Em andamento",
  operacao_encerrada: "Operação encerrada",
  finalizada: "Finalizada",
  cancelada: "Cancelada",
};

const STATUS_MOD_LABEL: Record<string, string> = {
  nao_acionada: "",
  acionada: "Moderação acionada",
  em_acompanhamento: "Em acompanhamento",
  encerrada: "Moderação encerrada",
};

const LOCAL_LABEL: Record<string, string> = {
  empresa_autora: "Na empresa anunciante",
  empresa_solicitante: "Na empresa solicitante",
};

const TIPO_LABEL: Record<string, string> = {
  oferta: "Oferta de troco",
  necessidade: "Necessidade de troco",
};

export default async function PaginaNegociacao({
  params,
}: {
  params: Promise<{ negociacao_id: string }>;
}) {
  const { negociacao_id } = await params;
  const { neg, sessao, error } = await obterNegociacao(negociacao_id);

  if (error || !neg) notFound();
  if (!sessao) redirect(ROTAS.LOGIN);

  // Verifica permissão — empresa participante ou admin
  const participa =
    sessao.empresa_id === neg.empresa_autora_id ||
    sessao.empresa_id === neg.empresa_contraparte_id;

  if (!participa && !isAdmin(sessao.papel)) notFound();

  // Normaliza relações que Supabase pode retornar como array ou objeto
  const anuncio = Array.isArray(neg.anuncios)
    ? (neg.anuncios as { id: string; tipo: string }[])[0]
    : (neg.anuncios as { id: string; tipo: string } | null);

  const empresaAutora = Array.isArray(neg.empresa_autora)
    ? (neg.empresa_autora as { id: string; slug_publico?: string | null; razao_social: string }[])[0] ?? null
    : (neg.empresa_autora as { id: string; slug_publico?: string | null; razao_social: string } | null);

  const empresaContraparte = Array.isArray(neg.empresa_contraparte)
    ? (neg.empresa_contraparte as { id: string; slug_publico?: string | null; razao_social: string }[])[0] ?? null
    : (neg.empresa_contraparte as { id: string; slug_publico?: string | null; razao_social: string } | null);

  // Normaliza mensagens para o componente realtime
  const mensagensIniciais = (
    (neg.mensagens_negociacao as unknown as {
      id: string;
      ator_usuario_id: string;
      texto_mensagem: string;
      tipo_ator: string;
      criada_em: string;
      usuarios: { id: string; nome_completo: string; empresa_id: string } | { id: string; nome_completo: string; empresa_id: string }[] | null;
    }[]) ?? []
  )
    .sort((a, b) => new Date(a.criada_em).getTime() - new Date(b.criada_em).getTime())
    .map((msg) => {
      const usuario = Array.isArray(msg.usuarios) ? msg.usuarios[0] : msg.usuarios;
      return {
        id: msg.id,
        ator_usuario_id: msg.usuarios && !Array.isArray(msg.usuarios) ? msg.usuarios.id : Array.isArray(msg.usuarios) ? (msg.usuarios[0]?.id ?? "") : "",
        texto_mensagem: msg.texto_mensagem,
        tipo_ator: msg.tipo_ator,
        criada_em: msg.criada_em,
        nome_autor: usuario?.nome_completo ?? "—",
        empresa_id_autor: usuario?.empresa_id ?? "",
      };
    });

  const avaliacoes = (neg.avaliacoes as unknown as {
    id: string;
    empresa_avaliadora_id: string;
    nota: number;
    texto_comentario: string | null;
    status_comentario: string | null;
  }[]) ?? [];

  const jaAvaliou = avaliacoes.some(
    (a) => a.empresa_avaliadora_id === sessao.empresa_id,
  );

  const status = neg.status as string;
  const statusMod = neg.status_moderacao as string;

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Nav */}
        <Link
          href={ROTAS.SOLICITACOES}
          className="mb-6 inline-block text-sm text-stone-500 underline-offset-4 hover:underline"
        >
          ← Solicitações
        </Link>

        {/* Contexto da negociação */}
        <div className="mb-5 rounded-3xl border border-stone-200 bg-white p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
              {STATUS_LABEL[status] ?? status}
            </span>
            {statusMod !== "nao_acionada" && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                {STATUS_MOD_LABEL[statusMod]}
              </span>
            )}
          </div>

          {anuncio && (
            <p className="mb-1 text-xs text-stone-500">
              {TIPO_LABEL[anuncio.tipo] ?? anuncio.tipo}
            </p>
          )}

          <div className="mb-3 flex flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400">Valor acordado</p>
              <p className="text-xl font-bold text-stone-900">
                R$ {neg.valor_negociado.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400">Pagamento</p>
              <p className="text-sm font-medium text-stone-700">{neg.meio_pagamento}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400">Local</p>
              <p className="text-sm font-medium text-stone-700">
                {LOCAL_LABEL[neg.local_troca] ?? neg.local_troca}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-stone-400">Anunciante: </span>
              {empresaAutora ? (
                <Link
                  href={ROTAS.EMPRESA_PERFIL(empresaAutora.slug_publico ?? empresaAutora.id)}
                  className="font-medium text-stone-700 underline-offset-4 hover:underline"
                >
                  {empresaAutora.razao_social}
                </Link>
              ) : (
                <span className="font-medium text-stone-700">—</span>
              )}
            </div>
            <div>
              <span className="text-stone-400">Solicitante: </span>
              {empresaContraparte ? (
                <Link
                  href={ROTAS.EMPRESA_PERFIL(empresaContraparte.slug_publico ?? empresaContraparte.id)}
                  className="font-medium text-stone-700 underline-offset-4 hover:underline"
                >
                  {empresaContraparte.razao_social}
                </Link>
              ) : (
                <span className="font-medium text-stone-700">—</span>
              )}
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="mb-4 rounded-3xl border border-stone-200 bg-white">
          <div className="border-b border-stone-100 px-5 py-3">
            <h2 className="text-sm font-semibold text-stone-800">Chat da negociação</h2>
          </div>

          <div className="flex max-h-[400px] flex-col gap-3 overflow-y-auto px-5 py-4">
            <ChatMensagensClient
              negociacaoId={neg.id}
              mensagensIniciais={mensagensIniciais}
              usuarioId={sessao.id}
            />
          </div>

          {/* Input de mensagem — apenas se negociação ativa */}
          {(status === "em_andamento" || status === "operacao_encerrada") && (
            <div className="border-t border-stone-100 px-5 py-4">
              <ChatInput negociacaoId={neg.id} />
            </div>
          )}
        </div>

        {/* Ações operacionais */}
        {participa && (
          <div className="flex flex-col gap-3">
            {/* Encerrar operação */}
            {status === "em_andamento" && (
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <p className="mb-3 text-sm text-stone-600">
                  A operação foi realizada? Conclua para liberar a avaliação.
                </p>
                <BotaoEncerrarOperacao negociacaoId={neg.id} />
              </div>
            )}

            {/* Chamar moderador */}
            {status === "em_andamento" && statusMod === "nao_acionada" && (
              <div className="rounded-2xl border border-amber-100 bg-white p-4">
                <p className="mb-3 text-sm text-stone-500">
                  Está tendo algum problema com a outra parte?
                </p>
                <BotaoChamarModerador negociacaoId={neg.id} />
              </div>
            )}

            {/* Avaliação */}
            {status === "operacao_encerrada" && !jaAvaliou && (
              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <h3 className="mb-4 text-base font-semibold text-stone-900">
                  Avalie a outra parte
                </h3>
                <FormAvaliacao negociacaoId={neg.id} />
              </div>
            )}

            {status === "operacao_encerrada" && jaAvaliou && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
                <p className="text-sm text-emerald-700">
                  Você já enviou sua avaliação. Aguardando avaliação da outra parte.
                </p>
              </div>
            )}

            {status === "finalizada" && (
              <div className="rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4">
                <p className="text-sm text-stone-500">
                  Negociação finalizada. Ambas as partes avaliaram.
                </p>
                <Link
                  href={ROTAS.MEUS_ANUNCIOS}
                  className="mt-2 inline-block text-sm font-medium text-stone-700 underline-offset-4 hover:underline"
                >
                  Ir para meus anúncios →
                </Link>
              </div>
            )}
          </div>
        )}

        {!participa && isAdmin(sessao.papel) && statusMod === "acionada" && (
          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              A moderação foi acionada. Envie uma mensagem no chat para iniciar o acompanhamento.
            </p>
          </div>
        )}

        {!participa && isAdmin(sessao.papel) && statusMod === "em_acompanhamento" && (
          <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4">
            <p className="mb-3 text-sm text-stone-600">
              Encerrar o acompanhamento administrativo remove esta negociação das pendências do painel.
            </p>
            <BotaoEncerrarModeracao negociacaoId={neg.id} />
          </div>
        )}
      </div>
    </main>
  );
}
