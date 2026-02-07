'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  User,
  MapPin,
  Star,
  Menu as MenuIcon,
  X,
  Moon,
  LogOut,
  Heart,
  Clock,
  Shield,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const { user, isAuthenticated, cart, setCartOpen, selectedLocation, logout, isAdmin } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setMobileMenuOpen(false);
    try {
      await logout();
      onNavigate('home');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 shadow-lg shadow-indigo-950/20">
      {/* Rewards Banner */}
      {isAuthenticated && user && (
        <div className="bg-gradient-to-r from-amber-500/90 via-yellow-500/90 to-amber-500/90 text-indigo-950 px-4 py-1.5 text-center text-xs font-semibold">
          <Star className="inline w-3 h-3 mr-1" />
          {user.rewards.stars} Stars | {user.rewards.tier.toUpperCase()} Member
          {user.rewards.availableRewards.length > 0 && (
            <span className="ml-2 bg-indigo-950/20 rounded-full px-2 py-0.5">
              {user.rewards.availableRewards.length} reward available!
            </span>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <Moon className="w-8 h-8 text-amber-400 group-hover:text-amber-300 transition-colors" />
              <div className="absolute inset-0 w-8 h-8 bg-amber-400/20 rounded-full blur-md group-hover:bg-amber-300/30 transition-all" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-wide leading-tight">
                MOONBEAM
              </span>
              <span className="text-[10px] tracking-[0.3em] text-amber-400/80 uppercase -mt-0.5">
                Café
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'home', label: 'Home' },
              { id: 'menu', label: 'Menu' },
              { id: 'orders', label: 'Orders' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === id
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Location Selector */}
            {selectedLocation && (
              <button
                onClick={() => handleNavClick('locations')}
                className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors bg-white/5 rounded-lg px-3 py-2"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="max-w-[120px] truncate">{selectedLocation.name.replace('Moonbeam Cafe - ', '')}</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-slate-300 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-amber-500 text-indigo-950 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* User Button - Simple, just navigates to rewards/login */}
            {isAuthenticated ? (
              <button
                onClick={() => handleNavClick('rewards')}
                className="flex items-center gap-2 p-2 text-slate-300 hover:text-white transition-colors"
                title={`${user?.firstName} ${user?.lastName}`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-indigo-950 text-xs font-bold">
                  {user?.firstName?.charAt(0) || '?'}{user?.lastName?.charAt(0) || ''}
                </div>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-indigo-950 rounded-lg text-sm font-semibold transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Menu (works on all devices) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed top-0 right-0 h-full w-72 bg-slate-900 border-l border-slate-700 z-50 overflow-y-auto"
            >
              <div className="p-4">
                {/* Close button */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-white">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* User Info */}
                {isAuthenticated && user && (
                  <div className="mb-6 p-4 bg-slate-800 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-indigo-950 font-bold">
                        {user.firstName?.charAt(0) || '?'}{user.lastName?.charAt(0) || ''}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                        <p className="text-xs text-amber-400 mt-1">
                          <Star className="inline w-3 h-3 mr-1" />
                          {user.rewards.stars} Stars
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider px-3 py-2">Navigation</p>

                  {[
                    { id: 'home', label: 'Home' },
                    { id: 'menu', label: 'Menu' },
                    { id: 'orders', label: 'Orders' },
                    { id: 'locations', label: 'Locations' },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => handleNavClick(id)}
                      className={`w-full px-4 py-3 rounded-lg text-sm font-medium text-left transition-all ${
                        currentPage === id
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </nav>

                {/* Account Section */}
                {isAuthenticated && (
                  <nav className="mt-6 space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wider px-3 py-2">Account</p>

                    <button
                      onClick={() => handleNavClick('rewards')}
                      className="w-full px-4 py-3 rounded-lg text-sm font-medium text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-3"
                    >
                      <Star className="w-5 h-5 text-amber-400" /> Rewards
                    </button>

                    <button
                      onClick={() => handleNavClick('favorites')}
                      className="w-full px-4 py-3 rounded-lg text-sm font-medium text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-3"
                    >
                      <Heart className="w-5 h-5 text-pink-400" /> Favorites
                    </button>

                    <button
                      onClick={() => handleNavClick('orders')}
                      className="w-full px-4 py-3 rounded-lg text-sm font-medium text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-3"
                    >
                      <Clock className="w-5 h-5 text-blue-400" /> Order History
                    </button>

                    {isAdmin() && (
                      <button
                        onClick={() => handleNavClick('admin')}
                        className="w-full px-4 py-3 rounded-lg text-sm font-medium text-left text-amber-400 hover:bg-slate-800 flex items-center gap-3"
                      >
                        <Shield className="w-5 h-5" /> Admin Dashboard
                      </button>
                    )}
                  </nav>
                )}

                {/* Auth Actions */}
                <div className="mt-6 pt-6 border-t border-slate-700">
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full px-4 py-3 rounded-lg text-sm font-medium text-left text-red-400 hover:bg-red-500/10 flex items-center gap-3 disabled:opacity-50"
                    >
                      <LogOut className="w-5 h-5" />
                      {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavClick('login')}
                      className="w-full px-4 py-3 bg-amber-500 hover:bg-amber-400 text-indigo-950 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <User className="w-5 h-5" /> Sign In / Sign Up
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
