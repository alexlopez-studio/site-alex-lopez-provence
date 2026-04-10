/**
 * Types Supabase — single-tenant
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
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
          results?: Json | null
          attio_record_id?: string | null
          updated_at?: string
        }
      }
    }
  }
}
