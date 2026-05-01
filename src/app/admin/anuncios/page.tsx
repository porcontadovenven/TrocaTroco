import Link from "next/link";
import { FilePenLine } from "lucide-react";
import { listarAnunciosGerenciaveis } from "@/modules/anuncios/actions";
import type { StatusAnuncio, TipoAnuncio } from "@/modules/anuncios/actions";
import { AcoesAnuncio } from "@/modules/anuncios/AcoesAnuncio";
import { ROTAS } from "@/constants/rotas";
import { formatarLocalizacao, formatarMoedaBRL, pluralizar } from "@/lib/format";

const STATUS_LABEL: Record<StatusAnuncio, string> = {
  ativo: "Ativo",
  em_negociacao: "Em negociação",
  concluido: "Concluído",
  cancelado: "Cancelado",
  expirado: "Expirado",
};

const STATUS_COR: Record<StatusAnuncio, string> = {
  ativo: "bg-emerald-50 border-emerald-200 text-emerald-800",
  em_negociacao: "bg-amber-50 border-amber-200 text-amber-800",
  concluido: "bg-stone-100 border-stone-200 text-stone-600",
  cancelado: "bg-red-50 border-red-200 text-red-700",
  expirado: "bg-stone-50 border-stone-200 text-stone-500",
};

const TIPO_LABEL: Record<TipoAnuncio, string> = {
  oferta: "Oferta",
  necessidade: "Necessidade",
};

export default async function PaginaAdminAnuncios() {
  const { anuncios, error } = await listarAnunciosGerenciaveis();

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-stone-400">
              <FilePenLine className="h-3.5 w-3.5" />
              Gestão de anúncios
            </div>
            <h1 className="text-2xl font-bold text-stone-900">Gerenciar anúncios</h1>
            <p className="mt-1 text-sm text-stone-500">
              {pluralizar(anuncios.length, "anúncio disponível para gestão", "anúncios disponíveis para gestão")}
            </p>
          </div>
          <Link
            href={ROTAS.ADMIN}
            className="text-sm text-stone-500 underline-offset-4 hover:underline"
          >
            ← Painel admin
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!error && anuncios.length === 0 && (
          <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center">
            <p className="text-sm text-stone-400">Nenhum anúncio encontrado.</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {anuncios.map((anuncio) => (
            <div
              key={anuncio.id}
              className="rounded-3xl border border-stone-200 bg-white p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-stone-500">
                      {TIPO_LABEL[anuncio.tipo]}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COR[anuncio.status]}`}>
                      {STATUS_LABEL[anuncio.status]}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-stone-900">
                    {formatarMoedaBRL(anuncio.valor_total)}
                  </p>
                  {anuncio.valor_remanescente !== anuncio.valor_total && (
                    <p className="text-xs text-stone-400">
                      Remanescente: {formatarMoedaBRL(anuncio.valor_remanescente)}
                    </p>
                  )}
                  <p className="text-sm font-medium text-stone-700">
                    {anuncio.empresa?.razao_social ?? "Empresa não encontrada"}
                  </p>
                  {(anuncio.empresa?.cidade || anuncio.empresa?.estado) && (
                    <p className="text-xs text-stone-500">
                      {formatarLocalizacao(anuncio.empresa?.cidade ?? null, anuncio.empresa?.estado ?? null)}
                    </p>
                  )}
                  {anuncio.rotulo_regiao && (
                    <p className="text-xs text-stone-500">{anuncio.rotulo_regiao}</p>
                  )}
                  <p className="text-xs text-stone-400">
                    Publicado em {new Date(anuncio.publicado_em).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={ROTAS.ANUNCIO_DETALHE(anuncio.id)}
                      className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50"
                    >
                      Ver detalhe
                    </Link>
                    <AcoesAnuncio
                      anuncioId={anuncio.id}
                      hrefEditar={ROTAS.ANUNCIO_EDITAR(anuncio.id)}
                      compacta
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}