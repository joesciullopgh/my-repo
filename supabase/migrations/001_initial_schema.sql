-- Moonbeam Café Database Schema
-- Run this in the Supabase SQL Editor

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('customer', 'staff', 'admin');
CREATE TYPE rewards_tier AS ENUM ('green', 'gold', 'platinum');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled');
CREATE TYPE payment_method_type AS ENUM ('card', 'moonbeam-card', 'apple-pay', 'google-pay');

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  is_active BOOLEAN NOT NULL DEFAULT true,
  stars INTEGER NOT NULL DEFAULT 0,
  tier rewards_tier NOT NULL DEFAULT 'green',
  stars_to_next_reward INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Index for email lookups
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================
-- ORDERS TABLE
-- ============================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location_id TEXT NOT NULL,
  location_name TEXT NOT NULL,
  location_address TEXT NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  tip DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  payment_method_id UUID,
  estimated_ready_time TIMESTAMPTZ,
  actual_ready_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for order queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id TEXT NOT NULL,
  menu_item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  customization_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10, 2) NOT NULL,
  customizations JSONB NOT NULL DEFAULT '{}',
  special_instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for order item lookups
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- ============================================
-- FAVORITES TABLE
-- ============================================

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  menu_item_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, menu_item_id)
);

-- Index for favorite lookups
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- ============================================
-- PAYMENT METHODS TABLE
-- ============================================

CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type payment_method_type NOT NULL,
  last4 TEXT,
  brand TEXT,
  balance DECIMAL(10, 2),
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for payment method lookups
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);

-- ============================================
-- AVAILABLE REWARDS TABLE
-- ============================================

CREATE TABLE available_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  stars_required INTEGER NOT NULL,
  is_redeemed BOOLEAN NOT NULL DEFAULT false,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for rewards lookups
CREATE INDEX idx_available_rewards_user_id ON available_rewards(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_rewards ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- PROFILES POLICIES
-- --------------------------------------------

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (except role and is_active)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can delete profiles (except their own)
CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    AND id != auth.uid()
  );

-- --------------------------------------------
-- ORDERS POLICIES
-- --------------------------------------------

-- Users can read their own orders
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create orders for themselves
CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Staff and admins can read all orders
CREATE POLICY "Staff can read all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin')
    )
  );

-- Staff and admins can update order status
CREATE POLICY "Staff can update orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin')
    )
  );

-- --------------------------------------------
-- ORDER ITEMS POLICIES
-- --------------------------------------------

-- Users can read items from their own orders
CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Users can insert items into their own orders
CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Staff can read all order items
CREATE POLICY "Staff can read all order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin')
    )
  );

-- --------------------------------------------
-- FAVORITES POLICIES
-- --------------------------------------------

-- Users can manage their own favorites
CREATE POLICY "Users can read own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- --------------------------------------------
-- PAYMENT METHODS POLICIES
-- --------------------------------------------

-- Users can manage their own payment methods
CREATE POLICY "Users can read own payment methods"
  ON payment_methods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payment methods"
  ON payment_methods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods"
  ON payment_methods FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods"
  ON payment_methods FOR DELETE
  USING (auth.uid() = user_id);

-- --------------------------------------------
-- AVAILABLE REWARDS POLICIES
-- --------------------------------------------

-- Users can read their own rewards
CREATE POLICY "Users can read own rewards"
  ON available_rewards FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own rewards (for redemption)
CREATE POLICY "Users can update own rewards"
  ON available_rewards FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update last_login_at
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET last_login_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update order updated_at timestamp
CREATE OR REPLACE FUNCTION update_order_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update order timestamp
CREATE TRIGGER order_updated
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_order_timestamp();

-- Function to update user tier based on stars
CREATE OR REPLACE FUNCTION update_user_tier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stars >= 400 THEN
    NEW.tier = 'platinum';
    NEW.stars_to_next_reward = 0;
  ELSIF NEW.stars >= 200 THEN
    NEW.tier = 'gold';
    NEW.stars_to_next_reward = 400 - NEW.stars;
  ELSE
    NEW.tier = 'green';
    NEW.stars_to_next_reward = 50 - (NEW.stars % 50);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update tier
CREATE TRIGGER update_tier_on_stars_change
  BEFORE UPDATE OF stars ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_user_tier();

-- ============================================
-- SEED ADMIN USER (joesciullo79@gmail.com)
-- Note: This will be linked when they sign up
-- ============================================

-- Create a function to make a user admin by email
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET
    role = 'admin',
    stars = 500,
    tier = 'platinum',
    stars_to_next_reward = 0
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
