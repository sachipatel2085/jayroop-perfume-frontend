import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { productService } from '../services/productService.js';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { SEOHead } from '../components/common/SEOHead.jsx';

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
  return url;
};

export const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [categoryAd, setCategoryAd] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        setLoading(true);
        const [catRes, adRes] = await Promise.all([
          productService.getCategoryBySlug(slug),
          productService.getActiveAds('CATEGORY_HEADER'),
        ]);

        setCategory(catRes);
        if (adRes && adRes.length > 0) {
          setCategoryAd(adRes[0]);
        }

        const prodRes = await productService.getProducts({
          category: slug,
          subCategory: selectedSubCategory || undefined,
          limit: 24,
        });
        if (prodRes?.data) setProducts(prodRes.data);
      } catch (err) {
        console.error('Failed to load category', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [slug, selectedSubCategory]);

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-8 px-4 sm:px-8 max-w-7xl mx-auto">
      <SEOHead
        title={category?.name ? `${category.name} Collection` : 'Category'}
        description={category?.description}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-400 mb-6">
        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <Link to="/shop" className="hover:text-gold transition-colors">Treasury</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-gold font-semibold">{category?.name || slug}</span>
      </nav>

      {/* Category Banner (Dynamic Ad or Default Category Header) */}
      <div className="relative overflow-hidden border border-gold/30 p-8 sm:p-14 mb-10 bg-noir-card min-h-[220px] sm:min-h-[280px] flex items-center shadow-2xl">
        {/* Dynamic Media: Video or Image */}
        {categoryAd ? (
          categoryAd.mediaType === 'VIDEO' ? (
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <video
                autoPlay
                loop
                muted={isMuted}
                playsInline
                poster={resolveMediaUrl(categoryAd.posterUrl)}
                className="w-full h-full object-cover opacity-35 scale-105"
              >
                <source src={resolveMediaUrl(categoryAd.mediaUrl)} type="video/mp4" />
              </video>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-4 right-4 z-20 p-2 rounded-full bg-black/70 border border-gold/40 text-gold hover:text-white backdrop-blur-sm"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          ) : (
            <img
              src={resolveMediaUrl(categoryAd.mediaUrl)}
              alt={categoryAd.title}
              className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-90"
            />
          )
        ) : category?.image?.url ? (
          <img
            src={resolveMediaUrl(category.image.url)}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        ) : null}

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-noir via-noir/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-transparent to-noir/40 pointer-events-none" />

        {/* Banner Content */}
        <div className="relative z-10 max-w-2xl space-y-3.5">
          <div className="inline-flex items-center gap-1.5 text-gold text-[10px] uppercase tracking-[0.25em] font-semibold bg-black/60 px-2.5 py-1 rounded border border-gold/30 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-gold" />
            <span>{categoryAd?.subtitle || 'Royal House Category'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider font-bold text-zinc-100 leading-tight">
            {categoryAd?.title || category?.name}
          </h1>
          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-light max-w-xl">
            {categoryAd?.description || category?.description || 'Authentic formulations and royal extraits handcrafted in limited batches.'}
          </p>

          {categoryAd?.ctaText && (
            <div className="pt-2">
              <Link
                to={categoryAd.ctaUrl || '/shop'}
                className="inline-flex items-center gap-2 btn-gold text-xs py-2.5 px-6 font-semibold uppercase tracking-wider shadow-lg"
              >
                <span>{categoryAd.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Subcategories Filter Pills */}
      {category?.subcategories && category.subcategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setSelectedSubCategory('')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border transition-all ${
              !selectedSubCategory
                ? 'border-gold bg-gold text-black shadow-gold-glow'
                : 'border-zinc-800 bg-noir-card text-zinc-300 hover:border-gold/50'
            }`}
          >
            All {category.name}
          </button>
          {category.subcategories.map((sub) => (
            <button
              key={sub._id}
              onClick={() => setSelectedSubCategory(sub.slug)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border transition-all ${
                selectedSubCategory === sub.slug
                  ? 'border-gold bg-gold text-black shadow-gold-glow'
                  : 'border-zinc-800 bg-noir-card text-zinc-300 hover:border-gold/50'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-96 bg-noir-card border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-noir-card border border-zinc-800 p-8">
          <p className="font-serif text-sm uppercase tracking-wider text-zinc-400">
            New creations for this category are currently in royal distillation.
          </p>
          <Link to="/shop" className="mt-4 inline-block btn-outline-gold text-xs py-2 px-6">
            View All Fragrances
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
