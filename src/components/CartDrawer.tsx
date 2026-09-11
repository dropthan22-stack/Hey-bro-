import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, size: string, colorName: string, delta: number) => void;
  onRemoveItem: (id: number, size: string, colorName: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscountRate, setAppliedDiscountRate] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round(rawSubtotal * appliedDiscountRate);
  const discountedSubtotal = rawSubtotal - discountAmount;
  const freeShippingThreshold = 999;
  const isFreeShipping = rawSubtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : 99;
  const grandTotal = discountedSubtotal + shippingFee;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'HEYBRO10') {
      setAppliedDiscountRate(0.1);
      setCouponMessage({ text: '🎉 Coupon HEYBRO10 applied! 10% Discount active', isError: false });
      audioEngine.playSuccess();
    } else if (code === 'LUXURY20' || code === 'VIP20') {
      setAppliedDiscountRate(0.2);
      setCouponMessage({ text: '💎 VIP Coupon applied! 20% Luxury Discount', isError: false });
      audioEngine.playSuccess();
    } else {
      setAppliedDiscountRate(0);
      setCouponMessage({ text: 'Invalid coupon code. Try HEYBRO10 or VIP20', isError: true });
      audioEngine.playClick();
    }
  };

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
            <ShoppingBag className="w-5 h-5 text-white" />
            <h2 className="font-['Bebas_Neue'] text-2xl tracking-wider text-white">
              YOUR SHOPPING BAG
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-white text-black">
              {cartItems.reduce((a, b) => a + b.quantity, 0)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-6 py-3 bg-neutral-900 border-b border-zinc-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-zinc-300">
              {isFreeShipping ? (
                <span className="text-white font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> FREE Express Shipping Unlocked!
                </span>
              ) : (
                <span>
                  Add <strong className="text-white">₹{freeShippingThreshold - rawSubtotal}</strong> for FREE Shipping
                </span>
              )}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Min. ₹999</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (rawSubtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-zinc-800">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white/40">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">Your Runway Bag is Empty</h3>
                <p className="text-xs text-zinc-400 max-w-xs">
                  Discover our iconic 2026 shirt collection and elevate your wardrobe today.
                </p>
              </div>
              <button
                onClick={onContinueShopping}
                className="px-6 py-3 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor.name}`}
                className="pt-4 flex gap-4 items-center group"
              >
                {/* Thumbnail */}
                <div className="w-20 h-24 rounded-2xl overflow-hidden bg-neutral-900 flex-shrink-0 border border-zinc-800">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-white/90 truncate">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                    <span className="font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-zinc-300">
                      Size: {item.selectedSize}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/20"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      {item.selectedColor.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-zinc-700 rounded-lg bg-neutral-900 overflow-hidden">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.selectedSize, item.selectedColor.name, -1)
                        }
                        className="w-7 h-7 flex items-center justify-center text-white/70 hover:bg-zinc-800 text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.selectedSize, item.selectedColor.name, 1)
                        }
                        className="w-7 h-7 flex items-center justify-center text-white/70 hover:bg-zinc-800 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white font-mono">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() =>
                          onRemoveItem(item.id, item.selectedSize, item.selectedColor.name)
                        }
                        className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Promo, Breakdown & Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-zinc-800 bg-neutral-900 space-y-4">
            {/* Promo Code Input */}
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Coupon Code (e.g. HEYBRO10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-black border border-zinc-700 rounded-xl text-xs text-white font-mono uppercase placeholder:text-zinc-600 focus:border-white outline-none"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-zinc-200 transition-all font-mono"
                >
                  Apply
                </button>
              </div>

              {couponMessage && (
                <p
                  className={`text-[11px] ${
                    couponMessage.isError ? 'text-zinc-400' : 'text-white font-semibold'
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-zinc-800 font-mono">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{rawSubtotal.toLocaleString()}</span>
              </div>

              {appliedDiscountRate > 0 && (
                <div className="flex justify-between text-white font-bold">
                  <span>Promo Discount ({appliedDiscountRate * 100}%)</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Express Delivery</span>
                <span>{shippingFee === 0 ? <span className="text-white font-bold">FREE</span> : `₹${shippingFee}`}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800 font-sans">
                <span>Total Amount</span>
                <span className="text-white font-mono text-lg">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="proceed-checkout-btn"
              onClick={onProceedToCheckout}
              className="w-full py-4 rounded-full bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-white" /> 256-Bit SSL Encrypted
              </span>
              <span>•</span>
              <span>7-Day Easy Returns</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
