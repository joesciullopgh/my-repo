'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  MapPin,
  Clock,
  ChevronRight,
  Wallet,
  Star,
  ArrowLeft,
  Loader2,
  Check,
  Gift,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatPrice } from '@/lib/utils';
import { PaymentMethod, OrderLocation } from '@/types';
import { LOCATIONS } from '@/data/menu';
import DrinkImage from './DrinkImage';

interface CheckoutPageProps {
  onBack: () => void;
  onOrderPlaced: () => void;
}

export default function CheckoutPage({ onBack, onOrderPlaced }: CheckoutPageProps) {
  const {
    cart,
    user,
    selectedLocation,
    setSelectedLocation,
    getCartSubtotal,
    getCartTax,
    getCartTotal,
    placeOrder,
    isAuthenticated,
  } = useStore();

  const [step, setStep] = useState<'review' | 'payment' | 'processing' | 'confirmed'>('review');
  const [pickupName, setPickupName] = useState(user?.firstName || '');
  const [tipAmount, setTipAmount] = useState(0);
  const [tipPercentage, setTipPercentage] = useState<number | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(user?.defaultPaymentMethod || 'new-card');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // New card form
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [saveCard, setSaveCard] = useState(true);

  const subtotal = getCartSubtotal();
  const tax = getCartTax();
  const total = subtotal + tax + tipAmount;

  const handleTipPercentage = (percent: number) => {
    if (tipPercentage === percent) {
      setTipPercentage(null);
      setTipAmount(0);
    } else {
      setTipPercentage(percent);
      setTipAmount(subtotal * (percent / 100));
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    return cleaned;
  };

  const handlePlaceOrder = async () => {
    setStep('processing');

    const paymentMethod: PaymentMethod =
      selectedPaymentId === 'new-card'
        ? {
            id: 'new-card',
            type: 'card',
            last4: cardNumber.replace(/\s/g, '').slice(-4),
            brand: detectCardBrand(cardNumber),
          }
        : user?.paymentMethods.find((pm) => pm.id === selectedPaymentId) || {
            id: 'pm-default',
            type: 'card',
            last4: '4242',
            brand: 'Visa',
          };

    try {
      await placeOrder(tipAmount, paymentMethod, pickupName);
      setStep('confirmed');
      setTimeout(() => {
        onOrderPlaced();
      }, 2000);
    } catch {
      setStep('payment');
    }
  };

  const detectCardBrand = (number: string): string => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'Amex';
    if (cleaned.startsWith('6011') || cleaned.startsWith('65')) return 'Discover';
    return 'Card';
  };

  if (cart.length === 0 && step !== 'confirmed') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
        <button onClick={onBack} className="text-indigo-600 hover:text-indigo-800 font-medium">
          Browse Menu
        </button>
      </div>
    );
  }

  // Processing State
  if (step === 'processing') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Processing Payment</h2>
          <p className="text-slate-500 text-sm">Please wait while we process your order...</p>
        </motion.div>
      </div>
    );
  }

  // Confirmed State
  if (step === 'confirmed') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 10 }}
            className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
          >
            <Check className="w-10 h-10 text-emerald-600" />
          </motion.div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Order Confirmed!</h2>
          <p className="text-slate-500 text-sm mb-2">
            Your order has been placed successfully.
          </p>
          {isAuthenticated && (
            <div className="flex items-center gap-1 text-amber-600 text-sm font-medium">
              <Star className="w-4 h-4" />
              You earned {Math.floor(total * 2)} stars!
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer ${
            step === 'review' ? 'bg-indigo-950 text-white' : 'bg-slate-100 text-slate-500'
          }`}
          onClick={() => setStep('review')}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
          Review
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            step === 'payment' ? 'bg-indigo-950 text-white' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
          Payment
        </div>
      </div>

      {step === 'review' && (
        <div className="space-y-6">
          {/* Pickup Location */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Pickup Location</h3>
                </div>
                <button
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  className="text-xs text-indigo-600 font-medium hover:text-indigo-800"
                >
                  Change
                </button>
              </div>
              {selectedLocation && (
                <div className="mt-2 ml-7">
                  <p className="text-sm font-medium text-slate-800">{selectedLocation.name}</p>
                  <p className="text-xs text-slate-500">{selectedLocation.address}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600">
                    <Clock className="w-3 h-3" />
                    Ready in ~{selectedLocation.estimatedWait} min
                  </div>
                </div>
              )}
            </div>

            {showLocationPicker && (
              <div className="p-3 space-y-2 bg-slate-50">
                {LOCATIONS.filter((l) => l.isOpen).map((location) => (
                  <button
                    key={location.id}
                    onClick={() => {
                      setSelectedLocation(location);
                      setShowLocationPicker(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedLocation?.id === location.id
                        ? 'bg-indigo-950/5 border-2 border-indigo-950'
                        : 'bg-white border-2 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-900">{location.name}</p>
                    <p className="text-xs text-slate-500">{location.address}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>{location.distance}</span>
                      <span>~{location.estimatedWait} min wait</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pickup Name */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Pickup Name</h3>
            <input
              type="text"
              value={pickupName}
              onChange={(e) => setPickupName(e.target.value)}
              placeholder="Name for your order"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Order Items</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.id} className="p-4 flex gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <DrinkImage item={item.menuItem} size="sm" className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{item.itemName}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatPrice(item.itemPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tip Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Add a Tip</h3>
            <div className="grid grid-cols-5 gap-2">
              {[0, 10, 15, 20, 25].map((percent) => (
                <button
                  key={percent}
                  onClick={() => handleTipPercentage(percent)}
                  className={`py-2.5 rounded-xl text-center transition-all ${
                    tipPercentage === percent
                      ? 'bg-indigo-950 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <p className="text-sm font-semibold">{percent === 0 ? 'None' : `${percent}%`}</p>
                  {percent > 0 && (
                    <p className="text-[10px] opacity-70">{formatPrice(subtotal * (percent / 100))}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tip</span>
                <span>{formatPrice(tipAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            {isAuthenticated && (
              <div className="flex items-center gap-1 text-xs text-amber-600 font-medium pt-1">
                <Star className="w-3 h-3" />
                You&apos;ll earn {Math.floor(total * 2)} stars with this order
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setStep('payment')}
            disabled={!pickupName.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-950 to-indigo-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:from-indigo-900 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      )}

      {step === 'payment' && (
        <div className="space-y-6">
          {/* Saved Payment Methods */}
          {isAuthenticated && user?.paymentMethods && user.paymentMethods.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Saved Payment Methods</h3>
              </div>
              <div className="p-3 space-y-2">
                {user.paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setSelectedPaymentId(pm.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      selectedPaymentId === pm.id
                        ? 'bg-indigo-950/5 border-2 border-indigo-950'
                        : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
                    }`}
                  >
                    {pm.type === 'moonbeam-card' ? (
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-slate-600" />
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-slate-900">
                        {pm.type === 'moonbeam-card'
                          ? 'Moonbeam Card'
                          : `${pm.brand} ····${pm.last4}`}
                      </p>
                      {pm.balance !== undefined && (
                        <p className="text-xs text-slate-500">Balance: {formatPrice(pm.balance)}</p>
                      )}
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentId === pm.id
                          ? 'border-indigo-950 bg-indigo-950'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedPaymentId === pm.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* New Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setSelectedPaymentId('new-card')}
              className={`w-full flex items-center gap-3 p-4 border-b border-slate-100 ${
                selectedPaymentId === 'new-card' ? 'bg-indigo-950/5' : ''
              }`}
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-semibold text-slate-900">Pay with New Card</span>
              <div
                className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPaymentId === 'new-card'
                    ? 'border-indigo-950 bg-indigo-950'
                    : 'border-slate-300'
                }`}
              >
                {selectedPaymentId === 'new-card' && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>

            {selectedPaymentId === 'new-card' && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name on card"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs text-slate-600">Save card for future orders</span>
                </label>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex justify-between text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setStep('review')}
              className="px-6 py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handlePlaceOrder}
              className="flex-1 py-3.5 bg-gradient-to-r from-indigo-950 to-indigo-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:from-indigo-900 hover:to-indigo-700 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              Place Order - {formatPrice(total)}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
