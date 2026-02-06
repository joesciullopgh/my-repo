import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  User,
  UserRole,
  CartItem,
  Order,
  OrderLocation,
  OrderStatus,
  MenuItem,
  PaymentMethod,
  DrinkCustomization,
  TAX_RATE,
  PRICING,
} from '@/types';
import { LOCATIONS } from '@/data/menu';
import * as supabase from '@/lib/supabase';

interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  allUsers: User[];  // For admin user management (cached)

  // Cart
  cart: CartItem[];

  // Current Order
  currentOrder: Order | null;
  orderHistory: Order[];
  selectedLocation: OrderLocation | null;

  // UI State
  isCartOpen: boolean;
  isCustomizing: boolean;
  customizingItem: MenuItem | null;
  editingCartItem: CartItem | null;

  // Actions
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  addToCart: (menuItem: MenuItem, customization: DrinkCustomization, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  updateCartItem: (itemId: string, customization: DrinkCustomization) => void;
  clearCart: () => void;
  setSelectedLocation: (location: OrderLocation) => void;
  placeOrder: (tip: number, paymentMethod: PaymentMethod, pickupName: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  setCartOpen: (open: boolean) => void;
  startCustomizing: (item: MenuItem) => void;
  stopCustomizing: () => void;
  editCartItem: (item: CartItem) => void;
  stopEditingCartItem: () => void;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getCartTax: () => number;
  toggleFavorite: (itemId: string) => Promise<void>;
  addStars: (amount: number) => Promise<void>;

  // Admin actions
  isAdmin: () => boolean;
  getAllUsers: () => User[];
  fetchAllUsers: () => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  updateUserProfile: (userId: string, updates: { firstName?: string; lastName?: string; phone?: string; stars?: number }) => Promise<void>;
  toggleUserActive: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

// Calculate item price based on customizations
export function calculateItemPrice(
  basePrice: number,
  customization: DrinkCustomization
): number {
  let price = basePrice;

  // Size upcharge
  price += PRICING.sizes[customization.size] || 0;

  // Milk upcharge
  if (customization.milk) {
    price += PRICING.milks[customization.milk] || 0;
  }

  // Extra espresso shots
  if (customization.espressoShots && customization.espressoShots > 0) {
    price += customization.espressoShots * PRICING.extraShot;
  }

  // Syrups (first flavor often included, extras cost)
  if (customization.syrups && customization.syrups.length > 0) {
    customization.syrups.forEach((syrup, index) => {
      if (index > 0 || syrup.pumps > 4) {
        price += PRICING.syrups[syrup.flavor] || 0;
      }
    });
  }

  // Toppings
  if (customization.toppings) {
    customization.toppings.forEach((topping) => {
      const toppingPrice = PRICING.toppings[topping.topping] || 0;
      if (topping.amount === 'extra') {
        price += toppingPrice * 1.5;
      } else {
        price += toppingPrice;
      }
    });
  }

  // Sweeteners
  if (customization.sweeteners) {
    customization.sweeteners.forEach((sweetener) => {
      price += (PRICING.sweeteners[sweetener.type] || 0) * sweetener.packets;
    });
  }

  return price;
}

// Generate a custom item name based on customizations
function generateItemName(menuItem: MenuItem, customization: DrinkCustomization): string {
  const parts: string[] = [];

  const sizeMap = { tall: 'Tall', grande: 'Grande', venti: 'Venti' };
  parts.push(sizeMap[customization.size]);

  if (customization.temperature === 'iced') {
    parts.push('Iced');
  }

  if (customization.milk && !['2percent', 'whole'].includes(customization.milk)) {
    const milkMap: Record<string, string> = {
      oat: 'Oatmilk',
      almond: 'Almondmilk',
      soy: 'Soy',
      coconut: 'Coconut',
      skim: 'Nonfat',
      'oatmilk-foam': 'Oatmilk Foam',
    };
    parts.push(milkMap[customization.milk] || '');
  }

  if (customization.espressoShots && customization.espressoShots > 0) {
    parts.push(`+${customization.espressoShots} Shot${customization.espressoShots > 1 ? 's' : ''}`);
  }

  parts.push(menuItem.name);

  return parts.filter(Boolean).join(' ');
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: true,
      authError: null,
      allUsers: [],
      cart: [],
      currentOrder: null,
      orderHistory: [],
      selectedLocation: LOCATIONS[0],
      isCartOpen: false,
      isCustomizing: false,
      customizingItem: null,
      editingCartItem: null,

      // Initialize auth - check for existing session
      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          const user = await supabase.getCurrentUser();
          if (user) {
            // Fetch order history
            const orders = await supabase.getUserOrders(user.id);
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              orderHistory: orders,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ isLoading: false });
        }
      },

      // Auth actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, authError: null });

        const result = await supabase.signIn(email, password);

        if (result.error) {
          set({
            isLoading: false,
            authError: result.error.message
          });
          return false;
        }

        if (result.user) {
          // Fetch order history
          const orders = await supabase.getUserOrders(result.user.id);
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
            orderHistory: orders,
          });
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      signUp: async (email: string, password: string, firstName: string, lastName: string) => {
        set({ isLoading: true, authError: null });

        const result = await supabase.signUp(email, password, firstName, lastName);

        if (result.error) {
          set({
            isLoading: false,
            authError: result.error.message
          });
          return false;
        }

        if (result.user) {
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      logout: async () => {
        await supabase.signOut();
        set({
          user: null,
          isAuthenticated: false,
          orderHistory: [],
          allUsers: [],
        });
      },

      refreshUser: async () => {
        const { user } = get();
        if (user) {
          const updatedUser = await supabase.fetchUserProfile(user.id);
          if (updatedUser) {
            set({ user: updatedUser });
          }
        }
      },

      // Cart actions (local only - no DB)
      addToCart: (menuItem, customization, quantity = 1) => {
        const itemPrice = calculateItemPrice(menuItem.basePrice, customization);
        const itemName = generateItemName(menuItem, customization);

        const newItem: CartItem = {
          id: uuidv4(),
          menuItem,
          customization,
          quantity,
          itemPrice,
          itemName,
        };

        set((state) => ({
          cart: [...state.cart, newItem],
        }));
      },

      removeFromCart: (itemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== itemId),
        }));
      },

      updateCartItemQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      updateCartItem: (itemId, customization) => {
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.id === itemId) {
              const itemPrice = calculateItemPrice(item.menuItem.basePrice, customization);
              const itemName = generateItemName(item.menuItem, customization);
              return { ...item, customization, itemPrice, itemName };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      setSelectedLocation: (location) => {
        set({ selectedLocation: location });
      },

      placeOrder: async (tip, paymentMethod, pickupName) => {
        const state = get();
        const subtotal = state.getCartSubtotal();
        const tax = state.getCartTax();
        const total = subtotal + tax + tip;

        // Create cart items in the format expected by the database
        const cartItems = state.cart.map(item => ({
          id: item.id,
          menuItem: item.menuItem,
          customizations: item.customization,
          quantity: item.quantity,
          customizationPrice: item.itemPrice - item.menuItem.basePrice,
          totalPrice: item.itemPrice * item.quantity,
          specialInstructions: undefined,
        }));

        // If user is authenticated, create order in database
        if (state.user && state.isAuthenticated) {
          const dbOrder = await supabase.createOrder(
            state.user.id,
            state.selectedLocation!,
            cartItems,
            subtotal,
            tax,
            tip,
            total,
            paymentMethod.id
          );

          if (dbOrder) {
            set((state) => ({
              currentOrder: dbOrder,
              orderHistory: [dbOrder, ...state.orderHistory],
              cart: [],
            }));

            // Refresh user to get updated stars
            get().refreshUser();

            // Simulate order preparation progress
            setTimeout(() => {
              get().updateOrderStatus(dbOrder.id, 'preparing');
            }, 3000);

            setTimeout(() => {
              get().updateOrderStatus(dbOrder.id, 'ready');
            }, (state.selectedLocation?.estimatedWait || 10) * 60000 * 0.8);

            return dbOrder;
          }
        }

        // Fallback for non-authenticated orders (shouldn't happen normally)
        const order: Order = {
          id: `ORD-${Date.now()}`,
          items: [...state.cart],
          subtotal,
          tax,
          tip,
          total,
          location: state.selectedLocation!,
          status: 'confirmed',
          statusHistory: [
            { status: 'pending', timestamp: new Date() },
            { status: 'confirmed', timestamp: new Date() },
          ],
          createdAt: new Date(),
          estimatedReadyTime: new Date(Date.now() + (state.selectedLocation?.estimatedWait || 10) * 60000),
          pickupName,
          paymentMethod,
        };

        set((state) => ({
          currentOrder: order,
          orderHistory: [order, ...state.orderHistory],
          cart: [],
        }));

        return order;
      },

      updateOrderStatus: (orderId, status) => {
        // Update in database if authenticated
        const { user, isAuthenticated } = get();
        if (user && isAuthenticated) {
          supabase.updateOrderStatus(orderId, status);
        }

        set((state) => ({
          currentOrder:
            state.currentOrder?.id === orderId
              ? {
                  ...state.currentOrder,
                  status,
                  statusHistory: [
                    ...(state.currentOrder.statusHistory || []),
                    { status, timestamp: new Date() },
                  ],
                }
              : state.currentOrder,
          orderHistory: state.orderHistory.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  statusHistory: [...(order.statusHistory || []), { status, timestamp: new Date() }],
                }
              : order
          ),
        }));
      },

      setCartOpen: (open) => {
        set({ isCartOpen: open });
      },

      startCustomizing: (item) => {
        set({ isCustomizing: true, customizingItem: item, editingCartItem: null });
      },

      stopCustomizing: () => {
        set({ isCustomizing: false, customizingItem: null });
      },

      editCartItem: (item) => {
        set({ isCustomizing: true, customizingItem: item.menuItem, editingCartItem: item });
      },

      stopEditingCartItem: () => {
        set({ isCustomizing: false, customizingItem: null, editingCartItem: null });
      },

      getCartSubtotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.itemPrice * item.quantity, 0);
      },

      getCartTax: () => {
        const subtotal = get().getCartSubtotal();
        return subtotal * TAX_RATE;
      },

      getCartTotal: () => {
        return get().getCartSubtotal() + get().getCartTax();
      },

      toggleFavorite: async (itemId) => {
        const { user, isAuthenticated } = get();
        if (!user) return;

        const isFavorite = user.favoriteItems.includes(itemId);

        // Optimistic update
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                favoriteItems: isFavorite
                  ? state.user.favoriteItems.filter((id) => id !== itemId)
                  : [...state.user.favoriteItems, itemId],
              }
            : null,
        }));

        // Update in database
        if (isAuthenticated) {
          if (isFavorite) {
            await supabase.removeFavorite(user.id, itemId);
          } else {
            await supabase.addFavorite(user.id, itemId);
          }
        }
      },

      addStars: async (amount) => {
        const { user, isAuthenticated } = get();
        if (!user) return;

        // Optimistic update
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                rewards: {
                  ...state.user.rewards,
                  stars: state.user.rewards.stars + amount,
                  starsToNextReward: Math.max(0, state.user.rewards.starsToNextReward - amount),
                },
              }
            : null,
        }));

        // Update in database
        if (isAuthenticated) {
          await supabase.addStars(user.id, amount);
        }
      },

      // Admin actions
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      getAllUsers: () => {
        return get().allUsers;
      },

      fetchAllUsers: async () => {
        const { user } = get();
        if (!user || user.role !== 'admin') return;

        const users = await supabase.getAllUsers();
        set({ allUsers: users });
      },

      updateUserRole: async (userId, role) => {
        const { user } = get();
        if (!user || user.role !== 'admin') return;

        const success = await supabase.updateUserRole(userId, role);
        if (success) {
          // Update local cache
          set((state) => ({
            allUsers: state.allUsers.map((u) =>
              u.id === userId ? { ...u, role } : u
            ),
            user: state.user?.id === userId ? { ...state.user, role } : state.user,
          }));
        }
      },

      updateUserProfile: async (userId, updates) => {
        const { user } = get();
        if (!user || user.role !== 'admin') return;

        const success = await supabase.updateUserProfile(userId, updates);
        if (success) {
          // Update local cache
          set((state) => ({
            allUsers: state.allUsers.map((u) =>
              u.id === userId
                ? {
                    ...u,
                    firstName: updates.firstName ?? u.firstName,
                    lastName: updates.lastName ?? u.lastName,
                    phone: updates.phone ?? u.phone,
                    rewards: updates.stars !== undefined
                      ? { ...u.rewards, stars: updates.stars }
                      : u.rewards,
                  }
                : u
            ),
            user: state.user?.id === userId
              ? {
                  ...state.user,
                  firstName: updates.firstName ?? state.user.firstName,
                  lastName: updates.lastName ?? state.user.lastName,
                  phone: updates.phone ?? state.user.phone,
                  rewards: updates.stars !== undefined
                    ? { ...state.user.rewards, stars: updates.stars }
                    : state.user.rewards,
                }
              : state.user,
          }));
        }
      },

      toggleUserActive: async (userId) => {
        const { user } = get();
        if (!user || user.role !== 'admin') return;
        if (user.id === userId) return; // Can't deactivate self

        const success = await supabase.toggleUserActive(userId);
        if (success) {
          set((state) => ({
            allUsers: state.allUsers.map((u) =>
              u.id === userId ? { ...u, isActive: !u.isActive } : u
            ),
          }));
        }
      },

      deleteUser: async (userId) => {
        const { user } = get();
        if (!user || user.role !== 'admin') return;
        if (user.id === userId) return; // Can't delete self

        const success = await supabase.deleteUser(userId);
        if (success) {
          set((state) => ({
            allUsers: state.allUsers.filter((u) => u.id !== userId),
          }));
        }
      },
    }),
    {
      name: 'moonbeam-cafe-storage',
      partialize: (state) => ({
        cart: state.cart,
        selectedLocation: state.selectedLocation,
      }),
    }
  )
);
