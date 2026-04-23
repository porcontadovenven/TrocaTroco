# PRD — TrocaTroco (MVP)

## 1. Contexto

Empresas frequentemente precisam de troco para sua operação diária e, ao mesmo tempo, outras empresas possuem troco ocioso disponível. Hoje, esse processo tende a acontecer de forma informal, desorganizada e sem registro estruturado.

O TrocaTroco nasce para resolver esse problema com uma plataforma B2B que conecta oferta e necessidade de troco entre empresas, organizando descoberta, solicitação, negociação, chat oficial, moderação e reputação.

## 2. Problema

Hoje, a troca de troco entre empresas costuma enfrentar problemas como:
- dificuldade de encontrar empresas com troco disponível
- falta de padronização na solicitação
- pouca visibilidade sobre confiabilidade da outra parte
- ausência de histórico formal da negociação
- ausência de canal oficial para resolução de conflito

## 3. Proposta de valor

O TrocaTroco oferece um ambiente oficial para que empresas possam:
- anunciar troco disponível
- publicar necessidade de troco
- solicitar operações de forma estruturada
- negociar em canal oficial dentro da plataforma
- acionar moderação quando necessário
- construir reputação pública com base em avaliações reais

## 4. Objetivo do MVP

Validar que empresas conseguem utilizar a plataforma para encontrar outra empresa, estruturar a negociação, concluir a operação e registrar reputação com confiança mínima operacional.

## 5. Objetivos de produto

### Objetivos principais
- permitir cadastro e aprovação de empresas
- permitir publicação de anúncios de oferta e necessidade
- permitir envio e gestão de solicitações
- permitir aceite ou recusa de solicitações
- liberar chat oficial após aceite
- permitir denúncia e moderação
- permitir avaliações e reputação pública

### Não objetivos do MVP
- processar pagamento
- atuar como intermediador financeiro
- custodiar valores
- garantir liquidação financeira
- permitir múltiplos modelos livres de logística fora das regras já definidas

## 6. Público-alvo

### Usuário principal
- empresa com CNPJ ativo ou MEI
- possui ou precisa de troco para operação diária
- busca rapidez, segurança operacional e previsibilidade

### Estrutura inicial
No MVP:
- 1 empresa = 1 conta = 1 usuário responsável principal

## 7. Escopo funcional do MVP

### 7.1 Cadastro e aprovação
O sistema deverá permitir:
- cadastro de empresa
- envio de dados cadastrais
- validação mínima de contato
- análise manual administrativa
- aprovação ou reprovação
- reenvio para nova análise em caso de reprovação

### 7.2 Anúncios
O sistema deverá permitir:
- criação de anúncio de oferta
- criação de anúncio de necessidade
- composição obrigatória em todos os anúncios
- definição de disponibilidade e validade
- visualização de anúncios ativos

### 7.3 Solicitações
O sistema deverá permitir:
- envio de solicitação estruturada
- escolha de valor total ou parcial, quando permitido
- definição de composição desejada, quando aplicável
- definição de meio de pagamento
- cancelamento da solicitação pela solicitante em até 15 minutos
- coexistência de múltiplas solicitações pendentes no mesmo anúncio

### 7.4 Aceite e recusa
O sistema deverá permitir:
- aceite da solicitação pela empresa autora do anúncio
- recusa da solicitação
- prazo inicial de até 12 horas para resposta
- reserva de saldo apenas após aceite

### 7.5 Chat oficial
O sistema deverá permitir:
- abertura automática do chat apenas após aceite
- comunicação oficial entre as empresas
- histórico da conversa
- acionamento de moderação dentro do chat

### 7.6 Saldo e disponibilidade
O sistema deverá permitir:
- múltiplos atendimentos por anúncio, desde que exista saldo
- exibição de saldo remanescente em anúncios parciais
- retorno do saldo ao anúncio em caso de cancelamento, desde que o anúncio ainda esteja ativo
- exigência de novo anúncio quando o anterior já tiver sido finalizado

### 7.7 Denúncia e moderação
O sistema deverá permitir:
- abertura de denúncia/ticket
- análise por administração/moderação
- canal de comunicação até fechamento do caso
- entrada do moderador no mesmo chat da negociação
- acesso ao histórico anterior da conversa
- registro de decisão/solução pelo moderador

### 7.8 Avaliações e reputação
O sistema deverá permitir:
- avaliação apenas após negociação concluída
- nota e comentário
- moderação dos comentários antes da publicação
- resposta da empresa avaliada
- exibição de reputação pública no perfil

### 7.9 Perfil público da empresa
O sistema deverá permitir:
- página pública da empresa
- exibição de identidade visual e detalhes públicos
- exibição de anúncios ativos
- exibição da reputação e comentários aprovados
- filtro de avaliações positivas, neutras e negativas
- botão de denunciar perfil/empresa

## 8. Regras de negócio principais

