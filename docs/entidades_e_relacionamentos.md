# Fase 4 — Entidades e relacionamentos (final)

## 1. Visão geral
Este documento define as entidades principais do TrocaTroco, suas responsabilidades e seus relacionamentos lógicos no MVP.

---

## 2. Entidades principais

## 2.1 Empresa
Representa a organização cadastrada na plataforma.

### Responsabilidades
- armazenar identidade empresarial
- representar a contraparte nas operações
- centralizar anúncios, solicitações, negociações e reputação
- refletir o estado operacional atual da empresa

### Relacionamentos
- 1 empresa possui 1 usuário principal no MVP
- 1 empresa possui N submissões cadastrais
- 1 empresa possui N verificações
- 1 empresa publica N anúncios
- 1 empresa envia N solicitações
- 1 empresa participa de N negociações
- 1 empresa emite N avaliações
- 1 empresa recebe N avaliações

### Observação
`empresa.status` acompanha sempre a submissão vigente mais recente.

---

## 2.2 Usuario
Representa a pessoa que acessa a plataforma.

### Responsabilidades
- autenticação
- atuação como responsável principal da empresa
- atuação como admin ou moderador, quando aplicável

### Tipos principais
- usuario_empresa
- usuario_admin
- usuario_moderador
- usuario_admin_moderador

### Relacionamentos
- usuário de empresa pertence a 1 empresa
- usuário admin pode atuar em análises, moderação e tickets

### Regra estrutural
No MVP, cada empresa pode possuir apenas 1 usuário principal ativo.
Essa regra deve ser garantida na aplicação e reforçada no banco de dados.

---

## 2.3 Submissao cadastral
Representa uma tentativa formal de cadastro ou recadastro para análise.

### Responsabilidades
- registrar envio cadastral
- registrar versão ou submissão
- manter histórico de análise
- guardar motivo de reprovação, quando houver

### Relacionamentos
- N submissões pertencem a 1 empresa
- cada submissão pode ser analisada por 1 usuário admin ou moderação

### Observação
`submissao_cadastral.status` representa o estado daquela submissão específica.

---

## 2.4 Verificacao cadastral
Representa verificações administrativas da empresa.

### Responsabilidades
- registrar verificações como CNPJ confirmado
- apoiar aprovação administrativa
- fornecer indicadores públicos visíveis, quando permitido

### Relacionamentos
- N verificações pertencem a 1 empresa

---

## 2.5 Anuncio
Representa uma oferta de troco ou uma necessidade de troco.

### Responsabilidades
- publicar oportunidade operacional
- armazenar tipo, valor, disponibilidade e regras
- controlar remanescente
- receber solicitações

### Tipos
- oferta
- necessidade

### Relacionamentos
- N anúncios pertencem a 1 empresa
- 1 anúncio possui N itens de composição
- 1 anúncio recebe N solicitações
- 1 anúncio pode originar N negociações ao longo da sua vida útil

### Observações importantes
- necessidade também suporta parcial
- o anúncio só conclui quando não houver remanescente, não houver negociação pendente em aberto, a operação estiver encerrada e as duas avaliações obrigatórias da negociação final já tiverem sido enviadas

---

## 2.6 Item de composicao do anuncio
Representa uma linha da composição do anúncio.

### Responsabilidades
- detalhar cédulas ou moedas
- compor valor do anúncio

### Relacionamentos
- N itens de composição pertencem a 1 anúncio

---

## 2.7 Solicitacao
Representa a manifestação formal de interesse sobre um anúncio.

### Responsabilidades
- registrar pedido sobre anúncio
- registrar valor solicitado
- registrar composição solicitada, quando aplicável
- registrar meio de pagamento
- registrar local da troca
- suportar aceite, recusa, cancelamento e expiração

### Relacionamentos
- N solicitações pertencem a 1 anúncio
- 1 solicitação é enviada por 1 empresa
- 1 solicitação possui N itens de composição, quando houver
- 1 solicitação aceita gera 0 ou 1 negociação

### Observação importante
A empresa destinatária é derivada do anúncio e não precisa ser armazenada na solicitação.

---

## 2.8 Item de composicao da solicitacao
Representa uma linha da composição pedida ou oferecida na solicitação.

### Responsabilidades
- detalhar composição efetivamente desejada ou proposta
- suportar valor parcial

### Relacionamentos
- N itens pertencem a 1 solicitação

---

## 2.9 Negociacao
Representa a operação formal criada após o aceite da solicitação.

