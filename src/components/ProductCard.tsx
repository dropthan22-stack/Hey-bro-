import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { Heart, ShoppingBag, Eye, Star, Sparkles, Check } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface Props {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<Props> = ({
  product,
  onSelect,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [justAdded, setJustAdded] = useState<boolean>(false);

  // 3D Perspective Mouse Parallax Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotX = -y * 14;
    const rotY = x * 14;

    setTiltStyle({
      transform: `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize);
    setJustAdded(true);
    audioEngine.playSuccess();
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      onClick={() => onSelect(product)}
      className="relative rounded-3xl overflow-hidden bg-neutral-900/80 backdrop-blur-md border border-zinc-800 shadow-xl group cursor-pointer transition-colors duration-300 hover:border-white/50 flex flex-col justify-between"
    >
      {/* Visual Image Showcase */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-950">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Gradient Shadows */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/25 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg ${
                product.badgeType === 'best-seller'
                  ? 'bg-white text-black'
                  : product.badgeType === 'new'
                  ? 'bg-zinc-800 text-white border border-zinc-600'
                  : 'bg-black text-white border border-zinc-700'
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
            isWishlisted
              ? 'bg-white text-black shadow-lg shadow-white/20'
              : 'bg-black/60 text-white/70 hover:text-white hover:bg-black/90 border border-white/10'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Floating Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex-1 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-white text-xs font-semibold backdrop-blur-md border border-zinc-700 flex items-center justify-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-300" />
            <span>Inspect</span>
          </button>

          <button
            onClick={handleQuickAdd}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg ${
              justAdded
                ? 'bg-white text-black font-extrabold'
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow bg-gradient-to-b from-neutral-900/90 to-neutral-950">
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1 text-white">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-zinc-500">({product.reviewsCount})</span>
            </div>

            <span className="text-[11px] font-mono text-zinc-400">
              {product.fabric.split(' ')[0]}
            </span>
          </div>

          <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-zinc-300 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5 font-light">
            {product.tagline}
          </p>
        </div>

        {/* Color Swatches preview */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIdx(idx);
                }}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedColorIdx === idx
                    ? 'border-white scale-125 ring-2 ring-white/30'
                    : 'border-white/20 hover:scale-110'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>

          {/* Sizes preview */}
          <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400">
            {product.sizes.slice(0, 3).map((s) => (
              <span key={s} className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                {s}
              </span>
            ))}
            {product.sizes.length > 3 && <span>+{product.sizes.length - 3}</span>}
          </div>
        </div>

        {/* Price & Discount */}
        <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white font-mono">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500 line-through font-mono">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white bg-zinc-800 border border-zinc-700">
            {product.discount}% OFF
          </span>
        </div>
      </div>
    </div>
  );
};
