// Database types for Supabase
// These types define the shape of our database tables

export type UserRole = 'customer' | 'staff' | 'admin';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

// Profile table - extends Supabase auth.users
export interface Profile {
  id: string; // UUID, references auth.users.id
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  stars: number; // Reward points
  created_at: string;
  updated_at: string;
}

// Menu item table
export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null; // Some specials may not have prices
  category: string;
  ingredients: string[] | null;
  options: string[] | null; // e.g., ["hot", "cold"]
  notes: string | null; // Barista notes
  origin: string | null; // For European classics
  century: string | null; // For European classics
  availability: string | null; // e.g., "Friday-Sunday"
  toppings: string[] | null;
  image_url: string | null;
  is_available: boolean;
  display_order: number;
  created_by: string | null; // UUID of admin who created
  created_at: string;
  updated_at: string;
}

// Order table
export interface Order {
  id: string;
  user_id: string; // References profiles.id
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Order item (stored as JSONB in orders.items)
export interface OrderItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  customizations: {
    size?: string;
    milk?: string;
    espresso?: string;
    temperature?: string;
    sweetener?: string;
    toppings?: string[];
    spread?: string;
    notes?: string;
  };
}

// Favorites table
export interface Favorite {
  id: string;
  user_id: string; // References profiles.id
  menu_item_id: string; // References menu_items.id
  created_at: string;
}

// Supabase Database type (for type-safe queries)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      menu_items: {
        Row: MenuItem;
        Insert: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<MenuItem, 'id' | 'created_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Order, 'id' | 'created_at'>>;
      };
      favorites: {
        Row: Favorite;
        Insert: Omit<Favorite, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Favorite, 'id' | 'created_at'>>;
      };
    };
  };
}

// Helper type for user with profile data
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  stars: number;
}

// Convert database profile to app user
export function profileToUser(profile: Profile): User {
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
