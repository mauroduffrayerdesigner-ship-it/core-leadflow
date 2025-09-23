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
      clientes: {
        Row: {
          configuracoes: Json | null
          criado_em: string | null
          dominio_personalizado: string | null
          email: string
          id: string
          logo_url: string | null
          nome: string
          tema_id: number | null
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          configuracoes?: Json | null
          criado_em?: string | null
          dominio_personalizado?: string | null
          email: string
          id?: string
          logo_url?: string | null
          nome: string
          tema_id?: number | null
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          configuracoes?: Json | null
          criado_em?: string | null
          dominio_personalizado?: string | null
          email?: string
          id?: string
          logo_url?: string | null
          nome?: string
          tema_id?: number | null
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
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
            foreignKeyName: "leads_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
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
      [_ in never]: never
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
