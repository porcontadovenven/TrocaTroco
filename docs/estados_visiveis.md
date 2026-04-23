# Fase 3 — Etapa C: Estados Visíveis

## Objetivo da etapa

Definir o que cada usuário enxerga em cada momento importante do sistema, quais ações ficam disponíveis e o que permanece bloqueado em cada estado do produto.

---

## 1. Estados visíveis do cadastro da empresa

### 1.1 Cadastro em preenchimento
**O que a empresa vê**
- etapas do cadastro
- progresso do preenchimento
- botões de avançar e voltar
- etapa final de revisão

**O que pode fazer**
- preencher dados
- revisar dados
- enviar cadastro

---

### 1.2 Cadastro em análise
**O que a empresa vê**
- status: **Cadastro em análise**
- mensagem de que o cadastro foi enviado com sucesso
- acesso à área logada básica
- bloqueio operacional do marketplace

**O que pode fazer**
- navegar na área básica
- acompanhar o status cadastral

**O que não pode fazer**
- publicar anúncio
- solicitar anúncio
- negociar
- usar chat operacional

---

### 1.3 Cadastro aprovado
**O que a empresa vê**
- status: **Aprovada**
- mensagem/tela de confirmação de aprovação
- liberação operacional completa
- notificação de aprovação

**O que pode fazer**
- operar normalmente no marketplace

---

### 1.4 Cadastro reprovado
**O que a empresa vê**
- status: **Reprovada**
- mensagem/tela de reprovação
- indicação do que precisa ser corrigido
- acesso à área básica
- operação bloqueada

**O que pode fazer**
- ajustar dados
- reenviar para nova análise

---

### 1.5 Reenvio em análise
**Sugestão de comportamento**
- pode reutilizar visualmente o estado de **Cadastro em análise**
- o sistema mantém histórico interno de reprovações e reenvios

---

## 2. Estados visíveis do anúncio

### 2.1 Ativo
**O que o usuário vê**
- selo/status: **Ativo**
- anúncio disponível para nova solicitação
- saldo remanescente visível, quando aplicável
- dados principais do anúncio

**O que pode acontecer**
- pode receber novas solicitações
- pode ter negociações em andamento e continuar ativo, se houver saldo restante

---

### 2.2 Em negociação
**O que o usuário vê**
- selo/status: **Em negociação**
- indicação de que todo o saldo da oferta já foi aceito
- anúncio deixa de se comportar como disponível para novas solicitações

**O que pode acontecer**
- segue aguardando desfecho da negociação ativa

---

### 2.3 Concluído
**O que o usuário vê**
- selo/status: **Concluído**
- indicação de operação encerrada
- anúncio não recebe mais interação operacional

**Sugestão visual**
- deixar claro que o anúncio virou histórico/encerrado

---

### 2.4 Cancelado
**O que o usuário vê**
- selo/status: **Cancelado**
- anúncio encerrado manualmente ou por regra administrativa

---

### 2.5 Expirado
**O que o usuário vê**
- selo/status: **Expirado**
- indicação de validade encerrada
- anúncio não recebe mais interação

**Sugestão geral**
Na listagem, o mais importante é diferenciar visualmente:
- ativo
- em negociação
- concluído / cancelado / expirado

---

## 3. Estados visíveis da solicitação

### 3.1 Pendente
**O que a solicitante vê**
- status: **Pendente**
- mensagem de que está aguardando análise
- ação de cancelar, se ainda estiver dentro de 15 minutos

**O que a autora do anúncio vê**
- solicitação recebida aguardando decisão
- ações de **Aceitar** e **Recusar**

---

### 3.2 Aceita
**O que a solicitante vê**
- status: **Aceita**
- acesso à negociação criada
- acesso ao chat oficial

**O que a autora do anúncio vê**
- solicitação aceita
- negociação iniciada

---

### 3.3 Recusada
**O que a solicitante vê**
- status: **Recusada**
- indicação de que aquela tentativa foi encerrada
- sem chat
- sem negociação

**O que a autora do anúncio vê**
- solicitação recusada
- sem ação operacional adicional sobre aquele pedido

---

### 3.4 Cancelada
**O que a solicitante vê**
- status: **Cancelada**
- indicação de cancelamento realizado por ela mesma
- solicitação encerrada

**O que a autora do anúncio vê**
- solicitação cancelada pela outra parte
- nenhuma ação possível sobre aquele pedido

---

### 3.5 Expirada
**O que as partes veem**
- status: **Expirada**
- indicação de que o prazo se encerrou sem decisão

---

