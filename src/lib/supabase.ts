import { createClient } from '@supabase/supabase-js';

// 使用新的 Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://clddplwlwqzwcmuvieuw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_WDdMi3jNo5u3R0raibGAA_mZCa8ZCR';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
});