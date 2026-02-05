'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ChevronRight,
  Edit3,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatPrice, capitalizeFirst } from '@/lib/utils';
import DrinkImage from './DrinkImage';

interface CartSidebarProps {
  onCheckout: () => void;
}

export default function CartSidebar({ onCheckout }: CartSidebarProps) {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    removeFromCart,
    updateCartItemQuantity,
    editCartItem,
    getCartSubtotal,
    getCartTax,
    getCartTotal,
    clearCart,
  } = useStore();

  const subtotal = getCartSubtotal();
  const tax = getCartTax();
  const total = getCartTotal();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-950" />
                <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
                <span className="text-sm text-slate-400">
                  ({cart.reduce((total, item) => total + item.quantity, 0)} items)
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Your cart is empty</h3>
                  <p className="text-sm text-slate-500">
                    Browse our menu and add your favorite drinks
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="bg-slate-50 rounded-xl p-4"
                    >
                      <div className="flex gap-3">
                        {/* Drink Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <DrinkImage item={item.menuItem} size="sm" className="w-full h-full" />
                        </div>

                        {/* Item Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">{item.itemName}</h4>

                          {/* Customization Summary */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.customization.milk && !['2percent', 'whole'].includes(item.customization.milk) && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                                {capitalizeFirst(item.customization.milk)}
                              </span>
                            )}
                            {item.customization.espressoShots && item.customization.espressoShots > 0 && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                                +{item.customization.espressoShots} shot{item.customization.espressoShots > 1 ? 's' : ''}
                              </span>
                            )}
                            {item.customization.syrups.map((s) => (
                              <span key={s.flavor} className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full">
                                {capitalizeFirst(s.flavor)} x{s.pumps}
                              </span>
                            ))}
                            {item.customization.toppings.map((t) => (
                              <span key={t.topping} className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                                {capitalizeFirst(t.topping)}
                              </span>
                            ))}
                          </div>

                          {/* Price and Controls */}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-bold text-indigo-950">
                              {formatPrice(item.itemPrice * item.quantity)}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => editCartItem(item)}
                                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              </button>
                              <div className="flex items-center gap-1 ml-2">
                                <button
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                  className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-7 rounded-full bg-indigo-950 text-white flex items-center justify-center hover:bg-indigo-900"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Clear Cart */}
                  <button
                    onClick={clearCart}
                    className="w-full text-center text-xs text-red-500 hover:text-red-600 py-2"
                  >
                    Clear all items
                  </button>
                </div>
              )}
            </div>

            {/* Footer - Totals & Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-slate-200 p-5 space-y-3 bg-white">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setCartOpen(false);
                    onCheckout();
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-950 to-indigo-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:from-indigo-900 hover:to-indigo-700 transition-all"
                >
                  Proceed to Checkout
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
