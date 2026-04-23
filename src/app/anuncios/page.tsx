import Link from "next/link";
import { listarAnunciosPublicos } from "@/modules/anuncios/actions";
import { ROTAS } from "@/constants/rotas";
import type { StatusAnuncio, TipoAnuncio } from "@/modules/anuncios/actions";
import { getSessao } from "@/lib/sessao";
import { isAdmin } from "@/constants/papeis";

const TIPO_LABEL: Record<TipoAnuncio, string> = {
  oferta: "Oferta",
  necessidade: "Necessidade",
};

const TIPO_COR: Record<TipoAnuncio, string> = {
  oferta: "bg-emerald-50 border-emerald-200 text-emerald-800",
  necessidade: "bg-amber-50 border-amber-200 text-amber-800",
};

const STATUS_LABEL: Record<StatusAnuncio, string> = {
  ativo: "Disponível",
  em_negociacao: "Em negociação",
  concluido: "Concluído",
  cancelado: "Cancelado",
  expirado: "Expirado",
};

const FILTROS_TIPO: Array<{ label: string; value?: TipoAnuncio }> = [
  { label: "Todos" },
  { label: "Ofertas", value: "oferta" },
  { label: "Necessidades", value: "necessidade" },
];

export default async function PaginaAnuncios({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo } = await searchParams;
  const tipoSelecionado = tipo === "oferta" || tipo === "necessidade" ? tipo : undefined;

  const [{ anuncios, total, error }, sessao] = await Promise.all([
    listarAnunciosPublicos(1, 20, tipoSelecionado),
    getSessao(),
  ]);

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900">Anúncios</h1>
          <p className="mt-1 text-sm text-stone-500">
            {total} anúncio{total !== 1 ? "s" : ""} disponíveis na plataforma
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {FILTROS_TIPO.map((filtro) => {
              const ativo = filtro.value === tipoSelecionado || (!filtro.value && !tipoSelecionado);

              return (
                <Link
                  key={filtro.label}
                  href={filtro.value ? `${ROTAS.ANUNCIOS}?tipo=${filtro.value}` : ROTAS.ANUNCIOS}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    ativo
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  {filtro.label}
                </Link>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            Erro ao carregar anúncios. Tente novamente mais tarde.
          </div>
        )}

        {!error && anuncios.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-stone-200 bg-white py-20 text-center">
            <p className="text-stone-400">
              {tipoSelecionado
                ? `Nenhum anúncio de ${tipoSelecionado === "oferta" ? "oferta" : "necessidade"} disponível no momento.`
                : "Nenhum anúncio disponível no momento."}
            </p>
            <Link href={ROTAS.HOME} className="text-sm text-stone-500 underline-offset-4 hover:underline">
              ← Voltar para a home
            </Link>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {anuncios.map((anuncio) => {
            const empresa = Array.isArray(anuncio.empresa)
              ? anuncio.empresa[0]
              : anuncio.empresa;

            return (
              <div
                key={anuncio.id}
                className="flex flex-col gap-3 rounded-3xl border border-stone-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TIPO_COR[anuncio.tipo]}`}
                  >
                    {TIPO_LABEL[anuncio.tipo]}
                  </span>
                  <span className="text-xs text-stone-400">
                    {STATUS_LABEL[anuncio.status]}
                  </span>
                </div>

                <div>
                  <p className="text-xl font-bold text-stone-900">
                    R$ {anuncio.valor_total.toFixed(2)}
                  </p>
                  {anuncio.permite_parcial && (
                    <p className="text-xs text-stone-400">Aceita parcial</p>
                  )}
                </div>

                {empresa && (
                  <div>
                    <p className="text-sm font-medium text-stone-700">
                      {empresa.razao_social}
                    </p>
                    {(empresa.cidade || empresa.estado) && (
                      <p className="text-xs text-stone-400">
                        {[empresa.cidade, empresa.estado].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                )}

                {anuncio.rotulo_regiao && (
                  <p className="text-xs text-stone-500">{anuncio.rotulo_regiao}</p>
                )}

                <div className="mt-auto flex items-center justify-between pt-2">
                  <p className="text-xs text-stone-400">
                    {new Date(anuncio.publicado_em).toLocaleDateString("pt-BR")}
                  </p>
                  <Link
                    href={ROTAS.ANUNCIO_DETALHE(anuncio.id)}
                    className="rounded-xl border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                  >
                    Ver detalhe →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA para visitantes */}
        {!sessao ? (
          <div className="mt-10 rounded-3xl border border-stone-200 bg-white px-6 py-8 text-center">
            <p className="text-sm text-stone-600">
              Para interagir com os anúncios, faça login ou cadastre sua empresa.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={ROTAS.LOGIN}
                className="rounded-xl border border-stone-300 px-5 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Entrar
              </Link>
              <Link
                href={ROTAS.CADASTRO}
                className="rounded-xl bg-stone-900 px-5 py-2 text-sm font-semibold text-white hover:bg-stone-700"
              >
                Cadastrar empresa
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-stone-200 bg-white px-6 py-8 text-center">
            <p className="text-sm text-stone-600">
              {isAdmin(sessao.papel)
                ? "Você está autenticado como administrador."
                : sessao.status_empresa === "aprovada"
                ? "Sua empresa está autenticada e pronta para interagir com os anúncios."
                : "Sua empresa está autenticada, mas ainda depende da aprovação cadastral para operar."}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={
                  isAdmin(sessao.papel)
                    ? ROTAS.ADMIN
                    : sessao.status_empresa === "aprovada"
                    ? ROTAS.DASHBOARD
                    : ROTAS.STATUS_CADASTRAL
                }
                className="rounded-xl bg-stone-900 px-5 py-2 text-sm font-semibold text-white hover:bg-stone-700"
              >
                {isAdmin(sessao.papel)
                  ? "Ir para painel admin"
                  : sessao.status_empresa === "aprovada"
                  ? "Ir para dashboard"
                  : "Ver status cadastral"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
