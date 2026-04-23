# Mapa de Telas Consolidado — Fase 3 (Atualizado)

## Telas públicas

| Tela | Acesso | Objetivo | Observação |
|---|---|---|---|
| Home | Público | Apresentar a proposta da plataforma, conduzir para login/cadastro e oferecer descoberta inicial de anúncios | Porta de entrada do produto, com bloco inicial de descoberta |
| Login | Público | Autenticar empresas já cadastradas | Também serve como ponto de entrada para cadastro |
| Cadastro de empresa | Público | Iniciar cadastro da empresa e do responsável principal | Fluxo em etapas |
| /anuncios | Público | Permitir descoberta e navegação pública dos anúncios da plataforma | Página dedicada de listagem pública de anúncios |
| Detalhe do anúncio | Público, com comportamento por contexto | Mostrar o anúncio em nível parcial para visitante e completo para empresa aprovada | Tela unificada de detalhe parcial + completo |
| Perfil da empresa | Público e contextual para a própria empresa | Exibir reputação, dados públicos e anúncios ativos da empresa | Tela unificada de perfil público + meu perfil |

## Telas da empresa logada

| Tela | Acesso | Objetivo | Observação |
|---|---|---|---|
| Status cadastral / aprovação | Empresa logada | Mostrar se a empresa está em análise, aprovada ou reprovada e orientar o próximo passo | Também concentra o contexto de correção/reenvio quando houver reprovação |

## Telas da empresa logada e aprovada

| Tela | Acesso | Objetivo | Observação |
|---|---|---|---|
| Dashboard | Empresa logada e aprovada | Servir como entrada principal da operação da empresa | Pode ter atalhos para áreas principais |
| /anunciar | Empresa logada e aprovada | Ser o ponto central para iniciar criação de anúncio | Primeiro escolhe oferta ou necessidade |
| Meus anúncios | Empresa logada e aprovada | Listar e organizar anúncios da própria empresa | Gestão dos anúncios criados |
| Solicitações | Empresa logada e aprovada | Centralizar solicitações enviadas e recebidas | Tela unificada com dois contextos internos |
| Tela da negociação | Empresa logada e aprovada participante | Concentrar contexto da operação, chat oficial e avaliação posterior | Página central da negociação |
| Perfil da empresa | Empresa logada e aprovada | Acompanhar presença pública e contexto próprio da empresa | Mesma tela pública com ações/contexto extras para a própria empresa |

## Telas administrativas

| Tela | Acesso | Objetivo | Observação |
|---|---|---|---|
| Painel administrativo | Admin / moderação | Ser a entrada principal da operação administrativa | Separado da navegação da empresa |
| Análise cadastral admin | Admin / moderação | Aprovar, reprovar e acompanhar histórico cadastral das empresas | Fluxo próprio de validação |
| Denúncias / tickets admin | Admin / moderação | Acompanhar, tratar e encerrar denúncias abertas | Toda denúncia vira ticket |
| Moderação de avaliações | Admin / moderação | Aprovar ou barrar comentários antes da publicação | Controle da reputação pública |

## Unificações aprovadas

- negociação + chat + avaliação
- `/anunciar` + criar oferta + criar necessidade
- solicitações enviadas + recebidas
- dados da minha empresa + ajuste cadastral, absorvidos em **Status cadastral / aprovação**
- detalhe parcial + detalhe completo do anúncio
- perfil público + meu perfil

## Resumo

- **Telas públicas:** 6
- **Telas da empresa logada:** 1
- **Telas da empresa logada e aprovada:** 6
- **Telas administrativas:** 4

Total base: **16 telas/blocos de tela**
