import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Search, Menu, X, Crown, Rotate3d, User, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface Props {
  cartCount: number;
  wishlistCount: number;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onToggleSpatial3D: () => void;
  isSpatial3DActive: boolean;
  onOpenFittingRoom: () => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<Props> = ({
  cartCount,
  wishlistCount,
  searchQuery = '',
  onSearchChange,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAccount,
  onToggleSpatial3D,
  isSpatial3DActive,
  onOpenFittingRoom,
  onReplayIntro,
}) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [localSearch, setLocalSearch] = useState<string>(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    audioEngine.playClick();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#080808]/90 backdrop-blur-2xl border-b border-white/10 py-3 shadow-2xl'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo with Crown */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group cursor-pointer flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black shadow-lg shadow-white/10 group-hover:scale-105 transition-transform">
              <Crown className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Bebas_Neue'] text-2xl sm:text-3xl tracking-wider text-white group-hover:text-zinc-300 transition-all leading-none">
                HEY BRO
              </span>
              <span className="text-[8px] uppercase font-mono tracking-[0.25em] text-zinc-400 -mt-0.5">
                Luxury Fashion
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold uppercase tracking-widest text-zinc-400 flex-shrink-0">
            <button
              onClick={() => scrollToSection('hero')}
              className="hover:text-white transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="hover:text-white transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all cursor-pointer"
            >
              Collection
            </button>
            <button
              onClick={() => scrollToSection('best-sellers')}
              className="hover:text-white transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all cursor-pointer"
            >
              Best Sellers
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="hover:text-white transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all cursor-pointer"
            >
              Reviews
            </button>
          </nav>

          {/* Prominent, Persistent Search Input Bar */}
          <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md relative group">
            <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-focus-within:text-white transition-colors">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <input
              type="text"
              placeholder="Search collections..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onOpenSearch();
                }
              }}
              className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 rounded-full bg-neutral-900/90 hover:bg-neutral-800/90 focus:bg-neutral-950 border border-zinc-700/80 focus:border-white text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none transition-all shadow-inner focus:ring-1 focus:ring-white/20"
            />
            {localSearch ? (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  if (onSearchChange) onSearchChange('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Open Advanced Filters"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
              </button>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* 3D Spatial Theater Switch Button (Home / 3D Orbit) */}
            <button
              id="spatial-3d-btn"
              onClick={onToggleSpatial3D}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                isSpatial3DActive
                  ? 'bg-white text-black shadow-white/20 ring-2 ring-white'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-700'
              }`}
              title="Toggle Spatial 3D Runway"
            >
              <Rotate3d className={`w-3.5 h-3.5 ${isSpatial3DActive ? 'animate-spin-slow' : ''}`} />
              <span className="hidden sm:inline font-mono text-[11px]">3D Runway</span>
            </button>

            {/* Wishlist / Favorites Trigger */}
            <button
              id="nav-wishlist-btn"
              onClick={onOpenWishlist}
              className="p-2 rounded-full bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 relative transition-all cursor-pointer"
              title="Your Wishlist Favorites"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User Account Trigger */}
            <button
              onClick={onOpenAccount}
              className="p-2 rounded-full bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-all cursor-pointer"
              title="Account & Orders"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Shopping Cart Trigger */}
            <button
              id="nav-cart-btn"
              onClick={onOpenCart}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white text-black font-bold text-xs shadow-lg shadow-white/10 hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-mono text-xs font-extrabold">{cartCount}</span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-white/5 text-white border border-white/10 cursor-pointer"
              title="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/95 backdrop-blur-2xl pt-24 px-6 flex flex-col justify-between pb-12 animate-in fade-in duration-300">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="font-['Bebas_Neue'] text-2xl tracking-wider text-white">
                NAVIGATION
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full bg-white/10 text-white/70 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-lg font-semibold tracking-wide">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-left text-zinc-300 hover:text-white py-2 border-b border-white/5 cursor-pointer"
              >
                🏠 Home Runway
              </button>
              <button
                onClick={() => scrollToSection('products')}
                className="text-left text-zinc-300 hover:text-white py-2 border-b border-white/5 cursor-pointer"
              >
                👔 All Shirts & Collections
              </button>
              <button
                onClick={() => scrollToSection('best-sellers')}
                className="text-left text-zinc-300 hover:text-white py-2 border-b border-white/5 cursor-pointer"
              >
                🔥 Best Sellers
              </button>
              <button
                onClick={() => scrollToSection('reviews')}
                className="text-left text-zinc-300 hover:text-white py-2 border-b border-white/5 cursor-pointer"
              >
                ⭐ Client Reviews
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>HEY BRO ATELIER</span>
            <span>2026 EDITION</span>
          </div>
        </div>
      )}
    </>
  );
};

