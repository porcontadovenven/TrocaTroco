-- =============================================================================
-- TrocaTroco — Schema inicial do MVP
-- Bloco 2: enums → tabelas → constraints → índices
-- Fonte: Fase 4 (modelo relacional) + Fase 5 (enums obrigatórios)
-- Ordem de criação: Fase 5 — Matriz Operacional, seção 5
-- =============================================================================

-- =============================================================================
-- ENUMS OBRIGATÓRIOS (Fase 5, seção 6.2)
-- =============================================================================

CREATE TYPE papel_usuario AS ENUM (
  'usuario_empresa',
  'usuario_admin',
  'usuario_moderador',
  'usuario_admin_moderador'
);

CREATE TYPE status_empresa AS ENUM (
  'em_analise',
  'aprovada',
  'reprovada'
);

CREATE TYPE status_submissao_cadastral AS ENUM (
  'em_analise',
  'aprovada',
  'reprovada'
);

-- Usado em verificacoes_cadastrais (Fase 4, seção 2.4)
CREATE TYPE status_verificacao_cadastral AS ENUM (
  'pendente',
  'verificada',
  'rejeitada'
);

CREATE TYPE tipo_anuncio AS ENUM (
  'oferta',
  'necessidade'
);

CREATE TYPE status_anuncio AS ENUM (
  'ativo',
  'em_negociacao',
  'concluido',
  'cancelado',
  'expirado'
);

CREATE TYPE tipo_item_dinheiro AS ENUM (
  'cedula',
  'moeda'
);

CREATE TYPE status_solicitacao AS ENUM (
  'pendente',
  'aceita',
  'recusada',
  'cancelada',
  'expirada'
);

CREATE TYPE local_troca AS ENUM (
  'empresa_autora',
  'empresa_solicitante'
);

CREATE TYPE status_negociacao AS ENUM (
  'em_andamento',
  'operacao_encerrada',
  'finalizada',
  'cancelada'
);

CREATE TYPE status_moderacao_negociacao AS ENUM (
  'nao_acionada',
  'acionada',
  'em_acompanhamento',
  'encerrada'
);

CREATE TYPE tipo_ator_mensagem AS ENUM (
  'usuario_empresa',
  'usuario_admin',
  'usuario_moderador',
  'usuario_admin_moderador'
);

CREATE TYPE status_ticket_moderacao AS ENUM (
  'aberto',
  'em_analise',
  'encerrado'
);

CREATE TYPE tipo_origem_ticket_moderacao AS ENUM (
  'perfil_empresa',
  'administrativo',
  'outro_contexto'
);

CREATE TYPE status_comentario_avaliacao AS ENUM (
  'pendente_moderacao',
  'aprovado',
  'barrado'
);

-- =============================================================================
-- GRUPO 1 — Identidade e aprovação
-- Tabelas: empresas, usuarios, submissoes_cadastrais
-- =============================================================================

CREATE TABLE empresas (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  cnpj                  TEXT        NOT NULL,
  razao_social          TEXT        NOT NULL,
  nome_fantasia         TEXT,
  email                 TEXT        NOT NULL,
  telefone              TEXT        NOT NULL,
  endereco_linha        TEXT        NOT NULL,
  endereco_numero       TEXT,
  endereco_complemento  TEXT,
  bairro                TEXT,
  cidade                TEXT        NOT NULL,
  estado                TEXT        NOT NULL,
  cep                   TEXT,
  foto_perfil_url       TEXT,
  status                status_empresa NOT NULL DEFAULT 'em_analise',
  aprovada_em           TIMESTAMPTZ,
  reprovada_em          TIMESTAMPTZ,
  criada_em             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizada_em         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT empresas_cnpj_unico UNIQUE (cnpj)
);

CREATE TABLE usuarios (
  id                        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario_autenticacao   UUID        NOT NULL,
  papel                     papel_usuario NOT NULL,
  empresa_id                UUID        REFERENCES empresas (id),
  nome_completo             TEXT        NOT NULL,
  cpf                       TEXT,
  email                     TEXT        NOT NULL,
  telefone                  TEXT,
  cargo_funcao              TEXT,
  vinculo_empresa           TEXT,
  ativo                     BOOLEAN     NOT NULL DEFAULT true,
  criado_em                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT usuarios_auth_unico UNIQUE (id_usuario_autenticacao)
);

-- Regra: 1 usuário principal ativo por empresa (Fase 4, 4.4 + Fase 5, 6.3)
-- Implementada como partial unique index (após criação da tabela)

