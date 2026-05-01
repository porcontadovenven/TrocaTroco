import { PaginaInstitucional } from "@/modules/app/PaginaInstitucional";

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white px-6 py-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">{titulo}</h2>
      <div className="mt-3 text-sm leading-6 text-stone-600">{children}</div>
    </section>
  );
}

export default function PaginaTermosDeUso() {
  return (
    <PaginaInstitucional
      titulo="Termos de Uso"
      descricao="Estes termos definem as regras básicas de acesso e uso do TrocaTroco por empresas e usuários vinculados a contas corporativas."
    >
      <Secao titulo="1. Objeto da plataforma">
        O TrocaTroco conecta empresas interessadas em negociar troco entre si. A plataforma não processa pagamentos, não recebe valores em custódia e não atua como parte da operação comercial entre as empresas.
      </Secao>
      <Secao titulo="2. Elegibilidade">
        O uso é restrito a empresas e MEIs com CNPJ ativo, mediante cadastro e análise cadastral. O acesso à área operacional pode ser negado, suspenso ou revogado em caso de inconsistências cadastrais ou uso indevido.
      </Secao>
      <Secao titulo="3. Responsabilidades do usuário">
        Cada empresa é responsável pela veracidade das informações cadastradas, pela legitimidade dos anúncios publicados, pela conduta de seus representantes e pelo cumprimento das combinações feitas nas negociações.
      </Secao>
      <Secao titulo="4. Condutas proibidas">
        Não é permitido publicar informações falsas, utilizar a plataforma para práticas ilícitas, simular operações, manipular reputação, assediar outros usuários ou tentar contornar regras de moderação e segurança.
      </Secao>
      <Secao titulo="5. Limitação de responsabilidade">
        O TrocaTroco disponibiliza a infraestrutura de conexão entre empresas. A decisão de negociar, a forma de pagamento, a entrega dos valores e a execução da operação são de responsabilidade exclusiva das partes envolvidas.
      </Secao>
    </PaginaInstitucional>
  );
}