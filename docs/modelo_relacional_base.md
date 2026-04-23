# Fase 4 — Modelo relacional base do MVP (final)

## 1. Objetivo
Propor uma estrutura relacional base para o MVP do TrocaTroco, compatível com uma implementação inicial em banco relacional.

Esta proposta é lógica e baseia-se em PostgreSQL ou Supabase como referência de organização.

---

## 2. Tabelas principais

## 2.1 empresas
Representa a empresa.

### Campos sugeridos
- id (uuid, pk)
- cnpj (text, unico)
- razao_social (text)
- nome_fantasia (text, opcional)
- email (text)
- telefone (text)
- endereco_linha (text)
- endereco_numero (text, opcional)
- endereco_complemento (text, opcional)
- bairro (text, opcional)
- cidade (text)
- estado (text)
- cep (text, opcional)
- foto_perfil_url (text, opcional)
- status (enum: em_analise, aprovada, reprovada)
- aprovada_em (timestamp, opcional)
- reprovada_em (timestamp, opcional)
- criada_em (timestamp)
- atualizada_em (timestamp)

### Observação
`empresas.status` representa o estado operacional atual e acompanha a submissão vigente mais recente.

---

## 2.2 usuarios
Representa o usuário da plataforma.

### Campos sugeridos
- id (uuid, pk)
- id_usuario_autenticacao (uuid, vínculo com auth)
- papel (enum: usuario_empresa, usuario_admin, usuario_moderador, usuario_admin_moderador)
- empresa_id (uuid, fk empresas, opcional para admin)
- nome_completo (text)
- cpf (text, opcional para admin)
- email (text)
- telefone (text, opcional)
- cargo_funcao (text, opcional)
- vinculo_empresa (text, opcional)
- ativo (boolean)
- criado_em (timestamp)
- atualizado_em (timestamp)

### Regra do MVP
- no caso de empresa, haverá 1 usuário principal por empresa

### Constraint recomendada
- garantir apenas 1 usuário principal ativo por empresa
- essa regra deve existir na aplicação e ser reforçada no banco de dados, por exemplo com unicidade parcial compatível com o schema físico adotado

---

## 2.3 submissoes_cadastrais
Representa cada submissão cadastral enviada para análise.

### Campos sugeridos
- id (uuid, pk)
- empresa_id (uuid, fk empresas)
- numero_submissao (integer)
- status (enum: em_analise, aprovada, reprovada)
- dados_submetidos (jsonb)
- motivo_reprovacao_codigo (text, opcional)
- motivo_reprovacao_texto (text, opcional)
- revisada_por_usuario_id (uuid, fk usuarios, opcional)
- enviada_em (timestamp)
- revisada_em (timestamp, opcional)
- criada_em (timestamp)

### Observação
- esta tabela preserva o histórico
- `status` aqui representa a submissão específica, não a empresa inteira

---

## 2.4 verificacoes_cadastrais
Representa verificações cadastrais e indicadores públicos.

### Campos sugeridos
- id (uuid, pk)
- empresa_id (uuid, fk empresas)
- tipo_verificacao (text)
- status_verificacao (enum: pendente, verificada, rejeitada)
- visivel_publicamente (boolean)
- observacao (text, opcional)
- criada_em (timestamp)
- atualizada_em (timestamp)

---

## 2.5 anuncios
Representa anúncio de oferta ou necessidade.

### Campos sugeridos
- id (uuid, pk)
- empresa_id (uuid, fk empresas)
- tipo (enum: oferta, necessidade)
- valor_total (numeric)
- valor_remanescente (numeric)
- permite_parcial (boolean)
- aceita_local_proprio (boolean, opcional, relevante principalmente para oferta)
- rotulo_regiao (text, opcional)
- disponibilidade_texto (text, opcional)
- expira_em (timestamp, opcional)
- status (enum: ativo, em_negociacao, concluido, cancelado, expirado)
- criado_em (timestamp)
- publicado_em (timestamp)
- cancelado_em (timestamp, opcional)
- concluido_em (timestamp, opcional)

### Observações
- `valor_remanescente` deve refletir a disponibilidade remanescente
- `permite_parcial` serve tanto para oferta quanto para necessidade
- o anúncio só conclui quando não houver valor remanescente, não houver negociação pendente em aberto, a operação estiver encerrada e as duas avaliações obrigatórias da negociação final já tiverem sido enviadas

