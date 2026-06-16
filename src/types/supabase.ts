/**
 * Types Supabase — Phase B MVP v1 + Mandat OS
 *
 * Aligné sur supabase/migrations/002_phase_b_schema.sql
 * + tables Mandat OS (market_properties, management_rules, etc.)
 * Format compatible avec @supabase/supabase-js 2.49+.
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

export type AdminRole = 'super_admin' | 'admin'

export type LeadEventKind =
  | 'note'
  | 'status_change'
  | 'magic_link_resent'
  | 'rgpd_delete'
  | 'system'

// ── Mandat OS types ────────────────────────────────────────

export type PropertyStatus = 
  | 'nouveau' | 'actif' | 'prix_en_baisse' | 'a_surveiller'
  | 'opportunite' | 'stagne' | 'expire' | 'ignore'

export type RuleTriggerType =
  | 'new_listing' | 'price_changed' | 'price_drop' | 'big_price_drop'
  | 'expired' | 'updated' | 'days_online_exceeded' | 'dpe_detected'
  | 'price_per_m2_below' | 'price_per_m2_above' | 'land_surface_above'

export type NotificationStatus = 'unread' | 'read' | 'processed' | 'ignored'
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical'

export type OpportunityStage =
  | 'À qualifier' | 'À analyser' | 'À contacter' | 'Contacté'
  | 'Rendez-vous à préparer' | 'En suivi' | 'Mandat potentiel'
  | 'Converti' | 'Écarté'

export type OpportunityPriority = 'low' | 'medium' | 'high' | 'critical'

export type SyncStatus = 'running' | 'success' | 'error'

// ── Liste Chaude (réseau / bouche-à-oreille) ───────────────

export type WarmContactStatus =
  | 'a_contacter' | 'contacte' | 'relance' | 'termine'

export type WarmEventType =
  | 'call' | 'email' | 'message' | 'meeting'
  | 'note' | 'status_change' | 'referral' | 'import'

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '12'
  }
  public: {
    Tables: {
      // ── Tables existantes Phase B ──────────────────────────
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
          user_id: string | null
          role: AdminRole
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          is_active?: boolean
          user_id?: string | null
          role?: AdminRole
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          is_active?: boolean
          user_id?: string | null
          role?: AdminRole
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ── Tables Mandat OS ──────────────────────────────────
      monitored_zones: {
        Row: {
          id: string
          name: string
          zipcode: string
          city: string | null
          insee_code: string | null
          active: boolean
          sync_frequency: string
          last_synced_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          zipcode: string
          city?: string | null
          insee_code?: string | null
          active?: boolean
          sync_frequency?: string
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          zipcode?: string
          city?: string | null
          insee_code?: string | null
          active?: boolean
          sync_frequency?: string
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      market_properties: {
        Row: {
          id: string
          external_id: string
          source: string
          title: string | null
          description: string | null
          city: string | null
          zipcode: string | null
          insee_code: string | null
          lat: number | null
          lon: number | null
          property_type: string | null
          price: number | null
          surface: number | null
          price_per_m2: number | null
          land_surface: number | null
          rooms: number | null
          bedrooms: number | null
          dpe: string | null
          ges: string | null
          url: string | null
          status: string
          first_seen_at: string
          last_seen_at: string
          published_at: string | null
          expired_at: string | null
          raw_json: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          external_id: string
          source?: string
          title?: string | null
          description?: string | null
          city?: string | null
          zipcode?: string | null
          insee_code?: string | null
          lat?: number | null
          lon?: number | null
          property_type?: string | null
          price?: number | null
          surface?: number | null
          price_per_m2?: number | null
          land_surface?: number | null
          rooms?: number | null
          bedrooms?: number | null
          dpe?: string | null
          ges?: string | null
          url?: string | null
          status?: string
          first_seen_at?: string
          last_seen_at?: string
          published_at?: string | null
          expired_at?: string | null
          raw_json?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          external_id?: string
          source?: string
          title?: string | null
          description?: string | null
          city?: string | null
          zipcode?: string | null
          insee_code?: string | null
          lat?: number | null
          lon?: number | null
          property_type?: string | null
          price?: number | null
          surface?: number | null
          price_per_m2?: number | null
          land_surface?: number | null
          rooms?: number | null
          bedrooms?: number | null
          dpe?: string | null
          ges?: string | null
          url?: string | null
          status?: string
          first_seen_at?: string
          last_seen_at?: string
          published_at?: string | null
          expired_at?: string | null
          raw_json?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      property_price_history: {
        Row: {
          id: string
          market_property_id: string
          old_price: number | null
          new_price: number | null
          variation_amount: number | null
          variation_percent: number | null
          detected_at: string
          created_at: string
        }
        Insert: {
          id?: string
          market_property_id: string
          old_price?: number | null
          new_price?: number | null
          variation_amount?: number | null
          variation_percent?: number | null
          detected_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          market_property_id?: string
          old_price?: number | null
          new_price?: number | null
          variation_amount?: number | null
          variation_percent?: number | null
          detected_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'property_price_history_market_property_id_fkey'
            columns: ['market_property_id']
            isOneToOne: false
            referencedRelation: 'market_properties'
            referencedColumns: ['id']
          },
        ]
      }
      property_tags: {
        Row: {
          id: string
          market_property_id: string
          tag: string
          source: string
          rule_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          market_property_id: string
          tag: string
          source?: string
          rule_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          market_property_id?: string
          tag?: string
          source?: string
          rule_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'property_tags_market_property_id_fkey'
            columns: ['market_property_id']
            isOneToOne: false
            referencedRelation: 'market_properties'
            referencedColumns: ['id']
          },
        ]
      }
      management_rules: {
        Row: {
          id: string
          name: string
          description: string
          active: boolean
          trigger_type: string
          conditions_json: Json
          actions_json: Json
          priority: string
          last_run_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          active?: boolean
          trigger_type: string
          conditions_json?: Json
          actions_json?: Json
          priority?: string
          last_run_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          active?: boolean
          trigger_type?: string
          conditions_json?: Json
          actions_json?: Json
          priority?: string
          last_run_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          type: string
          title: string
          message: string
          priority: string
          market_property_id: string | null
          rule_id: string | null
          opportunity_id: string | null
          status: string
          action_label: string | null
          created_at: string
          read_at: string | null
          resolved_at: string | null
        }
        Insert: {
          id?: string
          type: string
          title: string
          message?: string
          priority?: string
          market_property_id?: string | null
          rule_id?: string | null
          opportunity_id?: string | null
          status?: string
          action_label?: string | null
          created_at?: string
          read_at?: string | null
          resolved_at?: string | null
        }
        Update: {
          id?: string
          type?: string
          title?: string
          message?: string
          priority?: string
          market_property_id?: string | null
          rule_id?: string | null
          opportunity_id?: string | null
          status?: string
          action_label?: string | null
          created_at?: string
          read_at?: string | null
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_market_property_id_fkey'
            columns: ['market_property_id']
            isOneToOne: false
            referencedRelation: 'market_properties'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'notifications_rule_id_fkey'
            columns: ['rule_id']
            isOneToOne: false
            referencedRelation: 'management_rules'
            referencedColumns: ['id']
          },
        ]
      }
      opportunities: {
        Row: {
          id: string
          market_property_id: string | null
          title: string
          description: string
          stage: string
          priority: string
          signal_type: string | null
          next_action: string | null
          due_date: string | null
          note: string | null
          created_from: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          market_property_id?: string | null
          title: string
          description?: string
          stage?: string
          priority?: string
          signal_type?: string | null
          next_action?: string | null
          due_date?: string | null
          note?: string | null
          created_from?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          market_property_id?: string | null
          title?: string
          description?: string
          stage?: string
          priority?: string
          signal_type?: string | null
          next_action?: string | null
          due_date?: string | null
          note?: string | null
          created_from?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'opportunities_market_property_id_fkey'
            columns: ['market_property_id']
            isOneToOne: false
            referencedRelation: 'market_properties'
            referencedColumns: ['id']
          },
        ]
      }
      property_notes: {
        Row: {
          id: string
          market_property_id: string | null
          opportunity_id: string | null
          note: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          market_property_id?: string | null
          opportunity_id?: string | null
          note: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          market_property_id?: string | null
          opportunity_id?: string | null
          note?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'property_notes_market_property_id_fkey'
            columns: ['market_property_id']
            isOneToOne: false
            referencedRelation: 'market_properties'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'property_notes_opportunity_id_fkey'
            columns: ['opportunity_id']
            isOneToOne: false
            referencedRelation: 'opportunities'
            referencedColumns: ['id']
          },
        ]
      }
      buyer_criteria: {
        Row: {
          id: string
          lead_id: string
          prospect_id: string | null
          type_bien: string | null
          communes: string[] | null
          budget_max: number | null
          surface_min: number | null
          pieces_min: number | null
          criteres: string[] | null
          active: boolean
          matched_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          prospect_id?: string | null
          type_bien?: string | null
          communes?: string[] | null
          budget_max?: number | null
          surface_min?: number | null
          pieces_min?: number | null
          criteres?: string[] | null
          active?: boolean
          matched_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          prospect_id?: string | null
          type_bien?: string | null
          communes?: string[] | null
          budget_max?: number | null
          surface_min?: number | null
          pieces_min?: number | null
          criteres?: string[] | null
          active?: boolean
          matched_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      seller_properties: {
        Row: {
          id: string
          lead_id: string
          prospect_id: string | null
          adresse: string | null
          lat: number | null
          lon: number | null
          type_bien: string | null
          sous_type: string | null
          surface: number | null
          surface_terrain: number | null
          nb_pieces: number | null
          etat: string | null
          dpe: string | null
          annee_construction: number | null
          equipements: string[] | null
          delai: string | null
          prix_estime: number | null
          actif: boolean
          matched_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          prospect_id?: string | null
          adresse?: string | null
          lat?: number | null
          lon?: number | null
          type_bien?: string | null
          sous_type?: string | null
          surface?: number | null
          surface_terrain?: number | null
          nb_pieces?: number | null
          etat?: string | null
          dpe?: string | null
          annee_construction?: number | null
          equipements?: string[] | null
          delai?: string | null
          prix_estime?: number | null
          actif?: boolean
          matched_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          prospect_id?: string | null
          adresse?: string | null
          lat?: number | null
          lon?: number | null
          type_bien?: string | null
          sous_type?: string | null
          surface?: number | null
          surface_terrain?: number | null
          nb_pieces?: number | null
          etat?: string | null
          dpe?: string | null
          annee_construction?: number | null
          equipements?: string[] | null
          delai?: string | null
          prix_estime?: number | null
          actif?: boolean
          matched_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      match_results: {
        Row: {
          id: string
          buyer_lead_id: string
          property_id: string | null
          seller_lead_id: string | null
          property_type: string
          score: number
          score_details: Json
          matched_commune: boolean
          matched_type: boolean
          matched_budget: boolean
          matched_surface: boolean
          matched_pieces: boolean
          notified_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          buyer_lead_id: string
          property_id?: string | null
          seller_lead_id?: string | null
          property_type?: string
          score?: number
          score_details?: Json
          matched_commune?: boolean
          matched_type?: boolean
          matched_budget?: boolean
          matched_surface?: boolean
          matched_pieces?: boolean
          notified_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          buyer_lead_id?: string
          property_id?: string | null
          seller_lead_id?: string | null
          property_type?: string
          score?: number
          score_details?: Json
          matched_commune?: boolean
          matched_type?: boolean
          matched_budget?: boolean
          matched_surface?: boolean
          matched_pieces?: boolean
          notified_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      sync_runs: {
        Row: {
          id: string
          zone_id: string | null
          provider: string
          status: string
          started_at: string
          finished_at: string | null
          fetched_count: number
          created_count: number
          updated_count: number
          error_message: string | null
        }
        Insert: {
          id?: string
          zone_id?: string | null
          provider?: string
          status: string
          started_at?: string
          finished_at?: string | null
          fetched_count?: number
          created_count?: number
          updated_count?: number
          error_message?: string | null
        }
        Update: {
          id?: string
          zone_id?: string | null
          provider?: string
          status?: string
          started_at?: string
          finished_at?: string | null
          fetched_count?: number
          created_count?: number
          updated_count?: number
          error_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'sync_runs_zone_id_fkey'
            columns: ['zone_id']
            isOneToOne: false
            referencedRelation: 'monitored_zones'
            referencedColumns: ['id']
          },
        ]
      }
      warm_contacts: {
        Row: {
          id: string
          full_name: string
          relation: string | null
          phone: string | null
          email: string | null
          status: WarmContactStatus
          referrals: Json
          follow_up_date: string | null
          notes: string | null
          source: string
          last_contacted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          relation?: string | null
          phone?: string | null
          email?: string | null
          status?: WarmContactStatus
          referrals?: Json
          follow_up_date?: string | null
          notes?: string | null
          source?: string
          last_contacted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          relation?: string | null
          phone?: string | null
          email?: string | null
          status?: WarmContactStatus
          referrals?: Json
          follow_up_date?: string | null
          notes?: string | null
          source?: string
          last_contacted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      warm_contact_events: {
        Row: {
          id: string
          contact_id: string
          type: WarmEventType
          content: string | null
          metadata: Json
          occurred_at: string
          created_at: string
        }
        Insert: {
          id?: string
          contact_id: string
          type?: WarmEventType
          content?: string | null
          metadata?: Json
          occurred_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          contact_id?: string
          type?: WarmEventType
          content?: string | null
          metadata?: Json
          occurred_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'warm_contact_events_contact_id_fkey'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'warm_contacts'
            referencedColumns: ['id']
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
      lead_tool: LeadTool
      lead_status: LeadStatus
      lead_event_kind: LeadEventKind
      warm_contact_status: WarmContactStatus
      warm_event_type: WarmEventType
      admin_role: AdminRole
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}