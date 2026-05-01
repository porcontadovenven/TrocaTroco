"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSupabaseEnv } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ROTAS } from "@/constants/rotas";

function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function obterOrigemAtual() {
  const { appUrl } = getSupabaseEnv();

  if (appUrl) return appUrl.replace(/\/$/, "");

  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) return origin;

  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");

  if (!host) {
    throw new Error("Não foi possível determinar a origem da aplicação.");
  }

  return `${protocol}://${host}`;
}

function montarMensagemErroLogin(mensagemErro: string) {
  const normalizada = mensagemErro.toLowerCase();

  if (
    normalizada.includes("email not confirmed") ||
    normalizada.includes("email_not_confirmed") ||
    normalizada.includes("not confirmed")
  ) {
    return "Confirme seu e-mail antes de entrar. Se necessário, solicite um novo link de confirmação.";
  }

  return "Email ou senha incorretos.";
}

export async function loginAction(
  _estado: { erro?: string } | undefined,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const senha = formData.get("senha") as string;

  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    return { erro: montarMensagemErroLogin(error.message) };
  }

  revalidatePath("/", "layout");
  redirect(ROTAS.DASHBOARD);
}

export async function logoutAction() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(ROTAS.LOGIN);
}

export async function solicitarRecuperacaoSenhaAction(
  _estado: { erro?: string; sucesso?: string } | undefined,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return { erro: "Informe o email da conta." };
  }

  if (!validarEmail(email)) {
    return { erro: "Informe um email válido." };
  }

  try {
    const supabase = await getSupabaseServerClient();
    const origemAtual = await obterOrigemAtual();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origemAtual}${ROTAS.REDEFINIR_SENHA}`,
    });

    if (error) {
      return {
        erro: "Não foi possível solicitar a recuperação agora. Verifique a configuração de email do projeto.",
      };
    }

    return {
      sucesso:
        "Se o email estiver cadastrado na plataforma, você receberá o link de recuperação em instantes. Verifique também sua caixa de spam.",
    };
  } catch {
    return {
      erro: "Não foi possível solicitar a recuperação agora. Tente novamente em instantes.",
    };
  }
}

export async function reenviarConfirmacaoCadastroAction(
  _estado: { erro?: string; sucesso?: string } | undefined,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return { erro: "Informe o email da conta para reenviar a confirmação." };
  }

  if (!validarEmail(email)) {
    return { erro: "Informe um email válido." };
  }

  try {
    const supabase = await getSupabaseServerClient();
    const origemAtual = await obterOrigemAtual();

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${origemAtual}${ROTAS.LOGIN}?confirmacao=ok`,
      },
    });

    if (error) {
      return { erro: "Não foi possível reenviar a confirmação agora." };
    }

    return { sucesso: "Se a conta existir, um novo e-mail de confirmação foi enviado." };
  } catch {
    return { erro: "Não foi possível reenviar a confirmação agora." };
  }
}