CREATE TABLE submissoes_cadastrais (
  id                        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id                UUID        NOT NULL REFERENCES empresas (id),
  numero_submissao          INTEGER     NOT NULL,
  status                    status_submissao_cadastral NOT NULL DEFAULT 'em_analise',
  dados_submetidos          JSONB       NOT NULL,
  motivo_reprovacao_codigo  TEXT,
  motivo_reprovacao_texto   TEXT,
  revisada_por_usuario_id   UUID        REFERENCES usuarios (id),
  enviada_em                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revisada_em               TIMESTAMPTZ,
  criada_em                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- GRUPO 2 — Anúncios
-- Tabelas: anuncios, itens_composicao_anuncio
-- =============================================================================

CREATE TABLE anuncios (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id            UUID        NOT NULL REFERENCES empresas (id),
  tipo                  tipo_anuncio NOT NULL,
  valor_total           NUMERIC     NOT NULL,
  valor_remanescente    NUMERIC     NOT NULL,
  permite_parcial       BOOLEAN     NOT NULL DEFAULT false,
  aceita_local_proprio  BOOLEAN,
  rotulo_regiao         TEXT,
  disponibilidade_texto TEXT,
  expira_em             TIMESTAMPTZ,
  status                status_anuncio NOT NULL DEFAULT 'ativo',
  criado_em             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  publicado_em          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancelado_em          TIMESTAMPTZ,
  concluido_em          TIMESTAMPTZ,
  CONSTRAINT anuncios_valor_total_positivo          CHECK (valor_total > 0),
  CONSTRAINT anuncios_valor_remanescente_nao_negativo CHECK (valor_remanescente >= 0)
);

CREATE TABLE itens_composicao_anuncio (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  anuncio_id      UUID    NOT NULL REFERENCES anuncios (id),
  tipo_item       tipo_item_dinheiro NOT NULL,
  valor_unitario  NUMERIC NOT NULL,
  quantidade      INTEGER NOT NULL,
  subtotal_valor  NUMERIC NOT NULL,
  ordem_exibicao  INTEGER,
  CONSTRAINT itens_composicao_anuncio_quantidade_positiva CHECK (quantidade > 0)
);

-- =============================================================================
-- GRUPO 3 — Solicitações
-- Tabelas: solicitacoes, itens_composicao_solicitacao
-- =============================================================================

CREATE TABLE solicitacoes (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  anuncio_id              UUID        NOT NULL REFERENCES anuncios (id),
  empresa_solicitante_id  UUID        NOT NULL REFERENCES empresas (id),
  valor_solicitado        NUMERIC     NOT NULL,
  parcial                 BOOLEAN     NOT NULL DEFAULT false,
  meio_pagamento          TEXT        NOT NULL,
  local_troca             local_troca NOT NULL,
  status                  status_solicitacao NOT NULL DEFAULT 'pendente',
  expira_em               TIMESTAMPTZ,
  prazo_cancelamento_em   TIMESTAMPTZ NOT NULL,
  aceita_em               TIMESTAMPTZ,
  recusada_em             TIMESTAMPTZ,
  cancelada_em            TIMESTAMPTZ,
  expirada_em             TIMESTAMPTZ,
  criada_em               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizada_em           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT solicitacoes_valor_positivo CHECK (valor_solicitado > 0)
);

CREATE TABLE itens_composicao_solicitacao (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitacao_id  UUID    NOT NULL REFERENCES solicitacoes (id),
  tipo_item       tipo_item_dinheiro NOT NULL,
  valor_unitario  NUMERIC NOT NULL,
  quantidade      INTEGER NOT NULL,
  subtotal_valor  NUMERIC NOT NULL,
  ordem_exibicao  INTEGER,
  CONSTRAINT itens_composicao_solicitacao_quantidade_positiva CHECK (quantidade > 0)
);

-- =============================================================================
-- GRUPO 4 — Negociação e chat
-- Tabelas: negociacoes, mensagens_negociacao
-- =============================================================================

CREATE TABLE negociacoes (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitacao_id          UUID        NOT NULL REFERENCES solicitacoes (id),
  anuncio_id              UUID        NOT NULL REFERENCES anuncios (id),
  empresa_autora_id       UUID        NOT NULL REFERENCES empresas (id),
  empresa_contraparte_id  UUID        NOT NULL REFERENCES empresas (id),
  valor_negociado         NUMERIC     NOT NULL,
  meio_pagamento          TEXT        NOT NULL,
  local_troca             local_troca NOT NULL,
  status                  status_negociacao NOT NULL DEFAULT 'em_andamento',
  status_moderacao        status_moderacao_negociacao NOT NULL DEFAULT 'nao_acionada',
  moderador_atual_id      UUID        REFERENCES usuarios (id),
  operacao_encerrada_em   TIMESTAMPTZ,
  finalizada_em           TIMESTAMPTZ,
  cancelada_em            TIMESTAMPTZ,
  criada_em               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizada_em           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Regra: 1 negociação por solicitação aceita (Fase 5, 6.3)
  CONSTRAINT negociacoes_solicitacao_unica UNIQUE (solicitacao_id)
);

CREATE TABLE mensagens_negociacao (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  negociacao_id    UUID        NOT NULL REFERENCES negociacoes (id),
  tipo_ator        tipo_ator_mensagem NOT NULL,
  ator_usuario_id  UUID        NOT NULL REFERENCES usuarios (id),
  texto_mensagem   TEXT        NOT NULL,
  criada_em        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- GRUPO 5 — Avaliação
-- Tabela: avaliacoes
-- =============================================================================

CREATE TABLE avaliacoes (
  id                        UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  negociacao_id             UUID      NOT NULL REFERENCES negociacoes (id),
  empresa_avaliadora_id     UUID      NOT NULL REFERENCES empresas (id),
  empresa_avaliada_id       UUID      NOT NULL REFERENCES empresas (id),
  nota                      SMALLINT  NOT NULL,
  texto_comentario          TEXT,
  status_comentario         status_comentario_avaliacao,
  moderado_por_usuario_id   UUID      REFERENCES usuarios (id),
  moderado_em               TIMESTAMPTZ,
  motivo_moderacao          TEXT,
  resposta_publica_texto    TEXT,
  resposta_publica_em       TIMESTAMPTZ,
  criada_em                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizada_em             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Regra: nota entre 1 e 5 (Fase 5, 6.3)
  CONSTRAINT avaliacoes_nota_valida CHECK (nota BETWEEN 1 AND 5),
  -- Regra: 1 avaliação por empresa avaliadora dentro da negociação (Fase 5, 6.3)
  CONSTRAINT avaliacoes_avaliadora_unica UNIQUE (negociacao_id, empresa_avaliadora_id)
);

-- =============================================================================
-- GRUPO 6 — Tickets externos
-- Tabelas: tickets_moderacao, eventos_ticket_moderacao
-- =============================================================================

CREATE TABLE tickets_moderacao (
  id                          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_origem                 tipo_origem_ticket_moderacao NOT NULL,
  origem_id                   UUID        NOT NULL,
  aberto_por_empresa_id       UUID        REFERENCES empresas (id),
  aberto_por_usuario_id       UUID        REFERENCES usuarios (id),
  atribuido_para_usuario_id   UUID        REFERENCES usuarios (id),
  assunto                     TEXT,
  tipo_motivo                 TEXT,
  descricao                   TEXT,
  status                      status_ticket_moderacao NOT NULL DEFAULT 'aberto',
  resumo_resolucao            TEXT,
  aberto_em                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  encerrado_em                TIMESTAMPTZ,
  criado_em                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE eventos_ticket_moderacao (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_moderacao_id   UUID        NOT NULL REFERENCES tickets_moderacao (id),
  ator_usuario_id       UUID        NOT NULL REFERENCES usuarios (id),
  tipo_evento           TEXT        NOT NULL,
  corpo_evento          TEXT,
  dados_evento          JSONB,
  criado_em             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- GRUPO 7 — Verificações cadastrais e timeline
-- Tabelas: verificacoes_cadastrais, eventos_timeline
-- =============================================================================

CREATE TABLE verificacoes_cadastrais (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id            UUID        NOT NULL REFERENCES empresas (id),
  tipo_verificacao      TEXT        NOT NULL,
  status_verificacao    status_verificacao_cadastral NOT NULL DEFAULT 'pendente',
  visivel_publicamente  BOOLEAN     NOT NULL DEFAULT false,
  observacao            TEXT,
  criada_em             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizada_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE eventos_timeline (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_entidade  TEXT        NOT NULL,
  entidade_id    UUID        NOT NULL,
  tipo_ator      TEXT        NOT NULL,
  ator_id        UUID        NOT NULL,
  tipo_evento    TEXT        NOT NULL,
  dados_evento   JSONB,
  publico        BOOLEAN     NOT NULL DEFAULT false,
  criado_em      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- ÍNDICES PRINCIPAIS (Fase 4, seção 4 + Fase 5, 6.3)
-- =============================================================================

-- Regra crítica: 1 usuário principal ativo por empresa (partial unique index)
CREATE UNIQUE INDEX usuarios_empresa_principal_unico
  ON usuarios (empresa_id)
  WHERE ativo = true
    AND papel = 'usuario_empresa'
    AND empresa_id IS NOT NULL;

-- anuncios
CREATE INDEX anuncios_empresa_status             ON anuncios (empresa_id, status);
CREATE INDEX anuncios_tipo_status                ON anuncios (tipo, status);

-- solicitacoes
CREATE INDEX solicitacoes_anuncio_status         ON solicitacoes (anuncio_id, status);
CREATE INDEX solicitacoes_empresa_solicitante    ON solicitacoes (empresa_solicitante_id, status);

-- negociacoes
CREATE INDEX negociacoes_empresa_autora_status   ON negociacoes (empresa_autora_id, status);
CREATE INDEX negociacoes_empresa_contraparte     ON negociacoes (empresa_contraparte_id, status);
CREATE INDEX negociacoes_status_moderacao        ON negociacoes (status_moderacao);

-- tickets
CREATE INDEX tickets_status_origem               ON tickets_moderacao (status, tipo_origem);

-- avaliacoes
CREATE INDEX avaliacoes_empresa_avaliada         ON avaliacoes (empresa_avaliada_id, status_comentario);

-- eventos_timeline
CREATE INDEX eventos_timeline_entidade           ON eventos_timeline (tipo_entidade, entidade_id);
