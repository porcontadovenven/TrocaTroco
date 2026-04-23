"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

interface Mensagem {
  id: string;
  texto_mensagem: string;
  tipo_ator: string;
  criada_em: string;
  nome_autor: string;
  empresa_id_autor: string;
}

interface Props {
  negociacaoId: string;
  mensagensIniciais: Mensagem[];
  empresaId: string; // empresa do usuário logado
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

export function ChatMensagens({ negociacaoId, mensagensIniciais, empresaId }: Props) {
  const [mensagens, setMensagens] = useState<Mensagem[]>(mensagensIniciais);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMensagens((prev) => mesclarMensagens(prev, mensagensIniciais));
  }, [mensagensIniciais]);

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

          // Busca nome e empresa_id do autor para exibição correta
          const { data: usuario } = await supabase
            .from("usuarios")
            .select("nome_completo, empresa_id")
            .eq("id", nova.ator_usuario_id)
            .single();

          setMensagens((prev) => mesclarMensagens(prev, [
            {
              id: nova.id,
              texto_mensagem: nova.texto_mensagem,
              tipo_ator: nova.tipo_ator,
              criada_em: nova.criada_em,
              nome_autor: usuario?.nome_completo ?? "—",
              empresa_id_autor: usuario?.empresa_id ?? "",
            },
          ]));
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
        const ehMeu = msg.empresa_id_autor === empresaId;

        return (
          <div
            key={msg.id}
            className={`flex flex-col gap-0.5 ${ehMeu ? "items-end" : "items-start"}`}
          >
            <span className="text-xs text-stone-400">
              {msg.nome_autor} ·{" "}
              {new Date(msg.criada_em).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                ehMeu
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-800"
              }`}
            >
              {msg.texto_mensagem}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </>
  );
}
