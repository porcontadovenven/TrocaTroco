"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

interface Mensagem {
  id: string;
  ator_usuario_id: string;
  texto_mensagem: string;
  tipo_ator: string;
  criada_em: string;
  nome_autor: string;
  empresa_id_autor: string;
}

interface Props {
  negociacaoId: string;
  mensagensIniciais: Mensagem[];
  usuarioId: string;
}

const formatadorHoraMensagem = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

function formatarHoraMensagem(dataIso: string) {
  return formatadorHoraMensagem.format(new Date(dataIso));
}

function ehMensagemModeracao(tipoAtor: string) {
  return tipoAtor !== "usuario_empresa";
}

function mesclarMensagens(base: Mensagem[], novas: Mensagem[]) {
  const mensagensPorId = new Map<string, Mensagem>();

  [...base, ...novas].forEach((mensagem) => {
    mensagensPorId.set(mensagem.id, mensagem);
  });

  return Array.from(mensagensPorId.values()).sort(
    (a, b) => new Date(a.criada_em).getTime() - new Date(b.criada_em).getTime(),
  );
}

export function ChatMensagens({ negociacaoId, mensagensIniciais, usuarioId }: Props) {
  const [mensagens, setMensagens] = useState<Mensagem[]>(mensagensIniciais);
  const bottomRef = useRef<HTMLDivElement>(null);
  const autoresCacheRef = useRef<Map<string, { nome_completo: string; empresa_id: string }>>(
    new Map(),
  );

  // Scroll automático ao receber nova mensagem
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // Supabase Realtime — inscreve no canal de mensagens desta negociação
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel(`negociacao:${negociacaoId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensagens_negociacao",
          filter: `negociacao_id=eq.${negociacaoId}`,
        },
        async (payload) => {
          const nova = payload.new as {
            id: string;
            texto_mensagem: string;
            tipo_ator: string;
            criada_em: string;
            ator_usuario_id: string;
          };

          let usuario = autoresCacheRef.current.get(nova.ator_usuario_id);

          if (!usuario) {
            const { data } = await supabase
              .from("usuarios")
              .select("nome_completo, empresa_id")
              .eq("id", nova.ator_usuario_id)
              .single();

            usuario = {
              nome_completo: data?.nome_completo ?? "—",
              empresa_id: data?.empresa_id ?? "",
            };
            autoresCacheRef.current.set(nova.ator_usuario_id, usuario);
          }

          startTransition(() => {
            setMensagens((prev) =>
              mesclarMensagens(prev, [
                {
                  id: nova.id,
                  ator_usuario_id: nova.ator_usuario_id,
                  texto_mensagem: nova.texto_mensagem,
                  tipo_ator: nova.tipo_ator,
                  criada_em: nova.criada_em,
                  nome_autor: usuario.nome_completo,
                  empresa_id_autor: usuario.empresa_id,
                },
              ]),
            );
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [negociacaoId]);

  if (mensagens.length === 0) {
    return (
      <p className="text-center text-sm text-stone-400">
        Nenhuma mensagem ainda. Inicie a conversa.
      </p>
    );
  }

  return (
    <>
      {mensagens.map((msg) => {
        const ehMeu = msg.ator_usuario_id === usuarioId;
        const mensagemModeracao = ehMensagemModeracao(msg.tipo_ator);
        const legendaAutor = mensagemModeracao
          ? msg.tipo_ator === "usuario_admin"
            ? "Admin"
            : msg.tipo_ator === "usuario_moderador"
            ? "Moderador"
            : "Admin / Moderador"
          : null;

        return (
          <div
            key={msg.id}
            className={`flex flex-col gap-0.5 ${ehMeu ? "items-end" : "items-start"}`}
          >
            <span className="text-xs font-medium text-stone-500">
              {msg.nome_autor} ·{" "}
              {formatarHoraMensagem(msg.criada_em)}
            </span>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                mensagemModeracao
                  ? ehMeu
                    ? "border border-sky-300 bg-sky-600 text-white shadow-sm"
                    : "border border-sky-200 bg-sky-50 text-sky-950"
                  : ehMeu
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-stone-100 text-stone-900"
              }`}
            >
              {legendaAutor && (
                <p
                  className={`mb-1 text-[11px] font-semibold uppercase tracking-wide ${
                    ehMeu ? "text-sky-100" : "text-sky-700"
                  }`}
                >
                  {legendaAutor}
                </p>
              )}
              {msg.texto_mensagem}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </>
  );
}
