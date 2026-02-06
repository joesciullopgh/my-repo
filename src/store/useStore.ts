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
  MoonbeamRewards,
} from '@/types';
import { LOCATIONS } from '@/data/menu';

interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;
  allUsers: User[];  // For admin user management

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
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
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
  toggleFavorite: (itemId: string) => void;
  addStars: (amount: number) => void;

  // Admin actions
  isAdmin: () => boolean;
  getAllUsers: () => User[];
  updateUserRole: (userId: string, role: UserRole) => void;
  toggleUserActive: (userId: string) => void;
  deleteUser: (userId: string) => void;
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
    // Calculate extra syrup pumps beyond default
    customization.syrups.forEach((syrup, index) => {
      if (index > 0 || syrup.pumps > 4) {
        // Extra syrups or extra pumps
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

  // Size
  const sizeMap = { tall: 'Tall', grande: 'Grande', venti: 'Venti' };
  parts.push(sizeMap[customization.size]);

  // Temperature modifier
  if (customization.temperature === 'iced') {
    parts.push('Iced');
  }

  // Milk modifier (if non-standard)
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

  // Extra shots
  if (customization.espressoShots && customization.espressoShots > 0) {
    parts.push(`+${customization.espressoShots} Shot${customization.espressoShots > 1 ? 's' : ''}`);
  }

  parts.push(menuItem.name);

  return parts.filter(Boolean).join(' ');
}

// Create default rewards for new users
const createDefaultRewards = (): MoonbeamRewards => ({
  stars: 0,
  tier: 'green',
  starsToNextReward: 50,
  availableRewards: [],
});

// Create a new user with provided details
const createUser = (
  email: string,
  firstName: string,
  lastName: string,
  role: UserRole = 'customer'
): User => ({
  id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  firstName,
  lastName,
  email,
  phone: undefined,
  role,
  isActive: true,
  createdAt: new Date(),
  lastLoginAt: new Date(),
  rewards: createDefaultRewards(),
  favoriteItems: [],
  favoriteLocations: [],
  orderHistory: [],
  paymentMethods: [],
  defaultPaymentMethod: undefined,
});

// Pre-seeded admin user
const ADMIN_USER: User = {
  id: 'admin-001',
  firstName: 'Joe',
  lastName: 'Sciullo',
  email: 'joesciullo79@gmail.com',
  phone: undefined,
  role: 'admin',
  isActive: true,
  createdAt: new Date('2024-01-01'),
  lastLoginAt: new Date(),
  rewards: {
    stars: 500,
    tier: 'platinum',
    starsToNextReward: 0,
    availableRewards: [
      {
        id: 'reward-1',
        name: 'Free Handcrafted Drink',
        starsRequired: 150,
        description: 'Redeem for any handcrafted drink, any size',
      },
    ],
  },
  favoriteItems: ['caramel-macchiato', 'cold-brew', 'pink-drink'],
  favoriteLocations: ['downtown-main'],
  orderHistory: [],
  paymentMethods: [
    {
      id: 'pm-1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
    },
    {
      id: 'pm-2',
      type: 'moonbeam-card',
      balance: 100.00,
    },
  ],
  defaultPaymentMethod: 'pm-1',
};

// Initial users list with admin
const INITIAL_USERS: User[] = [ADMIN_USER];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      allUsers: [...INITIAL_USERS],
      cart: [],
      currentOrder: null,
      orderHistory: [],
      selectedLocation: LOCATIONS[0],
      isCartOpen: false,
      isCustomizing: false,
      customizingItem: null,
      editingCartItem: null,

      // Auth actions
      login: async (email: string, _password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (email) {
          const state = get();
          // Check if user already exists
          let existingUser = state.allUsers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          );

          if (existingUser) {
            // Update last login time
            existingUser = { ...existingUser, lastLoginAt: new Date() };
            set({
              user: existingUser,
              isAuthenticated: true,
              allUsers: state.allUsers.map((u) =>
                u.email.toLowerCase() === email.toLowerCase() ? existingUser! : u
              ),
            });
          } else {
            // For login without signup, extract name from email or use defaults
            const emailName = email.split('@')[0];
            const firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
            const newUser = createUser(email, firstName, '', 'customer');
            set({
              user: newUser,
              isAuthenticated: true,
              allUsers: [...state.allUsers, newUser],
            });
          }
          return true;
        }
        return false;
      },

      signUp: async (email: string, _password: string, firstName: string, lastName: string) => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (email && firstName) {
          const state = get();
          // Check if user already exists
          const existingUser = state.allUsers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          );

          if (existingUser) {
            // User exists, just log them in
            set({
              user: { ...existingUser, lastLoginAt: new Date() },
              isAuthenticated: true,
            });
          } else {
            // Create new user with provided names
            const newUser = createUser(email, firstName, lastName, 'customer');
            set({
              user: newUser,
              isAuthenticated: true,
              allUsers: [...state.allUsers, newUser],
            });
          }
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      // Cart actions
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

        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Add stars for purchase (2 stars per dollar for Gold members)
        const starsEarned = Math.floor(total * 2);

        set((state) => ({
          currentOrder: order,
          orderHistory: [order, ...state.orderHistory],
          cart: [],
          user: state.user
            ? {
                ...state.user,
                rewards: {
                  ...state.user.rewards,
                  stars: state.user.rewards.stars + starsEarned,
                  starsToNextReward: Math.max(0, state.user.rewards.starsToNextReward - starsEarned),
                },
                orderHistory: [order, ...state.user.orderHistory],
              }
            : null,
        }));

        // Simulate order preparation progress
        setTimeout(() => {
          get().updateOrderStatus(order.id, 'preparing');
        }, 3000);

        setTimeout(() => {
          get().updateOrderStatus(order.id, 'ready');
        }, (state.selectedLocation?.estimatedWait || 10) * 60000 * 0.8);

        return order;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          currentOrder:
            state.currentOrder?.id === orderId
              ? {
                  ...state.currentOrder,
                  status,
                  statusHistory: [
                    ...state.currentOrder.statusHistory,
                    { status, timestamp: new Date() },
                  ],
                }
              : state.currentOrder,
          orderHistory: state.orderHistory.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  statusHistory: [...order.statusHistory, { status, timestamp: new Date() }],
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

      toggleFavorite: (itemId) => {
        set((state) => {
          if (!state.user) return state;

          const isFavorite = state.user.favoriteItems.includes(itemId);
          return {
            user: {
              ...state.user,
              favoriteItems: isFavorite
                ? state.user.favoriteItems.filter((id) => id !== itemId)
                : [...state.user.favoriteItems, itemId],
            },
          };
        });
      },

      addStars: (amount) => {
        set((state) => {
          if (!state.user) return state;

          return {
            user: {
              ...state.user,
              rewards: {
                ...state.user.rewards,
                stars: state.user.rewards.stars + amount,
                starsToNextReward: Math.max(0, state.user.rewards.starsToNextReward - amount),
              },
            },
          };
        });
      },

      // Admin actions
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      getAllUsers: () => {
        return get().allUsers;
      },

      updateUserRole: (userId, role) => {
        set((state) => {
          if (!state.user || state.user.role !== 'admin') return state;

          return {
            allUsers: state.allUsers.map((u) =>
              u.id === userId ? { ...u, role } : u
            ),
            // Update current user if they changed their own role
            user: state.user.id === userId ? { ...state.user, role } : state.user,
          };
        });
      },

      toggleUserActive: (userId) => {
        set((state) => {
          if (!state.user || state.user.role !== 'admin') return state;
          // Prevent admin from deactivating themselves
          if (state.user.id === userId) return state;

          return {
            allUsers: state.allUsers.map((u) =>
              u.id === userId ? { ...u, isActive: !u.isActive } : u
            ),
          };
        });
      },

      deleteUser: (userId) => {
        set((state) => {
          if (!state.user || state.user.role !== 'admin') return state;
          // Prevent admin from deleting themselves
          if (state.user.id === userId) return state;

          return {
            allUsers: state.allUsers.filter((u) => u.id !== userId),
          };
        });
      },
    }),
    {
      name: 'moonbeam-cafe-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        allUsers: state.allUsers,
        cart: state.cart,
        orderHistory: state.orderHistory,
        selectedLocation: state.selectedLocation,
      }),
    }
  )
);
