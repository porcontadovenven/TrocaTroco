-- =============================================================================
-- Migration: corrige prazo de expiracao de solicitacoes
-- =============================================================================

-- Backfill para solicitacoes pendentes antigas que nao receberam expira_em.
UPDATE solicitacoes
SET
  expira_em = criada_em + INTERVAL '12 hours',
  atualizada_em = NOW()
WHERE status = 'pendente'
  AND expira_em IS NULL;

CREATE OR REPLACE FUNCTION expirar_solicitacoes_pendentes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE solicitacoes
  SET
    status = 'expirada',
    expirada_em = NOW(),
    atualizada_em = NOW()
  WHERE status = 'pendente'
    AND expira_em IS NOT NULL
    AND expira_em < NOW();
END;
$$;