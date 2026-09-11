import React, { useState } from 'react';
import { X, User, Package, Heart, Shield, Lock, ArrowRight, Check, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'login' | 'signup' | 'orders'>('login');
  const [email, setEmail] = useState<string>('arjun.verma@example.com');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-neutral-950 border border-white/15 shadow-2xl overflow-hidden p-6 sm:p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700 text-white flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6" />
          </div>
          <h2 className="font-['Bebas_Neue'] text-3xl tracking-wider text-white">
            {isLoggedIn ? 'HEY BRO CLUB' : 'WELCOME TO HEY BRO'}
          </h2>
          <p className="text-xs text-zinc-400">
            {isLoggedIn ? 'VIP Fashion Member • Level 2' : 'Sign in to access VIP runway perks & track orders'}
          </p>
        </div>

        {isLoggedIn ? (
          <div className="space-y-4 text-xs">
            {/* User Profile Card */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm text-white">Arjun Verma</h4>
                <p className="text-zinc-400">{email}</p>
                <div className="flex items-center gap-1.5 mt-2 text-white font-mono font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-300" /> 1,450 HEY BRO Points
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-black">
                VIP MEMBER
              </span>
            </div>

            {/* Past Orders Preview */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Recent Runway Orders
              </span>
              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-zinc-800 space-y-1.5">
                <div className="flex justify-between items-center text-white">
                  <span className="font-mono font-bold text-white">#HB-884920</span>
                  <span className="text-zinc-300 font-semibold text-[11px] bg-zinc-800 px-2 py-0.5 rounded">Delivered</span>
                </div>
                <p className="text-zinc-400">Botanical Bloom Camp Shirt (Size L) • ₹1,499</p>
                <span className="text-[10px] text-zinc-500 block">Delivered on Aug 28, 2026</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsLoggedIn(false);
                audioEngine.playClick();
              }}
              className="w-full py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
            >
              Sign Out of Account
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                Email / Mobile
              </label>
              <input
                type="text"
                placeholder="you@domain.com or 10-digit mobile"
                className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-zinc-800 text-sm text-white focus:border-white outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-zinc-800 text-sm text-white focus:border-white outline-none"
              />
            </div>

            <button
              onClick={() => {
                setIsLoggedIn(true);
                audioEngine.playSuccess();
              }}
              className="w-full py-3.5 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-lg shadow-white/10"
            >
              SIGN IN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
