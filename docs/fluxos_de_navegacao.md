# Fase 3 — Fluxos de Navegação (Atualizado)

## Objetivo

Definir como o usuário percorre o produto entre as telas principais da estrutura simplificada final, considerando a navegação pública, operacional e administrativa.

---

## 1. Estrutura final considerada neste documento

A navegação foi atualizada para a estrutura simplificada com **16 telas/blocos**:

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

## 2. Fluxo de navegação público

### Fluxo 2.1 — Entrada principal
**Home**  
→ ação: explorar a plataforma  
→ destinos possíveis:
- **Login**
- **Cadastro de empresa**
- **/anuncios**

### Fluxo 2.2 — Descoberta inicial na Home
**Home**  
→ ação: interagir com descoberta inicial de anúncios  
→ destino:
- **/anuncios**
- ou diretamente **Detalhe do anúncio**, quando houver bloco de destaque

### Fluxo 2.3 — Navegação pública de anúncios
**/anuncios**  
→ ação: abrir anúncio  
→ destino:
- **Detalhe do anúncio**

**/anuncios**  
→ ação: abrir empresa  
→ destino:
- **Perfil da empresa**

### Fluxo 2.4 — Interação sem autenticação
**Detalhe do anúncio**  
→ estado: visitante  
→ ação: tentar interagir  
→ destino:
- **Login**
- **Cadastro de empresa**

### Fluxo 2.5 — Perfil público
**Perfil da empresa**  
→ ação: abrir anúncio ativo  
→ destino:
- **Detalhe do anúncio**

---

## 3. Fluxo de cadastro e aprovação

### Fluxo 3.1 — Início do cadastro
**Home** ou **Login**  
→ ação: cadastrar empresa  
→ destino:
- **Cadastro de empresa**

### Fluxo 3.2 — Envio do cadastro
**Cadastro de empresa**  
→ ação: concluir etapas e enviar  
→ destino:
- **Status cadastral / aprovação**

### Fluxo 3.3 — Empresa em análise
**Status cadastral / aprovação**  
→ estado: em análise  
→ destinos possíveis:
- permanência na própria tela
- navegação básica da conta, sem operação

### Fluxo 3.4 — Empresa aprovada
**Status cadastral / aprovação**  
→ estado: aprovada  
→ ação: seguir para operação  
→ destino:
- **Dashboard**

### Fluxo 3.5 — Empresa reprovada
**Status cadastral / aprovação**  
→ estado: reprovada  
→ ação: corrigir e reenviar  
→ destino:
- permanência na própria tela, com contexto de correção/reenvio
- novo envio leva de volta ao estado **em análise**

---

## 4. Fluxo operacional da empresa aprovada

### Fluxo 4.1 — Entrada principal da operação
**Dashboard**  
→ destinos principais:
- **/anunciar**
- **Meus anúncios**
- **Solicitações**
- **Tela da negociação**, quando houver negociação ativa
- **Perfil da empresa**
- **/anuncios**

---

## 5. Fluxo de criação de anúncio

### Fluxo 5.1 — Entrada na criação
**Dashboard** ou **Meus anúncios**  
→ ação: criar anúncio  
→ destino:
- **/anunciar**

### Fluxo 5.2 — Escolha do tipo
**/anunciar**  
→ ação: escolher tipo de anúncio  
→ destino:
- permanência no próprio fluxo de criação, com definição de:
  - oferta
  - necessidade

### Fluxo 5.3 — Publicação
**/anunciar**  
→ ação: concluir preenchimento e publicar  
→ destino:
- **Meus anúncios**
- ou **Detalhe do anúncio**, quando fizer sentido pelo fluxo adotado

---

## 6. Fluxo de descoberta e solicitação

### Fluxo 6.1 — Descoberta por empresa aprovada
**/anuncios**  
→ ação: abrir anúncio  
→ destino:
- **Detalhe do anúncio**

### Fluxo 6.2 — Solicitação
**Detalhe do anúncio**  
→ ação: solicitar anúncio / atender necessidade  
→ destino:
- **Solicitações**

### Fluxo 6.3 — Acompanhamento da solicitante
**Solicitações**  
→ contexto: enviadas  
→ estados visíveis:
- pendente
- aceita
- recusada
- cancelada
- expirada

**Solicitações**  
→ ação: abrir solicitação aceita  
→ destino:
- **Tela da negociação**

