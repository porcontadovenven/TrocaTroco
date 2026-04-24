"use client";

import { AutoRefreshClient } from "@/modules/app/AutoRefreshClient";

export function AtualizacoesEmpresaClient() {
  return <AutoRefreshClient tabelas={["anuncios", "solicitacoes", "negociacoes", "avaliacoes"]} />;
}