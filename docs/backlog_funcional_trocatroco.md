# Backlog Funcional Refinado — TrocaTroco (v2)

## 1. Objetivo deste documento

Este backlog representa a próxima camada de detalhamento do produto, já incorporando o feedback de refinamento sobre:
- quebra de itens grandes
- critérios de aceite mais verificáveis
- separação mais clara entre entrega e regra de domínio
- hierarquia mais explícita entre épico, feature e user story

Este documento é adequado para:
- refinamento funcional
- preparação de sprints
- definição de escopo de telas
- preparação da modelagem de dados
- preparação do backlog técnico

---

## 2. Legenda de prioridade

- **P0**: indispensável para o MVP
- **P1**: importante para o MVP ficar completo
- **P2**: posterior / melhoria

---

## 3. Estrutura usada

Cada item está organizado em:

- **Épico**
- **Feature**
- **User Story**
- **Critérios de aceite**
- **Dependências / observações** quando necessário

---

# ÉPICO 1 — Cadastro e aprovação de empresas

## Feature 1.1 — Cadastro inicial de empresa

### US-001 — Preencher cadastro da empresa
**Prioridade:** P0  
**Como** empresa interessada  
**Quero** preencher meu cadastro inicial  
**Para** solicitar entrada na plataforma

**Critérios de aceite**
- o formulário deve permitir informar dados da empresa e do responsável principal
- os campos obrigatórios devem estar identificados visualmente
- o sistema não deve permitir envio com campos obrigatórios vazios
- o cadastro enviado deve ficar com status de análise pendente

**Dependências / observações**
- depende da definição dos campos cadastrais obrigatórios já prevista no PRD

---

### US-002 — Validar formato mínimo dos dados cadastrados
**Prioridade:** P0  
**Como** plataforma  
**Quero** validar informações mínimas do cadastro  
**Para** evitar registros inválidos

**Critérios de aceite**
- o sistema deve validar formato de CNPJ
- o sistema deve validar formato de email
- o sistema deve validar formato de telefone
- o sistema deve impedir envio quando houver erro de formato nos campos obrigatórios

---

### US-003 — Confirmar cadastro enviado
**Prioridade:** P0  
**Como** empresa  
**Quero** receber confirmação de que meu cadastro foi enviado  
**Para** saber que estou aguardando análise

**Critérios de aceite**
- após envio válido, o sistema deve exibir mensagem de cadastro enviado com sucesso
- a empresa deve visualizar que seu status está pendente de aprovação
- a empresa não deve conseguir operar plenamente antes da aprovação

---

## Feature 1.2 — Aprovação administrativa

### US-004 — Listar empresas pendentes de análise
**Prioridade:** P0  
**Como** administrador  
**Quero** visualizar empresas pendentes  
**Para** decidir aprovação ou reprovação

**Critérios de aceite**
- o painel administrativo deve listar empresas pendentes
- cada item deve exibir dados suficientes para análise administrativa
- o admin deve conseguir abrir os detalhes de cada cadastro

---

### US-005 — Aprovar cadastro de empresa
**Prioridade:** P0  
**Como** administrador  
**Quero** aprovar uma empresa  
**Para** liberar sua operação na plataforma

**Critérios de aceite**
- o admin deve conseguir marcar a empresa como aprovada
- a empresa aprovada deve passar a ter acesso operacional permitido
- o status da empresa deve ser atualizado no painel administrativo

---

### US-006 — Reprovar cadastro com motivo
**Prioridade:** P0  
**Como** administrador  
**Quero** reprovar uma empresa com indicação de inconsistência  
**Para** permitir correção e novo envio

**Critérios de aceite**
- o admin deve conseguir reprovar cadastro
- o sistema deve registrar o motivo ou o campo inconsistente
- a empresa deve visualizar o motivo da reprovação
- a empresa deve poder reenviar cadastro ajustado para nova análise

---

# ÉPICO 2 — Anúncios

## Feature 2.1 — Criar anúncio de oferta

