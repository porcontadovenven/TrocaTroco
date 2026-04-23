-- =============================================================================
-- Migration: cria abertura atomica de ticket sob RLS
-- =============================================================================

CREATE OR REPLACE FUNCTION public.abrir_ticket_atomico(
  p_tipo_origem public.tipo_origem_ticket_moderacao,
  p_origem_id uuid,
  p_assunto text,
  p_descricao text
)
RETURNS TABLE (
  ticket_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  empresa_contexto uuid := public.app_empresa_id();
  usuario_contexto uuid := public.app_usuario_id();
  novo_ticket_id uuid;
  assunto_normalizado text := nullif(btrim(p_assunto), '');
  descricao_normalizada text := nullif(btrim(p_descricao), '');
  agora timestamptz := now();
BEGIN
  IF empresa_contexto IS NULL OR usuario_contexto IS NULL THEN
    RAISE EXCEPTION 'Sessão inválida.';
  END IF;

  IF p_origem_id IS NULL THEN
    RAISE EXCEPTION 'Referência inválida.';
  END IF;

  IF assunto_normalizado IS NULL THEN
    RAISE EXCEPTION 'Informe o assunto.';
  END IF;

  IF char_length(assunto_normalizado) > 200 THEN
    RAISE EXCEPTION 'Assunto deve ter no máximo 200 caracteres.';
  END IF;

  IF descricao_normalizada IS NULL THEN
    RAISE EXCEPTION 'Descreva o problema.';
  END IF;

  IF char_length(descricao_normalizada) > 3000 THEN
    RAISE EXCEPTION 'Descrição deve ter no máximo 3000 caracteres.';
  END IF;

  IF p_tipo_origem = 'perfil_empresa'::public.tipo_origem_ticket_moderacao
    AND NOT EXISTS (
      SELECT 1
      FROM public.empresas
      WHERE id = p_origem_id
    ) THEN
    RAISE EXCEPTION 'Empresa denunciada não encontrada.';
  END IF;

  INSERT INTO public.tickets_moderacao (
    tipo_origem,
    origem_id,
    aberto_por_empresa_id,
    aberto_por_usuario_id,
    assunto,
    descricao,
    status,
    aberto_em,
    criado_em,
    atualizado_em
  )
  VALUES (
    p_tipo_origem,
    p_origem_id,
    empresa_contexto,
    usuario_contexto,
    assunto_normalizado,
    descricao_normalizada,
    'aberto'::public.status_ticket_moderacao,
    agora,
    agora,
    agora
  )
  RETURNING id INTO novo_ticket_id;

  INSERT INTO public.eventos_ticket_moderacao (
    ticket_moderacao_id,
    ator_usuario_id,
    tipo_evento,
    corpo_evento,
    criado_em
  )
  VALUES (
    novo_ticket_id,
    usuario_contexto,
    'abertura',
    descricao_normalizada,
    agora
  );

  RETURN QUERY SELECT novo_ticket_id;
END;
$$;