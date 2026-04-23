-- =============================================================================
-- Migration: corrige referencia ambigua de anuncio_id no aceite atomico
-- =============================================================================

CREATE OR REPLACE FUNCTION public.aceitar_solicitacao_atomica(
  p_solicitacao_id uuid,
  p_empresa_autora_id uuid
)
RETURNS TABLE (
  negociacao_id uuid,
  anuncio_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  solicitacao_row public.solicitacoes%ROWTYPE;
  anuncio_row public.anuncios%ROWTYPE;
  empresa_autora_contexto uuid := public.app_empresa_id();
  nova_negociacao_id uuid;
  agora timestamptz := now();
BEGIN
  IF empresa_autora_contexto IS NULL THEN
    RAISE EXCEPTION 'Sessão inválida.';
  END IF;

  IF p_empresa_autora_id IS DISTINCT FROM empresa_autora_contexto THEN
    RAISE EXCEPTION 'Sem permissão para aceitar esta solicitação.';
  END IF;

  SELECT *
  INTO solicitacao_row
  FROM public.solicitacoes
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
  FROM public.anuncios
  WHERE id = solicitacao_row.anuncio_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Anúncio não encontrado.';
  END IF;

  IF anuncio_row.empresa_id <> empresa_autora_contexto THEN
    RAISE EXCEPTION 'Sem permissão para aceitar esta solicitação.';
  END IF;

  IF anuncio_row.status <> 'ativo' THEN
    RAISE EXCEPTION 'Este anúncio não está disponível.';
  END IF;

  IF anuncio_row.valor_remanescente < solicitacao_row.valor_solicitado THEN
    RAISE EXCEPTION 'Saldo remanescente insuficiente para aceitar esta solicitação.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.itens_composicao_solicitacao AS ics
    WHERE ics.solicitacao_id = solicitacao_row.id
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM public.itens_composicao_solicitacao AS ics
      LEFT JOIN public.itens_composicao_anuncio AS ica
        ON ica.id = ics.item_anuncio_id
       AND ica.anuncio_id = anuncio_row.id
      WHERE ics.solicitacao_id = solicitacao_row.id
        AND (
          ica.id IS NULL
          OR ics.quantidade > ica.quantidade
          OR ics.tipo_item IS DISTINCT FROM ica.tipo_item
          OR ics.valor_unitario IS DISTINCT FROM ica.valor_unitario
        )
    ) THEN
      RAISE EXCEPTION 'A composição remanescente do anúncio não atende mais esta solicitação.';
    END IF;

    WITH consumo_solicitacao AS (
      SELECT
        ics.item_anuncio_id,
        SUM(ics.quantidade) AS quantidade_consumida
      FROM public.itens_composicao_solicitacao AS ics
      WHERE ics.solicitacao_id = solicitacao_row.id
      GROUP BY ics.item_anuncio_id
    )
    UPDATE public.itens_composicao_anuncio AS ica
    SET
      quantidade = GREATEST(0, ica.quantidade - consumo_solicitacao.quantidade_consumida),
      subtotal_valor = GREATEST(0, (ica.quantidade - consumo_solicitacao.quantidade_consumida) * ica.valor_unitario)
    FROM consumo_solicitacao
    WHERE consumo_solicitacao.item_anuncio_id = ica.id
      AND ica.anuncio_id = anuncio_row.id;
  ELSIF anuncio_row.valor_remanescente = solicitacao_row.valor_solicitado THEN
    UPDATE public.itens_composicao_anuncio AS ica
    SET quantidade = 0,
        subtotal_valor = 0
    WHERE ica.anuncio_id = anuncio_row.id;
  END IF;

  UPDATE public.anuncios
  SET
    valor_remanescente = GREATEST(0, valor_remanescente - solicitacao_row.valor_solicitado),
    status = 'em_negociacao'::public.status_anuncio
  WHERE id = anuncio_row.id;

  INSERT INTO public.negociacoes (
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
    empresa_autora_contexto,
    solicitacao_row.empresa_solicitante_id,
    solicitacao_row.valor_solicitado,
    solicitacao_row.meio_pagamento,
    solicitacao_row.local_troca,
    'em_andamento'::public.status_negociacao,
    'nao_acionada'::public.status_moderacao_negociacao,
    agora,
    agora
  )
  RETURNING id INTO nova_negociacao_id;

  UPDATE public.solicitacoes
  SET
    status = 'aceita',
    aceita_em = agora,
    atualizada_em = agora
  WHERE id = solicitacao_row.id;

  RETURN QUERY SELECT nova_negociacao_id, anuncio_row.id;
END;
$$;