import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Volume2, VolumeX, ShieldCheck, Truck, BadgeCheck, Leaf, Droplets, Gift, Wallet, MapPin, ChevronDown, ShoppingBag, Check, Star } from 'lucide-react';
import { productService } from '../services/productService.js';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { SEO } from '../components/seo/SEO.jsx';
import { OrganizationSchema } from '../components/seo/OrganizationSchema.jsx';
import { WebsiteSchema } from '../components/seo/WebsiteSchema.jsx';
import VideoSEO from '../components/common/VideoSEO.jsx';
import InspirationsSection from '../components/influencer/InspirationsSection.jsx';
import ScentFluencerSection from '../components/influencer/ScentFluencerSection.jsx';
import { DEFAULT_SEO } from '../config/site.js';
import { HOME_FAQS } from '../config/homeContent.js';
import { FAQSchema } from '../components/seo/FAQSchema.jsx';
import { useCart } from '../context/CartContext.jsx';
import { resolveMediaUrl } from '../utils/media.js';
import { useStoreSettings, taxNote } from '../hooks/useStoreSettings.js';

// Built-in responsive campaign artwork (public/images/hero). Used when no hero campaign is set in
// Admin › Ads, or when the campaign image fails to load – so the hero is never blank.
const HERO_DEFAULT = {
  desktopSrcSet: '/images/hero/jayrup-hero-1200.webp 1200w, /images/hero/jayrup-hero-1600.webp 1600w, /images/hero/jayrup-hero-2400.webp 2400w',
  mobileSrcSet: '/images/hero/jayrup-hero-mobile-720.webp 720w, /images/hero/jayrup-hero-mobile-1080.webp 1080w',
  fallback: '/images/hero/jayrup-hero-1600.jpg',
  poster: '/images/hero/jayrup-hero-1600.webp',
  alt: 'Jayrup Royal Flora Eau de Parfum 50 ml – Marwad ka Pahla Luxury Perfume',
  eyebrow: 'Royal man’s first choice',
  title: 'Jayrup Royal Flora – Luxury Perfume for Men',
  description: 'Long-lasting Eau de Parfum, made in India. Also discover Jayrup Pimples Cream – Ayurvedic care for pimple-prone skin.',
  ctaText: 'Shop Royal Flora',
  ctaUrl: '/products/jayrup-royal-flora-eau-de-parfum-50ml',
};


