-- =============================================================================
-- Migration: aceite atomico de solicitacao
-- =============================================================================

CREATE OR REPLACE FUNCTION aceitar_solicitacao_atomica(
  p_solicitacao_id UUID,
  p_empresa_autora_id UUID
)
RETURNS TABLE (
  negociacao_id UUID,
  anuncio_id UUID
)
LANGUAGE plpgsql
AS $$
DECLARE
  solicitacao_row solicitacoes%ROWTYPE;
  anuncio_row anuncios%ROWTYPE;
  nova_negociacao_id UUID;
  agora TIMESTAMPTZ := NOW();
BEGIN
  SELECT *
  INTO solicitacao_row
  FROM solicitacoes
  WHERE id = p_solicitacao_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Solicitação não encontrada.';
  END IF;

  IF solicitacao_row.status <> 'pendente' THEN
    RAISE EXCEPTION 'Solicitação não está mais pendente.';
  END IF;

  SELECT *
  INTO anuncio_row
  FROM anuncios
  WHERE id = solicitacao_row.anuncio_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Anúncio não encontrado.';
  END IF;

  IF anuncio_row.empresa_id <> p_empresa_autora_id THEN
    RAISE EXCEPTION 'Sem permissão para aceitar esta solicitação.';
  END IF;

  IF anuncio_row.status <> 'ativo' THEN
    RAISE EXCEPTION 'Este anúncio não está disponível.';
  END IF;

  IF anuncio_row.valor_remanescente < solicitacao_row.valor_solicitado THEN
    RAISE EXCEPTION 'Saldo remanescente insuficiente para aceitar esta solicitação.';
  END IF;

  UPDATE anuncios
  SET
    valor_remanescente = GREATEST(0, valor_remanescente - solicitacao_row.valor_solicitado),
    status = 'em_negociacao'::status_anuncio
  WHERE id = anuncio_row.id;

  INSERT INTO negociacoes (
    solicitacao_id,
    anuncio_id,
    empresa_autora_id,
    empresa_contraparte_id,
    valor_negociado,
    meio_pagamento,
    local_troca,
    status,
    status_moderacao,
    criada_em,
    atualizada_em
  )
  VALUES (
    solicitacao_row.id,
    anuncio_row.id,
    anuncio_row.empresa_id,
    solicitacao_row.empresa_solicitante_id,
    solicitacao_row.valor_solicitado,
    solicitacao_row.meio_pagamento,
    solicitacao_row.local_troca,
    'em_andamento'::status_negociacao,
    'nao_acionada'::status_moderacao_negociacao,
    agora,
    agora
  )
  RETURNING id INTO nova_negociacao_id;

  UPDATE solicitacoes
  SET
    status = 'aceita',
    aceita_em = agora,
    atualizada_em = agora
  WHERE id = solicitacao_row.id;

  RETURN QUERY SELECT nova_negociacao_id, anuncio_row.id;
END;
$$;