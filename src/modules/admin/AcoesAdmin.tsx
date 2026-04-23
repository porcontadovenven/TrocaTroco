"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  encerrarTicket,
  assumirTicket,
  aprovarComentario,
  barrarComentario,
} from "@/modules/admin/actions";
import type { ResultadoAcao } from "@/modules/admin/actions";

// ---------------------------------------------------------------------------
// Botão assumir ticket
// ---------------------------------------------------------------------------
export function BotaoAssumirTicket({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [estado, action, pendente] = useActionState<ResultadoAcao | undefined, FormData>(
    assumirTicket,
    undefined,
  );

  useEffect(() => {
    if (estado?.ok) router.refresh();
  }, [estado, router]);

  return (
    <form action={action} className="inline">
      <input type="hidden" name="ticket_id" value={ticketId} />
      {estado && !estado.ok && (
        <p className="text-xs text-red-600">{estado.erro}</p>
      )}
      <button
        type="submit"
        disabled={pendente}
        className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-60"
      >
        {pendente ? "..." : "Assumir"}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Formulário encerrar ticket
// ---------------------------------------------------------------------------
export function FormEncerrarTicket({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [estado, action, pendente] = useActionState<ResultadoAcao | undefined, FormData>(
    encerrarTicket,
    undefined,
  );

  useEffect(() => {
    if (estado?.ok) router.refresh();
  }, [estado, router]);

  if (estado?.ok) {
    return (
      <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
        Ticket encerrado.
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="ticket_id" value={ticketId} />
      <textarea
        name="resumo_resolucao"
        rows={2}
        required
        placeholder="Resolução / decisão tomada..."
        className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs outline-none placeholder:text-stone-400 focus:border-stone-400 focus:ring-1 focus:ring-stone-200"
      />
      {estado && !estado.ok && (
        <p className="text-xs text-red-600">{estado.erro}</p>
      )}
      <button
        type="submit"
        disabled={pendente}
        className="rounded-xl bg-stone-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-700 disabled:opacity-60"
      >
        {pendente ? "Encerrando..." : "Encerrar ticket"}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Botões moderação de avaliação
// ---------------------------------------------------------------------------
export function BotoesModeracao({ avaliacaoId }: { avaliacaoId: string }) {
  const router = useRouter();
  const [estadoAprovar, actionAprovar, pendenteAprovar] = useActionState<
    ResultadoAcao | undefined,
    FormData
  >(aprovarComentario, undefined);

  const [estadoBarrar, actionBarrar, pendenteBarrar] = useActionState<
    ResultadoAcao | undefined,
    FormData
  >(barrarComentario, undefined);

  useEffect(() => {
    if (estadoAprovar?.ok || estadoBarrar?.ok) router.refresh();
  }, [estadoAprovar, estadoBarrar, router]);

  if (estadoAprovar?.ok) {
    return (
      <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
        Comentário aprovado.
      </p>
    );
  }

  if (estadoBarrar?.ok) {
    return (
      <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
        Comentário barrado.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Aprovar */}
      <form action={actionAprovar} className="inline">
        <input type="hidden" name="avaliacao_id" value={avaliacaoId} />
        {estadoAprovar && !estadoAprovar.ok && (
          <p className="mb-1 text-xs text-red-600">{estadoAprovar.erro}</p>
        )}
        <button
          type="submit"
          disabled={pendenteAprovar || pendenteBarrar}
          className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {pendenteAprovar ? "..." : "Aprovar"}
        </button>
      </form>

      {/* Barrar */}
      <form action={actionBarrar} className="flex flex-col gap-2">
        <input type="hidden" name="avaliacao_id" value={avaliacaoId} />
        <input
          name="motivo_moderacao"
          placeholder="Motivo (opcional)"
          className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs outline-none placeholder:text-stone-400 focus:border-stone-300"
        />
        {estadoBarrar && !estadoBarrar.ok && (
          <p className="text-xs text-red-600">{estadoBarrar.erro}</p>
        )}
        <button
          type="submit"
          disabled={pendenteAprovar || pendenteBarrar}
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
        >
          {pendenteBarrar ? "..." : "Barrar"}
        </button>
      </form>
    </div>
  );
}
