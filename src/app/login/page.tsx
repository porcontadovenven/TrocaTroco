import { APP_NAME } from "@/constants/app";
import { FormLogin } from "@/modules/auth/FormLogin";

export default async function PaginaLogin({
  searchParams,
}: {
  searchParams: Promise<{ cadastro?: string; email?: string; confirmacao?: string }>;
}) {
  const { cadastro, email, confirmacao } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f7f1e7_0%,#fffdf7_45%,#e8f1ea_100%)] px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold tracking-tight text-stone-900">
            {APP_NAME}
          </span>
          <p className="mt-1 text-sm text-stone-500">
            Acesse sua conta empresarial
          </p>
        </div>

        <div className="rounded-3xl border border-stone-900/10 bg-white/90 p-8 shadow-[0_16px_48px_rgba(29,29,27,0.08)] backdrop-blur">
          <FormLogin
            avisoCadastro={cadastro === "confirmar-email"}
            emailPreenchido={email}
            avisoConfirmacao={confirmacao === "ok"}
          />
        </div>
      </div>
    </main>
  );
}
