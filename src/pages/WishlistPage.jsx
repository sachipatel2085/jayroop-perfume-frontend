import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { productService } from '../services/productService.js';
import { SEOHead } from '../components/common/SEOHead.jsx';

export const WishlistPage = () => {
  const { wishlist, toggleWishlist, wishlistProducts } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState(wishlistProducts || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncWishlistProducts = async () => {
      if (!wishlist || wishlist.length === 0) {
        if (isMounted) {
          setProducts([]);
          setLoading(false);
        }
        return;
      }

      // 1. Gather all product objects already available in context
      const productMap = new Map();
      (wishlistProducts || []).forEach((p) => {
        if (p && (p._id || p.id)) {
          const id = String(p._id || p.id);
          if (wishlist.includes(id)) {
            productMap.set(id, p);
          }
        }
      });

      // Keep what we already have available right away
      const missingIds = wishlist.filter((id) => !productMap.has(String(id)));

      // If all items are already cached in memory, display them instantly
      if (missingIds.length === 0) {
        const sortedProducts = wishlist.map((id) => productMap.get(String(id))).filter(Boolean);
        if (isMounted) {
          setProducts(sortedProducts);
          setLoading(false);
        }
        return;
      }

      // If we have some products in cache, display them while fetching the rest
      if (productMap.size > 0 && isMounted) {
        setProducts(Array.from(productMap.values()));
      } else if (isMounted) {
        setLoading(true);
      }

      // Fetch missing products by IDs
      try {
        const res = await productService.getProducts({
          ids: missingIds.join(','),
          limit: 100,
        });

        const fetchedItems = res?.data || [];
        fetchedItems.forEach((p) => {
          if (p && (p._id || p.id)) {
            const id = String(p._id || p.id);
            if (wishlist.includes(id)) {
              productMap.set(id, p);
            }
          }
        });

        if (isMounted) {
          const finalProducts = wishlist.map((id) => productMap.get(String(id))).filter(Boolean);
          setProducts(finalProducts);
        }
      } catch (err) {
        console.error('Failed to sync missing wishlist items', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    syncWishlistProducts();

    return () => {
      isMounted = false;
    };
  }, [wishlist, wishlistProducts]);

  const handleMoveToCart = (product) => {
    addToCart(product, product.variants?.[0] || null, 1);
    toggleWishlist(product._id || product.id, product);
  };

  const handleRemove = (product) => {
    toggleWishlist(product._id || product.id, product);
  };

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      <SEOHead title="Saved Royal Wishlist" />

      <div className="border-b border-gold/20 pb-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-4xl uppercase tracking-wider text-zinc-100 font-semibold">
            Your Royal Wishlist
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Saved extraits and botanicals preserved for your consideration ({wishlist.length} item{wishlist.length === 1 ? '' : 's'})
          </p>
        </div>

        {products.length > 0 && (
          <Link
            to="/shop"
            className="text-xs text-gold hover:text-white uppercase font-semibold tracking-widest inline-flex items-center gap-1 group"
          >
            <span>Continue Exploring</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {loading && products.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-xs uppercase tracking-widest text-gold">Loading Royal Wishlist...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-noir-card border border-zinc-800 p-8 shadow-2xl">
          <Heart className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
          <h3 className="font-serif text-base uppercase tracking-wider text-zinc-300 mb-2">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-zinc-500 mb-6 max-w-md mx-auto">
            Click the heart emblem on any fragrance or skincare cream to preserve it in your royal treasury.
          </p>
          <Link to="/shop" className="btn-gold text-xs py-3 px-8 shadow-gold-glow inline-flex items-center gap-2">
            <span>Explore Treasury</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((p) => {
            const pId = p._id || p.id;
            const primaryImg =
              p.images?.[0]?.url ||
              p.images?.[0] ||
              'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800';
            const price = p.salePrice || p.price;

            return (
              <div
                key={pId}
                className="bg-noir-card border border-gold/20 hover:border-gold/50 transition-all duration-300 flex flex-col justify-between p-4 relative group shadow-lg"
              >
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(p)}
                  className="absolute top-3 right-3 p-2 bg-noir/80 hover:bg-red-950/80 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-500/50 transition-colors z-10 backdrop-blur-sm shadow-md"
                  title="Remove from wishlist"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Product link & thumbnail */}
                <Link to={`/products/${p.slug}`} className="aspect-square bg-noir block overflow-hidden mb-3">
                  <img
                    src={primaryImg}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </Link>

                {/* Details */}
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] uppercase tracking-wider text-gold font-medium">
                    {p.brand || 'Jayrup Special'}
                  </span>
                  <Link to={`/products/${p.slug}`}>
                    <h4 className="font-serif text-sm font-semibold text-zinc-100 group-hover:text-gold-light transition-colors line-clamp-1">
                      {p.name}
                    </h4>
                  </Link>
                  <p className="font-sans text-sm font-bold text-zinc-200">
                    ₹{price}
                  </p>
                </div>

                {/* Move to bag CTA */}
                <button
                  onClick={() => handleMoveToCart(p)}
                  className="w-full btn-gold py-2 text-[10px] flex items-center justify-center gap-1.5 shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Bag</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
