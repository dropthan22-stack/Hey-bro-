import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Search, X, Star, ShoppingBag, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const POPULAR_TAGS = ['Botanical', 'French Linen', 'Midnight Navy', 'Flannel Check', 'Black Slim', 'Tropical', 'Runway Drop'];

export const SearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(2500);

  const filteredProducts = useMemo(() => {
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q);
      const matchPrice = p.price <= maxPrice;
      return matchQuery && matchPrice;
    });
  }, [products, query, maxPrice]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-start justify-center pt-20 px-4 sm:px-6 pb-12 overflow-y-auto animate-in fade-in duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-3xl bg-neutral-950 border border-white/15 shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300"
      >
        {/* Search Input Bar */}
        <div className="p-6 border-b border-zinc-800 flex items-center gap-4 bg-neutral-900">
          <Search className="w-6 h-6 text-white flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search shirts by fabric, color, style or mood..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-lg sm:text-xl font-medium text-white placeholder:text-zinc-500 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs font-mono uppercase"
          >
            ESC
          </button>
        </div>

        {/* Quick Tags & Filters */}
        <div className="px-6 py-4 bg-neutral-900/60 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-zinc-500 font-mono text-[10px] uppercase mr-1">Trending:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  audioEngine.playClick();
                }}
                className={`px-3 py-1 rounded-full border transition-all ${
                  query === tag
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-[11px]">Max: ₹{maxPrice}</span>
            <input
              type="range"
              min="800"
              max="2500"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>

        {/* Results Grid */}
        <div className="p-6 max-h-[500px] overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">
              No matching shirts found for "<span className="text-white">{query}</span>". Try another search term.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-neutral-900 border border-zinc-800 hover:border-zinc-600 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-950 mb-2.5">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[10px] font-mono text-white">
                      ★ {product.rating}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs text-white group-hover:text-zinc-300 transition-colors truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-sm font-bold text-white font-mono">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-semibold">
                        {product.discount}% OFF
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
