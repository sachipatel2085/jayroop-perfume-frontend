import React, { useState } from 'react';
import { Play, ExternalLink, Sparkles } from 'lucide-react';
import VideoModal from './VideoModal.jsx';

export default function InspirationsSection({ videos = [] }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-20 bg-[#0d0d10] text-white relative overflow-hidden border-t border-b border-[#d4af37]/20">
      {/* Subtle luxury background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#d4af37]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 text-[#d4af37] text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            <Sparkles size={14} />
            <span>Celebrity & Brand Ambassador Stories</span>
            <Sparkles size={14} />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight uppercase">
            Inspirations
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4 mb-4" />
          <p className="text-stone-400 text-sm sm:text-base font-light">
            Icons of greatness reflect on character, discipline, and their timeless fragrance signatures.
          </p>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div
              key={video._id}
              className="group relative bg-[#151518] rounded-2xl overflow-hidden border border-white/10 hover:border-[#d4af37]/60 shadow-xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              {/* Thumbnail Container (16:9 Aspect Ratio) */}
              <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
                <img
                  src={video.posterUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800'}
                  alt={video.altText || `${video.influencerName || 'Celebrity'} endorsing Jayroop Perfumes`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 group-hover:from-black/75 transition-colors" />

                {/* Central Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/60 backdrop-blur-sm border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black group-hover:scale-110 shadow-lg shadow-black/50 transition-all duration-300">
                    <Play size={24} className="fill-current ml-1" />
                  </div>
                </div>

                {/* Duration Badge */}
                {video.videoDuration && (
                  <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded text-[11px] font-mono text-stone-300 border border-white/10">
                    {video.videoDuration}
                  </div>
                )}
              </div>

              {/* Card Footer / Caption Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  {video.influencerName && (
                    <span className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                      {video.influencerName}
                    </span>
                  )}
                  <h3 className="text-base sm:text-lg font-serif font-semibold text-white group-hover:text-[#e5c07b] transition-colors leading-snug line-clamp-2">
                    {video.title}
                  </h3>
                  {video.caption && (
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {video.caption}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/5 text-xs text-stone-400">
                  <span className="group-hover:text-[#d4af37] font-medium flex items-center space-x-1 transition-colors">
                    <span>Watch Story</span>
                    <Play size={12} className="fill-current inline" />
                  </span>
                  {video.viewsCount && (
                    <span className="text-stone-500">{video.viewsCount} views</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Bottom CTA Button: "VISIT YOUTUBE CHANNEL" */}
        <div className="mt-14 text-center">
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b89728] hover:from-[#e5c07b] hover:to-[#d4af37] text-black font-semibold text-xs tracking-[0.2em] uppercase shadow-lg shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>Visit YouTube Channel</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </section>
  );
}
