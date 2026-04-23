-- =============================================================================
-- Migration: restringe execucao do criador atomico de anuncio
-- =============================================================================

DO $$
BEGIN
  REVOKE EXECUTE ON FUNCTION public.criar_anuncio_atomico(
    public.tipo_anuncio,
    numeric,
    boolean,
    boolean,
    text,
    text,
    timestamptz,
    jsonb
  ) FROM PUBLIC;
  REVOKE EXECUTE ON FUNCTION public.criar_anuncio_atomico(
    public.tipo_anuncio,
    numeric,
    boolean,
    boolean,
    text,
    text,
    timestamptz,
    jsonb
  ) FROM anon;
  GRANT EXECUTE ON FUNCTION public.criar_anuncio_atomico(
    public.tipo_anuncio,
    numeric,
    boolean,
    boolean,
    text,
    text,
    timestamptz,
    jsonb
  ) TO authenticated;
  GRANT EXECUTE ON FUNCTION public.criar_anuncio_atomico(
    public.tipo_anuncio,
    numeric,
    boolean,
    boolean,
    text,
    text,
    timestamptz,
    jsonb
  ) TO service_role;
END;
$$;