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
import { formatPrice } from '@/lib/utils';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const { user, isAuthenticated, cart, setCartOpen, selectedLocation, logout, isAdmin } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

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
            onClick={() => onNavigate('home')}
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
                onClick={() => onNavigate(id)}
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
                onClick={() => onNavigate('locations')}
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

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 text-slate-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-indigo-950 text-xs font-bold">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 rounded-xl shadow-xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b border-slate-700">
                    <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <button onClick={() => onNavigate('orders')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg">
                      <Clock className="w-4 h-4" /> Order History
                    </button>
                    <button onClick={() => onNavigate('rewards')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg">
                      <Star className="w-4 h-4" /> Rewards
                    </button>
                    <button onClick={() => onNavigate('favorites')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg">
                      <Heart className="w-4 h-4" /> Favorites
                    </button>
                    {isAdmin() && (
                      <button onClick={() => onNavigate('admin')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-amber-400 hover:bg-slate-700 rounded-lg">
                        <Shield className="w-4 h-4" /> Admin Dashboard
                      </button>
                    )}
                    <button onClick={() => { logout(); onNavigate('home'); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-700 rounded-lg">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-indigo-950 rounded-lg text-sm font-semibold transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-slate-800"
          >
            <nav className="px-4 py-3 flex flex-col gap-1">
              {[
                { id: 'home', label: 'Home' },
                { id: 'menu', label: 'Menu' },
                { id: 'orders', label: 'Orders' },
                { id: 'locations', label: 'Locations' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => { onNavigate(id); setMobileMenuOpen(false); }}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
                    currentPage === id
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              ))}
              {isAuthenticated && (
                <>
                  {isAdmin() && (
                    <button
                      onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                      className="px-4 py-2.5 rounded-lg text-sm font-medium text-left text-amber-400 hover:bg-white/5 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" /> Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); onNavigate('home'); }}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium text-left text-red-400 hover:bg-white/5 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
