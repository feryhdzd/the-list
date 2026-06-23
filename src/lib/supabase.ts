/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Category = 'recipe' | 'music' | 'book' | 'link' | 'list' | 'other'

export interface Recommendation {
  id: string
  created_at: string
  title: string
  category: Category
  url: string | null
  note: string | null
  posted_by: string
  likes: number
}

export interface Member {
  id: string
  name: string
  joined_at: string
}
