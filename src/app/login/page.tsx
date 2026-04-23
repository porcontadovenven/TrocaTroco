import { CheckCircle } from "lucide-react";

import { APP_NAME } from "@/constants/app";
import { FormLogin } from "@/modules/auth/FormLogin";

const BENEFICIOS = [
  "Marketplace B2B para empresas e MEIs com CNPJ ativo",
  "Conexão direta entre empresas, sem custódia",
  "Moderação ativa e reputação pública verificada",
];

export default async function PaginaLogin({
  searchParams,
}: {
  searchParams: Promise<{ cadastro?: string; email?: string; confirmacao?: string }>;
}) {
  const { cadastro, email, confirmacao } = await searchParams;

  return (
    <main className="flex min-h-screen">
      {/* Painel da marca — oculto em mobile */}
      <aside className="relative hidden w-[420px] shrink-0 flex-col justify-between overflow-hidden bg-stone-950 p-10 lg:flex">
        {/* Padrão decorativo */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-900/30 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-emerald-800/20 blur-2xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 shadow-lg">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 6H13L10 3M13 6L10 9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 12H5L8 9M5 12L8 15" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">{APP_NAME}</span>
        </div>

        {/* Conteúdo central */}
        <div className="relative flex flex-col gap-8">
          <div>
            <h2 className="text-2xl font-bold leading-snug text-white">
              Troco para empresas,{" "}
              <span className="text-emerald-400">simples e seguro.</span>
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-400">
              Plataforma B2B para intermediação de troco entre empresas e MEIs com CNPJ ativo.
            </p>
          </div>
          <ul className="flex flex-col gap-3">
            {BENEFICIOS.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span className="text-sm leading-5 text-stone-300">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rodapé do painel */}
        <p className="relative text-xs text-stone-600">
          © {new Date().getFullYear()} {APP_NAME}. Plataforma B2B.
        </p>
      </aside>

      {/* Formulário */}
      <div className="flex flex-1 items-center justify-center bg-stone-50 px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="mb-8 flex flex-col items-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow">
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 6H13L10 3M13 6L10 9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 12H5L8 9M5 12L8 15" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900">{APP_NAME}</span>
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-bold text-stone-900">Entrar na plataforma</h1>
            <p className="mt-1 text-sm text-stone-500">Acesse sua conta empresarial</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
            <FormLogin
              avisoCadastro={cadastro === "confirmar-email"}
              emailPreenchido={email}
              avisoConfirmacao={confirmacao === "ok"}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

