import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingBag, ArrowRight, Flame, ChevronRight, Crown, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audio';
import { EmbeddedSpatialViewer } from './3d/EmbeddedSpatialViewer';

interface Props {
  featuredProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
  onToggleWishlist?: (product: Product) => void;
  wishlistIds?: number[];
  onExploreCollection: () => void;
}

export const HeroSection: React.FC<Props> = ({
  featuredProducts,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onExploreCollection,
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const heroItem = featuredProducts[activeSlide] || featuredProducts[0];

  const handleNextSlide = () => {
    audioEngine.playClick();
    setActiveSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const handlePrevSlide = () => {
    audioEngine.playClick();
    setActiveSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Ambience & Lighting Grid */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent z-10 pointer-events-none" />

      {/* Main Hero Container */}
      <div className="relative max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-20">
        {/* Left Column: Brand Statement & Embedded 3D Spatial Viewer */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
          {/* Runway Drop Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-mono uppercase tracking-[0.2em] shadow-lg shadow-black/40">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>2026 RUNWAY DROP • LIMITED EDITION</span>
          </div>

          {/* 3D Chrome Typography */}
          <div className="space-y-1">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <Crown className="w-7 h-7 sm:w-10 sm:h-10 text-white fill-current drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-400">
                HAUTE COUTURE SHIRTMAKER
              </span>
            </div>

            <h1 className="font-['Bebas_Neue'] text-6xl sm:text-8xl md:text-9xl tracking-tight leading-[0.88] uppercase select-none">
              <span className="block bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                HEY BRO
              </span>
              <span className="block text-4xl sm:text-6xl md:text-7xl bg-gradient-to-r from-zinc-100 via-zinc-300 to-white bg-clip-text text-transparent -mt-2 sm:-mt-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                MORE THAN JUST CLOTHES
              </span>
            </h1>
          </div>

          <p className="max-w-xl text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
            Engineered with high-twist Italian linens, breathable Japanese viscoses, and tailored modern silhouettes that command the room from dusk till dawn.
          </p>

          {/* Embedded 3D Spatial Viewer (Replaces Removed Buttons) */}
          <div className="w-full pt-1">
            <EmbeddedSpatialViewer
              products={featuredProducts}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              wishlistIds={wishlistIds}
            />
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-zinc-800 w-full text-left">
            <div>
              <div className="text-white font-bold text-base sm:text-lg font-['Bebas_Neue'] tracking-wider">
                100% PURE
              </div>
              <div className="text-[11px] text-zinc-400">Organic Flax & Viscose</div>
            </div>
            <div>
              <div className="text-white font-bold text-base sm:text-lg font-['Bebas_Neue'] tracking-wider">
                FREE EXPRESS
              </div>
              <div className="text-[11px] text-zinc-400">2–4 Days Across India</div>
            </div>
            <div>
              <div className="text-white font-bold text-base sm:text-lg font-['Bebas_Neue'] tracking-wider">
                7-DAY RETURN
              </div>
              <div className="text-[11px] text-zinc-400">Instant Size Exchange</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Hero Showcase Card */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="relative w-full max-w-md">
            {/* Ambient Back Glow Ring */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-white/10 via-zinc-500/10 to-white/10 blur-2xl opacity-50 pointer-events-none" />

            {/* Frosted Glass Spotlight Card */}
            <div
              onClick={() => {
                if (heroItem) onSelectProduct(heroItem);
              }}
              className="relative rounded-3xl overflow-hidden bg-neutral-900/90 backdrop-blur-2xl border border-zinc-800 shadow-2xl p-4 sm:p-5 group cursor-pointer transition-all duration-500 hover:border-white/50 hover:shadow-white/5"
            >
              {/* Product Visual Container with 3D Depth */}
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-950">
                {heroItem && (
                  <img
                    src={heroItem.images[0]}
                    alt={heroItem.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30" />

                {/* Top Badge */}
                {heroItem?.badge && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white text-black font-bold text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>{heroItem.badge}</span>
                  </div>
                )}

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] text-white font-mono flex items-center gap-1">
                  <span>★</span>
                  <span>{heroItem?.rating}</span>
                </div>

                {/* Bottom Quick-Info Overlay */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                      Fabric Structure
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {heroItem?.fabric.split(',')[0]}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                      Runway Fit
                    </span>
                    <span className="text-xs font-semibold text-white font-mono">
                      {heroItem?.fit.split(' ')[0]} {heroItem?.fit.split(' ')[1] || ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Meta & Slider Navigator */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-base text-white group-hover:text-zinc-300 transition-colors">
                    {heroItem?.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-lg font-bold text-white font-mono">
                      ₹{heroItem?.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-zinc-500 line-through font-mono">
                      ₹{heroItem?.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-zinc-300">
                      {heroItem?.discount}% OFF
                    </span>
                  </div>
                </div>

                {/* Slider Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {featuredProducts.slice(0, 4).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          audioEngine.playClick();
                          setActiveSlide(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeSlide === idx ? 'w-5 bg-white' : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextSlide();
                    }}
                    className="p-2 rounded-full bg-zinc-800 hover:bg-white hover:text-black text-white transition-all cursor-pointer"
                    title="Next Featured Shirt"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
