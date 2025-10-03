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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      campanhas: {
        Row: {
          atualizado_em: string
          cliente_id: string
          configuracoes: Json | null
          criado_em: string
          descricao: string | null
          dominio_personalizado: string | null
          email_auto_envio: boolean | null
          email_nome_remetente: string | null
          email_provider: string | null
          email_remetente: string | null
          headline: string | null
          id: string
          logo_url: string | null
          nome: string
          status: string
          subtitulo: string | null
          tema_id: number | null
          template_boas_vindas_id: string | null
          texto_cta: string | null
          webhook_url: string | null
        }
        Insert: {
          atualizado_em?: string
          cliente_id: string
          configuracoes?: Json | null
          criado_em?: string
          descricao?: string | null
          dominio_personalizado?: string | null
          email_auto_envio?: boolean | null
          email_nome_remetente?: string | null
          email_provider?: string | null
          email_remetente?: string | null
          headline?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          status?: string
          subtitulo?: string | null
          tema_id?: number | null
          template_boas_vindas_id?: string | null
          texto_cta?: string | null
          webhook_url?: string | null
        }
        Update: {
          atualizado_em?: string
          cliente_id?: string
          configuracoes?: Json | null
          criado_em?: string
          descricao?: string | null
          dominio_personalizado?: string | null
          email_auto_envio?: boolean | null
          email_nome_remetente?: string | null
          email_provider?: string | null
          email_remetente?: string | null
          headline?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          status?: string
          subtitulo?: string | null
          tema_id?: number | null
          template_boas_vindas_id?: string | null
          texto_cta?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campanhas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campanhas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "landing_page_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campanhas_tema_id_fkey"
            columns: ["tema_id"]
            isOneToOne: false
            referencedRelation: "temas_landing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campanhas_template_boas_vindas_id_fkey"
            columns: ["template_boas_vindas_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          configuracoes: Json | null
          criado_em: string | null
          dominio_personalizado: string | null
          email: string
          headline: string | null
          id: string
          logo_url: string | null
          lp_publica: boolean | null
          nome: string
          subtitulo: string | null
          tema_id: number | null
          texto_cta: string | null
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          configuracoes?: Json | null
          criado_em?: string | null
          dominio_personalizado?: string | null
          email: string
          headline?: string | null
          id?: string
          logo_url?: string | null
          lp_publica?: boolean | null
          nome: string
          subtitulo?: string | null
          tema_id?: number | null
          texto_cta?: string | null
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          configuracoes?: Json | null
          criado_em?: string | null
          dominio_personalizado?: string | null
          email?: string
          headline?: string | null
          id?: string
          logo_url?: string | null
          lp_publica?: boolean | null
          nome?: string
          subtitulo?: string | null
          tema_id?: number | null
          texto_cta?: string | null
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_clientes_tema"
            columns: ["tema_id"]
            isOneToOne: false
            referencedRelation: "temas_landing"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          assunto: string
          campanha_id: string | null
          criado_em: string | null
          destinatario_email: string
          destinatario_nome: string | null
          erro: string | null
          id: string
          lead_id: string | null
          provider_message_id: string | null
          status: string
          template_id: string | null
        }
        Insert: {
          assunto: string
          campanha_id?: string | null
          criado_em?: string | null
          destinatario_email: string
          destinatario_nome?: string | null
          erro?: string | null
          id?: string
          lead_id?: string | null
          provider_message_id?: string | null
          status?: string
          template_id?: string | null
        }
        Update: {
          assunto?: string
          campanha_id?: string | null
          criado_em?: string | null
          destinatario_email?: string
          destinatario_nome?: string | null
          erro?: string | null
          id?: string
          lead_id?: string | null
          provider_message_id?: string | null
          status?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "landing_page_campanha_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          assunto: string
          ativo: boolean | null
          campanha_id: string | null
          corpo: string
          criado_em: string
          id: string
          nome: string
          tipo: string | null
          variaveis: string[] | null
        }
        Insert: {
          assunto: string
          ativo?: boolean | null
          campanha_id?: string | null
          corpo: string
          criado_em?: string
          id?: string
          nome: string
          tipo?: string | null
          variaveis?: string[] | null
        }
        Update: {
          assunto?: string
          ativo?: boolean | null
          campanha_id?: string | null
          corpo?: string
          criado_em?: string
          id?: string
          nome?: string
          tipo?: string | null
          variaveis?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_templates_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "landing_page_campanha_public"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_interactions: {
        Row: {
          criado_em: string
          criado_por: string | null
          dados_extras: Json | null
          descricao: string
          id: string
          lead_id: string
          tipo: string
        }
        Insert: {
          criado_em?: string
          criado_por?: string | null
          dados_extras?: Json | null
          descricao: string
          id?: string
          lead_id: string
          tipo: string
        }
        Update: {
          criado_em?: string
          criado_por?: string | null
          dados_extras?: Json | null
          descricao?: string
          id?: string
          lead_id?: string
          tipo?: string
        }
        Relationships: []
      }
      lead_tag_relations: {
        Row: {
          criado_em: string
          id: string
          lead_id: string
          tag_id: string
        }
        Insert: {
          criado_em?: string
          id?: string
          lead_id: string
          tag_id: string
        }
        Update: {
          criado_em?: string
          id?: string
          lead_id?: string
          tag_id?: string
        }
        Relationships: []
      }
      lead_tags: {
        Row: {
          cor: string
          criado_em: string
          id: string
          nome: string
        }
        Insert: {
          cor?: string
          criado_em?: string
          id?: string
          nome: string
        }
        Update: {
          cor?: string
          criado_em?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          campanha_id: string | null
          cliente_id: string | null
          data_atualizacao: string | null
          data_criacao: string | null
          email: string
          id: string
          interesse: string | null
          nome: string
          notas: string | null
          origem: string | null
          status: string | null
          telefone: string | null
        }
        Insert: {
          campanha_id?: string | null
          cliente_id?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          email: string
          id?: string
          interesse?: string | null
          nome: string
          notas?: string | null
          origem?: string | null
          status?: string | null
          telefone?: string | null
        }
        Update: {
          campanha_id?: string | null
          cliente_id?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          email?: string
          id?: string
          interesse?: string | null
          nome?: string
          notas?: string | null
          origem?: string | null
          status?: string | null
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "landing_page_campanha_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "landing_page_public"
            referencedColumns: ["id"]
          },
        ]
      }
      metricas_campanha: {
        Row: {
          campanha_id: string | null
          criado_em: string | null
          data_metrica: string | null
          id: string
          leads_convertidos: number | null
          leads_csv: number | null
          leads_formulario: number | null
          leads_manual: number | null
          leads_n8n: number | null
          leads_qualificados: number | null
          total_leads: number | null
        }
        Insert: {
          campanha_id?: string | null
          criado_em?: string | null
          data_metrica?: string | null
          id?: string
          leads_convertidos?: number | null
          leads_csv?: number | null
          leads_formulario?: number | null
          leads_manual?: number | null
          leads_n8n?: number | null
          leads_qualificados?: number | null
          total_leads?: number | null
        }
        Update: {
          campanha_id?: string | null
          criado_em?: string | null
          data_metrica?: string | null
          id?: string
          leads_convertidos?: number | null
          leads_csv?: number | null
          leads_formulario?: number | null
          leads_manual?: number | null
          leads_n8n?: number | null
          leads_qualificados?: number | null
          total_leads?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "metricas_campanha_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metricas_campanha_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "landing_page_campanha_public"
            referencedColumns: ["id"]
          },
        ]
      }
      metricas_cliente: {
        Row: {
          cliente_id: string | null
          criado_em: string | null
          data_metrica: string | null
          id: string
          leads_convertidos: number | null
          leads_csv: number | null
          leads_formulario: number | null
          leads_manual: number | null
          leads_n8n: number | null
          leads_qualificados: number | null
          total_leads: number | null
        }
        Insert: {
          cliente_id?: string | null
          criado_em?: string | null
          data_metrica?: string | null
          id?: string
          leads_convertidos?: number | null
          leads_csv?: number | null
          leads_formulario?: number | null
          leads_manual?: number | null
          leads_n8n?: number | null
          leads_qualificados?: number | null
          total_leads?: number | null
        }
        Update: {
          cliente_id?: string | null
          criado_em?: string | null
          data_metrica?: string | null
          id?: string
          leads_convertidos?: number | null
          leads_csv?: number | null
          leads_formulario?: number | null
          leads_manual?: number | null
          leads_n8n?: number | null
          leads_qualificados?: number | null
          total_leads?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "metricas_cliente_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metricas_cliente_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "landing_page_public"
            referencedColumns: ["id"]
          },
        ]
      }
      temas_landing: {
        Row: {
          criado_em: string | null
          descricao: string | null
          id: number
          nome: string
          preview_url: string | null
        }
        Insert: {
          criado_em?: string | null
          descricao?: string | null
          id?: number
          nome: string
          preview_url?: string | null
        }
        Update: {
          criado_em?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          preview_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      landing_page_campanha_public: {
        Row: {
          dominio_personalizado: string | null
          headline: string | null
          id: string | null
          logo_url: string | null
          lp_publica: boolean | null
          nome: string | null
          subtitulo: string | null
          tema_id: number | null
          texto_cta: string | null
          webhook_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campanhas_tema_id_fkey"
            columns: ["tema_id"]
            isOneToOne: false
            referencedRelation: "temas_landing"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_page_public: {
        Row: {
          dominio_personalizado: string | null
          headline: string | null
          id: string | null
          logo_url: string | null
          lp_publica: boolean | null
          nome: string | null
          subtitulo: string | null
          tema_id: number | null
          texto_cta: string | null
          webhook_url: string | null
        }
        Insert: {
          dominio_personalizado?: string | null
          headline?: string | null
          id?: string | null
          logo_url?: string | null
          lp_publica?: boolean | null
          nome?: string | null
          subtitulo?: string | null
          tema_id?: number | null
          texto_cta?: string | null
          webhook_url?: string | null
        }
        Update: {
          dominio_personalizado?: string | null
          headline?: string | null
          id?: string | null
          logo_url?: string | null
          lp_publica?: boolean | null
          nome?: string | null
          subtitulo?: string | null
          tema_id?: number | null
          texto_cta?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_clientes_tema"
            columns: ["tema_id"]
            isOneToOne: false
            referencedRelation: "temas_landing"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