export const Home = () => {
  const [heroAd, setHeroAd] = useState(null);
  const [campaignAd, setCampaignAd] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [influencerVideos, setInfluencerVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [heroMediaFailed, setHeroMediaFailed] = useState(false);
  const [isCampaignMuted, setIsCampaignMuted] = useState(true);
  const { addToCart } = useCart();
  const storeSettings = useStoreSettings();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        // 1. Fetch dynamic hero ad campaign (DO NOT hardcode)
        const adsRes = await productService.getActiveAds('HOMEPAGE_HERO');
        if (adsRes && adsRes.length > 0) {
          setHeroAd(adsRes[0]);
        }

        // 1b. Fetch dynamic mid-page campaign banner
        const campRes = await productService.getActiveAds('HOMEPAGE_CAMPAIGN');
        if (campRes && campRes.length > 0) {
          setCampaignAd(campRes[0]);
        }

        // 2. Fetch featured products with fallback to latest creations
        let prodRes = await productService.getProducts({ featured: 'true', limit: 8 });
        if (!prodRes?.data || prodRes.data.length === 0) {
          // If no products are explicitly marked featured, display latest creations so homepage is never empty
          prodRes = await productService.getProducts({ limit: 8 });
        }
        if (prodRes?.data) setFeaturedProducts(prodRes.data);

        // 3. Fetch categories
        const catRes = await productService.getCategories();
        if (Array.isArray(catRes)) setCategories(catRes);

        // 4. Fetch blogs
        const blogRes = await productService.getBlogs({ limit: 3 });
        if (blogRes?.data) setBlogs(blogRes.data);

        // 5. Fetch influencer & inspiration videos
        const videoRes = await productService.getInfluencerVideos();
        if (videoRes?.data) setInfluencerVideos(videoRes.data);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const useAdImage = heroAd?.mediaType !== 'VIDEO' && Boolean(heroAd?.mediaUrl) && !heroMediaFailed;
  // The first two products get a large "spotlight"; any extra products appear in the grid below.
  const spotlight = featuredProducts.slice(0, 2);
  const moreProducts = featuredProducts.slice(2);
  const plain = (html = '') => String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const inspirations = influencerVideos.filter((v) => v.sectionType === 'INSPIRATIONS');
  const scentFluencers = influencerVideos.filter((v) => v.sectionType === 'SCENT_FLUENCER');

  return (
    <div className="bg-noir min-h-screen text-zinc-100">
      <SEO
        title={DEFAULT_SEO.title}
        description={DEFAULT_SEO.description}
        keywords={DEFAULT_SEO.keywords}
        canonicalUrl="/"
      >
        <OrganizationSchema />
        <WebsiteSchema />
        <FAQSchema faqs={HOME_FAQS} />
      </SEO>
      <VideoSEO videos={influencerVideos} />

      {/* 1. HERO – full campaign artwork, art-directed per device (never cropped or hidden) */}
      <section className="relative w-full bg-[#0b1118]" aria-label="Featured collection">
        <Link
          to={heroAd?.ctaUrl || HERO_DEFAULT.ctaUrl}
          className="relative block w-full overflow-hidden aspect-[4/5] sm:aspect-[2400/1450]"
          aria-label={heroAd?.altText || HERO_DEFAULT.alt}
        >
          {heroAd?.mediaType === 'VIDEO' && heroAd?.mediaUrl && !heroMediaFailed ? (
            <video
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
              poster={resolveMediaUrl(heroAd.posterUrl) || HERO_DEFAULT.poster}
              onError={() => setHeroMediaFailed(true)}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={resolveMediaUrl(heroAd.mediaUrl)} type="video/mp4" />
            </video>
          ) : (
            <picture>
              <source
                media="(max-width: 639px)"
                srcSet={useAdImage && heroAd.mobileMediaUrl ? resolveMediaUrl(heroAd.mobileMediaUrl) : HERO_DEFAULT.mobileSrcSet}
                sizes="100vw"
              />
              <source media="(min-width: 640px)" srcSet={useAdImage ? resolveMediaUrl(heroAd.mediaUrl) : HERO_DEFAULT.desktopSrcSet} sizes="100vw" />
              <img
                src={useAdImage ? resolveMediaUrl(heroAd.mediaUrl) : HERO_DEFAULT.fallback}
                alt={heroAd?.altText || HERO_DEFAULT.alt}
                width="2400"
                height="1450"
                fetchPriority="high"
                loading="eager"
                decoding="async"
                onError={() => setHeroMediaFailed(true)}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </picture>
          )}
        </Link>

        {heroAd?.mediaType === 'VIDEO' && !heroMediaFailed && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-noir/70 border border-gold/40 text-gold hover:text-gold-light backdrop-blur-sm"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}

        {/* Headline + calls to action (real text for SEO & accessibility – the artwork is an image) */}
        <div className="border-y border-gold/25 bg-gradient-to-r from-noir via-[#121820] to-noir">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 sm:py-6 flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
            <div>
              <p className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-gold-light">
                <Sparkles className="w-3.5 h-3.5 text-gold-amber" /> {heroAd?.subtitle || HERO_DEFAULT.eyebrow}
              </p>
              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl uppercase tracking-[0.12em] text-zinc-100 mt-1">
                {heroAd?.seoTitle || heroAd?.title || HERO_DEFAULT.title}
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-2xl">{heroAd?.description || HERO_DEFAULT.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
              <Link to={heroAd?.ctaUrl || HERO_DEFAULT.ctaUrl} className="btn-gold text-xs py-3.5 px-8 flex items-center gap-2 group shadow-gold-glow">
                <span>{heroAd?.ctaText || HERO_DEFAULT.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/shop" className="btn-outline-gold text-xs py-3.5 px-7">
                Shop all products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR – the questions every Indian shopper asks first */}
      <section aria-label="Why shop with Jayrup" className="border-b border-gold/15 bg-noir">
        <ul className="max-w-7xl mx-auto px-4 sm:px-8 py-5 grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-4">
          {[
            { icon: BadgeCheck, title: '100% Genuine', text: 'Shipped direct by Jayrup' },
            { icon: Wallet, title: 'Cash on Delivery', text: 'Or pay with PhonePe' },
            { icon: Truck, title: 'Pan-India Delivery', text: 'Track your order online' },
            { icon: ShieldCheck, title: 'Secure Checkout', text: 'UPI · Cards · Net banking' },
            { icon: MapPin, title: 'Made in India', text: 'Licensed manufacturers' },
          ].map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-3 last:col-span-2 md:last:col-span-1">
              <span className="w-10 h-10 shrink-0 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center">
                <Icon className="w-[18px] h-[18px] text-gold" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[13px] font-semibold text-zinc-100">{title}</span>
                <span className="block text-[11px] text-zinc-500">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. BESTSELLERS – one large spotlight per product, built from the live catalogue */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto" aria-labelledby="bestsellers-heading">
        <header className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Shop our bestsellers</p>
          <h2 id="bestsellers-heading" className="font-serif text-2xl sm:text-4xl uppercase tracking-wider text-zinc-100 mt-2">
            Luxury Perfume &amp; Ayurvedic Skin Care
          </h2>
          <p className="text-sm text-zinc-400 mt-3">Two products, made in India and made to be trusted – each one crafted by a licensed manufacturer.</p>
        </header>

        {loading && !spotlight.length ? (
          <div className="grid gap-8">
            {[0, 1].map((n) => (
              <div key={n} className="h-[420px] bg-noir-card border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-14">
            {spotlight.map((p, i) => {
              const img = p.images?.find((x) => x.isPrimary) || p.images?.[0];
              const price = p.salePrice && p.salePrice < p.price ? p.salePrice : p.price;
              const onSale = p.salePrice && p.salePrice < p.price;
              const reverse = i % 2 === 1;
              return (
                <article
                  key={p._id}
                  className="group grid md:grid-cols-2 items-stretch border border-gold/20 bg-gradient-to-br from-noir-card to-noir shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] overflow-hidden"
                >
                  <Link
                    to={`/products/${p.slug}`}
                    className={`relative block aspect-square self-center w-full overflow-hidden bg-[#0d1015] ${reverse ? 'md:order-2' : ''}`}
                    aria-label={p.name}
                  >
                    <img
                      src={resolveMediaUrl(img?.url)}
                      alt={img?.altText || p.name}
                      width="1200"
                      height="1200"
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <span className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.45)] pointer-events-none" />
                    <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest font-bold bg-gold text-black px-2.5 py-1">
                      Bestseller
                    </span>
                  </Link>

                  <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
                    {p.category?.name && (
                      <Link to={`/category/${p.category.slug}`} className="text-[11px] uppercase tracking-[0.25em] text-gold hover:text-gold-light">
                        {p.category.name}
                      </Link>
                    )}
                    <h3 className="font-serif text-2xl sm:text-3xl text-zinc-100 mt-2 leading-snug">
                      <Link to={`/products/${p.slug}`} className="hover:text-gold-light transition-colors">
                        {p.name}
                      </Link>
                    </h3>
                    {p.numReviews > 0 && (
                      <p className="mt-2 flex items-center gap-1 text-xs text-zinc-400">
                        <Star className="w-3.5 h-3.5 fill-gold text-gold" /> {Number(p.averageRating || 0).toFixed(1)} · {p.numReviews} reviews
                      </p>
                    )}
                    <p className="text-sm text-zinc-400 leading-relaxed mt-4 line-clamp-4">{p.shortDescription || plain(p.description).slice(0, 260)}</p>

                    {p.highlights?.length > 0 && (
                      <ul className="mt-5 space-y-2">
                        {p.highlights.slice(0, 4).map((h) => (
                          <li key={h} className="flex items-start gap-2.5 text-sm text-zinc-300">
                            <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" aria-hidden="true" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-6 flex items-baseline gap-3">
                      <span className="text-2xl font-semibold text-zinc-100">₹{price}</span>
                      {onSale && <span className="text-sm text-zinc-500 line-through">₹{p.price}</span>}
                      <span className="text-[11px] text-zinc-500">MRP {taxNote(storeSettings)}</span>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => addToCart(p, p.variants?.[0] || null, 1)}
                        disabled={p.stock === 0}
                        className="btn-gold text-xs py-3.5 px-7 inline-flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <ShoppingBag className="w-4 h-4" /> {p.stock === 0 ? 'Out of stock' : 'Add to cart'}
                      </button>
                      <Link to={`/products/${p.slug}`} className="btn-outline-gold text-xs py-3.5 px-7 inline-flex items-center justify-center gap-2 group/link">
                        View details <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {moreProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="font-serif text-xl uppercase tracking-wider text-zinc-100 mb-6">More from Jayrup</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {moreProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 4. SHOP BY CATEGORY – wide banner cards from the live categories */}
      {categories.length > 0 && (
        <section className="pb-16 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto" aria-labelledby="categories-heading">
          <header className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Collections</p>
              <h2 id="categories-heading" className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-zinc-100 mt-1">
                Shop by Category
              </h2>
            </div>
            <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-xs text-gold hover:text-white uppercase tracking-widest font-semibold">
              Shop all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </header>
          <div className={`grid gap-6 ${categories.length > 1 ? 'lg:grid-cols-2' : ''}`}>
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="group relative overflow-hidden border border-gold/20 hover:border-gold/60 transition-colors aspect-[16/9] sm:aspect-[1600/700] flex items-end"
              >
                {cat.image?.url && (
                  <img
                    src={resolveMediaUrl(cat.image.url)}
                    alt={cat.image.altText || cat.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-right transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-r from-noir via-noir/70 to-transparent" />
                <span className="absolute inset-0 bg-gradient-to-t from-noir/80 via-transparent to-transparent" />
                <span className="relative z-10 p-6 sm:p-8 max-w-[70%] sm:max-w-[60%]">
                  <span className="block font-serif text-xl sm:text-2xl uppercase tracking-wider text-zinc-100 group-hover:text-gold-light transition-colors">
                    {cat.name}
                  </span>
                  <span className="block text-xs sm:text-sm text-zinc-400 mt-2 line-clamp-2">{cat.intro || plain(cat.description).slice(0, 140)}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-gold uppercase tracking-wider font-semibold">
                    Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. DYNAMIC HOMEPAGE CAMPAIGN (Admin › Ads › HOMEPAGE_CAMPAIGN) */}
      {campaignAd && (
        <section className="pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="relative overflow-hidden border border-gold/40 shadow-2xl bg-noir-card min-h-[320px] sm:min-h-[400px] flex items-center p-8 sm:p-14">
            {campaignAd.mediaType === 'VIDEO' ? (
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <video autoPlay loop muted={isCampaignMuted} playsInline poster={resolveMediaUrl(campaignAd.posterUrl)} className="w-full h-full object-cover opacity-50">
                  <source src={resolveMediaUrl(campaignAd.mediaUrl)} type="video/mp4" />
                </video>
                <button
                  onClick={() => setIsCampaignMuted(!isCampaignMuted)}
                  className="absolute bottom-4 right-4 z-20 p-2.5 rounded-full bg-noir/80 border border-gold/40 text-gold hover:text-white backdrop-blur-sm"
                  aria-label={isCampaignMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isCampaignMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            ) : (
              <img src={resolveMediaUrl(campaignAd.mediaUrl)} alt={campaignAd.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-45" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-noir via-noir/80 to-transparent" />
            <div className="relative z-10 max-w-2xl space-y-4">
              <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/40 bg-noir/70 text-gold-light text-[10px] uppercase tracking-[0.25em]">
                <Sparkles className="w-3 h-3 text-gold-amber" /> {campaignAd.subtitle || 'New from Jayrup'}
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider text-zinc-100 leading-tight">{campaignAd.title}</h2>
              <p className="text-zinc-300 text-sm leading-relaxed max-w-xl">{campaignAd.description}</p>
              {campaignAd.ctaText && (
                <Link to={campaignAd.ctaUrl || '/shop'} className="btn-gold text-xs py-3.5 px-8 inline-flex items-center gap-2 group">
                  <span>{campaignAd.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 6. BRAND STORY – replaces the old "Heritage" block (real product artwork, honest claims) */}
      <section className="relative py-16 sm:py-24 bg-noir-card border-y border-gold/15 overflow-hidden" aria-labelledby="story-heading">
        <div aria-hidden="true" className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <figure className="relative order-1 lg:order-none">
            <picture>
              <source media="(max-width: 767px)" srcSet="/images/home/jayrup-story-720.webp" />
              <img
                src="/images/home/jayrup-story.webp"
                alt="Jayrup Royal Flora Eau de Parfum 50 ml and Jayrup Pimples Cream 20 g – made in India"
                width="1200"
                height="1000"
                loading="lazy"
                decoding="async"
                className="relative w-full h-auto border border-gold/30 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]"
              />
            </picture>
          </figure>

          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">The Jayrup story</p>
            <h2 id="story-heading" className="font-serif text-2xl sm:text-4xl text-zinc-100 uppercase tracking-wide leading-tight mt-2">
              Made in India. Made to be remembered.
            </h2>
            <p className="text-zinc-300 text-[15px] leading-relaxed mt-5">
              <strong className="text-zinc-100">Jayrup</strong> began in Himatnagar, Gujarat, with a simple promise: everyday luxury and honest care that every Indian can trust.
              Our first fragrance, <Link to="/products/jayrup-royal-flora-eau-de-parfum-50ml" className="text-gold hover:underline">Royal Flora</Link> – <em>Marwad ka Pahla
              Luxury Perfume</em> – is a long-lasting Eau de Parfum for the man who wants to be remembered.
            </p>
            <p className="text-zinc-400 text-[15px] leading-relaxed mt-4">
              For skin, we turned to Ayurveda. <Link to="/products/jayrup-pimples-cream" className="text-gold hover:underline">Jayrup Pimples Cream</Link> is a licensed
              Ayurvedic proprietary medicine with Neem, Karanj, Manjistha and Daruhaldi, made in a GMP-certified facility. Every Jayrup product is made by a licensed
              manufacturer and carries full batch and expiry details on the pack.
            </p>

            <dl className="grid grid-cols-2 gap-px bg-zinc-800 border border-zinc-800 mt-8">
              {[
                ['EDP', 'Long-lasting Eau de Parfum'],
                ['GMP', 'Licensed Ayurvedic medicine'],
                ['COD', 'Cash on Delivery & PhonePe'],
                ['Pan-India', 'Delivery with tracking'],
              ].map(([k, v]) => (
                <div key={k} className="bg-noir-card p-4 sm:p-5">
                  <dt className="font-serif text-xl sm:text-2xl text-gold">{k}</dt>
                  <dd className="text-[11px] uppercase tracking-wider text-zinc-400 mt-1">{v}</dd>
                </div>
              ))}
            </dl>

            <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-xs text-gold hover:text-white uppercase tracking-widest font-semibold group">
              Read our story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. WHY JAYRUP – benefit cards (keyword-rich, real claims only) */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto" aria-labelledby="why-heading">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Why Jayrup</p>
          <h2 id="why-heading" className="font-serif text-2xl sm:text-4xl uppercase tracking-wider text-zinc-100 mt-2">
            Quality You Can Check on the Pack
          </h2>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Droplets, title: 'Long-lasting perfume', text: 'Royal Flora is an Eau de Parfum – richer and longer-lasting than a deo or body spray.', to: '/category/perfumes' },
            { icon: Leaf, title: 'Ayurvedic herbs', text: 'Neem, Karanj, Manjistha and Daruhaldi – a classical formula for pimple-prone skin.', to: '/category/skincare' },
            { icon: BadgeCheck, title: 'Licensed & GMP made', text: 'Made by licensed manufacturers, with batch, MRP and expiry printed on every pack.', to: '/about' },
            { icon: Gift, title: 'Gift-ready packs', text: 'Premium bottle in a navy-and-gold gift tube – perfect for birthdays and festivals.', to: '/products/jayrup-royal-flora-eau-de-parfum-50ml' },
          ].map(({ icon: Icon, title, text, to }) => (
            <Link
              key={title}
              to={to}
              className="group p-6 bg-noir-card border border-zinc-800 hover:border-gold/40 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(212,175,55,0.25)]"
            >
              <span className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                <Icon className="w-5 h-5 text-gold" aria-hidden="true" />
              </span>
              <h3 className="font-serif text-lg text-zinc-100 mt-5 group-hover:text-gold-light transition-colors">{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mt-2">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. VIDEO SECTIONS (Admin › Influencer videos) */}
      <ScentFluencerSection videos={scentFluencers} />
      <InspirationsSection videos={inspirations} />

      {/* 9. JOURNAL – latest articles (internal links help every page rank) */}
      {blogs.length > 0 && (
        <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto" aria-labelledby="journal-heading">
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">The Jayrup Journal</p>
              <h2 id="journal-heading" className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-zinc-100 mt-1">
                Perfume &amp; Skin Care Guides
              </h2>
            </div>
            <Link to="/blog" className="inline-flex items-center gap-1 text-xs text-gold hover:text-white uppercase tracking-widest font-semibold">
              All articles <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </header>
          <div className="grid md:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <article key={b._id} className="group bg-noir-card border border-gold/15 hover:border-gold/40 transition-colors flex flex-col">
                <Link to={`/blog/${b.slug}`} className="block aspect-[16/9] overflow-hidden bg-zinc-900">
                  <img
                    src={resolveMediaUrl(b.coverImage?.url)}
                    alt={b.coverImage?.altText || b.title}
                    width="1200"
                    height="675"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-[10px] uppercase tracking-widest text-gold">
                    {b.category} · {b.readTime}
                  </p>
                  <h3 className="font-serif text-lg text-zinc-100 mt-2 leading-snug">
                    <Link to={`/blog/${b.slug}`} className="hover:text-gold-light transition-colors">
                      {b.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-3 mt-2 flex-1">{b.excerpt}</p>
                  <Link to={`/blog/${b.slug}`} className="mt-4 inline-flex items-center gap-1 text-xs text-gold uppercase tracking-wider font-semibold">
                    Read article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 10. FAQ – answers the questions people search for (FAQPage schema above) */}
      <section className="py-16 sm:py-24 bg-noir-card border-t border-gold/15" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <header className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Need help?</p>
            <h2 id="faq-heading" className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-zinc-100 mt-2">
              Frequently Asked Questions
            </h2>
          </header>
          <div className="divide-y divide-zinc-800 border-y border-zinc-800">
            {HOME_FAQS.map((f, i) => (
              <details key={f.question} className="group py-5" open={i === 0}>
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-zinc-100 font-medium hover:text-gold-light">
                  <h3 className="text-[15px] font-medium">{f.question}</h3>
                  <ChevronDown className="w-4 h-4 text-gold shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
          <p className="text-center text-sm text-zinc-500 mt-8">
            More questions? See our <Link to="/faq" className="text-gold hover:underline">full FAQ</Link> or{' '}
            <Link to="/contact-us" className="text-gold hover:underline">contact us</Link>.
          </p>
        </div>
      </section>

      {/* 11. SEO INTRO – short, natural copy with the main search terms */}
      <section className="py-14 px-4 sm:px-8 max-w-4xl mx-auto text-center" aria-labelledby="seo-heading">
        <h2 id="seo-heading" className="font-serif text-xl sm:text-2xl uppercase tracking-wider text-zinc-100">
          Buy Luxury Perfume &amp; Ayurvedic Pimple Cream Online in India
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed mt-4">
          Jayrup brings you a <Link to="/category/perfumes" className="text-gold hover:underline">long-lasting luxury perfume for men</Link> and{' '}
          <Link to="/category/skincare" className="text-gold hover:underline">Ayurvedic skin care</Link> – made in India by licensed manufacturers. Shop{' '}
          <Link to="/products/jayrup-royal-flora-eau-de-parfum-50ml" className="text-gold hover:underline">Jayrup Royal Flora Eau de Parfum 50 ml</Link>, the
          royal man’s first choice, and <Link to="/products/jayrup-pimples-cream" className="text-gold hover:underline">Jayrup Pimples Cream</Link>, an Ayurvedic cream for
          pimple-prone skin. Pay securely with PhonePe or choose Cash on Delivery, with delivery across India.
        </p>
      </section>
    </div>
  );
};
