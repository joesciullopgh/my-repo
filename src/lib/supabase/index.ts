// Supabase client and utilities
export { supabase, getSupabaseClient } from './client';

// Auth functions
export {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  resetPassword,
  updatePassword,
  onAuthStateChange,
} from './auth';

export type { AuthError, AuthResult } from './auth';
