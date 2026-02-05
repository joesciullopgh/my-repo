'use client';

import { motion } from 'framer-motion';
import { Heart, Plus, Sparkles, Flame } from 'lucide-react';
import { MenuItem } from '@/types';
import { useStore } from '@/store/useStore';
import { formatPrice } from '@/lib/utils';
import DrinkImage from './DrinkImage';

interface MenuCardProps {
  item: MenuItem;
  onCustomize: (item: MenuItem) => void;
  index?: number;
}

export default function MenuCard({ item, onCustomize, index = 0 }: MenuCardProps) {
  const { user, toggleFavorite } = useStore();
  const isFavorite = user?.favoriteItems.includes(item.id) ?? false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
    >
      {/* Image Section */}
      <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
        <DrinkImage item={item} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {item.isNew && (
            <span className="flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
              <Sparkles className="w-3 h-3" /> New
            </span>
          )}
          {item.isSeasonal && (
            <span className="flex items-center gap-1 bg-purple-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
              <Flame className="w-3 h-3" /> Seasonal
            </span>
          )}
        </div>

        {/* Favorite Button */}
        {user && (
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'
              }`}
            />
          </button>
        )}

        {/* Quick Add Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCustomize(item)}
          className="absolute bottom-3 right-3 w-10 h-10 bg-indigo-950 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Content */}
      <button
        onClick={() => onCustomize(item)}
        className="w-full p-4 text-left"
      >
        <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-1 group-hover:text-indigo-900 transition-colors">
          {item.name}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-2 leading-relaxed">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-indigo-950">
            {formatPrice(item.basePrice)}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>{item.calories.grande} cal</span>
            {item.caffeine && item.caffeine.grande > 0 && (
              <>
                <span className="w-0.5 h-0.5 bg-slate-300 rounded-full" />
                <span>{item.caffeine.grande}mg caffeine</span>
              </>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
}
