import Link from "next/link";

import { logoutAction } from "@/modules/auth/actions";

type BarraSessaoProps = {
  nome: string;
  email: string;
  tituloArea: string;
  hrefArea: string;
  rotuloArea: string;
};

export function BarraSessao({
  nome,
  email,
  tituloArea,
  hrefArea,
  rotuloArea,
}: BarraSessaoProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
            {tituloArea}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link
              href={hrefArea}
              className="text-sm font-semibold text-stone-900 underline-offset-4 hover:underline"
            >
              {rotuloArea}
            </Link>
            <span className="text-sm text-stone-500">{nome}</span>
            <span className="truncate text-xs text-stone-400">{email}</span>
          </div>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
          >
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}