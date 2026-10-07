import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!product) return null;

  const pId = product._id || product.id;
  const inWishlist = isInWishlist(pId);
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800';
  const hasSale = product.salePrice && product.salePrice < product.price;
  const isOutOfStock = product.stock <= 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first variant if variants exist
    const defaultVariant = product.variants?.[0] || null;
    addToCart(product, defaultVariant, 1);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(pId, product);
  };

  return (
    <div className="group relative bg-noir-card border border-gold/15 hover:border-gold/45 transition-all duration-500 flex flex-col justify-between overflow-hidden">
      {/* Top badges & Wishlist */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1">
          {hasSale && (
            <span className="pointer-events-auto bg-gradient-to-r from-gold-amber to-gold text-black text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider shadow-md">
              Sale
            </span>
          )}
          {product.featured && (
            <span className="pointer-events-auto bg-noir/80 border border-gold/50 text-gold-light text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider backdrop-blur-sm">
              Royal Pick
            </span>
          )}
        </div>

        <button
          onClick={handleWishlistToggle}
          className="pointer-events-auto p-2 rounded-full bg-noir/70 border border-white/10 hover:border-gold/50 text-zinc-300 hover:text-gold transition-colors backdrop-blur-sm shadow-md"
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              inWishlist ? 'fill-gold text-gold scale-110' : ''
            }`}
          />
        </button>
      </div>

      {/* Product Image Link */}
      <Link to={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-noir">
        <img
          src={primaryImage}
          alt={product.images?.[0]?.altText || `${product.name} - ${product.brand || 'Jayrup'}`}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
          width="400"
          height="400"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
      </Link>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between text-left">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
            <span>{product.brand || 'Jayrup Special'}</span>
            {product.category?.name && (
              <span className="text-gold/80">{product.category.name}</span>
            )}
          </div>

          {/* Product Title */}
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-serif text-sm sm:text-base font-semibold text-zinc-100 group-hover:text-gold-light transition-colors line-clamp-1 mb-1.5">
              {product.name}
            </h3>
          </Link>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-2.5">
            <div className="flex items-center text-gold">
              <Star className="w-3.5 h-3.5 fill-gold" />
              <span className="ml-1 text-[11px] font-semibold text-zinc-200">
                {product.averageRating > 0 ? product.averageRating.toFixed(1) : '5.0'}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500">
              ({product.numReviews || 12})
            </span>
          </div>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-sans font-bold text-sm sm:text-base text-zinc-100">
                ₹{product.salePrice || product.price}
              </span>
              {hasSale && (
                <span className="text-xs text-zinc-500 line-through">
                  ₹{product.price}
                </span>
              )}
            </div>
            {product.variants?.length > 1 && (
              <p className="text-[10px] text-zinc-500">Multiple sizes</p>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`p-2.5 sm:px-3 sm:py-2 flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold transition-all ${
              isOutOfStock
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gold hover:bg-gold-light text-black shadow-sm'
            }`}
            title={isOutOfStock ? 'Out of stock' : 'Quick Add to Bag'}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isOutOfStock ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
