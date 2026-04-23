"use client";

import { useState } from "react";
import { useActionState } from "react";
import { criarSolicitacao } from "@/modules/solicitacoes/actions";
import type { ResultadoAcao, LocalTroca } from "@/modules/solicitacoes/actions";

const MEIOS_PAGAMENTO = ["Dinheiro", "PIX", "Crédito", "Débito"];
const LOCAIS: { valor: LocalTroca; label: string }[] = [
  { valor: "empresa_autora", label: "Na empresa anunciante" },
  { valor: "empresa_solicitante", label: "Na minha empresa" },
];

export function FormSolicitacao({
  anuncioId,
  valorMaximo,
  permiteParcial,
  aceita_local_proprio,
}: {
  anuncioId: string;
  valorMaximo: number;
  permiteParcial: boolean;
  aceita_local_proprio: boolean | null;
}) {
  const [parcial, setParcial] = useState(false);
  const [valor, setValor] = useState(valorMaximo.toFixed(2));
  const [local, setLocal] = useState<LocalTroca>("empresa_autora");
  const [meio, setMeio] = useState("");
  const [erroLocal, setErroLocal] = useState<string | null>(null);

  const [estado, action, pendente] = useActionState<ResultadoAcao | undefined, FormData>(
    criarSolicitacao, undefined,
  );

  // Filtra locais disponíveis conforme regra do anúncio
  const locaisDisponiveis: { valor: LocalTroca; label: string }[] =
    aceita_local_proprio === false
      ? LOCAIS.filter((l) => l.valor !== "empresa_autora")
      : LOCAIS;

  function handleSubmit(e: React.FormEvent) {
    const v = parseFloat(valor);
    if (!v || v <= 0 || v > valorMaximo) {
      e.preventDefault();
      setErroLocal(`Valor inválido. Máximo: R$ ${valorMaximo.toFixed(2)}`);
      return;
    }
    if (!meio) {
      e.preventDefault();
      setErroLocal("Informe o meio de pagamento.");
      return;
    }
    setErroLocal(null);
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="hidden" name="anuncio_id" value={anuncioId} />
      <input type="hidden" name="parcial" value={String(parcial)} />
      <input type="hidden" name="itens_composicao" value="[]" />

      {/* Valor */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-stone-700">
          Valor solicitado (R$)
        </label>
        <input
          name="valor_solicitado"
          type="number"
          step="0.01"
          min="0.01"
          max={valorMaximo}
          value={valor}
          onChange={(e) => {
            setValor(e.target.value);
            if (parseFloat(e.target.value) < valorMaximo) setParcial(true);
            else setParcial(false);
          }}
          className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
        />
        {permiteParcial && (
          <p className="text-xs text-stone-400">
            Máximo disponível: R$ {valorMaximo.toFixed(2)} — parcial permitido
          </p>
        )}
        {!permiteParcial && (
          <p className="text-xs text-stone-400">
            Somente valor integral: R$ {valorMaximo.toFixed(2)}
          </p>
        )}
      </div>

      {/* Meio de pagamento */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-stone-700">
          Meio de pagamento
        </label>
        <div className="flex flex-wrap gap-2">
          {MEIOS_PAGAMENTO.map((m) => (
            <label key={m} className="flex items-center gap-1.5 text-sm text-stone-700">
              <input
                type="radio"
                name="meio_pagamento"
                value={m}
                checked={meio === m}
                onChange={() => setMeio(m)}
                className="accent-stone-900"
              />
              {m}
            </label>
          ))}
        </div>
      </div>

      {/* Local da troca */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-stone-700">
          Local da troca
        </label>
        <div className="flex flex-col gap-1.5">
          {locaisDisponiveis.map((l) => (
            <label key={l.valor} className="flex items-center gap-2 text-sm text-stone-700">
              <input
                type="radio"
                name="local_troca"
                value={l.valor}
                checked={local === l.valor}
                onChange={() => setLocal(l.valor)}
                className="accent-stone-900"
              />
              {l.label}
            </label>
          ))}
        </div>
      </div>

      {/* Erros */}
      {(erroLocal || (estado && !estado.ok)) && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {erroLocal ?? (estado && !estado.ok ? estado.erro : "")}
        </p>
      )}

      <button
        type="submit"
        disabled={pendente}
        className="rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-700 disabled:opacity-60"
      >
        {pendente ? "Enviando..." : "Enviar solicitação"}
      </button>
    </form>
  );
}
