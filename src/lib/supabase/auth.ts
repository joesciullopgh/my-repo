import { supabase } from './client';
import type { User, UserRole, Profile } from '@/types/database';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResult {
  user: User | null;
  error: AuthError | null;
}

// Helper to convert profile to user
function profileToUser(profile: Profile): User {
  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    phone: profile.phone,
    role: profile.role,
    isActive: profile.is_active,
    stars: profile.stars,
  };
}

// Sign up with email and password
export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthResult> {
  try {
    // Create auth user
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
      return { user: null, error: { message: 'Failed to create account' } };
    }

    // Wait for profile trigger to create profile
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Fetch the created profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      // Profile might not exist yet due to trigger timing
      // Return basic user info
      return {
        user: {
          id: data.user.id,
          email: email,
          firstName: firstName,
          lastName: lastName,
          phone: null,
          role: 'customer' as UserRole,
          isActive: true,
          stars: 0,
        },
        error: null,
      };
    }

    return {
      user: profileToUser(profile as unknown as Profile),
      error: null,
    };
  } catch (err) {
    console.error('Sign up error:', err);
    return { user: null, error: { message: 'An unexpected error occurred' } };
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
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

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      return { user: null, error: { message: 'Profile not found' } };
    }

    const typedProfile = profile as unknown as Profile;

    // Check if account is active
    if (!typedProfile.is_active) {
      await supabase.auth.signOut();
      return { user: null, error: { message: 'Your account has been deactivated' } };
    }

    return {
      user: profileToUser(typedProfile),
      error: null,
    };
  } catch (err) {
    console.error('Sign in error:', err);
    return { user: null, error: { message: 'An unexpected error occurred' } };
  }
}

// Sign out
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: { message: error.message } };
    }
    return { error: null };
  } catch (err) {
    console.error('Sign out error:', err);
    return { error: { message: 'An unexpected error occurred' } };
  }
}

// Get current user from session
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return null;
    }

    return profileToUser(profile as unknown as Profile);
  } catch (err) {
    console.error('Get current user error:', err);
    return null;
  }
}

// Send password reset email
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`,
    });

    if (error) {
      return { error: { message: error.message } };
    }

    return { error: null };
  } catch (err) {
    console.error('Reset password error:', err);
    return { error: { message: 'An unexpected error occurred' } };
  }
}

// Update password (for reset flow)
export async function updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { error: { message: error.message } };
    }

    return { error: null };
  } catch (err) {
    console.error('Update password error:', err);
    return { error: { message: 'An unexpected error occurred' } };
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        callback(profileToUser(profile as unknown as Profile));
      } else {
        callback(null);
      }
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    }
  });
}
