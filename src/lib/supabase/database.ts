/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from './client';
import { User as AppUser, UserRole, Order, OrderLocation, MenuItem, DrinkCustomization } from '@/types';

// Type for items passed to createOrder (transformed from CartItem)
interface OrderItem {
  id: string;
  menuItem: MenuItem;
  customizations: DrinkCustomization;
  quantity: number;
  customizationPrice: number;
  totalPrice: number;
  specialInstructions?: string;
}

// ============================================
// PROFILE / USER MANAGEMENT
// ============================================

export async function getAllUsers(): Promise<AppUser[]> {
  const supabase = getSupabaseClient();

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return profiles.map(profile => ({
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    phone: profile.phone || undefined,
    role: profile.role as UserRole,
    isActive: profile.is_active,
    createdAt: new Date(profile.created_at),
    lastLoginAt: profile.last_login_at ? new Date(profile.last_login_at) : undefined,
    rewards: {
      stars: profile.stars,
      tier: profile.tier as 'green' | 'gold' | 'platinum',
      starsToNextReward: profile.stars_to_next_reward,
      availableRewards: [],
    },
    favoriteItems: [],
    favoriteLocations: [],
    orderHistory: [],
    paymentMethods: [],
  }));
}

export async function updateUserRole(userId: string, role: UserRole): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user role:', error);
    return false;
  }

  return true;
}

export async function updateUserProfile(
  userId: string,
  updates: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    stars?: number;
  }
): Promise<boolean> {
  const supabase = getSupabaseClient();

  const dbUpdates: any = {};
  if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
  if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.stars !== undefined) dbUpdates.stars = updates.stars;

  const { error } = await supabase
    .from('profiles')
    .update(dbUpdates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating user profile:', error);
    return false;
  }

  return true;
}

export async function toggleUserActive(userId: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  // First get current status
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_active')
    .eq('id', userId)
    .single();

  if (!profile) return false;

  const { error } = await supabase
    .from('profiles')
    .update({ is_active: !profile.is_active })
    .eq('id', userId);

  if (error) {
    console.error('Error toggling user active:', error);
    return false;
  }

  return true;
}

export async function deleteUser(userId: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error('Error deleting user:', error);
    return false;
  }

  return true;
}

export async function addStars(userId: string, amount: number): Promise<boolean> {
  const supabase = getSupabaseClient();

  // Get current stars
  const { data: profile } = await supabase
    .from('profiles')
    .select('stars')
    .eq('id', userId)
    .single();

  if (!profile) return false;

  const { error } = await supabase
    .from('profiles')
    .update({ stars: profile.stars + amount })
    .eq('id', userId);

  if (error) {
    console.error('Error adding stars:', error);
    return false;
  }

  return true;
}

// ============================================
// FAVORITES
// ============================================

export async function addFavorite(userId: string, menuItemId: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, menu_item_id: menuItemId });

  if (error) {
    // Might already exist, which is fine
    if (error.code === '23505') return true;
    console.error('Error adding favorite:', error);
    return false;
  }

  return true;
}

export async function removeFavorite(userId: string, menuItemId: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('menu_item_id', menuItemId);

  if (error) {
    console.error('Error removing favorite:', error);
    return false;
  }

  return true;
}

export async function getUserFavorites(userId: string): Promise<string[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('favorites')
    .select('menu_item_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  return data.map(f => f.menu_item_id);
}

// ============================================
// ORDERS
// ============================================

export async function createOrder(
  userId: string,
  location: OrderLocation,
  items: OrderItem[],
  subtotal: number,
  tax: number,
  tip: number,
  total: number,
  paymentMethodId?: string
): Promise<Order | null> {
  const supabase = getSupabaseClient();

  // Calculate estimated ready time (15 minutes from now)
  const estimatedReadyTime = new Date(Date.now() + 15 * 60 * 1000);

  // Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      location_id: location.id,
      location_name: location.name,
      location_address: location.address,
      status: 'pending',
      subtotal,
      tax,
      tip,
      total,
      payment_method_id: paymentMethodId,
      estimated_ready_time: estimatedReadyTime.toISOString(),
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error('Error creating order:', orderError);
    return null;
  }

  // Create order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    menu_item_id: item.menuItem.id,
    menu_item_name: item.menuItem.name,
    quantity: item.quantity,
    size: item.customizations.size,
    base_price: item.menuItem.basePrice,
    customization_price: item.customizationPrice,
    total_price: item.totalPrice,
    customizations: item.customizations,
    special_instructions: item.specialInstructions || null,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    // Order was created but items failed - should handle this better in production
  }

  // Add stars for the order (2 stars per dollar)
  const starsEarned = Math.floor(total * 2);
  await addStars(userId, starsEarned);

  // Return the order in app format
  return {
    id: order.id,
    items: items as any, // Cast to satisfy CartItem[] type requirement
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    tip: Number(order.tip),
    total: Number(order.total),
    status: order.status,
    statusHistory: [
      { status: 'pending', timestamp: new Date(order.created_at) },
      { status: order.status, timestamp: new Date() },
    ],
    location: location,
    pickupName: '',
    paymentMethod: undefined,
    createdAt: new Date(order.created_at),
    estimatedReadyTime: new Date(order.estimated_ready_time),
  };
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = getSupabaseClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return orders.map((order: any) => ({
    id: order.id,
    items: (order.order_items || []).map((item: any) => ({
      id: item.id,
      menuItem: {
        id: item.menu_item_id,
        name: item.menu_item_name,
        basePrice: Number(item.base_price),
      },
      customization: item.customizations,
      quantity: item.quantity,
      itemPrice: Number(item.total_price) / item.quantity,
      itemName: item.menu_item_name,
    })),
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    tip: Number(order.tip),
    total: Number(order.total),
    status: order.status,
    statusHistory: [
      { status: 'pending', timestamp: new Date(order.created_at) },
      { status: order.status, timestamp: new Date(order.updated_at || order.created_at) },
    ],
    location: {
      id: order.location_id,
      name: order.location_name,
      address: order.location_address,
      estimatedWait: 10,
      isOpen: true,
      hours: '6AM - 9PM',
    },
    pickupName: '',
    createdAt: new Date(order.created_at),
    estimatedReadyTime: order.estimated_ready_time ? new Date(order.estimated_ready_time) : new Date(),
  }));
}

export async function updateOrderStatus(orderId: string, status: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  const updateData: any = { status };
  if (status === 'ready') {
    updateData.actual_ready_time = new Date().toISOString();
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }

  return true;
}

// ============================================
// PAYMENT METHODS
// ============================================

export async function addPaymentMethod(
  userId: string,
  type: 'card' | 'moonbeam-card' | 'apple-pay' | 'google-pay',
  last4?: string,
  brand?: string,
  balance?: number,
  isDefault?: boolean
): Promise<string | null> {
  const supabase = getSupabaseClient();

  // If setting as default, unset other defaults first
  if (isDefault) {
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);
  }

  const { data, error } = await supabase
    .from('payment_methods')
    .insert({
      user_id: userId,
      type,
      last4,
      brand,
      balance,
      is_default: isDefault ?? false,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error adding payment method:', error);
    return null;
  }

  return data.id;
}

export async function getUserPaymentMethods(userId: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }

  return data.map(pm => ({
    id: pm.id,
    type: pm.type,
    last4: pm.last4 || undefined,
    brand: pm.brand || undefined,
    balance: pm.balance || undefined,
    isDefault: pm.is_default,
  }));
}
