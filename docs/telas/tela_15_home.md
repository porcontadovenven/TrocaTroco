# Tela 14 — Home

## 1. Nome da tela
Home

## 2. Objetivo
Apresentar a proposta da plataforma, explicar de forma simples o que o TrocaTroco faz e conduzir o usuário para os principais pontos de entrada do produto, incluindo a descoberta inicial de anúncios públicos.

## 3. Acesso
Público

## 4. Origem de navegação
O usuário pode chegar nesta tela por:
- acesso direto à plataforma
- link público
- retorno de áreas públicas internas

## 5. Tipo de tela
Tela pública de entrada, apresentação do produto e descoberta inicial.

## 6. Estrutura lógica da tela
A tela deve conter, em nível funcional:

- apresentação clara da proposta da plataforma
- explicação resumida do que a plataforma é
- diferenciação do que a plataforma faz e do que não faz
- CTA para login
- CTA para cadastro de empresa
- bloco de descoberta inicial de anúncios públicos
- CTA para acessar a página dedicada **/anuncios**

## 7. Regras gerais da tela
- a Home deve ser compreensível mesmo para quem nunca ouviu falar da plataforma
- deve deixar claro que a plataforma é B2B
- deve deixar claro que a plataforma não processa pagamento nem faz custódia
- deve servir como porta de entrada para cadastro, login e exploração pública
- a Home pode exibir descoberta inicial de anúncios, mas não substitui a página dedicada **/anuncios**
- a exploração pública completa de anúncios deve acontecer em **/anuncios**

## 8. O que precisa existir nesta tela

### Conteúdo mínimo
- nome/logo da plataforma
- proposta principal do produto
- explicação curta do funcionamento
- CTA para **Login**
- CTA para **Cadastro de empresa**
- CTA para **/anuncios**

### Conteúdo adicional recomendado
- resumo de como funciona:
  - publicar anúncio
  - solicitar
  - negociar
  - avaliar
- bloco de confiança/reputação, se fizer sentido no MVP
- bloco de descoberta inicial com alguns anúncios públicos ou uma prévia resumida

## 9. Ações principais
- Entrar / fazer login
- Cadastrar empresa
- Explorar anúncios na Home
- Ir para **/anuncios**

## 10. Validações visíveis
- a Home não exige autenticação
- CTAs devem levar para os fluxos corretos
- a linguagem deve evitar ambiguidade sobre o papel da plataforma
- o bloco de descoberta na Home não deve substituir a navegação dedicada de anúncios

## 11. Estados principais da tela

### Estado 1 — Exibição normal
O usuário vê:
- proposta do produto
- caminhos de entrada
- explicação resumida
- descoberta inicial de anúncios

### Estado 2 — Home com anúncios em destaque
O usuário vê:
- prévia de anúncios públicos
- ação para continuar explorando em **/anuncios**

### Estado 3 — Home sem anúncios em destaque
O usuário vê:
- proposta do produto normalmente
- CTA para acessar **/anuncios**, mesmo sem prévia carregada

## 12. Estados de interface
- carregando página inicial
- erro ao carregar conteúdo público
- erro ao carregar bloco de anúncios em destaque
- sucesso com conteúdo exibido

## 13. Feedbacks visíveis
- mensagens curtas e claras sobre o que a plataforma faz
- erro de carregamento quando a página pública não puder ser exibida
- erro específico no bloco de anúncios em destaque, sem quebrar a Home inteira
- CTAs visíveis e diretos

## 14. Saídas / navegação de saída
A partir da Home, o usuário pode seguir para:
- **Login**
- **Cadastro de empresa**
- **/anuncios**

## 15. Regras de negócio refletidas na tela
- a Home é pública
- a plataforma permite exploração inicial sem login
- a operação real depende de cadastro, autenticação e aprovação da empresa
- a descoberta pública começa na Home, mas a navegação dedicada de anúncios acontece em **/anuncios**

## 16. Observações
Este documento define a lógica funcional da tela.
Ele não fixa layout visual, estrutura estética, posicionamento final de blocos ou design de interface.
