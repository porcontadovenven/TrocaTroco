"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { excluirAnuncio } from "@/modules/anuncios/actions";
import type { ResultadoAcao } from "@/modules/anuncios/actions";

type AcoesAnuncioProps = {
  anuncioId: string;
  hrefEditar: string;
  hrefAposExcluir?: string;
  compacta?: boolean;
};

export function AcoesAnuncio({
  anuncioId,
  hrefEditar,
  hrefAposExcluir,
  compacta = false,
}: AcoesAnuncioProps) {
  const router = useRouter();
  const [estado, action, pendente] = useActionState<ResultadoAcao | undefined, FormData>(
    excluirAnuncio,
    undefined,
  );

  useEffect(() => {
    if (!estado?.ok) {
      return;
    }

    if (hrefAposExcluir) {
      router.push(hrefAposExcluir);
    }
    router.refresh();
  }, [estado, hrefAposExcluir, router]);

  return (
    <div className={`flex ${compacta ? "flex-wrap items-center gap-2" : "flex-col gap-2"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={hrefEditar}
          className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
        >
          Editar
        </Link>

        <form
          action={action}
          onSubmit={(event) => {
            if (!window.confirm("Deseja realmente excluir este anúncio?")) {
              event.preventDefault();
            }
          }}
        >
          <input type="hidden" name="anuncio_id" value={anuncioId} />
          <button
            type="submit"
            disabled={pendente}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-100 disabled:opacity-60 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-950"
          >
            {pendente ? "Processando..." : "Excluir"}
          </button>
        </form>
      </div>

      {estado?.ok && estado.mensagem && (
        <p className="text-xs text-stone-500">{estado.mensagem}</p>
      )}
      {estado && !estado.ok && (
        <p className="text-xs text-red-600">{estado.erro}</p>
      )}
    </div>
  );
}