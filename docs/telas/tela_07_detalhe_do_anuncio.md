# Tela 6 — Detalhe do anúncio

## 1. Nome da tela
Detalhe do anúncio

## 2. Objetivo
Exibir as informações completas de um anúncio e servir como ponto de entrada para a ação operacional adequada, como solicitação, atendimento ou acompanhamento do próprio anúncio.

## 3. Acesso
- Público, com visualização parcial quando for visitante
- Empresa logada e aprovada, com visualização completa quando aplicável
- Empresa autora do anúncio, com contexto completo do próprio anúncio

## 4. Origem de navegação
O usuário pode chegar nesta tela por:
- **/anuncios**
- Meus anúncios
- Perfil da empresa
- links internos da plataforma
- bloco de descoberta inicial da Home, quando aplicável

## 5. Tipo de tela
Tela de detalhe operacional e informacional do anúncio.

## 6. Estrutura lógica da tela
A tela deve conter, em nível funcional:

- identificação do anúncio
- identificação da empresa autora
- tipo do anúncio
- informações principais da operação
- composição
- status do anúncio
- regras do anúncio, quando aplicável
- ação operacional compatível com o perfil do usuário

## 7. Regras gerais da tela
- visitantes veem uma versão parcial
- empresas aprovadas veem a versão completa, quando permitido
- a empresa autora vê o anúncio com contexto de gestão
- a ação disponível depende de:
  - quem está acessando
  - tipo do anúncio
  - status do anúncio
  - disponibilidade operacional
- a descoberta pública principal do anúncio acontece em **/anuncios**, e o detalhe é o aprofundamento desse fluxo

## 8. O que precisa existir nesta tela

### Conteúdo mínimo
- título ou identificação do anúncio
- nome da empresa autora
- tipo do anúncio
- valor
- composição
- local/região
- disponibilidade
- validade
- status do anúncio

### Conteúdo adicional por contexto
#### Se for oferta
- regra de integral ou parcial
- regra de local da troca

#### Se for necessidade
- composição desejada
- contexto da necessidade

### Ações possíveis por contexto
#### Visitante
- ver informação resumida/parcial
- ir para login/cadastro ao tentar interagir

#### Empresa aprovada não autora
- solicitar anúncio
- atender necessidade, quando aplicável
- abrir perfil da empresa

#### Empresa autora
- acompanhar o próprio anúncio
- abrir solicitações vinculadas, quando aplicável

## 9. Ações principais
- Solicitar anúncio
- Atender necessidade
- Abrir perfil da empresa
- Ver solicitações do anúncio, quando autora
- Voltar para **/anuncios** ou área anterior

## 10. Validações visíveis
- ação operacional não deve aparecer para visitante sem autenticação adequada
- empresa não aprovada não deve conseguir iniciar solicitação operacional
- anúncio indisponível não deve permitir nova solicitação
- regras do anúncio devem impactar a ação disponível ao usuário

## 11. Estados principais da tela

### Estado 1 — Visitante
O usuário vê:
- dados resumidos/parciais do anúncio
- CTA para login/cadastro ao tentar interagir

### Estado 2 — Empresa aprovada visualizando anúncio disponível
A empresa vê:
- detalhes completos
- ação operacional disponível, quando aplicável

### Estado 3 — Empresa autora visualizando seu próprio anúncio
A empresa vê:
- detalhes completos
- contexto do anúncio como item gerenciável
- acesso a solicitações vinculadas, quando houver

### Estado 4 — Anúncio indisponível operacionalmente
O usuário vê:
- detalhe do anúncio
- status correspondente
- ação operacional bloqueada ou ausente

## 12. Estados de interface
- carregando detalhe
- sucesso com dados exibidos
- erro ao carregar anúncio
- bloqueado para ação operacional
- anúncio não encontrado ou indisponível
- sem permissão para ação específica

## 13. Feedbacks visíveis
- mensagem clara quando o anúncio não estiver mais disponível para solicitação
- mensagem de bloqueio para usuário não autorizado a interagir
- indicação visível do status do anúncio
- indicação de que é necessário login/aprovação para interagir, quando aplicável

## 14. Saídas / navegação de saída

### Saídas principais
- **Solicitar anúncio** leva para **Solicitações**
- **Atender necessidade** leva para **Solicitações**
- **Abrir perfil da empresa** leva para **Perfil da empresa**
- **Ver solicitações do anúncio** pode levar para **Solicitações**
- **Voltar** retorna para **/anuncios** ou origem anterior

## 15. Regras de negócio refletidas na tela
- detalhe parcial e detalhe completo foram unificados em uma única tela com comportamento por contexto
- a mesma tela atende visitante, empresa aprovada e empresa autora, mas com níveis diferentes de acesso
- a ação operacional nasce do detalhe do anúncio
- a interação depende do status e das regras do anúncio
- a descoberta pública agora tem uma página dedicada: **/anuncios**

## 16. Observações
Este documento define a lógica funcional da tela.
Ele não fixa layout visual, estrutura estética, posicionamento final de blocos ou design de interface.
