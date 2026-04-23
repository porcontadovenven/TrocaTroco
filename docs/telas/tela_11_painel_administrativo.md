# Tela 10 — Painel administrativo

## 1. Nome da tela
Painel administrativo

## 2. Objetivo
Servir como entrada principal da operação administrativa da plataforma, concentrando o acesso às áreas de supervisão, aprovação, moderação e tratamento de casos.

## 3. Acesso
Admin / moderação

## 4. Origem de navegação
O usuário pode chegar nesta tela por:
- login com perfil administrativo
- navegação interna da área administrativa

## 5. Tipo de tela
Tela principal de navegação e supervisão administrativa.

## 6. Estrutura lógica da tela
A tela deve conter, em nível funcional:

- visão geral da operação administrativa
- blocos de acesso às áreas internas
- indicadores resumidos do que exige atenção
- navegação clara para os módulos administrativos

## 7. Regras gerais da tela
- o painel administrativo é exclusivo de admin / moderação
- usuários comuns não devem acessar essa área nem seus atalhos
- o painel funciona como centro de supervisão, não como substituto dos módulos específicos
- os principais blocos administrativos devem estar organizados por função

## 8. O que precisa existir nesta tela

### Conteúdo mínimo
- título da área administrativa
- blocos ou atalhos para:
  - Análise cadastral admin
  - Denúncias / tickets admin
  - Moderação de avaliações
- acesso complementar para:
  - empresas cadastradas
  - anúncios
  - solicitações
  - negociações
  - chats / históricos

### Conteúdo de supervisão resumida
- empresas pendentes de análise
- tickets abertos ou em andamento
- comentários aguardando moderação
- negociações/casos que exijam atenção

## 9. Ações principais
- Abrir análise cadastral admin
- Abrir denúncias / tickets admin
- Abrir moderação de avaliações
- Acessar visão de empresas
- Acessar visão de negociações/chats/históricos

## 10. Validações visíveis
- o painel só deve ser acessível ao perfil admin/moderação
- as áreas administrativas devem respeitar o papel de supervisão e operação interna
- usuários sem perfil adequado devem receber bloqueio de acesso

## 11. Estados principais da tela

### Estado 1 — Painel com itens exigindo atenção
O usuário vê:
- indicadores de pendência
- atalhos para casos prioritários
- blocos administrativos ativos

### Estado 2 — Painel sem pendências críticas
O usuário vê:
- blocos de navegação administrativa
- contexto operacional estável
- acesso aos módulos internos mesmo sem alerta prioritário

## 12. Estados de interface
- carregando painel administrativo
- erro ao carregar painel
- sem permissão
- sucesso com dados administrativos
- sem pendências relevantes, quando aplicável

## 13. Feedbacks visíveis
- mensagens claras quando houver itens pendentes
- indicação visual de prioridade por bloco, quando necessário
- erro visível ao falhar o carregamento
- bloqueio explícito para acesso indevido

## 14. Saídas / navegação de saída
A partir do painel administrativo, o usuário pode seguir para:
- **Análise cadastral admin**
- **Denúncias / tickets admin**
- **Moderação de avaliações**
- áreas complementares de supervisão, quando existirem no fluxo administrativo

## 15. Regras de negócio refletidas na tela
- o admin/moderação opera a plataforma de forma separada da empresa comum
- o painel administrativo organiza as funções internas por módulo
- o painel é o ponto de entrada para aprovação, moderação e tratamento de casos

## 16. Observações
Este documento define a lógica funcional da tela.
Ele não fixa layout visual, estrutura estética, posicionamento final de blocos ou design de interface.
