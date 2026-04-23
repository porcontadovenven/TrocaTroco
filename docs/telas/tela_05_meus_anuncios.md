# Tela 5 — Meus anúncios

## 1. Nome da tela
Meus anúncios

## 2. Objetivo
Permitir que a empresa visualize, acompanhe e gerencie os anúncios que ela própria publicou na plataforma.

## 3. Acesso
Empresa logada e aprovada

## 4. Origem de navegação
A empresa pode chegar nesta tela por:
- Dashboard
- retorno após publicação de anúncio
- navegação interna da área operacional

## 5. Tipo de tela
Tela de listagem e gestão dos anúncios da própria empresa.

## 6. Estrutura lógica da tela
A tela deve conter, em nível funcional:

- identificação da área
- visão organizada dos anúncios da empresa
- status de cada anúncio
- atalhos para criação de novo anúncio
- ação para abrir o detalhe de cada anúncio
- filtros e organização básica, quando necessário

## 7. Regras gerais da tela
- a tela lista apenas anúncios da própria empresa
- a empresa pode ter anúncios de oferta e necessidade na mesma tela
- cada anúncio deve exibir seu status atual
- a empresa deve conseguir abrir o detalhe de qualquer anúncio listado
- a criação de novo anúncio deve continuar centralizada em **/anunciar**

## 8. O que precisa existir nesta tela

### Conteúdo mínimo
- título da página
- CTA para criar novo anúncio
- lista de anúncios publicados pela empresa
- identificação do tipo do anúncio
- valor do anúncio
- status do anúncio
- ação para ver detalhes

### Informações recomendadas por item
- tipo: oferta ou necessidade
- valor
- disponibilidade resumida
- validade
- status:
  - ativo
  - em negociação
  - concluído
  - cancelado
  - expirado

## 9. Ações principais
- Criar novo anúncio
- Abrir detalhe do anúncio
- Filtrar anúncios, quando aplicável

## 10. Validações visíveis
- a tela só deve mostrar anúncios pertencentes à empresa logada
- anúncios sem disponibilidade operacional não deixam de aparecer; apenas exibem o status correspondente
- a criação de novo anúncio leva sempre para **/anunciar**

## 11. Estados principais da tela

### Estado 1 — Empresa com anúncios
A empresa vê:
- lista dos seus anúncios
- status de cada um
- acesso ao detalhe de cada anúncio
- CTA para criar novo anúncio

### Estado 2 — Empresa sem anúncios
A empresa vê:
- mensagem de que ainda não possui anúncios
- CTA principal para **/anunciar**

### Estado 3 — Empresa com anúncios em múltiplos estados
A empresa vê:
- anúncios ativos
- anúncios em negociação
- anúncios encerrados
- todos coexistindo na mesma visão, com diferenciação clara de status

## 12. Estados de interface
- carregando lista de anúncios
- lista exibida com sucesso
- tela vazia
- sem resultados em filtro
- erro ao carregar anúncios

## 13. Feedbacks visíveis
- mensagem de vazio orientando a criar o primeiro anúncio
- mensagem de erro ao falhar o carregamento
- diferenciação visual dos status dos anúncios
- feedback de filtro sem retorno, quando aplicável

## 14. Saídas / navegação de saída

### Ação principal
- **Criar novo anúncio** leva para **/anunciar**

### Ação por item
- **Ver detalhe** leva para **Detalhe do anúncio**

## 15. Regras de negócio refletidas na tela
- a empresa publica e acompanha seus próprios anúncios
- um anúncio pode continuar ativo mesmo com negociações em andamento, se houver saldo restante
- o status do anúncio precisa refletir sua condição operacional real
- a tela não substitui o detalhe; ela funciona como visão de controle da empresa

## 16. Observações
Este documento define a lógica funcional da tela.
Ele não fixa layout visual, estrutura estética, posicionamento final de blocos ou design de interface.
