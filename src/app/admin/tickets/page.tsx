import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessao } from "@/lib/sessao";
import { isAdmin } from "@/constants/papeis";
import { ROTAS } from "@/constants/rotas";
import { listarTickets } from "@/modules/admin/actions";
import { BotaoAssumirTicket, FormEncerrarTicket } from "@/modules/admin/AcoesAdmin";
import { FormMensagemTicket } from "@/modules/tickets/FormMensagemTicket";

const STATUS_LABEL: Record<string, string> = {
  aberto: "Aberto",
  em_analise: "Em análise",
  encerrado: "Encerrado",
};

const STATUS_COR: Record<string, string> = {
  aberto: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/50 dark:border-amber-900/60 dark:text-amber-300",
  em_analise: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-900/60 dark:text-blue-300",
  encerrado: "bg-stone-100 border-stone-200 text-stone-500 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400",
};

const ORIGEM_LABEL: Record<string, string> = {
  perfil_empresa: "Perfil da empresa",
  administrativo: "Administrativo",
  outro_contexto: "Outro",
};

export default async function PaginaTickets() {
  const sessao = await getSessao();
  if (!sessao || !isAdmin(sessao.papel)) redirect(ROTAS.DASHBOARD);

  const { tickets, error } = await listarTickets();

  const abertos = tickets.filter((t) => t.status === "aberto");
  const em_analise = tickets.filter((t) => t.status === "em_analise");
  const encerrados = tickets.filter((t) => t.status === "encerrado");

  const grupos = [
    { label: "Abertos", items: abertos },
    { label: "Em análise", items: em_analise },
    { label: "Encerrados", items: encerrados },
  ];

  return (
    <main className="min-h-screen bg-stone-50/50 px-6 py-10 dark:bg-[#09090f]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">Tickets / denúncias</h1>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} no total
            </p>
          </div>
          <Link
            href={ROTAS.ADMIN}
            className="text-sm text-stone-500 underline-offset-4 hover:underline dark:text-stone-400"
          >
            ← Painel admin
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {tickets.length === 0 && (
          <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-400 dark:border-stone-700/60 dark:bg-stone-900 dark:text-stone-500">
            Nenhum ticket registrado.
          </div>
        )}

        {grupos.map(
          ({ label, items }) =>
            items.length > 0 && (
              <section key={label} className="mb-8">
                <h2 className="mb-3 text-sm font-semibold text-stone-700 dark:text-stone-300">{label}</h2>
                <ul className="flex flex-col gap-4">
                  {items.map((ticket) => (
                    <li
                      key={ticket.id}
                      className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-700/60 dark:bg-stone-900"
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                            STATUS_COR[ticket.status] ?? ""
                          }`}
                        >
                          {STATUS_LABEL[ticket.status] ?? ticket.status}
                        </span>
                        <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-xs text-stone-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400">
                          {ORIGEM_LABEL[ticket.tipo_origem] ?? ticket.tipo_origem}
                        </span>
                        <span className="ml-auto text-xs text-stone-400 dark:text-stone-500">
                          {new Date(ticket.aberto_em).toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      {ticket.empresa_origem && (
                        <p className="mb-1 text-xs text-stone-400 dark:text-stone-500">
                          Empresa:{" "}
                          <span className="font-medium text-stone-600 dark:text-stone-300">
                            {ticket.empresa_origem.razao_social}
                          </span>
                        </p>
                      )}

                      {ticket.assunto && (
                        <p className="mb-1 text-sm font-medium text-stone-800 dark:text-stone-100">
                          {ticket.assunto}
                        </p>
                      )}

                      {ticket.descricao && (
                        <p className="mb-3 text-sm text-stone-600 line-clamp-3 dark:text-stone-400">
                          {ticket.descricao}
                        </p>
                      )}

                      {ticket.resumo_resolucao && (
                        <div className="mb-3 rounded-xl border border-stone-100 bg-stone-50 px-4 py-2.5 dark:border-stone-800 dark:bg-stone-800/60">
                          <p className="text-xs font-medium text-stone-500 dark:text-stone-400">Resolução</p>
                          <p className="mt-0.5 text-sm text-stone-700 dark:text-stone-300">
                            {ticket.resumo_resolucao}
                          </p>
                        </div>
                      )}

                      {ticket.eventos.length > 0 && (
                        <div className="mb-4 rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-800/50">
                          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                            Histórico do caso
                          </p>
                          <div className="flex flex-col gap-3">
                            {ticket.eventos.map((evento) => (
                              <div key={evento.id} className="border-l-2 border-stone-200 pl-3 dark:border-stone-700">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                                  <span className="font-medium text-stone-700 dark:text-stone-200">
                                    {evento.ator?.nome_completo ?? "Sistema"}
                                  </span>
                                  <span>
                                    {evento.ator?.papel === "usuario_admin"
                                      ? "Admin"
                                      : evento.ator?.papel === "usuario_moderador" || evento.ator?.papel === "moderador"
                                        ? "Moderador"
                                        : "Usuário"}
                                  </span>
                                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-stone-500 dark:bg-stone-900 dark:text-stone-400">
                                    {evento.tipo_evento.replaceAll("_", " ")}
                                  </span>
                                  <span className="ml-auto">
                                    {new Date(evento.criado_em).toLocaleString("pt-BR")}
                                  </span>
                                </div>
                                {evento.corpo_evento && (
                                  <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">{evento.corpo_evento}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ações */}
                      {ticket.status !== "encerrado" && (
                        <div className="flex flex-wrap items-start gap-3 border-t border-stone-100 pt-4 dark:border-stone-800">
                          {ticket.status === "aberto" && (
                            <BotaoAssumirTicket ticketId={ticket.id} />
                          )}
                          <div className="min-w-[240px] flex-1">
                            <FormMensagemTicket
                              ticketId={ticket.id}
                              placeholder="Solicitar mais informações, registrar andamento ou resposta da moderação..."
                              botaoLabel="Enviar mensagem"
                            />
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <FormEncerrarTicket ticketId={ticket.id} />
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ),
        )}
      </div>
    </main>
  );
}
