import { PaginaInstitucional } from "@/modules/app/PaginaInstitucional";

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white px-6 py-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">{titulo}</h2>
      <div className="mt-3 text-sm leading-6 text-stone-600">{children}</div>
    </section>
  );
}

export default function PaginaAvisoDeResponsabilidade() {
  return (
    <PaginaInstitucional
      titulo="Aviso de Responsabilidade"
      descricao="Este aviso resume os limites de atuação do TrocaTroco na relação entre empresas usuárias da plataforma."
    >
      <Secao titulo="1. Papel do TrocaTroco">
        O TrocaTroco atua como plataforma de conexão entre empresas interessadas em negociar troco. A infraestrutura facilita anúncios, contato, registro de histórico, avaliações e moderação.
      </Secao>
      <Secao titulo="2. O que a plataforma não faz">
        A plataforma não processa pagamentos, não faz custódia de dinheiro, não garante autenticidade de comprovantes fora dos seus registros e não assume a posição de contratante ou interveniente nas operações.
      </Secao>
      <Secao titulo="3. Responsabilidade das partes">
        Cada empresa é integralmente responsável por verificar a contraparte, validar o numerário, conferir o pagamento, cumprir legislação aplicável e decidir se deseja ou não concluir a operação.
      </Secao>
    </PaginaInstitucional>
  );
}