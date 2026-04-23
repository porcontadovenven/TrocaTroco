import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessao } from "@/lib/sessao";
import { ROTAS } from "@/constants/rotas";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function LinkAcao({
  href,
  titulo,
  descricao,
  destaque,
}: {
  href: string;
  titulo: string;
  descricao: string;
  destaque?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col gap-1 rounded-2xl border px-5 py-4 transition-colors ${
        destaque
          ? "border-stone-900 bg-stone-900 text-white hover:bg-stone-800"
          : "border-stone-200 bg-white text-stone-800 hover:bg-stone-50"
      }`}
    >
      <span className="text-sm font-semibold">{titulo}</span>
      <span className={`text-xs ${destaque ? "text-stone-300" : "text-stone-400"}`}>
        {descricao}
      </span>
    </Link>
  );
}

export default async function PaginaDashboard() {
  const sessao = await getSessao();
  if (!sessao) redirect(ROTAS.LOGIN);
  if (sessao.status_empresa !== "aprovada") redirect(ROTAS.STATUS_CADASTRAL);

  const supabase = await getSupabaseServerClient();
  const empresaId = sessao.empresa_id!;

  // Contadores em paralelo
  const [
    { count: totalAnuncios },
    { count: anunciosAtivos },
    { count: solPendentes },
    { count: negAndamento },
  ] = await Promise.all([
    supabase
      .from("anuncios")
      .select("id", { count: "exact", head: true })
      .eq("empresa_id", empresaId),
    supabase
      .from("anuncios")
      .select("id", { count: "exact", head: true })
      .eq("empresa_id", empresaId)
      .eq("status", "ativo"),
    supabase
      .from("solicitacoes")
      .select("id", { count: "exact", head: true })
      .eq("status", "pendente")
      .in(
        "anuncio_id",
        await supabase
          .from("anuncios")
          .select("id")
          .eq("empresa_id", empresaId)
          .then(({ data }) => (data ?? []).map((a) => a.id)),
      ),
    supabase
      .from("negociacoes")
      .select("id", { count: "exact", head: true })
      .eq("status", "em_andamento")
      .or(
        `empresa_autora_id.eq.${empresaId},empresa_contraparte_id.eq.${empresaId}`,
      ),
  ]);

  // Negociação ativa mais recente para link rápido
  const { data: negAtiva } = await supabase
    .from("negociacoes")
    .select("id")
    .eq("status", "em_andamento")
    .or(`empresa_autora_id.eq.${empresaId},empresa_contraparte_id.eq.${empresaId}`)
    .order("criada_em", { ascending: false })
    .limit(1)
    .maybeSingle();

  const temPendencias = (solPendentes ?? 0) > 0 || (negAndamento ?? 0) > 0;

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Saudação */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900">
            Olá, {sessao.nome_completo?.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Aqui está um resumo da sua operação no TrocaTroco.
          </p>
        </div>

        {/* Atenção rápida */}
        {temPendencias && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="text-sm font-medium text-amber-800">
              Você tem itens que precisam de atenção:
            </p>
            <ul className="mt-2 flex flex-wrap gap-3 text-xs text-amber-700">
              {(solPendentes ?? 0) > 0 && (
                <li>
                  <Link href={ROTAS.SOLICITACOES} className="underline underline-offset-4">
                    {solPendentes} solicitação{solPendentes !== 1 ? "ões" : ""} pendente{solPendentes !== 1 ? "s" : ""}
                  </Link>
                </li>
              )}
              {(negAndamento ?? 0) > 0 && (
                <li>
                  {negAtiva ? (
                    <Link href={ROTAS.NEGOCIACAO(negAtiva.id)} className="underline underline-offset-4">
                      {negAndamento} negociação{negAndamento !== 1 ? "ões" : ""} em andamento
                    </Link>
                  ) : (
                    <span>{negAndamento} negociação{negAndamento !== 1 ? "ões" : ""} em andamento</span>
                  )}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Contadores */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Anúncios ativos", valor: anunciosAtivos ?? 0 },
            { label: "Total de anúncios", valor: totalAnuncios ?? 0 },
            { label: "Solicitações recebidas pendentes", valor: solPendentes ?? 0, alerta: true },
            { label: "Negociações em andamento", valor: negAndamento ?? 0 },
          ].map(({ label, valor, alerta }) => (
            <div
              key={label}
              className={`rounded-2xl border px-5 py-4 ${
                alerta && valor > 0
                  ? "border-amber-200 bg-amber-50"
                  : "border-stone-200 bg-white"
              }`}
            >
              <p
                className={`text-2xl font-bold ${
                  alerta && valor > 0 ? "text-amber-700" : "text-stone-900"
                }`}
              >
                {valor}
              </p>
              <p className="mt-0.5 text-xs text-stone-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Ações */}
        <div className="mb-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Ações
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <LinkAcao
              href={ROTAS.ANUNCIAR}
              titulo="Publicar anúncio"
              descricao="Ofereça ou procure troco"
              destaque
            />
            <LinkAcao
              href={ROTAS.MEUS_ANUNCIOS}
              titulo="Meus anúncios"
              descricao="Gerencie seus anúncios ativos"
            />
            <LinkAcao
              href={ROTAS.SOLICITACOES}
              titulo={`Solicitações`}
              descricao="Veja enviadas e recebidas"
            />
            <LinkAcao
              href={ROTAS.TICKETS}
              titulo="Minhas denúncias"
              descricao="Acompanhe tickets e respostas da moderação"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {negAtiva && (
            <LinkAcao
              href={ROTAS.NEGOCIACAO(negAtiva.id)}
              titulo="Continuar negociação"
              descricao="Acesse o chat da negociação ativa"
            />
          )}
          <LinkAcao
            href={ROTAS.ANUNCIOS}
            titulo="Explorar anúncios"
            descricao="Veja ofertas e necessidades de outras empresas"
          />
          <LinkAcao
            href={ROTAS.EMPRESA_PERFIL(sessao.empresa_slug_publico ?? empresaId)}
            titulo="Meu perfil público"
            descricao="Como outras empresas te veem"
          />
        </div>
      </div>
    </main>
  );
}
