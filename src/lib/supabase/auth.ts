/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from './client';
import { User as AppUser, PaymentMethod } from '@/types';

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResult {
  user: AppUser | null;
  error: AuthError | null;
}

// Convert database profile to app User type
function profileToUser(profile: any, favorites: string[] = [], paymentMethods: PaymentMethod[] = []): AppUser {
  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    phone: profile.phone || undefined,
    role: profile.role,
    isActive: profile.is_active,
    createdAt: new Date(profile.created_at),
    lastLoginAt: profile.last_login_at ? new Date(profile.last_login_at) : undefined,
    rewards: {
      stars: profile.stars,
      tier: profile.tier,
      starsToNextReward: profile.stars_to_next_reward,
      availableRewards: [], // Will be fetched separately if needed
    },
    favoriteItems: favorites,
    favoriteLocations: [],
    orderHistory: [],
    paymentMethods: paymentMethods,
    defaultPaymentMethod: paymentMethods.find(pm => pm.isDefault)?.id,
  };
}

// Sign up with email and password
export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthResult> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    return { user: null, error: { message: error.message, status: error.status } };
  }

  if (!data.user) {
    return { user: null, error: { message: 'Failed to create user' } };
  }

  // Wait a moment for the trigger to create the profile
  await new Promise(resolve => setTimeout(resolve, 500));

  // Fetch the created profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profile) {
    return { user: profileToUser(profile), error: null };
  }

  // If profile doesn't exist yet, create a basic user object
  return {
    user: profileToUser({
      id: data.user.id,
      email: data.user.email,
      first_name: firstName,
      last_name: lastName,
      role: 'customer',
      is_active: true,
      stars: 0,
      tier: 'green',
      stars_to_next_reward: 50,
      created_at: new Date().toISOString(),
    }),
    error: null,
  };
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<AuthResult> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error: { message: error.message, status: error.status } };
  }

  if (!data.user) {
    return { user: null, error: { message: 'Failed to sign in' } };
  }

  // Fetch user profile with related data
  const user = await fetchUserProfile(data.user.id);
  return { user, error: null };
}

// Sign out
export async function signOut(): Promise<{ error: AuthError | null }> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: { message: error.message } };
  }

  return { error: null };
}

// Get current session user
export async function getCurrentUser(): Promise<AppUser | null> {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return fetchUserProfile(user.id);
}

// Fetch full user profile with related data
export async function fetchUserProfile(userId: string): Promise<AppUser | null> {
  const supabase = getSupabaseClient();

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    console.error('Error fetching profile:', profileError);
    return null;
  }

  // Fetch favorites
  const { data: favorites } = await supabase
    .from('favorites')
    .select('menu_item_id')
    .eq('user_id', userId);

  // Fetch payment methods
  const { data: paymentMethods } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId);

  const favoriteIds = (favorites || []).map((f: any) => f.menu_item_id);
  const formattedPaymentMethods: PaymentMethod[] = (paymentMethods || []).map((pm: any) => ({
    id: pm.id,
    type: pm.type,
    last4: pm.last4 || undefined,
    brand: pm.brand || undefined,
    balance: pm.balance || undefined,
    isDefault: pm.is_default,
  }));

  // Update last login
  await supabase
    .from('profiles')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', userId);

  return profileToUser(profile, favoriteIds, formattedPaymentMethods);
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: AppUser | null) => void) {
  const supabase = getSupabaseClient();

  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const user = await fetchUserProfile(session.user.id);
      callback(user);
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    }
  });
}
