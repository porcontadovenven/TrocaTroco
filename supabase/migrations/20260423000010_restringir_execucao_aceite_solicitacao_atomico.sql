-- =============================================================================
-- Migration: restringe execucao do aceite atomico de solicitacao
-- =============================================================================

DO $$
BEGIN
	REVOKE EXECUTE ON FUNCTION public.aceitar_solicitacao_atomica(uuid, uuid) FROM PUBLIC;
	REVOKE EXECUTE ON FUNCTION public.aceitar_solicitacao_atomica(uuid, uuid) FROM anon;
	GRANT EXECUTE ON FUNCTION public.aceitar_solicitacao_atomica(uuid, uuid) TO authenticated;
	GRANT EXECUTE ON FUNCTION public.aceitar_solicitacao_atomica(uuid, uuid) TO service_role;
END;
$$;