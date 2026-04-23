-- =============================================================================
-- Migration: restringe execucao da abertura atomica de ticket
-- =============================================================================

DO $$
BEGIN
  REVOKE EXECUTE ON FUNCTION public.abrir_ticket_atomico(
    public.tipo_origem_ticket_moderacao,
    uuid,
    text,
    text
  ) FROM PUBLIC;
  REVOKE EXECUTE ON FUNCTION public.abrir_ticket_atomico(
    public.tipo_origem_ticket_moderacao,
    uuid,
    text,
    text
  ) FROM anon;
  GRANT EXECUTE ON FUNCTION public.abrir_ticket_atomico(
    public.tipo_origem_ticket_moderacao,
    uuid,
    text,
    text
  ) TO authenticated;
  GRANT EXECUTE ON FUNCTION public.abrir_ticket_atomico(
    public.tipo_origem_ticket_moderacao,
    uuid,
    text,
    text
  ) TO service_role;
END;
$$;