### 8.1 Anúncios
- todo anúncio deve ter composição obrigatória
- existem dois tipos de anúncio: oferta e necessidade

### 8.2 Oferta
- a empresa ofertante define se aceita troca na própria empresa ou não
- a empresa ofertante define se aceita apenas valor integral ou também parcial
- se aceitar parcial, a solicitante escolhe valor e composição desejada
- a decisão final de aceite é da ofertante

### 8.3 Necessidade
- a composição também é obrigatória
- a troca deve seguir a lógica de apenas dois locais possíveis: empresa A ou empresa B
- não haverá local neutro ou terceiro ponto no MVP

### 8.4 Local da troca
- a troca só pode acontecer na empresa ofertante ou na empresa solicitante
- se a ofertante não aceitar troca em sua própria empresa, ela deverá se deslocar até a solicitante

### 8.5 Saldo
- saldo só é reservado no aceite
- solicitação pendente não reserva saldo
- cancelamento devolve saldo ao anúncio se o anúncio ainda estiver ativo
- se o anúncio já estiver finalizado, não reabre automaticamente

### 8.6 Status do anúncio
- ativo: possui saldo disponível
- em negociação: todo o saldo já foi aceito e está em negociação
- concluído: operação encerrada e ambas as empresas avaliaram
- cancelado: encerrado pela empresa autora ou por regra administrativa
- expirado: perdeu a validade

## 9. Fluxos principais

### 9.1 Fluxo de oferta
1. empresa aprovada cria oferta
2. informa valor, composição e regras da oferta
3. anúncio fica visível
4. outra empresa envia solicitação estruturada
5. autora aceita ou recusa
6. no aceite, saldo é reservado
7. chat é liberado
8. negociação acontece
9. empresas concluem operação
10. ambas avaliam
11. reputação é atualizada

### 9.2 Fluxo de necessidade
1. empresa aprovada cria necessidade
2. informa valor e composição desejada
3. anúncio fica visível
4. empresa com troco disponível decide atender
5. informa proposta de local da troca dentro da regra dos dois locais possíveis
6. autora da necessidade aceita ou recusa
7. chat é liberado após aceite
8. negociação acontece
9. empresas concluem operação
10. ambas avaliam
11. reputação é atualizada

### 9.3 Fluxo de denúncia/moderação
1. empresa identifica problema
2. abre denúncia ou chama moderador
3. sistema abre ticket
4. moderação analisa histórico e conversa com as partes
5. moderador registra decisão/solução
6. caso é encerrado

## 10. Requisitos funcionais por módulo

### Módulo de autenticação e cadastro
- cadastrar empresa
- autenticar responsável
- validar contato
- permitir reenvio para análise

### Módulo administrativo
- aprovar empresa
- reprovar empresa
- informar inconsistências cadastrais
- visualizar denúncias
- atuar como moderador
- moderar comentários de avaliação

### Módulo de anúncios
- criar anúncio de oferta
- criar anúncio de necessidade
- listar anúncios ativos
- exibir saldo remanescente quando aplicável
- encerrar anúncio por status

### Módulo de solicitações
- criar solicitação
- cancelar solicitação pendente no prazo
- aceitar solicitação
- recusar solicitação
- coexistência de múltiplas pendências

### Módulo de chat
- abrir chat apenas após aceite
- manter histórico
- permitir entrada de moderador

### Módulo de reputação
- receber avaliação
- moderar comentário
- responder comentário
- exibir média e volume
- filtrar positivas, neutras e negativas

### Módulo de perfil público
- exibir foto e nome da empresa
- exibir detalhes públicos
- exibir verificações visíveis
- exibir anúncios ativos
- exibir reputação
- exibir botão de denunciar

## 11. Restrições do MVP

- não haverá processamento de pagamento
- não haverá custódia
- não haverá garantia de liquidação
- não haverá local neutro
- não haverá terceiro ponto de encontro
- não haverá status específico de disputa
- não haverá aprovação automática de empresa no MVP

## 12. Dependências operacionais

Para o MVP funcionar, será necessário:
- equipe/admin para aprovação manual de empresas
- equipe/admin para moderação de avaliações
- equipe/admin para mediação e tratamento de denúncias

## 13. Indicadores de validação do MVP

O MVP será considerado validado se empresas conseguirem:
- completar cadastro e aprovação
- publicar anúncios válidos
- enviar e receber solicitações
- concluir negociações reais dentro da plataforma
- utilizar avaliação e reputação como mecanismo de confiança
- acionar moderação quando necessário

## 14. Pontos deliberadamente em aberto

Permanecem em aberto:
- a lista exata de itens obrigatórios para declarar o MVP pronto
- o que fica para v1.1 ou versão posterior

## 15. Próximo nível de detalhamento após este PRD

Depois deste PRD, os próximos artefatos ideais são:
- regras de negócio detalhadas por entidade
- fluxos por tela
- backlog funcional
- modelo de dados
- regras de status e transições
- políticas administrativas
