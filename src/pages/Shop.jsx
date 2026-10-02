import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, X } from 'lucide-react';
import { productService } from '../services/productService.js';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { SEOHead } from '../components/common/SEOHead.jsx';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const search = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedSort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const inStock = searchParams.get('inStock') === 'true';
  const page = Number(searchParams.get('page')) || 1;

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    productService.getCategories().then((data) => {
      if (Array.isArray(data)) setCategories(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 12,
          sort: selectedSort,
        };
        if (search) params.search = search;
        if (selectedCategory) params.category = selectedCategory;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (inStock) params.inStock = 'true';

        const res = await productService.getProducts(params);
        if (res?.data) {
          setProducts(res.data);
          setTotalProducts(res.total || 0);
          setTotalPages(res.totalPages || 1);
        }
      } catch (err) {
        console.error('Failed to load shop catalog', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [search, selectedCategory, selectedSort, minPrice, maxPrice, inStock, page]);

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    nextParams.set('page', '1'); // Reset to page 1
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-10 px-4 sm:px-8 max-w-7xl mx-auto">
      <SEOHead
        title="Royal Fragrance & Skincare Catalog"
        description="Browse the complete catalog of Jayroop extraits, saffron soaps, and therapeutic cosmetics."
      />

      {/* Header */}
      <div className="border-b border-gold/20 pb-8 mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
            Catalog & Treasury
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl uppercase tracking-wider text-zinc-100 font-semibold mt-1">
            All Royal Creations
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Displaying {products.length} of {totalProducts} curated creations
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center justify-center sm:justify-end gap-3 text-xs">
          <label className="text-zinc-400 uppercase tracking-wider text-[10px]">
            Sort By:
          </label>
          <select
            value={selectedSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="bg-noir-card border border-gold/30 px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-gold"
          >
            <option value="newest">Newest Releases</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Client Rating</option>
          </select>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden btn-outline-gold py-2 px-3 flex items-center gap-1.5 text-[10px]"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Sidebar Filters (Desktop & Mobile) */}
        <aside
          className={`md:block space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="p-5 bg-noir-card border border-gold/20 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="font-serif text-sm uppercase tracking-wider text-gold font-semibold">
                Refine Treasury
              </span>
              {(search || selectedCategory || minPrice || maxPrice || inStock) && (
                <button
                  onClick={clearAllFilters}
                  className="text-[10px] text-zinc-400 hover:text-red-400 uppercase tracking-wider"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-3">
                Category
              </h4>
              <div className="space-y-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => updateFilter('category', '')}
                  className={`w-full text-left py-1 px-2 transition-colors ${
                    !selectedCategory ? 'text-gold font-semibold bg-gold/10' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => updateFilter('category', cat.slug)}
                    className={`w-full text-left py-1 px-2 transition-colors ${
                      selectedCategory === cat.slug
                        ? 'text-gold font-semibold bg-gold/10'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="border-t border-zinc-800/80 pt-4">
              <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-3">
                Price Range (₹)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="bg-noir border border-zinc-800 p-2 text-zinc-200 focus:outline-none focus:border-gold"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="bg-noir border border-zinc-800 p-2 text-zinc-200 focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Stock filter */}
            <div className="border-t border-zinc-800/80 pt-4">
              <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')}
                  className="accent-gold w-4 h-4 bg-noir border-zinc-800"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Right Product Grid */}
        <main className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 bg-noir-card border border-zinc-800/50 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-noir-card border border-zinc-800 p-8">
              <h3 className="font-serif text-lg uppercase tracking-wider text-zinc-300 mb-2">
                No Creations Match Your Refinements
              </h3>
              <p className="text-xs text-zinc-500 mb-6">
                Try clearing selected filters or searching with different keywords.
              </p>
              <button onClick={clearAllFilters} className="btn-outline-gold text-xs py-2.5 px-6">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2 text-xs">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateFilter('page', p.toString())}
                      className={`w-9 h-9 border font-semibold transition-all ${
                        p === page
                          ? 'border-gold bg-gold text-black shadow-gold-glow'
                          : 'border-zinc-800 bg-noir-card text-zinc-400 hover:border-gold/50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
