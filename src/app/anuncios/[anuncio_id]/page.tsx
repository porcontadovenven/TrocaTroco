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
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Navegação de volta */}
        <Link
          href={ROTAS.ANUNCIOS}
          className="mb-6 inline-block text-sm text-stone-500 underline-offset-4 hover:underline"
        >
          ← Todos os anúncios
        </Link>

        <div className="rounded-3xl border border-stone-200 bg-white p-6">
          {/* Cabeçalho */}
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                {TIPO_LABEL[anuncio.tipo]}
              </p>
              <p className="mt-1 text-3xl font-bold text-stone-900">
                {formatarMoedaBRL(anuncio.valor_total)}
              </p>
              {anuncio.valor_remanescente !== anuncio.valor_total && (
                <p className="mt-0.5 text-sm text-stone-400">
                  Remanescente: {formatarMoedaBRL(anuncio.valor_remanescente)}
                </p>
              )}
            </div>
            <StatusBadge status={anuncio.status} />
          </div>

          {/* Empresa */}
          {empresa && (
            <div className="mb-5 flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-stone-800">
                  {empresa.razao_social}
                </p>
                {(empresa.cidade || empresa.estado) && (
                  <p className="text-xs text-stone-400">
                    {formatarLocalizacao(empresa.cidade, empresa.estado)}
                  </p>
                )}
              </div>
              <Link
                href={ROTAS.EMPRESA_PERFIL(empresa.slug_publico ?? empresa.id)}
                className="text-xs text-stone-500 underline-offset-4 hover:underline"
              >
                Ver perfil
              </Link>
            </div>
          )}

          {/* Composição */}
          {itens.length > 0 && (
            <div className="mb-5">
              <h2 className="mb-3 text-sm font-semibold text-stone-800">
                Composição
              </h2>
              <div className="flex flex-col gap-1.5">
                {itens.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-stone-50 px-4 py-2 text-sm"
                  >
                    <span className="text-stone-600">
                      {ITEM_LABEL[item.tipo_item]} {formatarMoedaBRL(item.valor_unitario)} × {item.quantidade}
                    </span>
                    <span className="font-medium text-stone-800">
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
                <p className="text-xs uppercase tracking-wide text-stone-400">Disponibilidade</p>
                <p className="text-stone-700">{anuncio.disponibilidade_texto}</p>
              </div>
            )}
            {anuncio.expira_em && (
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">Válido até</p>
                <p className="text-stone-700">
                  {new Date(anuncio.expira_em).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400">Publicado em</p>
              <p className="text-stone-700">
                {new Date(anuncio.publicado_em).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          {/* Ação operacional */}
          <div className="border-t border-stone-100 pt-5">
            {/* Visitante não autenticado */}
            {!sessao && (
              <div className="flex flex-col gap-2 rounded-2xl bg-stone-50 p-4 text-center">
                <p className="text-sm text-stone-600">
                  Para interagir com este anúncio, entre com sua conta.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href={ROTAS.LOGIN}
                    className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
                  >
                    Entrar
                  </Link>
                  <Link
                    href={ROTAS.CADASTRO}
                    className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
                  >
                    Cadastrar empresa
                  </Link>
                </div>
              </div>
            )}

            {/* Empresa autora */}
            {sessao && isAutora && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-stone-700">Este é seu anúncio.</p>
                <Link
                  href={ROTAS.SOLICITACOES}
                  className="rounded-xl border border-stone-300 px-4 py-2.5 text-center text-sm font-medium text-stone-700 hover:bg-stone-50"
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
              <div className="flex flex-col gap-2 rounded-2xl bg-stone-50 p-4">
                <p className="text-sm font-medium text-stone-700">
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
              <p className="text-sm text-stone-400">
                Este anúncio não está disponível para novas solicitações.
              </p>
            )}

            {/* Empresa não aprovada */}
            {sessao && !isAprovada && !isAutora && (
              <p className="text-sm text-stone-400">
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
    ativo: "bg-emerald-50 border-emerald-200 text-emerald-800",
    em_negociacao: "bg-amber-50 border-amber-200 text-amber-800",
    concluido: "bg-stone-100 border-stone-200 text-stone-600",
    cancelado: "bg-red-50 border-red-200 text-red-700",
    expirado: "bg-stone-50 border-stone-200 text-stone-500",
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
    <span className="rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs text-stone-600">
      {texto}
    </span>
  );
}
