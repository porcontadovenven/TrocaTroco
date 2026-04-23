import { APP_NAME } from "@/constants/app";
import { FormCadastro } from "@/modules/cadastro/FormCadastro";

export default function PaginaCadastro() {
  return (
    <main className="flex min-h-screen items-start justify-center bg-[linear-gradient(135deg,#f7f1e7_0%,#fffdf7_45%,#e8f1ea_100%)] px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold tracking-tight text-stone-900">
            {APP_NAME}
          </span>
          <p className="mt-1 text-sm text-stone-500">
            Cadastre sua empresa para começar a operar na plataforma
          </p>
        </div>

        <div className="rounded-3xl border border-stone-900/10 bg-white/90 p-8 shadow-[0_16px_48px_rgba(29,29,27,0.08)] backdrop-blur">
          <FormCadastro />
        </div>
      </div>
    </main>
  );
}
