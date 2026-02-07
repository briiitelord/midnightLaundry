/* AUTO-GENERATED - Update with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      music_items: {
        Row: {
          id: string
          title: string
          description: string | null
          category: 'new_release' | 'mix' | 'beat_for_sale' | 'podcast_clip' | 'exclusive_release'
          embed_url: string | null
          file_url: string | null
          price: number
          is_exclusive: boolean
          embed_full_track: boolean
          preview_url: string | null
          preview_status: string | null
          legal_docs: string[]
          producer_credit: string
          view_count: number
          slug: string | null
          source_type: 'direct_upload' | 'united_masters'
          united_masters_link: string | null
          license_single_use_price: number | null
          license_master_file_price: number | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: 'new_release' | 'mix' | 'beat_for_sale' | 'podcast_clip' | 'exclusive_release'
          embed_url?: string | null
          file_url?: string | null
          price?: number
          is_exclusive?: boolean
          embed_full_track?: boolean
          preview_url?: string | null
          preview_status?: string | null
          legal_docs?: string[]
          producer_credit?: string
          view_count?: number
          slug?: string | null
          source_type?: 'direct_upload' | 'united_masters'
          united_masters_link?: string | null
          license_single_use_price?: number | null
          license_master_file_price?: number | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: 'new_release' | 'mix' | 'beat_for_sale' | 'podcast_clip' | 'exclusive_release'
          embed_url?: string | null
          file_url?: string | null
          price?: number
          is_exclusive?: boolean
          embed_full_track?: boolean
          preview_url?: string | null
          preview_status?: string | null
          legal_docs?: string[]
          producer_credit?: string
          view_count?: number
          slug?: string | null
          source_type?: 'direct_upload' | 'united_masters'
          united_masters_link?: string | null
          license_single_use_price?: number | null
          license_master_file_price?: number | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          id: string
          title: string
          description: string | null
          content_rating: 'sfw' | 'nsfw'
          embed_url: string | null
          file_url: string | null
          is_paygated: boolean
          paygate_url: string | null
          preview_url: string | null
          preview_blurred_url: string | null
          preview_status: string | null
          preview_ts: number | null
          slug: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          content_rating: 'sfw' | 'nsfw'
          embed_url?: string | null
          file_url?: string | null
          is_paygated?: boolean
          paygate_url?: string | null
          preview_url?: string | null
          preview_blurred_url?: string | null
          preview_status?: string | null
          preview_ts?: number | null
          slug?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          content_rating?: 'sfw' | 'nsfw'
          embed_url?: string | null
          file_url?: string | null
          is_paygated?: boolean
          paygate_url?: string | null
          preview_url?: string | null
          preview_blurred_url?: string | null
          preview_status?: string | null
          preview_ts?: number | null
          slug?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      writing_pieces: {
        Row: {
          id: string
          title: string
          category: 'poetry' | 'short_story' | 'extended_work'
          content: string | null
          file_url: string | null
          excerpt: string | null
          price: number
          slug: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          category: 'poetry' | 'short_story' | 'extended_work'
          content?: string | null
          file_url?: string | null
          excerpt?: string | null
          price?: number
          slug?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: 'poetry' | 'short_story' | 'extended_work'
          content?: string | null
          file_url?: string | null
          excerpt?: string | null
          price?: number
          slug?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      research_papers: {
        Row: {
          id: string
          title: string
          description: string | null
          file_url: string
          slug: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          file_url: string
          slug?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          file_url?: string
          slug?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      research_citations: {
        Row: {
          id: string
          research_paper_id: string
          citation_text: string
          order_index: number
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          research_paper_id: string
          citation_text: string
          order_index?: number
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          research_paper_id?: string
          citation_text?: string
          order_index?: number
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_citations_research_paper_id_fkey"
            columns: ["research_paper_id"]
            isOneToOne: false
            referencedRelation: "research_papers"
            referencedColumns: ["id"]
          }
        ]
      }
      social_posts: {
        Row: {
          id: string
          platform: string
          content: string
          post_url: string
          platform_logo_url: string | null
          posted_at: string
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform: string
          content: string
          post_url: string
          platform_logo_url?: string | null
          posted_at: string
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: string
          content?: string
          post_url?: string
          platform_logo_url?: string | null
          posted_at?: string
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          sender_name: string
          sender_email: string
          message_content: string
          is_read: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_name: string
          sender_email: string
          message_content: string
          is_read?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_name?: string
          sender_email?: string
          message_content?: string
          is_read?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      gifts: {
        Row: {
          id: string
          sender_name: string | null
          sender_email: string | null
          amount: number
          payment_method: string | null
          message: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_name?: string | null
          sender_email?: string | null
          amount: number
          payment_method?: string | null
          message?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_name?: string | null
          sender_email?: string | null
          amount?: number
          payment_method?: string | null
          message?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      commission_inquiries: {
        Row: {
          id: string
          name: string
          email: string
          inquiry_type: 'personal' | 'business_licensing' | 'creative_pursuit'
          project_description: string
          budget_range: string | null
          status: 'pending' | 'reviewed' | 'accepted' | 'declined'
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          inquiry_type: 'personal' | 'business_licensing' | 'creative_pursuit'
          project_description: string
          budget_range?: string | null
          status?: 'pending' | 'reviewed' | 'accepted' | 'declined'
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          inquiry_type?: 'personal' | 'business_licensing' | 'creative_pursuit'
          project_description?: string
          budget_range?: string | null
          status?: 'pending' | 'reviewed' | 'accepted' | 'declined'
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      legal_documents: {
        Row: {
          id: string
          slug: string
          title: string
          content: string
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          content: string
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          content?: string
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      scribbles: {
        Row: {
          id: string
          title: string
          description: string | null
          pdf_url: string
          is_active: boolean
          display_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          pdf_url: string
          is_active?: boolean
          display_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          pdf_url?: string
          is_active?: boolean
          display_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_accounts: {
        Row: {
          id: string
          platform: 'twitter' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'facebook'
          account_name: string
          account_url: string
          is_active: boolean
          auto_sync: boolean
          sync_frequency_minutes: number
          last_synced_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform: 'twitter' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'facebook'
          account_name: string
          account_url: string
          is_active?: boolean
          auto_sync?: boolean
          sync_frequency_minutes?: number
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: 'twitter' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'facebook'
          account_name?: string
          account_url?: string
          is_active?: boolean
          auto_sync?: boolean
          sync_frequency_minutes?: number
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          id: string
          error_message: string
          error_type: string | null
          error_stack: string | null
          page_url: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          error_message: string
          error_type?: string | null
          error_stack?: string | null
          page_url?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          error_message?: string
          error_type?: string | null
          error_stack?: string | null
          page_url?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {}
    CompositeTypes: {}
  }
}
