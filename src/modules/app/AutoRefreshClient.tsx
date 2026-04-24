"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type TabelaReativa = "anuncios" | "solicitacoes" | "negociacoes" | "avaliacoes" | "empresas";

type Props = {
  tabelas: TabelaReativa[];
  intervaloMs?: number;
};

export function AutoRefreshClient({ tabelas, intervaloMs = 20000 }: Props) {
  const router = useRouter();
  const ultimoRefreshRef = useRef(0);
  const instanceIdRef = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2),
  );

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
    const channels = tabelas.map((tabela) =>
      supabase
        .channel(`refresh:${instanceIdRef.current}:${tabela}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: tabela,
          },
          () => {
            refreshSeguro();
          },
        )
        .subscribe(),
    );

    const onFocus = () => refreshSeguro();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshSeguro();
      }
    };

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshSeguro();
      }
    }, intervaloMs);

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      channels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
    };
  }, [intervaloMs, router, tabelas]);

  return null;
}