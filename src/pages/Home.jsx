import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, Star, Compass, Play, Volume2, VolumeX } from 'lucide-react';
import { productService } from '../services/productService.js';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { SEOHead } from '../components/common/SEOHead.jsx';

export const Home = () => {
  const [heroAd, setHeroAd] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        // 1. Fetch dynamic hero ad campaign (DO NOT hardcode)
        const adsRes = await productService.getActiveAds('HOMEPAGE_HERO');
        if (adsRes && adsRes.length > 0) {
          setHeroAd(adsRes[0]);
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
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="bg-noir min-h-screen text-zinc-100">
      <SEOHead
        title="Royal Fragrances & Skincare"
        description="Explore Jayroop (JR) handcrafted royal extraits de parfum, saffron soaps, and Jayroop Special Pimples Cream. पिंपल्स भागे, आत्मविश्वास जागे."
      />

      {/* 1. HERO SECTION: Dynamically loaded from Advertisement DB */}
      <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Dynamic Video or High-res Poster Background */}
        {heroAd?.mediaType === 'VIDEO' ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
              autoPlay
              loop
              muted={isMuted}
              playsInline
              poster={heroAd.posterUrl}
              className="w-full h-full object-cover opacity-45 scale-105 transition-transform duration-1000"
            >
              <source src={heroAd.mediaUrl} type="video/mp4" />
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
            className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
            style={{
              backgroundImage: `url(${
                heroAd?.mediaUrl ||
                'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1600'
              })`,
            }}
          />
        )}

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/40 to-noir/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-noir/90" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-noir/60 backdrop-blur-sm text-gold-light text-[11px] uppercase tracking-[0.25em] font-medium shadow-gold-glow">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>{heroAd?.subtitle || 'THE ROYAL FRAGRANCE & SKINCARE HOUSE'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.08em] uppercase text-zinc-100 leading-tight">
            {heroAd?.title || 'THE CROWN OF ROYAL LUXURY'}
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans font-light leading-relaxed">
            {heroAd?.description ||
              'Crafted with rare Cambodian Oud, Taif Roses, and time-honored Ayurvedic botanical extracts.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={heroAd?.ctaUrl || '/shop'} className="btn-gold text-xs py-3.5 px-8">
              <span>{heroAd?.ctaText || 'EXPLORE COLLECTION'}</span>
            </Link>

            <Link
              to="/products/jayroop-special-pimples-cream"
              className="btn-outline-gold text-xs py-3.5 px-7 flex items-center gap-2"
            >
              <span>Jayroop Special Cream</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. ICONIC SLOGAN BANNER (From uploaded logo) */}
      <section className="bg-gradient-to-r from-noir via-[#1c1809] to-noir border-y border-gold/30 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="bg-gradient-to-r from-gold-amber via-gold to-gold-amber text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              JAYROOP SPECIAL
            </span>
            <span className="font-serif text-base sm:text-lg text-gold-light tracking-wide font-semibold">
              पिंपल्स भागे, आत्मविश्वास जागे
            </span>
          </div>

          <div className="text-xs text-zinc-400 tracking-wider">
            Natural Herbal Clarity • 100% Guaranteed Purity • Ancient Ayurvedic Legacy
          </div>

          <Link
            to="/products/jayroop-special-pimples-cream"
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

      {/* 4. BRAND STORY & ROYAL HERITAGE */}
      <section className="py-20 bg-noir-card border-y border-gold/15 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold font-medium">
              The Heritage of Jayroop
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-zinc-100 uppercase tracking-wide leading-tight">
              An Olfactory & Botanical Legacy Built on Regal Distinction
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed font-light">
              Founded on the belief that scent and radiance are extensions of the soul, <strong>Jayroop (JR)</strong> fuses traditional copper-still ittar distillation with dermatologically revered Ayurvedic herbals.
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed font-light">
              Every drop of our <em>Royal Oud Extrait</em> is aged in seasoned casks, while our signature <em>Jayroop Special Pimples Cream</em> harnesses authentic cooling botanicals to restore pristine skin confidence.
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
              alt="Jayroop Artisanal Perfumery"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* 5. SHOP BY DYNAMIC CATEGORY */}
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
