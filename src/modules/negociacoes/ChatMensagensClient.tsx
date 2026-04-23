"use client";

import dynamic from "next/dynamic";

type MensagemInicial = {
  id: string;
  ator_usuario_id: string;
  texto_mensagem: string;
  tipo_ator: string;
  criada_em: string;
  nome_autor: string;
  empresa_id_autor: string;
};

const ChatMensagens = dynamic(
  () => import("@/modules/negociacoes/ChatMensagens").then((mod) => mod.ChatMensagens),
  {
    ssr: false,
    loading: () => <p className="text-center text-sm text-stone-400">Carregando mensagens...</p>,
  },
);

interface Props {
  negociacaoId: string;
  mensagensIniciais: MensagemInicial[];
  usuarioId: string;
}

export function ChatMensagensClient({ negociacaoId, mensagensIniciais, usuarioId }: Props) {
  return (
    <ChatMensagens
      key={`${negociacaoId}:${mensagensIniciais.length}:${mensagensIniciais.at(-1)?.id ?? "vazio"}`}
      negociacaoId={negociacaoId}
      mensagensIniciais={mensagensIniciais}
      usuarioId={usuarioId}
    />
  );
}