-- =============================================================================
-- Migration: habilita Realtime para fluxos operacionais da area autenticada
-- Aplica via: supabase db push
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'anuncios'
  ) THEN
    ALTER PUBLICATION supabase_realtime
    ADD TABLE public.anuncios;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'solicitacoes'
  ) THEN
    ALTER PUBLICATION supabase_realtime
    ADD TABLE public.solicitacoes;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'negociacoes'
  ) THEN
    ALTER PUBLICATION supabase_realtime
    ADD TABLE public.negociacoes;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'avaliacoes'
  ) THEN
    ALTER PUBLICATION supabase_realtime
    ADD TABLE public.avaliacoes;
  END IF;
END;
$$;