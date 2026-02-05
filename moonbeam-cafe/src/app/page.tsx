'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { MenuItem } from '@/types';
import Header from '@/components/Header';
import HomePage from '@/components/HomePage';
import MenuPage from '@/components/MenuPage';
import LoginPage from '@/components/LoginPage';
import CheckoutPage from '@/components/CheckoutPage';
import OrderTracker from '@/components/OrderTracker';
import LocationsPage from '@/components/LocationsPage';
import CartSidebar from '@/components/CartSidebar';
import CustomizeModal from '@/components/CustomizeModal';
import MenuCard from '@/components/MenuCard';
import { MENU_ITEMS } from '@/data/menu';

type Page = 'home' | 'menu' | 'login' | 'checkout' | 'orders' | 'locations' | 'rewards' | 'favorites';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { startCustomizing, isCustomizing } = useStore();

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCustomize = useCallback(
    (item: MenuItem) => {
      startCustomizing(item);
    },
    [startCustomizing]
  );

  const handleCheckout = useCallback(() => {
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOrderPlaced = useCallback(() => {
    setCurrentPage('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onCustomize={handleCustomize} />;
      case 'menu':
        return <MenuPage onCustomize={handleCustomize} />;
      case 'login':
        return <LoginPage onSuccess={() => handleNavigate('home')} />;
      case 'checkout':
        return (
          <CheckoutPage
            onBack={() => handleNavigate('menu')}
            onOrderPlaced={handleOrderPlaced}
          />
        );
      case 'orders':
        return <OrderTracker onBack={() => handleNavigate('home')} />;
      case 'locations':
        return <LocationsPage onBack={() => handleNavigate('home')} />;
      case 'rewards':
        return <RewardsPage onBack={() => handleNavigate('home')} />;
      case 'favorites':
        return (
          <FavoritesPage
            onBack={() => handleNavigate('home')}
            onCustomize={handleCustomize}
          />
        );
      default:
        return <HomePage onNavigate={handleNavigate} onCustomize={handleCustomize} />;
    }
  };

  const showHeader = currentPage !== 'login';

  return (
    <div className="min-h-screen bg-slate-50">
      {showHeader && (
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
      )}

      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>

      <CartSidebar onCheckout={handleCheckout} />

      {isCustomizing && <CustomizeModal />}

      {/* Mobile Bottom Navigation */}
      {showHeader && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 pb-safe">
          <div className="flex items-center justify-around py-2">
            {[
              { id: 'home' as Page, label: 'Home', icon: '🏠' },
              { id: 'menu' as Page, label: 'Menu', icon: '☕' },
              { id: 'orders' as Page, label: 'Orders', icon: '📋' },
              { id: 'rewards' as Page, label: 'Rewards', icon: '⭐' },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => handleNavigate(id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  currentPage === id
                    ? 'text-indigo-950'
                    : 'text-slate-400'
                }`}
              >
                <span className="text-lg">{icon}</span>
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}

// Rewards Page Component
function RewardsPage({ onBack }: { onBack: () => void }) {
  const { user, isAuthenticated } = useStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Sign in to view rewards</h2>
        <p className="text-sm text-slate-500">Join Moonbeam Rewards to earn stars and free drinks.</p>
      </div>
    );
  }

  const { rewards } = user;
  const progressPercent = Math.min(
    100,
    ((200 - rewards.starsToNextReward) / 200) * 100
  );

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <button onClick={onBack} className="text-sm text-indigo-600 font-medium mb-4">
        &larr; Back
      </button>

      <div className="bg-gradient-to-br from-indigo-950 to-slate-900 rounded-2xl p-6 text-center mb-6">
        <p className="text-xs text-amber-400 font-medium uppercase tracking-wider mb-1">
          {rewards.tier} Member
        </p>
        <p className="text-5xl font-bold text-white mb-1">{rewards.stars}</p>
        <p className="text-sm text-slate-300">Stars</p>

        <div className="mt-6">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>{rewards.stars} stars</span>
            <span>{rewards.starsToNextReward} to next reward</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
            />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-3">Available Rewards</h3>
      {rewards.availableRewards.length > 0 ? (
        <div className="space-y-3">
          {rewards.availableRewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{reward.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{reward.description}</p>
                </div>
                <button className="px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-semibold hover:bg-amber-600">
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          Keep earning stars! You&apos;re {rewards.starsToNextReward} stars away from your next reward.
        </p>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-3">How It Works</h3>
        <div className="space-y-3">
          {[
            { stars: '25', desc: 'Customize your drink (extra shot, dairy alternative, etc.)' },
            { stars: '100', desc: 'Brewed coffee, hot tea, or bakery item' },
            { stars: '150', desc: 'Handcrafted drink (any size)' },
            { stars: '200', desc: 'Lunch sandwich or protein box' },
            { stars: '400', desc: 'Select merchandise or at-home coffee' },
          ].map((tier) => (
            <div key={tier.stars} className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 p-3">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-amber-600">{tier.stars}</span>
              </div>
              <p className="text-sm text-slate-700">{tier.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Favorites Page Component
function FavoritesPage({ onBack, onCustomize }: { onBack: () => void; onCustomize: (item: MenuItem) => void }) {
  const { user } = useStore();

  const favoriteItems = MENU_ITEMS.filter((item: MenuItem) => user?.favoriteItems.includes(item.id));

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button onClick={onBack} className="text-sm text-indigo-600 font-medium mb-4">
        &larr; Back
      </button>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Your Favorites</h1>

      {favoriteItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {favoriteItems.map((item: MenuItem, index: number) => (
            <MenuCard key={item.id} item={item} onCustomize={onCustomize} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg font-semibold text-slate-900 mb-1">No favorites yet</p>
          <p className="text-sm text-slate-500">
            Tap the heart icon on any drink to add it to your favorites
          </p>
        </div>
      )}
    </div>
  );
}
