"use client";

import { useState } from "react";
import { useActionState } from "react";
import { criarEmpresaESubmissao } from "@/modules/cadastro/actions";
import type { ResultadoAcao } from "@/modules/cadastro/actions";

type Etapa = 1 | 2 | 3;

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_APENAS_NUMEROS = /^\d+$/;
const REGEX_APENAS_LETRAS = /^[A-Za-zÀ-ÿ\s]+$/u;
const ESTADOS_DISPONIVEIS = ["RJ"] as const;

const ETAPAS: Record<Etapa, string> = {
  1: "Dados da empresa",
  2: "Dados do responsável",
  3: "Revisão",
};

type Campos = {
  // Empresa
  cnpj: string;
  razao_social: string;
  email_empresa: string;
  telefone_empresa: string;
  endereco_linha: string;
  endereco_numero: string;
  endereco_complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  // Responsável
  nome_completo: string;
  cpf: string;
  telefone_responsavel: string;
  email_responsavel: string;
  cargo_funcao: string;
  vinculo_empresa: string;
  senha: string;
  confirmar_senha: string;
};

const vazio: Campos = {
  cnpj: "",
  razao_social: "",
  email_empresa: "",
  telefone_empresa: "",
  endereco_linha: "",
  endereco_numero: "",
  endereco_complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  cep: "",
  nome_completo: "",
  cpf: "",
  telefone_responsavel: "",
  email_responsavel: "",
  cargo_funcao: "",
  vinculo_empresa: "",
  senha: "",
  confirmar_senha: "",
};

function validarCampoNumericoExato(
  valor: string,
  rotulo: string,
  quantidade: number,
) {
  if (!valor) return `${rotulo} é obrigatório.`;
  if (!REGEX_APENAS_NUMEROS.test(valor)) return `${rotulo}: utilize apenas números.`;
  if (valor.length !== quantidade) {
    return `${rotulo} deve conter ${quantidade} números.`;
  }
  return null;
}

function validarCampoApenasLetras(valor: string, rotulo: string) {
  if (!valor.trim()) return `${rotulo} é obrigatório.`;
  if (!REGEX_APENAS_LETRAS.test(valor.trim())) {
    return `${rotulo}: utilize apenas letras.`;
  }
  return null;
}

function validarEmail(valor: string, rotulo: string) {
  if (!valor.trim()) return `${rotulo} é obrigatório.`;
  if (!REGEX_EMAIL.test(valor.trim())) {
    return `${rotulo}: informe um e-mail válido.`;
  }
  return null;
}

