# Tela 3 — Dashboard

## 1. Nome da tela
Dashboard

## 2. Objetivo
Servir como entrada principal da operação da empresa aprovada dentro da plataforma, reunindo atalhos, contexto operacional e visão rápida do que exige atenção.

## 3. Acesso
Empresa logada e aprovada

## 4. Origem de navegação
A empresa pode chegar nesta tela por:
- login com cadastro aprovado
- tela de status cadastral aprovada
- navegação interna da área operacional

## 5. Tipo de tela
Tela principal de operação e navegação.

## 6. Estrutura lógica da tela
A tela deve conter, em nível funcional:

- saudação/contexto da empresa
- visão resumida da operação atual
- atalhos para as áreas principais
- blocos de atenção rápida
- caminho para iniciar ações prioritárias

## 7. Regras gerais da tela
- o dashboard só deve estar disponível para empresa aprovada
- ele deve funcionar como ponto de entrada para as ações principais do marketplace
- a tela não substitui as áreas específicas; ela apenas resume e direciona

## 8. O que precisa existir nesta tela

### Conteúdo mínimo
- identificação da empresa logada
- bloco de resumo operacional
- atalho para **/anunciar**
- atalho para **Meus anúncios**
- atalho para **Solicitações**
- atalho para **Tela da negociação**, quando houver negociação ativa
- atalho para **Perfil da empresa**

### Blocos recomendados
- anúncios da empresa
- solicitações com pendência
- negociações em andamento
- ações rápidas

## 9. Ações principais
- Anunciar
- Ver meus anúncios
- Ver solicitações
- Ver negociações
- Ver perfil da empresa

## 10. Validações visíveis
- só deve haver acesso ao dashboard quando a empresa estiver aprovada
- atalhos para áreas vazias ainda podem existir, mas devem levar para estados vazios coerentes
- ações operacionais devem respeitar o estado da empresa e do conteúdo exibido

## 11. Estados principais da tela

### Estado 1 — Dashboard com operação ativa
A empresa vê:
- resumo de anúncios
- resumo de solicitações
- resumo de negociações
- atalhos operacionais

### Estado 2 — Dashboard sem operação iniciada
A empresa vê:
- tela funcional, mas sem conteúdo operacional ainda
- mensagem de início de uso
- CTA principal para **/anunciar**

### Estado 3 — Dashboard com itens que exigem atenção
A empresa vê:
- solicitações pendentes de decisão
- negociações em andamento
- indicadores de atenção nos blocos correspondentes

## 12. Estados de interface
- carregando dashboard
- vazio operacional
- sucesso com conteúdo
- erro ao carregar dados
- sem permissão, se usuário tentar acessar sem aprovação

## 13. Feedbacks visíveis
- mensagens curtas orientando a próxima ação
- indicadores visuais de itens pendentes
- mensagem de erro quando o dashboard não puder ser carregado
- mensagem de vazio com CTA claro para começar a operar

## 14. Saídas / navegação de saída
A partir do dashboard, a empresa pode seguir para:
- **/anunciar**
- **Meus anúncios**
- **Solicitações**
- **Tela da negociação**
- **Perfil da empresa**

## 15. Regras de negócio refletidas na tela
- a empresa aprovada passa a operar normalmente no marketplace
- o dashboard é o centro de navegação operacional
- o dashboard deve refletir o estado atual da operação da empresa sem substituir as telas específicas

## 16. Observações
Este documento define a lógica funcional da tela.
Ele não fixa layout visual, estrutura estética, posicionamento final de blocos ou design de interface.
