import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// 数据库表结构
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          password: string
          role: 'admin' | 'member'
          is_blocked: boolean
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          password: string
          role?: 'admin' | 'member'
          is_blocked?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password?: string
          role?: 'admin' | 'member'
          is_blocked?: boolean
          created_at?: string
        }
      }
      strains: {
        Row: {
          id: string
          name: string
          scientific_name: string
          type: string
          description: string
          source: string
          preservation_method: string
          preservation_temperature: string
          location: string
          added_by: string
          added_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          scientific_name: string
          type: string
          description: string
          source: string
          preservation_method: string
          preservation_temperature: string
          location: string
          added_by: string
          added_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          scientific_name?: string
          type?: string
          description?: string
          source?: string
          preservation_method?: string
          preservation_temperature?: string
          location?: string
          added_by?: string
          added_at?: string
          updated_at?: string
        }
      }
      members: {
        Row: {
          id: string
          name: string
          group: string
          phone: string
          grade: string | null
          class: string | null
          thesis_content: string | null
          other_info: string | null
          joined_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          group: string
          phone: string
          grade?: string | null
          class?: string | null
          thesis_content?: string | null
          other_info?: string | null
          joined_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          group?: string
          phone?: string
          grade?: string | null
          class?: string | null
          thesis_content?: string | null
          other_info?: string | null
          joined_at?: string
          updated_at?: string
        }
      }
      duty_schedules: {
        Row: {
          id: string
          date: string
          members: string[]
          tasks: string[]
          status: 'pending' | 'completed' | 'skipped'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          members: string[]
          tasks: string[]
          status?: 'pending' | 'completed' | 'skipped'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          members?: string[]
          tasks?: string[]
          status?: 'pending' | 'completed' | 'skipped'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      media: {
        Row: {
          id: string
          name: string
          type: 'liquid' | 'solid'
          suitable_strains: string[]
          formula: string
          cultivation_params: {
            temperature: string
            time: string
            ph: string
            other: string
          }
          recommended_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: 'liquid' | 'solid'
          suitable_strains: string[]
          formula: string
          cultivation_params?: {
            temperature: string
            time: string
            ph: string
            other: string
          }
          recommended_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'liquid' | 'solid'
          suitable_strains?: string[]
          formula?: string
          cultivation_params?: {
            temperature: string
            time: string
            ph: string
            other: string
          }
          recommended_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      theses: {
        Row: {
          id: string
          title: string
          author: string
          grade: string
          class: string
          other_content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          grade: string
          class: string
          other_content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          grade?: string
          class?: string
          other_content?: string
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string
          username: string
          action: string
          module: string
          details: string
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          action: string
          module: string
          details: string
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          action?: string
          module?: string
          details?: string
          timestamp?: string
        }
      }
    }
  }
}