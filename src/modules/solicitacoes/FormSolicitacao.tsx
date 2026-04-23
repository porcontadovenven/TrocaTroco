"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { criarSolicitacao } from "@/modules/solicitacoes/actions";
import type { ResultadoAcao, LocalTroca } from "@/modules/solicitacoes/actions";

const MEIOS_PAGAMENTO = ["Dinheiro", "PIX", "Crédito", "Débito"];
const ITEM_LABEL = {
  cedula: "Cédula",
  moeda: "Moeda",
} as const;
const LOCAIS: { valor: LocalTroca; label: string }[] = [
  { valor: "empresa_autora", label: "Na empresa anunciante" },
  { valor: "empresa_solicitante", label: "Na minha empresa" },
];

type ItemAnuncio = {
  id: string;
  tipo_item: "cedula" | "moeda";
  valor_unitario: number;
  quantidade: number;
};

export function FormSolicitacao({
  anuncioId,
  valorMaximo,
  permiteParcial,
  aceita_local_proprio,
  itensAnuncio,
}: {
  anuncioId: string;
  valorMaximo: number;
  permiteParcial: boolean;
  aceita_local_proprio: boolean | null;
  itensAnuncio: ItemAnuncio[];
}) {
  const [parcial, setParcial] = useState(false);
  const [local, setLocal] = useState<LocalTroca>("empresa_autora");
  const [meio, setMeio] = useState("");
  const [erroLocal, setErroLocal] = useState<string | null>(null);
  const [quantidadesSelecionadas, setQuantidadesSelecionadas] = useState<Record<string, number>>({});

  const [estado, action, pendente] = useActionState<ResultadoAcao | undefined, FormData>(
    criarSolicitacao, undefined,
  );

  // Filtra locais disponíveis conforme regra do anúncio
  const locaisDisponiveis: { valor: LocalTroca; label: string }[] =
    aceita_local_proprio === false
      ? LOCAIS.filter((l) => l.valor !== "empresa_autora")
      : LOCAIS;

  const itensSelecionados = itensAnuncio
    .map((item) => ({
      item_anuncio_id: item.id,
      tipo_item: item.tipo_item,
      valor_unitario: item.valor_unitario,
      quantidade: quantidadesSelecionadas[item.id] ?? 0,
    }))
    .filter((item) => item.quantidade > 0);

  const totalSelecionado = itensSelecionados.reduce(
    (acc, item) => acc + item.valor_unitario * item.quantidade,
    0,
  );

  const valorSolicitado = parcial ? totalSelecionado : valorMaximo;

  const itensSelecionadosJson = JSON.stringify(itensSelecionados);

  useEffect(() => {
    if (!parcial) {
      setQuantidadesSelecionadas({});
      setErroLocal(null);
    }
  }, [parcial]);

  function atualizarQuantidade(itemId: string, quantidade: number, quantidadeMaxima: number) {
    setQuantidadesSelecionadas((atual) => ({
      ...atual,
      [itemId]: Math.max(0, Math.min(quantidadeMaxima, Number.isFinite(quantidade) ? Math.trunc(quantidade) : 0)),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    const v = valorSolicitado;
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
    if (parcial) {
      if (itensSelecionados.length === 0) {
        e.preventDefault();
        setErroLocal("Selecione a composição desejada para solicitação parcial.");
        return;
      }

      if (Math.abs(totalSelecionado - v) > 0.009) {
        e.preventDefault();
        setErroLocal(`A composição selecionada totaliza R$ ${totalSelecionado.toFixed(2)} e deve corresponder ao valor solicitado.`);
        return;
      }
    }
    setErroLocal(null);
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="hidden" name="anuncio_id" value={anuncioId} />
      <input type="hidden" name="parcial" value={String(parcial)} />
      <input type="hidden" name="itens_composicao" value={itensSelecionadosJson} />
      <input type="hidden" name="valor_solicitado" value={valorSolicitado.toFixed(2)} />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-stone-700">Tipo da solicitação</label>
        {permiteParcial ? (
          <div className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <label className="flex items-start gap-2 text-sm text-stone-700">
              <input
                type="radio"
                name="tipo_solicitacao_ui"
                checked={!parcial}
                onChange={() => setParcial(false)}
                className="mt-0.5 accent-stone-900"
              />
              <span>
                <span className="block font-medium text-stone-800">Integral</span>
                <span className="text-xs text-stone-500">Solicita o valor total disponível de R$ {valorMaximo.toFixed(2)}.</span>
              </span>
            </label>
            <label className="flex items-start gap-2 text-sm text-stone-700">
              <input
                type="radio"
                name="tipo_solicitacao_ui"
                checked={parcial}
                onChange={() => setParcial(true)}
                className="mt-0.5 accent-stone-900"
              />
              <span>
                <span className="block font-medium text-stone-800">Parcial por composição</span>
                <span className="text-xs text-stone-500">Selecione a composição e o valor será calculado automaticamente.</span>
              </span>
            </label>
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
            Somente valor integral disponível: <span className="font-semibold text-stone-900">R$ {valorMaximo.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3">
        <div>
          <p className="text-sm font-medium text-stone-700">Valor solicitado</p>
          <p className="text-xs text-stone-400">
            {parcial ? "Calculado a partir da composição selecionada" : "Valor integral do anúncio"}
          </p>
        </div>
        <p className="text-lg font-bold text-stone-900">R$ {valorSolicitado.toFixed(2)}</p>
      </div>

      {permiteParcial && parcial && (
        <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
          <div>
            <p className="text-sm font-semibold text-stone-800">Composição desejada</p>
            <p className="text-xs text-stone-500">
              Escolha as quantidades desejadas. O subtotal precisa bater com o valor solicitado.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {itensAnuncio.map((item) => {
              const quantidadeSelecionada = quantidadesSelecionadas[item.id] ?? 0;
              const subtotal = quantidadeSelecionada * item.valor_unitario;

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_auto] gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-800">
                      {ITEM_LABEL[item.tipo_item]} R$ {item.valor_unitario.toFixed(2)}
                    </p>
                    <p className="text-xs text-stone-500">
                      Disponível: {item.quantidade}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-xs text-stone-500">
                      Qtd.
                      <input
                        type="number"
                        min={0}
                        max={item.quantidade}
                        step={1}
                        value={quantidadeSelecionada}
                        onChange={(e) => atualizarQuantidade(item.id, Number(e.target.value), item.quantidade)}
                        className="mt-1 block w-20 rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                      />
                    </label>
                    <div className="min-w-20 text-right text-sm font-medium text-stone-700">
                      R$ {subtotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm">
            <span className="text-stone-500">Total da composição</span>
            <span className="font-semibold text-stone-900">R$ {totalSelecionado.toFixed(2)}</span>
          </div>
        </div>
      )}

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
