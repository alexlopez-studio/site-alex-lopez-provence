/**
 * Types Supabase — single-tenant
 *
 * Format compatible avec @supabase/supabase-js 2.49+.
 * Sans les clés __InternalSupabase / Relationships / Views / Functions / Enums /
 * CompositeTypes, le client dégrade toutes les tables à `never`.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '12'
  }
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          type: string
          prenom: string | null
          nom: string | null
          email: string
          telephone: string | null
          form_data: Json | null
          results: Json | null
          token: string
          attio_record_id: string | null
          opt_in: boolean
          opt_in_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          prenom?: string | null
          nom?: string | null
          email: string
          telephone?: string | null
          form_data?: Json | null
          results?: Json | null
          token?: string
          attio_record_id?: string | null
          opt_in?: boolean
          opt_in_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          prenom?: string | null
          nom?: string | null
          email?: string
          telephone?: string | null
          form_data?: Json | null
          results?: Json | null
          token?: string
          attio_record_id?: string | null
          opt_in?: boolean
          opt_in_date?: string | null
          created_at?: string
          updated_at?: string
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
