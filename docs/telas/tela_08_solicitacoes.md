# Tela 7 — Solicitações

## 1. Nome da tela
Solicitações

## 2. Objetivo
Centralizar a visualização e o acompanhamento das solicitações da empresa, reunindo em uma única área o que foi enviado e o que foi recebido.

## 3. Acesso
Empresa logada e aprovada

## 4. Origem de navegação
A empresa pode chegar nesta tela por:
- Dashboard
- Detalhe do anúncio
- Meus anúncios
- navegação interna da área operacional

## 5. Tipo de tela
Tela consolidada de solicitações enviadas e recebidas.

## 6. Estrutura lógica da tela
A tela deve conter, em nível funcional:

- separação clara entre solicitações enviadas e recebidas
- listagem de solicitações por contexto
- status de cada solicitação
- acesso ao detalhe da solicitação
- ações disponíveis conforme o papel da empresa naquela solicitação

## 7. Regras gerais da tela
- a mesma tela reúne o que a empresa enviou e o que a empresa recebeu
- a empresa deve conseguir alternar entre esses dois contextos de forma clara
- a empresa autora do anúncio deve conseguir aceitar ou recusar solicitações recebidas
- a empresa solicitante deve conseguir acompanhar o resultado da própria solicitação
- o cancelamento da solicitação só pode ocorrer quando:
  - ela estiver pendente
  - e ainda estiver dentro da janela de 15 minutos

## 8. O que precisa existir nesta tela

### Conteúdo mínimo
- título da página
- separador, abas ou bloco lógico para:
  - enviadas
  - recebidas
- lista de solicitações
- identificação do anúncio relacionado
- identificação da outra empresa envolvida
- valor da solicitação
- status da solicitação
- data/hora do envio

### Conteúdo adicional por contexto
#### Solicitações enviadas
- indicação de aguardando análise, aceita, recusada, cancelada ou expirada
- ação de cancelar, quando permitida
- acesso à negociação, quando aceita

#### Solicitações recebidas
- dados necessários para análise da proposta
- ações de **Aceitar** e **Recusar**

## 9. Ações principais
- Alternar entre enviadas e recebidas
- Abrir detalhe da solicitação
- Cancelar solicitação pendente, quando permitido
- Aceitar solicitação recebida
- Recusar solicitação recebida
- Abrir negociação criada, quando aplicável

## 10. Validações visíveis
- a empresa só deve ver solicitações relacionadas a ela
- a ação de cancelar só aparece quando a regra permitir
- ações de aceitar/recusar só aparecem em solicitações recebidas pendentes
- solicitações recusadas, canceladas ou expiradas não devem exibir ações operacionais indevidas

## 11. Estados principais da tela

### Estado 1 — Sem solicitações enviadas
A empresa vê:
- vazio no bloco de enviadas
- mensagem correspondente

### Estado 2 — Sem solicitações recebidas
A empresa vê:
- vazio no bloco de recebidas
- mensagem correspondente

### Estado 3 — Solicitações enviadas com múltiplos status
A empresa vê:
- pendente
- aceita
- recusada
- cancelada
- expirada

### Estado 4 — Solicitações recebidas aguardando decisão
A empresa vê:
- dados da proposta
- ações de **Aceitar** e **Recusar**

### Estado 5 — Solicitação aceita
A empresa vê:
- indicação de aceite
- acesso à **Tela da negociação**

## 12. Estados de interface
- carregando solicitações
- vazio
- sem resultados por filtro
- erro ao carregar
- sucesso com conteúdo
- bloqueado para ação específica

## 13. Feedbacks visíveis
- mensagem de vazio adequada ao contexto de enviadas ou recebidas
- mensagem clara quando a solicitação foi cancelada com sucesso
- indicação visual do status de cada solicitação
- mensagem de erro ao aceitar, recusar ou cancelar quando a ação falhar

## 14. Saídas / navegação de saída

### Enviadas
- **Abrir solicitação** mantém no contexto da própria tela ou exibe detalhe lógico
- **Abrir negociação** leva para **Tela da negociação**

### Recebidas
- **Aceitar** leva para criação da negociação e depois para **Tela da negociação**
- **Recusar** atualiza o estado da solicitação na própria tela

## 15. Regras de negócio refletidas na tela
- solicitações enviadas e recebidas foram unificadas em uma única tela
- a mesma tela precisa atender dois papéis diferentes:
  - quem solicitou
  - quem recebeu a solicitação
- o aceite cria negociação
- a recusa encerra a solicitação sem abrir chat
- a solicitante acompanha claramente o novo estado do pedido

## 16. Observações
Este documento define a lógica funcional da tela.
Ele não fixa layout visual, estrutura estética, posicionamento final de blocos ou design de interface.
