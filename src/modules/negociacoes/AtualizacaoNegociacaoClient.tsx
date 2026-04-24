"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type Props = {
  negociacaoId: string;
};

export function AtualizacaoNegociacaoClient({ negociacaoId }: Props) {
  const router = useRouter();
  const ultimoRefreshRef = useRef(0);

  useEffect(() => {
    const refreshSeguro = () => {
      const agora = Date.now();

      if (agora - ultimoRefreshRef.current < 1200) {
        return;
      }

      ultimoRefreshRef.current = agora;
      router.refresh();
    };

    const supabase = getSupabaseBrowserClient();

    const channelNegociacao = supabase
      .channel(`negociacao-status:${negociacaoId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "negociacoes",
          filter: `id=eq.${negociacaoId}`,
        },
        () => refreshSeguro(),
      )
      .subscribe();

    const channelAvaliacoes = supabase
      .channel(`negociacao-avaliacoes:${negociacaoId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "avaliacoes",
          filter: `negociacao_id=eq.${negociacaoId}`,
        },
        () => refreshSeguro(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelNegociacao);
      supabase.removeChannel(channelAvaliacoes);
    };
  }, [negociacaoId, router]);

  return null;
}