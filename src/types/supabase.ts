/**
 * Types Supabase — Phase B MVP v1
 *
 * Aligné sur supabase/migrations/002_phase_b_schema.sql.
 * Format compatible avec @supabase/supabase-js 2.49+.
 *
 * NOTE: tant que le générique `Database` n'est pas pleinement câblé dans
 * `createClient()`, les INSERT/UPDATE doivent toujours être typés `as never`
 * dans les repositories (cf. lib/leads-repo.ts).
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type LeadTool = 'vendre' | 'acheter' | 'audit'

export type LeadStatus =
  | 'nouveau'
  | 'contacte'
  | 'r1'
  | 'mandat'
  | 'sous_compromis'
  | 'vendu'
  | 'perdu'

export type LeadEventKind =
  | 'note'
  | 'status_change'
  | 'magic_link_resent'
  | 'rgpd_delete'
  | 'system'

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '12'
  }
  public: {
    Tables: {
      prospects: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          rgpd_consent_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name?: string
          last_name?: string
          phone?: string | null
          rgpd_consent_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          rgpd_consent_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          prospect_id: string
          tool: LeadTool
          status: LeadStatus
          form_data: Json
          results: Json
          commune: string | null
          magic_link_expires_at: string
          magic_link_sent_at: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          prospect_id: string
          tool: LeadTool
          status?: LeadStatus
          form_data?: Json
          results?: Json
          commune?: string | null
          magic_link_expires_at?: string
          magic_link_sent_at?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          prospect_id?: string
          tool?: LeadTool
          status?: LeadStatus
          form_data?: Json
          results?: Json
          commune?: string | null
          magic_link_expires_at?: string
          magic_link_sent_at?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'leads_prospect_id_fkey'
            columns: ['prospect_id']
            isOneToOne: false
            referencedRelation: 'prospects'
            referencedColumns: ['id']
          },
        ]
      }
      lead_events: {
        Row: {
          id: string
          lead_id: string
          kind: LeadEventKind
          payload: Json
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          kind: LeadEventKind
          payload?: Json
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          kind?: LeadEventKind
          payload?: Json
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'lead_events_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
        ]
      }
      admin_users: {
        Row: {
          id: string
          email: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          is_active?: boolean
          created_at?: string
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
      lead_tool: LeadTool
      lead_status: LeadStatus
      lead_event_kind: LeadEventKind
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
