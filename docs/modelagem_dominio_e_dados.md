# Fase 4 — Modelagem de domínio e dados (final)

## 1. Objetivo da fase
A Fase 4 define como o sistema organiza, representa, persiste e relaciona os dados do TrocaTroco em nível lógico.

Ela transforma o que já foi decidido nas fases anteriores em uma estrutura de domínio consistente, preparada para:
- modelagem relacional
- regras de persistência
- estados e transições
- implementação backend/frontend
- critérios de consistência do produto

---

## 2. Escopo da fase
Esta fase cobre:
- entidades principais do domínio
- relacionamentos entre entidades
- estados e transições
- regras de consistência e cálculo
- modelo relacional base do MVP

Esta fase não cobre:
- layout visual
- design de interface
- arquitetura final de código
- endpoints detalhados de API
- implementação

---

## 3. Padrão de nomenclatura adotado
Toda a modelagem técnica desta fase deve seguir **PT-BR técnico**, inclusive para:
- tabelas
- colunas
- enums
- status
- tipos/interfaces
- constantes

### Regra prática
- nomes de negócio em português
- identificadores técnicos em `snake_case`
- sem mistura com inglês na nomenclatura estrutural

Exemplos:
- `empresas`
- `status_cadastral`
- `solicitacoes`
- `status_moderacao`
- `local_troca`

---

## 4. Princípios estruturais do domínio

### 4.1 Plataforma B2B
O sistema é voltado para empresas com CNPJ ativo, incluindo MEI.

### 4.2 Plataforma não financeira
A plataforma:
- não recebe dinheiro
- não processa pagamento
- não faz custódia
- não garante liquidação financeira

### 4.3 Uma empresa por conta operacional no MVP
No MVP:
- 1 empresa = 1 conta principal = 1 responsável principal

### 4.4 Regra estrutural de usuário principal
No MVP, cada empresa pode possuir apenas **1 usuário principal ativo**.

Essa regra deve ser garantida:
- pela aplicação
- e reforçada no banco de dados, quando o schema físico for implementado

### 4.5 Operação estruturada
Toda operação nasce de:
1. cadastro da empresa
2. análise administrativa
3. aprovação
4. publicação de anúncio
5. solicitação
6. aceite
7. negociação
8. encerramento operacional
9. avaliações obrigatórias
10. atualização final de reputação e encerramento completo do ciclo

### 4.6 Chat só após aceite
A comunicação oficial só existe após o aceite da solicitação.

### 4.7 Moderação em negociação acontece no próprio chat
Na negociação:
- existe a ação **chamar moderador**
- o admin/moderador entra no mesmo chat
- a mediação acontece dentro da própria negociação
- não há ticket de moderação para o fluxo interno da negociação

### 4.8 Tickets ficam para contextos externos à negociação
Tickets permanecem para:
- denúncia de perfil da empresa
- denúncia administrativa
- outros contextos externos ao fluxo da negociação

### 4.9 Reputação pública separa nota e comentário
A avaliação é obrigatória após o encerramento operacional da negociação.

Regras:
- a **nota é obrigatória**
- o **comentário é opcional**
- a **nota entra na reputação assim que a avaliação é enviada**
- o **comentário só entra na camada pública após moderação**

### 4.10 Dois locais possíveis para a troca
A troca só pode acontecer em:
- `empresa_autora`
- `empresa_solicitante`

Não existe local neutro no MVP.

### 4.11 Reserva de saldo apenas no aceite
Solicitação pendente não reserva saldo.
A reserva ou consumo operacional do valor acontece apenas no aceite.

### 4.12 Necessidade também suporta parcial
O anúncio de necessidade também pode receber atendimento parcial.

Consequências:
- necessidade pode ter remanescente
- segue ativa enquanto houver valor remanescente
- seu encerramento final depende do ciclo completo do anúncio

### 4.13 Conclusão final do anúncio
O anúncio só pode ser marcado como **concluído** quando:
- não houver valor remanescente
- não houver negociação pendente em aberto
- a operação estiver encerrada
- e as duas avaliações obrigatórias da negociação final já tiverem sido enviadas

---

## 5. Contextos principais do domínio

## 5.1 Identidade e aprovação
Responsável por:
- empresa
- usuário principal
- submissão cadastral
- aprovação ou reprovação
- verificações cadastrais

## 5.2 Marketplace de anúncios
Responsável por:
- anúncios de oferta
- anúncios de necessidade
- composição
- disponibilidade
- remanescente
- status do anúncio

