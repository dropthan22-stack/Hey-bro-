import React, { useState } from 'react';
import { Product } from '../types';
import { X, Sparkles, Check, ArrowRight, ShieldCheck, Ruler, UserCheck } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const FittingRoomModal: React.FC<Props> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [heightCm, setHeightCm] = useState<number>(180);
  const [bodyBuild, setBodyBuild] = useState<'slim' | 'athletic' | 'regular' | 'broad'>('athletic');
  const [occasion, setOccasion] = useState<'cocktail' | 'resort' | 'work' | 'street'>('cocktail');
  const [skinUndertone, setSkinUndertone] = useState<'warm' | 'cool' | 'neutral'>('warm');

  if (!isOpen) return null;

  // Compute recommendation
  const recommendedSize = heightCm > 185 ? 'XL' : heightCm > 175 ? 'L' : heightCm > 165 ? 'M' : 'S';

  const recommendedProduct =
    occasion === 'cocktail'
      ? products[0] // Botanical Bloom
      : occasion === 'resort'
      ? products[2] // Tropical Riviera
      : occasion === 'work'
      ? products[1] // Midnight Oxford
      : products[3]; // Noir Velvet-Touch

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl bg-neutral-950 border border-white/15 shadow-2xl overflow-hidden p-6 sm:p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 text-white flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-['Bebas_Neue'] text-3xl tracking-wider text-white">
              AI STYLE ADVISOR & FITTING ROOM
            </h2>
            <p className="text-xs text-zinc-400">
              Personalized size & silhouette recommendations tailored to your physique
            </p>
          </div>
        </div>

        <div className="space-y-5 text-xs">
          {/* Height Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5 font-semibold text-zinc-300 uppercase">
              <span>Your Height</span>
              <span className="text-white font-mono text-sm">{heightCm} cm ({Math.floor(heightCm / 30.48)}'{Math.round((heightCm % 30.48) / 2.54)}")</span>
            </div>
            <input
              type="range"
              min="155"
              max="205"
              value={heightCm}
              onChange={(e) => setHeightCm(parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          {/* Body Build */}
          <div>
            <label className="font-semibold text-zinc-300 uppercase block mb-2">
              Body Physique
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['slim', 'athletic', 'regular', 'broad'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setBodyBuild(b);
                    audioEngine.playClick();
                  }}
                  className={`py-2 px-3 rounded-xl border font-semibold capitalize transition-all ${
                    bodyBuild === b
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-neutral-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Target Occasion */}
          <div>
            <label className="font-semibold text-zinc-300 uppercase block mb-2">
              Planned Occasion
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'cocktail', label: '🍸 Party & Cocktail' },
                { id: 'resort', label: '🌴 Resort / Travel' },
                { id: 'work', label: '💼 Formal / Meeting' },
                { id: 'street', label: '⚡ Streetwear Night' },
              ].map((occ) => (
                <button
                  key={occ.id}
                  onClick={() => {
                    setOccasion(occ.id as any);
                    audioEngine.playClick();
                  }}
                  className={`py-2 px-3 rounded-xl border text-left font-medium transition-all ${
                    occasion === occ.id
                      ? 'bg-zinc-800 border-white text-white font-bold'
                      : 'bg-neutral-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {occ.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calculated AI Recommendation Result */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-zinc-700 mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                <UserCheck className="w-4 h-4" /> Recommended Fitment
              </span>
              <span className="px-3 py-1 rounded-full bg-white text-black font-mono font-bold text-xs">
                Optimal Size: {recommendedSize}
              </span>
            </div>

            {recommendedProduct && (
              <div
                onClick={() => {
                  onSelectProduct(recommendedProduct);
                  onClose();
                }}
                className="flex items-center gap-4 p-3 rounded-xl bg-neutral-950 border border-zinc-800 hover:border-zinc-500 cursor-pointer transition-all group"
              >
                <img
                  src={recommendedProduct.images[0]}
                  alt={recommendedProduct.name}
                  className="w-14 h-18 rounded-lg object-cover bg-neutral-900 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase block">
                    Top Stylist Match
                  </span>
                  <h4 className="font-semibold text-white group-hover:text-zinc-300 transition-colors truncate">
                    {recommendedProduct.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">{recommendedProduct.tagline}</p>
                </div>
                <button className="p-2 rounded-full bg-white text-black group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
