"use client";

import { useActionState } from "react";
import { APP_NAME } from "@/constants/app";
import { loginAction } from "@/modules/auth/actions";

type Estado = { erro?: string } | undefined;

export function FormLogin() {
  const [estado, action, pendente] = useActionState<Estado, FormData>(
    loginAction,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-stone-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
          placeholder="empresa@exemplo.com.br"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="senha" className="text-sm font-medium text-stone-700">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
          placeholder="••••••••"
        />
      </div>

      {estado?.erro && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {estado.erro}
        </p>
      )}

      <button
        type="submit"
        disabled={pendente}
        className="mt-1 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-60"
      >
        {pendente ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-center text-sm text-stone-500">
        Ainda não tem conta?{" "}
        <a
          href="/cadastro"
          className="font-medium text-stone-800 underline-offset-4 hover:underline"
        >
          Cadastre sua empresa
        </a>
      </p>

      <p className="text-center text-xs text-stone-400">
        Acesso restrito a empresas com CNPJ ativo.
        <br />
        {APP_NAME} é uma plataforma B2B.
      </p>
    </form>
  );
}
