-- =============================================================================
-- Migration: habilita RLS e policies iniciais do MVP
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Helpers de contexto do usuário autenticado
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.app_usuario_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT u.id
  FROM public.usuarios u
  WHERE u.id_usuario_autenticacao = auth.uid()
    AND u.ativo = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.app_empresa_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT u.empresa_id
  FROM public.usuarios u
  WHERE u.id_usuario_autenticacao = auth.uid()
    AND u.ativo = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.app_papel_usuario()
RETURNS papel_usuario
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT u.papel
  FROM public.usuarios u
  WHERE u.id_usuario_autenticacao = auth.uid()
    AND u.ativo = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.app_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT coalesce(
    public.app_papel_usuario() IN (
      'usuario_admin'::papel_usuario,
      'usuario_moderador'::papel_usuario,
      'usuario_admin_moderador'::papel_usuario
    ),
    false
  );
$$;

CREATE OR REPLACE FUNCTION public.app_empresa_aprovada(p_empresa_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.empresas e
    WHERE e.id = p_empresa_id
      AND e.status = 'aprovada'
  );
$$;

CREATE OR REPLACE FUNCTION public.app_pode_ver_anuncio(p_anuncio_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.anuncios a
    WHERE a.id = p_anuncio_id
      AND (
        public.app_is_admin()
        OR a.empresa_id = public.app_empresa_id()
        OR a.status IN ('ativo', 'em_negociacao')
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.app_pode_ver_solicitacao(p_solicitacao_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.solicitacoes s
    JOIN public.anuncios a ON a.id = s.anuncio_id
    WHERE s.id = p_solicitacao_id
      AND (
        public.app_is_admin()
        OR s.empresa_solicitante_id = public.app_empresa_id()
        OR a.empresa_id = public.app_empresa_id()
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.app_pode_ver_negociacao(p_negociacao_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.negociacoes n
    WHERE n.id = p_negociacao_id
      AND (
        public.app_is_admin()
        OR n.empresa_autora_id = public.app_empresa_id()
        OR n.empresa_contraparte_id = public.app_empresa_id()
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.app_pode_ver_ticket(p_ticket_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tickets_moderacao t
    WHERE t.id = p_ticket_id
      AND (
        public.app_is_admin()
        OR t.aberto_por_empresa_id = public.app_empresa_id()
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.app_pode_ver_usuario(p_usuario_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT (
    public.app_is_admin()
    OR p_usuario_id = public.app_usuario_id()
    OR EXISTS (
      SELECT 1
      FROM public.mensagens_negociacao mn
      JOIN public.negociacoes n ON n.id = mn.negociacao_id
      WHERE mn.ator_usuario_id = p_usuario_id
        AND public.app_pode_ver_negociacao(n.id)
    )
    OR EXISTS (
      SELECT 1
      FROM public.eventos_ticket_moderacao ev
      JOIN public.tickets_moderacao t ON t.id = ev.ticket_moderacao_id
      WHERE ev.ator_usuario_id = p_usuario_id
        AND public.app_pode_ver_ticket(t.id)
    )
  );
$$;

-- -----------------------------------------------------------------------------
-- Hardening de funções privilegiadas existentes
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.expirar_solicitacoes_pendentes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.solicitacoes
  SET
    status = 'expirada',
    expirada_em = NOW(),
    atualizada_em = NOW()
  WHERE status = 'pendente'
    AND expira_em IS NOT NULL
    AND expira_em < NOW();
END;
$$;

-- -----------------------------------------------------------------------------
-- Habilita RLS
-- -----------------------------------------------------------------------------

ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissoes_cadastrais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anuncios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_composicao_anuncio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_composicao_solicitacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negociacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens_negociacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets_moderacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos_ticket_moderacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verificacoes_cadastrais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos_timeline ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Remove policies antigas, se existirem
-- -----------------------------------------------------------------------------

DROP POLICY IF EXISTS empresas_select_own_or_admin ON public.empresas;
DROP POLICY IF EXISTS empresas_update_reenvio_own ON public.empresas;
DROP POLICY IF EXISTS empresas_admin_all ON public.empresas;

DROP POLICY IF EXISTS usuarios_select_visiveis ON public.usuarios;

DROP POLICY IF EXISTS submissoes_select_own_or_admin ON public.submissoes_cadastrais;
DROP POLICY IF EXISTS submissoes_insert_own ON public.submissoes_cadastrais;
DROP POLICY IF EXISTS submissoes_update_admin ON public.submissoes_cadastrais;

DROP POLICY IF EXISTS anuncios_select_marketplace_or_own ON public.anuncios;
DROP POLICY IF EXISTS anuncios_insert_own ON public.anuncios;
DROP POLICY IF EXISTS anuncios_update_own_or_admin ON public.anuncios;
DROP POLICY IF EXISTS anuncios_delete_own_or_admin ON public.anuncios;

DROP POLICY IF EXISTS itens_anuncio_select_visiveis ON public.itens_composicao_anuncio;
DROP POLICY IF EXISTS itens_anuncio_insert_own_or_admin ON public.itens_composicao_anuncio;
DROP POLICY IF EXISTS itens_anuncio_update_own_or_admin ON public.itens_composicao_anuncio;
DROP POLICY IF EXISTS itens_anuncio_delete_own_or_admin ON public.itens_composicao_anuncio;

DROP POLICY IF EXISTS solicitacoes_select_visiveis ON public.solicitacoes;
DROP POLICY IF EXISTS solicitacoes_insert_own ON public.solicitacoes;
DROP POLICY IF EXISTS solicitacoes_update_cancelamento_own ON public.solicitacoes;
DROP POLICY IF EXISTS solicitacoes_update_gestao_anunciante ON public.solicitacoes;

DROP POLICY IF EXISTS itens_solicitacao_select_visiveis ON public.itens_composicao_solicitacao;
DROP POLICY IF EXISTS itens_solicitacao_insert_own ON public.itens_composicao_solicitacao;

DROP POLICY IF EXISTS negociacoes_select_visiveis ON public.negociacoes;
DROP POLICY IF EXISTS negociacoes_insert_anunciante ON public.negociacoes;
DROP POLICY IF EXISTS negociacoes_update_participante_or_admin ON public.negociacoes;

DROP POLICY IF EXISTS mensagens_select_visiveis ON public.mensagens_negociacao;
DROP POLICY IF EXISTS mensagens_insert_visiveis ON public.mensagens_negociacao;

DROP POLICY IF EXISTS avaliacoes_select_participantes_or_admin ON public.avaliacoes;
DROP POLICY IF EXISTS avaliacoes_insert_participante ON public.avaliacoes;
DROP POLICY IF EXISTS avaliacoes_update_admin ON public.avaliacoes;

DROP POLICY IF EXISTS tickets_select_visiveis ON public.tickets_moderacao;
DROP POLICY IF EXISTS tickets_insert_empresa ON public.tickets_moderacao;
DROP POLICY IF EXISTS tickets_update_admin ON public.tickets_moderacao;

DROP POLICY IF EXISTS eventos_ticket_select_visiveis ON public.eventos_ticket_moderacao;
DROP POLICY IF EXISTS eventos_ticket_insert_visiveis ON public.eventos_ticket_moderacao;

DROP POLICY IF EXISTS verificacoes_select_own_or_admin ON public.verificacoes_cadastrais;
DROP POLICY IF EXISTS verificacoes_admin_all ON public.verificacoes_cadastrais;

DROP POLICY IF EXISTS timeline_select_admin ON public.eventos_timeline;
DROP POLICY IF EXISTS timeline_admin_all ON public.eventos_timeline;

-- -----------------------------------------------------------------------------
-- Policies
-- -----------------------------------------------------------------------------

CREATE POLICY empresas_select_own_or_admin
ON public.empresas
FOR SELECT
TO authenticated
USING (
  public.app_is_admin()
  OR id = public.app_empresa_id()
);

CREATE POLICY empresas_update_reenvio_own
ON public.empresas
FOR UPDATE
TO authenticated
USING (
  id = public.app_empresa_id()
  AND status = 'reprovada'
)
WITH CHECK (
  id = public.app_empresa_id()
  AND status = 'em_analise'
);

CREATE POLICY empresas_admin_all
ON public.empresas
FOR ALL
TO authenticated
USING (public.app_is_admin())
WITH CHECK (public.app_is_admin());

CREATE POLICY usuarios_select_visiveis
ON public.usuarios
FOR SELECT
TO authenticated
USING (public.app_pode_ver_usuario(id));

CREATE POLICY submissoes_select_own_or_admin
ON public.submissoes_cadastrais
FOR SELECT
TO authenticated
USING (
  public.app_is_admin()
  OR empresa_id = public.app_empresa_id()
);

CREATE POLICY submissoes_insert_own
ON public.submissoes_cadastrais
FOR INSERT
TO authenticated
WITH CHECK (
  empresa_id = public.app_empresa_id()
  AND status = 'em_analise'
);

CREATE POLICY submissoes_update_admin
ON public.submissoes_cadastrais
FOR UPDATE
TO authenticated
USING (public.app_is_admin())
WITH CHECK (public.app_is_admin());

CREATE POLICY anuncios_select_marketplace_or_own
ON public.anuncios
FOR SELECT
TO authenticated
USING (
  public.app_is_admin()
  OR empresa_id = public.app_empresa_id()
  OR status IN ('ativo', 'em_negociacao')
);

CREATE POLICY anuncios_insert_own
ON public.anuncios
FOR INSERT
TO authenticated
WITH CHECK (
  empresa_id = public.app_empresa_id()
  AND public.app_empresa_aprovada(public.app_empresa_id())
);

CREATE POLICY anuncios_update_own_or_admin
ON public.anuncios
FOR UPDATE
TO authenticated
USING (
  public.app_is_admin()
  OR empresa_id = public.app_empresa_id()
)
WITH CHECK (
  public.app_is_admin()
  OR empresa_id = public.app_empresa_id()
);

CREATE POLICY anuncios_delete_own_or_admin
ON public.anuncios
FOR DELETE
TO authenticated
USING (
  public.app_is_admin()
  OR empresa_id = public.app_empresa_id()
);

CREATE POLICY itens_anuncio_select_visiveis
ON public.itens_composicao_anuncio
FOR SELECT
TO authenticated
USING (
  public.app_is_admin()
  OR public.app_pode_ver_anuncio(anuncio_id)
);

CREATE POLICY itens_anuncio_insert_own_or_admin
ON public.itens_composicao_anuncio
FOR INSERT
TO authenticated
WITH CHECK (
  public.app_is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.anuncios a
    WHERE a.id = anuncio_id
      AND a.empresa_id = public.app_empresa_id()
  )
);

CREATE POLICY itens_anuncio_update_own_or_admin
ON public.itens_composicao_anuncio
FOR UPDATE
TO authenticated
USING (
  public.app_is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.anuncios a
    WHERE a.id = anuncio_id
      AND a.empresa_id = public.app_empresa_id()
  )
)
WITH CHECK (
  public.app_is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.anuncios a
    WHERE a.id = anuncio_id
      AND a.empresa_id = public.app_empresa_id()
  )
);

CREATE POLICY itens_anuncio_delete_own_or_admin
ON public.itens_composicao_anuncio
FOR DELETE
TO authenticated
USING (
  public.app_is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.anuncios a
    WHERE a.id = anuncio_id
      AND a.empresa_id = public.app_empresa_id()
  )
);

CREATE POLICY solicitacoes_select_visiveis
ON public.solicitacoes
FOR SELECT
TO authenticated
USING (public.app_pode_ver_solicitacao(id));

CREATE POLICY solicitacoes_insert_own
ON public.solicitacoes
FOR INSERT
TO authenticated
WITH CHECK (
  empresa_solicitante_id = public.app_empresa_id()
  AND public.app_empresa_aprovada(public.app_empresa_id())
  AND EXISTS (
    SELECT 1
    FROM public.anuncios a
    WHERE a.id = anuncio_id
      AND a.empresa_id <> public.app_empresa_id()
      AND a.status = 'ativo'
  )
);

CREATE POLICY solicitacoes_update_cancelamento_own
ON public.solicitacoes
FOR UPDATE
TO authenticated
USING (
  empresa_solicitante_id = public.app_empresa_id()
  AND status = 'pendente'
)
WITH CHECK (
  empresa_solicitante_id = public.app_empresa_id()
  AND status = 'cancelada'
);

CREATE POLICY solicitacoes_update_gestao_anunciante
ON public.solicitacoes
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.anuncios a
    WHERE a.id = anuncio_id
      AND a.empresa_id = public.app_empresa_id()
  )
  AND status = 'pendente'
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.anuncios a
    WHERE a.id = anuncio_id
      AND a.empresa_id = public.app_empresa_id()
  )
  AND status IN ('aceita', 'recusada')
);

CREATE POLICY itens_solicitacao_select_visiveis
ON public.itens_composicao_solicitacao
FOR SELECT
TO authenticated
USING (public.app_pode_ver_solicitacao(solicitacao_id));

CREATE POLICY itens_solicitacao_insert_own
ON public.itens_composicao_solicitacao
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.solicitacoes s
    WHERE s.id = solicitacao_id
      AND s.empresa_solicitante_id = public.app_empresa_id()
  )
);

