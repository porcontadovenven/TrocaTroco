import Link from "next/link";
import type { ReactNode } from "react";

import { APP_NAME } from "@/constants/app";
import { ROTAS } from "@/constants/rotas";

type Props = {
  titulo: string;
  descricao: string;
  children: ReactNode;
};

export function PaginaInstitucional({ titulo, descricao, children }: Props) {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href={ROTAS.HOME} className="text-sm font-medium text-stone-500 underline-offset-4 hover:underline">
            ← Voltar para a home
          </Link>
          <span className="text-sm font-semibold text-stone-400">{APP_NAME}</span>
        </div>

        <header className="mb-8 rounded-3xl border border-stone-200 bg-white px-6 py-8 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Informações da plataforma</p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">{titulo}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">{descricao}</p>
        </header>

        <div className="space-y-5">{children}</div>
      </div>
    </main>
  );
}