### US-007 — Preencher dados básicos da oferta
**Prioridade:** P0  
**Como** empresa aprovada  
**Quero** informar os dados básicos da minha oferta  
**Para** publicar troco disponível

**Critérios de aceite**
- o formulário deve permitir informar valor total da oferta
- o formulário deve permitir informar local/região
- o formulário deve permitir informar disponibilidade
- o formulário deve permitir informar validade
- o sistema não deve permitir publicação sem esses dados obrigatórios

---

### US-008 — Informar composição da oferta
**Prioridade:** P0  
**Como** empresa aprovada  
**Quero** informar a composição do troco ofertado  
**Para** publicar a oferta corretamente

**Critérios de aceite**
- o formulário deve permitir informar a composição do troco
- a composição deve ser obrigatória
- o sistema não deve permitir publicar oferta sem composição
- a composição salva deve ficar visível no detalhe do anúncio

---

### US-009 — Definir regras da oferta
**Prioridade:** P0  
**Como** empresa aprovada  
**Quero** definir as regras da minha oferta  
**Para** controlar como ela poderá ser solicitada

**Critérios de aceite**
- o formulário deve permitir definir se a troca pode ocorrer na empresa ofertante
- o formulário deve permitir definir se a oferta aceita apenas valor integral ou também parcial
- o sistema deve salvar essas escolhas junto ao anúncio
- as regras definidas devem influenciar o comportamento da solicitação

---

### US-010 — Publicar anúncio de oferta
**Prioridade:** P0  
**Como** empresa aprovada  
**Quero** publicar minha oferta  
**Para** torná-la visível para outras empresas

**Critérios de aceite**
- o sistema deve permitir publicação apenas quando todos os campos obrigatórios estiverem válidos
- após publicação, a oferta deve aparecer na listagem de anúncios ativos
- o anúncio deve iniciar em status compatível com anúncio disponível

---

## Feature 2.2 — Criar anúncio de necessidade

### US-011 — Preencher dados básicos da necessidade
**Prioridade:** P0  
**Como** empresa aprovada  
**Quero** informar os dados básicos da minha necessidade  
**Para** publicar que preciso de troco

**Critérios de aceite**
- o formulário deve permitir informar valor desejado
- o formulário deve permitir informar local/região
- o formulário deve permitir informar disponibilidade
- o formulário deve permitir informar validade
- o sistema não deve permitir publicação sem esses dados obrigatórios

---

### US-012 — Informar composição da necessidade
**Prioridade:** P0  
**Como** empresa aprovada  
**Quero** informar a composição desejada  
**Para** publicar minha necessidade corretamente

**Critérios de aceite**
- a composição deve ser obrigatória
- o sistema deve permitir cadastrar a composição desejada
- o sistema não deve permitir publicar a necessidade sem composição

---

### US-013 — Publicar anúncio de necessidade
**Prioridade:** P0  
**Como** empresa aprovada  
**Quero** publicar minha necessidade  
**Para** torná-la visível para empresas com troco disponível

**Critérios de aceite**
- o sistema deve permitir publicação apenas com campos obrigatórios válidos
- o anúncio deve aparecer na listagem de anúncios ativos
- o anúncio deve iniciar em status compatível com anúncio disponível

---

## Feature 2.3 — Visualização de anúncios

### US-014 — Visualizar listagem de anúncios ativos
**Prioridade:** P0  
**Como** empresa interessada  
**Quero** visualizar anúncios ativos  
**Para** identificar oportunidades de negociação

**Critérios de aceite**
- a listagem deve exibir anúncios ativos
- cada item deve exibir tipo do anúncio
- cada item deve exibir valor
- cada item deve exibir local/região
- cada item deve exibir status atual do anúncio

---

### US-015 — Visualizar detalhe do anúncio
**Prioridade:** P1  
**Como** empresa interessada  
**Quero** abrir um anúncio  
**Para** analisar se vale a pena solicitar

