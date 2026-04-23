import Link from "next/link";
import { listarAnunciosPublicos } from "@/modules/anuncios/actions";
import { ROTAS } from "@/constants/rotas";
import { APP_NAME } from "@/constants/app";

const TIPO_LABEL: Record<string, string> = {
  oferta: "Oferta de troco",
  necessidade: "Necessidade de troco",
};

export default async function Home() {
  const { anuncios } = await listarAnunciosPublicos(1, 6);

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      {/* Hero */}
      <section className="bg-white border-b border-stone-100 px-6 py-16">
        <div className="mx-auto max-w-4xl flex flex-col items-center text-center gap-6">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-800">
            Plataforma B2B de troco
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {APP_NAME}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-stone-600">
            Marketplace para empresas que precisam de troco ou têm troco disponível.
            Sem custódia, sem intermediação de pagamento — só conexão direta entre empresas.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={ROTAS.CADASTRO}
              className="rounded-2xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-700 transition-colors"
            >
              Cadastrar minha empresa
            </Link>
            <Link
              href={ROTAS.LOGIN}
              className="rounded-2xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Entrar
            </Link>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-xl font-semibold text-stone-800">
            Como funciona
          </h2>
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              {
                n: "1",
                titulo: "Publique um anúncio",
                texto: "Informe se você tem troco disponível (oferta) ou se precisa de troco (necessidade) e o valor.",
              },
              {
                n: "2",
                titulo: "Receba solicitações",
                texto: "Outras empresas interessadas enviam uma solicitação com valor e forma de pagamento.",
              },
              {
                n: "3",
                titulo: "Negocie pelo chat",
                texto: "Após aceitar, combinam o local e confirmam a operação pelo chat interno.",
              },
              {
                n: "4",
                titulo: "Avalie a experiência",
                texto: "Ao concluir, ambas as partes avaliam. Reputação é pública e pesa na confiança.",
              },
            ].map(({ n, titulo, texto }) => (
              <article key={n} className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-white p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-sm font-bold text-stone-600">
                  {n}
                </span>
                <h3 className="text-sm font-semibold text-stone-800">{titulo}</h3>
                <p className="text-xs leading-5 text-stone-500">{texto}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4">
            <p className="text-xs text-amber-800">
              <strong>Importante:</strong> o TrocaTroco não processa pagamentos, não faz custódia de valores e não garante a operação. É uma plataforma de conexão entre empresas.
            </p>
          </div>
        </div>
      </section>

      {/* Anúncios em destaque */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-stone-800">Anúncios recentes</h2>
            <Link
              href={ROTAS.ANUNCIOS}
              className="text-sm text-stone-500 underline-offset-4 hover:underline"
            >
              Ver todos →
            </Link>
          </div>

          {anuncios.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white px-5 py-10 text-center">
              <p className="text-sm text-stone-400">Nenhum anúncio ativo no momento.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {anuncios.map((anuncio) => (
                <Link
                  key={anuncio.id}
                  href={ROTAS.ANUNCIO_DETALHE(anuncio.id)}
                  className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-white p-5 hover:border-stone-300 hover:bg-stone-50 transition-colors"
                >
                  <span className="text-xs font-medium text-stone-500">
                    {TIPO_LABEL[anuncio.tipo] ?? anuncio.tipo}
                  </span>
                  <p className="text-2xl font-bold text-stone-900">
                    R$ {anuncio.valor_remanescente.toFixed(2)}
                  </p>
                  {anuncio.rotulo_regiao && (
                    <p className="text-xs text-stone-400">{anuncio.rotulo_regiao}</p>
                  )}
                  <p className="mt-auto text-xs text-stone-400">
                    {anuncio.empresa?.razao_social}
                  </p>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href={ROTAS.ANUNCIOS}
              className="inline-block rounded-2xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Explorar todos os anúncios
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
