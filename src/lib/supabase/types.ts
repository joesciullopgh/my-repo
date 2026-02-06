export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'customer' | 'staff' | 'admin';
export type RewardsTier = 'green' | 'gold' | 'platinum';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethodType = 'card' | 'moonbeam-card' | 'apple-pay' | 'google-pay';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          role: UserRole;
          is_active: boolean;
          stars: number;
          tier: RewardsTier;
          stars_to_next_reward: number;
          created_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone?: string | null;
          role?: UserRole;
          is_active?: boolean;
          stars?: number;
          tier?: RewardsTier;
          stars_to_next_reward?: number;
          created_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          role?: UserRole;
          is_active?: boolean;
          stars?: number;
          tier?: RewardsTier;
          stars_to_next_reward?: number;
          created_at?: string;
          last_login_at?: string | null;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          location_id: string;
          location_name: string;
          location_address: string;
          status: OrderStatus;
          subtotal: number;
          tax: number;
          tip: number;
          total: number;
          payment_method_id: string | null;
          estimated_ready_time: string | null;
          actual_ready_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          location_id: string;
          location_name: string;
          location_address: string;
          status?: OrderStatus;
          subtotal: number;
          tax: number;
          tip?: number;
          total: number;
          payment_method_id?: string | null;
          estimated_ready_time?: string | null;
          actual_ready_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          location_id?: string;
          location_name?: string;
          location_address?: string;
          status?: OrderStatus;
          subtotal?: number;
          tax?: number;
          tip?: number;
          total?: number;
          payment_method_id?: string | null;
          estimated_ready_time?: string | null;
          actual_ready_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string;
          menu_item_name: string;
          quantity: number;
          size: string;
          base_price: number;
          customization_price: number;
          total_price: number;
          customizations: Json;
          special_instructions: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id: string;
          menu_item_name: string;
          quantity: number;
          size: string;
          base_price: number;
          customization_price?: number;
          total_price: number;
          customizations?: Json;
          special_instructions?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string;
          menu_item_name?: string;
          quantity?: number;
          size?: string;
          base_price?: number;
          customization_price?: number;
          total_price?: number;
          customizations?: Json;
          special_instructions?: string | null;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          menu_item_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          menu_item_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          menu_item_id?: string;
          created_at?: string;
        };
      };
      payment_methods: {
        Row: {
          id: string;
          user_id: string;
          type: PaymentMethodType;
          last4: string | null;
          brand: string | null;
          balance: number | null;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: PaymentMethodType;
          last4?: string | null;
          brand?: string | null;
          balance?: number | null;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: PaymentMethodType;
          last4?: string | null;
          brand?: string | null;
          balance?: number | null;
          is_default?: boolean;
          created_at?: string;
        };
      };
      available_rewards: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          stars_required: number;
          is_redeemed: boolean;
          redeemed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description: string;
          stars_required: number;
          is_redeemed?: boolean;
          redeemed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          stars_required?: number;
          is_redeemed?: boolean;
          redeemed_at?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      rewards_tier: RewardsTier;
      order_status: OrderStatus;
      payment_method_type: PaymentMethodType;
    };
  };
}
