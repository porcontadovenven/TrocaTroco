import { PaginaInstitucional } from "@/modules/app/PaginaInstitucional";

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white px-6 py-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">{titulo}</h2>
      <div className="mt-3 text-sm leading-6 text-stone-600">{children}</div>
    </section>
  );
}

export default function PaginaPoliticaDeModeracao() {
  return (
    <PaginaInstitucional
      titulo="Política de Moderação e Denúncias"
      descricao="Esta política descreve como o TrocaTroco trata denúncias, revisões de avaliações e ocorrências relevantes reportadas pelas empresas usuárias."
    >
      <Secao titulo="1. Quando denunciar">
        Use o canal de denúncia para fraudes, perfis suspeitos, comportamento abusivo, descumprimento grave do combinado, anúncios enganosos ou tentativas de manipulação da reputação.
      </Secao>
      <Secao titulo="2. Como a moderação atua">
        A moderação analisa o contexto disponível, incluindo dados da denúncia, histórico do chat, registros operacionais e reincidência. O prazo e a profundidade da análise variam conforme a complexidade do caso.
      </Secao>
      <Secao titulo="3. Medidas possíveis">
        O TrocaTroco pode solicitar esclarecimentos, restringir recursos, remover conteúdo, ocultar avaliações, suspender perfis ou encerrar contas, conforme a gravidade e a consistência dos fatos apurados.
      </Secao>
      <Secao titulo="4. Boa-fé e evidências">
        Denúncias devem ser enviadas com boa-fé e base factual. Relatos abusivos ou manifestamente falsos também podem ser objeto de ação administrativa pela plataforma.
      </Secao>
    </PaginaInstitucional>
  );
}