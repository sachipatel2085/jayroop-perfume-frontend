import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { authService } from '../services/authService.js';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('jayroop_guest_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync with user's wishlist from DB when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.wishlist) {
      const dbIds = user.wishlist.map((item) =>
        typeof item === 'object' ? item._id : item
      );
      setWishlist(dbIds);
    }
  }, [isAuthenticated, user]);

  const toggleWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await authService.toggleWishlist(productId);
        setWishlist(res.data.wishlist);
        refreshUser();
      } catch (err) {
        console.error('Failed to toggle wishlist on server', err);
      }
    } else {
      // Guest mode
      setWishlist((prev) => {
        let updated;
        if (prev.includes(productId)) {
          updated = prev.filter((id) => id !== productId);
        } else {
          updated = [...prev, productId];
        }
        localStorage.setItem('jayroop_guest_wishlist', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
