-- =============================================================================
-- Migration: hardening do aceite atomico de solicitacao sob RLS
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