**Critérios de aceite**
- a página de detalhe deve exibir tipo do anúncio
- deve exibir valor total ou valor desejado
- deve exibir composição
- deve exibir disponibilidade
- deve exibir validade
- deve exibir regras da oferta, quando aplicável

---

# ÉPICO 3 — Solicitações

## Feature 3.1 — Solicitar anúncio de oferta

### US-016 — Abrir solicitação de oferta
**Prioridade:** P0  
**Como** empresa interessada  
**Quero** iniciar uma solicitação em um anúncio de oferta  
**Para** pedir o troco disponível

**Critérios de aceite**
- o sistema deve permitir abrir solicitação em anúncio ativo
- o sistema deve impedir solicitação quando o anúncio não estiver disponível
- a tela de solicitação deve refletir as regras definidas pela ofertante

---

### US-017 — Solicitar valor integral da oferta
**Prioridade:** P0  
**Como** empresa interessada  
**Quero** solicitar o valor total quando a oferta exigir integralidade  
**Para** seguir a regra do anúncio

**Critérios de aceite**
- quando a oferta for somente integral, o sistema deve permitir apenas o valor total
- o sistema não deve permitir informar valor menor nesse caso
- a solicitação deve registrar que o pedido foi integral

---

### US-018 — Solicitar valor parcial da oferta
**Prioridade:** P0  
**Como** empresa interessada  
**Quero** solicitar parte da oferta quando o parcial for permitido  
**Para** pedir apenas o que preciso

**Critérios de aceite**
- o sistema deve permitir valor menor que o total quando a oferta aceitar parcial
- o sistema deve impedir valor maior que o saldo disponível
- o sistema deve exigir composição desejada no pedido parcial
- a solicitação deve registrar o valor parcial pedido

---

### US-019 — Informar meio de pagamento na solicitação
**Prioridade:** P0  
**Como** empresa interessada  
**Quero** informar meu meio de pagamento  
**Para** enviar a solicitação completa

**Critérios de aceite**
- a solicitação deve exigir seleção de meio de pagamento
- o sistema não deve permitir envio sem essa informação
- o meio de pagamento selecionado deve ficar visível para a autora do anúncio

---

### US-020 — Enviar solicitação de oferta
**Prioridade:** P0  
**Como** empresa interessada  
**Quero** concluir o envio da solicitação  
**Para** aguardar resposta da autora do anúncio

**Critérios de aceite**
- o sistema deve permitir envio apenas quando todos os campos obrigatórios estiverem preenchidos
- após envio, a solicitação deve ficar registrada como pendente
- a empresa solicitante deve visualizar que a solicitação foi criada com sucesso

---

### US-021 — Cancelar solicitação pendente dentro da janela permitida
**Prioridade:** P0  
**Como** empresa solicitante  
**Quero** cancelar uma solicitação pendente em até 15 minutos  
**Para** corrigir ou desistir do pedido

**Critérios de aceite**
- o sistema deve permitir cancelamento somente enquanto a solicitação estiver pendente
- o sistema deve permitir cancelamento apenas dentro de 15 minutos após o envio
- após esse prazo, o sistema não deve exibir ação de cancelamento

---

## Feature 3.2 — Solicitar atendimento a anúncio de necessidade

### US-022 — Enviar proposta para anúncio de necessidade
**Prioridade:** P0  
**Como** empresa com troco disponível  
**Quero** responder a uma necessidade publicada  
**Para** oferecer atendimento àquela demanda

**Critérios de aceite**
- o sistema deve permitir envio de proposta para anúncio de necessidade ativo
- a proposta deve registrar a intenção de atendimento
- a proposta deve registrar o local pretendido dentro da lógica dos dois locais possíveis
- a solicitação deve ficar pendente para decisão da autora da necessidade

---

## Feature 3.3 — Gestão de solicitações recebidas

### US-023 — Visualizar solicitações recebidas
**Prioridade:** P0  
**Como** autora do anúncio  
**Quero** visualizar as solicitações recebidas  
**Para** decidir qual aceitar ou recusar

