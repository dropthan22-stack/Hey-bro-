import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../../types';
import { ShoppingBag, Heart, Eye, Rotate3d, Sparkles, ChevronLeft, ChevronRight, X, ArrowUpRight } from 'lucide-react';
import { audioEngine } from '../../utils/audio';

interface Props {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: number[];
  onClose?: () => void;
}

export const SpatialCardViewer3D: React.FC<Props> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onClose,
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const count = products.length;
  const angleStep = 360 / count;
  const radius = windowWidth < 640 ? 360 : windowWidth < 1024 ? 460 : 540;

  // Auto slow rotation when not dragging
  useEffect(() => {
    if (!autoRotate || isDragging) return;
    const interval = setInterval(() => {
      setRotation((prev) => prev - 0.2);
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
    setRotation((prev) => prev + delta * 0.4);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Snap to closest card index
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
    setRotation((prev) => prev + delta * 0.5);
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
      className="relative w-full h-[640px] md:h-[720px] flex flex-col items-center justify-center overflow-hidden select-none cursor-grab active:cursor-grabbing bg-neutral-950 border-y border-zinc-800"
    >
      {/* 3D Scene Controls & Header */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white">
            <Rotate3d className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold uppercase tracking-[0.2em] text-white font-['Bebas_Neue'] sm:font-mono">
                OFFERS
              </span>
              <span className="px-2 py-0.5 text-[9px] font-semibold bg-white/10 text-white/80 rounded-full font-mono">
                Drag to Orbit
              </span>
            </div>
            <p className="text-[12px] text-zinc-400 font-mono">360° Interactive Spatial Carousel</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
              autoRotate
                ? 'bg-white text-black border-white font-semibold'
                : 'bg-black/40 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {autoRotate ? '⏸ Pause Orbit' : '▶ Auto Orbit'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3D Perspective Stage */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* 3D Ring Container */}
        <div
          className="relative w-[300px] md:w-[340px] h-[440px] md:h-[480px] transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateZ(-${radius}px) rotateY(${rotation}deg)`,
          }}
        >
          {products.map((product, idx) => {
            const cardAngle = idx * angleStep;
            const isWish = wishlistIds.includes(product.id);

            return (
              <div
                key={product.id}
                className="absolute inset-0 rounded-3xl overflow-hidden border border-zinc-800 bg-neutral-950/90 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:border-zinc-500 group"
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
                {/* Image Container with specular reflection */}
                <div className="relative w-full h-[62%] overflow-hidden bg-neutral-900">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30" />

                  {/* Badges */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white text-black rounded-full shadow-lg">
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist Heart */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                      isWish
                        ? 'bg-white text-black'
                        : 'bg-black/50 text-white/70 hover:text-white hover:bg-black/80'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWish ? 'fill-current' : ''}`} />
                  </button>

                  {/* 3D floating tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/80">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-zinc-800">
                      {product.fabric.split(' ')[0]} {product.fabric.split(' ')[1] || ''}
                    </span>
                    <span className="text-zinc-300 font-semibold flex items-center gap-1">
                      ★ {product.rating}
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 flex flex-col justify-between h-[38%] bg-gradient-to-b from-neutral-900/90 to-neutral-950">
                  <div>
                    <h3 className="font-semibold text-sm text-white/90 line-clamp-1 group-hover:text-white transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-white font-mono">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-zinc-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-semibold">
                        {product.discount}% OFF
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product, product.sizes[0] || 'M');
                        audioEngine.playSuccess();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-md shadow-white/10 hover:scale-105 active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Ambient glow border on hover */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-white/20" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Orbit Navigation Controls at Bottom */}
      <div className="absolute bottom-6 flex items-center gap-4 z-30 pointer-events-auto bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-full border border-zinc-800 shadow-2xl">
        <button
          onClick={prevCard}
          className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all"
          title="Previous Shirt"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => rotateTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIdx === i ? 'w-6 bg-white' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextCard}
          className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all"
          title="Next Shirt"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
