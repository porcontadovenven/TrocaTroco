/**
 * Rotas oficiais do MVP — Fase 5, seção 3
 * Não inventar rotas fora deste mapa.
 */

export const ROTAS = {
  // Públicas
  HOME: "/",
  LOGIN: "/login",
  CADASTRO: "/cadastro",
  ANUNCIOS: "/anuncios",
  ANUNCIO_DETALHE: (id: string) => `/anuncios/${id}`,
  EMPRESA_PERFIL: (id: string) => `/empresas/${id}`,

  // Empresa autenticada
  STATUS_CADASTRAL: "/status-cadastral",
  DASHBOARD: "/dashboard",
  ANUNCIAR: "/anunciar",
  MEUS_ANUNCIOS: "/meus-anuncios",
  SOLICITACOES: "/solicitacoes",
  NEGOCIACAO: (id: string) => `/negociacoes/${id}`,

  // Admin
  ADMIN: "/admin",
  ADMIN_ANALISE_CADASTRAL: "/admin/analise-cadastral",
  ADMIN_TICKETS: "/admin/tickets",
  ADMIN_MODERACAO_AVALIACOES: "/admin/moderacao-avaliacoes",
} as const;

/** Prefixos protegidos que exigem sessão autenticada */
export const PREFIXOS_AUTENTICADOS = [
  "/status-cadastral",
  "/dashboard",
  "/anunciar",
  "/meus-anuncios",
  "/solicitacoes",
  "/negociacoes",
  "/admin",
] as const;

/** Prefixos exclusivos de admin/moderação */
export const PREFIXOS_ADMIN = ["/admin"] as const;
