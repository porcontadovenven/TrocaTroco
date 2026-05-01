import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Bell,
  Building2,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Plus,
  TicketCheck,
} from "lucide-react";

import { getSessao } from "@/lib/sessao";
import { ROTAS } from "@/constants/rotas";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function StatCard({
  label,
  valor,
  alerta,
  icon,
}: {
  label: string;
  valor: number;
  alerta?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border p-5 ${
        alerta && valor > 0
          ? "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/40"
          : "border-stone-200 bg-white dark:border-stone-700/60 dark:bg-stone-900"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          alerta && valor > 0
            ? "bg-amber-100 dark:bg-amber-950/60"
            : "bg-stone-100 dark:bg-stone-800"
        }`}
      >
        <span className={alerta && valor > 0 ? "text-amber-600 dark:text-amber-400" : "text-stone-500 dark:text-stone-400"}>
          {icon}
        </span>
      </div>
      <div>
        <p
          className={`text-2xl font-bold tracking-tight ${
            alerta && valor > 0 ? "text-amber-700 dark:text-amber-400" : "text-stone-900 dark:text-stone-50"
          }`}
        >
          {valor}
        </p>
        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">{label}</p>
      </div>
    </div>
  );
}

function LinkAcao({
  href,
  titulo,
  descricao,
  destaque,
  icon,
}: {
  href: string;
  titulo: string;
  descricao: string;
  destaque?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-start gap-3 rounded-2xl border px-5 py-4 transition-all ${
        destaque
          ? "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-500"
          : "border-stone-200 bg-white text-stone-800 hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700/60 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-stone-600 dark:hover:bg-stone-800"
      }`}
    >
      {icon && (
        <span className={`mt-0.5 shrink-0 ${destaque ? "text-emerald-100" : "text-stone-400 dark:text-stone-500"}`}>
          {icon}
        </span>
      )}
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-sm font-semibold">{titulo}</span>
        <span className={`text-xs ${destaque ? "text-emerald-100" : "text-stone-400 dark:text-stone-500"}`}>
          {descricao}
        </span>
      </div>
      <ArrowRight className={`mt-0.5 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 ${destaque ? "text-emerald-100" : "text-stone-400 dark:text-stone-500"}`} />
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
  const primeiroNome = sessao.nome_completo?.split(" ")[0];

  return (
    <main className="min-h-screen bg-stone-50/50 px-6 py-10 dark:bg-[#09090f]">
      <div className="mx-auto max-w-4xl">
        {/* Cabeçalho */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-stone-400 dark:text-stone-500">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
              Olá, {primeiroNome}
            </h1>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              Aqui está um resumo da sua operação no TrocaTroco.
            </p>
          </div>
          <Link
            href={ROTAS.ANUNCIAR}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/25 transition-colors hover:bg-emerald-500"
          >
            <Plus className="h-4 w-4" />
            Novo anúncio
          </Link>
        </div>

        {/* Alerta de pendências */}
        {temPendencias && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-900/40 dark:bg-amber-950/30">
            <Bell className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Você tem itens que precisam de atenção:
              </p>
              <ul className="mt-2 flex flex-wrap gap-3">
                {(solPendentes ?? 0) > 0 && (
                  <li>
                    <Link
                      href={ROTAS.SOLICITACOES}
                      className="text-xs font-medium text-amber-700 underline underline-offset-4 dark:text-amber-400"
                    >
                      {solPendentes} solicitação{solPendentes !== 1 ? "ões" : ""} pendente{solPendentes !== 1 ? "s" : ""}
                    </Link>
                  </li>
                )}
                {(negAndamento ?? 0) > 0 && (
                  <li>
                    {negAtiva ? (
                      <Link
                        href={ROTAS.NEGOCIACAO(negAtiva.id)}
                        className="text-xs font-medium text-amber-700 underline underline-offset-4 dark:text-amber-400"
                      >
                        {negAndamento} negociação{negAndamento !== 1 ? "ões" : ""} em andamento
                      </Link>
                    ) : (
                      <span className="text-xs text-amber-700">
                        {negAndamento} negociação{negAndamento !== 1 ? "ões" : ""} em andamento
                      </span>
                    )}
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Contadores */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Anúncios ativos"
            valor={anunciosAtivos ?? 0}
            icon={<Megaphone className="h-4 w-4" />}
          />
          <StatCard
            label="Total de anúncios"
            valor={totalAnuncios ?? 0}
            icon={<Building2 className="h-4 w-4" />}
          />
          <StatCard
            label="Solicitações pendentes"
            valor={solPendentes ?? 0}
            alerta
            icon={<Bell className="h-4 w-4" />}
          />
          <StatCard
            label="Negociações em andamento"
            valor={negAndamento ?? 0}
            icon={<MessageSquare className="h-4 w-4" />}
          />
        </div>

        {/* Ações principais */}
        <div className="mb-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
            Ações rápidas
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <LinkAcao
              href={ROTAS.ANUNCIAR}
              titulo="Publicar anúncio"
              descricao="Ofereça ou procure troco"
              destaque
              icon={<Megaphone className="h-4 w-4" />}
            />
            <LinkAcao
              href={ROTAS.MEUS_ANUNCIOS}
              titulo="Meus anúncios"
              descricao="Gerencie seus anúncios ativos"
              icon={<Building2 className="h-4 w-4" />}
            />
            <LinkAcao
              href={ROTAS.SOLICITACOES}
              titulo="Solicitações"
              descricao="Veja enviadas e recebidas"
              icon={<Bell className="h-4 w-4" />}
            />
            <LinkAcao
              href={ROTAS.NEGOCIACOES}
              titulo="Negociações"
              descricao="Ativas e concluídas com histórico do chat"
              icon={<MessageSquare className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Links secundários */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {negAtiva && (
            <LinkAcao
              href={ROTAS.NEGOCIACAO(negAtiva.id)}
              titulo="Continuar negociação"
              descricao="Acesse o chat da negociação ativa"
              icon={<MessageSquare className="h-4 w-4" />}
            />
          )}
          <LinkAcao
            href={ROTAS.ANUNCIOS}
            titulo="Explorar anúncios"
            descricao="Veja ofertas e necessidades de outras empresas"
            icon={<Building2 className="h-4 w-4" />}
          />
          <LinkAcao
            href={ROTAS.EMPRESAS}
            titulo="Explorar empresas"
            descricao="Descubra perfis públicos e reputação"
            icon={<Building2 className="h-4 w-4" />}
          />
          <LinkAcao
            href={ROTAS.EMPRESA_PERFIL(sessao.empresa_slug_publico ?? empresaId)}
            titulo="Meu perfil público"
            descricao="Como outras empresas te veem"
            icon={<Building2 className="h-4 w-4" />}
          />
          <LinkAcao
            href={ROTAS.TICKETS}
            titulo="Minhas denúncias"
            descricao="Acompanhe tickets e respostas da moderação"
            icon={<TicketCheck className="h-4 w-4" />}
          />
        </div>
      </div>
    </main>
  );
}
