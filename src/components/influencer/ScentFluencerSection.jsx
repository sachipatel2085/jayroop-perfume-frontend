import React, { useState } from 'react';
import { Play, Eye, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoModal from './VideoModal.jsx';

export default function ScentFluencerSection({ videos = [] }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-20 bg-[#0a0a0c] text-white relative overflow-hidden">
      {/* Background ambient gold gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 text-[#d4af37] text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            <Sparkles size={14} />
            <span>Community & Fragrance Creators</span>
            <Sparkles size={14} />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight uppercase">
            Our Scent-Fluencer
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4 mb-4" />
          <p className="text-stone-400 text-sm sm:text-base font-light">
            Real impressions, unboxings, and pulse-point rituals from renowned fragrance connoisseurs.
          </p>
        </div>

        {/* Vertical Shoppable Reel Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {videos.map((video) => {
            const product = video.taggedProduct;
            return (
              <div
                key={video._id}
                className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#d4af37]/70 shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-[#141418] flex flex-col aspect-[9/16]"
              >
                {/* Background Poster Image */}
                <div 
                  className="absolute inset-0 cursor-pointer overflow-hidden"
                  onClick={() => setSelectedVideo(video)}
                >
                  <img
                    src={video.posterUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
                    alt={video.altText || `${video.influencerName || 'Creator'} reviewing perfume reel`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient Overlays for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40 group-hover:from-black/90 transition-colors" />

                  {/* Top-Left View Count Badge (as seen in Reference 2) */}
                  <div className="absolute top-3.5 left-3.5 z-20 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-white/90 font-medium shadow-md">
                    <Eye size={12} className="text-[#d4af37]" />
                    <span>{video.viewsCount || '1.8k'}</span>
                  </div>

                  {/* Center Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/50 backdrop-blur-md border border-[#d4af37]/80 flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black group-hover:scale-110 shadow-xl transition-all duration-300">
                      <Play size={20} className="fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Bottom Pinned Shoppable Card (as seen in Reference 2) */}
                <div className="relative z-20 mt-auto p-3 sm:p-3.5">
                  {/* Influencer tag & title caption */}
                  <div 
                    className="mb-2 cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    {video.influencerName && (
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] block">
                        @{video.influencerName}
                      </span>
                    )}
                    <p className="text-xs sm:text-[13px] font-medium text-white line-clamp-2 leading-tight group-hover:text-[#e5c07b] transition-colors">
                      {video.title}
                    </p>
                  </div>

                  {/* Tagged Product Box */}
                  {product ? (
                    <div className="bg-black/80 backdrop-blur-md border border-white/15 rounded-xl p-2 sm:p-2.5 flex items-center justify-between gap-2 shadow-lg">
                      <Link 
                        to={`/product/${product.slug || product._id}`}
                        className="flex items-center space-x-2.5 min-w-0 flex-1 hover:opacity-90 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=150'}
                          alt={product.name}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover border border-white/10 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-[11px] sm:text-xs font-semibold text-white truncate">
                            {product.name}
                          </h4>
                          <span className="text-[10px] sm:text-[11px] font-bold text-[#e5c07b]">
                            ₹{product.price?.toLocaleString('en-IN') || '1,499'}
                          </span>
                        </div>
                      </Link>

                      <Link
                        to={`/product/${product.slug || product._id}`}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Buy ${product.name}`}
                        className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#d4af37] hover:bg-[#b89728] text-black flex items-center justify-center transition-colors shadow"
                      >
                        <ShoppingBag size={14} />
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-[11px] font-medium text-white/90 flex items-center justify-center space-x-1.5 transition-colors border border-white/10"
                    >
                      <span>Watch Full Reel</span>
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </section>
  );
}
