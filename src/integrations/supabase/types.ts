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
      advices: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_agent_documents: {
        Row: {
          agent_id: string
          content_type: string | null
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          content_type?: string | null
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          content_type?: string | null
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      body_metrics: {
        Row: {
          created_at: string
          id: string
          metric_type: string
          name: string
          notes: string | null
          recorded_at: string
          unit: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          metric_type: string
          name: string
          notes?: string | null
          recorded_at?: string
          unit: string
          updated_at?: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          metric_type?: string
          name?: string
          notes?: string | null
          recorded_at?: string
          unit?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      crm_contact_groups: {
        Row: {
          contact_id: string
          created_at: string
          group_id: string
          id: string
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          group_id: string
          id?: string
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          group_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_contact_groups_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_contact_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "crm_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          anniversary: string | null
          birthday: string | null
          company: string | null
          created_at: string
          custom_fields: Json | null
          email: string | null
          facebook: string | null
          first_name: string
          id: string
          instagram: string | null
          is_active: boolean | null
          is_archived: boolean
          is_favorite: boolean
          job_title: string | null
          last_name: string | null
          linkedin: string | null
          location: string | null
          met_at: string | null
          met_context: string | null
          met_location: string | null
          met_through: string | null
          mute_reminders: boolean
          nickname: string | null
          notes: string | null
          phone: string | null
          photo_url: string | null
          raw_import_data: Json | null
          tags: string[] | null
          twitter: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          anniversary?: string | null
          birthday?: string | null
          company?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          facebook?: string | null
          first_name: string
          id?: string
          instagram?: string | null
          is_active?: boolean | null
          is_archived?: boolean
          is_favorite?: boolean
          job_title?: string | null
          last_name?: string | null
          linkedin?: string | null
          location?: string | null
          met_at?: string | null
          met_context?: string | null
          met_location?: string | null
          met_through?: string | null
          mute_reminders?: boolean
          nickname?: string | null
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          raw_import_data?: Json | null
          tags?: string[] | null
          twitter?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          anniversary?: string | null
          birthday?: string | null
          company?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          facebook?: string | null
          first_name?: string
          id?: string
          instagram?: string | null
          is_active?: boolean | null
          is_archived?: boolean
          is_favorite?: boolean
          job_title?: string | null
          last_name?: string | null
          linkedin?: string | null
          location?: string | null
          met_at?: string | null
          met_context?: string | null
          met_location?: string | null
          met_through?: string | null
          mute_reminders?: boolean
          nickname?: string | null
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          raw_import_data?: Json | null
          tags?: string[] | null
          twitter?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      crm_groups: {
        Row: {
          color: string | null
          created_at: string
          icon: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crm_integrations: {
        Row: {
          access_token: string | null
          created_at: string
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          provider: string
          provider_email: string | null
          provider_user_id: string | null
          refresh_token: string | null
          settings: Json | null
          sync_error: string | null
          sync_status: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider: string
          provider_email?: string | null
          provider_user_id?: string | null
          refresh_token?: string | null
          settings?: Json | null
          sync_error?: string | null
          sync_status?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider?: string
          provider_email?: string | null
          provider_user_id?: string | null
          refresh_token?: string | null
          settings?: Json | null
          sync_error?: string | null
          sync_status?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crm_relationships: {
        Row: {
          contact_a_id: string
          contact_b_id: string
          created_at: string
          id: string
          inverse_relationship_type: string | null
          notes: string | null
          relationship_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_a_id: string
          contact_b_id: string
          created_at?: string
          id?: string
          inverse_relationship_type?: string | null
          notes?: string | null
          relationship_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_a_id?: string
          contact_b_id?: string
          created_at?: string
          id?: string
          inverse_relationship_type?: string | null
          notes?: string | null
          relationship_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_relationships_contact_a_id_fkey"
            columns: ["contact_a_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_relationships_contact_b_id_fkey"
            columns: ["contact_b_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_routines: {
        Row: {
          created_at: string
          daily_wins: Json | null
          date: string
          evening_reflection: string | null
          gratitude: Json | null
          id: string
          morning_intention: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_wins?: Json | null
          date?: string
          evening_reflection?: string | null
          gratitude?: Json | null
          id?: string
          morning_intention?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_wins?: Json | null
          date?: string
          evening_reflection?: string | null
          gratitude?: Json | null
          id?: string
          morning_intention?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dating_interests: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
          photo_url: string | null
          platform: string
          profile_url: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          photo_url?: string | null
          platform?: string
          profile_url: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          photo_url?: string | null
          platform?: string
          profile_url?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fin_account_snapshots: {
        Row: {
          account_id: string
          balance: number
          created_at: string | null
          id: string
          snapshot_date: string
        }
        Insert: {
          account_id: string
          balance: number
          created_at?: string | null
          id?: string
          snapshot_date: string
        }
        Update: {
          account_id?: string
          balance?: number
          created_at?: string | null
          id?: string
          snapshot_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "fin_account_snapshots_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "fin_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      fin_accounts: {
        Row: {
          account_address: string | null
          category_id: string | null
          created_at: string | null
          currency: string
          id: string
          investment_group_id: string | null
          is_active: boolean | null
          name: string
          type: string
          updated_at: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          account_address?: string | null
          category_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          investment_group_id?: string | null
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string | null
          url?: string | null
          user_id: string
        }
        Update: {
          account_address?: string | null
          category_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          investment_group_id?: string | null
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fin_accounts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "fin_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fin_accounts_investment_group_id_fkey"
            columns: ["investment_group_id"]
            isOneToOne: false
            referencedRelation: "fin_investment_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      fin_asset_snapshots: {
        Row: {
          asset_id: string
          created_at: string | null
          id: string
          snapshot_date: string
          value: number
        }
        Insert: {
          asset_id: string
          created_at?: string | null
          id?: string
          snapshot_date: string
          value: number
        }
        Update: {
          asset_id?: string
          created_at?: string | null
          id?: string
          snapshot_date?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "fin_asset_snapshots_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "fin_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      fin_assets: {
        Row: {
          category_id: string | null
          created_at: string | null
          currency: string
          id: string
          is_active: boolean | null
          name: string
          purchase_date: string | null
          purchase_price: number | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          is_active?: boolean | null
          name: string
          purchase_date?: string | null
          purchase_price?: number | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          is_active?: boolean | null
          name?: string
          purchase_date?: string | null
          purchase_price?: number | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fin_assets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "fin_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      fin_categories: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fin_exchange_connections: {
        Row: {
          api_key: string | null
          api_key_hint: string | null
          api_secret: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          name: string | null
          provider: string
          sync_error: string | null
          sync_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key?: string | null
          api_key_hint?: string | null
          api_secret?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          name?: string | null
          provider: string
          sync_error?: string | null
          sync_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key?: string | null
          api_key_hint?: string | null
          api_secret?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          name?: string | null
          provider?: string
          sync_error?: string | null
          sync_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fin_gocardless_connections: {
        Row: {
          created_at: string | null
          id: string
          institution_id: string
          institution_name: string | null
          is_active: boolean | null
          requisition_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          institution_id: string
          institution_name?: string | null
          is_active?: boolean | null
          requisition_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          institution_id?: string
          institution_name?: string | null
          is_active?: boolean | null
          requisition_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fin_investment_groups: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fin_liabilities: {
        Row: {
          created_at: string | null
          currency: string
          id: string
          interest_rate: number | null
          is_active: boolean | null
          name: string
          original_amount: number
          start_date: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string
          id?: string
          interest_rate?: number | null
          is_active?: boolean | null
          name: string
          original_amount: number
          start_date?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string
          id?: string
          interest_rate?: number | null
          is_active?: boolean | null
          name?: string
          original_amount?: number
          start_date?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fin_liability_snapshots: {
        Row: {
          balance: number
          created_at: string | null
          id: string
          liability_id: string
          snapshot_date: string
        }
        Insert: {
          balance: number
          created_at?: string | null
          id?: string
          liability_id: string
          snapshot_date: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          id?: string
          liability_id?: string
          snapshot_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "fin_liability_snapshots_liability_id_fkey"
            columns: ["liability_id"]
            isOneToOne: false
            referencedRelation: "fin_liabilities"
            referencedColumns: ["id"]
          },
        ]
      }
      fin_portfolio_item_snapshots: {
        Row: {
          created_at: string | null
          id: string
          portfolio_item_id: string
          price_per_unit: number
          quantity: number
          snapshot_date: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          portfolio_item_id: string
          price_per_unit: number
          quantity: number
          snapshot_date: string
        }
        Update: {
          created_at?: string | null
          id?: string
          portfolio_item_id?: string
          price_per_unit?: number
          quantity?: number
          snapshot_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "fin_portfolio_item_snapshots_portfolio_item_id_fkey"
            columns: ["portfolio_item_id"]
            isOneToOne: false
            referencedRelation: "fin_portfolio_items"
            referencedColumns: ["id"]
          },
        ]
      }
      fin_portfolio_items: {
        Row: {
          account_id: string
          cost_basis: number | null
          created_at: string | null
          currency: string
          id: string
          name: string
          price_per_unit: number | null
          purchase_date: string | null
          quantity: number
          security_id: string | null
          symbol: string | null
          updated_at: string | null
        }
        Insert: {
          account_id: string
          cost_basis?: number | null
          created_at?: string | null
          currency?: string
          id?: string
          name: string
          price_per_unit?: number | null
          purchase_date?: string | null
          quantity: number
          security_id?: string | null
          symbol?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          cost_basis?: number | null
          created_at?: string | null
          currency?: string
          id?: string
          name?: string
          price_per_unit?: number | null
          purchase_date?: string | null
          quantity?: number
          security_id?: string | null
          symbol?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fin_portfolio_items_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "fin_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fin_portfolio_items_security_id_fkey"
            columns: ["security_id"]
            isOneToOne: false
            referencedRelation: "fin_securities"
            referencedColumns: ["id"]
          },
        ]
      }
      fin_securities: {
        Row: {
          created_at: string | null
          currency: string
          exchange: string | null
          id: string
          is_active: boolean | null
          isin: string | null
          name: string
          symbol: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string
          exchange?: string | null
          id?: string
          is_active?: boolean | null
          isin?: string | null
          name: string
          symbol: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string
          exchange?: string | null
          id?: string
          is_active?: boolean | null
          isin?: string | null
          name?: string
          symbol?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      fin_security_prices: {
        Row: {
          created_at: string | null
          id: string
          price: number
          price_date: string
          security_id: string
          source: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          price: number
          price_date: string
          security_id: string
          source?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          price?: number
          price_date?: string
          security_id?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fin_security_prices_security_id_fkey"
            columns: ["security_id"]
            isOneToOne: false
            referencedRelation: "fin_securities"
            referencedColumns: ["id"]
          },
        ]
      }
      fin_truelayer_connections: {
        Row: {
          access_token: string
          created_at: string | null
          expires_at: string
          id: string
          institution_id: string | null
          institution_name: string | null
          is_active: boolean | null
          provider_id: string
          refresh_token: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_at: string
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          is_active?: boolean | null
          provider_id: string
          refresh_token: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          is_active?: boolean | null
          provider_id?: string
          refresh_token?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fin_yapily_connections: {
        Row: {
          application_user_uuid: string
          consent_id: string | null
          consent_token: string | null
          created_at: string | null
          id: string
          institution_id: string
          institution_name: string | null
          is_active: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          application_user_uuid: string
          consent_id?: string | null
          consent_token?: string | null
          created_at?: string | null
          id?: string
          institution_id: string
          institution_name?: string | null
          is_active?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          application_user_uuid?: string
          consent_id?: string | null
          consent_token?: string | null
          created_at?: string | null
          id?: string
          institution_id?: string
          institution_name?: string | null
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      inspiration_quotes: {
        Row: {
          author: string
          created_at: string | null
          display_order: number
          id: string
          is_active: boolean | null
          text: string
          updated_at: string | null
        }
        Insert: {
          author: string
          created_at?: string | null
          display_order?: number
          id?: string
          is_active?: boolean | null
          text: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          created_at?: string | null
          display_order?: number
          id?: string
          is_active?: boolean | null
          text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          config: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          config?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      n8n_workflows: {
        Row: {
          active: boolean | null
          created_at: string | null
          created_at_n8n: string | null
          id: string
          n8n_id: string
          name: string
          nodes_count: number | null
          raw_data: Json | null
          synced_at: string | null
          tags: Json | null
          updated_at: string | null
          updated_at_n8n: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          created_at_n8n?: string | null
          id?: string
          n8n_id: string
          name: string
          nodes_count?: number | null
          raw_data?: Json | null
          synced_at?: string | null
          tags?: Json | null
          updated_at?: string | null
          updated_at_n8n?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          created_at_n8n?: string | null
          id?: string
          n8n_id?: string
          name?: string
          nodes_count?: number | null
          raw_data?: Json | null
          synced_at?: string | null
          tags?: Json | null
          updated_at?: string | null
          updated_at_n8n?: string | null
        }
        Relationships: []
      }
      personal_profiles: {
        Row: {
          created_at: string
          id: string
          profile_data: Json
          profile_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_data?: Json
          profile_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_data?: Json
          profile_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      readwise_books: {
        Row: {
          asin: string | null
          author: string | null
          category: string | null
          cover_image_url: string | null
          created_at: string
          id: string
          last_highlight_at: string | null
          num_highlights: number | null
          readwise_id: string
          source: string | null
          source_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          asin?: string | null
          author?: string | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          last_highlight_at?: string | null
          num_highlights?: number | null
          readwise_id: string
          source?: string | null
          source_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          asin?: string | null
          author?: string | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          last_highlight_at?: string | null
          num_highlights?: number | null
          readwise_id?: string
          source?: string | null
          source_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      readwise_highlights: {
        Row: {
          book_id: string | null
          color: string | null
          created_at: string
          highlighted_at: string | null
          id: string
          location: number | null
          location_type: string | null
          note: string | null
          readwise_id: string
          tags: string[] | null
          text: string
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          book_id?: string | null
          color?: string | null
          created_at?: string
          highlighted_at?: string | null
          id?: string
          location?: number | null
          location_type?: string | null
          note?: string | null
          readwise_id: string
          tags?: string[] | null
          text: string
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          book_id?: string | null
          color?: string | null
          created_at?: string
          highlighted_at?: string | null
          id?: string
          location?: number | null
          location_type?: string | null
          note?: string | null
          readwise_id?: string
          tags?: string[] | null
          text?: string
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "readwise_highlights_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "readwise_books"
            referencedColumns: ["id"]
          },
        ]
      }
      readwise_reader_documents: {
        Row: {
          author: string | null
          category: string | null
          created_at: string
          first_opened_at: string | null
          id: string
          image_url: string | null
          last_opened_at: string | null
          location: string | null
          notes: string | null
          parent_id: string | null
          published_date: string | null
          reader_id: string
          reading_progress: number | null
          saved_at: string | null
          site_name: string | null
          source: string | null
          summary: string | null
          tags: Json | null
          title: string | null
          updated_at: string
          url: string | null
          user_id: string
          word_count: number | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          created_at?: string
          first_opened_at?: string | null
          id?: string
          image_url?: string | null
          last_opened_at?: string | null
          location?: string | null
          notes?: string | null
          parent_id?: string | null
          published_date?: string | null
          reader_id: string
          reading_progress?: number | null
          saved_at?: string | null
          site_name?: string | null
          source?: string | null
          summary?: string | null
          tags?: Json | null
          title?: string | null
          updated_at?: string
          url?: string | null
          user_id: string
          word_count?: number | null
        }
        Update: {
          author?: string | null
          category?: string | null
          created_at?: string
          first_opened_at?: string | null
          id?: string
          image_url?: string | null
          last_opened_at?: string | null
          location?: string | null
          notes?: string | null
          parent_id?: string | null
          published_date?: string | null
          reader_id?: string
          reading_progress?: number | null
          saved_at?: string | null
          site_name?: string | null
          source?: string | null
          summary?: string | null
          tags?: Json | null
          title?: string | null
          updated_at?: string
          url?: string | null
          user_id?: string
          word_count?: number | null
        }
        Relationships: []
      }
      rental_properties: {
        Row: {
          address: string | null
          agency_name: string | null
          available_date: string | null
          bathrooms: number | null
          bedrooms: number | null
          city: string | null
          contact_info: string | null
          contacted_at: string | null
          created_at: string
          description: string | null
          energy_label: string | null
          garden: boolean | null
          garden_surface: number | null
          id: string
          images: Json | null
          latitude: number | null
          listing_type: string | null
          location: string | null
          longitude: number | null
          notes: string | null
          parking: boolean | null
          parking_type: string | null
          postal_code: string | null
          price: number | null
          price_period: string | null
          scraped_data: Json | null
          source: string | null
          status: string
          surface_area: number | null
          tags: string[] | null
          title: string | null
          updated_at: string
          url: string
          user_id: string
          visit_date: string | null
        }
        Insert: {
          address?: string | null
          agency_name?: string | null
          available_date?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          contact_info?: string | null
          contacted_at?: string | null
          created_at?: string
          description?: string | null
          energy_label?: string | null
          garden?: boolean | null
          garden_surface?: number | null
          id?: string
          images?: Json | null
          latitude?: number | null
          listing_type?: string | null
          location?: string | null
          longitude?: number | null
          notes?: string | null
          parking?: boolean | null
          parking_type?: string | null
          postal_code?: string | null
          price?: number | null
          price_period?: string | null
          scraped_data?: Json | null
          source?: string | null
          status?: string
          surface_area?: number | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          url: string
          user_id: string
          visit_date?: string | null
        }
        Update: {
          address?: string | null
          agency_name?: string | null
          available_date?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          contact_info?: string | null
          contacted_at?: string | null
          created_at?: string
          description?: string | null
          energy_label?: string | null
          garden?: boolean | null
          garden_surface?: number | null
          id?: string
          images?: Json | null
          latitude?: number | null
          listing_type?: string | null
          location?: string | null
          longitude?: number | null
          notes?: string | null
          parking?: boolean | null
          parking_type?: string | null
          postal_code?: string | null
          price?: number | null
          price_period?: string | null
          scraped_data?: Json | null
          source?: string | null
          status?: string
          surface_area?: number | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          url?: string
          user_id?: string
          visit_date?: string | null
        }
        Relationships: []
      }
      routine_completions: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          date: string
          id: string
          routine_item_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          date?: string
          id?: string
          routine_item_id: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          date?: string
          id?: string
          routine_item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_completions_routine_item_id_fkey"
            columns: ["routine_item_id"]
            isOneToOne: false
            referencedRelation: "routine_items"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_items: {
        Row: {
          activity: string
          category: string
          created_at: string
          description: string | null
          display_order: number | null
          duration: string
          id: string
          is_active: boolean | null
          time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity: string
          category: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration?: string
          id?: string
          is_active?: boolean | null
          time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity?: string
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration?: string
          id?: string
          is_active?: boolean | null
          time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      strava_activities: {
        Row: {
          average_cadence: number | null
          average_heartrate: number | null
          average_speed: number | null
          average_watts: number | null
          created_at: string | null
          distance: number | null
          elapsed_time: number | null
          id: string
          kilojoules: number | null
          map_polyline: string | null
          max_heartrate: number | null
          max_speed: number | null
          moving_time: number | null
          name: string
          raw_data: Json | null
          sport_type: string | null
          start_date: string
          start_latitude: number | null
          start_longitude: number | null
          strava_id: number
          suffer_score: number | null
          total_elevation_gain: number | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_cadence?: number | null
          average_heartrate?: number | null
          average_speed?: number | null
          average_watts?: number | null
          created_at?: string | null
          distance?: number | null
          elapsed_time?: number | null
          id?: string
          kilojoules?: number | null
          map_polyline?: string | null
          max_heartrate?: number | null
          max_speed?: number | null
          moving_time?: number | null
          name: string
          raw_data?: Json | null
          sport_type?: string | null
          start_date: string
          start_latitude?: number | null
          start_longitude?: number | null
          strava_id: number
          suffer_score?: number | null
          total_elevation_gain?: number | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_cadence?: number | null
          average_heartrate?: number | null
          average_speed?: number | null
          average_watts?: number | null
          created_at?: string | null
          distance?: number | null
          elapsed_time?: number | null
          id?: string
          kilojoules?: number | null
          map_polyline?: string | null
          max_heartrate?: number | null
          max_speed?: number | null
          moving_time?: number | null
          name?: string
          raw_data?: Json | null
          sport_type?: string | null
          start_date?: string
          start_latitude?: number | null
          start_longitude?: number | null
          strava_id?: number
          suffer_score?: number | null
          total_elevation_gain?: number | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      strava_tokens: {
        Row: {
          access_token: string
          athlete_id: number
          created_at: string | null
          expires_at: number
          id: string
          refresh_token: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          athlete_id: number
          created_at?: string | null
          expires_at: number
          id?: string
          refresh_token: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          athlete_id?: number
          created_at?: string | null
          expires_at?: number
          id?: string
          refresh_token?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tesla_charging_sessions: {
        Row: {
          cost: number | null
          created_at: string
          end_battery: number | null
          end_time: string | null
          energy_added: number | null
          id: string
          is_active: boolean
          latitude: number | null
          location: string | null
          longitude: number | null
          max_power: number | null
          start_battery: number | null
          start_time: string
          type: string
          updated_at: string
          user_id: string
          vehicle_vin: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          end_battery?: number | null
          end_time?: string | null
          energy_added?: number | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          max_power?: number | null
          start_battery?: number | null
          start_time: string
          type?: string
          updated_at?: string
          user_id: string
          vehicle_vin: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          end_battery?: number | null
          end_time?: string | null
          energy_added?: number | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          max_power?: number | null
          start_battery?: number | null
          start_time?: string
          type?: string
          updated_at?: string
          user_id?: string
          vehicle_vin?: string
        }
        Relationships: []
      }
      training_assessment_exercises: {
        Row: {
          category: string
          created_at: string
          description: string | null
          exercise_id: string
          id: string
          instructions: string[] | null
          metric: string
          name: string
          tips: string[] | null
          unit: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          exercise_id: string
          id?: string
          instructions?: string[] | null
          metric?: string
          name: string
          tips?: string[] | null
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          exercise_id?: string
          id?: string
          instructions?: string[] | null
          metric?: string
          name?: string
          tips?: string[] | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_assessment_results: {
        Row: {
          assessment_id: string
          created_at: string
          exercise_id: string
          id: string
          notes: string | null
          unit: string
          user_id: string
          value: number
        }
        Insert: {
          assessment_id: string
          created_at?: string
          exercise_id: string
          id?: string
          notes?: string | null
          unit: string
          user_id: string
          value: number
        }
        Update: {
          assessment_id?: string
          created_at?: string
          exercise_id?: string
          id?: string
          notes?: string | null
          unit?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "training_assessment_results_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "training_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      training_assessments: {
        Row: {
          bodyweight: number | null
          created_at: string
          date: string
          id: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bodyweight?: number | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bodyweight?: number | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      training_climbing_sessions: {
        Row: {
          created_at: string
          duration_minutes: number | null
          grades_sent: Json | null
          id: string
          is_outdoor: boolean | null
          location: string | null
          notes: string | null
          quality_rating: number | null
          rpe: number | null
          session_date: string
          session_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          grades_sent?: Json | null
          id?: string
          is_outdoor?: boolean | null
          location?: string | null
          notes?: string | null
          quality_rating?: number | null
          rpe?: number | null
          session_date?: string
          session_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          grades_sent?: Json | null
          id?: string
          is_outdoor?: boolean | null
          location?: string | null
          notes?: string | null
          quality_rating?: number | null
          rpe?: number | null
          session_date?: string
          session_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      training_completions: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          person: string
          training_item_id: string
          trip_slug: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          person: string
          training_item_id: string
          trip_slug: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          person?: string
          training_item_id?: string
          trip_slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_exercises: {
        Row: {
          category: string
          created_at: string
          description: string | null
          difficulty: string | null
          id: string
          instructions: Json | null
          is_active: boolean | null
          name: string
          target_muscles: string[] | null
          tips: Json | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          instructions?: Json | null
          is_active?: boolean | null
          name: string
          target_muscles?: string[] | null
          tips?: Json | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          instructions?: Json | null
          is_active?: boolean | null
          name?: string
          target_muscles?: string[] | null
          tips?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      training_hangboard_sessions: {
        Row: {
          added_weight: number | null
          created_at: string
          duration: number
          edge_size: number
          grip_type: string
          id: string
          notes: string | null
          recorded_at: string
          rest_seconds: number | null
          sets: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          added_weight?: number | null
          created_at?: string
          duration: number
          edge_size: number
          grip_type: string
          id?: string
          notes?: string | null
          recorded_at?: string
          rest_seconds?: number | null
          sets?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          added_weight?: number | null
          created_at?: string
          duration?: number
          edge_size?: number
          grip_type?: string
          id?: string
          notes?: string | null
          recorded_at?: string
          rest_seconds?: number | null
          sets?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      training_plans: {
        Row: {
          created_at: string
          end_date: string | null
          goals: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          phase: string
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          goals?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          phase: string
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          goals?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          phase?: string
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      training_program_assessments: {
        Row: {
          assessed_at: string
          assessment_id: string
          created_at: string
          id: string
          notes: string | null
          program_id: string
          unit: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          assessed_at?: string
          assessment_id: string
          created_at?: string
          id?: string
          notes?: string | null
          program_id: string
          unit: string
          updated_at?: string
          user_id: string
          value: number
        }
        Update: {
          assessed_at?: string
          assessment_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          program_id?: string
          unit?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      training_program_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          item_id: string
          item_type: string
          notes: string | null
          program_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          notes?: string | null
          program_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          notes?: string | null
          program_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      training_program_sessions: {
        Row: {
          created_at: string
          day_of_week: number | null
          description: string | null
          display_order: number | null
          duration_minutes: number | null
          exercises: Json | null
          id: string
          name: string
          notes: string | null
          program_id: string
          session_type: string
          updated_at: string
          week_number: number
        }
        Insert: {
          created_at?: string
          day_of_week?: number | null
          description?: string | null
          display_order?: number | null
          duration_minutes?: number | null
          exercises?: Json | null
          id?: string
          name: string
          notes?: string | null
          program_id: string
          session_type?: string
          updated_at?: string
          week_number: number
        }
        Update: {
          created_at?: string
          day_of_week?: number | null
          description?: string | null
          display_order?: number | null
          duration_minutes?: number | null
          exercises?: Json | null
          id?: string
          name?: string
          notes?: string | null
          program_id?: string
          session_type?: string
          updated_at?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "training_program_sessions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_program_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      training_program_templates: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          difficulty_level: string
          display_order: number | null
          duration_weeks: number
          id: string
          is_active: boolean | null
          name: string
          target_goals: string[] | null
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string
          display_order?: number | null
          duration_weeks?: number
          id?: string
          is_active?: boolean | null
          name: string
          target_goals?: string[] | null
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string
          display_order?: number | null
          duration_weeks?: number
          id?: string
          is_active?: boolean | null
          name?: string
          target_goals?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      training_scheduled_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          program_session_id: string
          rating: number | null
          scheduled_date: string
          scheduled_time: string | null
          status: string
          updated_at: string
          user_id: string
          user_program_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          program_session_id: string
          rating?: number | null
          scheduled_date: string
          scheduled_time?: string | null
          status?: string
          updated_at?: string
          user_id: string
          user_program_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          program_session_id?: string
          rating?: number | null
          scheduled_date?: string
          scheduled_time?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          user_program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_scheduled_sessions_program_session_id_fkey"
            columns: ["program_session_id"]
            isOneToOne: false
            referencedRelation: "training_program_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_scheduled_sessions_user_program_id_fkey"
            columns: ["user_program_id"]
            isOneToOne: false
            referencedRelation: "training_user_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      training_user_programs: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean | null
          program_id: string
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          program_id: string
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          program_id?: string
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_user_programs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_program_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_locations: {
        Row: {
          accuracy: number | null
          altitude: number | null
          created_at: string
          heading: number | null
          id: string
          latitude: number
          longitude: number
          participant_name: string
          speed: number | null
          timestamp: string
          trip_slug: string
          updated_at: string
        }
        Insert: {
          accuracy?: number | null
          altitude?: number | null
          created_at?: string
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          participant_name: string
          speed?: number | null
          timestamp: string
          trip_slug: string
          updated_at?: string
        }
        Update: {
          accuracy?: number | null
          altitude?: number | null
          created_at?: string
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          participant_name?: string
          speed?: number | null
          timestamp?: string
          trip_slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          cover_image_url: string | null
          created_at: string
          custom_page_path: string | null
          description: string | null
          end_date: string | null
          id: string
          is_public: boolean
          location: string | null
          packing_list_data: Json | null
          slug: string
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          custom_page_path?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_public?: boolean
          location?: string | null
          packing_list_data?: Json | null
          slug: string
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          custom_page_path?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_public?: boolean
          location?: string | null
          packing_list_data?: Json | null
          slug?: string
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      crm_import_groups_from_raw_data: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