## 5.3 Solicitações e negociação
Responsável por:
- solicitação
- aceite ou recusa
- criação da negociação
- chat oficial
- moderação no próprio chat
- encerramento operacional
- avaliações obrigatórias

## 5.4 Moderação externa e resolução de conflito
Responsável por:
- denúncia externa à negociação
- ticket
- acompanhamento
- decisão ou solução administrativa

## 5.5 Reputação pública
Responsável por:
- avaliação
- moderação de comentário
- resposta da empresa avaliada
- reputação pública
- perfil público da empresa

## 5.6 Auditoria e timeline
Responsável por:
- rastreabilidade
- eventos relevantes do ciclo de vida
- histórico de ações

---

## 6. Entidades centrais do domínio
As entidades centrais do MVP são:

1. Empresa  
2. Usuario  
3. Submissao cadastral  
4. Verificacao cadastral  
5. Anuncio  
6. Item de composicao do anuncio  
7. Solicitacao  
8. Item de composicao da solicitacao  
9. Negociacao  
10. Mensagem da negociacao  
11. Ticket de moderacao  
12. Evento do ticket  
13. Avaliacao  
14. Evento de timeline  

---

## 7. Visão geral do ciclo de vida operacional

## 7.1 Empresa
- criada
- enviada para análise
- aprovada ou reprovada
- pode reenviar para nova análise

## 7.2 Anúncio
- publicado
- ativo
- pode receber solicitações
- pode ficar em negociação
- pode concluir, cancelar ou expirar

## 7.3 Solicitação
- pendente
- aceita ou recusada
- pode ser cancelada pela solicitante dentro da janela permitida
- pode expirar sem resposta

## 7.4 Negociação
- nasce do aceite
- concentra acordo, chat e moderação em contexto interno
- pode ser encerrada operacionalmente
- passa a exigir avaliação obrigatória das duas partes
- pode ser finalizada após ambas as avaliações

## 7.5 Avaliação
- obrigatória
- nota obrigatória
- comentário opcional
- comentário entra em moderação apenas se existir
- nota impacta reputação imediatamente após envio

---

## 8. Decisões de modelagem importantes

## 8.1 Anúncio é entidade única com tipo
Não haverá entidade separada para oferta e necessidade.
Haverá uma única entidade **anuncio**, com campo de tipo:
- `oferta`
- `necessidade`

## 8.2 Solicitação é entidade única
Não haverá entidade separada para “pedido de oferta” e “resposta à necessidade”.
Haverá uma única entidade **solicitacao**, com comportamento condicionado pelo tipo do anúncio.

## 8.3 Destinatária da solicitação é derivada
A solicitação **não precisa armazenar** a empresa destinatária.

A lógica é:
- a solicitação guarda `anuncio_id`
- o anúncio já guarda a empresa autora
- portanto a destinatária pode ser derivada a partir do anúncio

## 8.4 Negociação concentra chat e avaliação
A negociação é a entidade operacional central após o aceite.
Chat e avaliação pertencem ao contexto da negociação.

## 8.5 Moderação da negociação usa status próprio
A negociação deve possuir um campo como `status_moderacao`, por exemplo:
- `nao_acionada`
- `acionada`
- `em_acompanhamento`
- `encerrada`

Isso substitui a ideia de usar apenas um booleano simples.

## 8.6 Ticket não é entidade da negociação
Ticket não faz parte do fluxo interno padrão da negociação.
Na negociação, a mediação acontece no próprio chat.

## 8.7 Perfil público não precisa ser entidade primária
O perfil público pode ser tratado como projeção derivada de:
- empresa
- avaliações públicas
- anúncios ativos
- verificações públicas

## 8.8 Timeline é transversal
A timeline registra eventos relevantes de múltiplas entidades e é tratada como estrutura transversal.

---

## 9. Resultado esperado da fase
Ao final da Fase 4, o projeto deve ter:
- modelo de domínio consistente
- entidades e relacionamentos definidos
- estados e transições claros
- regras de consistência explicitadas
- base suficiente para modelagem do banco do MVP

---

## 10. Próximos documentos desta fase
Esta fase foi organizada nos seguintes documentos complementares:
- entidades e relacionamentos
- estados e transições
- regras de consistência e cálculos
- modelo relacional base

---

## 11. Observação final
A Fase 4 consolida a lógica estrutural do sistema.
Ela não fecha ainda a implementação, mas reduz drasticamente a margem de interpretação livre na etapa técnica.
