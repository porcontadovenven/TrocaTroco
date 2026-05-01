import { PaginaInstitucional } from "@/modules/app/PaginaInstitucional";

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white px-6 py-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">{titulo}</h2>
      <div className="mt-3 text-sm leading-6 text-stone-600">{children}</div>
    </section>
  );
}

export default function PaginaRegrasDaPlataforma() {
  return (
    <PaginaInstitucional
      titulo="Regras da Plataforma"
      descricao="Estas regras definem o padrão esperado para anúncios, negociações, avaliações e uso dos canais de denúncia no TrocaTroco."
    >
      <Secao titulo="1. Anúncios">
        Os anúncios devem refletir situação real, composição correta do valor e condições operacionais verdadeiras. Informações incompletas, enganosas ou desatualizadas podem ser removidas.
      </Secao>
      <Secao titulo="2. Negociações">
        As tratativas devem ocorrer com respeito, objetividade e rastreabilidade. Use o chat da plataforma para registrar combinados importantes, evitando divergências posteriores.
      </Secao>
      <Secao titulo="3. Avaliações">
        As avaliações devem representar a experiência real da operação. Não é permitido usar o sistema de reputação para retaliar, coagir ou manipular outros participantes.
      </Secao>
      <Secao titulo="4. Denúncias">
        O canal de denúncias deve ser usado para fatos concretos, com boa-fé. Relatos abusivos, falsos ou repetitivos podem gerar limitação de acesso ou medidas administrativas.
      </Secao>
    </PaginaInstitucional>
  );
}