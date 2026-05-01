import Link from "next/link";
import { notFound } from "next/navigation";
import { obterDetalheAnuncio } from "@/modules/anuncios/actions";
import { getSessao } from "@/lib/sessao";
import { isAdmin } from "@/constants/papeis";
import { ROTAS } from "@/constants/rotas";
import { AcoesAnuncio } from "@/modules/anuncios/AcoesAnuncio";
import type { TipoAnuncio, TipoItemDinheiro } from "@/modules/anuncios/actions";
import { FormSolicitacao } from "@/modules/solicitacoes/FormSolicitacao";
import { formatarLocalizacao, formatarMoedaBRL } from "@/lib/format";

const TIPO_LABEL: Record<TipoAnuncio, string> = {
  oferta: "Oferta de troco",
  necessidade: "Necessidade de troco",
};

const ITEM_LABEL: Record<TipoItemDinheiro, string> = {
  cedula: "Cédula",
  moeda: "Moeda",
};

export default async function PaginaDetalheAnuncio({
  params,
}: {
  params: Promise<{ anuncio_id: string }>;
}) {
  const { anuncio_id } = await params;
  const { anuncio, error } = await obterDetalheAnuncio(anuncio_id);
  const sessao = await getSessao();

  if (error || !anuncio) notFound();

  const empresa = Array.isArray(anuncio.empresa)
    ? (anuncio.empresa as unknown as { id: string; slug_publico?: string | null; razao_social: string; cidade: string; estado: string }[])[0]
    : anuncio.empresa;

  const isAutora = sessao?.empresa_id === empresa?.id;
  const podeGerenciar = !!sessao && (isAutora || isAdmin(sessao.papel));
  const isAprovada = sessao?.status_empresa === "aprovada";
  const disponivel = anuncio.status === "ativo";

  const itens = (
    Array.isArray(anuncio.itens) ? anuncio.itens : []
  )
    .filter((item) => item.quantidade > 0)
    .sort((a, b) => (a.ordem_exibicao ?? 0) - (b.ordem_exibicao ?? 0));

  return (
    <main className="min-h-screen bg-stone-50/50 px-6 py-10 dark:bg-[#09090f]">
      <div className="mx-auto max-w-2xl">
        {/* Navegação de volta */}
        <Link
          href={ROTAS.ANUNCIOS}
          className="mb-6 inline-block text-sm text-stone-500 underline-offset-4 hover:underline dark:text-stone-400"
        >
          ← Todos os anúncios
        </Link>

        <div className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-700/60 dark:bg-stone-900">
          {/* Cabeçalho */}
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                {TIPO_LABEL[anuncio.tipo]}
              </p>
              <p className="mt-1 text-3xl font-bold text-stone-900 dark:text-stone-50">
                {formatarMoedaBRL(anuncio.valor_total)}
              </p>
              {anuncio.valor_remanescente !== anuncio.valor_total && (
                <p className="mt-0.5 text-sm text-stone-400 dark:text-stone-500">
                  Remanescente: {formatarMoedaBRL(anuncio.valor_remanescente)}
                </p>
              )}
            </div>
            <StatusBadge status={anuncio.status} />
          </div>

          {/* Empresa */}
          {empresa && (
            <div className="mb-5 flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3 dark:bg-stone-800/60">
              <div>
                <p className="text-sm font-medium text-stone-800 dark:text-stone-100">
                  {empresa.razao_social}
                </p>
                {(empresa.cidade || empresa.estado) && (
                  <p className="text-xs text-stone-400 dark:text-stone-500">
                    {formatarLocalizacao(empresa.cidade, empresa.estado)}
                  </p>
                )}
              </div>
              <Link
                href={ROTAS.EMPRESA_PERFIL(empresa.slug_publico ?? empresa.id)}
                className="text-xs text-stone-500 underline-offset-4 hover:underline dark:text-stone-400"
              >
                Ver perfil
              </Link>
            </div>
          )}

          {/* Composição */}
          {itens.length > 0 && (
            <div className="mb-5">
              <h2 className="mb-3 text-sm font-semibold text-stone-800 dark:text-stone-100">
                Composição
              </h2>
              <div className="flex flex-col gap-1.5">
                {itens.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-stone-50 px-4 py-2 text-sm dark:bg-stone-800/60"
                  >
                    <span className="text-stone-600 dark:text-stone-400">
                      {ITEM_LABEL[item.tipo_item]} {formatarMoedaBRL(item.valor_unitario)} × {item.quantidade}
                    </span>
                    <span className="font-medium text-stone-800 dark:text-stone-200">
                      {formatarMoedaBRL(item.subtotal_valor)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regras */}
          <div className="mb-5 flex flex-wrap gap-2">
            {anuncio.permite_parcial && (
              <Tag texto="Aceita parcial" />
            )}
            {anuncio.tipo === "oferta" && anuncio.aceita_local_proprio && (
              <Tag texto="Troca na própria empresa" />
            )}
            {anuncio.rotulo_regiao && (
              <Tag texto={anuncio.rotulo_regiao} />
            )}
          </div>

          {/* Disponibilidade e validade */}
          <div className="mb-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            {anuncio.disponibilidade_texto && (
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400 dark:text-stone-500">Disponibilidade</p>
                <p className="text-stone-700 dark:text-stone-300">{anuncio.disponibilidade_texto}</p>
              </div>
            )}
            {anuncio.expira_em && (
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400 dark:text-stone-500">Válido até</p>
                <p className="text-stone-700 dark:text-stone-300">
                  {new Date(anuncio.expira_em).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400 dark:text-stone-500">Publicado em</p>
              <p className="text-stone-700 dark:text-stone-300">
                {new Date(anuncio.publicado_em).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          {/* Ação operacional */}
          <div className="border-t border-stone-100 pt-5 dark:border-stone-800">
            {/* Visitante não autenticado */}
            {!sessao && (
              <div className="flex flex-col gap-2 rounded-2xl bg-stone-50 p-4 text-center dark:bg-stone-800/50">
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Para interagir com este anúncio, entre com sua conta.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href={ROTAS.LOGIN}
                    className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
                  >
                    Entrar
                  </Link>
                  <Link
                    href={ROTAS.CADASTRO}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                  >
                    Cadastrar empresa
                  </Link>
                </div>
              </div>
            )}

            {/* Empresa autora */}
            {sessao && isAutora && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-stone-700 dark:text-stone-300">Este é seu anúncio.</p>
                <Link
                  href={ROTAS.SOLICITACOES}
                  className="rounded-xl border border-stone-300 px-4 py-2.5 text-center text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
                >
                  Ver solicitações vinculadas
                </Link>
                <AcoesAnuncio
                  anuncioId={anuncio.id}
                  hrefEditar={ROTAS.ANUNCIO_EDITAR(anuncio.id)}
                  hrefAposExcluir={ROTAS.MEUS_ANUNCIOS}
                />
              </div>
            )}

            {sessao && !isAutora && podeGerenciar && (
              <div className="flex flex-col gap-2 rounded-2xl bg-stone-50 p-4 dark:bg-stone-800/50">
                <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Gestão administrativa deste anúncio.
                </p>
                <AcoesAnuncio
                  anuncioId={anuncio.id}
                  hrefEditar={ROTAS.ANUNCIO_EDITAR(anuncio.id)}
                  hrefAposExcluir={ROTAS.ADMIN_ANUNCIOS}
                />
              </div>
            )}

            {/* Empresa aprovada, não autora */}
            {sessao && isAprovada && !isAutora && disponivel && (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-stone-800">
                  {anuncio.tipo === "oferta" ? "Solicitar troco" : "Atender necessidade"}
                </p>
                <FormSolicitacao
                  anuncioId={anuncio.id}
                  valorMaximo={anuncio.valor_remanescente}
                  permiteParcial={anuncio.permite_parcial}
                  aceita_local_proprio={anuncio.aceita_local_proprio ?? null}
                  itensAnuncio={itens}
                />
              </div>
            )}

            {/* Empresa aprovada, não autora, anúncio indisponível */}
            {sessao && isAprovada && !isAutora && !disponivel && (
              <p className="text-sm text-stone-400 dark:text-stone-500">
                Este anúncio não está disponível para novas solicitações.
              </p>
            )}

            {/* Empresa não aprovada */}
            {sessao && !isAprovada && !isAutora && (
              <p className="text-sm text-stone-400 dark:text-stone-500">
                Sua empresa precisa estar aprovada para interagir com anúncios.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Componentes internos
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ativo: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-900/60 dark:text-emerald-300",
    em_negociacao: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/50 dark:border-amber-900/60 dark:text-amber-300",
    concluido: "bg-stone-100 border-stone-200 text-stone-600 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400",
    cancelado: "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/50 dark:border-red-900/60 dark:text-red-400",
    expirado: "bg-stone-50 border-stone-200 text-stone-500 dark:bg-stone-800/50 dark:border-stone-700 dark:text-stone-500",
  };
  const label: Record<string, string> = {
    ativo: "Disponível",
    em_negociacao: "Em negociação",
    concluido: "Concluído",
    cancelado: "Cancelado",
    expirado: "Expirado",
  };
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${map[status] ?? ""}`}>
      {label[status] ?? status}
    </span>
  );
}

function Tag({ texto }: { texto: string }) {
  return (
    <span className="rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400">
      {texto}
    </span>
  );
}
