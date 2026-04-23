"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ROTAS } from "@/constants/rotas";

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
