"use client";

import Link from "next/link";
import { useActionState } from "react";
import { APP_NAME } from "@/constants/app";
import { ROTAS } from "@/constants/rotas";
import { loginAction, reenviarConfirmacaoCadastroAction } from "@/modules/auth/actions";

type Estado = { erro?: string } | undefined;
type EstadoConfirmacao = { erro?: string; sucesso?: string } | undefined;

export function FormLogin({
  avisoCadastro,
  emailPreenchido,
  avisoConfirmacao,
}: {
  avisoCadastro?: boolean;
  emailPreenchido?: string;
  avisoConfirmacao?: boolean;
}) {
  const [estado, action, pendente] = useActionState<Estado, FormData>(
    loginAction,
    undefined,
  );
  const [estadoConfirmacao, actionConfirmacao, pendenteConfirmacao] = useActionState<EstadoConfirmacao, FormData>(
    reenviarConfirmacaoCadastroAction,
    undefined,
  );

  return (
    <div className="flex flex-col gap-5">
      <form action={action} className="flex flex-col gap-5">
        {avisoCadastro && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Seu cadastro foi enviado. Antes de entrar, confirme o email da conta no link enviado para <strong>{emailPreenchido}</strong>.
          </div>
        )}

        {avisoConfirmacao && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Email confirmado com sucesso. Agora você já pode entrar na plataforma.
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-stone-700 dark:text-stone-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={emailPreenchido ?? ""}
            autoComplete="email"
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-500"
            placeholder="empresa@exemplo.com.br"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="senha" className="text-sm font-medium text-stone-700 dark:text-stone-300">
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            required
            autoComplete="current-password"
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-500"
            placeholder="••••••••"
          />

          <div className="pt-1 text-right">
            <Link
              href={ROTAS.RECUPERAR_SENHA}
              className="text-xs font-medium text-stone-600 underline-offset-4 hover:text-stone-900 hover:underline dark:text-stone-400 dark:hover:text-stone-200"
            >
              Esqueci minha senha
            </Link>
          </div>
        </div>

        {estado?.erro && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {estado.erro}
          </p>
        )}

        <button
          type="submit"
          disabled={pendente}
          className="mt-1 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-60"
        >
          {pendente ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-center text-sm text-stone-500 dark:text-stone-400">
          Ainda não tem conta?{" "}
          <Link
            href={ROTAS.CADASTRO}
            className="font-medium text-stone-800 underline-offset-4 hover:underline dark:text-stone-200"
          >
            Cadastre sua empresa
          </Link>
        </p>

        <p className="text-center text-xs text-stone-400 dark:text-stone-500">
          Acesso restrito a empresas com CNPJ ativo.
          <br />
          {APP_NAME} é uma plataforma B2B.
        </p>
      </form>

      {avisoCadastro && (
        <form id="reenviar-confirmacao" action={actionConfirmacao} className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-700 dark:bg-stone-800">
          <input type="hidden" name="email" value={emailPreenchido ?? ""} />
          <p className="text-xs leading-5 text-stone-600 dark:text-stone-400">
            Não recebeu o email? Você pode pedir um novo link de confirmação.
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {estadoConfirmacao?.erro && (
              <p className="text-xs text-red-700">{estadoConfirmacao.erro}</p>
            )}
            {estadoConfirmacao?.sucesso && (
              <p className="text-xs text-emerald-700">{estadoConfirmacao.sucesso}</p>
            )}
            <button
              type="submit"
              disabled={pendenteConfirmacao || !emailPreenchido}
              className="self-start rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-60 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
            >
              {pendenteConfirmacao ? "Reenviando..." : "Reenviar confirmação"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
