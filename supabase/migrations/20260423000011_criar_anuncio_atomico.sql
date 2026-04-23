-- =============================================================================
-- Migration: cria anuncio de forma atomica sob RLS
-- =============================================================================

CREATE OR REPLACE FUNCTION public.criar_anuncio_atomico(
  p_tipo public.tipo_anuncio,
  p_valor_total numeric,
  p_permite_parcial boolean,
  p_aceita_local_proprio boolean,
  p_rotulo_regiao text,
  p_disponibilidade_texto text,
  p_expira_em timestamptz,
  p_itens jsonb
)
RETURNS TABLE (
  anuncio_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  empresa_contexto uuid := public.app_empresa_id();
  novo_anuncio_id uuid;
  item jsonb;
  item_tipo public.tipo_item_dinheiro;
  item_valor_unitario numeric;
  item_quantidade integer;
  soma_itens numeric := 0;
  ordem integer := 0;
BEGIN
  IF empresa_contexto IS NULL THEN
    RAISE EXCEPTION 'Sessão inválida.';
  END IF;

  IF NOT public.app_empresa_aprovada(empresa_contexto) THEN
    RAISE EXCEPTION 'Apenas empresas aprovadas podem criar anúncios.';
  END IF;

  IF p_valor_total IS NULL OR p_valor_total <= 0 THEN
    RAISE EXCEPTION 'Valor total deve ser maior que zero.';
  END IF;

  IF p_rotulo_regiao IS NOT NULL AND char_length(p_rotulo_regiao) > 200 THEN
    RAISE EXCEPTION 'Rótulo de região muito longo (máximo 200 caracteres).';
  END IF;

  IF p_disponibilidade_texto IS NOT NULL AND char_length(p_disponibilidade_texto) > 500 THEN
    RAISE EXCEPTION 'Disponibilidade muito longa (máximo 500 caracteres).';
  END IF;

  IF p_itens IS NULL OR jsonb_typeof(p_itens) <> 'array' OR jsonb_array_length(p_itens) = 0 THEN
    RAISE EXCEPTION 'Informe ao menos um item de composição.';
  END IF;

  FOR item IN SELECT value FROM jsonb_array_elements(p_itens)
  LOOP
    ordem := ordem + 1;
    item_tipo := (item ->> 'tipo_item')::public.tipo_item_dinheiro;
    item_valor_unitario := (item ->> 'valor_unitario')::numeric;
    item_quantidade := (item ->> 'quantidade')::integer;

    IF item_valor_unitario IS NULL OR item_valor_unitario <= 0 THEN
      RAISE EXCEPTION 'Valor unitário inválido na composição.';
    END IF;

    IF item_quantidade IS NULL OR item_quantidade <= 0 THEN
      RAISE EXCEPTION 'Quantidade inválida na composição.';
    END IF;

    soma_itens := soma_itens + (item_valor_unitario * item_quantidade);
  END LOOP;

  IF abs(soma_itens - p_valor_total) > 0.01 THEN
    RAISE EXCEPTION 'A soma dos itens não corresponde ao valor total informado.';
  END IF;

  INSERT INTO public.anuncios (
    empresa_id,
    tipo,
    valor_total,
    valor_remanescente,
    permite_parcial,
    aceita_local_proprio,
    rotulo_regiao,
    disponibilidade_texto,
    expira_em,
    status
  )
  VALUES (
    empresa_contexto,
    p_tipo,
    p_valor_total,
    p_valor_total,
    coalesce(p_permite_parcial, false),
    CASE
      WHEN p_tipo = 'oferta'::public.tipo_anuncio THEN p_aceita_local_proprio
      ELSE NULL
    END,
    nullif(p_rotulo_regiao, ''),
    nullif(p_disponibilidade_texto, ''),
    p_expira_em,
    'ativo'::public.status_anuncio
  )
  RETURNING id INTO novo_anuncio_id;

  ordem := 0;

  FOR item IN SELECT value FROM jsonb_array_elements(p_itens)
  LOOP
    ordem := ordem + 1;
    item_tipo := (item ->> 'tipo_item')::public.tipo_item_dinheiro;
    item_valor_unitario := (item ->> 'valor_unitario')::numeric;
    item_quantidade := (item ->> 'quantidade')::integer;

    INSERT INTO public.itens_composicao_anuncio (
      anuncio_id,
      tipo_item,
      valor_unitario,
      quantidade,
      subtotal_valor,
      ordem_exibicao
    )
    VALUES (
      novo_anuncio_id,
      item_tipo,
      item_valor_unitario,
      item_quantidade,
      item_valor_unitario * item_quantidade,
      ordem
    );
  END LOOP;

  RETURN QUERY SELECT novo_anuncio_id;
END;
$$;