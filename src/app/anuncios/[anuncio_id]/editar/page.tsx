import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FormAnunciar } from "@/modules/anuncios/FormAnunciar";
import { obterAnuncioParaEdicao } from "@/modules/anuncios/actions";
import { getSessao } from "@/lib/sessao";
import { ROTAS } from "@/constants/rotas";

export default async function PaginaEditarAnuncio({
  params,
}: {
  params: Promise<{ anuncio_id: string }>;
}) {
  const [{ anuncio_id }, sessao] = await Promise.all([params, getSessao()]);

  if (!sessao) {
    redirect(ROTAS.LOGIN);
  }

  const resultado = await obterAnuncioParaEdicao(anuncio_id);

  if (!resultado.anuncio) {
    notFound();
  }

  if (!resultado.pode_editar) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-2xl rounded-3xl border border-stone-200 bg-white p-6">
          <h1 className="text-2xl font-semibold text-stone-900">Edição indisponível</h1>
          <p className="mt-2 text-sm text-stone-500">
            {resultado.motivo_bloqueio ?? "Este anúncio não pode ser editado no momento."}
          </p>
          <Link
            href={ROTAS.ANUNCIO_DETALHE(anuncio_id)}
            className="mt-5 inline-flex rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Voltar ao anúncio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <FormAnunciar
          modo="editar"
          anuncioId={resultado.anuncio.id}
          hrefCancelar={ROTAS.ANUNCIO_DETALHE(resultado.anuncio.id)}
          valoresIniciais={{
            tipo: resultado.anuncio.tipo,
            permite_parcial: resultado.anuncio.permite_parcial,
            aceita_local_proprio: resultado.anuncio.aceita_local_proprio ?? false,
            rotulo_regiao: resultado.anuncio.rotulo_regiao ?? "",
            disponibilidade_texto: resultado.anuncio.disponibilidade_texto ?? "",
            expira_em: resultado.anuncio.expira_em ? resultado.anuncio.expira_em.slice(0, 10) : "",
            itens: resultado.anuncio.itens.map((item) => ({
              tipo_item: item.tipo_item,
              valor_unitario: item.valor_unitario,
              quantidade: item.quantidade,
            })),
          }}
        />
      </div>
    </main>
  );
}