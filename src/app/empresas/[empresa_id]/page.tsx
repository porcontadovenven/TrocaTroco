import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { obterPerfilEmpresa } from "@/modules/empresas/actions";
import { getSessao } from "@/lib/sessao";
import { FormDenuncia } from "@/modules/tickets/FormDenuncia";
import { ROTAS } from "@/constants/rotas";
import { formatarDecimalBR, formatarLocalizacao, formatarMoedaBRL, pluralizar } from "@/lib/format";

const TIPO_LABEL: Record<string, string> = {
  oferta: "Oferta de troco",
  necessidade: "Necessidade de troco",
};

function Estrelas({ nota }: { nota: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= Math.round(nota) ? "text-amber-400" : "text-stone-200 dark:text-stone-700"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default async function PaginaPerfilEmpresa({
  params,
  searchParams,
}: {
  params: Promise<{ empresa_id: string }>;
  searchParams: Promise<{ avaliacao?: string }>;
}) {
  const { empresa_id } = await params;
  const { avaliacao } = await searchParams;
  const [{ perfil, error }, sessao] = await Promise.all([
    obterPerfilEmpresa(empresa_id),
    getSessao(),
  ]);

  if (error || !perfil) notFound();
  if (empresa_id !== perfil.slug_publico) {
    redirect(ROTAS.EMPRESA_PERFIL(perfil.slug_publico));
  }

  const filtroAvaliacao =
    avaliacao === "positiva" || avaliacao === "neutra" || avaliacao === "negativa"
      ? avaliacao
      : "todas";

  const avaliacoesFiltradas = perfil.avaliacoes.filter((avaliacaoAtual) => {
    if (filtroAvaliacao === "todas") return true;
    if (filtroAvaliacao === "positiva") return avaliacaoAtual.nota >= 4;
    if (filtroAvaliacao === "neutra") return avaliacaoAtual.nota === 3;
    return avaliacaoAtual.nota <= 2;
  });

  return (
    <main className="min-h-screen bg-stone-50/50 px-4 py-10 dark:bg-[#09090f]">
      <div className="mx-auto max-w-2xl">
        {/* Cabeçalho do perfil */}
        <div className="mb-6 rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-700/60 dark:bg-stone-900">
          <div className="flex items-start gap-4">
            {perfil.foto_perfil_url ? (
              <Image
                src={perfil.foto_perfil_url}
                alt={perfil.razao_social}
                width={64}
                height={64}
                className="h-16 w-16 rounded-2xl border border-stone-100 object-cover dark:border-stone-700"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-stone-200 bg-stone-100 text-2xl font-bold text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-500">
                {perfil.razao_social.charAt(0)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-stone-900 truncate dark:text-stone-50">
                {perfil.nome_fantasia ?? perfil.razao_social}
              </h1>
              {perfil.nome_fantasia && (
                <p className="text-sm text-stone-400 dark:text-stone-500">{perfil.razao_social}</p>
              )}
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                {formatarLocalizacao(perfil.cidade, perfil.estado)}
              </p>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="mt-5 flex flex-wrap gap-5 border-t border-stone-100 pt-5 dark:border-stone-800">
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400 dark:text-stone-500">Reputação</p>
              {perfil.media_nota !== null ? (
                <div className="mt-1 flex items-center gap-2">
                  <Estrelas nota={perfil.media_nota} />
                  <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                    {formatarDecimalBR(perfil.media_nota)}
                  </span>
                  <span className="text-xs text-stone-400 dark:text-stone-500">
                    ({pluralizar(perfil.total_avaliacoes, "avaliação", "avaliações")})
                  </span>
                </div>
              ) : (
                <p className="mt-1 text-sm text-stone-400 dark:text-stone-500">Sem avaliações</p>
              )}
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400 dark:text-stone-500">
                Operações concluídas
              </p>
              <p className="mt-1 text-lg font-bold text-stone-900 dark:text-stone-50">
                {perfil.total_negociacoes_concluidas}
              </p>
            </div>
          </div>
        </div>

        {/* Anúncios ativos */}
        <section className="mb-6">
          <h2 className="mb-3 text-base font-semibold text-stone-800 dark:text-stone-100">
            Anúncios ativos ({perfil.anuncios.length})
          </h2>

          {perfil.anuncios.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white px-5 py-8 text-center dark:border-stone-700/60 dark:bg-stone-900">
              <p className="text-sm text-stone-400 dark:text-stone-500">Nenhum anúncio ativo no momento.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {perfil.anuncios.map((anuncio) => (
                <li key={anuncio.id}>
                  <Link
                    href={ROTAS.ANUNCIO_DETALHE(anuncio.id)}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-5 py-4 hover:border-stone-300 hover:bg-stone-50 transition-colors dark:border-stone-700/60 dark:bg-stone-900 dark:hover:border-stone-600 dark:hover:bg-stone-800"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                        {TIPO_LABEL[anuncio.tipo] ?? anuncio.tipo}
                      </p>
                      {anuncio.rotulo_regiao && (
                        <p className="text-xs text-stone-400 dark:text-stone-500">{anuncio.rotulo_regiao}</p>
                      )}
                      {anuncio.permite_parcial && (
                        <span className="mt-1 inline-block rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                          Aceita parcial
                        </span>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-stone-900 dark:text-stone-50">
                        {formatarMoedaBRL(anuncio.valor_remanescente)}
                      </p>
                      {anuncio.valor_remanescente !== anuncio.valor_total && (
                        <p className="text-xs text-stone-400 dark:text-stone-500">
                          de {formatarMoedaBRL(anuncio.valor_total)}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Avaliações */}
        <section>
          <h2 className="mb-3 text-base font-semibold text-stone-800 dark:text-stone-100">
            Avaliações recebidas
          </h2>

          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { label: "Todas", value: "todas" },
              { label: "Positivas", value: "positiva" },
              { label: "Neutras", value: "neutra" },
              { label: "Negativas", value: "negativa" },
            ].map((filtro) => {
              const ativo = filtro.value === filtroAvaliacao;
              const href =
                filtro.value === "todas"
                  ? ROTAS.EMPRESA_PERFIL(perfil.slug_publico)
                  : `${ROTAS.EMPRESA_PERFIL(perfil.slug_publico)}?avaliacao=${filtro.value}`;

              return (
                <Link
                  key={filtro.value}
                  href={href}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    ativo
                      ? "border-stone-900 bg-stone-900 text-white dark:border-emerald-600 dark:bg-emerald-600"
                      : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
                  }`}
                >
                  {filtro.label}
                </Link>
              );
            })}
          </div>

          {avaliacoesFiltradas.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white px-5 py-8 text-center dark:border-stone-700/60 dark:bg-stone-900">
              <p className="text-sm text-stone-400 dark:text-stone-500">
                {perfil.avaliacoes.length === 0
                  ? "Nenhuma avaliação ainda."
                  : "Nenhuma avaliação encontrada para este filtro."}
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {avaliacoesFiltradas.map((av) => (
                <li
                  key={av.id}
                  className="rounded-2xl border border-stone-200 bg-white px-5 py-4 dark:border-stone-700/60 dark:bg-stone-900"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Estrelas nota={av.nota} />
                      <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
                        {av.nota}/5
                      </span>
                    </div>
                    <span className="text-xs text-stone-400 dark:text-stone-500">
                      {new Date(av.criada_em).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 dark:text-stone-500">
                    por {av.empresa_avaliadora?.razao_social ?? "—"}
                  </p>
                  {av.texto_comentario && (
                    <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{av.texto_comentario}</p>
                  )}
                  {!av.texto_comentario && !av.comentario_publico && (
                    <p className="mt-2 text-sm text-stone-400 dark:text-stone-500">
                      Comentário em moderação. A nota já compõe a reputação pública.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Denúncia — só para empresa autenticada e diferente do perfil */}
        {sessao?.empresa_id && sessao.empresa_id !== perfil.id && (
          <section className="mt-8">
            <details className="rounded-2xl border border-stone-200 bg-white dark:border-stone-700/60 dark:bg-stone-900">
              <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-stone-500 hover:text-stone-700 select-none dark:text-stone-400 dark:hover:text-stone-300">
                Denunciar esta empresa
              </summary>
              <div className="border-t border-stone-100 px-5 pb-5 pt-4 dark:border-stone-800">
                <p className="mb-4 text-xs text-stone-400 dark:text-stone-500">
                  Use apenas para casos reais. Denúncias falsas podem resultar em suspensão.
                </p>
                <FormDenuncia origemId={perfil.id} tipoOrigem="perfil_empresa" />
              </div>
            </details>
          </section>
        )}
      </div>
    </main>
  );
}