### Responsabilidades
- concentrar o acordo operacional
- armazenar valor negociado
- armazenar local da troca
- armazenar meio de pagamento
- concentrar o chat oficial
- suportar moderação no próprio contexto
- suportar encerramento operacional
- suportar avaliações obrigatórias

### Relacionamentos
- 1 negociação nasce de 1 solicitação aceita
- 1 negociação pertence a 1 anúncio de origem
- 1 negociação envolve 2 empresas
- 1 negociação possui N mensagens
- 1 negociação pode possuir até 2 avaliações

### Observações importantes
- negociação não gera ticket por padrão
- moderação interna da negociação é representada por `status_moderacao`
- ticket permanece para contextos externos

---

## 2.10 Mensagem da negociacao
Representa uma mensagem do chat oficial da negociação.

### Responsabilidades
- registrar comunicação oficial
- preservar histórico
- suportar análise administrativa

### Relacionamentos
- N mensagens pertencem a 1 negociação
- cada mensagem possui 1 ator de origem

### Atores possíveis
- usuário da empresa participante
- admin ou moderador

---

## 2.11 Ticket de moderacao
Representa um caso formal de denúncia ou moderação externo à negociação.

### Responsabilidades
- registrar denúncia externa
- vincular o caso ao contexto correto
- armazenar acompanhamento
- registrar resolução

### Possíveis origens
- perfil da empresa
- contexto administrativo
- outro contexto externo permitido

### Relacionamentos
- N tickets podem se relacionar a 1 empresa ou perfil
- 1 ticket possui N eventos internos

### Observação
Negociação não usa ticket como fluxo padrão de moderação.

---

## 2.12 Evento do ticket
Representa o histórico interno do ticket.

### Responsabilidades
- registrar abertura
- registrar andamento
- registrar decisões
- registrar encerramento

### Relacionamentos
- N eventos pertencem a 1 ticket

---

## 2.13 Avaliacao
Representa a avaliação de uma empresa sobre a outra após encerramento operacional da negociação.

### Responsabilidades
- armazenar nota
- armazenar comentário opcional
- controlar moderação do comentário, quando existir
- permitir resposta pública da empresa avaliada

### Relacionamentos
- N avaliações pertencem a 1 negociação
- 1 avaliação tem 1 empresa avaliadora
- 1 avaliação tem 1 empresa avaliada

### Regras importantes
- avaliação é obrigatória
- nota é obrigatória
- comentário é opcional
- se não houver comentário:
  - `texto_comentario = null`
  - `status_comentario = null`
- se houver comentário:
  - nasce `pendente_moderacao`
  - depois pode virar `aprovado` ou `barrado`

### Regra prática do MVP
Em uma negociação, pode haver no máximo:
- 1 avaliação da empresa A sobre a empresa B
- 1 avaliação da empresa B sobre a empresa A

---

## 2.14 Evento de timeline
Representa um evento transversal para auditoria e rastreabilidade.

### Responsabilidades
- registrar eventos relevantes
- suportar histórico operacional
- apoiar timeline interna do produto

### Exemplos
- cadastro enviado
- empresa aprovada
- anúncio publicado
- solicitação enviada
- solicitação aceita
- negociação encerrada operacionalmente
- avaliações concluídas
- ticket aberto
- avaliação enviada

---

## 3. Relacionamentos principais resumidos

### Empresa
- 1:N Submissao cadastral
- 1:N Verificacao cadastral
- 1:N Anuncio
- 1:N Solicitacao enviada
- 1:N Negociacao como participante
- 1:N Avaliacao recebida
- 1:N Avaliacao emitida

### Anuncio
- 1:N Item de composicao do anuncio
- 1:N Solicitacao
- 1:N Negociacao originada ao longo do tempo

### Solicitacao
- 1:N Item de composicao da solicitacao
- 0:1 Negociacao

### Negociacao
- 1:N Mensagem da negociacao
- 0:2 Avaliacao

### Ticket de moderacao
- 1:N Evento do ticket

---

## 4. Entidades derivadas ou projeções

Estas estruturas podem ser tratadas como projeção, e não necessariamente como entidades primárias do banco:

### Perfil publico da empresa
Derivado de:
- empresa
- verificações públicas
- avaliações públicas
- anúncios ativos

### Reputacao consolidada
Derivada de:
- média simples das notas
- volume total de avaliações
- comentários aprovados, quando existirem

### Indicadores operacionais
Derivados de:
- anúncios
- solicitações
- negociações
- tickets

---

## 5. Observação final
O objetivo deste documento é definir o mapa de entidades do MVP.
Campos físicos, tipos de dados e chaves concretas aparecem no documento de modelo relacional base.
