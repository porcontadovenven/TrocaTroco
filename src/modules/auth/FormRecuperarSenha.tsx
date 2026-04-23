"use client";

import Link from "next/link";
import { useActionState } from "react";

import { ROTAS } from "@/constants/rotas";
import { solicitarRecuperacaoSenhaAction } from "@/modules/auth/actions";

type Estado = { erro?: string; sucesso?: string } | undefined;

export function FormRecuperarSenha() {
  const [estado, action, pendente] = useActionState<Estado, FormData>(
    solicitarRecuperacaoSenhaAction,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        O link de recuperação só será entregue quando o SMTP do projeto estiver configurado.
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-stone-700">
          Email da conta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="empresa@exemplo.com.br"
          className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
        />
      </div>

      {estado?.erro && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {estado.erro}
        </p>
      )}

      {estado?.sucesso && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {estado.sucesso}
        </p>
      )}

      <button
        type="submit"
        disabled={pendente}
        className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-60"
      >
        {pendente ? "Solicitando..." : "Enviar link de recuperação"}
      </button>

      <p className="text-center text-sm text-stone-500">
        <Link
          href={ROTAS.LOGIN}
          className="font-medium text-stone-800 underline-offset-4 hover:underline"
        >
          Voltar para o login
        </Link>
      </p>
    </form>
  );
}