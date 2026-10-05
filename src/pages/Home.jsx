import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, Star, Compass, Play, Volume2, VolumeX } from 'lucide-react';
import { productService } from '../services/productService.js';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { SEOHead } from '../components/common/SEOHead.jsx';
import VideoSEO from '../components/common/VideoSEO.jsx';
import InspirationsSection from '../components/influencer/InspirationsSection.jsx';
import ScentFluencerSection from '../components/influencer/ScentFluencerSection.jsx';
import defaultHeroBanner from '../assets/jayrup-hero-banner.jpg';
import logoImg from '../assets/jayroop-logo.webp';

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
  return url;
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

        // 2. Fetch featured products
        const prodRes = await productService.getProducts({ featured: 'true', limit: 4 });
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

  const inspirations = influencerVideos.filter((v) => v.sectionType === 'INSPIRATIONS');
  const scentFluencers = influencerVideos.filter((v) => v.sectionType === 'SCENT_FLUENCER');

  return (
    <div className="bg-noir min-h-screen text-zinc-100">
      <SEOHead
        title="Royal Fragrances & Skincare"
        description="Explore Jayrup (JR) handcrafted royal extraits de parfum, saffron soaps, and Jayrup Special Pimples Cream. पिंपल्स भागे, आत्मविश्वास जागे."
      />
      <VideoSEO videos={influencerVideos} />

      {/* 1. HERO SECTION: Dynamically loaded from Advertisement DB / Uploaded Banner */}
      <section className="relative w-full min-h-[85vh] sm:min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#070b10]">
        {/* Dynamic Video or High-res Poster / Image Background */}
        {heroAd?.mediaType === 'VIDEO' ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
              autoPlay
              loop
              muted={isMuted}
              playsInline
              poster={resolveMediaUrl(heroAd.posterUrl)}
              className="w-full h-full object-cover opacity-45 scale-105 transition-transform duration-1000"
            >
              <source src={resolveMediaUrl(heroAd.mediaUrl)} type="video/mp4" />
            </video>
            {/* Audio Toggle Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-6 right-6 z-20 p-2.5 rounded-full bg-noir/70 border border-gold/40 text-gold hover:text-gold-light backdrop-blur-sm"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-100 sm:scale-105 filter brightness-[0.75] sm:brightness-[0.65]"
            style={{
              backgroundImage: `url(${resolveMediaUrl(heroAd?.mediaUrl) || defaultHeroBanner})`,
            }}
          />
        )}

        {/* Ambient Dark Luxury Gradient Overlays & Golden Spotlight */}
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/50 to-noir/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-noir/95 pointer-events-none" />

        {/* Hero Content Overlay (Text styled as per royal brand crest & slogan) */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-4 sm:space-y-5 py-12">
          {/* 1. Royal Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-noir/80 backdrop-blur-md text-gold-light text-[11px] uppercase tracking-[0.25em] font-medium shadow-gold-glow">
            <Sparkles className="w-3.5 h-3.5 text-gold-amber" />
            <span>Royal Man's First Choice</span>
          </div>

          {/* 2. Ornate Crest Emblem */}
          <div className="flex justify-center -mb-2">
            <div className="relative p-1 rounded-full border border-gold/40 shadow-gold-glow bg-noir/80">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={logoImg}
                  alt="JR Royal Crest"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* 3. Main Brand Title */}
          <div>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[0.18em] sm:tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D0] via-[#D4AF37] to-[#8C6B1B] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] leading-none">
              {heroAd?.title || 'JAYRUP'}
              <span className="text-xs sm:text-sm font-sans tracking-normal text-gold align-top ml-1">™</span>
            </h1>

            {/* Subtitle: LUXURY PERFUME */}
            <p className="mt-2 text-gold tracking-[0.35em] sm:tracking-[0.45em] text-xs sm:text-sm uppercase font-semibold">
              {heroAd?.subtitle || 'LUXURY PERFUME'}
            </p>
          </div>

          {/* 4. Rajputana Royal Filigree Divider */}
          <div className="flex items-center justify-center gap-3 text-gold/60 my-1">
            <span className="h-px w-12 sm:w-24 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="text-gold text-xs tracking-widest select-none">❦ ✦ ❦</span>
            <span className="h-px w-12 sm:w-24 bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          {/* 5. Highlighted Slogan Bar: Marwad ka Pahla Luxury Perfume */}
          <div className="relative py-2.5 px-6 sm:px-12 inline-block my-1">
            {/* Illuminated Gold Light Beams */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_12px_rgba(212,175,55,0.9)]" />
            <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_12px_rgba(212,175,55,0.9)]" />

            <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFF4CC] via-[#E5C058] to-[#FFF4CC] tracking-wide font-normal drop-shadow-[0_2px_10px_rgba(212,175,55,0.5)]">
              Marwad ka Pahla Luxury Perfume
            </p>
            <div className="flex justify-center -mt-0.5">
              <span className="text-[10px] text-gold/80">❖</span>
            </div>
          </div>

          {/* 6. Description / Edition Details */}
          <p className="text-zinc-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-sans font-light leading-relaxed pt-1">
            {heroAd?.description ||
              "Royal man's first choice • Royal Flora Eau De Parfum (50 ml | e 1.69 fl.oz) — Handcrafted with the majestic spirit and timeless heritage of Marwad."}
          </p>

          {/* 7. Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={heroAd?.ctaUrl || '/shop'}
              className="btn-gold text-xs py-3.5 px-8 flex items-center gap-2 group shadow-gold-glow"
            >
              <span>{heroAd?.ctaText || 'EXPLORE ROYAL FLORA'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/products/jayrup-special-pimples-cream"
              className="btn-outline-gold text-xs py-3.5 px-7 flex items-center gap-2 bg-noir/50 backdrop-blur-sm"
            >
              <span>Jayrup Special Skincare</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. ICONIC SLOGAN BANNER (From uploaded logo) */}
      <section className="bg-gradient-to-r from-noir via-[#1c1809] to-noir border-y border-gold/30 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="bg-gradient-to-r from-gold-amber via-gold to-gold-amber text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              JAYRUP SPECIAL
            </span>
            <span className="font-serif text-base sm:text-lg text-gold-light tracking-wide font-semibold">
              पिंपल्स भागे, आत्मविश्वास जागे
            </span>
          </div>

          <div className="text-xs text-zinc-400 tracking-wider">
            Natural Herbal Clarity • 100% Guaranteed Purity • Ancient Ayurvedic Legacy
          </div>

          <Link
            to="/products/jayrup-special-pimples-cream"
            className="text-xs text-gold hover:text-white uppercase font-semibold tracking-widest inline-flex items-center gap-1 group"
          >
            <span>Learn More</span>
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
              Founded on the belief that scent and radiance are extensions of the soul, <strong>Jayrup (JR)</strong> fuses traditional copper-still ittar distillation with dermatologically revered Ayurvedic herbals.
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed font-light">
              Every drop of our <em>Royal Oud Extrait</em> is aged in seasoned casks, while our signature <em>Jayrup Special Pimples Cream</em> harnesses authentic cooling botanicals to restore pristine skin confidence.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
              <div>
                <h4 className="font-serif text-xl text-gold font-bold">14+ Hrs</h4>
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider mt-1">Parfum Longevity</p>
              </div>
              <div>
                <h4 className="font-serif text-xl text-gold font-bold">100%</h4>
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider mt-1">Botanical Purity</p>
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
