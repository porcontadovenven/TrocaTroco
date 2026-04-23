"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ROTAS } from "@/constants/rotas";

function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function obterOrigemAtual() {
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
    return { erro: "Email ou senha incorretos." };
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
        "Se o email existir, enviaremos um link de recuperação. O envio depende da configuração de email do projeto.",
    };
  } catch {
    return {
      erro: "Não foi possível solicitar a recuperação agora. Tente novamente em instantes.",
    };
  }
}
