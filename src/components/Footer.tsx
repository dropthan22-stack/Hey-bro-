import React from 'react';
import { Crown } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950/80 border-t border-zinc-900 pt-8 pb-10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-black">
              <Crown className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-['Bebas_Neue'] text-xl tracking-wider text-white">
              HEY BRO
            </span>
            <span className="text-zinc-600 pl-2">© 2026 Luxury Apparel Inc.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
