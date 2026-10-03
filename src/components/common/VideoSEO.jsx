import React, { useEffect } from 'react';

/**
 * Deep Video SEO Structured Data (JSON-LD)
 * Injects Google-compliant Schema.org/VideoObject for search indexing, rich snippets & video carousels.
 */
export default function VideoSEO({ videos = [] }) {
  useEffect(() => {
    if (!videos || videos.length === 0) return;

    // Convert duration like "1:15" into ISO 8601 duration "PT1M15S"
    const parseDurationToISO = (durStr) => {
      if (!durStr) return 'PT1M00S';
      const parts = durStr.split(':').map(Number);
      if (parts.length === 2) {
        return `PT${parts[0]}M${parts[1]}S`;
      }
      if (parts.length === 3) {
        return `PT${parts[0]}H${parts[1]}M${parts[2]}S`;
      }
      return 'PT1M00S';
    };

    const scriptId = 'jayroop-video-seo-jsonld';
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const structuredData = videos.map((video) => {
      const viewsNumeric = parseInt(String(video.viewsCount || '0').replace(/[^0-9]/g, '')) * (String(video.viewsCount || '').toLowerCase().includes('k') ? 1000 : 1) || 1000;

      return {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: video.title || 'Jayroop Luxury Fragrance Story',
        description: video.seoDescription || video.caption || 'Jayroop (JR) Royal Fragrance & Skincare Experience',
        thumbnailUrl: [video.posterUrl || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1200'],
        uploadDate: video.createdAt || new Date().toISOString(),
        duration: parseDurationToISO(video.videoDuration),
        contentUrl: video.videoUrl,
        embedUrl: video.videoUrl,
        keywords: Array.isArray(video.seoKeywords) ? video.seoKeywords.join(', ') : (video.seoKeywords || 'Jayroop, Perfume, Luxury Fragrance'),
        interactionStatistic: {
          '@type': 'InteractionCounter',
          interactionType: { '@type': 'WatchAction' },
          userInteractionCount: viewsNumeric,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Jayroop (JR) Royal Fragrance & Skincare House',
          logo: {
            '@type': 'ImageObject',
            url: window.location.origin + '/jayroop-logo.webp',
          },
        },
      };
    });

    scriptTag.text = JSON.stringify(structuredData.length === 1 ? structuredData[0] : structuredData);

    return () => {
      // Clean up script on unmount
      const existing = document.getElementById(scriptId);
      if (existing) {
        existing.remove();
      }
    };
  }, [videos]);

  return null;
}
