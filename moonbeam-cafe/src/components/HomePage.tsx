'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Star,
  Clock,
  Sparkles,
  Moon,
  Coffee,
  Gift,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { MENU_ITEMS, CATEGORIES, getFeaturedItems, getNewItems } from '@/data/menu';
import { MenuItem } from '@/types';
import MenuCard from './MenuCard';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onCustomize: (item: MenuItem) => void;
}

export default function HomePage({ onNavigate, onCustomize }: HomePageProps) {
  const { user, isAuthenticated, selectedLocation } = useStore();
  const featuredItems = getFeaturedItems().slice(0, 6);
  const newItems = getNewItems();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-3xl" />
          {/* Star particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-300/30 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            {/* Greeting */}
            {isAuthenticated && user ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-4"
              >
                <span className="text-amber-400 text-sm">Good {getTimeOfDay()},</span>
                <span className="text-white text-sm font-semibold">{user.firstName}</span>
                <Moon className="w-4 h-4 text-amber-400" />
              </motion.div>
            ) : null}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
            >
              Brewed by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Moonlight
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-300 text-lg mb-8 max-w-lg"
            >
              Handcrafted beverages made with organic ingredients, customized exactly to your taste. Order ahead and skip the line.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={() => onNavigate('menu')}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 text-indigo-950 rounded-xl font-semibold text-sm flex items-center gap-2 hover:from-amber-400 hover:to-amber-300 transition-all shadow-lg shadow-amber-500/20"
              >
                Order Now
                <ArrowRight className="w-4 h-4" />
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => onNavigate('login')}
                  className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-white/20 transition-all border border-white/20"
                >
                  Join Rewards
                  <Star className="w-4 h-4 text-amber-400" />
                </button>
              )}
            </motion.div>

            {/* Quick Stats */}
            {isAuthenticated && user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-lg font-bold text-white">{user.rewards.stars}</p>
                      <p className="text-[10px] text-slate-300 uppercase tracking-wider">Stars</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-lg font-bold text-white">{user.rewards.availableRewards.length}</p>
                      <p className="text-[10px] text-slate-300 uppercase tracking-wider">Rewards</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-lg font-bold text-white capitalize">{user.rewards.tier}</p>
                      <p className="text-[10px] text-slate-300 uppercase tracking-wider">Tier</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Location Banner */}
      {selectedLocation && (
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span className="text-slate-600">Ordering from</span>
              <span className="font-semibold text-slate-900">{selectedLocation.name}</span>
              <span className="text-slate-400">|</span>
              <span className="text-emerald-600 font-medium">{selectedLocation.estimatedWait} min wait</span>
            </div>
            <button
              onClick={() => onNavigate('locations')}
              className="text-xs text-indigo-600 font-medium hover:text-indigo-800"
            >
              Change
            </button>
          </div>
        </section>
      )}

      {/* Category Browsing */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Browse Menu</h2>
          <button
            onClick={() => onNavigate('menu')}
            className="text-sm text-indigo-600 font-medium flex items-center gap-1 hover:text-indigo-800"
          >
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onNavigate('menu')}
              className="group bg-white rounded-2xl p-4 text-center border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all"
            >
              <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">{category.icon}</span>
              <p className="text-sm font-semibold text-slate-900">{category.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{category.description}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* New & Seasonal Items */}
      {newItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-10">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-2xl font-bold text-slate-900">New & Seasonal</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {newItems.map((item, index) => (
              <MenuCard key={item.id} item={item} onCustomize={onCustomize} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Items */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Popular Drinks</h2>
          <button
            onClick={() => onNavigate('menu')}
            className="text-sm text-indigo-600 font-medium flex items-center gap-1 hover:text-indigo-800"
          >
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {featuredItems.map((item, index) => (
            <MenuCard key={item.id} item={item} onCustomize={onCustomize} index={index} />
          ))}
        </div>
      </section>

      {/* Rewards CTA */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-1/4 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Join Moonbeam Rewards
              </h2>
              <p className="text-slate-300 max-w-md mx-auto mb-6">
                Earn stars with every purchase. Get free drinks, early access to seasonal items, and personalized offers.
              </p>
              <button
                onClick={() => onNavigate('login')}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 text-indigo-950 rounded-xl font-semibold text-sm inline-flex items-center gap-2 hover:from-amber-400 hover:to-amber-300 transition-all"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-indigo-950 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Moon className="w-6 h-6 text-amber-400" />
                <span className="text-lg font-bold text-white">MOONBEAM</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Organic roasted coffee, teas, pastries, and more. Brewed by moonlight, crafted for you.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Menu</h4>
              <ul className="space-y-2 text-xs">
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => onNavigate('menu')}
                      className="hover:text-amber-400 transition-colors"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-xs">
                <li><span className="hover:text-amber-400 cursor-pointer">About Us</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer">Careers</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer">Sustainability</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer">Press</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Support</h4>
              <ul className="space-y-2 text-xs">
                <li><span className="hover:text-amber-400 cursor-pointer">Help Center</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer">Contact Us</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Moonbeam Café. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