## 4. Estados visíveis da negociação

### 4.1 Negociação em andamento
**O que as empresas veem**
- contexto completo da negociação
- chat ativo
- dados da operação
- ação de denunciar/chamar moderador
- ação futura de concluir negociação

---

### 4.2 Negociação com moderação acionada
**Sugestão visual**
- banner ou aviso como:
  - **Moderação acionada**
  - ou **Em análise da moderação**

**O que as partes veem**
- caso em acompanhamento
- presença do moderador no chat, quando aplicável

---

### 4.3 Negociação concluída
**O que as empresas veem**
- operação encerrada
- chat preservado como histórico
- ação de avaliar contraparte habilitada

---

### 4.4 Negociação encerrada com histórico
**Sugestão de comportamento**
- a negociação pode continuar acessível para consulta histórica
- não permite continuar a operação

---

## 5. Estados visíveis da avaliação

### 5.1 Disponível para avaliar
**O que a empresa vê**
- ação: **Avaliar contraparte**
- contexto da negociação concluída

---

### 5.2 Avaliação enviada
**O que a empresa vê**
- confirmação de que a avaliação foi enviada
- nota registrada
- comentário aguardando moderação, quando houver texto

---

### 5.3 Comentário em moderação
**O que a empresa vê**
- indicação de que o comentário ainda não está público
- estado de aguardando análise/moderação

---

### 5.4 Avaliação publicada
**O que a empresa vê**
- avaliação visível no perfil público da contraparte
- nota pública
- comentário público aprovado

---

### 5.5 Resposta da empresa avaliada
**O que a empresa avaliada vê**
- ação para responder comentário já publicado

**O que o público vê**
- comentário + resposta vinculada

---

## 6. Estados visíveis da reputação no perfil público

### 6.1 Reputação sem avaliações
**Sugestão**
Mostrar algo como:
- **Sem avaliações ainda**
- ou **Ainda não possui avaliações públicas**

---

### 6.2 Reputação com avaliações
**O que o usuário vê**
- média simples
- volume total de avaliações
- comentários aprovados

---

### 6.3 Filtro por tipo
**O que o usuário vê**
- filtro:
  - positivas
  - neutras
  - negativas

---

### 6.4 Comentários moderados
**Regra visual**
- somente comentários aprovados aparecem publicamente

---

## 7. Estados visíveis do ticket / denúncia

### 7.1 Ticket aberto
**O que a parte vê**
- denúncia registrada
- caso aberto

---

### 7.2 Ticket em análise
**O que a parte vê**
- moderação acompanhando o caso
- eventual entrada do moderador no chat

---

### 7.3 Ticket encerrado
**O que a parte vê**
- caso finalizado
- decisão/solução registrada

---

## 8. Estados visíveis do perfil público da empresa

### 8.1 Perfil público básico
**O que aparece**
- foto
- nome
- reputação
- detalhes públicos
- verificações visíveis
- comentários / avaliações aprovadas
- anúncios ativos
- botão de denunciar

---

### 8.2 Perfil com anúncios ativos
**O que aparece**
- bloco/lista de anúncios ativos da empresa
- os anúncios ficam abaixo dos comentários/avaliações

---

### 8.3 Perfil com comentários públicos
**O que aparece**
- avaliações aprovadas
- resposta da empresa, quando existir

---

### 8.4 Perfil com denúncia disponível
**O que aparece**
- botão de denunciar para empresa logada/aprovada

---

## 9. Estados visíveis para admin/moderação

### 9.1 Empresas
**Estados visíveis**
- pendente
- aprovada
- reprovada

---

### 9.2 Comentários de avaliação
**Estados visíveis**
- pendente de moderação
- aprovado
- barrado

---

### 9.3 Tickets
**Estados visíveis**
- aberto
- em análise
- encerrado

---

### 9.4 Negociações / chats
**Estados visíveis**
- em andamento
- finalizadas
- com moderação acionada

---

## 10. Organização sugerida da Etapa C

### Bloco 1 — Essenciais primeiro
- estados visíveis do cadastro
- estados visíveis do anúncio
- estados visíveis da solicitação
- estados visíveis da negociação

### Bloco 2 — Confiança e reputação
- estados visíveis da avaliação
- estados visíveis da reputação
- estados visíveis do perfil público

### Bloco 3 — Operação interna
- estados visíveis do ticket/moderação
- estados visíveis do admin

---

## 11. Próximo uso deste material

Este documento serve como base para:
- detalhamento das telas
- definição de mensagens e badges de status
- preparação da Fase 4
- apoio à modelagem de estados e transições
