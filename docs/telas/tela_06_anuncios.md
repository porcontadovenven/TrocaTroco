# Tela 16 — /anuncios

## 1. Nome da tela
/anuncios

## 2. Objetivo
Funcionar como a página dedicada de descoberta e navegação pública dos anúncios da plataforma.

## 3. Acesso
Público

## 4. Origem de navegação
O usuário pode chegar nesta tela por:
- Home
- link direto público
- navegação interna a partir do Perfil da empresa
- retorno vindo do Detalhe do anúncio

## 5. Tipo de tela
Tela pública de listagem e descoberta de anúncios.

## 6. Estrutura lógica da tela
A tela deve conter, em nível funcional:

- identificação da área de anúncios
- listagem pública dos anúncios
- informações resumidas de cada anúncio
- acesso ao detalhe do anúncio
- possibilidade de navegação/filtragem simples, quando aplicável

## 7. Regras gerais da tela
- a tela é pública
- visitantes podem explorar anúncios sem autenticação
- visitantes veem o anúncio em formato resumido e só aprofundam a interação após login/cadastro
- empresas autenticadas e aprovadas podem usar a mesma tela como ponto de descoberta antes de abrir o detalhe do anúncio
- a ação operacional continua nascendo no **Detalhe do anúncio**, nunca diretamente da listagem

## 8. O que precisa existir nesta tela

### Conteúdo mínimo
- título da área de anúncios
- lista de anúncios públicos
- tipo do anúncio
- valor resumido
- local/região
- status do anúncio
- nome da empresa
- ação de abrir o **Detalhe do anúncio**

### Conteúdo adicional recomendado
- filtros simples
- ordenação básica
- CTA para login/cadastro quando o usuário for visitante
- indicação de que o detalhe completo e a interação exigem conta

## 9. Ações principais
- Abrir detalhe do anúncio
- Abrir perfil da empresa
- Ir para login
- Ir para cadastro de empresa
- Filtrar anúncios, quando aplicável

## 10. Validações visíveis
- a tela não exige autenticação
- visitantes não devem conseguir iniciar ação operacional a partir da listagem
- a listagem deve exibir apenas anúncios disponíveis ao contexto público
- o detalhe do anúncio continua sendo a porta para qualquer aprofundamento

## 11. Estados principais da tela

### Estado 1 — Listagem com anúncios
O usuário vê:
- anúncios públicos resumidos
- ação para abrir detalhe
- ação para abrir perfil da empresa

### Estado 2 — Listagem sem anúncios
O usuário vê:
- mensagem de que não há anúncios disponíveis no momento
- possibilidade de voltar para a Home

### Estado 3 — Usuário visitante explorando
O usuário vê:
- listagem pública
- incentivo para login/cadastro quando quiser interagir

### Estado 4 — Empresa aprovada explorando
A empresa vê:
- mesma listagem pública
- uso do fluxo até o detalhe completo do anúncio

## 12. Estados de interface
- carregando anúncios
- erro ao carregar listagem
- sem resultados
- sucesso com anúncios exibidos

## 13. Feedbacks visíveis
- mensagem de vazio quando não houver anúncios
- mensagem de erro ao falhar o carregamento
- indicação de que a interação operacional exige login/aprovação
- feedback de filtro sem retorno, quando aplicável

## 14. Saídas / navegação de saída
A partir de **/anuncios**, o usuário pode seguir para:
- **Detalhe do anúncio**
- **Perfil da empresa**
- **Login**
- **Cadastro de empresa**
- **Home**

## 15. Regras de negócio refletidas na tela
- a descoberta pública de anúncios foi separada em uma página dedicada
- a Home continua podendo exibir descoberta inicial, mas **/anuncios** é a navegação pública principal de anúncios
- detalhe parcial + detalhe completo continuam unificados em uma única tela com comportamento por contexto

## 16. Observações
Este documento define a lógica funcional da tela.
Ele não fixa layout visual, estrutura estética, posicionamento final de blocos ou design de interface.