export function FormCadastro({ requerCredenciais }: { requerCredenciais: boolean }) {
  const [etapa, setEtapa] = useState<Etapa>(1);
  const [campos, setCampos] = useState<Campos>(vazio);
  const [estado, action, pendente] = useActionState<
    ResultadoAcao | undefined,
    FormData
  >(criarEmpresaESubmissao, undefined);

  function atualizar(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setCampos((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validarEtapa1(): string | null {
    const erroCnpj = validarCampoNumericoExato(campos.cnpj, "CNPJ", 14);
    if (erroCnpj) return erroCnpj;
    if (!campos.razao_social) return "Razão social é obrigatória.";
    const erroEmailEmpresa = validarEmail(campos.email_empresa, "E-mail da empresa");
    if (erroEmailEmpresa) return erroEmailEmpresa;
    const erroTelefoneEmpresa = validarCampoNumericoExato(
      campos.telefone_empresa,
      "Telefone da empresa",
      11,
    );
    if (erroTelefoneEmpresa) return erroTelefoneEmpresa;
    const erroEndereco = validarCampoApenasLetras(
      campos.endereco_linha,
      "Endereço (logradouro)",
    );
    if (erroEndereco) return erroEndereco;
    const erroNumeroEndereco = validarCampoNumericoExato(
      campos.endereco_numero,
      "Número do endereço",
      5,
    );
    if (erroNumeroEndereco) return erroNumeroEndereco;
    const erroCep = validarCampoNumericoExato(campos.cep, "CEP", 8);
    if (erroCep) return erroCep;
    const erroCidade = validarCampoApenasLetras(campos.cidade, "Cidade");
    if (erroCidade) return erroCidade;
    if (!campos.estado) return "Estado é obrigatório.";
    if (!ESTADOS_DISPONIVEIS.includes(campos.estado as (typeof ESTADOS_DISPONIVEIS)[number])) {
      return "Selecione um estado válido.";
    }
    return null;
  }

  function validarEtapa2(): string | null {
    if (!campos.nome_completo) return "Nome completo é obrigatório.";
    const erroCpf = validarCampoNumericoExato(campos.cpf, "CPF", 11);
    if (erroCpf) return erroCpf;
    const erroTelefone = validarCampoNumericoExato(
      campos.telefone_responsavel,
      "Telefone",
      11,
    );
    if (erroTelefone) return erroTelefone;
    const erroEmailResponsavel = validarEmail(campos.email_responsavel, "E-mail");
    if (erroEmailResponsavel) return erroEmailResponsavel;
    if (!campos.cargo_funcao) return "Cargo / função é obrigatório.";
    if (!campos.vinculo_empresa) return "Vínculo com a empresa é obrigatório.";
    if (requerCredenciais && !campos.senha) return "Senha de acesso é obrigatória.";
    if (requerCredenciais && campos.senha.length < 6) {
      return "A senha deve ter ao menos 6 caracteres.";
    }
    if (requerCredenciais && campos.senha !== campos.confirmar_senha) {
      return "A confirmação de senha não confere.";
    }
    return null;
  }

  const [erroLocal, setErroLocal] = useState<string | null>(null);

  function avancar() {
    let erro: string | null = null;
    if (etapa === 1) erro = validarEtapa1();
    if (etapa === 2) erro = validarEtapa2();
    if (erro) { setErroLocal(erro); return; }
    setErroLocal(null);
    setEtapa((e) => (e < 3 ? ((e + 1) as Etapa) : e));
  }

  function voltar() {
    setErroLocal(null);
    setEtapa((e) => (e > 1 ? ((e - 1) as Etapa) : e));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Indicador de etapas */}
      <div className="flex items-center gap-2">
        {([1, 2, 3] as Etapa[]).map((n) => (
          <div key={n} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                n === etapa
                  ? "bg-stone-900 text-white"
                  : n < etapa
                  ? "bg-emerald-600 text-white"
                  : "bg-stone-200 text-stone-500"
              }`}
            >
              {n}
            </div>
            <span className={`hidden text-xs sm:inline ${n === etapa ? "font-semibold text-stone-800" : "text-stone-400"}`}>
              {ETAPAS[n]}
            </span>
            {n < 3 && <div className="h-px w-6 bg-stone-200" />}
          </div>
        ))}
      </div>

      <h2 className="text-base font-semibold text-stone-800">
        {ETAPAS[etapa]}
      </h2>

      {/* Formulário real — enviado na etapa 3 */}
      <form action={action} className="flex flex-col gap-5">
        {/* Campos ocultos com todos os valores coletados */}
        {Object.entries(campos).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}

        {/* Etapa 1 */}
        {etapa === 1 && (
          <div className="flex flex-col gap-4">
            <Campo label="CNPJ" name="cnpj" value={campos.cnpj} onChange={atualizar} placeholder="Somente 14 números" inputMode="numeric" maxLength={14} />
            <Campo label="Razão social" name="razao_social" value={campos.razao_social} onChange={atualizar} />
            <Campo label="E-mail da empresa" name="email_empresa" type="email" value={campos.email_empresa} onChange={atualizar} />
            <Campo label="Telefone" name="telefone_empresa" value={campos.telefone_empresa} onChange={atualizar} placeholder="Somente 11 números" inputMode="numeric" maxLength={11} />
            <Campo label="Endereço (logradouro)" name="endereco_linha" value={campos.endereco_linha} onChange={atualizar} placeholder="Somente letras" />
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Número" name="endereco_numero" value={campos.endereco_numero} onChange={atualizar} placeholder="00000" inputMode="numeric" maxLength={5} />
              <Campo label="Complemento" name="endereco_complemento" value={campos.endereco_complemento} onChange={atualizar} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Bairro" name="bairro" value={campos.bairro} onChange={atualizar} />
              <Campo label="CEP" name="cep" value={campos.cep} onChange={atualizar} placeholder="Somente 8 números" inputMode="numeric" maxLength={8} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Cidade" name="cidade" value={campos.cidade} onChange={atualizar} placeholder="Somente letras" />
              <CampoSelect
                label="Estado (UF)"
                name="estado"
                value={campos.estado}
                onChange={atualizar}
                options={ESTADOS_DISPONIVEIS.map((estado) => ({
                  label: estado,
                  value: estado,
                }))}
                placeholder="Selecione"
              />
            </div>
          </div>
        )}

        {/* Etapa 2 */}
        {etapa === 2 && (
          <div className="flex flex-col gap-4">
            <Campo label="Nome completo" name="nome_completo" value={campos.nome_completo} onChange={atualizar} />
            <Campo label="CPF" name="cpf" value={campos.cpf} onChange={atualizar} placeholder="Somente 11 números" inputMode="numeric" maxLength={11} />
            <Campo label="Telefone" name="telefone_responsavel" value={campos.telefone_responsavel} onChange={atualizar} placeholder="Somente 11 números" inputMode="numeric" maxLength={11} />
            <Campo label="E-mail" name="email_responsavel" type="email" value={campos.email_responsavel} onChange={atualizar} />
            <Campo label="Cargo / função" name="cargo_funcao" value={campos.cargo_funcao} onChange={atualizar} />
            <Campo label="Vínculo atual com a empresa" name="vinculo_empresa" value={campos.vinculo_empresa} onChange={atualizar} placeholder="Sócio, funcionário, representante..." />
            {requerCredenciais && (
              <>
                <Campo
                  label="Senha de acesso"
                  name="senha"
                  type="password"
                  value={campos.senha}
                  onChange={atualizar}
                />
                <Campo
                  label="Confirmar senha"
                  name="confirmar_senha"
                  type="password"
                  value={campos.confirmar_senha}
                  onChange={atualizar}
                />
              </>
            )}
          </div>
        )}

        {/* Etapa 3 — Revisão */}
        {etapa === 3 && (
          <div className="flex flex-col gap-5">
            <Revisao titulo="Dados da empresa" itens={[
              ["CNPJ", campos.cnpj],
              ["Razão social", campos.razao_social],
              ["E-mail", campos.email_empresa],
              ["Telefone", campos.telefone_empresa],
              ["Endereço", [campos.endereco_linha, campos.endereco_numero, campos.bairro, campos.cidade, campos.estado].filter(Boolean).join(", ")],
            ]} />
            <Revisao titulo="Dados do responsável" itens={[
              ["Nome", campos.nome_completo],
              ["CPF", campos.cpf],
              ["Telefone", campos.telefone_responsavel],
              ["E-mail", campos.email_responsavel],
              ["Cargo", campos.cargo_funcao],
              ["Vínculo", campos.vinculo_empresa],
            ]} />
          </div>
        )}

        {/* Erros */}
        {(erroLocal || (estado && !estado.ok)) && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erroLocal ?? (estado && !estado.ok ? estado.erro : "")}
          </p>
        )}

        {/* Ações */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {etapa > 1 ? (
            <button
              type="button"
              onClick={voltar}
              className="rounded-xl border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Voltar
            </button>
          ) : (
            <a
              href="/login"
              className="text-sm text-stone-500 underline-offset-4 hover:underline"
            >
              Já tenho conta
            </a>
          )}

          {etapa < 3 ? (
            <button
              type="button"
              onClick={avancar}
              className="rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-700"
            >
              Continuar
            </button>
          ) : (
            <button
              type="submit"
              disabled={pendente}
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {pendente ? "Enviando..." : "Enviar cadastro"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componentes internos pequenos
// ---------------------------------------------------------------------------

function Campo({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  inputMode,
  maxLength,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
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
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
      />
    </div>
  );
}

function CampoSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-stone-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
      >
        <option value="">{placeholder ?? "Selecione"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Revisao({
  titulo,
  itens,
}: {
  titulo: string;
  itens: [string, string][];
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
      <h3 className="mb-3 text-sm font-semibold text-stone-800">{titulo}</h3>
      <dl className="flex flex-col gap-2">
        {itens.map(([chave, valor]) => (
          <div key={chave} className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-stone-500">{chave}</dt>
            <dd className="font-medium text-stone-800">{valor || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
