"use client";

import { useActionState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  enviarMensagem,
  chamarModerador,
  encerrarOperacaoNegociacao,
  enviarAvaliacao,
} from "@/modules/negociacoes/actions";
import type { ResultadoAcao } from "@/modules/negociacoes/actions";

// ---------------------------------------------------------------------------
// Chat input — envio de mensagem
// ---------------------------------------------------------------------------
export function ChatInput({ negociacaoId }: { negociacaoId: string }) {
  const [estado, action, pendente] = useActionState<ResultadoAcao | undefined, FormData>(
    enviarMensagem,
    undefined,
  );
  const ref = useRef<HTMLFormElement>(null);

  // Limpa o campo ao enviar com sucesso
  useEffect(() => {
    if (estado?.ok) ref.current?.reset();
  }, [estado]);

  return (
    <form ref={ref} action={action} className="flex gap-2">
      <input type="hidden" name="negociacao_id" value={negociacaoId} />
      <input
        name="texto_mensagem"
        placeholder="Digite sua mensagem..."
        autoComplete="off"
        required
        className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
      />
      <button
        type="submit"
        disabled={pendente}
        className="rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-700 disabled:opacity-60"
      >
        {pendente ? "..." : "Enviar"}
      </button>
      {estado && !estado.ok && (
        <p className="absolute mt-12 text-xs text-red-600">{estado.erro}</p>
      )}
    </form>
  );
}

// ---------------------------------------------------------------------------
// Botão chamar moderador
// ---------------------------------------------------------------------------
export function BotaoChamarModerador({ negociacaoId }: { negociacaoId: string }) {
  const router = useRouter();
  const [estado, action, pendente] = useActionState<ResultadoAcao | undefined, FormData>(
    chamarModerador,
    undefined,
  );

  useEffect(() => {
    if (estado?.ok) router.refresh();
  }, [estado, router]);

  return (
    <form action={action} className="flex flex-col gap-1">
      <input type="hidden" name="negociacao_id" value={negociacaoId} />
      {estado && !estado.ok && <p className="text-xs text-red-600">{estado.erro}</p>}
      {estado?.ok && <p className="text-xs text-amber-700">Moderador acionado.</p>}
      <button
        type="submit"
        disabled={pendente}
        className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-60"
      >
        {pendente ? "Acionando..." : "Chamar moderador"}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Botão encerrar operação
// ---------------------------------------------------------------------------
export function BotaoEncerrarOperacao({ negociacaoId }: { negociacaoId: string }) {
  const router = useRouter();
  const [estado, action, pendente] = useActionState<ResultadoAcao | undefined, FormData>(
    encerrarOperacaoNegociacao,
    undefined,
  );

  useEffect(() => {
    if (estado?.ok) router.refresh();
  }, [estado, router]);

  return (
    <form action={action} className="flex flex-col gap-1">
      <input type="hidden" name="negociacao_id" value={negociacaoId} />
      {estado && !estado.ok && <p className="text-xs text-red-600">{estado.erro}</p>}
      <button
        type="submit"
        disabled={pendente}
        className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
      >
        {pendente ? "Encerrando..." : "Concluir negociação"}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Formulário de avaliação
// ---------------------------------------------------------------------------
export function FormAvaliacao({ negociacaoId }: { negociacaoId: string }) {
  const router = useRouter();
  const [estado, action, pendente] = useActionState<ResultadoAcao | undefined, FormData>(
    enviarAvaliacao,
    undefined,
  );

  useEffect(() => {
    if (estado?.ok) router.refresh();
  }, [estado, router]);

  const estrelas = [1, 2, 3, 4, 5];

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="negociacao_id" value={negociacaoId} />

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-stone-700">Nota (obrigatório)</p>
        <div className="flex gap-3">
          {estrelas.map((n) => (
            <label key={n} className="flex cursor-pointer flex-col items-center gap-1">
              <input
                type="radio"
                name="nota"
                value={n}
                required
                className="sr-only"
              />
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-lg font-bold text-stone-600 hover:bg-amber-50 hover:border-amber-300 [input:checked+&]:bg-amber-400 [input:checked+&]:text-white [input:checked+&]:border-amber-500">
                {n}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="texto_comentario" className="text-sm font-medium text-stone-700">
          Comentário (opcional)
        </label>
        <textarea
          id="texto_comentario"
          name="texto_comentario"
          rows={3}
          placeholder="Descreva sua experiência com esta empresa..."
          className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
        />
        <p className="text-xs text-stone-400">
          Comentários passam por moderação antes de serem publicados.
        </p>
      </div>

      {estado && !estado.ok && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {estado.erro}
        </p>
      )}
      {estado?.ok && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          Avaliação enviada com sucesso!
        </p>
      )}

      <button
        type="submit"
        disabled={pendente || estado?.ok}
        className="rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-700 disabled:opacity-60"
      >
        {pendente ? "Enviando..." : "Enviar avaliação"}
      </button>
    </form>
  );
}
