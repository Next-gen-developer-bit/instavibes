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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          instagram_handle: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          instagram_handle?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          instagram_handle?: string | null
          onboarding_completed?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          status: 'trialing' | 'active' | 'canceled' | 'past_due' | 'incomplete'
          billing_interval: 'month' | 'year' | null
          current_period_start: string | null
          current_period_end: string | null
          trial_end: string | null
          cancel_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: 'trialing' | 'active' | 'canceled' | 'past_due' | 'incomplete'
          billing_interval?: 'month' | 'year' | null
          current_period_start?: string | null
          current_period_end?: string | null
          trial_end?: string | null
          cancel_at?: string | null
        }
        Update: {
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: 'trialing' | 'active' | 'canceled' | 'past_due' | 'incomplete'
          billing_interval?: 'month' | 'year' | null
          current_period_start?: string | null
          current_period_end?: string | null
          trial_end?: string | null
          cancel_at?: string | null
        }
        Relationships: []
      }
      content_brains: {
        Row: {
          id: string
          user_id: string
          tone: Json
          topics: Json
          hooks_style: Json
          audience: string | null
          offers: string | null
          storytelling_patterns: Json
          language_preference: 'english' | 'hindi' | 'hinglish'
          raw_analysis: Json | null
          last_analyzed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tone?: Json
          topics?: Json
          hooks_style?: Json
          audience?: string | null
          offers?: string | null
          storytelling_patterns?: Json
          language_preference?: 'english' | 'hindi' | 'hinglish'
          raw_analysis?: Json | null
          last_analyzed_at?: string | null
        }
        Update: {
          tone?: Json
          topics?: Json
          hooks_style?: Json
          audience?: string | null
          offers?: string | null
          storytelling_patterns?: Json
          language_preference?: 'english' | 'hindi' | 'hinglish'
          raw_analysis?: Json | null
          last_analyzed_at?: string | null
        }
        Relationships: []
      }
      reels: {
        Row: {
          id: string
          platform: 'instagram'
          platform_id: string
          url: string
          creator_handle: string | null
          creator_name: string | null
          creator_profile_pic: string | null
          caption: string | null
          transcript: string | null
          thumbnail_url: string | null
          video_url: string | null
          view_count: number
          like_count: number
          comment_count: number
          share_count: number
          engagement_rate: number
          duration_seconds: number | null
          audio_name: string | null
          hashtags: Json
          niche: string | null
          hook_text: string | null
          hook_category: string | null
          posted_at: string | null
          scraped_at: string
          created_at: string
        }
        Insert: {
          id?: string
          platform: 'instagram'
          platform_id: string
          url: string
          creator_handle?: string | null
          creator_name?: string | null
          creator_profile_pic?: string | null
          caption?: string | null
          transcript?: string | null
          thumbnail_url?: string | null
          video_url?: string | null
          view_count?: number
          like_count?: number
          comment_count?: number
          share_count?: number
          engagement_rate?: number
          duration_seconds?: number | null
          audio_name?: string | null
          hashtags?: Json
          niche?: string | null
          hook_text?: string | null
          hook_category?: string | null
          posted_at?: string | null
          scraped_at?: string
        }
        Update: {
          view_count?: number
          like_count?: number
          comment_count?: number
          share_count?: number
          engagement_rate?: number
          niche?: string | null
          hook_text?: string | null
          hook_category?: string | null
          scraped_at?: string
        }
        Relationships: []
      }
      scripts: {
        Row: {
          id: string
          user_id: string
          source_reel_id: string | null
          source_url: string | null
          title: string | null
          idea: string | null
          hook: string | null
          script_body: string | null
          on_screen_text: string | null
          language: 'english' | 'hindi' | 'hinglish'
          status: 'idea' | 'hook' | 'script' | 'filming' | 'ready' | 'posted'
          scheduled_date: string | null
          tags: Json
          is_saved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          source_reel_id?: string | null
          source_url?: string | null
          title?: string | null
          idea?: string | null
          hook?: string | null
          script_body?: string | null
          on_screen_text?: string | null
          language?: 'english' | 'hindi' | 'hinglish'
          status?: 'idea' | 'hook' | 'script' | 'filming' | 'ready' | 'posted'
          scheduled_date?: string | null
          tags?: Json
          is_saved?: boolean
        }
        Update: {
          title?: string | null
          idea?: string | null
          hook?: string | null
          script_body?: string | null
          on_screen_text?: string | null
          language?: 'english' | 'hindi' | 'hinglish'
          status?: 'idea' | 'hook' | 'script' | 'filming' | 'ready' | 'posted'
          scheduled_date?: string | null
          tags?: Json
          is_saved?: boolean
        }
        Relationships: []
      }
      watchlist: {
        Row: {
          id: string
          user_id: string
          creator_handle: string
          creator_name: string | null
          creator_profile_pic: string | null
          creator_followers: number
          creator_avg_views: number
          creator_avg_likes: number
          last_scraped_at: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          creator_handle: string
          creator_name?: string | null
          creator_profile_pic?: string | null
          creator_followers?: number
          creator_avg_views?: number
          creator_avg_likes?: number
          last_scraped_at?: string | null
          is_active?: boolean
        }
        Update: {
          creator_name?: string | null
          creator_profile_pic?: string | null
          creator_followers?: number
          creator_avg_views?: number
          creator_avg_likes?: number
          last_scraped_at?: string | null
          is_active?: boolean
        }
        Relationships: []
      }
      collections: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          color: string
          icon: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          color?: string
          icon?: string
        }
        Update: {
          name?: string
          description?: string | null
          color?: string
          icon?: string
        }
        Relationships: []
      }
      scraper_jobs: {
        Row: {
          id: string
          user_id: string | null
          job_type: string
          apify_run_id: string | null
          input_data: Json
          status: 'pending' | 'running' | 'succeeded' | 'failed' | null
          result_count: number | null
          error_message: string | null
          started_at: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          job_type: string
          apify_run_id?: string | null
          input_data?: Json
          status?: 'pending' | 'running' | 'succeeded' | 'failed' | null
          result_count?: number | null
          error_message?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          status?: 'pending' | 'running' | 'succeeded' | 'failed' | null
          result_count?: number | null
          error_message?: string | null
          started_at?: string | null
          completed_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      user_with_subscription: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          instagram_handle: string | null
          onboarding_completed: boolean
          subscription_status: string | null
          billing_interval: string | null
          trial_end: string | null
          current_period_end: string | null
          is_subscribed: boolean
        }
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: {
      subscription_status: 'trialing' | 'active' | 'canceled' | 'past_due' | 'incomplete'
      billing_interval: 'month' | 'year'
      script_status: 'idea' | 'hook' | 'script' | 'filming' | 'ready' | 'posted'
      scraper_job_status: 'pending' | 'running' | 'succeeded' | 'failed'
    }
    CompositeTypes: Record<string, never>
  }
}
