"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { registrarMensagemTicket } from "@/modules/admin/actions";
import type { ResultadoAcao } from "@/modules/admin/actions";

type Props = {
  ticketId: string;
  placeholder?: string;
  botaoLabel?: string;
  sucessoLabel?: string;
};

export function FormMensagemTicket({
  ticketId,
  placeholder = "Registrar andamento, decisão parcial ou observação...",
  botaoLabel = "Registrar mensagem",
  sucessoLabel = "Mensagem registrada no histórico.",
}: Props) {
  const router = useRouter();
  const [estado, action, pendente] = useActionState<ResultadoAcao | undefined, FormData>(
    registrarMensagemTicket,
    undefined,
  );

  useEffect(() => {
    if (estado?.ok) router.refresh();
  }, [estado, router]);

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="ticket_id" value={ticketId} />
      <textarea
        name="mensagem"
        rows={3}
        required
        placeholder={placeholder}
        className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs outline-none placeholder:text-stone-400 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder:text-stone-500"
      />
      {estado && !estado.ok && <p className="text-xs text-red-600">{estado.erro}</p>}
      {estado?.ok && <p className="text-xs text-emerald-700 dark:text-emerald-400">{sucessoLabel}</p>}
      <button
        type="submit"
        disabled={pendente}
        className="self-start rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-60 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
      >
        {pendente ? "Salvando..." : botaoLabel}
      </button>
    </form>
  );
}