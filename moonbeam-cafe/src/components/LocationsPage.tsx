'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowLeft, Check, Navigation } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { LOCATIONS } from '@/data/menu';

interface LocationsPageProps {
  onBack: () => void;
}

export default function LocationsPage({ onBack }: LocationsPageProps) {
  const { selectedLocation, setSelectedLocation } = useStore();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Pickup Locations</h1>
      </div>

      <div className="space-y-3">
        {LOCATIONS.map((location, index) => {
          const isSelected = selectedLocation?.id === location.id;

          return (
            <motion.button
              key={location.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                if (location.isOpen) {
                  setSelectedLocation(location);
                }
              }}
              disabled={!location.isOpen}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                isSelected
                  ? 'border-indigo-950 bg-indigo-950/5 shadow-lg shadow-indigo-100/50'
                  : location.isOpen
                  ? 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                  : 'border-slate-200 bg-slate-50 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? 'bg-indigo-950 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{location.name}</h3>
                    {isSelected && (
                      <span className="bg-indigo-950 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{location.address}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs">
                      <Navigation className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-500">{location.distance}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className={location.isOpen ? 'text-emerald-600 font-medium' : 'text-red-500 font-medium'}>
                        {location.isOpen ? `~${location.estimatedWait} min wait` : 'Closed'}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{location.hours}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-indigo-950 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
