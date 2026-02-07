import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a singleton client for client-side use
let client: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!client) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
      );
    }
    client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

// Export for direct use
export const supabase = getSupabaseClient();
