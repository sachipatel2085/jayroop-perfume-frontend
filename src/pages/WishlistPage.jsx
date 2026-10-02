import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { productService } from '../services/productService.js';
import { SEOHead } from '../components/common/SEOHead.jsx';

export const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlistProducts = async () => {
      try {
        setLoading(true);
        if (wishlist.length === 0) {
          setProducts([]);
          return;
        }

        // Fetch products and filter those in wishlist
        const res = await productService.getProducts({ limit: 50 });
        if (res?.data) {
          const filtered = res.data.filter((p) => wishlist.includes(p._id));
          setProducts(filtered);
        }
      } catch (err) {
        console.error('Failed to load wishlist products', err);
      } finally {
        setLoading(false);
      }
    };

    loadWishlistProducts();
  }, [wishlist]);

  const handleMoveToCart = (product) => {
    addToCart(product, product.variants?.[0] || null, 1);
    toggleWishlist(product._id);
  };

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      <SEOHead title="Saved Royal Wishlist" />

      <div className="border-b border-gold/20 pb-6 mb-8 text-center sm:text-left">
        <h1 className="font-serif text-2xl sm:text-4xl uppercase tracking-wider text-zinc-100 font-semibold">
          Your Royal Wishlist
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Saved extraits and botanicals for your consideration
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-xs uppercase tracking-widest text-gold">Loading Wishlist...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-noir-card border border-zinc-800 p-8">
          <Heart className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
          <h3 className="font-serif text-base uppercase tracking-wider text-zinc-300 mb-2">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-zinc-500 mb-6">
            Click the heart emblem on any fragrance or cream to preserve it here.
          </p>
          <Link to="/shop" className="btn-gold text-xs py-3 px-8">
            Explore Treasury
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-noir-card border border-gold/15 flex flex-col justify-between p-4 relative group"
            >
              <button
                onClick={() => toggleWishlist(p._id)}
                className="absolute top-3 right-3 p-2 bg-noir/80 text-zinc-400 hover:text-red-400 border border-zinc-800 z-10"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <Link to={`/products/${p.slug}`} className="aspect-square bg-noir block overflow-hidden mb-3">
                <img
                  src={p.images?.[0]?.url}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              <div className="space-y-1 mb-4">
                <span className="text-[10px] uppercase tracking-wider text-gold font-medium">
                  {p.brand}
                </span>
                <Link to={`/products/${p.slug}`}>
                  <h4 className="font-serif text-sm font-semibold text-zinc-100 group-hover:text-gold-light transition-colors line-clamp-1">
                    {p.name}
                  </h4>
                </Link>
                <p className="font-sans text-sm font-bold text-zinc-200">
                  ₹{p.salePrice || p.price}
                </p>
              </div>

              <button
                onClick={() => handleMoveToCart(p)}
                className="w-full btn-gold py-2 text-[10px] flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Bag</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
