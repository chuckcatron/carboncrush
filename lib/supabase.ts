import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client component helper
export const createSupabaseClient = () => createClientComponentClient()

// Server component helper
export const createSupabaseServerClient = () => createServerComponentClient({ cookies })

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          location: string | null
          carbon_goal: number | null
          onboarding_completed: boolean
          email_verified: boolean
          subscribe_newsletter: boolean
          signup_source: string
          avatar_url: string | null
          created_at: string
          updated_at: string
          preferences: {
            notifications: boolean
            public_profile: boolean
            share_progress: boolean
          }
        }
        Insert: {
          id: string
          email: string
          name: string
          location?: string | null
          carbon_goal?: number | null
          onboarding_completed?: boolean
          email_verified?: boolean
          subscribe_newsletter?: boolean
          signup_source?: string
          avatar_url?: string | null
          preferences?: {
            notifications: boolean
            public_profile: boolean
            share_progress: boolean
          }
        }
        Update: {
          id?: string
          email?: string
          name?: string
          location?: string | null
          carbon_goal?: number | null
          onboarding_completed?: boolean
          email_verified?: boolean
          subscribe_newsletter?: boolean
          signup_source?: string
          avatar_url?: string | null
          updated_at?: string
          preferences?: {
            notifications: boolean
            public_profile: boolean
            share_progress: boolean
          }
        }
      }
      carbon_calculations: {
        Row: {
          id: string
          user_id: string
          calculation_data: any
          results: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          calculation_data: any
          results: any
        }
        Update: {
          id?: string
          user_id?: string
          calculation_data?: any
          results?: any
        }
      }
      recommendations: {
        Row: {
          id: string
          user_id: string
          recommendation_data: any
          status: 'not-started' | 'in-progress' | 'completed'
          started_at: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recommendation_data: any
          status?: 'not-started' | 'in-progress' | 'completed'
          started_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          recommendation_data?: any
          status?: 'not-started' | 'in-progress' | 'completed'
          started_at?: string | null
          completed_at?: string | null
        }
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
  }
}