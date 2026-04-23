import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  MessageSquare,
  ShieldCheck,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";

import { listarAnunciosPublicos } from "@/modules/anuncios/actions";
import { ROTAS } from "@/constants/rotas";
import { APP_NAME } from "@/constants/app";
import { getSessao } from "@/lib/sessao";
import { isAdmin } from "@/constants/papeis";

const TIPO_LABEL: Record<string, string> = {
  oferta: "Oferta de troco",
  necessidade: "Necessidade de troco",
};

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 shadow-sm">
        <svg
          width="17"
          height="17"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 6H13L10 3M13 6L10 9"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 12H5L8 9M5 12L8 15"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-base font-bold tracking-tight text-stone-900">
        {APP_NAME}
      </span>
    </div>
  );
}

function LogoBranca() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 shadow-sm">
        <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M2 6H13L10 3M13 6L10 9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 12H5L8 9M5 12L8 15" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="text-base font-bold tracking-tight text-white">{APP_NAME}</span>
    </div>
  );
}

export default async function Home() {
  const [{ anuncios }, sessao] = await Promise.all([
    listarAnunciosPublicos(1, 6),
    getSessao(),
  ]);

  const ctaPrincipal = !sessao
    ? { href: ROTAS.CADASTRO, label: "Cadastrar minha empresa" }
    : isAdmin(sessao.papel)
    ? { href: ROTAS.ADMIN, label: "Ir para painel admin" }
    : sessao.status_empresa === "aprovada"
    ? { href: ROTAS.DASHBOARD, label: "Ir para meu dashboard" }
    : { href: ROTAS.STATUS_CADASTRAL, label: "Ver status do cadastro" };

  const ctaSecundaria = !sessao
    ? { href: ROTAS.LOGIN, label: "Entrar" }
    : { href: ROTAS.ANUNCIOS, label: "Explorar anúncios" };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ─────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href={ROTAS.HOME}>
            <Logo />
          </Link>
          <nav className="hidden items-center gap-7 sm:flex">
            <Link
              href={ROTAS.ANUNCIOS}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
            >
              Anúncios
            </Link>
            <a
              href="#como-funciona"
              className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
            >
              Como funciona
            </a>
            <a
              href="#diferenciais"
              className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
            >
              Diferenciais
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {!sessao ? (
              <>
                <Link
                  href={ROTAS.LOGIN}
                  className="hidden text-sm font-medium text-stone-700 transition-colors hover:text-stone-900 sm:block"
                >
                  Entrar
                </Link>
                <Link
                  href={ROTAS.CADASTRO}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                  Cadastrar empresa
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            ) : (
              <Link
                href={ctaPrincipal.href}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                {ctaPrincipal.label}
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ──────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-stone-100 bg-gradient-to-br from-stone-50 via-white to-emerald-50/40 px-6 py-24 sm:py-36">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-50/70 blur-2xl" />
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: "radial-gradient(circle, #059669 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 shadow-sm">
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-800">
                Plataforma B2B · CNPJs e MEIs
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Troco para empresas,{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                simples e direto.
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-stone-500">
              Marketplace B2B para empresas que precisam de troco ou têm troco
              disponível. Conexão direta entre negócios — sem custódia, sem
              intermediação de pagamento.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={ctaPrincipal.href}
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg"
              >
                {ctaPrincipal.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={ctaSecundaria.href}
                className="rounded-2xl border border-stone-200 bg-white px-8 py-3.5 text-sm font-semibold text-stone-700 shadow-sm transition-all hover:border-stone-300 hover:bg-stone-50"
              >
                {ctaSecundaria.label}
              </Link>
            </div>

            {/* Social proof mini */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Análise cadastral rigorosa
              </span>
              <span className="hidden h-4 w-px bg-stone-200 sm:block" />
              <span className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-emerald-500" />
                Sistema de avaliações verificado
              </span>
              <span className="hidden h-4 w-px bg-stone-200 sm:block" />
              <span className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                Chat em tempo real
              </span>
            </div>
          </div>
        </section>

        {/* ── Trust / Pilares ──────────────────────── */}
        <section className="border-b border-stone-100 bg-stone-50 px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <p className="mb-10 text-center text-xs font-semibold uppercase tracking-widest text-stone-400">
              Por que empresas escolhem o TrocaTroco
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                {
                  icon: <BadgeCheck className="h-5 w-5 text-emerald-600" />,
                  titulo: "Aberto a CNPJs e MEIs",
                  texto:
                    "Acesso restrito a empresas e MEIs com CNPJ ativo, mediante cadastro aprovado pela nossa equipe de análise.",
                },
                {
                  icon: <Zap className="h-5 w-5 text-emerald-600" />,
                  titulo: "Negociação direta",
                  texto:
                    "Empresas se conectam e combinam a operação diretamente, sem intermediário no processo.",
                },
                {
                  icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
                  titulo: "Moderação e reputação",
                  texto:
                    "Avaliações públicas, histórico transparente e equipe de moderação ativa 24/7.",
                },
              ].map(({ icon, titulo, texto }) => (
                <div key={titulo} className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                    {icon}
                  </div>
                  <p className="text-sm font-semibold text-stone-900">{titulo}</p>
                  <p className="text-sm leading-6 text-stone-500">{texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Como funciona ────────────────────────── */}
        <section id="como-funciona" className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-14 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Processo simples
              </p>
              <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
                Como funciona
              </h2>
              <p className="mt-3 text-stone-500">
                Do cadastro à operação em 4 passos.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  n: "01",
                  icon: <Building2 className="h-5 w-5 text-white" />,
                  titulo: "Publique um anúncio",
                  texto:
                    "Informe se você tem troco disponível (oferta) ou se precisa de troco (necessidade) e o valor.",
                },
                {
                  n: "02",
                  icon: <TrendingUp className="h-5 w-5 text-white" />,
                  titulo: "Receba solicitações",
                  texto:
                    "Outras empresas interessadas enviam uma solicitação com valor e forma de pagamento.",
                },
                {
                  n: "03",
                  icon: <MessageSquare className="h-5 w-5 text-white" />,
                  titulo: "Negocie pelo chat",
                  texto:
                    "Após aceitar, combinam o local e confirmam a operação pelo chat interno em tempo real.",
                },
                {
                  n: "04",
                  icon: <Star className="h-5 w-5 text-white" />,
                  titulo: "Avalie a experiência",
                  texto:
                    "Ao concluir, ambas as partes avaliam. Reputação é pública e pesa na confiança.",
                },
              ].map(({ n, icon, titulo, texto }) => (
                <article
                  key={n}
                  className="group flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-sm">
                      {icon}
                    </div>
                    <span className="text-xl font-black text-stone-100">{n}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-sm font-semibold text-stone-800">
                      {titulo}
                    </h3>
                    <p className="text-xs leading-5 text-stone-500">{texto}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-xs leading-5 text-amber-800">
                <strong>Transparência total:</strong> o TrocaTroco não processa
                pagamentos, não faz custódia de valores e não garante a
                operação. É uma plataforma de conexão entre empresas.
              </p>
            </div>
          </div>
        </section>

        {/* ── Diferenciais ─────────────────────────── */}
        <section id="diferenciais" className="border-t border-stone-100 bg-stone-50 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-14 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Infraestrutura
              </p>
              <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
                Construído para negócios sérios
              </h2>
              <p className="mt-3 text-stone-500">
                Tecnologia de ponta e processos robustos para garantir segurança e transparência.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <BadgeCheck className="h-5 w-5 text-emerald-600" />,
                  titulo: "Verificação Cadastral",
                  texto: "Todos os cadastros — CNPJs e MEIs — passam por análise manual antes de operar na plataforma.",
                },
                {
                  icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
                  titulo: "Moderação ativa",
                  texto: "Equipe dedicada para resolução de disputas e moderação de avaliações.",
                },
                {
                  icon: <Star className="h-5 w-5 text-emerald-600" />,
                  titulo: "Reputação pública",
                  texto: "Histórico de avaliações verificado visível para todas as empresas.",
                },
                {
                  icon: <MessageSquare className="h-5 w-5 text-emerald-600" />,
                  titulo: "Chat em tempo real",
                  texto: "Comunicação direta entre empresas com histórico completo de negociações.",
                },
                {
                  icon: <Zap className="h-5 w-5 text-emerald-600" />,
                  titulo: "Operação ágil",
                  texto: "Fluxo otimizado do anúncio à conclusão da operação em poucos minutos.",
                },
                {
                  icon: <Building2 className="h-5 w-5 text-emerald-600" />,
                  titulo: "Perfil empresarial",
                  texto: "Página pública com histórico, avaliações e anúncios de cada empresa.",
                },
              ].map(({ icon, titulo, texto }) => (
                <div key={titulo} className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                    {icon}
                  </div>
                  <p className="text-sm font-semibold text-stone-800">{titulo}</p>
                  <p className="text-xs leading-5 text-stone-500">{texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Anúncios em destaque ─────────────────── */}
        <section className="border-t border-stone-100 px-6 pb-20 pt-16">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                  Ao vivo
                </p>
                <h2 className="text-2xl font-bold text-stone-900">
                  Anúncios recentes
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Veja as oportunidades ativas na plataforma.
                </p>
              </div>
              <Link
                href={ROTAS.ANUNCIOS}
                className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 underline-offset-4 hover:underline"
              >
                Ver todos <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {anuncios.length === 0 ? (
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-14 text-center">
                <Building2 className="mx-auto mb-3 h-8 w-8 text-stone-300" />
                <p className="text-sm text-stone-400">
                  Nenhum anúncio ativo no momento.
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  Cadastre sua empresa e seja o primeiro a anunciar.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {anuncios.map((anuncio) => (
                  <Link
                    key={anuncio.id}
                    href={ROTAS.ANUNCIO_DETALHE(anuncio.id)}
                    className="group flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          anuncio.tipo === "oferta"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border-amber-200 bg-amber-50 text-amber-800"
                        }`}
                      >
                        {TIPO_LABEL[anuncio.tipo] ?? anuncio.tipo}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-stone-300 transition-colors group-hover:text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold tracking-tight text-stone-900">
                      R$ {anuncio.valor_remanescente.toFixed(2)}
                    </p>
                    {anuncio.rotulo_regiao && (
                      <p className="text-xs text-stone-400">
                        📍 {anuncio.rotulo_regiao}
                      </p>
                    )}
                    <p className="mt-auto text-xs font-medium text-stone-500">
                      {anuncio.empresa?.razao_social}
                    </p>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <Link
                href={ROTAS.ANUNCIOS}
                className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 shadow-sm transition-all hover:border-stone-300 hover:bg-stone-50"
              >
                Explorar todos os anúncios
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA final (só para visitantes) ───────── */}
        {!sessao && (
          <section className="relative overflow-hidden border-t border-stone-100 bg-stone-950 px-6 py-20">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-900/20 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-emerald-800/10 blur-2xl" />
            </div>
            <div className="relative mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-900 px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-stone-400">Acesso gratuito para empresas</span>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
                Pronto para começar?
              </h2>
              <p className="mb-8 text-stone-400">
                Cadastre sua empresa e comece a operar. Análise cadastral rápida pela nossa equipe.
              </p>
              <Link
                href={ROTAS.CADASTRO}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-emerald-500 hover:shadow-xl"
              >
                Cadastrar minha empresa
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="border-t border-stone-800 bg-stone-950 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Marca */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <LogoBranca />
              <p className="max-w-xs text-sm leading-6 text-stone-400">
                Plataforma B2B de intermediação de troco entre empresas e MEIs
                com CNPJ ativo. Conexão direta, sem custódia de valores.
              </p>
              <p className="text-xs text-stone-600">
                Não processa pagamentos · Não faz custódia · Não garante operações
              </p>
            </div>

            {/* Plataforma */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Plataforma
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href={ROTAS.ANUNCIOS}
                  className="text-sm text-stone-400 transition-colors hover:text-white"
                >
                  Anúncios
                </Link>
                <Link
                  href={ROTAS.CADASTRO}
                  className="text-sm text-stone-400 transition-colors hover:text-white"
                >
                  Cadastrar empresa
                </Link>
                <Link
                  href={ROTAS.LOGIN}
                  className="text-sm text-stone-400 transition-colors hover:text-white"
                >
                  Entrar
                </Link>
              </div>
            </div>

            {/* Sobre */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Sobre
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="#como-funciona"
                  className="text-sm text-stone-400 transition-colors hover:text-white"
                >
                  Como funciona
                </a>
                <a
                  href="#diferenciais"
                  className="text-sm text-stone-400 transition-colors hover:text-white"
                >
                  Diferenciais
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-stone-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-stone-600">
              © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              <span className="text-xs text-stone-600">Plataforma segura · CNPJs e MEIs</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
