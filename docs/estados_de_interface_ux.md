# Fase 3 — Bloco: Estados de Interface (UX)

## Objetivo

Definir os estados de interface que independem da regra de negócio principal, mas que precisam existir para a experiência ficar completa, previsível e implementável no frontend.

Este documento cobre estados como:
- vazio
- carregando
- erro
- sucesso
- bloqueado
- sem permissão
- sem resultados

Esses estados complementam os **estados visíveis de negócio** já definidos anteriormente.

---

## 1. Princípios gerais

### 1.1 Estado vazio
Deve existir quando a tela não possui conteúdo para exibir ainda.

Exemplos:
- empresa sem anúncios
- empresa sem solicitações
- perfil sem avaliações
- negociação sem mensagens ainda

### 1.2 Estado de carregamento
Deve existir quando a tela ou bloco ainda está buscando dados.

Exemplos:
- carregando listagem de anúncios
- carregando perfil público
- carregando histórico do chat
- carregando solicitações recebidas

### 1.3 Estado de erro
Deve existir quando a ação ou busca falhar.

Exemplos:
- erro ao enviar cadastro
- erro ao publicar anúncio
- erro ao enviar solicitação
- erro ao carregar negociação
- erro ao enviar avaliação

### 1.4 Estado de sucesso
Deve existir após ações relevantes concluídas corretamente.

Exemplos:
- cadastro enviado
- anúncio publicado
- solicitação enviada
- solicitação aceita
- negociação concluída
- avaliação enviada

### 1.5 Estado bloqueado
Deve existir quando o usuário consegue acessar a área, mas não pode executar a ação.

Exemplos:
- empresa logada, mas não aprovada
- solicitação fora da janela de cancelamento
- anúncio sem saldo disponível
- avaliação indisponível antes da conclusão

### 1.6 Estado sem permissão
Deve existir quando o usuário tenta acessar uma área que não pertence ao seu perfil.

Exemplos:
- visitante tentando acessar área privada
- empresa tentando acessar painel admin
- empresa tentando abrir negociação da qual não participa

### 1.7 Estado sem resultados
Deve existir quando a busca/listagem funciona, mas não retornou conteúdo.

Exemplos:
- busca de anúncios sem retorno
- filtro de avaliações sem resultado
- listagem de tickets sem itens naquele filtro

---

## 2. Estados de interface por área

## 2.1 Home

### Carregando
- carregamento inicial da página
- carregamento de blocos principais

### Erro
- falha ao carregar blocos públicos da home

### Sucesso
- home exibida corretamente

---

## 2.2 Login

### Erro
- credenciais inválidas
- conta não encontrada
- falha temporária de autenticação

### Sucesso
- login realizado com sucesso
- redirecionamento para a área correspondente ao perfil

### Sem permissão
- tentativa de acessar área restrita sem autenticação prévia

---

## 2.3 Cadastro de empresa

### Em preenchimento
- etapas do cadastro em andamento

### Erro
- campo obrigatório ausente
- campo com formato inválido
- falha ao enviar cadastro

### Sucesso
- cadastro enviado com sucesso

### Bloqueado
- empresa ainda em análise
- empresa reprovada sem corrigir pendências
- empresa sem aprovação operacional

---

## 2.4 Status cadastral / aprovação

### Estado principal
- cadastro em análise
- cadastro aprovado
- cadastro reprovado

### Carregando
- carregamento do status cadastral

### Erro
- falha ao buscar status da empresa

### Bloqueado
- operação do marketplace bloqueada enquanto empresa não estiver aprovada

---

## 2.5 Listagem pública de anúncios

### Carregando
- carregando anúncios públicos

### Sem resultados
- não há anúncios disponíveis
- busca aplicada não retornou itens

### Erro
- falha ao carregar listagem

### Sucesso
- anúncios exibidos normalmente

---

## 2.6 Detalhe parcial do anúncio

### Carregando
- carregando dados resumidos do anúncio

### Erro
- anúncio não encontrado
- anúncio indisponível
- falha ao carregar detalhe

