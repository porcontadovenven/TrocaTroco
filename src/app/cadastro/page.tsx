import { APP_NAME } from "@/constants/app";
import { ROTAS } from "@/constants/rotas";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { FormCadastro } from "@/modules/cadastro/FormCadastro";
import Link from "next/link";

export default async function PaginaCadastro() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen items-start justify-center bg-[linear-gradient(135deg,#f7f1e7_0%,#fffdf7_45%,#e8f1ea_100%)] px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold tracking-tight text-stone-900">
            {APP_NAME}
          </span>
          <p className="mt-1 text-sm text-stone-500">
            Cadastre sua empresa, aguarde a análise cadastral e só então libere sua operação na plataforma.
          </p>
        </div>

        <div className="rounded-3xl border border-stone-900/10 bg-white/90 p-8 shadow-[0_16px_48px_rgba(29,29,27,0.08)] backdrop-blur">
          <FormCadastro requerCredenciais={!user} />
        </div>

        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <p className="font-medium">Antes de operar</p>
          <p className="mt-1 leading-6">
            O TrocaTroco conecta empresas, mas não processa pagamentos, não faz custódia de valores e não garante a conclusão das operações. O cadastro depende de aprovação antes do acesso à área operacional.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium">
            <Link href={ROTAS.TERMOS_USO} className="underline-offset-4 hover:underline">Termos de Uso</Link>
            <Link href={ROTAS.POLITICA_PRIVACIDADE} className="underline-offset-4 hover:underline">Política de Privacidade</Link>
            <Link href={ROTAS.SEGURANCA_OPERACOES} className="underline-offset-4 hover:underline">Segurança nas Operações</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