CREATE POLICY negociacoes_select_visiveis
ON public.negociacoes
FOR SELECT
TO authenticated
USING (public.app_pode_ver_negociacao(id));

CREATE POLICY negociacoes_insert_anunciante
ON public.negociacoes
FOR INSERT
TO authenticated
WITH CHECK (
  public.app_is_admin()
  OR (
    empresa_autora_id = public.app_empresa_id()
    AND EXISTS (
      SELECT 1
      FROM public.solicitacoes s
      JOIN public.anuncios a ON a.id = s.anuncio_id
      WHERE s.id = solicitacao_id
        AND a.id = anuncio_id
        AND a.empresa_id = public.app_empresa_id()
        AND s.status = 'pendente'
        AND s.empresa_solicitante_id = empresa_contraparte_id
    )
  )
);

CREATE POLICY negociacoes_update_participante_or_admin
ON public.negociacoes
FOR UPDATE
TO authenticated
USING (public.app_pode_ver_negociacao(id))
WITH CHECK (public.app_pode_ver_negociacao(id));

CREATE POLICY mensagens_select_visiveis
ON public.mensagens_negociacao
FOR SELECT
TO authenticated
USING (public.app_pode_ver_negociacao(negociacao_id));

CREATE POLICY mensagens_insert_visiveis
ON public.mensagens_negociacao
FOR INSERT
TO authenticated
WITH CHECK (
  ator_usuario_id = public.app_usuario_id()
  AND public.app_pode_ver_negociacao(negociacao_id)
  AND EXISTS (
    SELECT 1
    FROM public.negociacoes n
    WHERE n.id = negociacao_id
      AND n.status IN ('em_andamento', 'operacao_encerrada')
  )
);

