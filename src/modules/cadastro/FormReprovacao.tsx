"use client";

import { useActionState } from "react";
import { reprovarSubmissao } from "@/modules/cadastro/actions";
import type { ResultadoAcao } from "@/modules/cadastro/actions";

export function FormReprovacao({
  empresaId,
  submissaoId,
}: {
  empresaId: string;
  submissaoId: string;
}) {
  const [estado, action, pendente] = useActionState<
    ResultadoAcao | undefined,
    FormData
  >(reprovarSubmissao, undefined);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="empresa_id" value={empresaId} />
      <input type="hidden" name="submissao_id" value={submissaoId} />

      <input
        name="motivo_codigo"
        placeholder="Código (opcional)"
        className="rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
      />
      <textarea
        name="motivo_texto"
        required
        rows={3}
        placeholder="Descreva o motivo da reprovação (obrigatório)"
        className="rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
      />

      {estado && !estado.ok && (
        <p className="text-sm text-red-600">{estado.erro}</p>
      )}
      {estado?.ok && (
        <p className="text-sm text-emerald-600">Empresa reprovada com sucesso.</p>
      )}

      <button
        type="submit"
        disabled={pendente}
        className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
      >
        {pendente ? "Reprovando..." : "Reprovar"}
      </button>
    </form>
  );
}
