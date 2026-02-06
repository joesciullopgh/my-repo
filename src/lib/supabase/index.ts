// Supabase client and utilities
export { createClient, getSupabaseClient } from './client';
export type { Database } from './types';

// Auth functions
export {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  fetchUserProfile,
  onAuthStateChange,
} from './auth';
export type { AuthError, AuthResult } from './auth';

// Database functions
export {
  // User management
  getAllUsers,
  updateUserRole,
  updateUserProfile,
  toggleUserActive,
  deleteUser,
  addStars,
  // Favorites
  addFavorite,
  removeFavorite,
  getUserFavorites,
  // Orders
  createOrder,
  getUserOrders,
  updateOrderStatus,
  // Payment methods
  addPaymentMethod,
  getUserPaymentMethods,
} from './database';
