import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  Minus,
  Plus,
  Share2,
  BadgeCheck,
  Banknote,
  Flag,
  Check,
  PlayCircle,
  Info,
} from 'lucide-react';
import { productService } from '../services/productService.js';
import { paymentService } from '../services/paymentService.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { FragrancePyramid } from '../components/product/FragrancePyramid.jsx';
import { ReviewSection } from '../components/product/ReviewSection.jsx';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { SEO } from '../components/seo/SEO.jsx';
import { ProductSchema } from '../components/seo/ProductSchema.jsx';
import { BreadcrumbSchema } from '../components/seo/BreadcrumbSchema.jsx';
import { FAQSchema } from '../components/seo/FAQSchema.jsx';
import { sanitizeHtml } from '../utils/sanitizeHtml.js';
import { BRAND, formatINR } from '../config/site.js';
import { useStoreSettings, taxNote } from '../hooks/useStoreSettings.js';

const strip = (s = '') => String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const Rich = ({ html }) => <div className="rich-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />;

const Accordion = ({ title, children, defaultOpen = false, id }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div id={id} className="border-b border-zinc-800 scroll-mt-24">
      <h2>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full flex items-center justify-between py-5 text-left">
          <span className="font-serif text-base sm:text-lg uppercase tracking-wider text-zinc-100">{title}</span>
          <ChevronDown className={`w-5 h-5 text-gold transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </h2>
      <div className={open ? 'pb-6' : 'hidden'}>{children}</div>
    </div>
  );
};

const youtubeId = (url = '') => {
  const m = /(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/.exec(url);
  return m ? m[1] : null;
};

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, setInstantCheckout } = useCart();
  const storeSettings = useStoreSettings();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [meta, setMeta] = useState({});
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [variant, setVariant] = useState(null);
  const [activeMedia, setActiveMedia] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  // Network / server problems are NOT "not found" – they must never add noindex (Google would drop the page)
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [zoom, setZoom] = useState(null);
  const [shipping, setShipping] = useState({ freeShippingThreshold: 999, flatShippingFee: 100, codEnabled: true });
  const [copied, setCopied] = useState(false);
  const buyBoxRef = useRef(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setNotFound(false);
    setLoadError(false);
    // One quiet retry for brief network / rate-limit blips (also protects Googlebot's render)
    const fetchProduct = () =>
      productService.getProductBySlug(slug).catch(async (err) => {
        if (err?.status === 404 || err?.status === 410 || err?.data?.redirectTo) throw err;
        await new Promise((r) => setTimeout(r, 1500));
        return productService.getProductBySlug(slug);
      });
    fetchProduct()
      .then((res) => {
        if (!alive) return;
        if (!res?.product) {
          const e = new Error('not found');
          e.status = 404;
          throw e;
        }
        setProduct(res.product);
        setMeta(res.meta || {});
        setRelated(res.relatedProducts || []);
        setActiveMedia(0);
        setQty(1);
        const firstInStock = res.product.variants?.find((v) => v.stock > 0) || res.product.variants?.[0] || null;
        setVariant(firstInStock);
        if (res.product.numReviews > 0) productService.getProductReviews(res.product._id).then((r) => alive && Array.isArray(r) && setReviews(r)).catch(() => {});
      })
      .catch(async (err) => {
        if (!alive) return;
        if (err?.data?.redirectTo) {
          navigate(err.data.redirectTo, { replace: true });
          return;
        }
        if (err?.status === 404 || err?.status === 410) setNotFound(true);
        else setLoadError(true);
      })
      .finally(() => alive && setLoading(false));
    window.scrollTo(0, 0);
    return () => {
      alive = false;
    };
  }, [slug, navigate, reloadKey]);

  useEffect(() => {
    paymentService.getPublicSettings().then((s) => s && setShipping(s)).catch(() => {});
  }, []);

  useEffect(() => {
    const el = buyBoxRef.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [product]);

  const media = useMemo(() => {
    if (!product) return [];
    const imgs = (product.images || []).map((i) => ({ type: 'image', url: i.url, alt: i.altText }));
    const vids = (product.videos || []).map((v) => ({ type: 'video', url: v.url, title: v.title, yt: youtubeId(v.url) }));
    return [...imgs, ...vids];
  }, [product]);

  if (loading) {
    return (
      <div className="bg-noir min-h-screen max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-square bg-noir-card rounded-2xl" />
        <div className="space-y-4">
          <div className="h-4 w-24 bg-noir-card rounded" />
          <div className="h-10 w-3/4 bg-noir-card rounded" />
          <div className="h-6 w-40 bg-noir-card rounded" />
          <div className="h-24 bg-noir-card rounded" />
          <div className="h-12 bg-noir-card rounded" />
        </div>
      </div>
    );
  }

  if (loadError) {
    // No <SEO> here on purpose: the server-rendered title, description, robots (index) and
    // product schema stay in place, so a temporary outage never de-indexes the product.
    return (
      <div className="bg-noir min-h-[60vh] py-24 text-center px-4">
        <h1 className="font-serif text-2xl text-zinc-200 uppercase tracking-wider mb-4">Couldn’t load this product</h1>
        <p className="text-sm text-zinc-500 mb-6">Please check your connection and try again.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => setReloadKey((k) => k + 1)} className="btn-gold">Try again</button>
          <Link to="/shop" className="btn-outline-gold">Browse all products</Link>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="bg-noir min-h-[60vh] py-24 text-center px-4">
        <SEO title="Product not found" searchIndexing="NOINDEX_NOFOLLOW" />
        <h1 className="font-serif text-2xl text-zinc-200 uppercase tracking-wider mb-4">Product not found</h1>
        <p className="text-sm text-zinc-500 mb-6">It may have been renamed or is no longer available.</p>
        <Link to="/shop" className="btn-gold">Browse all products</Link>
      </div>
    );
  }

  const mrp = variant?.price ?? product.price;
  const sale = variant ? variant.salePrice : product.salePrice;
  const price = sale && sale < mrp ? sale : mrp;
  const discount = price < mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const stock = variant?.stock ?? product.stock;
  const outOfStock = stock <= 0;
  const maxQty = Math.max(1, Math.min(product.maxPerOrder || 10, stock || 1));
  const pId = product._id;
  const inWishlist = isInWishlist(pId);
  const freeShip = price * qty >= (shipping.freeShippingThreshold ?? 999);
  const rating = Number(product.averageRating || 0);
  // Perfumes & other flammables travel by surface → later promise (server decides per product type)
  const delivery = new Date(Date.now() + (meta.surfaceOnly ? 11 : 8) * 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const returnable = meta.returnable !== false;
  const fr = product.fragrance || {};
  const fragranceRows = [
    ['Fragrance family', fr.family],
    ['Concentration', fr.concentration],
    ['Longevity', fr.longevity],
    ['Sillage / projection', fr.sillage],
    ['Best season', fr.season?.join(', ')],
    ['Occasion', fr.occasion?.join(', ')],
  ].filter(([, v]) => v);
  const specs = product.specifications || {};
  const hasNotes = Boolean(
    product.fragranceNotes?.topNotes || product.fragranceNotes?.heartNotes || product.fragranceNotes?.baseNotes || specs['Top Notes'] || specs['Heart Notes'] || specs['Base Notes']
  );
  const showFragrance = fragranceRows.length > 0 || hasNotes;

  const crumbs = [
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    ...(product.category ? [{ name: product.category.name, url: `/category/${product.category.slug}` }] : []),
    { name: product.name, url: `/products/${product.slug}` },
  ];

  const seoTitle = product.seo?.metaTitle || `${product.name}${product.netQuantity ? ` ${product.netQuantity}` : ''} – Buy Online at ${formatINR(price)} | ${product.brand || BRAND.name}`;
  const seoDesc =
    product.seo?.metaDescription ||
    `${strip(product.shortDescription || product.description).slice(0, 120)} ✓ ${formatINR(price)} ✓ Free delivery above ${formatINR(shipping.freeShippingThreshold ?? 999)} ✓ PhonePe & COD`;

  const legalRows = [
    ['Brand', product.brand || BRAND.name],
    ['Net quantity', variant?.netQuantity || variant?.title || product.netQuantity],
    [`MRP (${taxNote(storeSettings)})`, formatINR(mrp)],
    ['Country of origin', product.countryOfOrigin || 'India'],
    ['Shelf life / Best before', product.shelfLife],
    ['Manufactured by', product.manufacturerDetails],
    ['Marketed by', product.marketedBy],
    ['Packed by', product.packerDetails],
    ['Imported by', product.importerDetails],
    ['Licence no.', product.licenseNumber],
    ['Customer care', product.customerCareDetails || `${BRAND.email} · ${BRAND.phone}`],
    ['SKU', variant?.sku || product.sku],
    ['Returns', returnable ? 'Returnable within 3 days if unused & sealed' : 'Not returnable once opened – damaged / leaking / wrong items replaced'],
  ].filter(([, v]) => v);

  const specEntries = Object.entries(product.specifications || {}).filter(([k]) => !['Top Notes', 'Heart Notes', 'Base Notes'].includes(k));

  const handleAdd = () => addToCart(product, variant, qty);
  const handleBuy = () => {
    setInstantCheckout(product, variant, qty);
    navigate('/checkout?mode=instant');
  };
  const share = async () => {
    const url = `${window.location.origin}/products/${product.slug}`;
    try {
      if (navigator.share) await navigator.share({ title: product.name, text: product.shortDescription, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* user cancelled */
    }
  };

  const current = media[activeMedia] || media[0];

  return (
    <div className="bg-noir min-h-screen text-zinc-100">
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={product.seo?.metaKeywords || [product.name, product.brand, ...(product.tags || []), ...(product.concerns || [])].filter(Boolean).join(', ')}
        canonicalUrl={product.seo?.canonicalUrl || `/products/${product.slug}`}
        ogImage={product.seo?.ogImage || product.images?.[0]?.url}
        ogType="product"
        searchIndexing={product.seo?.searchIndexing || 'INDEX_FOLLOW'}
        product={{ price, inStock: !outOfStock, brand: product.brand || BRAND.name }}
      >
        <ProductSchema product={product} reviews={reviews} shippingRules={shipping} />
        <BreadcrumbSchema items={crumbs} />
        {product.faqs?.length > 0 && <FAQSchema faqs={product.faqs} id="product-faq-schema-jsonld" />}
      </SEO>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-16">
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500 mb-6 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
          {crumbs.slice(0, -1).map((c) => (
            <React.Fragment key={c.url}>
              <Link to={c.url} className="hover:text-gold">{c.name}</Link>
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            </React.Fragment>
          ))}
          <span className="text-gold truncate" aria-current="page">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 xl:gap-16">
          {/* ───────── Gallery ───────── */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              {media.length > 1 && (
                <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[560px] pb-1 sm:pb-0 sm:pr-1">
                  {media.map((m, i) => (
                    <button
                      key={`${m.url}-${i}`}
                      type="button"
                      onClick={() => setActiveMedia(i)}
                      aria-label={`Show ${m.type} ${i + 1}`}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        i === activeMedia ? 'border-gold' : 'border-zinc-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {m.type === 'image' ? (
                        <img src={m.url} alt={m.alt || `${product.name} thumbnail ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <span className="w-full h-full bg-black flex items-center justify-center">
                          {m.yt ? <img src={`https://i.ytimg.com/vi/${m.yt}/mqdefault.jpg`} alt="" className="w-full h-full object-cover opacity-70" /> : null}
                          <PlayCircle className="w-7 h-7 text-gold absolute" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
              <div className="relative flex-1 aspect-square bg-noir-card border border-gold/15 rounded-2xl overflow-hidden">
                {current?.type === 'video' ? (
                  current.yt ? (
                    <iframe className="w-full h-full" src={`https://www.youtube-nocookie.com/embed/${current.yt}`} title={current.title || product.name} allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen />
                  ) : (
                    <video src={current.url} controls className="w-full h-full object-contain bg-black" />
                  )
                ) : (
                  <div
                    className="w-full h-full cursor-zoom-in"
                    onMouseMove={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
                    }}
                    onMouseLeave={() => setZoom(null)}
                  >
                    <img
                      src={current?.url || '/logo-512.png'}
                      alt={current?.alt || `${product.name} – ${product.brand || BRAND.name}`}
                      className="w-full h-full object-cover transition-transform duration-200"
                      style={zoom ? { transform: 'scale(1.9)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
                      fetchPriority="high"
                      loading="eager"
                      width="800"
                      height="800"
                    />
                  </div>
                )}
                {discount > 0 && <span className="absolute top-4 left-4 bg-emerald-500 text-black text-[11px] font-extrabold px-3 py-1 rounded-full">{discount}% OFF</span>}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button onClick={() => toggleWishlist(pId, product)} className="p-2.5 rounded-full bg-noir/80 border border-white/10 text-zinc-200 hover:text-gold backdrop-blur" aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-gold text-gold' : ''}`} />
                  </button>
                  <button onClick={share} className="p-2.5 rounded-full bg-noir/80 border border-white/10 text-zinc-200 hover:text-gold backdrop-blur" aria-label="Share">
                    {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ───────── Buy box ───────── */}
          <div>
            <div className="flex items-center justify-between text-xs uppercase tracking-widest mb-2">
              <Link to={product.category ? `/category/${product.category.slug}` : '/shop'} className="text-gold font-semibold hover:underline">{product.brand || BRAND.name}</Link>
              {product.netQuantity && <span className="text-zinc-500">{product.netQuantity}</span>}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl xl:text-4xl tracking-wide font-bold text-zinc-50 leading-tight">{product.name}</h1>

            <a href="#reviews" className="mt-3 inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-gold">
              <span className="flex" aria-label={`${rating.toFixed(1)} out of 5`}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? 'fill-gold text-gold' : 'text-zinc-700'}`} />
                ))}
              </span>
              {product.numReviews > 0 ? (
                <span><b className="text-zinc-200">{rating.toFixed(1)}</b> · {product.numReviews} review{product.numReviews > 1 ? 's' : ''}</span>
              ) : (
                <span>Be the first to review</span>
              )}
              {product.totalSold > 20 && <span className="text-zinc-500">· {product.totalSold}+ sold</span>}
            </a>

            <div className="mt-5 p-4 rounded-2xl bg-noir-card border border-zinc-800">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-3xl font-extrabold text-zinc-50">{formatINR(price)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-base text-zinc-500 line-through">MRP {formatINR(mrp)}</span>
                    <span className="text-sm font-bold text-emerald-400">Save {formatINR(mrp - price)} ({discount}%)</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">{taxNote(storeSettings, { long: true })} · GST invoice available</p>
            </div>

            {product.shortDescription && <p className="mt-5 text-sm text-zinc-300 leading-relaxed">{product.shortDescription}</p>}

            {product.highlights?.length > 0 && (
              <ul className="mt-5 space-y-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-zinc-200">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-gold" /></span>
                    {h}
                  </li>
                ))}
              </ul>
            )}

            {(product.skinTypes?.length > 0 || product.concerns?.length > 0 || fr.family || fr.concentration) && (
              <div className="mt-5 flex flex-wrap gap-2">
                {[fr.concentration, fr.family, ...(product.concerns || []), ...(product.skinTypes || [])].filter(Boolean).slice(0, 8).map((t) => (
                  <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-zinc-800 text-zinc-300">{t}</span>
                ))}
              </div>
            )}

            {product.variants?.length > 0 && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-wider text-zinc-400 mb-2">
                  Size: <span className="text-gold font-semibold normal-case">{variant?.title}</span>
                </p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Choose size">
                  {product.variants.map((v) => {
                    const vPrice = v.salePrice && v.salePrice < v.price ? v.salePrice : v.price;
                    const sel = variant?.sku === v.sku;
                    return (
                      <button
                        key={v.sku}
                        type="button"
                        role="radio"
                        aria-checked={sel}
                        disabled={v.stock <= 0}
                        onClick={() => {
                          setVariant(v);
                          setQty(1);
                        }}
                        className={`min-w-[96px] px-4 py-2.5 rounded-xl border text-left transition-all ${
                          sel ? 'border-gold bg-gold/10' : v.stock <= 0 ? 'border-zinc-900 opacity-40 cursor-not-allowed' : 'border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        <span className="block text-sm font-semibold text-zinc-100">{v.title}</span>
                        {v.netQuantity && v.netQuantity !== v.title && <span className="block text-[10px] text-zinc-500">{v.netQuantity}</span>}
                        <span className="block text-[11px] text-zinc-400">{v.stock <= 0 ? 'Sold out' : formatINR(vPrice)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div ref={buyBoxRef} className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-zinc-800 rounded-xl bg-noir-card" aria-label="Quantity">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 text-zinc-400 hover:text-gold" aria-label="Decrease quantity"><Minus className="w-4 h-4" /></button>
                  <span className="w-8 text-center text-sm font-bold" aria-live="polite">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} className="p-3 text-zinc-400 hover:text-gold" aria-label="Increase quantity"><Plus className="w-4 h-4" /></button>
                </div>
                <button type="button" onClick={handleAdd} disabled={outOfStock} className="flex-1 btn-outline-gold rounded-xl !py-3.5">
                  <ShoppingBag className="w-4 h-4 mr-2" /> {outOfStock ? 'Sold out' : 'Add to bag'}
                </button>
              </div>
              <button type="button" onClick={handleBuy} disabled={outOfStock} className="w-full btn-gold rounded-xl !py-4 text-[13px]">
                <Zap className="w-4 h-4 mr-2" /> Buy now · {formatINR(price * qty)}
              </button>
              <p className={`text-xs ${outOfStock ? 'text-red-400' : stock <= 5 ? 'text-amber-300' : 'text-emerald-400'}`}>
                {outOfStock ? 'Currently out of stock' : stock <= 5 ? `Hurry – only ${stock} left in stock` : 'In stock · ready to ship'}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-800 divide-y divide-zinc-800 text-sm">
              <div className="flex gap-3 p-4">
                <Truck className="w-5 h-5 text-gold flex-shrink-0" />
                <div>
                  <p className="text-zinc-100">Delivery by <b>{delivery}</b> <span className="text-zinc-500 text-xs">(estimate)</span></p>
                  <p className="text-xs text-zinc-500">
                    {freeShip ? 'FREE delivery on this order' : `FREE delivery on orders above ${formatINR(shipping.freeShippingThreshold ?? 999)}`} · Ships across India
                    {meta.estimatedDeliveryText ? ` · usually ${meta.estimatedDeliveryText}` : ''}
                  </p>
                  {meta.surfaceOnly && (
                    <p className="text-[11px] text-amber-300/90 mt-1">Ships by surface transport as per courier safety rules for fragrances – may take 2–3 extra days.</p>
                  )}
                  {meta.shippingNote && <p className="text-[11px] text-zinc-400 mt-1">{meta.shippingNote}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-800">
                {[
                  [ShieldCheck, 'Secure PhonePe'],
                  [Banknote, shipping.codEnabled === false ? 'Prepaid only' : 'COD available'],
                  [RotateCcw, returnable ? '3-day return*' : 'Replacement if damaged*'],
                  [Flag, 'Made in India'],
                ].map(([Icon, t]) => (
                  <div key={t} className="bg-noir flex flex-col items-center gap-1.5 py-3 text-[11px] text-zinc-400 text-center">
                    <Icon className="w-4 h-4 text-gold" /> {t}
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-2 text-[10px] text-zinc-600">
              *{meta.returnNote ||
                (returnable
                  ? 'Unused, sealed items in original packaging can be returned within 3 days of delivery.'
                  : 'Not returnable once opened (hygiene). Broken, leaking or wrong items are replaced or refunded.')}{' '}
              See <Link to="/refund-return-policy" className="underline">Return Policy</Link>.
            </p>
          </div>
        </div>

        {/* ───────── Information ───────── */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          <div className="min-w-0">
            <nav className="flex gap-2 overflow-x-auto pb-3 mb-2 border-b border-zinc-800 text-xs" aria-label="Product information">
              {[
                ['description', 'Description', true],
                ['benefits', 'Benefits', product.benefits],
                ['ingredients', 'Ingredients', product.ingredients],
                ['fragrance', 'Fragrance profile', showFragrance],
                ['how-to-use', 'How to use', product.howToUse],
                ['details', 'Product details', true],
                ['faqs', 'FAQs', product.faqs?.length],
                ['reviews', 'Reviews', true],
              ]
                .filter(([, , show]) => show)
                .map(([id, l]) => (
                  <a key={id} href={`#${id}`} className="px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-300 hover:border-gold hover:text-gold whitespace-nowrap">{l}</a>
                ))}
            </nav>

            <Accordion id="description" title="Description" defaultOpen>
              <Rich html={product.description} />
            </Accordion>
            {product.benefits && (
              <Accordion id="benefits" title="Key benefits" defaultOpen>
                <Rich html={product.benefits} />
              </Accordion>
            )}
            {showFragrance && (
              <Accordion id="fragrance" title="Fragrance profile" defaultOpen>
                {fragranceRows.length > 0 && (
                  <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
                    {fragranceRows.map(([k, v]) => (
                      <div key={k} className="rounded-xl border border-zinc-800 bg-noir-card px-4 py-3">
                        <dt className="text-[10px] uppercase tracking-wider text-zinc-500">{k}</dt>
                        <dd className="text-sm text-zinc-100 mt-0.5">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {hasNotes && <FragrancePyramid specifications={product.specifications} fragranceNotes={product.fragranceNotes} />}
              </Accordion>
            )}
            {product.ingredients && (
              <Accordion id="ingredients" title="Ingredients">
                <Rich html={product.ingredients} />
              </Accordion>
            )}
            {product.howToUse && (
              <Accordion id="how-to-use" title="How to use" defaultOpen>
                <Rich html={product.howToUse} />
              </Accordion>
            )}
            {product.precautions && (
              <Accordion id="precautions" title="Precautions & safety">
                <Rich html={product.precautions} />
              </Accordion>
            )}
            <Accordion id="details" title="Product details & legal information">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                {[...specEntries, ...legalRows].map(([k, v]) => (
                  <div key={k} className="flex flex-col py-3 border-b border-zinc-800/70">
                    <dt className="text-[11px] uppercase tracking-wider text-zinc-500">{k}</dt>
                    <dd className="text-sm text-zinc-200 mt-0.5 whitespace-pre-line">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[11px] text-zinc-500 flex gap-2"><Info className="w-3.5 h-3.5 flex-shrink-0" />For external use only. Please read the label before use. Product images are for illustration; packaging may vary.</p>
            </Accordion>

            {product.faqs?.length > 0 && (
              <section id="faqs" className="mt-12 scroll-mt-24">
                <h2 className="font-serif text-xl sm:text-2xl uppercase tracking-wider mb-4">Frequently asked questions</h2>
                <div className="space-y-2">
                  {product.faqs.map((f, i) => (
                    <details key={i} className="group bg-noir-card border border-zinc-800 rounded-xl px-5 py-4 open:border-gold/40">
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-sm font-semibold text-zinc-100">
                        {f.question}
                        <ChevronDown className="w-4 h-4 text-gold group-open:rotate-180 transition-transform flex-shrink-0" />
                      </summary>
                      <p className="mt-3 text-sm text-zinc-400 leading-relaxed whitespace-pre-line">{f.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <ReviewSection productId={product._id} />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-noir-card border border-gold/20 rounded-2xl p-5">
              <BadgeCheck className="w-6 h-6 text-gold mb-2" />
              <p className="text-sm font-semibold text-zinc-100">100% genuine {product.brand || BRAND.name}</p>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Shipped directly by the brand with a GST invoice. Questions? Our team replies within one business day.</p>
              <div className="mt-4 flex flex-col gap-2 text-xs">
                <a href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">WhatsApp {BRAND.phone}</a>
                <a href={`mailto:${BRAND.email}?subject=${encodeURIComponent(product.name)}`} className="text-gold hover:underline">{BRAND.email}</a>
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-zinc-900 pt-12">
            <div className="text-center mb-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Complete your routine</p>
              <h2 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-semibold mt-1">You may also like</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky mobile buy bar */}
      <div className={`fixed bottom-0 inset-x-0 z-40 lg:hidden bg-noir/95 backdrop-blur border-t border-gold/30 px-4 py-3 flex items-center gap-3 transition-transform ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-zinc-400 truncate">{product.name}</p>
          <p className="text-base font-bold text-zinc-50">{formatINR(price)}{discount > 0 && <span className="ml-2 text-xs text-emerald-400">{discount}% off</span>}</p>
        </div>
        <button onClick={handleAdd} disabled={outOfStock} className="btn-outline-gold rounded-xl !px-4 !py-3" aria-label="Add to bag"><ShoppingBag className="w-4 h-4" /></button>
        <button onClick={handleBuy} disabled={outOfStock} className="btn-gold rounded-xl !px-5 !py-3">Buy now</button>
      </div>
    </div>
  );
};