CREATE POLICY avaliacoes_select_participantes_or_admin
ON public.avaliacoes
FOR SELECT
TO authenticated
USING (
  public.app_is_admin()
  OR empresa_avaliadora_id = public.app_empresa_id()
  OR empresa_avaliada_id = public.app_empresa_id()
  OR public.app_pode_ver_negociacao(negociacao_id)
);

CREATE POLICY avaliacoes_insert_participante
ON public.avaliacoes
FOR INSERT
TO authenticated
WITH CHECK (
  empresa_avaliadora_id = public.app_empresa_id()
  AND EXISTS (
    SELECT 1
    FROM public.negociacoes n
    WHERE n.id = negociacao_id
      AND n.status = 'operacao_encerrada'
      AND (
        (n.empresa_autora_id = public.app_empresa_id() AND empresa_avaliada_id = n.empresa_contraparte_id)
        OR (n.empresa_contraparte_id = public.app_empresa_id() AND empresa_avaliada_id = n.empresa_autora_id)
      )
  )
);

CREATE POLICY avaliacoes_update_admin
ON public.avaliacoes
FOR UPDATE
TO authenticated
USING (public.app_is_admin())
WITH CHECK (public.app_is_admin());

CREATE POLICY tickets_select_visiveis
ON public.tickets_moderacao
FOR SELECT
TO authenticated
USING (public.app_pode_ver_ticket(id));

