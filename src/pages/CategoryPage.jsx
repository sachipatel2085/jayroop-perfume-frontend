import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import { productService } from '../services/productService.js';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { SEOHead } from '../components/common/SEOHead.jsx';

export const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        setLoading(true);
        const catRes = await productService.getCategoryBySlug(slug);
        setCategory(catRes);

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

      {/* Category Banner */}
      <div className="relative overflow-hidden border border-gold/30 p-8 sm:p-12 mb-10 bg-noir-card">
        {category?.image?.url && (
          <img
            src={category.image.url}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-gold text-[10px] uppercase tracking-[0.25em] font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Royal House Category</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider font-bold text-zinc-100">
            {category?.name}
          </h1>
          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-light">
            {category?.description || 'Authentic formulations and royal extraits handcrafted in limited batches.'}
          </p>
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
