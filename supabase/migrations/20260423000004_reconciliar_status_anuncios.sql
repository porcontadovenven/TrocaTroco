-- =============================================================================
-- Migration: reconciliar status de anuncios com remanescente e negociacoes
-- Aplica via: supabase db push
-- =============================================================================

WITH resumo_anuncios AS (
  SELECT
    a.id,
    COALESCE(a.valor_remanescente, 0) AS valor_remanescente,
    EXISTS (
      SELECT 1
      FROM negociacoes n
      WHERE n.anuncio_id = a.id
        AND n.status IN ('em_andamento', 'operacao_encerrada')
    ) AS possui_negociacoes_abertas
  FROM anuncios a
  WHERE a.status NOT IN ('cancelado', 'expirado')
)
UPDATE anuncios a
SET
  status = CASE
    WHEN r.valor_remanescente <= 0 AND NOT r.possui_negociacoes_abertas THEN 'concluido'::status_anuncio
    WHEN r.possui_negociacoes_abertas THEN 'em_negociacao'::status_anuncio
    ELSE 'ativo'::status_anuncio
  END,
  concluido_em = CASE
    WHEN r.valor_remanescente <= 0 AND NOT r.possui_negociacoes_abertas THEN COALESCE(a.concluido_em, NOW())
    ELSE NULL
  END
FROM resumo_anuncios r
WHERE a.id = r.id;