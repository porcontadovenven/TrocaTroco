import Link from "next/link";

import { logoutAction } from "@/modules/auth/actions";
import { APP_NAME } from "@/constants/app";
import { ThemeSelector } from "@/modules/theme/ThemeSelector";

function LogoMarca() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 shadow-sm shadow-emerald-600/20">
        <svg
          width="15"
          height="15"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 6H13L10 3M13 6L10 9"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 12H5L8 9M5 12L8 15"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-50">
        {APP_NAME}
      </span>
    </div>
  );
}

type BarraSessaoProps = {
  nome: string;
  email: string;
  tituloArea: string;
  hrefArea: string;
  rotuloArea: string;
  navItems?: Array<{
    href: string;
    label: string;
  }>;
};

export function BarraSessao({
  nome,
  email,
  hrefArea,
  rotuloArea,
  navItems = [],
}: BarraSessaoProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur-md dark:border-stone-800/80 dark:bg-stone-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo + área + navegação */}
        <div className="flex min-w-0 items-center gap-3">
          <Link href={hrefArea} className="shrink-0">
            <LogoMarca />
          </Link>
          <span className="hidden h-4 w-px shrink-0 bg-stone-200 dark:bg-stone-700 sm:block" />
          <Link
            href={hrefArea}
            className="hidden truncate text-sm font-medium text-stone-500 transition-colors hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 sm:block"
          >
            {rotuloArea}
          </Link>
          {navItems.length > 0 && (
            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-2.5 py-1.5 text-sm text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Usuário + tema + sair */}
        <div className="flex items-center gap-2.5">
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-sm font-medium leading-tight text-stone-800 dark:text-stone-200">
              {nome}
            </span>
            <span className="text-xs leading-tight text-stone-400 dark:text-stone-500">{email}</span>
          </div>
          <ThemeSelector />
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 transition-all hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-200"
            >
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}