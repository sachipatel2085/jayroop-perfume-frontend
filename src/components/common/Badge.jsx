import React from 'react';

export const Badge = ({ children, variant = 'gold', className = '' }) => {
  const variants = {
    gold: 'bg-gold/15 text-gold border-gold/40',
    amber: 'bg-gold-amber/20 text-gold-amber border-gold-amber/40',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    noir: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    red: 'bg-red-500/15 text-red-400 border-red-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold border rounded-full ${
        variants[variant] || variants.gold
      } ${className}`}
    >
      {children}
    </span>
  );
};
