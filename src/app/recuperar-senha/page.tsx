import { APP_NAME } from "@/constants/app";
import { FormRecuperarSenha } from "@/modules/auth/FormRecuperarSenha";
import { ROTAS } from "@/constants/rotas";
import Link from "next/link";

export default function PaginaRecuperarSenha() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <Link href={ROTAS.HOME} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 shadow">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 6H13L10 3M13 6L10 9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 12H5L8 9M5 12L8 15" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900">{APP_NAME}</span>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-stone-900">Recuperar senha</h1>
          <p className="mt-1 text-sm text-stone-500">
            Informe seu email para receber o link de redefinição.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
          <FormRecuperarSenha />
        </div>
      </div>
    </main>
  );
}
