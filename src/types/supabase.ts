export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      anuncios: {
        Row: {
          aceita_local_proprio: boolean | null
          cancelado_em: string | null
          concluido_em: string | null
          criado_em: string
          disponibilidade_texto: string | null
          empresa_id: string
          expira_em: string | null
          id: string
          permite_parcial: boolean
          publicado_em: string
          rotulo_regiao: string | null
          status: Database["public"]["Enums"]["status_anuncio"]
          tipo: Database["public"]["Enums"]["tipo_anuncio"]
          valor_remanescente: number
          valor_total: number
        }
        Insert: {
          aceita_local_proprio?: boolean | null
          cancelado_em?: string | null
          concluido_em?: string | null
          criado_em?: string
          disponibilidade_texto?: string | null
          empresa_id: string
          expira_em?: string | null
          id?: string
          permite_parcial?: boolean
          publicado_em?: string
          rotulo_regiao?: string | null
          status?: Database["public"]["Enums"]["status_anuncio"]
          tipo: Database["public"]["Enums"]["tipo_anuncio"]
          valor_remanescente: number
          valor_total: number
        }
        Update: {
          aceita_local_proprio?: boolean | null
          cancelado_em?: string | null
          concluido_em?: string | null
          criado_em?: string
          disponibilidade_texto?: string | null
          empresa_id?: string
          expira_em?: string | null
          id?: string
          permite_parcial?: boolean
          publicado_em?: string
          rotulo_regiao?: string | null
          status?: Database["public"]["Enums"]["status_anuncio"]
          tipo?: Database["public"]["Enums"]["tipo_anuncio"]
          valor_remanescente?: number
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "anuncios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      avaliacoes: {
        Row: {
          atualizada_em: string
          criada_em: string
          empresa_avaliada_id: string
          empresa_avaliadora_id: string
          id: string
          moderado_em: string | null
          moderado_por_usuario_id: string | null
          motivo_moderacao: string | null
          negociacao_id: string
          nota: number
          resposta_publica_em: string | null
          resposta_publica_texto: string | null
          status_comentario:
            | Database["public"]["Enums"]["status_comentario_avaliacao"]
            | null
          texto_comentario: string | null
        }
        Insert: {
          atualizada_em?: string
          criada_em?: string
          empresa_avaliada_id: string
          empresa_avaliadora_id: string
          id?: string
          moderado_em?: string | null
          moderado_por_usuario_id?: string | null
          motivo_moderacao?: string | null
          negociacao_id: string
          nota: number
          resposta_publica_em?: string | null
          resposta_publica_texto?: string | null
          status_comentario?:
            | Database["public"]["Enums"]["status_comentario_avaliacao"]
            | null
          texto_comentario?: string | null
        }
        Update: {
          atualizada_em?: string
          criada_em?: string
          empresa_avaliada_id?: string
          empresa_avaliadora_id?: string
          id?: string
          moderado_em?: string | null
          moderado_por_usuario_id?: string | null
          motivo_moderacao?: string | null
          negociacao_id?: string
          nota?: number
          resposta_publica_em?: string | null
          resposta_publica_texto?: string | null
          status_comentario?:
            | Database["public"]["Enums"]["status_comentario_avaliacao"]
            | null
          texto_comentario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_empresa_avaliada_id_fkey"
            columns: ["empresa_avaliada_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_empresa_avaliadora_id_fkey"
            columns: ["empresa_avaliadora_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_moderado_por_usuario_id_fkey"
            columns: ["moderado_por_usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_negociacao_id_fkey"
            columns: ["negociacao_id"]
            isOneToOne: false
            referencedRelation: "negociacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          aprovada_em: string | null
          atualizada_em: string
          bairro: string | null
          cep: string | null
          cidade: string
          cnpj: string
          criada_em: string
          email: string
          endereco_complemento: string | null
          endereco_linha: string
          endereco_numero: string | null
          estado: string
          foto_perfil_url: string | null
          id: string
          nome_fantasia: string | null
          razao_social: string
          reprovada_em: string | null
          status: Database["public"]["Enums"]["status_empresa"]
          telefone: string
        }
        Insert: {
          aprovada_em?: string | null
          atualizada_em?: string
          bairro?: string | null
          cep?: string | null
          cidade: string
          cnpj: string
          criada_em?: string
          email: string
          endereco_complemento?: string | null
          endereco_linha: string
          endereco_numero?: string | null
          estado: string
          foto_perfil_url?: string | null
          id?: string
          nome_fantasia?: string | null
          razao_social: string
          reprovada_em?: string | null
          status?: Database["public"]["Enums"]["status_empresa"]
          telefone: string
        }
        Update: {
          aprovada_em?: string | null
          atualizada_em?: string
          bairro?: string | null
          cep?: string | null
          cidade?: string
          cnpj?: string
          criada_em?: string
          email?: string
          endereco_complemento?: string | null
          endereco_linha?: string
          endereco_numero?: string | null
          estado?: string
          foto_perfil_url?: string | null
          id?: string
          nome_fantasia?: string | null
          razao_social?: string
          reprovada_em?: string | null
          status?: Database["public"]["Enums"]["status_empresa"]
          telefone?: string
        }
        Relationships: []
      }
      eventos_ticket_moderacao: {
        Row: {
          ator_usuario_id: string
          corpo_evento: string | null
          criado_em: string
          dados_evento: Json | null
          id: string
          ticket_moderacao_id: string
          tipo_evento: string
        }
        Insert: {
          ator_usuario_id: string
          corpo_evento?: string | null
          criado_em?: string
          dados_evento?: Json | null
          id?: string
          ticket_moderacao_id: string
          tipo_evento: string
        }
        Update: {
          ator_usuario_id?: string
          corpo_evento?: string | null
          criado_em?: string
          dados_evento?: Json | null
          id?: string
          ticket_moderacao_id?: string
          tipo_evento?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventos_ticket_moderacao_ator_usuario_id_fkey"
            columns: ["ator_usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_ticket_moderacao_ticket_moderacao_id_fkey"
            columns: ["ticket_moderacao_id"]
            isOneToOne: false
            referencedRelation: "tickets_moderacao"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_timeline: {
        Row: {
          ator_id: string
          criado_em: string
          dados_evento: Json | null
          entidade_id: string
          id: string
          publico: boolean
          tipo_ator: string
          tipo_entidade: string
          tipo_evento: string
        }
        Insert: {
          ator_id: string
          criado_em?: string
          dados_evento?: Json | null
          entidade_id: string
          id?: string
          publico?: boolean
          tipo_ator: string
          tipo_entidade: string
          tipo_evento: string
        }
        Update: {
          ator_id?: string
          criado_em?: string
          dados_evento?: Json | null
          entidade_id?: string
          id?: string
          publico?: boolean
          tipo_ator?: string
          tipo_entidade?: string
          tipo_evento?: string
        }
        Relationships: []
      }
      itens_composicao_anuncio: {
        Row: {
          anuncio_id: string
          id: string
          ordem_exibicao: number | null
          quantidade: number
          subtotal_valor: number
          tipo_item: Database["public"]["Enums"]["tipo_item_dinheiro"]
          valor_unitario: number
        }
        Insert: {
          anuncio_id: string
          id?: string
          ordem_exibicao?: number | null
          quantidade: number
          subtotal_valor: number
          tipo_item: Database["public"]["Enums"]["tipo_item_dinheiro"]
          valor_unitario: number
        }
        Update: {
          anuncio_id?: string
          id?: string
          ordem_exibicao?: number | null
          quantidade?: number
          subtotal_valor?: number
          tipo_item?: Database["public"]["Enums"]["tipo_item_dinheiro"]
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_composicao_anuncio_anuncio_id_fkey"
            columns: ["anuncio_id"]
            isOneToOne: false
            referencedRelation: "anuncios"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_composicao_solicitacao: {
        Row: {
          id: string
          ordem_exibicao: number | null
          quantidade: number
          solicitacao_id: string
          subtotal_valor: number
          tipo_item: Database["public"]["Enums"]["tipo_item_dinheiro"]
          valor_unitario: number
        }
        Insert: {
          id?: string
          ordem_exibicao?: number | null
          quantidade: number
          solicitacao_id: string
          subtotal_valor: number
          tipo_item: Database["public"]["Enums"]["tipo_item_dinheiro"]
          valor_unitario: number
        }
        Update: {
          id?: string
          ordem_exibicao?: number | null
          quantidade?: number
          solicitacao_id?: string
          subtotal_valor?: number
          tipo_item?: Database["public"]["Enums"]["tipo_item_dinheiro"]
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_composicao_solicitacao_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "solicitacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      mensagens_negociacao: {
        Row: {
          ator_usuario_id: string
          criada_em: string
          id: string
          negociacao_id: string
          texto_mensagem: string
          tipo_ator: Database["public"]["Enums"]["tipo_ator_mensagem"]
        }
        Insert: {
          ator_usuario_id: string
          criada_em?: string
          id?: string
          negociacao_id: string
          texto_mensagem: string
          tipo_ator: Database["public"]["Enums"]["tipo_ator_mensagem"]
        }
        Update: {
          ator_usuario_id?: string
          criada_em?: string
          id?: string
          negociacao_id?: string
          texto_mensagem?: string
          tipo_ator?: Database["public"]["Enums"]["tipo_ator_mensagem"]
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_negociacao_ator_usuario_id_fkey"
            columns: ["ator_usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_negociacao_negociacao_id_fkey"
            columns: ["negociacao_id"]
            isOneToOne: false
            referencedRelation: "negociacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      negociacoes: {
        Row: {
          anuncio_id: string
          atualizada_em: string
          cancelada_em: string | null
          criada_em: string
          empresa_autora_id: string
          empresa_contraparte_id: string
          finalizada_em: string | null
          id: string
          local_troca: Database["public"]["Enums"]["local_troca"]
          meio_pagamento: string
          moderador_atual_id: string | null
          operacao_encerrada_em: string | null
          solicitacao_id: string
          status: Database["public"]["Enums"]["status_negociacao"]
          status_moderacao: Database["public"]["Enums"]["status_moderacao_negociacao"]
          valor_negociado: number
        }
        Insert: {
          anuncio_id: string
          atualizada_em?: string
          cancelada_em?: string | null
          criada_em?: string
          empresa_autora_id: string
          empresa_contraparte_id: string
          finalizada_em?: string | null
          id?: string
          local_troca: Database["public"]["Enums"]["local_troca"]
          meio_pagamento: string
          moderador_atual_id?: string | null
          operacao_encerrada_em?: string | null
          solicitacao_id: string
          status?: Database["public"]["Enums"]["status_negociacao"]
          status_moderacao?: Database["public"]["Enums"]["status_moderacao_negociacao"]
          valor_negociado: number
        }
        Update: {
          anuncio_id?: string
          atualizada_em?: string
          cancelada_em?: string | null
          criada_em?: string
          empresa_autora_id?: string
          empresa_contraparte_id?: string
          finalizada_em?: string | null
          id?: string
          local_troca?: Database["public"]["Enums"]["local_troca"]
          meio_pagamento?: string
          moderador_atual_id?: string | null
          operacao_encerrada_em?: string | null
          solicitacao_id?: string
          status?: Database["public"]["Enums"]["status_negociacao"]
          status_moderacao?: Database["public"]["Enums"]["status_moderacao_negociacao"]
          valor_negociado?: number
        }
        Relationships: [
          {
            foreignKeyName: "negociacoes_anuncio_id_fkey"
            columns: ["anuncio_id"]
            isOneToOne: false
            referencedRelation: "anuncios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negociacoes_empresa_autora_id_fkey"
            columns: ["empresa_autora_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negociacoes_empresa_contraparte_id_fkey"
            columns: ["empresa_contraparte_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negociacoes_moderador_atual_id_fkey"
            columns: ["moderador_atual_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negociacoes_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: true
            referencedRelation: "solicitacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes: {
        Row: {
          aceita_em: string | null
          anuncio_id: string
          atualizada_em: string
          cancelada_em: string | null
          criada_em: string
          empresa_solicitante_id: string
          expira_em: string | null
          expirada_em: string | null
          id: string
          local_troca: Database["public"]["Enums"]["local_troca"]
          meio_pagamento: string
          parcial: boolean
          prazo_cancelamento_em: string
          recusada_em: string | null
          status: Database["public"]["Enums"]["status_solicitacao"]
          valor_solicitado: number
        }
        Insert: {
          aceita_em?: string | null
          anuncio_id: string
          atualizada_em?: string
          cancelada_em?: string | null
          criada_em?: string
          empresa_solicitante_id: string
          expira_em?: string | null
          expirada_em?: string | null
          id?: string
          local_troca: Database["public"]["Enums"]["local_troca"]
          meio_pagamento: string
          parcial?: boolean
          prazo_cancelamento_em: string
          recusada_em?: string | null
          status?: Database["public"]["Enums"]["status_solicitacao"]
          valor_solicitado: number
        }
        Update: {
          aceita_em?: string | null
          anuncio_id?: string
          atualizada_em?: string
          cancelada_em?: string | null
          criada_em?: string
          empresa_solicitante_id?: string
          expira_em?: string | null
          expirada_em?: string | null
          id?: string
          local_troca?: Database["public"]["Enums"]["local_troca"]
          meio_pagamento?: string
          parcial?: boolean
          prazo_cancelamento_em?: string
          recusada_em?: string | null
          status?: Database["public"]["Enums"]["status_solicitacao"]
          valor_solicitado?: number
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_anuncio_id_fkey"
            columns: ["anuncio_id"]
            isOneToOne: false
            referencedRelation: "anuncios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_empresa_solicitante_id_fkey"
            columns: ["empresa_solicitante_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      submissoes_cadastrais: {
        Row: {
          criada_em: string
          dados_submetidos: Json
          empresa_id: string
          enviada_em: string
          id: string
          motivo_reprovacao_codigo: string | null
          motivo_reprovacao_texto: string | null
          numero_submissao: number
          revisada_em: string | null
          revisada_por_usuario_id: string | null
          status: Database["public"]["Enums"]["status_submissao_cadastral"]
        }
        Insert: {
          criada_em?: string
          dados_submetidos: Json
          empresa_id: string
          enviada_em?: string
          id?: string
          motivo_reprovacao_codigo?: string | null
          motivo_reprovacao_texto?: string | null
          numero_submissao: number
          revisada_em?: string | null
          revisada_por_usuario_id?: string | null
          status?: Database["public"]["Enums"]["status_submissao_cadastral"]
        }
        Update: {
          criada_em?: string
          dados_submetidos?: Json
          empresa_id?: string
          enviada_em?: string
          id?: string
          motivo_reprovacao_codigo?: string | null
          motivo_reprovacao_texto?: string | null
          numero_submissao?: number
          revisada_em?: string | null
          revisada_por_usuario_id?: string | null
          status?: Database["public"]["Enums"]["status_submissao_cadastral"]
        }
        Relationships: [
          {
            foreignKeyName: "submissoes_cadastrais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissoes_cadastrais_revisada_por_usuario_id_fkey"
            columns: ["revisada_por_usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets_moderacao: {
        Row: {
          aberto_em: string
          aberto_por_empresa_id: string | null
          aberto_por_usuario_id: string | null
          assunto: string | null
          atribuido_para_usuario_id: string | null
          atualizado_em: string
          criado_em: string
          descricao: string | null
          encerrado_em: string | null
          id: string
          origem_id: string
          resumo_resolucao: string | null
          status: Database["public"]["Enums"]["status_ticket_moderacao"]
          tipo_motivo: string | null
          tipo_origem: Database["public"]["Enums"]["tipo_origem_ticket_moderacao"]
        }
        Insert: {
          aberto_em?: string
          aberto_por_empresa_id?: string | null
          aberto_por_usuario_id?: string | null
          assunto?: string | null
          atribuido_para_usuario_id?: string | null
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          encerrado_em?: string | null
          id?: string
          origem_id: string
          resumo_resolucao?: string | null
          status?: Database["public"]["Enums"]["status_ticket_moderacao"]
          tipo_motivo?: string | null
          tipo_origem: Database["public"]["Enums"]["tipo_origem_ticket_moderacao"]
        }
        Update: {
          aberto_em?: string
          aberto_por_empresa_id?: string | null
          aberto_por_usuario_id?: string | null
          assunto?: string | null
          atribuido_para_usuario_id?: string | null
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          encerrado_em?: string | null
          id?: string
          origem_id?: string
          resumo_resolucao?: string | null
          status?: Database["public"]["Enums"]["status_ticket_moderacao"]
          tipo_motivo?: string | null
          tipo_origem?: Database["public"]["Enums"]["tipo_origem_ticket_moderacao"]
        }
        Relationships: [
          {
            foreignKeyName: "tickets_moderacao_aberto_por_empresa_id_fkey"
            columns: ["aberto_por_empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_moderacao_aberto_por_usuario_id_fkey"
            columns: ["aberto_por_usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_moderacao_atribuido_para_usuario_id_fkey"
            columns: ["atribuido_para_usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          ativo: boolean
          atualizado_em: string
          cargo_funcao: string | null
          cpf: string | null
          criado_em: string
          email: string
          empresa_id: string | null
          id: string
          id_usuario_autenticacao: string
          nome_completo: string
          papel: Database["public"]["Enums"]["papel_usuario"]
          telefone: string | null
          vinculo_empresa: string | null
        }
        Insert: {
          ativo?: boolean
          atualizado_em?: string
          cargo_funcao?: string | null
          cpf?: string | null
          criado_em?: string
          email: string
          empresa_id?: string | null
          id?: string
          id_usuario_autenticacao: string
          nome_completo: string
          papel: Database["public"]["Enums"]["papel_usuario"]
          telefone?: string | null
          vinculo_empresa?: string | null
        }
        Update: {
          ativo?: boolean
          atualizado_em?: string
          cargo_funcao?: string | null
          cpf?: string | null
          criado_em?: string
          email?: string
          empresa_id?: string | null
          id?: string
          id_usuario_autenticacao?: string
          nome_completo?: string
          papel?: Database["public"]["Enums"]["papel_usuario"]
          telefone?: string | null
          vinculo_empresa?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      verificacoes_cadastrais: {
        Row: {
          atualizada_em: string
          criada_em: string
          empresa_id: string
          id: string
          observacao: string | null
          status_verificacao: Database["public"]["Enums"]["status_verificacao_cadastral"]
          tipo_verificacao: string
          visivel_publicamente: boolean
        }
        Insert: {
          atualizada_em?: string
          criada_em?: string
          empresa_id: string
          id?: string
          observacao?: string | null
          status_verificacao?: Database["public"]["Enums"]["status_verificacao_cadastral"]
          tipo_verificacao: string
          visivel_publicamente?: boolean
        }
        Update: {
          atualizada_em?: string
          criada_em?: string
          empresa_id?: string
          id?: string
          observacao?: string | null
          status_verificacao?: Database["public"]["Enums"]["status_verificacao_cadastral"]
          tipo_verificacao?: string
          visivel_publicamente?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "verificacoes_cadastrais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      local_troca: "empresa_autora" | "empresa_solicitante"
      papel_usuario:
        | "usuario_empresa"
        | "usuario_admin"
        | "usuario_moderador"
        | "usuario_admin_moderador"
      status_anuncio:
        | "ativo"
        | "em_negociacao"
        | "concluido"
        | "cancelado"
        | "expirado"
      status_comentario_avaliacao: "pendente_moderacao" | "aprovado" | "barrado"
      status_empresa: "em_analise" | "aprovada" | "reprovada"
      status_moderacao_negociacao:
        | "nao_acionada"
        | "acionada"
        | "em_acompanhamento"
        | "encerrada"
      status_negociacao:
        | "em_andamento"
        | "operacao_encerrada"
        | "finalizada"
        | "cancelada"
      status_solicitacao:
        | "pendente"
        | "aceita"
        | "recusada"
        | "cancelada"
        | "expirada"
      status_submissao_cadastral: "em_analise" | "aprovada" | "reprovada"
      status_ticket_moderacao: "aberto" | "em_analise" | "encerrado"
      status_verificacao_cadastral: "pendente" | "verificada" | "rejeitada"
      tipo_anuncio: "oferta" | "necessidade"
      tipo_ator_mensagem:
        | "usuario_empresa"
        | "usuario_admin"
        | "usuario_moderador"
        | "usuario_admin_moderador"
      tipo_item_dinheiro: "cedula" | "moeda"
      tipo_origem_ticket_moderacao:
        | "perfil_empresa"
        | "administrativo"
        | "outro_contexto"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      local_troca: ["empresa_autora", "empresa_solicitante"],
      papel_usuario: [
        "usuario_empresa",
        "usuario_admin",
        "usuario_moderador",
        "usuario_admin_moderador",
      ],
      status_anuncio: [
        "ativo",
        "em_negociacao",
        "concluido",
        "cancelado",
        "expirado",
      ],
      status_comentario_avaliacao: [
        "pendente_moderacao",
        "aprovado",
        "barrado",
      ],
      status_empresa: ["em_analise", "aprovada", "reprovada"],
      status_moderacao_negociacao: [
        "nao_acionada",
        "acionada",
        "em_acompanhamento",
        "encerrada",
      ],
      status_negociacao: [
        "em_andamento",
        "operacao_encerrada",
        "finalizada",
        "cancelada",
      ],
      status_solicitacao: [
        "pendente",
        "aceita",
        "recusada",
        "cancelada",
        "expirada",
      ],
      status_submissao_cadastral: ["em_analise", "aprovada", "reprovada"],
      status_ticket_moderacao: ["aberto", "em_analise", "encerrado"],
      status_verificacao_cadastral: ["pendente", "verificada", "rejeitada"],
      tipo_anuncio: ["oferta", "necessidade"],
      tipo_ator_mensagem: [
        "usuario_empresa",
        "usuario_admin",
        "usuario_moderador",
        "usuario_admin_moderador",
      ],
      tipo_item_dinheiro: ["cedula", "moeda"],
      tipo_origem_ticket_moderacao: [
        "perfil_empresa",
        "administrativo",
        "outro_contexto",
      ],
    },
  },
} as const