import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, Check, Star, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { resolveMediaUrl } from '../../utils/media.js';

const GENDER_LABEL = { MEN: 'For him', WOMEN: 'For her' };

const RailCard = ({ product, priceNote }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const img = product.images?.find((x) => x.isPrimary) || product.images?.[0];
  const onSale = product.salePrice && product.salePrice < product.price;
  const price = onSale ? product.salePrice : product.price;
  const out = product.stock <= 0;
  const id = product._id || product.id;
  const liked = isInWishlist(id);

  const add = () => {
    addToCart(product, product.variants?.[0] || null, 1);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="snap-start shrink-0 w-[74%] sm:w-[42%] md:w-[31%] lg:w-[calc((100%-3*1.25rem)/4)] group flex flex-col bg-noir-card border border-gold/15 hover:border-gold/50 transition-colors">
      <div className="relative">
        <Link to={`/products/${product.slug}`} className="block aspect-square overflow-hidden bg-[#0d1015]" aria-label={product.name}>
          <img
            src={resolveMediaUrl(img?.url)}
            alt={img?.altText || product.name}
            width="600"
            height="600"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </Link>
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1 pointer-events-none">
          {onSale && <span className="bg-gold text-black text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">Sale</span>}
          {GENDER_LABEL[product.gender] && (
            <span className="bg-noir/75 border border-gold/40 text-gold-light text-[9px] font-semibold px-2 py-0.5 uppercase tracking-wider backdrop-blur-sm">
              {GENDER_LABEL[product.gender]}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(id, product)}
          className="absolute top-3 right-3 p-2 rounded-full bg-noir/70 border border-white/10 hover:border-gold/50 text-zinc-300 hover:text-gold backdrop-blur-sm"
          aria-label={liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-gold text-gold' : ''}`} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        {product.category?.name && <p className="text-[10px] uppercase tracking-[0.2em] text-gold/80">{product.category.name}</p>}
        <h3 className="font-serif text-[15px] leading-snug text-zinc-100 mt-1 line-clamp-2 min-h-[2.6em]">
          <Link to={`/products/${product.slug}`} className="hover:text-gold-light transition-colors">
            {product.name}
          </Link>
        </h3>
        {product.numReviews > 0 && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-zinc-400">
            <Star className="w-3 h-3 fill-gold text-gold" /> {Number(product.averageRating || 0).toFixed(1)} · {product.numReviews} reviews
          </p>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-zinc-100">₹{price}</span>
          {onSale && <span className="text-xs text-zinc-500 line-through">₹{product.price}</span>}
          <span className="text-[10px] text-zinc-500">{priceNote}</span>
        </div>
        <button
          type="button"
          onClick={add}
          disabled={out}
          className={`mt-4 w-full inline-flex items-center justify-center gap-2 py-3 text-[11px] uppercase tracking-wider font-bold transition-colors ${
            out ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : added ? 'bg-emerald-500 text-black' : 'bg-gold hover:bg-gold-light text-black'
          }`}
          aria-live="polite"
        >
          {out ? 'Out of stock' : added ? (<><Check className="w-4 h-4" /> Added to cart</>) : (<><ShoppingBag className="w-4 h-4" /> Add to cart</>)}
        </button>
      </div>
    </article>
  );
};

/**
 * Horizontally scrollable product row with category chips and arrow buttons.
 * Touch / trackpad users swipe; mouse users can use the arrows. Scroll-snap keeps cards aligned.
 */
export const ProductRail = ({ products = [], loading = false, priceNote = '', eyebrow, title, subtitle, id = 'products-rail' }) => {
  const scroller = useRef(null);
  const [filter, setFilter] = useState('ALL');
  const [edges, setEdges] = useState({ start: true, end: false });

  const cats = [];
  for (const p of products) {
    if (p.category?.slug && !cats.some((c) => c.slug === p.category.slug)) cats.push(p.category);
  }
  const shown = filter === 'ALL' ? products : products.filter((p) => p.category?.slug === filter);

  const updateEdges = () => {
    const el = scroller.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  };
  useEffect(() => {
    updateEdges();
    const el = scroller.current;
    if (el) el.scrollTo({ left: 0 });
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, [filter, products.length]);

  const page = (dir) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <section className="py-12 sm:py-16" aria-labelledby={`${id}-heading`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{eyebrow}</p>}
            <h2 id={`${id}-heading`} className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-zinc-100 mt-1">
              {title}
            </h2>
            {subtitle && <p className="text-sm text-zinc-400 mt-2 max-w-2xl">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/shop" className="mr-2 inline-flex items-center gap-1 text-xs text-gold hover:text-white uppercase tracking-widest font-semibold">
              Shop all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button type="button" onClick={() => page(-1)} disabled={edges.start} className="hidden sm:inline-flex p-2.5 border border-gold/30 text-gold hover:bg-gold hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold transition-colors" aria-label="Previous products">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => page(1)} disabled={edges.end} className="hidden sm:inline-flex p-2.5 border border-gold/30 text-gold hover:bg-gold hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold transition-colors" aria-label="Next products">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </header>

        {cats.length > 1 && (
          <div className="mt-6 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="Filter products by category">
            {[{ slug: 'ALL', name: 'All products' }, ...cats].map((c) => (
              <button
                key={c.slug}
                type="button"
                role="tab"
                aria-selected={filter === c.slug}
                onClick={() => setFilter(c.slug)}
                className={`shrink-0 px-4 py-2 text-[11px] uppercase tracking-wider font-semibold border transition-colors ${
                  filter === c.slug ? 'bg-gold text-black border-gold' : 'border-zinc-700 text-zinc-300 hover:border-gold/60 hover:text-gold-light'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative max-w-7xl mx-auto mt-6">
        <div
          ref={scroller}
          onScroll={updateEdges}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar px-4 sm:px-8 scroll-px-4 sm:scroll-px-8 pb-2"
        >
          {loading && !products.length
            ? [0, 1, 2, 3].map((n) => (
                <div key={n} className="snap-start shrink-0 w-[74%] sm:w-[42%] md:w-[31%] lg:w-[calc((100%-3*1.25rem)/4)] aspect-[3/4.4] bg-noir-card border border-zinc-800 animate-pulse" />
              ))
            : shown.map((p) => <RailCard key={p._id} product={p} priceNote={priceNote} />)}
        </div>
        {/* edge fades hint that the row scrolls */}
        {!edges.start && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-noir to-transparent" />}
        {!edges.end && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-noir to-transparent" />}
      </div>
    </section>
  );
};
