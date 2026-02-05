'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { MENU_ITEMS, CATEGORIES } from '@/data/menu';
import { MenuItem, DrinkCategory } from '@/types';
import MenuCard from './MenuCard';

interface MenuPageProps {
  onCustomize: (item: MenuItem) => void;
}

export default function MenuPage({ onCustomize }: MenuPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<DrinkCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'calories'>('name');

  const filteredItems = useMemo(() => {
    let items = MENU_ITEMS;

    // Category filter
    if (selectedCategory !== 'all') {
      items = items.filter((item) => item.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag.includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'name':
        items = [...items].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        items = [...items].sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-high':
        items = [...items].sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'calories':
        items = [...items].sort((a, b) => a.calories.grande - b.calories.grande);
        break;
    }

    return items;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-[60px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Menu</h1>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drinks..."
              className="w-full pl-11 pr-12 py-3 bg-slate-100 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
                showFilters ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-3 flex gap-2 flex-wrap"
            >
              <span className="text-xs text-slate-500 self-center">Sort by:</span>
              {[
                { value: 'name', label: 'Name' },
                { value: 'price-low', label: 'Price (Low)' },
                { value: 'price-high', label: 'Price (High)' },
                { value: 'calories', label: 'Calories' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSortBy(value as typeof sortBy)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    sortBy === value
                      ? 'bg-indigo-950 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-indigo-950 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Drinks
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedCategory === category.id
                    ? 'bg-indigo-950 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-sm text-slate-500 mb-4">
          {filteredItems.length} drink{filteredItems.length !== 1 ? 's' : ''} found
        </p>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map((item, index) => (
              <MenuCard
                key={item.id}
                item={item}
                onCustomize={onCustomize}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg font-semibold text-slate-900 mb-1">No drinks found</p>
            <p className="text-sm text-slate-500">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