CREATE POLICY tickets_insert_empresa
ON public.tickets_moderacao
FOR INSERT
TO authenticated
WITH CHECK (
  aberto_por_empresa_id = public.app_empresa_id()
  AND aberto_por_usuario_id = public.app_usuario_id()
);

CREATE POLICY tickets_update_admin
ON public.tickets_moderacao
FOR UPDATE
TO authenticated
USING (public.app_is_admin())
WITH CHECK (public.app_is_admin());

CREATE POLICY eventos_ticket_select_visiveis
ON public.eventos_ticket_moderacao
FOR SELECT
TO authenticated
USING (public.app_pode_ver_ticket(ticket_moderacao_id));

CREATE POLICY eventos_ticket_insert_visiveis
ON public.eventos_ticket_moderacao
FOR INSERT
TO authenticated
WITH CHECK (
  ator_usuario_id = public.app_usuario_id()
  AND public.app_pode_ver_ticket(ticket_moderacao_id)
  AND EXISTS (
    SELECT 1
    FROM public.tickets_moderacao t
    WHERE t.id = ticket_moderacao_id
      AND t.status <> 'encerrado'
  )
);

CREATE POLICY verificacoes_select_own_or_admin
ON public.verificacoes_cadastrais
FOR SELECT
TO authenticated
USING (
  public.app_is_admin()
  OR empresa_id = public.app_empresa_id()
);

CREATE POLICY verificacoes_admin_all
ON public.verificacoes_cadastrais
FOR ALL
TO authenticated
USING (public.app_is_admin())
WITH CHECK (public.app_is_admin());

CREATE POLICY timeline_select_admin
ON public.eventos_timeline
FOR SELECT
TO authenticated
USING (public.app_is_admin());

CREATE POLICY timeline_admin_all
ON public.eventos_timeline
FOR ALL
TO authenticated
USING (public.app_is_admin())
WITH CHECK (public.app_is_admin());