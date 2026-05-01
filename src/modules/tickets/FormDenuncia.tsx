"use client";

import Link from "next/link";
import { useActionState } from "react";
import { abrirTicket } from "@/modules/admin/actions";
import { ROTAS } from "@/constants/rotas";
import type { ResultadoAcao } from "@/modules/admin/actions";

interface Props {
  /** ID da entidade denunciada (empresa, anúncio ou negociação) */
  origemId: string;
  /** Tipo de origem conforme enum do banco */
  tipoOrigem?: "perfil_empresa" | "administrativo" | "outro_contexto";
}

export function FormDenuncia({ origemId, tipoOrigem = "perfil_empresa" }: Props) {
  const [estado, action, pendente] = useActionState<ResultadoAcao | undefined, FormData>(
    abrirTicket,
    undefined,
  );

  if (estado?.ok) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 dark:border-emerald-900/60 dark:bg-emerald-950/50">
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          Ticket enviado com sucesso. Nossa equipe irá analisar em breve.
        </p>
        <Link
          href={ROTAS.TICKETS}
          className="mt-3 inline-block text-sm font-medium text-emerald-800 underline underline-offset-4 dark:text-emerald-400"
        >
          Acompanhar denúncia
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="origem_id" value={origemId} />
      <input type="hidden" name="tipo_origem" value={tipoOrigem} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="assunto" className="text-sm font-medium text-stone-700 dark:text-stone-300">
          Assunto
        </label>
        <input
          id="assunto"
          name="assunto"
          required
          maxLength={120}
          placeholder="Descreva brevemente o problema"
          className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder:text-stone-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="descricao" className="text-sm font-medium text-stone-700 dark:text-stone-300">
          Detalhes
        </label>
        <textarea
          id="descricao"
          name="descricao"
          required
          rows={4}
          placeholder="Explique o que aconteceu com o máximo de detalhes possível..."
          className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder:text-stone-500"
        />
      </div>

      {estado && !estado.ok && (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {estado.erro}
        </p>
      )}

      <button
        type="submit"
        disabled={pendente}
        className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
      >
        {pendente ? "Enviando..." : "Enviar denúncia"}
      </button>
    </form>
  );
}
