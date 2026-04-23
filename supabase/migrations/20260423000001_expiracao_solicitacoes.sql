-- =============================================================================
-- Migration: expiração automática de solicitações
-- Aplica via: supabase db push
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Função que expira solicitações pendentes além da janela de expiração
CREATE OR REPLACE FUNCTION expirar_solicitacoes_pendentes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE solicitacoes
  SET status = 'expirada'
  WHERE status = 'pendente'
    AND expira_em IS NOT NULL
    AND expira_em < NOW();
END;
$$;

DO $$
DECLARE
  job_id bigint;
BEGIN
  SELECT jobid
  INTO job_id
  FROM cron.job
  WHERE jobname = 'expirar-solicitacoes-pendentes'
  LIMIT 1;

  IF job_id IS NOT NULL THEN
    PERFORM cron.unschedule(job_id);
  END IF;
END;
$$;

-- Cron job: executa a cada hora
SELECT cron.schedule(
  'expirar-solicitacoes-pendentes',  -- nome único do job
  '0 * * * *',                       -- toda hora no minuto 0
  'SELECT expirar_solicitacoes_pendentes()'
);
