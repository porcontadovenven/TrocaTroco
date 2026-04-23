"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import { ROTAS } from "@/constants/rotas";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type Estado = {
  erro?: string;
  sucesso?: string;
};

export function FormRedefinirSenha() {
  const [estado, setEstado] = useState<Estado>({});
  const [prontoParaRedefinir, setProntoParaRedefinir] = useState(false);
  const [pendente, startTransition] = useTransition();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const tipoFluxo = hashParams.get("type");

    if (tipoFluxo === "recovery") {
      setProntoParaRedefinir(true);
      return;
    }

    let ativo = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!ativo) return;

      if (error) {
        setEstado({ erro: "Não foi possível validar o link de redefinição." });
        return;
      }

      if (data.session) {
        setProntoParaRedefinir(true);
        return;
      }

      setEstado({ erro: "Abra esta página a partir do link de recuperação enviado por email." });
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!ativo) return;

      if (event === "PASSWORD_RECOVERY" || !!session) {
        setProntoParaRedefinir(true);
        setEstado({});
      }
    });

    return () => {
      ativo = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  function onSubmit(formData: FormData) {
    const senha = String(formData.get("senha") ?? "");
    const confirmarSenha = String(formData.get("confirmar_senha") ?? "");

    if (senha.length < 6) {
      setEstado({ erro: "A nova senha deve ter ao menos 6 caracteres." });
      return;
    }

    if (senha !== confirmarSenha) {
      setEstado({ erro: "A confirmação da senha não confere." });
      return;
    }

    startTransition(async () => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password: senha });

      if (error) {
        setEstado({ erro: "Não foi possível redefinir a senha com este link." });
        return;
      }

      setEstado({ sucesso: "Senha redefinida com sucesso. Você já pode entrar com a nova senha." });
      setProntoParaRedefinir(false);
      window.history.replaceState({}, document.title, ROTAS.REDEFINIR_SENHA);
    });
  }

  return (
    <form
      action={onSubmit}
      className="flex flex-col gap-5"
    >
      {!prontoParaRedefinir && !estado.erro && !estado.sucesso && (
        <p className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
          Abra esta página a partir do link de recuperação enviado por email.
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="senha" className="text-sm font-medium text-stone-700">
          Nova senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          disabled={!prontoParaRedefinir || pendente || !!estado.sucesso}
          autoComplete="new-password"
          placeholder="••••••••"
          className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 disabled:opacity-60"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmar_senha" className="text-sm font-medium text-stone-700">
          Confirmar nova senha
        </label>
        <input
          id="confirmar_senha"
          name="confirmar_senha"
          type="password"
          required
          disabled={!prontoParaRedefinir || pendente || !!estado.sucesso}
          autoComplete="new-password"
          placeholder="••••••••"
          className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 disabled:opacity-60"
        />
      </div>

      {estado.erro && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {estado.erro}
        </p>
      )}

      {estado.sucesso && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {estado.sucesso}
        </p>
      )}

      <button
        type="submit"
        disabled={!prontoParaRedefinir || pendente || !!estado.sucesso}
        className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-60"
      >
        {pendente ? "Redefinindo..." : "Salvar nova senha"}
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