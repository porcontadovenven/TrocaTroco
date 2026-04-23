"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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

type NavItem = {
  href?: string;
  label: string;
  children?: Array<{ href: string; label: string }>;
};

type BarraSessaoProps = {
  nome: string;
  email: string;
  tituloArea: string;
  hrefArea: string;
  rotuloArea: string;
  navItems?: NavItem[];
};

function ChevronBaixo({ aberto = false }: { aberto?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-4 w-4 transition-transform ${aberto ? "rotate-180" : ""}`}
      fill="none"
    >
      <path
        d="M5 7.5 10 12.5 15 7.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function navItemAtivo(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const ativo = navItemAtivo(pathname, href);
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

function NavGrupoDesktop({ label, children }: { label: string; children: Array<{ href: string; label: string }> }) {
  const pathname = usePathname();
  const ativo = children.some((item) => navItemAtivo(pathname, item.href));

  return (
    <details className="group relative">
      <summary
        className={`flex cursor-pointer list-none items-center gap-1 px-1 py-1 text-sm font-medium transition-colors [&::-webkit-details-marker]:hidden ${
          ativo ? "text-emerald-700" : "text-stone-500 hover:text-stone-900"
        }`}
      >
        {label}
        <ChevronBaixo />
      </summary>
      <div className="absolute left-0 top-full z-50 mt-3 min-w-52 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl shadow-stone-200/60">
        {children.map((item) => {
          const itemAtivo = navItemAtivo(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex rounded-xl px-3 py-2 text-sm transition-colors ${
                itemAtivo
                  ? "bg-emerald-50 font-semibold text-emerald-700"
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </details>
  );
}

function NavGrupoMobile({ label, children }: { label: string; children: Array<{ href: string; label: string }> }) {
  const pathname = usePathname();
  const ativo = children.some((item) => navItemAtivo(pathname, item.href));

  return (
    <details className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
      <summary
        className={`flex cursor-pointer list-none items-center justify-between text-sm font-semibold [&::-webkit-details-marker]:hidden ${
          ativo ? "text-emerald-700" : "text-stone-700"
        }`}
      >
        {label}
        <ChevronBaixo />
      </summary>
      <div className="mt-3 flex flex-col gap-2 border-t border-stone-200 pt-3">
        {children.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl px-3 py-2 text-sm ${
              navItemAtivo(pathname, item.href)
                ? "bg-emerald-50 font-semibold text-emerald-700"
                : "text-stone-600 hover:bg-white hover:text-stone-900"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  );
}

export function BarraSessao({
  nome,
  email,
  hrefArea,
  rotuloArea,
  navItems,
}: BarraSessaoProps) {
  const [menuAberto, setMenuAberto] = useState(false);

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
              <span className="hidden h-4 w-px shrink-0 bg-stone-200 lg:block" />
              <nav className="hidden items-center gap-5 lg:flex">
                {navItems.map((item) => (
                  item.children?.length ? (
                    <NavGrupoDesktop key={item.label} label={item.label} children={item.children} />
                  ) : item.href ? (
                    <NavLink key={item.href} href={item.href} label={item.label} />
                  ) : null
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
          {navItems && navItems.length > 0 && (
            <button
              type="button"
              onClick={() => setMenuAberto((aberto) => !aberto)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900 lg:hidden"
              aria-label="Abrir navegação"
              aria-expanded={menuAberto}
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none">
                <path d="M4 6h12M4 10h12M4 14h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
          )}
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

      {navItems && navItems.length > 0 && menuAberto && (
        <div className="border-t border-stone-200 bg-white px-4 py-4 lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-3">
            {navItems.map((item) => (
              item.children?.length ? (
                <NavGrupoMobile key={item.label} label={item.label} children={item.children} />
              ) : item.href ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-white"
                  onClick={() => setMenuAberto(false)}
                >
                  {item.label}
                </Link>
              ) : null
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
