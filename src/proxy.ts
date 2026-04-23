import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { PREFIXOS_ADMIN, PREFIXOS_AUTENTICADOS, ROTAS } from "@/constants/rotas";

/**
 * Middleware de autorização — Fase 5, seções 7 e 8.
 *
 * Regras aplicadas (na ordem):
 * 1. Rotas de admin → exige sessão + papel admin/moderador
 * 2. Rotas autenticadas → exige sessão
 * 3. Se autenticado e tentar acessar /login → redireciona para a área correta
 *
 * A autorização fina por status da empresa (aprovada / em_analise) acontece
 * nas próprias páginas/layouts do servidor, onde temos o dado da empresa.
 * O middleware só carrega a sessão Auth, sem consulta ao banco, para ser rápido.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cria cliente Supabase que apenas lê/atualiza cookies de sessão
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Atualiza a sessão (necessário para o @supabase/ssr manter o token fresco)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const estaAutenticado = !!user;

  // Rota é de admin?
  const rotaAdmin = PREFIXOS_ADMIN.some((prefixo) =>
    pathname.startsWith(prefixo),
  );

  // Rota exige autenticação?
  const rotaProtegida = PREFIXOS_AUTENTICADOS.some((prefixo) =>
    pathname.startsWith(prefixo),
  );

  // 1. Não autenticado tentando acessar rota protegida
  if ((rotaProtegida || rotaAdmin) && !estaAutenticado) {
    const url = request.nextUrl.clone();
    url.pathname = ROTAS.LOGIN;
    return NextResponse.redirect(url);
  }

  // 2. Autenticado tentando acessar /login
  if (pathname === ROTAS.LOGIN && estaAutenticado) {
    const url = request.nextUrl.clone();
    url.pathname = ROTAS.DASHBOARD;
    return NextResponse.redirect(url);
  }

  // 3. Para rotas admin, a verificação de papel acontece no layout /admin
  //    (o middleware não consulta o banco para não adicionar latência extra)

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagem)
     * - favicon.ico
     * - arquivos públicos com extensão
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
