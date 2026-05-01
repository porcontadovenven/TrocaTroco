import Link from "next/link";
import { ArrowRight, Megaphone, Plus } from "lucide-react";
import { listarMeusAnuncios } from "@/modules/anuncios/actions";
import { AcoesAnuncio } from "@/modules/anuncios/AcoesAnuncio";
import { ROTAS } from "@/constants/rotas";
import type { StatusAnuncio, TipoAnuncio } from "@/modules/anuncios/actions";
import { formatarMoedaBRL, pluralizar } from "@/lib/format";

const STATUS_LABEL: Record<StatusAnuncio, string> = {
  ativo: "Ativo",
  em_negociacao: "Em negociação",
  concluido: "Concluído",
  cancelado: "Cancelado",
  expirado: "Expirado",
};

const STATUS_COR: Record<StatusAnuncio, string> = {
  ativo: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-900/60 dark:text-emerald-300",
  em_negociacao: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/50 dark:border-amber-900/60 dark:text-amber-300",
  concluido: "bg-stone-100 border-stone-200 text-stone-600 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400",
  cancelado: "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/50 dark:border-red-900/60 dark:text-red-400",
  expirado: "bg-stone-50 border-stone-200 text-stone-500 dark:bg-stone-800/50 dark:border-stone-700 dark:text-stone-500",
};

const TIPO_LABEL: Record<TipoAnuncio, string> = {
  oferta: "Oferta",
  necessidade: "Necessidade",
};

export default async function PaginaMeusAnuncios() {
  const { anuncios, error } = await listarMeusAnuncios();

  return (
    <main className="min-h-screen bg-stone-50/50 px-6 py-10 dark:bg-[#09090f]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-stone-400 dark:text-stone-500">
              <Megaphone className="h-3.5 w-3.5" />
              Meus anúncios
            </div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">Anúncios publicados</h1>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {pluralizar(anuncios.length, "anúncio", "anúncios")} no total
            </p>
          </div>
          <Link
            href={ROTAS.ANUNCIAR}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/25 hover:bg-emerald-500"
          >
            <Plus className="h-4 w-4" />
            Criar anúncio
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            Erro ao carregar anúncios: {error}
          </div>
        )}

        {!error && anuncios.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-stone-200 bg-white py-16 text-center dark:border-stone-700/60 dark:bg-stone-900">
            <p className="text-stone-400 dark:text-stone-500">Você ainda não tem anúncios publicados.</p>
            <Link
              href={ROTAS.ANUNCIAR}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Criar primeiro anúncio
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {anuncios.map((anuncio) => (
            <div
              key={anuncio.id}
              className="flex flex-col gap-3 rounded-3xl border border-stone-200 bg-white p-5 transition-all hover:shadow-md dark:border-stone-700/60 dark:bg-stone-900 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                    {TIPO_LABEL[anuncio.tipo]}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COR[anuncio.status]}`}
                  >
                    {STATUS_LABEL[anuncio.status]}
                  </span>
                </div>
                <p className="text-lg font-semibold text-stone-900 dark:text-stone-50">
                  {formatarMoedaBRL(anuncio.valor_total)}
                </p>
                {anuncio.valor_remanescente !== anuncio.valor_total && (
                  <p className="text-xs text-stone-400 dark:text-stone-500">
                    Remanescente: {formatarMoedaBRL(anuncio.valor_remanescente)}
                  </p>
                )}
                {anuncio.rotulo_regiao && (
                  <p className="text-xs text-stone-500 dark:text-stone-400">{anuncio.rotulo_regiao}</p>
                )}
                <p className="text-xs text-stone-400 dark:text-stone-500">
                  Publicado em{" "}
                  {new Date(anuncio.publicado_em).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div className="flex flex-col items-start gap-2 sm:items-end">
                <Link
                  href={ROTAS.ANUNCIO_DETALHE(anuncio.id)}
                  className="flex items-center gap-1.5 self-start rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition-all hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-300 dark:hover:bg-stone-800 sm:self-center"
                >
                  Ver detalhe <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <AcoesAnuncio
                  anuncioId={anuncio.id}
                  hrefEditar={ROTAS.ANUNCIO_EDITAR(anuncio.id)}
                  compacta
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
