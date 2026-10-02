import React from 'react';

export const VariantSelector = ({ variants = [], selectedVariant, onSelectVariant }) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs tracking-wider">
        <span className="uppercase text-zinc-400 font-medium">Select Size / Volume</span>
        {selectedVariant && (
          <span className="text-gold font-semibold">
            {selectedVariant.title}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {variants.map((v) => {
          const isSelected = selectedVariant?.sku === v.sku;
          const isOutOfStock = v.stock <= 0;

          return (
            <button
              key={v.sku}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelectVariant(v)}
              className={`relative px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
                isSelected
                  ? 'border-gold bg-gold/15 text-gold-light shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                  : isOutOfStock
                  ? 'border-zinc-800 text-zinc-600 line-through cursor-not-allowed bg-zinc-900/40'
                  : 'border-zinc-800 text-zinc-300 hover:border-gold/50 bg-noir-card'
              }`}
            >
              <span>{v.title}</span>
              {v.salePrice ? (
                <span className="ml-2 text-[10px] text-zinc-400 font-normal">
                  ₹{v.salePrice}
                </span>
              ) : (
                <span className="ml-2 text-[10px] text-zinc-400 font-normal">
                  ₹{v.price}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
