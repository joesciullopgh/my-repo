import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug: Log if environment variables are missing
if (typeof window !== 'undefined') {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('SUPABASE CONFIG ERROR: Missing environment variables!', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
    });
  } else {
    console.log('Supabase configured with URL:', supabaseUrl);
  }
}

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Singleton instance for client-side use
let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!client) {
    client = createClient();
  }
  return client;
}
