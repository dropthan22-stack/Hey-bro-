import React from 'react';
import { Product } from '../types';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-neutral-950 border-l border-white/10 h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-neutral-900">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-white fill-current" />
            <h2 className="font-['Bebas_Neue'] text-2xl tracking-wider text-white">
              YOUR WISHLIST
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-white text-black">
              {wishlistItems.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white/40">
                <Heart className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">Your Wishlist is Empty</h3>
                <p className="text-xs text-zinc-400 max-w-xs">
                  Save your favorite runway shirts here to purchase whenever you are ready.
                </p>
              </div>
            </div>
          ) : (
            wishlistItems.map((product) => (
              <div
                key={product.id}
                className="p-3.5 rounded-2xl bg-neutral-900 border border-zinc-800 flex gap-3.5 items-center group hover:border-zinc-500 transition-all cursor-pointer"
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
              >
                <div className="w-18 h-22 rounded-xl overflow-hidden bg-neutral-950 flex-shrink-0">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs sm:text-sm text-white truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-bold text-white font-mono">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-zinc-500 line-through font-mono">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product, product.sizes[0] || 'M');
                        audioEngine.playSuccess();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                    >
                      <ShoppingBag className="w-3 h-3" /> Move to Bag
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWishlist(product);
                      }}
                      className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-neutral-900">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
