// ==========================================
// MOONBEAM CAFE - TYPE DEFINITIONS
// ==========================================

// Base Types
export type DrinkCategory =
  | 'espresso'
  | 'cold-brew'
  | 'frappuccino'
  | 'tea'
  | 'refreshers'
  | 'hot-chocolate'
  | 'seasonal';

export type FoodCategory =
  | 'pastries'
  | 'sandwiches'
  | 'snacks'
  | 'desserts';

export type Size = 'tall' | 'grande' | 'venti';

export type MilkType =
  | 'whole'
  | 'skim'
  | '2percent'
  | 'oat'
  | 'almond'
  | 'soy'
  | 'coconut'
  | 'oatmilk-foam';

export type EspressoRoast = 'signature' | 'blonde' | 'decaf';

export type Temperature = 'hot' | 'iced' | 'blended';

export type SyrupFlavor =
  | 'vanilla'
  | 'caramel'
  | 'hazelnut'
  | 'mocha'
  | 'white-mocha'
  | 'toffee-nut'
  | 'peppermint'
  | 'raspberry'
  | 'cinnamon-dolce'
  | 'brown-sugar'
  | 'lavender'
  | 'pistachio';

export type Topping =
  | 'whipped-cream'
  | 'caramel-drizzle'
  | 'mocha-drizzle'
  | 'cinnamon-powder'
  | 'vanilla-powder'
  | 'cold-foam'
  | 'salted-cream-foam'
  | 'chocolate-curls'
  | 'cookie-crumbles';

export type SweetenerType =
  | 'classic-syrup'
  | 'liquid-cane-sugar'
  | 'honey'
  | 'stevia'
  | 'splenda'
  | 'raw-sugar';

// ==========================================
// CUSTOMIZATION OPTIONS
// ==========================================

export interface SyrupCustomization {
  flavor: SyrupFlavor;
  pumps: number;  // 0-12
}

export interface ToppingCustomization {
  topping: Topping;
  amount: 'light' | 'regular' | 'extra';
}

export interface SweetenerCustomization {
  type: SweetenerType;
  packets: number;  // 0-12
}

export interface DrinkCustomization {
  size: Size;
  temperature: Temperature;
  milk?: MilkType;
  espressoRoast?: EspressoRoast;
  espressoShots?: number;  // 0-6 extra shots
  syrups: SyrupCustomization[];
  toppings: ToppingCustomization[];
  sweeteners: SweetenerCustomization[];
  iceLevel?: 'no-ice' | 'light' | 'regular' | 'extra';
  instructions?: string;
}

// ==========================================
// MENU ITEMS
// ==========================================

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: DrinkCategory | FoodCategory;
  basePrice: number;
  image: string;
  calories: {
    tall?: number;
    grande: number;
    venti?: number;
  };
  caffeine?: {
    tall?: number;
    grande: number;
    venti?: number;
  };
  availableTemperatures: Temperature[];
  availableSizes: Size[];
  defaultCustomization: Partial<DrinkCustomization>;
  isFood?: boolean;
  isSeasonal?: boolean;
  isNew?: boolean;
  tags?: string[];
}

// ==========================================
// CART & ORDER
// ==========================================

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  customization: DrinkCustomization;
  quantity: number;
  itemPrice: number;
  itemName: string;  // Custom name if renamed
}

export interface OrderLocation {
  id: string;
  name: string;
  address: string;
  distance?: string;
  estimatedWait: number;  // minutes
  isOpen: boolean;
  hours: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked-up'
  | 'cancelled';

export interface OrderStatusUpdate {
  status: OrderStatus;
  timestamp: Date;
  message?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  location: OrderLocation;
  status: OrderStatus;
  statusHistory: OrderStatusUpdate[];
  createdAt: Date;
  estimatedReadyTime: Date;
  pickupName: string;
  paymentMethod?: PaymentMethod;
}

// ==========================================
// PAYMENT
// ==========================================

export interface PaymentMethod {
  id: string;
  type: 'card' | 'moonbeam-card' | 'apple-pay' | 'google-pay';
  last4?: string;
  brand?: string;
  balance?: number;  // For Moonbeam Card
  isDefault?: boolean;
}

export interface MoonbeamRewards {
  stars: number;
  tier: 'green' | 'gold' | 'platinum';
  starsToNextReward: number;
  availableRewards: Reward[];
}

export interface Reward {
  id: string;
  name: string;
  starsRequired: number;
  description: string;
  expiresAt?: Date;
}

// ==========================================
// USER
// ==========================================

export type UserRole = 'customer' | 'admin' | 'staff';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  rewards: MoonbeamRewards;
  favoriteItems: string[];  // MenuItem IDs
  favoriteLocations: string[];  // Location IDs
  orderHistory: Order[];
  paymentMethods: PaymentMethod[];
  defaultPaymentMethod?: string;
}

// ==========================================
// STORE TYPES
// ==========================================

export interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;

  // Cart
  cart: CartItem[];
  cartTotal: number;

  // Current Order
  currentOrder: Order | null;
  selectedLocation: OrderLocation | null;

  // UI State
  isCartOpen: boolean;
  isCustomizing: boolean;
  customizingItem: MenuItem | null;

  // Actions
  login: (user: User) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItem: (itemId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  setSelectedLocation: (location: OrderLocation) => void;
  placeOrder: (tip: number, paymentMethod: PaymentMethod) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  setCartOpen: (open: boolean) => void;
  startCustomizing: (item: MenuItem) => void;
  stopCustomizing: () => void;
}

// ==========================================
// PRICING
// ==========================================

export const PRICING = {
  sizes: {
    tall: 0,
    grande: 0.50,
    venti: 1.00,
  },
  milks: {
    whole: 0,
    skim: 0,
    '2percent': 0,
    oat: 0.80,
    almond: 0.80,
    soy: 0.80,
    coconut: 0.80,
    'oatmilk-foam': 1.00,
  },
  extraShot: 0.90,
  syrups: {
    vanilla: 0.60,
    caramel: 0.60,
    hazelnut: 0.60,
    mocha: 0.60,
    'white-mocha': 0.60,
    'toffee-nut': 0.60,
    peppermint: 0.60,
    raspberry: 0.60,
    'cinnamon-dolce': 0.60,
    'brown-sugar': 0.70,
    lavender: 0.70,
    pistachio: 0.80,
  },
  toppings: {
    'whipped-cream': 0,
    'caramel-drizzle': 0.60,
    'mocha-drizzle': 0.60,
    'cinnamon-powder': 0,
    'vanilla-powder': 0,
    'cold-foam': 1.25,
    'salted-cream-foam': 1.50,
    'chocolate-curls': 0.50,
    'cookie-crumbles': 0.75,
  },
  sweeteners: {
    'classic-syrup': 0,
    'liquid-cane-sugar': 0,
    honey: 0.30,
    stevia: 0,
    splenda: 0,
    'raw-sugar': 0,
  },
} as const;

// Tax rate
export const TAX_RATE = 0.0875;
