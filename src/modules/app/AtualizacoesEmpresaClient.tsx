"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const TABELAS_REATIVAS = [
  "anuncios",
  "solicitacoes",
  "negociacoes",
  "avaliacoes",
] as const;

export function AtualizacoesEmpresaClient() {
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
    const channels = TABELAS_REATIVAS.map((tabela) =>
      supabase
        .channel(`refresh:${tabela}`)
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
    }, 20000);

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
  }, [router]);

  return null;
}