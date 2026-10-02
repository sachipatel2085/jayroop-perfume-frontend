import React from 'react';
import { Sparkles, Heart, Feather } from 'lucide-react';

export const FragrancePyramid = ({ specifications }) => {
  if (!specifications) return null;

  const topNotes = specifications['Top Notes'];
  const heartNotes = specifications['Heart Notes'];
  const baseNotes = specifications['Base Notes'];

  // Only render if at least one fragrance note exists
  if (!topNotes && !heartNotes && !baseNotes) return null;

  return (
    <div className="bg-noir-card border border-gold/25 p-6 my-8">
      <div className="text-center mb-6">
        <h4 className="font-serif text-lg text-gold tracking-widest uppercase">
          Olfactory Pyramid
        </h4>
        <p className="text-[11px] text-zinc-400 tracking-wider uppercase mt-1">
          The Scent Evolution Over Time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {/* Top Notes */}
        {topNotes && (
          <div className="flex flex-col items-center p-4 bg-noir/60 border border-gold/15">
            <Sparkles className="w-5 h-5 text-gold-light mb-2" />
            <h5 className="font-serif text-xs uppercase tracking-widest text-zinc-200 font-semibold mb-1">
              Top Notes
            </h5>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
              First 15-30 Minutes
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {topNotes}
            </p>
          </div>
        )}

        {/* Heart Notes */}
        {heartNotes && (
          <div className="flex flex-col items-center p-4 bg-noir/60 border border-gold/25 shadow-gold-glow">
            <Heart className="w-5 h-5 text-gold mb-2" />
            <h5 className="font-serif text-xs uppercase tracking-widest text-gold-light font-semibold mb-1">
              Heart Notes
            </h5>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
              Hours 2 to 6
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {heartNotes}
            </p>
          </div>
        )}

        {/* Base Notes */}
        {baseNotes && (
          <div className="flex flex-col items-center p-4 bg-noir/60 border border-gold/15">
            <Feather className="w-5 h-5 text-gold-dark mb-2" />
            <h5 className="font-serif text-xs uppercase tracking-widest text-zinc-200 font-semibold mb-1">
              Base Notes
            </h5>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
              Hours 6 to 14+
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {baseNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
