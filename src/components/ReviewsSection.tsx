import React from 'react';
import { Review } from '../types';
import { Star, ShieldCheck, ThumbsUp, Quote } from 'lucide-react';
import { REVIEWS_DATA } from '../data/products';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-zinc-400">
          VOICES FROM THE RUNWAY
        </span>
        <h2 className="font-['Bebas_Neue'] text-4xl sm:text-6xl text-white tracking-wider">
          WHAT OUR CLIENTS SAY
        </h2>
        <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
          <div className="flex text-white">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span>4.9 / 5.0 Average Customer Rating Across 2,400+ Verified Orders</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {REVIEWS_DATA.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-3xl bg-neutral-900 border border-zinc-800 hover:border-zinc-600 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-white">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{rev.date}</span>
              </div>

              <h4 className="font-semibold text-sm text-white group-hover:text-zinc-200 transition-colors">
                "{rev.title}"
              </h4>

              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                {rev.comment}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white text-black font-bold flex items-center justify-center text-xs">
                  {rev.avatarLetter}
                </div>
                <div>
                  <span className="font-semibold text-white block">{rev.author}</span>
                  <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-white" /> Verified Buyer
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                <ThumbsUp className="w-3 h-3 text-white" /> {rev.helpfulCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
