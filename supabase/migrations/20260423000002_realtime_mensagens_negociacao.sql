-- =============================================================================
-- Migration: habilita Realtime para mensagens da negociação
-- Aplica via: supabase db push
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'mensagens_negociacao'
  ) THEN
    ALTER PUBLICATION supabase_realtime
    ADD TABLE public.mensagens_negociacao;
  END IF;
END;
$$;