---

## 2.6 itens_composicao_anuncio
Representa a composição do anúncio.

### Campos sugeridos
- id (uuid, pk)
- anuncio_id (uuid, fk anuncios)
- tipo_item (enum: cedula, moeda)
- valor_unitario (numeric)
- quantidade (integer)
- subtotal_valor (numeric)
- ordem_exibicao (integer, opcional)

---

## 2.7 solicitacoes
Representa a solicitação formal sobre um anúncio.

### Campos sugeridos
- id (uuid, pk)
- anuncio_id (uuid, fk anuncios)
- empresa_solicitante_id (uuid, fk empresas)
- valor_solicitado (numeric)
- parcial (boolean)
- meio_pagamento (text ou enum)
- local_troca (enum: empresa_autora, empresa_solicitante)
- status (enum: pendente, aceita, recusada, cancelada, expirada)
- expira_em (timestamp, opcional)
- prazo_cancelamento_em (timestamp)
- aceita_em (timestamp, opcional)
- recusada_em (timestamp, opcional)
- cancelada_em (timestamp, opcional)
- expirada_em (timestamp, opcional)
- criada_em (timestamp)
- atualizada_em (timestamp)

### Observações
- `empresa_destinataria_id` não é necessária
- a empresa autora do anúncio é derivada por `anuncio_id`

---

## 2.8 itens_composicao_solicitacao
Representa a composição solicitada ou proposta na solicitação.

### Campos sugeridos
- id (uuid, pk)
- solicitacao_id (uuid, fk solicitacoes)
- tipo_item (enum: cedula, moeda)
- valor_unitario (numeric)
- quantidade (integer)
- subtotal_valor (numeric)
- ordem_exibicao (integer, opcional)

---

## 2.9 negociacoes
Representa a negociação criada após aceite.

### Campos sugeridos
- id (uuid, pk)
- solicitacao_id (uuid, fk solicitacoes, unique)
- anuncio_id (uuid, fk anuncios)
- empresa_autora_id (uuid, fk empresas)
- empresa_contraparte_id (uuid, fk empresas)
- valor_negociado (numeric)
- meio_pagamento (text ou enum)
- local_troca (enum: empresa_autora, empresa_solicitante)
- status (enum: em_andamento, operacao_encerrada, finalizada, cancelada)
- status_moderacao (enum: nao_acionada, acionada, em_acompanhamento, encerrada)
- moderador_atual_id (uuid, fk usuarios, opcional)
- operacao_encerrada_em (timestamp, opcional)
- finalizada_em (timestamp, opcional)
- cancelada_em (timestamp, opcional)
- criada_em (timestamp)
- atualizada_em (timestamp)

### Observações
- a moderação da negociação ocorre no próprio chat ou contexto da negociação
- não existe ticket obrigatório para o fluxo padrão da negociação

---

## 2.10 mensagens_negociacao
Representa as mensagens do chat oficial.

### Campos sugeridos
- id (uuid, pk)
- negociacao_id (uuid, fk negociacoes)
- tipo_ator (enum: usuario_empresa, usuario_admin, usuario_moderador, usuario_admin_moderador)
- ator_usuario_id (uuid, fk usuarios)
- texto_mensagem (text)
- criada_em (timestamp)

---

## 2.11 tickets_moderacao
Representa tickets de denúncia ou moderação externos à negociação.

### Campos sugeridos
- id (uuid, pk)
- tipo_origem (enum: perfil_empresa, administrativo, outro_contexto)
- origem_id (uuid)
- aberto_por_empresa_id (uuid, fk empresas, opcional)
- aberto_por_usuario_id (uuid, fk usuarios, opcional)
- atribuido_para_usuario_id (uuid, fk usuarios, opcional)
- assunto (text, opcional)
- tipo_motivo (text, opcional)
- descricao (text, opcional)
- status (enum: aberto, em_analise, encerrado)
- resumo_resolucao (text, opcional)
- aberto_em (timestamp)
- encerrado_em (timestamp, opcional)
- criado_em (timestamp)
- atualizado_em (timestamp)

---

