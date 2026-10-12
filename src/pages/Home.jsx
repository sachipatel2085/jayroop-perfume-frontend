import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, Volume2, VolumeX } from 'lucide-react';
import { productService } from '../services/productService.js';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { SEO } from '../components/seo/SEO.jsx';
import { OrganizationSchema } from '../components/seo/OrganizationSchema.jsx';
import { WebsiteSchema } from '../components/seo/WebsiteSchema.jsx';
import VideoSEO from '../components/common/VideoSEO.jsx';
import InspirationsSection from '../components/influencer/InspirationsSection.jsx';
import ScentFluencerSection from '../components/influencer/ScentFluencerSection.jsx';
import { DEFAULT_SEO } from '../config/site.js';
import { resolveMediaUrl } from '../utils/media.js';

// Built-in responsive campaign artwork (public/images/hero). Used when no hero campaign is set in
// Admin › Ads, or when the campaign image fails to load – so the hero is never blank.
const HERO_DEFAULT = {
  desktopSrcSet: '/images/hero/jayrup-hero-1200.webp 1200w, /images/hero/jayrup-hero-1600.webp 1600w, /images/hero/jayrup-hero-2400.webp 2400w',
  mobileSrcSet: '/images/hero/jayrup-hero-mobile-720.webp 720w, /images/hero/jayrup-hero-mobile-1080.webp 1080w',
  fallback: '/images/hero/jayrup-hero-1600.jpg',
  poster: '/images/hero/jayrup-hero-1600.webp',
  alt: 'Jayrup Royal Flora Eau de Parfum 50 ml – Marwad ka Pahla Luxury Perfume',
  eyebrow: 'Royal man’s first choice',
  title: 'Jayrup Royal Flora – Luxury Perfume',
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
        const blogRes = await productService.getBlogs({ limit: 2 });
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

      {/* 2. SHOP-BY-CATEGORY STRIP – built from the live catalogue (new product lines appear automatically) */}
      <section className="bg-gradient-to-r from-noir via-[#1c1809] to-noir border-y border-gold/30 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="bg-gradient-to-r from-gold-amber via-gold to-gold-amber text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              Shop by category
            </span>
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c._id}
                to={`/category/${c.slug}`}
                className="text-xs sm:text-sm font-serif text-gold-light hover:text-white border border-gold/30 hover:border-gold rounded-full px-3 py-1 tracking-wide transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="text-xs text-zinc-400 tracking-wider">
            100% Genuine • Secure PhonePe Payments • Cash on Delivery • Pan-India Delivery
          </div>

          <Link to="/shop" className="text-xs text-gold hover:text-white uppercase font-semibold tracking-widest inline-flex items-center gap-1 group">
            <span>Shop All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 3. SIGNATURE ROYAL COLLECTION (Featured Products) */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold font-medium">
            Handcrafted Masterpieces
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl uppercase tracking-wider text-zinc-100 font-semibold">
            Signature Royal Creations
          </h2>
          <div className="w-16 h-0.5 bg-gold/50 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/shop" className="btn-outline-gold text-xs py-3 px-8">
            View Complete Catalog
          </Link>
        </div>
      </section>

      {/* 4. DYNAMIC HOMEPAGE CAMPAIGN / PROMOTIONAL BANNER */}
      {campaignAd && (
        <section className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="relative overflow-hidden border border-gold/40 shadow-2xl bg-noir-card min-h-[320px] sm:min-h-[400px] flex items-center p-8 sm:p-14">
            {campaignAd.mediaType === 'VIDEO' ? (
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted={isCampaignMuted}
                  playsInline
                  poster={resolveMediaUrl(campaignAd.posterUrl)}
                  className="w-full h-full object-cover opacity-50 scale-105 transition-transform duration-1000"
                >
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
              <img
                src={resolveMediaUrl(campaignAd.mediaUrl)}
                alt={campaignAd.title}
                className="absolute inset-0 w-full h-full object-cover opacity-45 filter brightness-95"
              />
            )}

            {/* Ambient Dark Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-noir via-noir/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-transparent to-noir/40 pointer-events-none" />

            {/* Content Details */}
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/40 bg-noir/70 backdrop-blur-md text-gold-light text-[10px] uppercase tracking-[0.25em] font-medium">
                <Sparkles className="w-3 h-3 text-gold-amber" />
                <span>{campaignAd.subtitle || 'Special Royal Release'}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider text-zinc-100 leading-tight">
                {campaignAd.title}
              </h2>

              <p className="text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed font-light max-w-xl">
                {campaignAd.description}
              </p>

              {campaignAd.ctaText && (
                <div className="pt-2">
                  <Link
                    to={campaignAd.ctaUrl || '/shop'}
                    className="btn-gold text-xs py-3.5 px-8 inline-flex items-center gap-2 group shadow-gold-glow"
                  >
                    <span>{campaignAd.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5. OUR SCENT-FLUENCER (Shoppable Vertical Reels) */}
      <ScentFluencerSection videos={scentFluencers} />

      {/* 5. BRAND STORY & ROYAL HERITAGE */}
      <section className="py-20 bg-noir-card border-y border-gold/15 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold font-medium">
              The Heritage of Jayrup
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-zinc-100 uppercase tracking-wide leading-tight">
              An Olfactory & Botanical Legacy Built on Regal Distinction
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed font-light">
              Founded on the belief that scent and radiance are extensions of the soul, <strong>Jayrup (JR)</strong> brings together the heritage of Indian perfumery and
              time-honoured botanical skincare with modern cosmetic science.
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed font-light">
              From long-lasting perfumes to effective everyday skincare, every Jayrup product is made in India, crafted by licensed manufacturers and checked for quality,
              safety and consistency before it reaches you.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
              <div>
                <h4 className="font-serif text-xl text-gold font-bold">Made in India</h4>
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider mt-1">For Indian Skin &amp; Climate</p>
              </div>
              <div>
                <h4 className="font-serif text-xl text-gold font-bold">100%</h4>
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider mt-1">Genuine Products</p>
              </div>
              <div>
                <h4 className="font-serif text-xl text-gold font-bold">Pan-India</h4>
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider mt-1">Express Courier</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-4/3 rounded-none overflow-hidden border border-gold/30 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1200"
              alt="Jayrup Artisanal Perfumery"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* 6. INSPIRATIONS (16:9 Celebrity / Ambassador Stories) */}
      <InspirationsSection videos={inspirations} />

      {/* 7. SHOP BY DYNAMIC CATEGORY */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold font-medium">
            Curated Lines
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl uppercase tracking-wider text-zinc-100 font-semibold">
            Explore by Category
          </h2>
          <div className="w-16 h-0.5 bg-gold/50 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              className="group relative h-80 overflow-hidden border border-gold/20 hover:border-gold/60 transition-all duration-500 flex flex-col justify-end p-6"
            >
              <img
                src={
                  cat.image?.url ||
                  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800'
                }
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/50 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

              <div className="relative z-10 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                  Collection
                </span>
                <h3 className="font-serif text-xl text-zinc-100 group-hover:text-gold-light transition-colors font-bold uppercase tracking-wider">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-300 line-clamp-2 font-light">
                  {cat.description}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs text-gold uppercase tracking-wider font-semibold">
                  <span>Enter Salon</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. EDITORIAL BLOG PREVIEW */}
      {blogs.length > 0 && (
        <section className="py-20 bg-noir border-t border-zinc-900 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-gold font-medium">
                The Royal Blog
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-zinc-100 font-semibold mt-1">
                Editorial & Rituals
              </h2>
            </div>
            <Link
              to="/blog"
              className="text-xs text-gold hover:text-white uppercase tracking-widest font-semibold flex items-center gap-1"
            >
              <span>Read Full Blog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((b) => (
              <Link
                key={b._id}
                to={`/blog/${b.slug}`}
                className="group p-5 bg-noir-card border border-gold/15 hover:border-gold/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/9 overflow-hidden bg-zinc-900 mb-4">
                    <img
                      src={b.coverImage?.url}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-gold font-medium">
                    {b.category} • {b.readTime}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-zinc-100 group-hover:text-gold-light transition-colors mt-2 mb-2">
                    {b.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 font-light">
                    {b.excerpt}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center text-xs text-gold uppercase tracking-wider font-semibold">
                  <span>Read Story</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
