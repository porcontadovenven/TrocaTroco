import { PaginaInstitucional } from "@/modules/app/PaginaInstitucional";

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white px-6 py-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">{titulo}</h2>
      <div className="mt-3 text-sm leading-6 text-stone-600">{children}</div>
    </section>
  );
}

export default function PaginaPoliticaPrivacidade() {
  return (
    <PaginaInstitucional
      titulo="Política de Privacidade"
      descricao="Esta política resume como os dados cadastrais e operacionais são utilizados no TrocaTroco para autenticação, operação da plataforma e atendimento de obrigações legais."
    >
      <Secao titulo="1. Dados tratados">
        Podemos tratar dados da empresa, dados do responsável vinculado à conta, informações de autenticação, dados de uso da plataforma, anúncios, solicitações, negociações, avaliações e tickets de moderação.
      </Secao>
      <Secao titulo="2. Finalidades do tratamento">
        Os dados são utilizados para criar contas, analisar cadastros, permitir o funcionamento dos fluxos operacionais, manter histórico das interações, aplicar moderação, prevenir fraude e cumprir exigências legais e regulatórias.
      </Secao>
      <Secao titulo="3. Compartilhamento">
        Dados públicos e operacionais podem ser exibidos a outras empresas conforme a finalidade da plataforma. Dados também podem ser compartilhados com provedores de infraestrutura e autenticação estritamente para viabilizar o serviço.
      </Secao>
      <Secao titulo="4. Retenção e segurança">
        Mantemos os dados pelo tempo necessário para operar a plataforma, atender obrigações legais e registrar histórico operacional. Empregamos controles de autenticação, segregação de acesso e políticas de banco com RLS.
      </Secao>
      <Secao titulo="5. Direitos dos titulares">
        Usuários podem solicitar atualização de dados cadastrais, revisar informações da conta e requerer orientações sobre tratamento de dados pelos canais oficiais da plataforma, observadas as bases legais aplicáveis.
      </Secao>
    </PaginaInstitucional>
  );
}