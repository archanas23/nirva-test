// Supabase client configuration for production
// This file should be created when you're ready to implement real backend

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          updated_at?: string
        }
      }
      user_class_packs: {
        Row: {
          id: string
          user_id: string
          five_pack: number
          ten_pack: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          five_pack?: number
          ten_pack?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          five_pack?: number
          ten_pack?: number
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          teacher: string
          day_of_week: number
          start_time: string
          end_time: string
          duration: string
          level: string
          max_students: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          teacher: string
          day_of_week: number
          start_time: string
          end_time: string
          duration: string
          level: string
          max_students?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          teacher?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          duration?: string
          level?: string
          max_students?: number
        }
      }
      class_bookings: {
        Row: {
          id: string
          user_id: string
          class_id: string
          class_date: string
          payment_method: string
          amount: number
          stripe_payment_id: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          class_id: string
          class_date: string
          payment_method: string
          amount: number
          stripe_payment_id?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          class_id?: string
          class_date?: string
          payment_method?: string
          amount?: number
          stripe_payment_id?: string | null
          status?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          stripe_payment_intent_id: string | null
          amount: number
          status: string
          package_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_intent_id?: string | null
          amount: number
          status: string
          package_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_intent_id?: string | null
          amount?: number
          status?: string
          package_type?: string | null
        }
      }
    }
  }
}