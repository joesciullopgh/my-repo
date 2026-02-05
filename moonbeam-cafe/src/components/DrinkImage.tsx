'use client';

import { MenuItem } from '@/types';
import { Coffee, GlassWater, CupSoda, Leaf, Cherry, Candy } from 'lucide-react';

// Generate beautiful gradient backgrounds and icons for drinks without images
const categoryStyles: Record<string, { gradient: string; Icon: React.ElementType }> = {
  espresso: { gradient: 'from-amber-800 via-amber-700 to-amber-900', Icon: Coffee },
  'cold-brew': { gradient: 'from-slate-700 via-slate-600 to-amber-900', Icon: GlassWater },
  frappuccino: { gradient: 'from-sky-300 via-indigo-300 to-purple-300', Icon: CupSoda },
  tea: { gradient: 'from-green-600 via-emerald-500 to-teal-600', Icon: Leaf },
  refreshers: { gradient: 'from-pink-400 via-rose-400 to-fuchsia-400', Icon: Cherry },
  'hot-chocolate': { gradient: 'from-amber-900 via-amber-800 to-yellow-900', Icon: Candy },
  seasonal: { gradient: 'from-purple-600 via-violet-500 to-fuchsia-600', Icon: Coffee },
};

// Specific drink colors for variety
const drinkColors: Record<string, string> = {
  'caffe-latte': 'from-amber-600 via-amber-500 to-yellow-600',
  'cappuccino': 'from-amber-700 via-amber-600 to-orange-700',
  'caramel-macchiato': 'from-amber-500 via-yellow-600 to-amber-700',
  'mocha': 'from-amber-900 via-amber-800 to-yellow-900',
  'white-mocha': 'from-amber-100 via-yellow-50 to-amber-200',
  'americano': 'from-amber-950 via-amber-900 to-slate-900',
  'flat-white': 'from-amber-200 via-amber-100 to-yellow-200',
  'brown-sugar-oatmilk-shaken': 'from-amber-600 via-orange-500 to-amber-800',
  'pistachio-latte': 'from-green-400 via-emerald-300 to-lime-300',
  'lavender-oatmilk-latte': 'from-violet-300 via-purple-200 to-lavender-300',
  'cold-brew': 'from-slate-800 via-amber-900 to-slate-900',
  'nitro-cold-brew': 'from-slate-900 via-slate-800 to-amber-950',
  'salted-caramel-cold-brew': 'from-amber-600 via-amber-500 to-slate-700',
  'vanilla-sweet-cream-cold-brew': 'from-amber-100 via-slate-700 to-amber-200',
  'caramel-frappuccino': 'from-amber-400 via-yellow-300 to-amber-500',
  'mocha-frappuccino': 'from-amber-800 via-amber-600 to-amber-900',
  'java-chip-frappuccino': 'from-amber-900 via-slate-800 to-amber-950',
  'vanilla-bean-frappuccino': 'from-amber-50 via-yellow-50 to-orange-50',
  'cookie-crumble-frappuccino': 'from-amber-700 via-amber-600 to-amber-800',
  'chai-latte': 'from-orange-600 via-amber-500 to-orange-700',
  'matcha-latte': 'from-green-500 via-emerald-400 to-green-600',
  'london-fog': 'from-slate-400 via-slate-300 to-purple-200',
  'strawberry-acai': 'from-pink-500 via-rose-400 to-pink-600',
  'pink-drink': 'from-pink-300 via-rose-200 to-pink-400',
  'mango-dragonfruit': 'from-fuchsia-500 via-pink-400 to-yellow-400',
  'dragon-drink': 'from-fuchsia-400 via-pink-300 to-fuchsia-500',
  'hot-chocolate': 'from-amber-800 via-amber-700 to-amber-900',
  'white-hot-chocolate': 'from-amber-100 via-yellow-50 to-amber-200',
};

interface DrinkImageProps {
  item: MenuItem;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function DrinkImage({ item, className = '', size = 'md' }: DrinkImageProps) {
  const style = categoryStyles[item.category as string] || categoryStyles.espresso;
  const drinkGradient = drinkColors[item.id] || style.gradient;
  const { Icon } = style;

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12',
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className={`relative flex items-center justify-center bg-gradient-to-br ${drinkGradient} ${sizeClasses[size]} ${className}`}>
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-black/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/5 rounded-full blur-xl" />
      </div>

      {/* Cup illustration */}
      <div className="relative z-10 flex flex-col items-center">
        <Icon className={`${iconSizes[size]} text-white/90 drop-shadow-lg`} />
        {size !== 'sm' && (
          <div className="mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="text-white/90 text-[10px] font-medium uppercase tracking-wider">
              {item.category.replace('-', ' ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
