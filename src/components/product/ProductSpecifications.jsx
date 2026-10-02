import React from 'react';

export const ProductSpecifications = ({ specifications }) => {
  if (!specifications || Object.keys(specifications).length === 0) return null;

  // Filter out notes if rendered separately, keep other specifications
  const entries = Object.entries(specifications).filter(
    ([key]) => !['Top Notes', 'Heart Notes', 'Base Notes'].includes(key)
  );

  if (entries.length === 0) return null;

  return (
    <div className="bg-noir-card border border-gold/20 p-6 my-6">
      <h4 className="font-serif text-sm text-gold tracking-widest uppercase mb-4">
        Formulation & Specifications
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {entries.map(([key, value]) => (
          <div key={key} className="flex flex-col border-b border-zinc-800/80 pb-2.5">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
              {key}
            </span>
            <span className="text-zinc-200 mt-0.5 font-medium">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
