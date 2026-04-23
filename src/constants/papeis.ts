/**
 * Papéis de usuário do sistema — Fase 4, seção 2.2
 * Deve refletir o enum `papel_usuario` do banco.
 */
export const PAPEIS = {
  USUARIO_EMPRESA: "usuario_empresa",
  USUARIO_ADMIN: "usuario_admin",
  USUARIO_MODERADOR: "usuario_moderador",
  USUARIO_ADMIN_MODERADOR: "usuario_admin_moderador",
} as const;

export type PapelUsuario = (typeof PAPEIS)[keyof typeof PAPEIS];

export const PAPEIS_ADMIN = [
  PAPEIS.USUARIO_ADMIN,
  PAPEIS.USUARIO_MODERADOR,
  PAPEIS.USUARIO_ADMIN_MODERADOR,
] as const;

export function isAdmin(papel: PapelUsuario): boolean {
  return (PAPEIS_ADMIN as readonly string[]).includes(papel);
}
