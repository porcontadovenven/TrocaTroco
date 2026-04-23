"use client";

import { useActionState } from "react";
import { aceitarSolicitacao, recusarSolicitacao, cancelarSolicitacao } from "@/modules/solicitacoes/actions";
import type { ResultadoAcao } from "@/modules/solicitacoes/actions";

export function BotoesRecebida({ solicitacaoId }: { solicitacaoId: string }) {
  const [estadoAceite, actionAceite, pendAceite] = useActionState<ResultadoAcao | undefined, FormData>(
    aceitarSolicitacao, undefined,
  );
  const [estadoRecusa, actionRecusa, pendRecusa] = useActionState<ResultadoAcao | undefined, FormData>(
    recusarSolicitacao, undefined,
  );

  return (
    <div className="flex flex-col gap-2">
      {(estadoAceite && !estadoAceite.ok) && (
        <p className="text-xs text-red-600">{estadoAceite.erro}</p>
      )}
      {(estadoRecusa && !estadoRecusa.ok) && (
        <p className="text-xs text-red-600">{estadoRecusa.erro}</p>
      )}
      {estadoRecusa?.ok && (
        <p className="text-xs text-stone-400">Recusada.</p>
      )}

      <form action={actionAceite} className="flex gap-2">
        <input type="hidden" name="solicitacao_id" value={solicitacaoId} />
        <button
          type="submit"
          disabled={pendAceite || pendRecusa}
          className="rounded-xl bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {pendAceite ? "Aceitando..." : "Aceitar"}
        </button>
      </form>

      <form action={actionRecusa}>
        <input type="hidden" name="solicitacao_id" value={solicitacaoId} />
        <button
          type="submit"
          disabled={pendAceite || pendRecusa}
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
        >
          {pendRecusa ? "Recusando..." : "Recusar"}
        </button>
      </form>
    </div>
  );
}

export function BotaoCancelar({
  solicitacaoId,
  prazoCancelamento,
}: {
  solicitacaoId: string;
  prazoCancelamento: string;
}) {
  const [estado, action, pendente] = useActionState<ResultadoAcao | undefined, FormData>(
    cancelarSolicitacao, undefined,
  );

  const dentroPrazo = new Date() < new Date(prazoCancelamento);
  if (!dentroPrazo) return null;

  return (
    <form action={action} className="flex flex-col gap-1">
      <input type="hidden" name="solicitacao_id" value={solicitacaoId} />
      {estado && !estado.ok && (
        <p className="text-xs text-red-600">{estado.erro}</p>
      )}
      {estado?.ok && <p className="text-xs text-stone-400">Cancelada.</p>}
      <button
        type="submit"
        disabled={pendente}
        className="rounded-xl border border-stone-300 px-3 py-1 text-xs font-medium text-stone-600 hover:bg-stone-50 disabled:opacity-60"
      >
        {pendente ? "Cancelando..." : "Cancelar"}
      </button>
    </form>
  );
}
