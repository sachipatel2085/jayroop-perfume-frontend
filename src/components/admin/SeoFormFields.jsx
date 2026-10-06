import React, { useState } from 'react';
import {
  Search,
  Globe,
  Sparkles,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Monitor,
  ChevronDown,
  Info,
} from 'lucide-react';

export const SeoFormFields = ({
  seoData = {},
  onChange,
  fallbackTitle = '',
  fallbackDescription = '',
  fallbackSlug = '',
  fallbackImage = '',
  itemType = 'products', // 'products', 'category', 'blog'
  showImageAlt = true,
  imageAlt = '',
  onImageAltChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' or 'mobile'

  const metaTitle = seoData.metaTitle ?? '';
  const metaDescription = seoData.metaDescription ?? '';
  const metaKeywords = seoData.metaKeywords ?? '';
  const focusKeyword = seoData.focusKeyword ?? '';
  const canonicalUrl = seoData.canonicalUrl ?? '';
  const searchIndexing = seoData.searchIndexing ?? 'INDEX_FOLLOW';

  // Display values for preview (uses fallback if empty)
  const displayTitle = metaTitle || fallbackTitle || 'Jayrup Luxury Creation';
  const displayDesc =
    metaDescription ||
    fallbackDescription ||
    'Discover exquisite handcrafted Extraits de Parfum and Ayurvedic skincare from Jayrup Royal House. पिंपल्स भागे, आत्मविश्वास जागे.';
  const displaySlug = fallbackSlug ? fallbackSlug.toLowerCase().replace(/\s+/g, '-') : 'item';
  const previewUrl = `https://jayrup.com/${itemType}/${displaySlug}`;

  // Character lengths & status badges
  const titleLen = metaTitle.length;
  const descLen = metaDescription.length;

  const getTitleStatus = () => {
    if (titleLen === 0) return { label: 'Empty (Will fallback to name)', color: 'text-zinc-500' };
    if (titleLen < 40) return { label: `${titleLen}/60 - Too short`, color: 'text-amber-400' };
    if (titleLen <= 65) return { label: `${titleLen}/60 - Optimal Length`, color: 'text-emerald-400' };
    return { label: `${titleLen}/60 - Too long (May truncate on Google)`, color: 'text-red-400' };
  };

  const getDescStatus = () => {
    if (descLen === 0) return { label: 'Empty (Will fallback)', color: 'text-zinc-500' };
    if (descLen < 100) return { label: `${descLen}/160 - Too short`, color: 'text-amber-400' };
    if (descLen <= 165) return { label: `${descLen}/160 - Optimal Length`, color: 'text-emerald-400' };
    return { label: `${descLen}/160 - Too long (May truncate on Google)`, color: 'text-red-400' };
  };

  const handleFieldChange = (field, value) => {
    onChange({
      ...seoData,
      [field]: value,
    });
  };

  return (
    <div className="border border-gold/30 bg-noir-card rounded-none overflow-hidden my-6">
      {/* Accordion Toggle Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 bg-zinc-950/80 hover:bg-gold/5 border-b border-gold/20 flex items-center justify-between transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-gold/10 text-gold">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-xs uppercase tracking-wider text-gold font-bold">
                Search Engine Optimization (SEO & Rich Meta Tags)
              </h3>
              <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Google SERP Ready
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Control how this page appears on Google Search, WhatsApp social shares, and image indexers.
            </p>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gold transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* 1. LIVE GOOGLE SERP PREVIEW BOX */}
          <div className="p-4 bg-black border border-zinc-800 rounded">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                  Google Search Result Preview
                </span>
              </div>

              {/* Device Toggle */}
              <div className="flex items-center gap-1 bg-zinc-900 p-0.5 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1 text-[10px] flex items-center gap-1 px-2 transition-colors ${
                    previewDevice === 'desktop'
                      ? 'bg-gold text-black font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1 text-[10px] flex items-center gap-1 px-2 transition-colors ${
                    previewDevice === 'mobile'
                      ? 'bg-gold text-black font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Google Search Snippet Card */}
            <div
              className={`p-3 bg-[#202124] rounded border border-zinc-800 space-y-1 ${
                previewDevice === 'mobile' ? 'max-w-sm' : 'max-w-xl'
              }`}
            >
              <div className="flex items-center gap-2 text-[11px] text-[#bdc1c6] truncate">
                <span className="w-4 h-4 rounded-full bg-[#303134] flex items-center justify-center text-[9px] font-serif text-gold">
                  JR
                </span>
                <span className="truncate">{previewUrl}</span>
              </div>

              <h4 className="text-sm sm:text-base font-normal text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
                {displayTitle} | Jayrup Royal House
              </h4>

              <p className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed">
                {displayDesc}
              </p>
            </div>
          </div>

          {/* 2. SEO FORM INPUTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Meta Title */}
            <div className="md:col-span-2 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-zinc-300 uppercase tracking-wider text-[10px] font-semibold">
                  SEO Meta Title (Title Tag) *
                </label>
                <span className={`text-[10px] font-mono ${getTitleStatus().color}`}>
                  {getTitleStatus().label}
                </span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => handleFieldChange('metaTitle', e.target.value)}
                placeholder={fallbackTitle ? `${fallbackTitle} | Luxury Fragrance` : 'e.g. Royal Oud Extrait de Parfum | Jayrup Luxury House'}
                className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
              />
              <p className="text-[10px] text-zinc-500">
                Appears as the primary clickable headline in search engines. Recommended: 50–60 characters.
              </p>
            </div>

            {/* Focus Keyword */}
            <div className="space-y-1">
              <label className="text-zinc-300 uppercase tracking-wider text-[10px] font-semibold">
                Primary Focus Keyword
              </label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => handleFieldChange('focusKeyword', e.target.value)}
                placeholder="e.g. luxury oud perfume, pimples soap"
                className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
              />
              <p className="text-[10px] text-zinc-500">
                The primary search query you aim to rank #1 on Google for.
              </p>
            </div>

            {/* Search Indexing Directive */}
            <div className="space-y-1">
              <label className="text-zinc-300 uppercase tracking-wider text-[10px] font-semibold">
                Search Engine Robots Directive
              </label>
              <select
                value={searchIndexing}
                onChange={(e) => handleFieldChange('searchIndexing', e.target.value)}
                className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
              >
                <option value="INDEX_FOLLOW">Index & Follow (Recommended - Google will index and rank)</option>
                <option value="NOINDEX_NOFOLLOW">Noindex & Nofollow (Hidden from search engines)</option>
              </select>
              <p className="text-[10px] text-zinc-500">
                Instructs web crawlers whether to include this page in search indexes.
              </p>
            </div>

            {/* Meta Description */}
            <div className="md:col-span-2 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-zinc-300 uppercase tracking-wider text-[10px] font-semibold">
                  SEO Meta Description *
                </label>
                <span className={`text-[10px] font-mono ${getDescStatus().color}`}>
                  {getDescStatus().label}
                </span>
              </div>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
                placeholder={
                  fallbackDescription
                    ? fallbackDescription.slice(0, 160)
                    : 'e.g. Indulge in Jayrup Royal Oud Extrait de Parfum (30%+ concentration). Distilled with authentic rare botanicals. Complimentary pan-India express shipping above ₹999.'
                }
                className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold resize-y"
              />
              <p className="text-[10px] text-zinc-500">
                Concise summary displayed beneath your title in Google search results. Recommended: 150–160 characters.
              </p>
            </div>

            {/* Meta Keywords */}
            <div className="space-y-1">
              <label className="text-zinc-300 uppercase tracking-wider text-[10px] font-semibold">
                Meta Keywords / Search Tags
              </label>
              <input
                type="text"
                value={metaKeywords}
                onChange={(e) => handleFieldChange('metaKeywords', e.target.value)}
                placeholder="e.g. extrait de parfum, oud, kannauj rose, attar, luxury"
                className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
              />
              <p className="text-[10px] text-zinc-500">
                Comma-separated search keywords for internal search and indexing.
              </p>
            </div>

            {/* Canonical URL Override */}
            <div className="space-y-1">
              <label className="text-zinc-300 uppercase tracking-wider text-[10px] font-semibold">
                Canonical URL Override (Optional)
              </label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => handleFieldChange('canonicalUrl', e.target.value)}
                placeholder={`e.g. https://jayrup.com/${itemType}/${displaySlug}`}
                className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
              />
              <p className="text-[10px] text-zinc-500">
                Prevents duplicate content issues if this item is reachable via multiple URLs.
              </p>
            </div>

            {/* Image Alt Text (If Applicable) */}
            {showImageAlt && onImageAltChange && (
              <div className="md:col-span-2 space-y-1 pt-1 border-t border-zinc-800/80">
                <div className="flex items-center gap-1.5">
                  <label className="text-zinc-300 uppercase tracking-wider text-[10px] font-semibold">
                    Primary Image Alt Text (Google Image SEO)
                  </label>
                  <span className="text-[9px] uppercase font-bold text-gold bg-gold/10 px-1.5 py-0.5 rounded">
                    Rank on Google Images
                  </span>
                </div>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => onImageAltChange(e.target.value)}
                  placeholder={fallbackTitle ? `${fallbackTitle} luxury flacon bottle shot` : 'e.g. Jayrup Royal Oud Extrait de Parfum 100ml luxury flacon'}
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                />
                <p className="text-[10px] text-zinc-500">
                  Essential for accessibility and ranking in Google Image Search results.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
