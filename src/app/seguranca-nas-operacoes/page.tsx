import { PaginaInstitucional } from "@/modules/app/PaginaInstitucional";

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white px-6 py-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">{titulo}</h2>
      <div className="mt-3 text-sm leading-6 text-stone-600">{children}</div>
    </section>
  );
}

export default function PaginaSegurancaNasOperacoes() {
  return (
    <PaginaInstitucional
      titulo="Segurança nas Operações"
      descricao="Boas práticas para negociações presenciais e confirmações operacionais entre empresas conectadas pelo TrocaTroco."
    >
      <Secao titulo="1. Antes de sair para a operação">
        Confirme no chat a composição do valor, o meio de pagamento combinado, o endereço, o horário e o nome do responsável que fará o atendimento no local.
      </Secao>
      <Secao titulo="2. Durante a negociação presencial">
        Prefira locais comerciais, horários de funcionamento e ambientes com circulação de pessoas. Evite encontros em locais isolados ou fora do contexto operacional da empresa.
      </Secao>
      <Secao titulo="3. Pagamentos e conferência">
        Não antecipe valores sem validação adequada. Confira o numerário e o comprovante do meio de pagamento combinado antes de concluir a operação.
      </Secao>
      <Secao titulo="4. Registro e suporte">
        Sempre que possível, mantenha os combinados no chat da plataforma. Se houver comportamento suspeito, divergência material ou quebra relevante do combinado, abra um ticket de denúncia.
      </Secao>
    </PaginaInstitucional>
  );
}