### Fluxo 6.4 — Cancelamento
**Solicitações**  
→ contexto: enviadas  
→ ação: cancelar solicitação pendente dentro da janela permitida  
→ destino:
- permanência na própria tela com status atualizado

---

## 7. Fluxo de análise, aceite e recusa

### Fluxo 7.1 — Acompanhamento da autora do anúncio
**Solicitações**  
→ contexto: recebidas  
→ ação: abrir solicitação  
→ destino:
- permanência na própria tela ou detalhe lógico interno da solicitação

### Fluxo 7.2 — Aceite
**Solicitações**  
→ contexto: recebidas  
→ ação: aceitar  
→ destino:
- **Tela da negociação**

### Fluxo 7.3 — Recusa
**Solicitações**  
→ contexto: recebidas  
→ ação: recusar  
→ destino:
- permanência na própria tela com status atualizado

### Fluxo 7.4 — Efeito para a solicitante
**Solicitações**  
→ contexto: enviadas  
→ estado:
- recusada, sem chat
- aceita, com acesso à **Tela da negociação**

---

## 8. Fluxo de negociação, chat e avaliação

### Fluxo 8.1 — Entrada na negociação
**Solicitações** ou **Dashboard**  
→ ação: abrir negociação aceita  
→ destino:
- **Tela da negociação**

### Fluxo 8.2 — Operação em andamento
**Tela da negociação**  
→ ações possíveis:
- conversar no chat
- denunciar / chamar moderador
- concluir negociação

### Fluxo 8.3 — Moderação
**Tela da negociação**  
→ ação: denunciar / chamar moderador  
→ efeito:
- abertura de ticket
- permanência na própria tela
- possibilidade de entrada do moderador no mesmo contexto

### Fluxo 8.4 — Conclusão
**Tela da negociação**  
→ ação: concluir negociação  
→ efeito:
- a própria tela passa a exibir a etapa de avaliação

### Fluxo 8.5 — Avaliação
**Tela da negociação**  
→ ação: avaliar contraparte  
→ efeito:
- envio da avaliação
- comentário segue para moderação
- reputação futura aparece em **Perfil da empresa**

---

## 9. Fluxo do perfil da empresa

### Fluxo 9.1 — Entrada no perfil
**/anuncios**, **Detalhe do anúncio**, **Tela da negociação**, avaliações públicas ou link direto  
→ ação: abrir empresa  
→ destino:
- **Perfil da empresa**

### Fluxo 9.2 — Perfil para anúncio
**Perfil da empresa**  
→ ação: abrir anúncio ativo  
→ destino:
- **Detalhe do anúncio**

### Fluxo 9.3 — Denúncia pelo perfil
**Perfil da empresa**  
→ ação: denunciar  
→ efeito:
- abertura de denúncia/ticket
- permanência no fluxo do perfil

---

## 10. Fluxo administrativo

### Fluxo 10.1 — Entrada no admin
**Login**  
→ perfil administrativo autenticado  
→ destino:
- **Painel administrativo**

### Fluxo 10.2 — Análise cadastral
**Painel administrativo**  
→ ação: abrir análise cadastral  
→ destino:
- **Análise cadastral admin**

### Fluxo 10.3 — Tickets
**Painel administrativo**  
→ ação: abrir tickets  
→ destino:
- **Denúncias / tickets admin**

### Fluxo 10.4 — Moderação de avaliações
**Painel administrativo**  
→ ação: abrir moderação de avaliações  
→ destino:
- **Moderação de avaliações**

### Fluxo 10.5 — Contexto ampliado
**Denúncias / tickets admin**  
→ ação: abrir contexto do caso  
→ destinos possíveis:
- **Tela da negociação**
- **Perfil da empresa**
- contexto do anúncio, quando aplicável

---

## 11. Observações finais de navegação

- a **Home** inicia a descoberta pública, mas a navegação pública principal de anúncios acontece em **/anuncios**
- o **Detalhe do anúncio** é a porta de aprofundamento e ação
- **Status cadastral / aprovação** também absorve o contexto de correção e reenvio cadastral
- **Solicitações** reúne enviadas e recebidas
- **Tela da negociação** reúne negociação + chat + avaliação
- **Perfil da empresa** reúne perfil público + contexto da própria empresa
- o admin opera em fluxo separado a partir do **Painel administrativo**

---

## 12. Próximo uso deste material

Este documento serve como base para:
- revisão final do fluxo P0
- modelagem de domínio
- definição de estados e transições
- estruturação de rotas e permissões
- abertura da Fase 4