**Critérios de aceite**
- o sistema deve listar solicitações vinculadas ao anúncio
- cada solicitação deve exibir empresa solicitante
- cada solicitação deve exibir valor pedido
- cada solicitação deve exibir meio de pagamento informado
- cada solicitação deve exibir status atual

---

### US-024 — Permitir múltiplas solicitações pendentes no mesmo anúncio
**Prioridade:** P0  
**Como** plataforma  
**Quero** aceitar múltiplas solicitações pendentes no mesmo anúncio  
**Para** permitir escolha da melhor proposta pela autora do anúncio

**Critérios de aceite**
- o sistema deve permitir mais de uma solicitação pendente para o mesmo anúncio
- as solicitações devem permanecer separadas entre si
- a existência de uma solicitação pendente não deve bloquear novas solicitações automaticamente

---

### US-025 — Expirar solicitação sem resposta
**Prioridade:** P1  
**Como** plataforma  
**Quero** expirar solicitações que passem do prazo de resposta  
**Para** evitar pendências indefinidas

**Critérios de aceite**
- o sistema deve considerar o prazo inicial de até 12 horas para resposta
- ao fim do prazo, a solicitação deve deixar de estar pendente
- a nova condição da solicitação deve ficar visível para as partes

---

# ÉPICO 4 — Decisão sobre a solicitação

## Feature 4.1 — Aceite

### US-026 — Aceitar solicitação recebida
**Prioridade:** P0  
**Como** autora do anúncio  
**Quero** aceitar uma solicitação  
**Para** iniciar a negociação formal

**Critérios de aceite**
- o sistema deve permitir aceitar uma solicitação pendente
- após o aceite, a solicitação não deve continuar como pendente
- após o aceite, uma negociação formal deve ser criada
- após o aceite, o chat oficial deve ser liberado

**Dependências / observações**
- a regra de reserva de saldo deve ocorrer como consequência do aceite, e não como item isolado de backlog

---

### US-027 — Refletir saldo após aceite
**Prioridade:** P0  
**Como** plataforma  
**Quero** atualizar o saldo disponível após o aceite  
**Para** refletir corretamente a disponibilidade do anúncio

**Critérios de aceite**
- o aceite de uma solicitação não pode ocorrer sem atualizar a disponibilidade do anúncio
- pedidos pendentes não devem alterar saldo
- quando a oferta aceitar parcial, o saldo remanescente deve continuar visível
- o anúncio deve permanecer ativo enquanto ainda houver saldo disponível

---

## Feature 4.2 — Recusa

### US-028 — Recusar solicitação recebida
**Prioridade:** P0  
**Como** autora do anúncio  
**Quero** recusar uma solicitação  
**Para** encerrar propostas que não me interessam

**Critérios de aceite**
- o sistema deve permitir recusar solicitação pendente
- a solicitação recusada não deve gerar chat
- a solicitação recusada não deve gerar negociação formal
- a recusa deve ficar visível para a empresa solicitante

---

# ÉPICO 5 — Negociação e chat oficial

## Feature 5.1 — Criação da negociação

### US-029 — Criar negociação após aceite
**Prioridade:** P0  
**Como** plataforma  
**Quero** criar uma negociação formal após o aceite  
**Para** registrar a operação em andamento

**Critérios de aceite**
- a negociação deve ser criada automaticamente após o aceite
- a negociação deve ficar vinculada ao anúncio e às empresas envolvidas
- a negociação deve ter contexto visível para as partes

---

## Feature 5.2 — Chat oficial

### US-030 — Abrir chat oficial da negociação
**Prioridade:** P0  
**Como** plataforma  
**Quero** disponibilizar um chat oficial  
**Para** concentrar a comunicação entre as partes

**Critérios de aceite**
- o chat só deve existir após aceite da solicitação
- o chat deve ficar vinculado à negociação correta
- somente as partes da negociação devem acessar o chat

---