### Bloqueado
- ação de interação bloqueada para visitante

### Sucesso
- detalhe parcial exibido corretamente

---

## 2.7 Perfil público da empresa

### Carregando
- carregando perfil público
- carregando reputação
- carregando anúncios ativos

### Sem avaliações
- empresa ainda sem avaliações públicas

### Sem anúncios ativos
- empresa sem anúncios ativos no momento

### Erro
- perfil não encontrado
- falha ao carregar reputação
- falha ao carregar anúncios da empresa

### Sucesso
- perfil público exibido corretamente

---

## 2.8 Dashboard

### Carregando
- carregamento dos dados principais da empresa

### Vazio
- empresa aprovada sem operação iniciada ainda

### Erro
- falha ao carregar informações do dashboard

### Sucesso
- atalhos e contexto da empresa carregados

### Bloqueado
- empresa logada, mas não aprovada, vendo dashboard básico sem operação liberada

---

## 2.9 /anunciar

### Carregando
- carregando opções de anúncio

### Erro
- falha ao abrir fluxo de criação

### Bloqueado
- empresa não aprovada tentando criar anúncio

### Sucesso
- escolha entre oferta e necessidade disponível

---

## 2.10 Criar anúncio de oferta / necessidade

### Em preenchimento
- formulário em etapas sendo preenchido

### Erro
- campo obrigatório ausente
- composição não preenchida
- falha ao salvar ou publicar

### Sucesso
- anúncio publicado com sucesso

### Bloqueado
- usuário sem permissão operacional
- etapa seguinte indisponível enquanto a atual estiver inválida

---

## 2.11 Meus anúncios

### Carregando
- carregando anúncios da empresa

### Vazio
- empresa ainda não publicou anúncios

### Sem resultados
- filtro aplicado sem retorno

### Erro
- falha ao carregar lista

### Sucesso
- anúncios exibidos com status correspondentes

---

## 2.12 Detalhe completo do anúncio

### Carregando
- carregando dados completos do anúncio

### Erro
- anúncio não encontrado
- anúncio indisponível
- falha ao carregar detalhe

### Bloqueado
- empresa não aprovada tentando acessar detalhe completo com intenção operacional
- anúncio sem disponibilidade para nova ação

### Sucesso
- detalhe completo exibido
- ação de solicitação disponível quando aplicável

---

## 2.13 Enviar solicitação

### Em preenchimento
- solicitação sendo montada

### Erro
- valor inválido
- composição inválida ou ausente quando exigida
- meio de pagamento não informado
- falha ao enviar solicitação

### Sucesso
- solicitação enviada com sucesso

### Bloqueado
- empresa não aprovada
- anúncio indisponível
- anúncio sem saldo
- regra do anúncio não permite o tipo de solicitação informada

---

## 2.14 Solicitações enviadas

### Carregando
- carregando solicitações da empresa

### Vazio
- empresa ainda não enviou solicitações

### Sem resultados
- filtro aplicado sem retorno

### Erro
- falha ao carregar solicitações enviadas

### Sucesso
- lista exibida com status:
  - pendente
  - aceita
  - recusada
  - cancelada
  - expirada

### Bloqueado
- cancelamento indisponível fora da janela de 15 minutos

---

## 2.15 Solicitações recebidas

### Carregando
- carregando solicitações recebidas

### Vazio
- empresa ainda não recebeu solicitações

### Sem resultados
- filtro aplicado sem retorno

### Erro
- falha ao carregar solicitações recebidas

### Sucesso
- solicitações exibidas com ações disponíveis

---

## 2.16 Negociações

### Carregando
- carregando negociações da empresa

### Vazio
- empresa ainda não possui negociações

### Sem resultados
- filtro aplicado sem retorno

### Erro
- falha ao carregar negociações

### Sucesso
- negociações exibidas com seus estados visíveis

---

## 2.17 Tela da negociação

### Carregando
- carregando contexto da negociação
- carregando dados das partes
- carregando histórico do chat

### Erro
- negociação não encontrada
- usuário sem acesso àquela negociação
- falha ao carregar dados da negociação

