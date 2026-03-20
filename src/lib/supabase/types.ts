// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ala_private_membros: {
        Row: {
          created_at: string
          data_adesao: string
          email: string
          id: string
          nome: string
          status: string
          telefone: string | null
          tipo: string
          titular_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          data_adesao?: string
          email: string
          id?: string
          nome: string
          status?: string
          telefone?: string | null
          tipo?: string
          titular_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          data_adesao?: string
          email?: string
          id?: string
          nome?: string
          status?: string
          telefone?: string | null
          tipo?: string
          titular_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ala_private_membros_titular_id_fkey"
            columns: ["titular_id"]
            isOneToOne: false
            referencedRelation: "ala_private_membros"
            referencedColumns: ["id"]
          },
        ]
      }
      dre_linhas: {
        Row: {
          ano: number | null
          codigo: string | null
          descricao: string | null
          despesa: number | null
          grupo_pai: string | null
          id: string
          mes: number | null
          nivel: number | null
          periodo: string | null
          receita: number | null
          saldo: number | null
          upload_id: string
          user_id: string
        }
        Insert: {
          ano?: number | null
          codigo?: string | null
          descricao?: string | null
          despesa?: number | null
          grupo_pai?: string | null
          id?: string
          mes?: number | null
          nivel?: number | null
          periodo?: string | null
          receita?: number | null
          saldo?: number | null
          upload_id: string
          user_id: string
        }
        Update: {
          ano?: number | null
          codigo?: string | null
          descricao?: string | null
          despesa?: number | null
          grupo_pai?: string | null
          id?: string
          mes?: number | null
          nivel?: number | null
          periodo?: string | null
          receita?: number | null
          saldo?: number | null
          upload_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dre_linhas_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "dre_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      dre_uploads: {
        Row: {
          ano: number | null
          created_at: string
          id: string
          mes: number | null
          nome_arquivo: string | null
          periodo: string | null
          saldo: number | null
          total_despesa: number | null
          total_receita: number | null
          trimestre: number | null
          user_id: string
        }
        Insert: {
          ano?: number | null
          created_at?: string
          id?: string
          mes?: number | null
          nome_arquivo?: string | null
          periodo?: string | null
          saldo?: number | null
          total_despesa?: number | null
          total_receita?: number | null
          trimestre?: number | null
          user_id: string
        }
        Update: {
          ano?: number | null
          created_at?: string
          id?: string
          mes?: number | null
          nome_arquivo?: string | null
          periodo?: string | null
          saldo?: number | null
          total_despesa?: number | null
          total_receita?: number | null
          trimestre?: number | null
          user_id?: string
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


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: ala_private_membros
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   nome: text (not null)
//   email: text (not null)
//   telefone: text (nullable)
//   status: text (not null, default: 'Ativo'::text)
//   data_adesao: timestamp with time zone (not null, default: now())
//   created_at: timestamp with time zone (not null, default: now())
//   tipo: text (not null, default: 'ALA PRIVATE'::text)
//   titular_id: uuid (nullable)
// Table: dre_linhas
//   id: uuid (not null, default: gen_random_uuid())
//   upload_id: uuid (not null)
//   codigo: text (nullable)
//   descricao: text (nullable)
//   nivel: integer (nullable)
//   grupo_pai: text (nullable)
//   receita: numeric (nullable)
//   despesa: numeric (nullable)
//   saldo: numeric (nullable)
//   periodo: text (nullable)
//   ano: integer (nullable)
//   mes: integer (nullable)
//   user_id: uuid (not null)
// Table: dre_uploads
//   id: uuid (not null, default: gen_random_uuid())
//   nome_arquivo: text (nullable)
//   periodo: text (nullable)
//   ano: integer (nullable)
//   mes: integer (nullable)
//   trimestre: integer (nullable)
//   total_receita: numeric (nullable)
//   total_despesa: numeric (nullable)
//   saldo: numeric (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   user_id: uuid (not null)

// --- CONSTRAINTS ---
// Table: ala_private_membros
//   PRIMARY KEY ala_private_membros_pkey: PRIMARY KEY (id)
//   CHECK ala_private_membros_status_check: CHECK ((status = ANY (ARRAY['Ativo'::text, 'Inativo'::text])))
//   CHECK ala_private_membros_tipo_check: CHECK ((tipo = ANY (ARRAY['ALA PRIVATE'::text, 'membro ALA'::text, 'membro ALA PRIVATE WINE'::text, 'Cônjuge'::text, 'Filho'::text])))
//   FOREIGN KEY ala_private_membros_titular_id_fkey: FOREIGN KEY (titular_id) REFERENCES ala_private_membros(id) ON DELETE CASCADE
//   FOREIGN KEY ala_private_membros_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   CHECK chk_ala_private_membros_hierarquia: CHECK ((((tipo = ANY (ARRAY['ALA PRIVATE'::text, 'membro ALA'::text, 'membro ALA PRIVATE WINE'::text])) AND (titular_id IS NULL)) OR ((tipo = ANY (ARRAY['Cônjuge'::text, 'Filho'::text])) AND (titular_id IS NOT NULL))))
// Table: dre_linhas
//   PRIMARY KEY dre_linhas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY dre_linhas_upload_id_fkey: FOREIGN KEY (upload_id) REFERENCES dre_uploads(id) ON DELETE CASCADE
//   FOREIGN KEY dre_linhas_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: dre_uploads
//   PRIMARY KEY dre_uploads_pkey: PRIMARY KEY (id)
//   FOREIGN KEY dre_uploads_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE

// --- ROW LEVEL SECURITY POLICIES ---
// Table: ala_private_membros
//   Policy "Users can manage their own ala_private_membros" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: dre_linhas
//   Policy "Users can manage their own dre_linhas" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: dre_uploads
//   Policy "Users can manage their own dre_uploads" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)

// --- INDEXES ---
// Table: ala_private_membros
//   CREATE INDEX idx_ala_private_membros_user_id ON public.ala_private_membros USING btree (user_id)
// Table: dre_linhas
//   CREATE INDEX idx_dre_linhas_upload_id ON public.dre_linhas USING btree (upload_id)
//   CREATE INDEX idx_dre_linhas_user_id ON public.dre_linhas USING btree (user_id)
// Table: dre_uploads
//   CREATE INDEX idx_dre_uploads_periodo ON public.dre_uploads USING btree (ano, mes)
//   CREATE INDEX idx_dre_uploads_user_id ON public.dre_uploads USING btree (user_id)