### US-031 — Enviar mensagens no chat oficial
**Prioridade:** P0  
**Como** participante da negociação  
**Quero** enviar mensagens no chat  
**Para** conduzir a operação

**Critérios de aceite**
- a empresa participante deve conseguir enviar mensagem no chat
- a mensagem enviada deve aparecer no histórico da conversa
- a outra parte deve conseguir visualizar a mensagem enviada

---

### US-032 — Visualizar histórico completo do chat
**Prioridade:** P0  
**Como** participante da negociação  
**Quero** visualizar o histórico da conversa  
**Para** acompanhar tudo o que foi tratado

**Critérios de aceite**
- o chat deve exibir mensagens em ordem cronológica
- o histórico deve permanecer disponível durante a negociação
- o histórico deve ser preservado para análise de moderação quando necessário

---

# ÉPICO 6 — Conclusão da operação e avaliação

## Feature 6.1 — Encerramento da negociação

### US-033 — Marcar negociação como concluída
**Prioridade:** P0  
**Como** participante da negociação  
**Quero** marcar a operação como concluída  
**Para** iniciar a etapa de avaliação

**Critérios de aceite**
- o sistema deve permitir encerramento da negociação concluída
- após o encerramento, o fluxo de avaliação deve ser habilitado
- a negociação encerrada deve deixar de aparecer como operação em andamento

---

## Feature 6.2 — Avaliação entre empresas

### US-034 — Avaliar contraparte com nota
**Prioridade:** P0  
**Como** empresa participante  
**Quero** dar uma nota para a contraparte  
**Para** contribuir com a reputação pública dela

**Critérios de aceite**
- a avaliação só deve ser permitida após conclusão da negociação
- o sistema deve permitir registrar nota
- a nota deve ficar vinculada à empresa avaliada e à negociação correspondente

---

### US-035 — Avaliar contraparte com comentário
**Prioridade:** P0  
**Como** empresa participante  
**Quero** deixar um comentário sobre a operação  
**Para** registrar minha experiência

**Critérios de aceite**
- a avaliação só deve ser permitida após conclusão da negociação
- o sistema deve permitir registrar comentário
- o comentário deve ficar pendente de moderação antes da publicação pública

---

### US-036 — Responder comentário recebido
**Prioridade:** P1  
**Como** empresa avaliada  
**Quero** responder um comentário público  
**Para** apresentar meu posicionamento

**Critérios de aceite**
- a empresa avaliada deve poder responder comentário aprovado
- a resposta deve ficar visível junto à avaliação correspondente

---

# ÉPICO 7 — Moderação e denúncia

## Feature 7.1 — Denúncia

### US-037 — Denunciar empresa a partir do perfil
**Prioridade:** P1  
**Como** usuário da plataforma  
**Quero** denunciar uma empresa a partir do perfil público  
**Para** registrar comportamento inadequado

**Critérios de aceite**
- o perfil da empresa deve exibir ação de denunciar
- o sistema deve permitir informar motivo da denúncia
- a denúncia deve gerar registro administrativo

---

### US-038 — Denunciar negociação em andamento
**Prioridade:** P0  
**Como** participante da negociação  
**Quero** denunciar ou chamar moderador dentro da negociação  
**Para** pedir intervenção em caso de problema

**Critérios de aceite**
- o ambiente da negociação deve exibir ação de denunciar/chamar moderador
- a denúncia deve poder ser aberta a partir da negociação em andamento
- o caso aberto deve ficar vinculado à negociação correspondente

---

## Feature 7.2 — Ticket e mediação

### US-039 — Abrir ticket de moderação
**Prioridade:** P0  
**Como** plataforma  
**Quero** transformar a denúncia em ticket  
**Para** permitir acompanhamento administrativo do caso

**Critérios de aceite**
- toda denúncia válida deve gerar ticket
- o ticket deve ficar vinculado ao contexto do caso
- o ticket deve permanecer disponível até encerramento

---

### US-040 — Permitir entrada do moderador no chat
**Prioridade:** P0  
**Como** moderador  
**Quero** entrar no mesmo chat da negociação  
**Para** analisar e conduzir o caso