### Sucesso
- negociação exibida corretamente com dados da operação

### Bloqueado
- ação de concluir indisponível em situação não permitida
- ação de avaliar indisponível antes da conclusão
- acesso bloqueado para empresa que não participa da negociação

---

## 2.18 Chat oficial da negociação

### Carregando
- carregando mensagens

### Vazio
- chat aberto, mas sem mensagens ainda

### Erro
- falha ao carregar histórico
- falha ao enviar mensagem

### Sucesso
- mensagens exibidas corretamente

### Bloqueado
- chat indisponível antes do aceite
- usuário sem acesso à negociação

---

## 2.19 Avaliar contraparte

### Carregando
- carregando contexto da avaliação

### Erro
- falha ao enviar avaliação
- tentativa inválida de avaliar antes da conclusão

### Sucesso
- avaliação enviada com sucesso

### Bloqueado
- avaliação indisponível antes da conclusão da negociação
- avaliação já enviada, quando a regra impedir duplicidade

---

## 2.20 Meu perfil na plataforma

### Carregando
- carregando dados do perfil

### Erro
- falha ao carregar informações da empresa

### Sucesso
- perfil exibido com dados próprios e contexto operacional

---

## 2.21 Painel administrativo

### Carregando
- carregando áreas administrativas

### Erro
- falha ao carregar painel

### Sem permissão
- usuário comum tentando acessar área administrativa

### Sucesso
- painel exibido com blocos de operação interna

---

## 2.22 Empresas cadastradas / análise cadastral

### Carregando
- carregando empresas
- carregando detalhes cadastrais

### Vazio
- nenhuma empresa no filtro atual

### Erro
- falha ao carregar empresas
- falha ao abrir cadastro

### Sucesso
- análise disponível
- ações de aprovar / reprovar disponíveis

---

## 2.23 Denúncias e tickets

### Carregando
- carregando tickets

### Vazio
- nenhum ticket no filtro atual

### Erro
- falha ao carregar tickets
- falha ao abrir ticket

### Sucesso
- tickets exibidos com status:
  - aberto
  - em análise
  - encerrado

---

## 2.24 Moderação de avaliações

### Carregando
- carregando comentários pendentes

### Vazio
- nenhum comentário aguardando moderação

### Erro
- falha ao carregar avaliações pendentes
- falha ao aprovar / barrar comentário

### Sucesso
- comentário moderado com sucesso

---

## 2.25 Todos os anúncios / solicitações / negociações / chats

### Carregando
- carregando conteúdo administrativo

### Vazio
- sem itens no filtro atual

### Erro
- falha ao carregar dados
- falha ao abrir detalhe

### Sucesso
- conteúdo exibido com acesso integral para auditoria e supervisão

---

## 3. Componentes transversais de interface

## 3.1 Mensagens de feedback
Sugestão de comportamento:
- sucesso com mensagem clara e curta
- erro com explicação objetiva
- bloqueio com motivo explícito
- estado vazio com CTA de próximo passo quando fizer sentido

## 3.2 Badges e selos
Sugestão de uso:
- status de anúncio
- status de solicitação
- status de negociação
- status cadastral
- status do ticket

## 3.3 Confirmações
Sugestão de uso em ações críticas:
- publicar anúncio
- cancelar solicitação
- aceitar solicitação
- recusar solicitação
- concluir negociação
- denunciar
- reprovar empresa
- barrar comentário

---

## 4. Organização sugerida para uso deste documento

### Bloco 1 — Estados públicos
- Home
- anúncios públicos
- detalhe parcial
- perfil público

### Bloco 2 — Estados da empresa
- cadastro
- dashboard
- anúncios
- solicitações
- negociações
- avaliação

### Bloco 3 — Estados administrativos
- empresas
- tickets
- moderação de avaliações
- supervisão geral

---

## 5. Próximo uso deste material

Este documento serve como base para:
- especificação leve por tela
- definição de feedbacks do frontend
- mensagens de sistema
- wireframes
- testes de interface
