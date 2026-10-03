import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, ShoppingBag, Eye, Clock, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VideoModal({ video, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!video) return null;

  const isYouTube = video.videoUrl?.includes('youtube.com') || video.videoUrl?.includes('youtu.be');
  const getYouTubeEmbedUrl = (url) => {
    try {
      if (url.includes('youtu.be/')) {
        return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}?autoplay=1`;
      }
      const urlObj = new URL(url);
      const v = urlObj.searchParams.get('v');
      return `https://www.youtube.com/embed/${v}?autoplay=1`;
    } catch {
      return url;
    }
  };

  const isVertical = video.sectionType === 'SCENT_FLUENCER';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div 
        className={`relative z-10 w-full ${isVertical ? 'max-w-md' : 'max-w-4xl'} bg-[#121214] border border-[#d4af37]/30 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col max-h-[92vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#16161a]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-xs font-serif tracking-widest text-[#d4af37] uppercase">
              {video.sectionType === 'SCENT_FLUENCER' ? 'JR Scent-Fluencer Reel' : 'JR Campaign Inspiration'}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close video modal"
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Player Container */}
        <div className={`relative w-full ${isVertical ? 'aspect-[9/16] max-h-[60vh]' : 'aspect-video'} bg-black flex items-center justify-center overflow-hidden`}>
          {isYouTube ? (
            <iframe
              src={getYouTubeEmbedUrl(video.videoUrl)}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.posterUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            >
              Your browser does not support video playback.
            </video>
          )}

          {/* Views badge overlay */}
          {video.viewsCount && (
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full text-[11px] text-white/90 flex items-center space-x-1.5 pointer-events-none">
              <Eye size={12} className="text-[#d4af37]" />
              <span>{video.viewsCount} views</span>
            </div>
          )}
        </div>

        {/* Video Details & Meta */}
        <div className="p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-[#121214] to-[#0c0c0e]">
          <div>
            <h3 className="text-lg md:text-xl font-serif font-bold text-white tracking-wide">
              {video.title}
            </h3>
            {video.influencerName && (
              <p className="text-sm text-[#d4af37] font-medium mt-0.5">
                Featuring {video.influencerName}
              </p>
            )}
            {video.caption && (
              <p className="text-xs md:text-sm text-stone-300 mt-2 italic leading-relaxed">
                "{video.caption}"
              </p>
            )}
            {video.seoDescription && (
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                {video.seoDescription}
              </p>
            )}
          </div>

          {/* Shoppable Tagged Product Section */}
          {video.taggedProduct && (
            <div className="p-3 bg-[#1e1e24] border border-[#d4af37]/30 rounded-xl flex items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={video.taggedProduct.images?.[0] || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=200'}
                  alt={video.taggedProduct.name}
                  className="w-12 h-12 object-cover rounded-lg border border-white/10 flex-shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] text-[#d4af37] tracking-wider uppercase block">Featured Product</span>
                  <h4 className="text-xs font-semibold text-white truncate">{video.taggedProduct.name}</h4>
                  <p className="text-xs font-bold text-[#e5c07b]">
                    ₹{video.taggedProduct.price?.toLocaleString('en-IN') || '1,499'}
                  </p>
                </div>
              </div>
              <Link
                to={`/product/${video.taggedProduct.slug || video.taggedProduct._id}`}
                onClick={onClose}
                className="flex-shrink-0 inline-flex items-center space-x-1.5 bg-[#d4af37] hover:bg-[#b89728] text-black font-semibold text-xs px-3 py-2 rounded-lg transition-colors shadow"
              >
                <ShoppingBag size={14} />
                <span>Shop Now</span>
              </Link>
            </div>
          )}

          {/* External Action Button (e.g., YouTube Channel) */}
          {video.externalUrl && (
            <a
              href={video.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl border border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/10 text-xs font-medium tracking-wider uppercase transition-colors"
            >
              <span>Visit Official Channel</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
