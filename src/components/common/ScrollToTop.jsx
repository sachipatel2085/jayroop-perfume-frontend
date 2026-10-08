import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Automatically scrolls the window and any internal scrollable containers
 * directly to the top (0, 0) whenever the route pathname or search parameters change.
 */
export const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If navigation contains an anchor hash (e.g. #reviews), smoothly scroll to that element
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Instantly reset window and body scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // Also reset scroll for any internal container with overflow-y-auto (e.g., admin main view)
    const scrollableContainers = document.querySelectorAll('main, .overflow-y-auto');
    scrollableContainers.forEach((container) => {
      container.scrollTop = 0;
    });
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
