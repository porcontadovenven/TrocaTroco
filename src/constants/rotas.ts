/**
 * Rotas oficiais do MVP — Fase 5, seção 3
 * Não inventar rotas fora deste mapa.
 */

export const ROTAS = {
  // Públicas
  HOME: "/",
  LOGIN: "/login",
  RECUPERAR_SENHA: "/recuperar-senha",
  REDEFINIR_SENHA: "/redefinir-senha",
  CADASTRO: "/cadastro",
  ANUNCIOS: "/anuncios",
  ANUNCIO_DETALHE: (id: string) => `/anuncios/${id}`,
  EMPRESAS: "/empresas",
  EMPRESA_PERFIL: (id: string) => `/empresas/${id}`,

  // Empresa autenticada
  STATUS_CADASTRAL: "/status-cadastral",
  DASHBOARD: "/dashboard",
  ANUNCIAR: "/anunciar",
  MEUS_ANUNCIOS: "/meus-anuncios",
  SOLICITACOES: "/solicitacoes",
  NEGOCIACOES: "/negociacoes",
  TICKETS: "/tickets",
  NEGOCIACAO: (id: string) => `/negociacoes/${id}`,

  // Admin
  ADMIN: "/admin",
  ADMIN_ANALISE_CADASTRAL: "/admin/analise-cadastral",
  ADMIN_TICKETS: "/admin/tickets",
  ADMIN_MODERACAO_AVALIACOES: "/admin/moderacao-avaliacoes",
  ADMIN_MODERACAO_NEGOCIACOES: "/admin/moderacao-negociacoes",
} as const;

/** Prefixos protegidos que exigem sessão autenticada */
export const PREFIXOS_AUTENTICADOS = [
  "/status-cadastral",
  "/dashboard",
  "/anunciar",
  "/meus-anuncios",
  "/solicitacoes",
  "/negociacoes",
  "/tickets",
  "/admin",
] as const;

/** Prefixos exclusivos de admin/moderação */
export const PREFIXOS_ADMIN = ["/admin"] as const;
