"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutAction } from "@/modules/auth/actions";
import { APP_NAME } from "@/constants/app";

function LogoMarca() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 shadow-sm">
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
      <span className="text-sm font-bold tracking-tight text-stone-900">
        {APP_NAME}
      </span>
    </div>
  );
}

function Avatar({ nome }: { nome: string }) {
  const iniciais = nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 ring-2 ring-white">
      {iniciais}
    </div>
  );
}

type NavItem = { href: string; label: string };

type BarraSessaoProps = {
  nome: string;
  email: string;
  tituloArea: string;
  hrefArea: string;
  rotuloArea: string;
  navItems?: NavItem[];
};

function NavLink({ href, label }: NavItem) {
  const pathname = usePathname();
  const ativo = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={`relative px-1 py-1 text-sm font-medium transition-colors ${
        ativo
          ? "text-emerald-700"
          : "text-stone-500 hover:text-stone-900"
      }`}
    >
      {label}
      {ativo && (
        <span className="absolute -bottom-[13px] left-0 right-0 h-0.5 rounded-full bg-emerald-600" />
      )}
    </Link>
  );
}

export function BarraSessao({
  nome,
  email,
  hrefArea,
  rotuloArea,
  navItems,
}: BarraSessaoProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo + área */}
        <div className="flex min-w-0 items-center gap-4">
          <Link href={hrefArea} className="shrink-0">
            <LogoMarca />
          </Link>
          {navItems && navItems.length > 0 && (
            <>
              <span className="hidden h-4 w-px shrink-0 bg-stone-200 sm:block" />
              <nav className="hidden items-center gap-5 sm:flex">
                {navItems.map((item) => (
                  <NavLink key={item.href} href={item.href} label={item.label} />
                ))}
              </nav>
            </>
          )}
          {!navItems && (
            <>
              <span className="hidden h-4 w-px shrink-0 bg-stone-200 sm:block" />
              <Link
                href={hrefArea}
                className="hidden truncate text-sm font-medium text-stone-500 transition-colors hover:text-stone-800 sm:block"
              >
                {rotuloArea}
              </Link>
            </>
          )}
        </div>

        {/* Usuário + sair */}
        <div className="flex items-center gap-3">
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-sm font-semibold leading-tight text-stone-800">
              {nome}
            </span>
            <span className="text-xs leading-tight text-stone-400">{email}</span>
          </div>
          <Avatar nome={nome} />
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
            >
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
