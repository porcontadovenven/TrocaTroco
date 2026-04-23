-- =============================================================================
-- Migration: slug público de empresa
-- Aplica via: supabase db push
-- =============================================================================

ALTER TABLE empresas
ADD COLUMN IF NOT EXISTS slug_publico TEXT;

CREATE OR REPLACE FUNCTION slugify_empresa_nome(texto TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  normalizado TEXT;
BEGIN
  normalizado := lower(trim(coalesce(texto, '')));
  normalizado := translate(
    normalizado,
    'áàãâäéèêëíìîïóòõôöúùûüçñ',
    'aaaaaeeeeiiiiooooouuuucn'
  );
  normalizado := regexp_replace(normalizado, '[^a-z0-9]+', '-', 'g');
  normalizado := regexp_replace(normalizado, '(^-|-$)', '', 'g');

  IF normalizado = '' THEN
    RETURN 'empresa';
  END IF;

  RETURN normalizado;
END;
$$;

CREATE OR REPLACE FUNCTION definir_slug_publico_empresa()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  slug_base TEXT;
  slug_candidato TEXT;
  contador INTEGER := 1;
BEGIN
  IF TG_OP = 'UPDATE'
     AND NEW.razao_social IS NOT DISTINCT FROM OLD.razao_social
     AND NEW.slug_publico IS NOT NULL THEN
    RETURN NEW;
  END IF;

  slug_base := slugify_empresa_nome(NEW.razao_social);
  slug_candidato := slug_base;

  WHILE EXISTS (
    SELECT 1
    FROM empresas
    WHERE slug_publico = slug_candidato
      AND id <> NEW.id
  ) LOOP
    slug_candidato := slug_base || '-' || contador;
    contador := contador + 1;
  END LOOP;

  NEW.slug_publico := slug_candidato;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_empresas_slug_publico ON empresas;

CREATE TRIGGER trg_empresas_slug_publico
BEFORE INSERT OR UPDATE OF razao_social, slug_publico ON empresas
FOR EACH ROW
EXECUTE FUNCTION definir_slug_publico_empresa();

UPDATE empresas
SET slug_publico = NULL;

UPDATE empresas
SET razao_social = razao_social
WHERE slug_publico IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS empresas_slug_publico_unico
ON empresas (slug_publico);

ALTER TABLE empresas
ALTER COLUMN slug_publico SET NOT NULL;