import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../../types';
import { Rotate3d, Pause, Play, ChevronLeft, ChevronRight, ShoppingBag, Heart, Sparkles } from 'lucide-react';
import { audioEngine } from '../../utils/audio';

interface Props {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
  onToggleWishlist?: (product: Product) => void;
  wishlistIds?: number[];
}

export const EmbeddedSpatialViewer: React.FC<Props> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [containerWidth, setContainerWidth] = useState<number>(500);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayProducts = products.slice(0, 8);
  const count = displayProducts.length;
  const angleStep = 360 / count;

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const radius = containerWidth < 420 ? 220 : containerWidth < 640 ? 270 : 340;

  // Auto rotation loop
  useEffect(() => {
    if (!autoRotate || isDragging) return;
    const interval = setInterval(() => {
      setRotation((prev) => prev - 0.25);
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    setRotation((prev) => prev + delta * 0.45);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const normalizedRot = ((-rotation % 360) + 360) % 360;
    const closest = Math.round(normalizedRot / angleStep) % count;
    setActiveIdx(closest);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
      setAutoRotate(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    const delta = e.touches[0].clientX - startX;
    setRotation((prev) => prev + delta * 0.55);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const normalizedRot = ((-rotation % 360) + 360) % 360;
    const closest = Math.round(normalizedRot / angleStep) % count;
    setActiveIdx(closest);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 5 || e.shiftKey) {
      setRotation((prev) => prev - (e.deltaX || e.deltaY) * 0.15);
      setAutoRotate(false);
    }
  };

  const rotateTo = (index: number) => {
    audioEngine.playClick();
    setActiveIdx(index);
    setAutoRotate(false);
    setRotation(-index * angleStep);
  };

  const nextCard = () => {
    const next = (activeIdx + 1) % count;
    rotateTo(next);
  };

  const prevCard = () => {
    const prev = (activeIdx - 1 + count) % count;
    rotateTo(prev);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      className="relative w-full rounded-3xl overflow-hidden bg-neutral-950/90 border border-zinc-800 shadow-2xl p-4 sm:p-5 select-none cursor-grab active:cursor-grabbing group/stage"
    >
      {/* 3D Spatial Grid & Wireframe Background Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(255,255,255,0.06),transparent)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

      {/* Top Header Bar */}
      <div className="relative z-30 flex items-center justify-between pb-3 border-b border-zinc-800/80 pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white">
            <Rotate3d className="w-4 h-4 animate-spin-slow text-zinc-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Bebas_Neue'] text-xl sm:text-2xl tracking-wider text-white">
                OFFERS
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-semibold bg-white/10 text-white/90 rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live 3D
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">Drag to Orbit</p>
          </div>
        </div>

        {/* Interactive Pause / Auto Orbit Control */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setAutoRotate(!autoRotate);
            audioEngine.playClick();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
            autoRotate
              ? 'bg-white text-black border-white shadow-md shadow-white/10 hover:bg-zinc-200'
              : 'bg-zinc-900/90 text-zinc-300 border-zinc-700 hover:text-white hover:border-zinc-500'
          }`}
          title={autoRotate ? 'Pause 3D Orbiting' : 'Resume Auto Orbiting'}
        >
          {autoRotate ? (
            <>
              <Pause className="w-3 h-3 fill-current" />
              <span>Pause Orbit</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" />
              <span>Auto Orbit</span>
            </>
          )}
        </button>
      </div>

      {/* 3D Perspective Orbit Stage */}
      <div
        className="relative w-full h-[280px] sm:h-[320px] flex items-center justify-center overflow-hidden my-1"
        style={{
          perspective: '1000px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* 3D Rotating Cylinder */}
        <div
          className="relative w-[180px] sm:w-[200px] h-[240px] sm:h-[270px] transition-transform duration-200 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateZ(-${radius}px) rotateY(${rotation}deg)`,
          }}
        >
          {displayProducts.map((product, idx) => {
            const cardAngle = idx * angleStep;
            const isWish = wishlistIds.includes(product.id);

            return (
              <div
                key={product.id}
                className="absolute inset-0 rounded-2xl overflow-hidden border border-zinc-800 bg-neutral-900/95 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-white/50 group/card cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'visible',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProduct(product);
                  audioEngine.playChime(600, 0.2);
                }}
              >
                {/* Product Image */}
                <div className="relative w-full h-[65%] overflow-hidden bg-neutral-950">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/20" />

                  {/* Top Badge */}
                  {product.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-white text-black rounded-md shadow-md">
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  {onToggleWishlist && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all ${
                        isWish
                          ? 'bg-white text-black'
                          : 'bg-black/50 text-white/70 hover:text-white hover:bg-black/80'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${isWish ? 'fill-current' : ''}`} />
                    </button>
                  )}

                  {/* Rating Tag */}
                  <div className="absolute bottom-1.5 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-zinc-300 font-mono">
                    ★ {product.rating}
                  </div>
                </div>

                {/* Card Bottom Meta */}
                <div className="p-2.5 flex flex-col justify-between h-[35%] bg-gradient-to-b from-neutral-900 to-neutral-950">
                  <div>
                    <h4 className="font-semibold text-xs text-white line-clamp-1 group-hover/card:text-zinc-200">
                      {product.name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-bold text-white font-mono">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-zinc-500 line-through font-mono">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {onAddToCart && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product, product.sizes[0] || 'M');
                          audioEngine.playSuccess();
                        }}
                        className="px-2 py-1 rounded-lg bg-white text-black text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center gap-1 shadow-sm"
                      >
                        <ShoppingBag className="w-2.5 h-2.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Orbit Navigation Bar */}
      <div className="relative z-30 flex items-center justify-between pt-2 border-t border-zinc-800/80 pointer-events-auto">
        <button
          type="button"
          onClick={prevCard}
          className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
          title="Previous Shirt"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="flex items-center gap-1">
          {displayProducts.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => rotateTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIdx === i ? 'w-4 bg-white' : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextCard}
          className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
          title="Next Shirt"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
