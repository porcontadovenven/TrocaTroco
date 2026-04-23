# Tela 9 — Perfil da empresa

## 1. Nome da tela
Perfil da empresa

## 2. Objetivo
Servir como página única da empresa dentro da plataforma, combinando a visão pública da reputação e dos anúncios com elementos de contexto próprio quando a empresa estiver vendo o seu próprio perfil.

## 3. Acesso
- Público, para visualização das informações públicas da empresa
- Empresa logada e aprovada, inclusive quando estiver visualizando o próprio perfil

## 4. Origem de navegação
O usuário pode chegar nesta tela por:
- nome da empresa dentro do anúncio
- nome da empresa dentro da negociação, quando visível
- nome da empresa em avaliações/comentários públicos
- link direto do perfil
- navegação interna da própria empresa

## 5. Tipo de tela
Tela pública de reputação e identidade da empresa, com comportamento contextual quando for a própria empresa acessando.

## 6. Estrutura lógica da tela
A tela deve conter, em nível funcional:

- identificação pública da empresa
- resumo da reputação
- detalhes públicos permitidos
- verificações cadastrais visíveis
- avaliações/comentários aprovados
- anúncios ativos da empresa
- ação de denunciar
- contexto adicional quando a empresa estiver vendo o próprio perfil

## 7. Regras gerais da tela
- a tela é pública, mas o conteúdo exibido pode variar conforme o contexto de quem acessa
- dados sensíveis e internos não podem aparecer
- comentários só aparecem depois da moderação
- a empresa avaliada pode responder aos comentários publicados
- os anúncios ativos ficam abaixo dos comentários/avaliações
- o botão de denunciar deve existir para empresa logada/aprovada

## 8. O que precisa existir nesta tela

### Conteúdo mínimo
- foto da empresa
- nome da empresa
- média simples das avaliações
- volume total de avaliações
- detalhes públicos permitidos
- verificações cadastrais visíveis
- comentários/avaliações aprovadas
- anúncios ativos da empresa
- botão de denunciar

### Detalhes públicos possíveis
- data de criação
- percentual de avaliações positivas
- indicadores públicos permitidos da empresa

### Conteúdo de reputação
- média simples
- volume de avaliações
- comentários aprovados
- filtro por:
  - positivas
  - neutras
  - negativas
- resposta da empresa, quando existir

### Conteúdo de anúncios
- lista dos anúncios ativos da empresa
- acesso ao detalhe do anúncio

## 9. Ações principais
- Abrir detalhe de anúncio ativo
- Filtrar avaliações
- Responder comentário, quando for a empresa dona do perfil e a avaliação já estiver publicada
- Denunciar empresa
- Navegar entre perfil e anúncios

## 10. Validações visíveis
- somente comentários aprovados podem aparecer
- dados privados não devem ser exibidos em nenhuma hipótese
- ação de denunciar deve respeitar o perfil habilitado
- a resposta ao comentário só pode existir quando a avaliação estiver publicada
- a mesma tela deve servir ao público e à própria empresa, mas sem expor dados internos indevidos

## 11. Estados principais da tela

### Estado 1 — Perfil público com avaliações
O usuário vê:
- identidade da empresa
- reputação consolidada
- comentários aprovados
- anúncios ativos

### Estado 2 — Perfil público sem avaliações
O usuário vê:
- identidade da empresa
- mensagem de que ainda não possui avaliações públicas
- anúncios ativos, se existirem

### Estado 3 — Perfil público sem anúncios ativos
O usuário vê:
- reputação e dados públicos
- mensagem de que a empresa não possui anúncios ativos no momento

### Estado 4 — Própria empresa visualizando seu perfil
A empresa vê:
- as mesmas informações públicas
- possibilidade de responder comentários publicados
- contexto de autoacompanhamento do seu perfil dentro da plataforma

## 12. Estados de interface
- carregando perfil
- erro ao carregar perfil
- sem avaliações
- sem anúncios ativos
- sucesso com perfil exibido
- sem permissão para ação específica
- filtro sem resultados

## 13. Feedbacks visíveis
- mensagem clara quando não houver avaliações públicas
- mensagem clara quando não houver anúncios ativos
- indicação visual de reputação consolidada
- confirmação quando a empresa responder um comentário
- mensagem de erro se não for possível carregar o perfil ou aplicar ação

## 14. Saídas / navegação de saída
- clicar em anúncio ativo leva para **Detalhe do anúncio**
- denúncia leva para fluxo de denúncia/ticket
- links contextuais podem retornar para a origem anterior do usuário

## 15. Regras de negócio refletidas na tela
- perfil público + meu perfil foram unificados em uma única tela
- o que muda é o contexto de acesso, não a existência de telas separadas
- a reputação pública é parte central da confiança do produto
- a navegação entre perfil e anúncio é bidirecional
- anúncios ativos aparecem abaixo dos comentários/avaliações

## 16. Observações
Este documento define a lógica funcional da tela.
Ele não fixa layout visual, estrutura estética, posicionamento final de blocos ou design de interface.
