"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { atualizarAnuncio, criarAnuncio } from "@/modules/anuncios/actions";
import type { ResultadoAcao, TipoAnuncio, TipoItemDinheiro, ItemComposicao } from "@/modules/anuncios/actions";
import { ROTAS } from "@/constants/rotas";
import { formatarMoedaBRL } from "@/lib/format";

type Etapa = "escolha" | "formulario";

const LABELS_TIPO_ITEM: Record<TipoItemDinheiro, string> = {
  cedula: "Cédula",
  moeda: "Moeda",
};

const VALORES_CEDULA = [2, 5, 10, 20, 50, 100, 200];
const VALORES_MOEDA = [0.05, 0.1, 0.25, 0.5, 1];

type FormAnunciarProps = {
  modo?: "criar" | "editar";
  anuncioId?: string;
  valoresIniciais?: {
    tipo: TipoAnuncio;
    permite_parcial: boolean;
    aceita_local_proprio?: boolean | null;
    rotulo_regiao?: string | null;
    disponibilidade_texto?: string | null;
    expira_em?: string | null;
    itens: ItemComposicao[];
  };
  hrefCancelar?: string;
  hrefSucesso?: string;
};

export function FormAnunciar({
  modo = "criar",
  anuncioId,
  valoresIniciais,
  hrefCancelar = ROTAS.MEUS_ANUNCIOS,
  hrefSucesso,
}: FormAnunciarProps) {
  const router = useRouter();
  const editando = modo === "editar";
  const [etapa, setEtapa] = useState<Etapa>(editando ? "formulario" : "escolha");
  const [tipo, setTipo] = useState<TipoAnuncio | null>(valoresIniciais?.tipo ?? null);
  const [itens, setItens] = useState<ItemComposicao[]>(valoresIniciais?.itens ?? []);
  const [erroLocal, setErroLocal] = useState<string | null>(null);

  const [estado, action, pendente] = useActionState<ResultadoAcao | undefined, FormData>(
    editando ? atualizarAnuncio : criarAnuncio,
    undefined,
  );

  useEffect(() => {
    if (!estado?.ok || !editando || !anuncioId) {
      return;
    }

    router.push(hrefSucesso ?? ROTAS.ANUNCIO_DETALHE(anuncioId));
    router.refresh();
  }, [anuncioId, editando, estado, hrefSucesso, router]);

  // Cálculo do valor total derivado dos itens
  const valorTotal = itens.reduce(
    (acc, i) => acc + i.valor_unitario * i.quantidade,
    0,
  );

  function escolherTipo(t: TipoAnuncio) {
    setTipo(t);
    setEtapa("formulario");
  }

  function adicionarItem(ti: TipoItemDinheiro, valorUnitario: number) {
    setItens((prev) => {
      const existente = prev.findIndex(
        (i) => i.tipo_item === ti && i.valor_unitario === valorUnitario,
      );
      if (existente >= 0) {
        const copia = [...prev];
        copia[existente] = {
          ...copia[existente],
          quantidade: copia[existente].quantidade + 1,
        };
        return copia;
      }
      return [
        ...prev,
        { tipo_item: ti, valor_unitario: valorUnitario, quantidade: 1 },
      ];
    });
  }

  function removerItem(idx: number) {
    setItens((prev) => prev.filter((_, i) => i !== idx));
  }

  function ajustarQuantidade(idx: number, delta: number) {
    setItens((prev) => {
      const copia = [...prev];
      const novaQtd = copia[idx].quantidade + delta;
      if (novaQtd <= 0) return copia.filter((_, i) => i !== idx);
      copia[idx] = { ...copia[idx], quantidade: novaQtd };
      return copia;
    });
  }

  function validar(): string | null {
    if (!tipo) return "Escolha o tipo de anúncio.";
    if (itens.length === 0) return "Informe ao menos um item de composição.";
    return null;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const erro = validar();
    if (erro) {
      e.preventDefault();
      setErroLocal(erro);
    }
  }

  // ----- Tela 1: escolha de tipo -----
  if (etapa === "escolha") {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold text-stone-900">Criar anúncio</h1>
          <p className="mt-1 text-sm text-stone-500">
            Selecione o tipo de anúncio que deseja publicar.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => escolherTipo("oferta")}
            className="flex flex-col gap-2 rounded-3xl border-2 border-stone-200 bg-white p-6 text-left transition hover:border-emerald-500 hover:shadow-md"
          >
            <span className="text-2xl">💵</span>
            <span className="font-semibold text-stone-900">Oferta de troco</span>
            <span className="text-sm leading-relaxed text-stone-500">
              Você tem troco disponível e quer colocá-lo à disposição de outras empresas.
            </span>
          </button>

          <button
            type="button"
            onClick={() => escolherTipo("necessidade")}
            className="flex flex-col gap-2 rounded-3xl border-2 border-stone-200 bg-white p-6 text-left transition hover:border-amber-500 hover:shadow-md"
          >
            <span className="text-2xl">🔄</span>
            <span className="font-semibold text-stone-900">Necessidade de troco</span>
            <span className="text-sm leading-relaxed text-stone-500">
              Você precisa de troco e quer encontrar uma empresa que possa te ajudar.
            </span>
          </button>
        </div>
      </div>
    );
  }

  // ----- Tela 2: formulário -----
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        {editando ? (
          <Link
            href={hrefCancelar}
            className="text-sm text-stone-500 underline-offset-4 hover:underline"
          >
            ← Cancelar
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => { setEtapa("escolha"); setItens([]); setErroLocal(null); }}
            className="text-sm text-stone-500 underline-offset-4 hover:underline"
          >
            ← Voltar
          </button>
        )}
        <h1 className="text-xl font-semibold text-stone-900">
          {editando
            ? "Editar anúncio"
            : tipo === "oferta"
              ? "Oferta de troco"
              : "Necessidade de troco"}
        </h1>
      </div>

      <form action={action} onSubmit={handleSubmit} className="flex flex-col gap-6">
        {editando && <input type="hidden" name="anuncio_id" value={anuncioId ?? ""} />}
        {/* Campo oculto: tipo */}
        <input type="hidden" name="tipo" value={tipo ?? ""} />
        {/* Campo oculto: valor_total calculado */}
        <input type="hidden" name="valor_total" value={valorTotal} />
        {/* Campo oculto: itens de composição */}
        <input type="hidden" name="itens_composicao" value={JSON.stringify(itens)} />

        {/* Composição */}
        <section className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <h2 className="mb-4 text-sm font-semibold text-stone-800">
            Composição do valor
          </h2>

          {/* Grade de cédulas */}
          <div className="mb-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-500">
              Cédulas (R$)
            </p>
            <div className="flex flex-wrap gap-2">
              {VALORES_CEDULA.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => adicionarItem("cedula", v)}
                  className="rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-emerald-50 hover:border-emerald-400"
                >
                  + R$ {v}
                </button>
              ))}
            </div>
          </div>

          {/* Grade de moedas */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-500">
              Moedas (R$)
            </p>
            <div className="flex flex-wrap gap-2">
              {VALORES_MOEDA.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => adicionarItem("moeda", v)}
                  className="rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-amber-50 hover:border-amber-400"
                >
                  + {formatarMoedaBRL(v)}
                </button>
              ))}
            </div>
          </div>

          {/* Itens selecionados */}
          {itens.length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                Selecionados
              </p>
              {itens.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm"
                >
                  <span className="text-stone-700">
                    {LABELS_TIPO_ITEM[item.tipo_item]} {formatarMoedaBRL(item.valor_unitario)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => ajustarQuantidade(idx, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-medium">{item.quantidade}</span>
                    <button
                      type="button"
                      onClick={() => ajustarQuantidade(idx, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removerItem(idx)}
                      className="ml-2 text-xs text-red-400 hover:text-red-600"
                    >
                      remover
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-2 flex items-center justify-between rounded-xl bg-stone-900 px-4 py-2 text-sm text-white">
                <span className="font-medium">Total</span>
                <span className="font-bold">
                  {formatarMoedaBRL(valorTotal)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-stone-400">
              Adicione itens clicando nos botões acima.
            </p>
          )}
        </section>

        {/* Opções específicas por tipo */}
        {tipo === "oferta" && (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-stone-800">
              Regras da oferta
            </h2>
            <label className="flex items-center gap-3 text-sm text-stone-700">
              <input
                type="checkbox"
                name="permite_parcial"
                value="true"
                defaultChecked={valoresIniciais?.permite_parcial ?? false}
                className="h-4 w-4 rounded border-stone-300"
              />
              Aceito solicitações de valor parcial
            </label>
            <label className="flex items-center gap-3 text-sm text-stone-700">
              <input
                type="checkbox"
                name="aceita_local_proprio"
                value="true"
                defaultChecked={valoresIniciais?.aceita_local_proprio ?? false}
                className="h-4 w-4 rounded border-stone-300"
              />
              A troca pode ocorrer na minha empresa
            </label>
          </section>
        )}

        {tipo === "necessidade" && (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-stone-800">
              Regras da necessidade
            </h2>
            <label className="flex items-center gap-3 text-sm text-stone-700">
              <input
                type="checkbox"
                name="permite_parcial"
                value="true"
                defaultChecked={valoresIniciais?.permite_parcial ?? false}
                className="h-4 w-4 rounded border-stone-300"
              />
              Aceito atendimentos parciais
            </label>
          </section>
        )}

        {/* Região e disponibilidade */}
        <section className="flex flex-col gap-4">
          <CampoTexto
            label="Região / bairro (opcional)"
            name="rotulo_regiao"
            placeholder="Ex: Centro, Vila Madalena..."
            defaultValue={valoresIniciais?.rotulo_regiao ?? ""}
          />
          <CampoTexto
            label="Disponibilidade (opcional)"
            name="disponibilidade_texto"
            placeholder="Ex: Seg–Sex das 9h às 18h"
            defaultValue={valoresIniciais?.disponibilidade_texto ?? ""}
          />
          <CampoTexto
            label="Validade (opcional)"
            name="expira_em"
            type="date"
            defaultValue={valoresIniciais?.expira_em ?? ""}
          />
        </section>

        {/* Erros */}
        {(erroLocal || (estado && !estado.ok)) && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erroLocal ?? (estado && !estado.ok ? estado.erro : "")}
          </p>
        )}

        <button
          type="submit"
          disabled={pendente}
          className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-700 disabled:opacity-60"
        >
          {pendente ? (editando ? "Salvando..." : "Publicando...") : (editando ? "Salvar alterações" : "Publicar anúncio")}
        </button>
      </form>
    </div>
  );
}

function CampoTexto({
  label,
  name,
  placeholder,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-stone-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
      />
    </div>
  );
}
