import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Compass, Sparkles, ArrowRight, Home, ShoppingBag } from 'lucide-react';
import { SEO } from '../components/seo/SEO.jsx';
import logoImg from '../assets/jayroop-logo.webp';

export const NotFound = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="bg-noir min-h-screen text-zinc-100 flex flex-col items-center justify-center px-4 py-16 sm:py-24 text-center">
      <SEO
        title="404 — Creation Not Found"
        description="The royal creation, fragrance chamber, or page you are seeking could not be found."
        searchIndexing="NOINDEX_NOFOLLOW"
      />

      {/* Decorative Royal Aura */}
      <div className="relative mb-8">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-gold/40 p-1 shadow-gold-glow mx-auto mb-4 bg-noir">
          <img
            src={logoImg}
            alt="Jayrup Royal House"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <span className="text-6xl sm:text-8xl font-serif font-bold text-gradient-gold tracking-widest block">
          404
        </span>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/30 bg-noir-card text-gold text-[10px] uppercase tracking-[0.2em] font-semibold mt-2">
          <Sparkles className="w-3 h-3 text-gold-amber" />
          <span>Chamber Not Found</span>
        </div>
      </div>

      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-zinc-100 font-semibold">
          The Royal Creation You Seek Does Not Exist
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
          The requested formulation, article, or URL may have been relocated, renamed, or retired from the active collection. Explore our royal Treasury or search for a specific note below.
        </p>

        {/* Search Formulation Box */}
        <form onSubmit={handleSearchSubmit} className="pt-2 max-w-md mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search perfumes, soaps, or skincare..."
              className="w-full bg-noir-card border border-gold/30 py-3 pl-4 pr-12 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              className="absolute right-2 p-2 text-gold hover:text-gold-light transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Recommended Category Exploration */}
        <div className="pt-6 border-t border-zinc-800/80 space-y-3">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">
            Explore Curated Collections
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              to="/category/luxury-perfumes"
              className="px-3 py-1.5 bg-noir-card border border-zinc-800 hover:border-gold/50 text-xs text-zinc-300 hover:text-gold transition-colors"
            >
              Royal Perfumes
            </Link>
            <Link
              to="/category/skincare"
              className="px-3 py-1.5 bg-noir-card border border-zinc-800 hover:border-gold/50 text-xs text-zinc-300 hover:text-gold transition-colors"
            >
              Ayurvedic Skincare
            </Link>
            <Link
              to="/category/saffron-soaps"
              className="px-3 py-1.5 bg-noir-card border border-zinc-800 hover:border-gold/50 text-xs text-zinc-300 hover:text-gold transition-colors"
            >
              Artisanal Soaps
            </Link>
            <Link
              to="/blog"
              className="px-3 py-1.5 bg-noir-card border border-zinc-800 hover:border-gold/50 text-xs text-zinc-300 hover:text-gold transition-colors"
            >
              The Royal Journal
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/shop"
            className="btn-gold text-xs py-3 px-6 w-full sm:w-auto uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Browse All Creations</span>
          </Link>
          <Link
            to="/"
            className="btn-outline-gold text-xs py-3 px-6 w-full sm:w-auto uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
