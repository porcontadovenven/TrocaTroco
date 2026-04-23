# AGENTE.md

## Contexto do projeto
TrocaTroco é uma plataforma B2B para intermediação de troco entre empresas.
O produto permite cadastro de empresa, aprovação administrativa, publicação de anúncios, envio e recebimento de solicitações, negociação com chat oficial, avaliação entre empresas e moderação administrativa.

---





---

## Stack base
- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Realtime
- Supabase Storage
- Vercel

Não propor troca de stack sem solicitação explícita.

---

## Padrão técnico obrigatório
- Usar PT-BR técnico para domínio do negócio
- Usar `snake_case` no banco de dados
- Manter nomenclatura consistente com os documentos do projeto
- Evitar mistura desnecessária de inglês e português nas estruturas de domínio

Exemplos esperados:
- `empresas`
- `solicitacoes`
- `status_moderacao`
- `local_troca`
- `valor_remanescente`

---

## Regra de execução
Implementar sempre por blocos funcionais, nunca por impulso.

Sequência obrigatória:
`regra → banco → tipo/interface → serviço → tela → validação`

Sempre fechar um bloco antes de abrir o próximo.

---

## Prioridade de implementação
Priorizar nesta ordem:
1. regra de negócio
2. persistência e integridade
3. autenticação e permissão
4. serviços e ações
5. telas e componentes
6. refinamento visual

Visual nunca vem antes de regra funcionando.

---

## Restrições do agente
O agente não deve:
- inventar regra nova
- alterar comportamento sem base documental
- refatorar áreas fora do escopo pedido
- criar abstrações prematuras
- mudar nomes de domínio sem necessidade
- misturar fluxo de empresa com fluxo admin
- abrir várias frentes ao mesmo tempo

---

## Regras críticas do produto
- Empresa só opera se estiver aprovada
- Solicitação pendente não reserva saldo
- Aceite cria negociação
- Chat só existe após aceite
- Moderação da negociação acontece no próprio chat
- Ticket é usado para contextos externos à negociação
- Avaliação é obrigatória
- Nota é obrigatória
- Comentário é opcional
- Comentário só fica público após moderação
- Anúncio só conclui com operação encerrada, sem remanescente e com ambas as avaliações obrigatórias enviadas
- Necessidade também suporta atendimento parcial
- Cada empresa possui apenas 1 usuário principal ativo no MVP

---

## Escopo de alteração
Quando receber uma tarefa:
- alterar apenas o necessário
- preservar estrutura existente
- explicar dependências e impactos quando relevante
- manter compatibilidade com o que já foi definido nas fases anteriores

---

## Qualidade esperada
Toda entrega deve ser:
- coerente com os documentos do projeto
- implementável
- legível
- pequena o suficiente para revisão
- validável ao final do bloco

---

## Regra final
Se houver dúvida entre “inventar” e “seguir o documento”, seguir o documento.
