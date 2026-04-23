# Documento de Fechamento — Fase 3 (Design Funcional) — Atualizado

## 1. Objetivo da Fase 3

A Fase 3 teve como objetivo definir, em nível lógico e funcional, como o produto será vivido na interface, sem entrar ainda em modelagem de dados, arquitetura técnica ou implementação.

Nesta fase, o foco foi:
- definir as telas do MVP
- definir como o usuário navega entre elas
- definir os estados visíveis de negócio
- definir os estados de interface/UX
- consolidar a lógica funcional das telas principais

---

## 2. Escopo adotado para a Fase 3

A Fase 3 foi conduzida com foco em **documentação lógica**, e não em design visual final.

### O que foi incluído
- mapa de telas
- fluxos de navegação
- estados visíveis de negócio
- estados de interface
- spec lógica por tela

### O que ficou para depois
- wireframes detalhados
- layout final
- UI visual
- protótipo
- design system

---

## 3. Estrutura simplificada final de telas do MVP

A estrutura simplificada final aprovada para o MVP ficou com **16 telas**:

1. Home  
2. Login  
3. Cadastro de empresa  
4. Status cadastral / aprovação  
5. Dashboard  
6. /anunciar  
7. Meus anúncios  
8. /anuncios  
9. Detalhe do anúncio  
10. Solicitações  
11. Tela da negociação  
12. Perfil da empresa  
13. Painel administrativo  
14. Análise cadastral admin  
15. Denúncias / tickets admin  
16. Moderação de avaliações  

---

## 4. Unificações aprovadas

Durante a Fase 3, foi aprovada a simplificação estrutural do produto com as seguintes unificações:

- negociação + chat + avaliação
- /anunciar + criar oferta + criar necessidade
- solicitações enviadas + recebidas
- dados da minha empresa + ajuste cadastral, absorvidos em **Status cadastral / aprovação**
- detalhe parcial + detalhe completo do anúncio
- perfil público + meu perfil

Essas unificações não alteram a lógica de negócio do produto; elas simplificam a forma como essa lógica será organizada em tela no MVP.

---

## 5. Ajustes finais consolidados antes da Fase 4

Antes da abertura da Fase 4, a Fase 3 recebeu os seguintes ajustes estruturais finais:

### 5.1 Descoberta pública de anúncios
- a **Home** passou a cumprir função de descoberta inicial
- foi criada a página dedicada **/anuncios** como navegação pública principal de anúncios

### 5.2 Ajuste cadastral pós-reprovação
- a tela **Status cadastral / aprovação** passou a absorver também o contexto de correção e reenvio cadastral

### 5.3 Atualização do detalhe do anúncio
- o **Detalhe do anúncio** passou a considerar formalmente a navegação vinda de **/anuncios** e da descoberta inicial da Home

---

## 6. Entregáveis produzidos na Fase 3

### 6.1 Mapa de telas consolidado
Foi consolidado o mapa funcional das telas do MVP, com:
- nome da tela
- acesso
- objetivo
- observação funcional

### 6.2 Fluxos de navegação
Foram definidos os fluxos principais entre as telas, cobrindo:

- entrada e exploração pública
- cadastro e aprovação
- publicação de anúncio
- descoberta e solicitação
- análise, aceite e recusa
- negociação e chat
- avaliação e reputação
- perfil da empresa
- administração e moderação

### 6.3 Estados visíveis de negócio
Foram definidos os estados visíveis de:

- cadastro
- anúncio
- solicitação
- negociação
- avaliação
- reputação
- ticket / denúncia
- perfil da empresa
- admin / moderação

### 6.4 Estados de interface / UX
Foram definidos os estados de interface necessários para implementação e previsibilidade da experiência, como:

- vazio
- carregando
- erro
- sucesso
- bloqueado
- sem permissão
- sem resultados

### 6.5 Spec lógica das telas principais
Foram documentadas logicamente as telas da estrutura simplificada final, com:
- nome da tela
- objetivo
- acesso
- origem de navegação
- estrutura lógica
- ações principais
- validações visíveis
- estados principais
- estados de interface
- saídas / navegação de saída
- regras de negócio refletidas na tela

---

## 7. Revisão do fluxo P0 ponta a ponta

O fluxo principal do MVP foi revisado de ponta a ponta e considerado logicamente consistente com a estrutura final.

### Fluxo P0 consolidado
1. usuário entra pela **Home**
2. pode seguir para **Login**, **Cadastro de empresa** ou **/anuncios**
3. empresa envia o cadastro
4. acompanha **Status cadastral / aprovação**
5. empresa aprovada entra no **Dashboard**
6. empresa acessa **/anunciar**
7. publica anúncio
8. acompanha em **Meus anúncios**
9. outra empresa descobre anúncios em **/anuncios**
10. aprofunda o contexto em **Detalhe do anúncio**
11. envia ou recebe proposta em **Solicitações**
12. aceite cria a **Tela da negociação**
13. negociação, chat e avaliação acontecem no mesmo contexto operacional
14. reputação aparece em **Perfil da empresa**
15. admin/moderação opera via **Painel administrativo**, **Análise cadastral admin**, **Denúncias / tickets admin** e **Moderação de avaliações**

### Pontos formais resolvidos na revisão
- descoberta pública principal consolidada em **/anuncios**
- descoberta inicial preservada na **Home**
- correção/reenvio cadastral absorvidos por **Status cadastral / aprovação**
- sem necessidade de novas telas além da estrutura final de 16

---

## 8. O que a Fase 3 deixa pronto para a Fase 4

Com o fechamento da Fase 3, o projeto passa a ter base suficiente para alimentar:

- modelagem de domínio
- modelagem de entidades
- relacionamentos
- estados e transições
- modelagem de banco de dados
- backlog técnico
- definição de rotas e componentes do frontend
- critérios de teste de interface e comportamento

---

## 9. O que ainda não faz parte desta fase

Não foram fixados nesta fase:
- layout final das páginas
- design visual
- wireframes detalhados de alta fidelidade
- decisões de UI fina
- arquitetura técnica
- APIs
- banco de dados
- implementação

Esses pontos pertencem a fases posteriores.

---

## 10. Critério de encerramento da Fase 3

A Fase 3 pode ser considerada encerrada porque agora já é possível responder, sem improviso:

- quais telas existem
- quem acessa cada tela
- como o usuário navega entre elas
- o que precisa existir em cada tela
- quais ações existem
- quais estados visuais e operacionais existem
- o que acontece em erro, vazio, sucesso, bloqueio e sem permissão

Além disso, o fluxo P0 foi revisado e ajustado antes da abertura da fase seguinte.

---

## 11. Status final da Fase 3

**Status sugerido: CONCLUÍDA**

A Fase 3 está consolidada em nível lógico/funcional e pronta para servir de base à Fase 4.

---

## 12. Próximo passo recomendado

O próximo passo natural do projeto é:

# Fase 4 — Modelagem de domínio e dados

Essa próxima fase deverá definir:
- entidades principais
- relacionamentos
- estrutura lógica do banco
- estados e transições de domínio
- regras de persistência
- modelo de dados base do MVP

---

## 13. Observação final

Este documento marca o fechamento funcional da Fase 3.

Ele não substitui os documentos específicos produzidos durante a fase, mas serve como índice, síntese executiva e ponto formal de transição para a Fase 4.
