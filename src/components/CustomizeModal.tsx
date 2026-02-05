'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Minus,
  Thermometer,
  Milk,
  Coffee,
  Droplets,
  Cherry,
  Snowflake,
  Heart,
  ShoppingBag,
} from 'lucide-react';
import {
  MenuItem,
  DrinkCustomization,
  Size,
  MilkType,
  Temperature,
  EspressoRoast,
  SyrupFlavor,
  Topping,
  SyrupCustomization,
  ToppingCustomization,
  SweetenerType,
  SweetenerCustomization,
  PRICING,
  CartItem,
} from '@/types';
import { useStore, calculateItemPrice } from '@/store/useStore';
import { formatPrice, capitalizeFirst } from '@/lib/utils';
import DrinkImage from './DrinkImage';

export default function CustomizeModal() {
  const {
    isCustomizing,
    customizingItem,
    editingCartItem,
    stopCustomizing,
    stopEditingCartItem,
    addToCart,
    updateCartItem,
    user,
    toggleFavorite,
  } = useStore();

  const [customization, setCustomization] = useState<DrinkCustomization>({
    size: 'grande',
    temperature: 'hot',
    syrups: [],
    toppings: [],
    sweeteners: [],
  });

  const [quantity, setQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState<string>('size');

  useEffect(() => {
    if (customizingItem) {
      if (editingCartItem) {
        setCustomization({ ...editingCartItem.customization });
        setQuantity(editingCartItem.quantity);
      } else {
        const defaults = customizingItem.defaultCustomization;
        setCustomization({
          size: defaults.size || 'grande',
          temperature: defaults.temperature || customizingItem.availableTemperatures[0],
          milk: defaults.milk,
          espressoRoast: defaults.espressoRoast,
          espressoShots: defaults.espressoShots || 0,
          syrups: defaults.syrups ? [...defaults.syrups] : [],
          toppings: defaults.toppings ? [...defaults.toppings] : [],
          sweeteners: defaults.sweeteners ? [...defaults.sweeteners] : [],
          iceLevel: defaults.iceLevel,
          instructions: '',
        });
        setQuantity(1);
      }
      setActiveSection('size');
    }
  }, [customizingItem, editingCartItem]);

  if (!isCustomizing || !customizingItem) return null;

  const itemPrice = calculateItemPrice(customizingItem.basePrice, customization);
  const totalPrice = itemPrice * quantity;

  const isFavorite = user?.favoriteItems.includes(customizingItem.id) ?? false;

  const handleClose = () => {
    if (editingCartItem) {
      stopEditingCartItem();
    } else {
      stopCustomizing();
    }
  };

  const handleAddToCart = () => {
    if (editingCartItem) {
      updateCartItem(editingCartItem.id, customization);
    } else {
      addToCart(customizingItem, customization, quantity);
    }
    handleClose();
  };

  const updateSyrup = (flavor: SyrupFlavor, pumps: number) => {
    setCustomization((prev) => {
      const existing = prev.syrups.findIndex((s) => s.flavor === flavor);
      const newSyrups = [...prev.syrups];

      if (pumps <= 0) {
        if (existing >= 0) newSyrups.splice(existing, 1);
      } else if (existing >= 0) {
        newSyrups[existing] = { flavor, pumps };
      } else {
        newSyrups.push({ flavor, pumps });
      }

      return { ...prev, syrups: newSyrups };
    });
  };

  const updateTopping = (topping: Topping, amount: 'light' | 'regular' | 'extra' | 'none') => {
    setCustomization((prev) => {
      const existing = prev.toppings.findIndex((t) => t.topping === topping);
      const newToppings = [...prev.toppings];

      if (amount === 'none') {
        if (existing >= 0) newToppings.splice(existing, 1);
      } else if (existing >= 0) {
        newToppings[existing] = { topping, amount };
      } else {
        newToppings.push({ topping, amount });
      }

      return { ...prev, toppings: newToppings };
    });
  };

  const updateSweetener = (type: SweetenerType, packets: number) => {
    setCustomization((prev) => {
      const existing = prev.sweeteners.findIndex((s) => s.type === type);
      const newSweeteners = [...prev.sweeteners];

      if (packets <= 0) {
        if (existing >= 0) newSweeteners.splice(existing, 1);
      } else if (existing >= 0) {
        newSweeteners[existing] = { type, packets };
      } else {
        newSweeteners.push({ type, packets });
      }

      return { ...prev, sweeteners: newSweeteners };
    });
  };

  const getSyrupPumps = (flavor: SyrupFlavor): number => {
    return customization.syrups.find((s) => s.flavor === flavor)?.pumps || 0;
  };

  const getToppingAmount = (topping: Topping): string => {
    return customization.toppings.find((t) => t.topping === topping)?.amount || 'none';
  };

  const getSweetenerPackets = (type: SweetenerType): number => {
    return customization.sweeteners.find((s) => s.type === type)?.packets || 0;
  };

  const sections = [
    { id: 'size', label: 'Size', icon: Coffee },
    { id: 'temp', label: 'Temperature', icon: Thermometer },
    ...(customization.temperature !== 'blended'
      ? [{ id: 'milk', label: 'Milk', icon: Milk }]
      : []),
    { id: 'espresso', label: 'Espresso', icon: Coffee },
    { id: 'syrups', label: 'Syrups', icon: Droplets },
    { id: 'toppings', label: 'Toppings', icon: Cherry },
    { id: 'sweeteners', label: 'Sweeteners', icon: Cherry },
    ...(customization.temperature === 'iced' || customization.temperature === 'blended'
      ? [{ id: 'ice', label: 'Ice', icon: Snowflake }]
      : []),
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
        onClick={handleClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="relative">
            <DrinkImage item={customizingItem} size="lg" className="w-full aspect-[2/1]" />
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-slate-900" />
            </button>
            {user && (
              <button
                onClick={() => toggleFavorite(customizingItem.id)}
                className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`}
                />
              </button>
            )}
          </div>

          {/* Item Info */}
          <div className="px-5 pt-4 pb-3 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">{customizingItem.name}</h2>
            <p className="text-sm text-slate-500 mt-1">{customizingItem.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
              <span>{customizingItem.calories[customization.size] || customizingItem.calories.grande} cal</span>
              {customizingItem.caffeine && (
                <>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span>{customizingItem.caffeine[customization.size] || customizingItem.caffeine.grande}mg caffeine</span>
                </>
              )}
            </div>
          </div>

          {/* Section Navigation */}
          <div className="flex gap-1 px-5 py-3 overflow-x-auto scrollbar-hide border-b border-slate-100">
            {sections.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeSection === id
                    ? 'bg-indigo-950 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Customization Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* SIZE */}
            {activeSection === 'size' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Choose Size</h3>
                <div className="grid grid-cols-3 gap-3">
                  {customizingItem.availableSizes.map((size) => {
                    const sizeInfo: Record<Size, { label: string; oz: string }> = {
                      tall: { label: 'Tall', oz: '12 fl oz' },
                      grande: { label: 'Grande', oz: '16 fl oz' },
                      venti: { label: 'Venti', oz: '20 fl oz' },
                    };
                    const info = sizeInfo[size];
                    const upcharge = PRICING.sizes[size];

                    return (
                      <button
                        key={size}
                        onClick={() => setCustomization((prev) => ({ ...prev, size }))}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          customization.size === size
                            ? 'border-indigo-950 bg-indigo-950/5'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center ${
                          size === 'tall' ? 'w-10 h-10' : size === 'grande' ? 'w-12 h-12' : 'w-14 h-14'
                        }`}>
                          <Coffee className={`text-amber-700 ${
                            size === 'tall' ? 'w-5 h-5' : size === 'grande' ? 'w-6 h-6' : 'w-7 h-7'
                          }`} />
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{info.label}</p>
                        <p className="text-[10px] text-slate-400">{info.oz}</p>
                        {upcharge > 0 && (
                          <p className="text-[10px] text-indigo-600 font-medium mt-1">+{formatPrice(upcharge)}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TEMPERATURE */}
            {activeSection === 'temp' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Temperature</h3>
                <div className="grid grid-cols-3 gap-3">
                  {customizingItem.availableTemperatures.map((temp) => {
                    const tempInfo: Record<Temperature, { label: string; icon: string }> = {
                      hot: { label: 'Hot', icon: '🔥' },
                      iced: { label: 'Iced', icon: '🧊' },
                      blended: { label: 'Blended', icon: '🌀' },
                    };
                    return (
                      <button
                        key={temp}
                        onClick={() => setCustomization((prev) => ({ ...prev, temperature: temp }))}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          customization.temperature === temp
                            ? 'border-indigo-950 bg-indigo-950/5'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-2xl">{tempInfo[temp].icon}</span>
                        <p className="text-sm font-semibold text-slate-900 mt-1">{tempInfo[temp].label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MILK */}
            {activeSection === 'milk' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Milk Choice</h3>
                <div className="space-y-2">
                  {(
                    ['whole', 'skim', '2percent', 'oat', 'almond', 'soy', 'coconut', 'oatmilk-foam'] as MilkType[]
                  ).map((milk) => {
                    const labels: Record<MilkType, string> = {
                      whole: 'Whole Milk',
                      skim: 'Nonfat Milk',
                      '2percent': '2% Milk',
                      oat: 'Oat Milk',
                      almond: 'Almond Milk',
                      soy: 'Soy Milk',
                      coconut: 'Coconut Milk',
                      'oatmilk-foam': 'Oat Milk Foam',
                    };
                    const upcharge = PRICING.milks[milk];

                    return (
                      <button
                        key={milk}
                        onClick={() => setCustomization((prev) => ({ ...prev, milk }))}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                          customization.milk === milk
                            ? 'border-indigo-950 bg-indigo-950/5'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-sm font-medium text-slate-900">{labels[milk]}</span>
                        {upcharge > 0 && (
                          <span className="text-xs text-indigo-600 font-medium">+{formatPrice(upcharge)}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ESPRESSO */}
            {activeSection === 'espresso' && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900">Espresso Roast</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(['signature', 'blonde', 'decaf'] as EspressoRoast[]).map((roast) => {
                      const labels: Record<EspressoRoast, { label: string; desc: string }> = {
                        signature: { label: 'Signature', desc: 'Rich & bold' },
                        blonde: { label: 'Blonde', desc: 'Light & smooth' },
                        decaf: { label: 'Decaf', desc: 'Full flavor, no caffeine' },
                      };
                      return (
                        <button
                          key={roast}
                          onClick={() => setCustomization((prev) => ({ ...prev, espressoRoast: roast }))}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            customization.espressoRoast === roast
                              ? 'border-indigo-950 bg-indigo-950/5'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <p className="text-sm font-semibold text-slate-900">{labels[roast].label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{labels[roast].desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900">Extra Shots</h3>
                  <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
                    <button
                      onClick={() =>
                        setCustomization((prev) => ({
                          ...prev,
                          espressoShots: Math.max(0, (prev.espressoShots || 0) - 1),
                        }))
                      }
                      className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                    >
                      <Minus className="w-4 h-4 text-slate-600" />
                    </button>
                    <div className="flex-1 text-center">
                      <p className="text-2xl font-bold text-slate-900">{customization.espressoShots || 0}</p>
                      <p className="text-[10px] text-slate-400">
                        extra shot{(customization.espressoShots || 0) !== 1 ? 's' : ''}
                        {(customization.espressoShots || 0) > 0 && (
                          <span className="text-indigo-600 ml-1">
                            (+{formatPrice((customization.espressoShots || 0) * PRICING.extraShot)})
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setCustomization((prev) => ({
                          ...prev,
                          espressoShots: Math.min(6, (prev.espressoShots || 0) + 1),
                        }))
                      }
                      className="w-10 h-10 rounded-full bg-indigo-950 flex items-center justify-center hover:bg-indigo-900"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SYRUPS */}
            {activeSection === 'syrups' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Flavor Syrups</h3>
                <div className="space-y-2">
                  {(
                    [
                      'vanilla', 'caramel', 'hazelnut', 'mocha', 'white-mocha',
                      'toffee-nut', 'peppermint', 'raspberry', 'cinnamon-dolce',
                      'brown-sugar', 'lavender', 'pistachio',
                    ] as SyrupFlavor[]
                  ).map((flavor) => {
                    const pumps = getSyrupPumps(flavor);
                    const price = PRICING.syrups[flavor];

                    return (
                      <div
                        key={flavor}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                          pumps > 0
                            ? 'border-indigo-950 bg-indigo-950/5'
                            : 'border-slate-200'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900">{capitalizeFirst(flavor)}</p>
                          {price > 0 && (
                            <p className="text-[10px] text-indigo-600">+{formatPrice(price)}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateSyrup(flavor, pumps - 1)}
                            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                              pumps > 0 ? 'border-slate-300 hover:bg-slate-100' : 'border-slate-200 opacity-30'
                            }`}
                            disabled={pumps <= 0}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-slate-900">{pumps}</span>
                          <button
                            onClick={() => updateSyrup(flavor, pumps + 1)}
                            className="w-8 h-8 rounded-full bg-indigo-950 text-white flex items-center justify-center hover:bg-indigo-900"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TOPPINGS */}
            {activeSection === 'toppings' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Toppings</h3>
                <div className="space-y-2">
                  {(
                    [
                      'whipped-cream', 'caramel-drizzle', 'mocha-drizzle',
                      'cinnamon-powder', 'vanilla-powder', 'cold-foam',
                      'salted-cream-foam', 'chocolate-curls', 'cookie-crumbles',
                    ] as Topping[]
                  ).map((topping) => {
                    const currentAmount = getToppingAmount(topping);
                    const price = PRICING.toppings[topping];
                    const amounts = ['none', 'light', 'regular', 'extra'] as const;

                    return (
                      <div
                        key={topping}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          currentAmount !== 'none'
                            ? 'border-indigo-950 bg-indigo-950/5'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{capitalizeFirst(topping)}</p>
                            {price > 0 && (
                              <p className="text-[10px] text-indigo-600">+{formatPrice(price)}</p>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {amounts.map((amount) => (
                            <button
                              key={amount}
                              onClick={() => updateTopping(topping, amount)}
                              className={`py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                                currentAmount === amount
                                  ? 'bg-indigo-950 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {amount === 'none' ? 'None' : capitalizeFirst(amount)}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SWEETENERS */}
            {activeSection === 'sweeteners' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Sweeteners</h3>
                <div className="space-y-2">
                  {(
                    [
                      'classic-syrup', 'liquid-cane-sugar', 'honey',
                      'stevia', 'splenda', 'raw-sugar',
                    ] as SweetenerType[]
                  ).map((type) => {
                    const packets = getSweetenerPackets(type);
                    const price = PRICING.sweeteners[type];

                    return (
                      <div
                        key={type}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                          packets > 0
                            ? 'border-indigo-950 bg-indigo-950/5'
                            : 'border-slate-200'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900">{capitalizeFirst(type)}</p>
                          {price > 0 && (
                            <p className="text-[10px] text-indigo-600">+{formatPrice(price)} each</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateSweetener(type, packets - 1)}
                            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                              packets > 0 ? 'border-slate-300 hover:bg-slate-100' : 'border-slate-200 opacity-30'
                            }`}
                            disabled={packets <= 0}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-slate-900">{packets}</span>
                          <button
                            onClick={() => updateSweetener(type, packets + 1)}
                            className="w-8 h-8 rounded-full bg-indigo-950 text-white flex items-center justify-center hover:bg-indigo-900"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ICE LEVEL */}
            {activeSection === 'ice' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Ice Level</h3>
                <div className="grid grid-cols-4 gap-3">
                  {(['no-ice', 'light', 'regular', 'extra'] as const).map((level) => {
                    const labels = {
                      'no-ice': 'No Ice',
                      light: 'Light',
                      regular: 'Regular',
                      extra: 'Extra',
                    };
                    return (
                      <button
                        key={level}
                        onClick={() => setCustomization((prev) => ({ ...prev, iceLevel: level }))}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          customization.iceLevel === level
                            ? 'border-indigo-950 bg-indigo-950/5'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Snowflake className={`w-5 h-5 mx-auto mb-1 ${
                          customization.iceLevel === level ? 'text-indigo-950' : 'text-slate-400'
                        }`} />
                        <p className="text-xs font-medium">{labels[level]}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Special Instructions</h3>
              <textarea
                value={customization.instructions || ''}
                onChange={(e) => setCustomization((prev) => ({ ...prev, instructions: e.target.value }))}
                placeholder="Any special requests? (e.g., extra hot, light foam...)"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={2}
              />
            </div>
          </div>

          {/* Footer - Add to Cart */}
          <div className="border-t border-slate-200 px-5 py-4 bg-white">
            {!editingCartItem && (
              <div className="flex items-center justify-center gap-4 mb-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-bold text-slate-900 w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-8 h-8 rounded-full bg-indigo-950 text-white flex items-center justify-center hover:bg-indigo-900"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-indigo-950 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-indigo-900 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              {editingCartItem ? 'Update Item' : `Add to Cart - ${formatPrice(totalPrice)}`}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