## 2.12 eventos_ticket_moderacao
Representa o histórico do ticket.

### Campos sugeridos
- id (uuid, pk)
- ticket_moderacao_id (uuid, fk tickets_moderacao)
- ator_usuario_id (uuid, fk usuarios)
- tipo_evento (text)
- corpo_evento (text, opcional)
- dados_evento (jsonb, opcional)
- criado_em (timestamp)

---

## 2.13 avaliacoes
Representa a avaliação entre empresas.

### Campos sugeridos
- id (uuid, pk)
- negociacao_id (uuid, fk negociacoes)
- empresa_avaliadora_id (uuid, fk empresas)
- empresa_avaliada_id (uuid, fk empresas)
- nota (smallint)
- texto_comentario (text, opcional)
- status_comentario (enum: pendente_moderacao, aprovado, barrado, opcional)
- moderado_por_usuario_id (uuid, fk usuarios, opcional)
- moderado_em (timestamp, opcional)
- motivo_moderacao (text, opcional)
- resposta_publica_texto (text, opcional)
- resposta_publica_em (timestamp, opcional)
- criada_em (timestamp)
- atualizada_em (timestamp)

### Regras importantes
- nota é obrigatória
- comentário é opcional
- se não houver comentário:
  - `texto_comentario = null`
  - `status_comentario = null`
- se houver comentário:
  - começa em `pendente_moderacao`
  - depois pode virar `aprovado` ou `barrado`

### Constraint recomendada
- unique (negociacao_id, empresa_avaliadora_id)

---

## 2.14 eventos_timeline
Representa rastreabilidade transversal.

### Campos sugeridos
- id (uuid, pk)
- tipo_entidade (text)
- entidade_id (uuid)
- tipo_ator (text)
- ator_id (uuid)
- tipo_evento (text)
- dados_evento (jsonb, opcional)
- publico (boolean default false)
- criado_em (timestamp)

---

## 3. Relacionamentos resumidos

### empresas
- 1:N submissoes_cadastrais
- 1:N verificacoes_cadastrais
- 1:N anuncios
- 1:N solicitacoes como solicitante
- 1:N negociacoes como autora
- 1:N negociacoes como contraparte
- 1:N avaliacoes como avaliadora
- 1:N avaliacoes como avaliada

### anuncios
- 1:N itens_composicao_anuncio
- 1:N solicitacoes

### solicitacoes
- 1:N itens_composicao_solicitacao
- 0:1 negociacoes

### negociacoes
- 1:N mensagens_negociacao
- 0:2 avaliacoes

### tickets_moderacao
- 1:N eventos_ticket_moderacao

---

## 4. Indices e constraints recomendados

### Unicidade
- empresas.cnpj unique
- usuarios.id_usuario_autenticacao unique
- negociacoes.solicitacao_id unique
- avaliacoes (negociacao_id, empresa_avaliadora_id) unique

### Indices úteis
- anuncios (empresa_id, status)
- anuncios (tipo, status)
- solicitacoes (anuncio_id, status)
- solicitacoes (empresa_solicitante_id, status)
- negociacoes (empresa_autora_id, status)
- negociacoes (empresa_contraparte_id, status)
- negociacoes (status_moderacao)
- tickets_moderacao (status, tipo_origem)
- avaliacoes (empresa_avaliada_id, status_comentario)

### Checks recomendados
- nota entre 1 e 5
- valor_solicitado > 0
- valor_total > 0
- valor_remanescente >= 0
- quantidade > 0

---

## 5. Calculos e projeções

### Perfil publico
Pode ser derivado de:
- empresas
- verificacoes_cadastrais visíveis
- avaliacoes publicadas
- anuncios ativos

### Reputacao
Pode ser calculada por:
- average(nota)
- count(avaliacoes)

### Regra importante
- a nota entra na reputação assim que a avaliação é enviada
- o comentário só entra na camada pública após moderação

### Dashboard
Pode ser alimentado por agregações sobre:
- anúncios por status
- solicitações por status
- negociações por status

---

## 6. Observação final
Este documento propõe um modelo relacional base do MVP.
A implementação real pode ajustar nomes, tipos e normalização fina, desde que preserve:
- os estados definidos
- as regras de consistência
- os relacionamentos centrais do domínio