**Critérios de aceite**
- o moderador deve conseguir acessar o chat da negociação denunciada
- o moderador deve visualizar o histórico anterior da conversa
- o moderador deve conseguir interagir com ambas as partes no mesmo ambiente

---

### US-041 — Registrar decisão da moderação
**Prioridade:** P0  
**Como** moderador  
**Quero** registrar a decisão final do caso  
**Para** encerrar formalmente a tratativa

**Critérios de aceite**
- o moderador deve conseguir registrar decisão ou solução
- o ticket deve poder ser marcado como encerrado
- a decisão registrada deve ficar vinculada ao caso correspondente

---

# ÉPICO 8 — Perfil público e reputação

## Feature 8.1 — Perfil público da empresa

### US-042 — Exibir página pública da empresa
**Prioridade:** P0  
**Como** usuário da plataforma  
**Quero** acessar a página pública de uma empresa  
**Para** avaliar sua confiabilidade

**Critérios de aceite**
- a página deve exibir nome da empresa
- a página deve exibir foto da empresa
- a página deve exibir detalhes públicos permitidos
- a página deve exibir anúncios ativos da empresa

---

### US-043 — Exibir reputação pública da empresa
**Prioridade:** P0  
**Como** usuário da plataforma  
**Quero** visualizar a reputação da empresa  
**Para** tomar decisão mais informada

**Critérios de aceite**
- o perfil deve exibir média simples das avaliações
- o perfil deve exibir volume total de avaliações
- o perfil deve exibir comentários aprovados

---

### US-044 — Filtrar avaliações por tipo
**Prioridade:** P1  
**Como** usuário da plataforma  
**Quero** filtrar avaliações positivas, neutras e negativas  
**Para** analisar melhor a reputação

**Critérios de aceite**
- o perfil deve permitir filtrar avaliações por categoria
- ao aplicar o filtro, a lista exibida deve refletir apenas o grupo selecionado

---

## Feature 8.2 — Moderação de comentários públicos

### US-045 — Aprovar comentário antes da publicação
**Prioridade:** P0  
**Como** administrador/moderação  
**Quero** aprovar comentários antes da publicação  
**Para** impedir conteúdo indevido na reputação pública

**Critérios de aceite**
- comentário novo não deve ser publicado automaticamente
- o admin/moderação deve conseguir aprovar comentário pendente
- somente comentário aprovado deve aparecer no perfil público

---

# ÉPICO 9 — Administração mínima do MVP

## Feature 9.1 — Painel administrativo

### US-046 — Listar empresas no painel administrativo
**Prioridade:** P0  
**Como** admin  
**Quero** visualizar empresas e seus status  
**Para** operar a aprovação inicial do MVP

**Critérios de aceite**
- o painel deve listar empresas cadastradas
- o painel deve exibir status de cada empresa
- o admin deve conseguir abrir detalhes da empresa

---

### US-047 — Listar tickets de denúncia
**Prioridade:** P0  
**Como** admin  
**Quero** visualizar tickets de denúncia  
**Para** acompanhar e tratar os casos abertos

**Critérios de aceite**
- o painel deve listar tickets existentes
- o painel deve permitir abrir detalhes do ticket
- o painel deve indicar situação atual do ticket

---

### US-048 — Listar avaliações pendentes de moderação
**Prioridade:** P0  
**Como** admin  
**Quero** visualizar comentários pendentes  
**Para** aprovar ou reprovar sua publicação

**Critérios de aceite**
- o painel deve listar comentários pendentes
- o admin deve conseguir aprovar comentário
- o admin deve conseguir barrar comentário

---

# 4. Observações de modelagem para próxima etapa

Este backlog já está melhor preparado para refinamento de sprint, mas a próxima camada ideal ainda inclui:
- dependências técnicas por história
- definição de estados e transições
- detalhamento dos campos por formulário
- matriz de permissões
- backlog técnico derivado
