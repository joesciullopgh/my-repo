'use client';

import { create } from 'zustand';
import type { User } from '@/types/database';
import * as auth from '@/lib/supabase/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true });
    try {
      const user = await auth.getCurrentUser();
      set({ user, isInitialized: true, isLoading: false });

      // Listen for auth state changes
      auth.onAuthStateChange((user) => {
        set({ user });
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isInitialized: true, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await auth.signIn(email, password);

      if (result.error) {
        set({ isLoading: false, error: result.error.message });
        return false;
      }

      set({ user: result.user, isLoading: false, error: null });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false, error: 'An unexpected error occurred' });
      return false;
    }
  },

  signup: async (email: string, password: string, firstName: string, lastName: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await auth.signUp(email, password, firstName, lastName);

      if (result.error) {
        set({ isLoading: false, error: result.error.message });
        return false;
      }

      set({ user: result.user, isLoading: false, error: null });
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      set({ isLoading: false, error: 'An unexpected error occurred' });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      // Clear local state first for immediate UI update
      set({ user: null });

      // Then sign out from Supabase
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await auth.resetPassword(email);

      if (result.error) {
        set({ isLoading: false, error: result.error.message });
        return false;
      }

      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      set({ isLoading: false, error: 'An unexpected error occurred' });
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Selector hooks for convenience
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user);
export const useIsAdmin = () => useAuthStore((state) => state.user?.role === 'admin');
export const useIsStaff = () => useAuthStore((state) => state.user?.role === 'staff' || state.user?.role === 'admin');
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
