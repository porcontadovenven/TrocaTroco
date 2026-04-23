-- =============================================================================
-- Migration: ajusta frequencia do cron de expiracao de solicitacoes
-- =============================================================================

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

SELECT cron.schedule(
  'expirar-solicitacoes-pendentes',
  '* * * * *',
  'SELECT expirar_solicitacoes_pendentes()'
);