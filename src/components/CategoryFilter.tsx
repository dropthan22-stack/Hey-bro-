import React from 'react';
import { Sparkles, Layers, Flame, Sun, Grid } from 'lucide-react';
import { audioEngine } from '../utils/audio';

export type CategoryKey = 'all' | 'printed' | 'casual' | 'solid' | 'check' | 'tropical' | 'linen' | 'oversized';

interface Props {
  activeCategory: CategoryKey;
  onSelectCategory: (cat: CategoryKey) => void;
  counts: Record<CategoryKey, number>;
}

const CATEGORIES: { key: CategoryKey; label: string; icon: string }[] = [
  { key: 'all', label: 'All Runway Shirts', icon: '✨' },
  { key: 'printed', label: 'Artistic Prints', icon: '🎨' },
  { key: 'solid', label: 'Solid Luxury', icon: '👔' },
  { key: 'linen', label: 'French Linen', icon: '🌿' },
  { key: 'tropical', label: 'Resort & Tropical', icon: '🌴' },
  { key: 'check', label: 'Flannel & Check', icon: '🏁' },
  { key: 'oversized', label: 'Streetwear Drop', icon: '⚡' },
  { key: 'casual', label: 'Weekend Casual', icon: '☕' },
];

export const CategoryFilter: React.FC<Props> = ({
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <div className="w-full border-y border-white/10 bg-neutral-950/60 backdrop-blur-xl py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  audioEngine.playClick();
                  onSelectCategory(cat.key);
                }}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-black shadow-lg shadow-white/10 scale-105 font-bold'
                    : 'bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {counts[cat.key] > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-black text-white font-bold' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {counts[cat.key]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
