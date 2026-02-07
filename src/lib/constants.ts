// Moonbeam Cafe Business Information
export const BUSINESS_INFO = {
  name: 'Moonbeam Cafe',
  tagline: 'Organic Roasted Coffee, Teas, Pastries & More',
  address: {
    street: '636 Allegheny River Blvd',
    city: 'Oakmont',
    state: 'PA',
    zip: '15139',
    country: 'USA',
    full: '636 Allegheny River Blvd, Oakmont, PA 15139, USA',
  },
  phone: '+1 412-226-8875',
  phoneDisplay: '(412) 226-8875',
  email: 'hello@moonbeamcafe.com',
  hours: {
    monday: { open: '8:00 AM', close: '3:00 PM' },
    tuesday: { open: '8:00 AM', close: '3:00 PM' },
    wednesday: { open: '8:00 AM', close: '3:00 PM' },
    thursday: { open: '8:00 AM', close: '3:00 PM' },
    friday: { open: '8:00 AM', close: '3:00 PM' },
    saturday: { open: '7:00 AM', close: '2:00 PM' },
    sunday: { open: '8:00 AM', close: '2:00 PM' },
  },
  social: {
    instagram: 'https://www.instagram.com/moonbeamcafe/',
    facebook: 'https://www.facebook.com/moonbeamcafepgh/',
    website: 'https://moonbeam-caf.wheree.com/menu',
    yelp: 'https://www.yelp.com/biz/moonbeam-cafe-oakmont-2',
  },
} as const;

// Navigation Links
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

// Brand Colors (matching CSS variables)
export const BRAND_COLORS = {
  primary: '#3d4a2d',
  primaryLight: '#4a5a38',
  primaryDark: '#2d3820',
  secondary: '#f5e6c8',
  secondaryDark: '#e8d4a8',
  accent: '#8b7355',
  accentLight: '#a68b6a',
  accentDark: '#5c4a3a',
} as const;

// Menu Categories
export const MENU_CATEGORIES = [
  'Fall Drinks',
  'Hot Drinks',
  'Cold Drinks',
  'Timeless Coffees',
  'House Lattes',
  'European Classics',
  'Bakery & Breakfast',
  'Cream Cheese & Spreads',
  'Toast Specials',
  'January Specials',
] as const;

// Customization Options (Starbucks-style)
export const CUSTOMIZATION_OPTIONS = {
  sizes: [
    { id: 'small', name: 'Small', priceModifier: 0 },
    { id: 'medium', name: 'Medium', priceModifier: 0.50 },
    { id: 'large', name: 'Large', priceModifier: 1.00 },
  ],
  milkOptions: [
    { id: 'whole', name: 'Whole Milk', priceModifier: 0 },
    { id: '2percent', name: '2% Milk', priceModifier: 0 },
    { id: 'skim', name: 'Skim Milk', priceModifier: 0 },
    { id: 'oat', name: 'Oat Milk', priceModifier: 0.70 },
    { id: 'almond', name: 'Almond Milk', priceModifier: 0.70 },
    { id: 'soy', name: 'Soy Milk', priceModifier: 0.70 },
    { id: 'coconut', name: 'Coconut Milk', priceModifier: 0.70 },
    { id: 'half-and-half', name: 'Half & Half', priceModifier: 0.50 },
  ],
  espressoOptions: [
    { id: 'regular', name: 'Regular', priceModifier: 0 },
    { id: 'extra-shot', name: 'Extra Shot', priceModifier: 0.75 },
    { id: 'decaf', name: 'Decaf', priceModifier: 0 },
    { id: 'half-caf', name: 'Half-Caf', priceModifier: 0 },
  ],
  temperatureOptions: [
    { id: 'hot', name: 'Hot' },
    { id: 'iced', name: 'Iced' },
    { id: 'blended', name: 'Blended' },
  ],
  sweeteners: [
    { id: 'none', name: 'No Sweetener', priceModifier: 0 },
    { id: 'sugar', name: 'Sugar', priceModifier: 0 },
    { id: 'honey', name: 'Honey', priceModifier: 0.30 },
    { id: 'stevia', name: 'Stevia', priceModifier: 0 },
    { id: 'vanilla', name: 'Vanilla Syrup', priceModifier: 0.50 },
    { id: 'caramel', name: 'Caramel Syrup', priceModifier: 0.50 },
    { id: 'hazelnut', name: 'Hazelnut Syrup', priceModifier: 0.50 },
    { id: 'lavender', name: 'Lavender Syrup', priceModifier: 0.50 },
  ],
  toppings: [
    { id: 'whipped-cream', name: 'Whipped Cream', priceModifier: 0.50 },
    { id: 'cinnamon', name: 'Cinnamon', priceModifier: 0 },
    { id: 'cocoa', name: 'Cocoa Powder', priceModifier: 0 },
    { id: 'nutmeg', name: 'Nutmeg', priceModifier: 0 },
    { id: 'caramel-drizzle', name: 'Caramel Drizzle', priceModifier: 0.50 },
    { id: 'chocolate-drizzle', name: 'Chocolate Drizzle', priceModifier: 0.50 },
  ],
} as const;

// Spreads for Bagels/Toast
export const SPREADS = [
  { id: 'cream-cheese', name: 'Cream Cheese', price: 1.00 },
  { id: 'jam', name: 'Jam', price: 0.75 },
  { id: 'blueberry', name: 'Blueberry', price: 0.75 },
  { id: 'butter', name: 'Country-Style Butter', price: 0.50 },
  { id: 'goat-cheese-plain', name: 'Plain Goat Cheese', price: 1.50 },
  { id: 'goat-cheese-tomato', name: 'Sun-Dried Tomato Goat Cheese', price: 1.75 },
  { id: 'onion-chive', name: 'Onion & Chive Cream Cheese', price: 1.25 },
  { id: 'pumpkin', name: 'Pumpkin Cream Cheese', price: 1.25 },
] as const;
