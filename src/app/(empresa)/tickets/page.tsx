import Link from "next/link";
import { listarTicketsDaEmpresa } from "@/modules/admin/actions";
import { ROTAS } from "@/constants/rotas";
import { FormMensagemTicket } from "@/modules/tickets/FormMensagemTicket";

const STATUS_LABEL: Record<string, string> = {
  aberto: "Aberto",
  em_analise: "Em análise",
  encerrado: "Encerrado",
};

const STATUS_COR: Record<string, string> = {
  aberto: "bg-amber-50 border-amber-200 text-amber-800",
  em_analise: "bg-blue-50 border-blue-200 text-blue-800",
  encerrado: "bg-stone-100 border-stone-200 text-stone-600",
};

const ORIGEM_LABEL: Record<string, string> = {
  perfil_empresa: "Perfil da empresa",
  administrativo: "Administrativo",
  outro_contexto: "Outro contexto",
};

function labelAtor(papel?: string) {
  if (papel === "usuario_admin") return "Admin";
  if (papel === "usuario_moderador" || papel === "moderador") return "Moderador";
  if (papel === "usuario_admin_moderador") return "Admin / Moderador";
  return "Usuário";
}

export default async function PaginaTicketsEmpresa() {
  const { tickets, error } = await listarTicketsDaEmpresa();

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">Minhas denúncias</h1>
            <p className="mt-1 text-sm text-stone-500">
              Acompanhe status, andamento e mensagens da moderação.
            </p>
          </div>
          <Link
            href={ROTAS.DASHBOARD}
            className="text-sm text-stone-500 underline-offset-4 hover:underline"
          >
            ← Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!error && tickets.length === 0 && (
          <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center">
            <p className="text-sm text-stone-500">Você ainda não abriu nenhuma denúncia.</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {tickets.map((ticket) => (
            <section key={ticket.id} className="rounded-3xl border border-stone-200 bg-white p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COR[ticket.status] ?? ""}`}
                >
                  {STATUS_LABEL[ticket.status] ?? ticket.status}
                </span>
                <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-xs text-stone-600">
                  {ORIGEM_LABEL[ticket.tipo_origem] ?? ticket.tipo_origem}
                </span>
                <span className="ml-auto text-xs text-stone-400">
                  Aberto em {new Date(ticket.aberto_em).toLocaleString("pt-BR")}
                </span>
              </div>

              {ticket.assunto && (
                <h2 className="text-base font-semibold text-stone-900">{ticket.assunto}</h2>
              )}

              {ticket.descricao && (
                <p className="mt-2 text-sm text-stone-600">{ticket.descricao}</p>
              )}

              {ticket.resumo_resolucao && (
                <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Resolução registrada
                  </p>
                  <p className="mt-1 text-sm text-emerald-900">{ticket.resumo_resolucao}</p>
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Histórico da denúncia
                </p>

                {ticket.eventos.length === 0 ? (
                  <p className="text-sm text-stone-500">Ainda não há atualizações neste ticket.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {ticket.eventos.map((evento) => (
                      <div key={evento.id} className="border-l-2 border-stone-200 pl-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                          <span className="font-medium text-stone-800">
                            {evento.ator?.nome_completo ?? "Sistema"}
                          </span>
                          <span>{labelAtor(evento.ator?.papel)}</span>
                          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-stone-500">
                            {evento.tipo_evento.replaceAll("_", " ")}
                          </span>
                          <span className="ml-auto">
                            {new Date(evento.criado_em).toLocaleString("pt-BR")}
                          </span>
                        </div>
                        {evento.corpo_evento && (
                          <p className="mt-1 text-sm text-stone-700">{evento.corpo_evento}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {ticket.status !== "encerrado" && ticket.empresa_pode_responder && (
                <div className="mt-4 rounded-2xl border border-stone-200 bg-white px-4 py-4">
                  <p className="mb-2 text-sm font-medium text-stone-800">
                    Responder à moderação
                  </p>
                  <p className="mb-3 text-xs text-stone-500">
                    Quando a equipe pedir mais informações, envie a complementação por aqui.
                  </p>
                  <FormMensagemTicket
                    ticketId={ticket.id}
                    placeholder="Escreva a informação complementar da denúncia..."
                    botaoLabel="Enviar resposta"
                    sucessoLabel="Resposta enviada para a moderação."
                  />
                </div>
              )}

              {ticket.status !== "encerrado" && !ticket.empresa_pode_responder && (
                <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
                  <p className="text-sm font-medium text-stone-700">
                    Aguardando nova solicitação da moderação
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    Sua resposta fica liberada quando admin ou moderação pedirem informações complementares neste ticket.
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}