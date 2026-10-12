import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, Sparkles, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { productService } from '../services/productService.js';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { SEO } from '../components/seo/SEO.jsx';
import { BreadcrumbSchema } from '../components/seo/BreadcrumbSchema.jsx';
import { CollectionPageSchema } from '../components/seo/CollectionPageSchema.jsx';
import { FAQSchema } from '../components/seo/FAQSchema.jsx';
import { resolveMediaUrl } from '../utils/media.js';
import { sanitizeHtml } from '../utils/sanitizeHtml.js';

const plainText = (html = '') => String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, '')}…` : s);


export const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSubCategory = searchParams.get('subCategory') || '';

  const [category, setCategory] = useState(null);
  const [categoryAd, setCategoryAd] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const handleSubCategorySelect = (subSlug) => {
    const nextParams = new URLSearchParams(searchParams);
    if (subSlug) {
      nextParams.set('subCategory', subSlug);
    } else {
      nextParams.delete('subCategory');
    }
    setSearchParams(nextParams);
  };

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

  // Banner text = the short intro (falls back to the start of the long description)
  const intro = category?.intro || clip(plainText(category?.description), 220);
  const faqs = (category?.faqs || []).filter((f) => f.question && f.answer);
  // The category's own banner wins; a CATEGORY_HEADER campaign is only used when a category has no image
  const bannerAd = category && !category.image?.url ? categoryAd : null;

  const breadcrumbList = [
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    { name: category?.name || slug, url: `/category/${slug}` },
  ];

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-8 px-4 sm:px-8 max-w-7xl mx-auto">
      <SEO
        title={
          category?.seo?.metaTitle ||
          (category?.name
            ? `${category.name} Collection | Jayrup Royal Luxury`
            : 'Category Collection | Jayrup')
        }
        description={category?.seo?.metaDescription || intro}
        keywords={category?.seo?.metaKeywords}
        canonicalUrl={category?.seo?.canonicalUrl || `/category/${slug}`}
        ogImage={category?.image?.url}
      >
        <BreadcrumbSchema items={breadcrumbList} />
        <CollectionPageSchema
          name={category?.name || 'Category'}
          description={intro}
          url={`/category/${slug}`}
          products={products}
        />
        <FAQSchema faqs={faqs} />
      </SEO>

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-400 mb-6">
        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-gold font-semibold">{category?.name || slug}</span>
      </nav>

      {/* Category banner – artwork on the right, name + intro on the left */}
      <div className="relative overflow-hidden border border-gold/30 mb-10 bg-noir-card shadow-2xl sm:flex sm:items-center sm:aspect-[1600/560] sm:min-h-[300px]">
        {/* Artwork – on phones it sits on top (product side visible), on larger screens it fills the banner */}
        <div className="relative aspect-[16/10] sm:absolute sm:inset-0 sm:aspect-auto">
        {bannerAd ? (
          bannerAd.mediaType === 'VIDEO' ? (
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <video
                autoPlay
                loop
                muted={isMuted}
                playsInline
                poster={resolveMediaUrl(bannerAd.posterUrl)}
                className="w-full h-full object-cover opacity-40"
              >
                <source src={resolveMediaUrl(bannerAd.mediaUrl)} type="video/mp4" />
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
            <img src={resolveMediaUrl(bannerAd.mediaUrl)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          )
        ) : category?.image?.url ? (
          <img
            src={resolveMediaUrl(category.image.url)}
            srcSet={
              /\.webp$/.test(category.image.url) && category.image.url.startsWith('/images/categories/')
                ? `${category.image.url.replace(/\.webp$/, '-800.webp')} 800w, ${category.image.url} 1600w`
                : undefined
            }
            sizes="(max-width: 1280px) 100vw, 1216px"
            alt={category.image?.altText || category.name}
            width="1600"
            height="560"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover object-[88%_center] sm:object-right"
          />
        ) : null}
          {/* Readability layers: fade into the text below on phones, dark text side on the left on desktop */}
          <div className="absolute inset-0 bg-gradient-to-t from-noir-card via-transparent to-transparent sm:bg-gradient-to-r sm:from-noir sm:via-noir/70 sm:to-transparent" />
          <div className="absolute inset-0 shadow-[inset_0_0_70px_rgba(0,0,0,0.55)] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-xl space-y-3 px-5 pb-6 -mt-6 sm:mt-0 sm:p-12">
          <div className="inline-flex items-center gap-1.5 text-gold text-[10px] uppercase tracking-[0.25em] font-semibold bg-black/60 px-2.5 py-1 rounded border border-gold/30 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-gold" />
            <span>{bannerAd?.subtitle || 'Jayrup Collection'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider font-bold text-zinc-100 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {category?.name || (loading ? '' : slug)}
          </h1>
          {intro && <p className="text-zinc-300 text-sm leading-relaxed max-w-lg drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">{intro}</p>}
          {bannerAd?.ctaText && (
            <div className="pt-2">
              <Link to={bannerAd.ctaUrl || '/shop'} className="inline-flex items-center gap-2 btn-gold text-xs py-2.5 px-6 font-semibold uppercase tracking-wider shadow-lg">
                <span>{bannerAd.ctaText}</span>
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
            onClick={() => handleSubCategorySelect('')}
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
              onClick={() => handleSubCategorySelect(sub.slug)}
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

      {/* About this category – long-form content for shoppers and search engines */}
      {category?.description && (
        <section className="mt-16 border-t border-gold/20 pt-10" aria-labelledby="about-category">
          <h2 id="about-category" className="sr-only">About {category.name}</h2>
          <div className="rich-content max-w-3xl" dangerouslySetInnerHTML={{ __html: sanitizeHtml(category.description) }} />
        </section>
      )}

      {faqs.length > 0 && (
        <section className="mt-14 max-w-3xl" aria-labelledby="category-faqs">
          <h2 id="category-faqs" className="font-serif text-xl sm:text-2xl uppercase tracking-wider text-zinc-100 mb-5">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-zinc-800 border-y border-zinc-800">
            {faqs.map((f, i) => (
              <details key={i} className="group py-4" open={i === 0}>
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-zinc-100 font-medium hover:text-gold-light">
                  <span>{f.question}</span>
                  <ChevronDown className="w-4 h-4 text-gold flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
