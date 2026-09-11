import React, { useState } from 'react';
import { Product } from '../types';
import { ProductViewer360 } from './3d/ProductViewer360';
import { X, Heart, ShoppingBag, Star, Truck, RefreshCw, ShieldCheck, Ruler, Check, Sparkles, Flame } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface Props {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }, quantity: number) => void;
  onBuyNow: (product: Product, size: string, color: { name: string; hex: string }, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductModal: React.FC<Props> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(product.colors[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'360' | 'details' | 'sizeChart'>('360');
  const [pinCode, setPinCode] = useState<string>('');
  const [pinStatus, setPinStatus] = useState<string | null>(null);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  const handleCheckPin = () => {
    if (!pinCode || pinCode.length < 5) {
      setPinStatus('Please enter a valid 6-digit postal code');
      return;
    }
    setPinStatus(`⚡ Guaranteed Express Delivery to ${pinCode} by Friday!`);
    audioEngine.playClick();
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    audioEngine.playSuccess();
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedSize, selectedColor, quantity);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl rounded-3xl bg-neutral-950 border border-white/15 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/90 border border-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Interactive 360 Visual Studio & Showcase */}
        <div className="w-full md:w-1/2 p-6 bg-gradient-to-b from-neutral-900 to-black flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto">
          {/* Tab Bar */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setActiveTab('360')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === '360'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              🔄 360° Inspection
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'details'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              📸 Lookbook Gallery
            </button>
            <button
              onClick={() => setActiveTab('sizeChart')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'sizeChart'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              📏 Size Guide
            </button>
          </div>

          {/* Active Visual Component */}
          {activeTab === '360' && (
            <ProductViewer360 product={product} selectedColorHex={selectedColor.hex} />
          )}

          {activeTab === 'details' && (
            <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto no-scrollbar">
              {product.images.map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-neutral-900 aspect-square">
                  <img src={img} alt={`${product.name} look ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'sizeChart' && (
            <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 text-xs text-white/80 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider">
                <Ruler className="w-4 h-4" /> Recommended Body Measurements (Inches)
              </div>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 text-[10px] uppercase">
                    <th className="py-1">Size</th>
                    <th className="py-1">Chest</th>
                    <th className="py-1">Shoulder</th>
                    <th className="py-1">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  <tr><td className="py-1.5 font-bold text-white">S</td><td>38"</td><td>17.5"</td><td>28"</td></tr>
                  <tr><td className="py-1.5 font-bold text-white">M</td><td>40"</td><td>18.0"</td><td>29"</td></tr>
                  <tr><td className="py-1.5 font-bold text-white">L</td><td>42"</td><td>18.5"</td><td>30"</td></tr>
                  <tr><td className="py-1.5 font-bold text-white">XL</td><td>44"</td><td>19.0"</td><td>31"</td></tr>
                  <tr><td className="py-1.5 font-bold text-white">XXL</td><td>46"</td><td>19.5"</td><td>31.5"</td></tr>
                </tbody>
              </table>
              <p className="text-[11px] text-white/50">{product.modelInfo}</p>
            </div>
          )}

          {/* Model Fit Info */}
          <div className="mt-4 p-3 rounded-2xl bg-neutral-900/60 border border-white/10 flex items-center justify-between text-xs">
            <span className="text-white/60">Runway Fitment:</span>
            <span className="font-semibold text-white">{product.fit}</span>
          </div>
        </div>

        {/* Right Column: Specifications, Controls, and Instant Checkout */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
          <div>
            {/* Header Badge & Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {product.badge && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-black">
                    {product.badge}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300">
                  {product.category.toUpperCase()}
                </span>
              </div>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-2 rounded-full border transition-all ${
                  isWishlisted
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Title & Tagline */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3 leading-tight">
              {product.name}
            </h2>
            <p className="text-sm text-neutral-400 font-light mt-1">
              {product.tagline}
            </p>

            {/* Price & Rating */}
            <div className="flex items-center justify-between mt-4 pb-4 border-b border-zinc-800">
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-extrabold text-white font-mono">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-base text-neutral-500 line-through font-mono">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white bg-zinc-800 border border-zinc-700">
                  Save {product.discount}%
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-white font-semibold bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating}</span>
                <span className="text-zinc-500">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Color Swatch Selector */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-white/70">
                  Select Colorway
                </span>
                <span className="font-mono text-white font-medium">{selectedColor.name}</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color);
                      audioEngine.playClick();
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                      selectedColor.name === color.name
                        ? 'bg-zinc-800 border-white ring-2 ring-white/30 text-white'
                        : 'bg-neutral-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs font-medium">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-white/70">
                  Select Size
                </span>
                <button
                  onClick={() => setActiveTab('sizeChart')}
                  className="text-zinc-300 hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3 h-3" /> Size Guide
                </button>
              </div>
              <div className="flex items-center gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      audioEngine.playClick();
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border transition-all ${
                      selectedSize === size
                        ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                        : 'bg-neutral-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & PIN Code Checker */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-neutral-900 border border-zinc-800">
                <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider block mb-1">
                  Quantity
                </span>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-mono text-base font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900 border border-zinc-800 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider block mb-1">
                  Check Delivery PIN
                </span>
                <div className="flex gap-1">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="PIN Code"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-2 text-xs text-white font-mono outline-none focus:border-white"
                  />
                  <button
                    onClick={handleCheckPin}
                    className="px-2.5 py-1 bg-white text-black text-[11px] font-bold rounded-lg hover:bg-zinc-200 transition-colors"
                  >
                    Check
                  </button>
                </div>
              </div>
            </div>

            {pinStatus && (
              <p className="text-xs text-zinc-300 font-medium mt-2 animate-in fade-in">
                {pinStatus}
              </p>
            )}

            {/* Description & Key Features */}
            <div className="mt-5 space-y-2">
              <p className="text-xs text-neutral-300 leading-relaxed font-light">
                {product.description}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-zinc-400">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
                    <span className="line-clamp-1">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-zinc-800 flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
                addedAnimation
                  ? 'bg-zinc-800 text-white border-zinc-600'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-700'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 py-3.5 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/10 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
