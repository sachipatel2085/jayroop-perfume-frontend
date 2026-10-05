import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { authService } from '../services/authService.js';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated, refreshUser } = useAuth();

  // Array of product ID strings
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved =
        localStorage.getItem('jayrup_guest_wishlist') ||
        localStorage.getItem('jayroop_guest_wishlist');
      return saved ? JSON.parse(saved).map(String) : [];
    } catch {
      return [];
    }
  });

  // Array of full product objects
  const [wishlistProducts, setWishlistProducts] = useState(() => {
    try {
      const savedItems =
        localStorage.getItem('jayrup_guest_wishlist_items') ||
        localStorage.getItem('jayroop_guest_wishlist_items');
      return savedItems ? JSON.parse(savedItems) : [];
    } catch {
      return [];
    }
  });

  // Sync with user's wishlist from DB when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.wishlist) {
      const dbIds = [];
      const dbProducts = [];
      user.wishlist.forEach((item) => {
        if (typeof item === 'object' && item !== null) {
          dbIds.push(String(item._id || item.id));
          dbProducts.push(item);
        } else if (item) {
          dbIds.push(String(item));
        }
      });
      setWishlist(dbIds);
      if (dbProducts.length > 0) {
        setWishlistProducts(dbProducts);
      }
    } else if (!isAuthenticated) {
      // Re-read guest localStorage when logged out
      try {
        const saved =
          localStorage.getItem('jayrup_guest_wishlist') ||
          localStorage.getItem('jayroop_guest_wishlist');
        const savedItems =
          localStorage.getItem('jayrup_guest_wishlist_items') ||
          localStorage.getItem('jayroop_guest_wishlist_items');
        setWishlist(saved ? JSON.parse(saved).map(String) : []);
        setWishlistProducts(savedItems ? JSON.parse(savedItems) : []);
      } catch {
        setWishlist([]);
        setWishlistProducts([]);
      }
    }
  }, [isAuthenticated, user?.wishlist]);

  // Toggle wishlist with INSTANT (0ms) optimistic UI update
  const toggleWishlist = async (productId, productObj = null) => {
    if (!productId) return;
    const idStr = String(productId);
    const wasInWishlist = wishlist.includes(idStr);

    // 1. INSTANT OPTIMISTIC UPDATE: Update UI state immediately without waiting for network
    const prevWishlist = [...wishlist];
    const prevProducts = [...wishlistProducts];

    const nextWishlist = wasInWishlist
      ? prevWishlist.filter((id) => id !== idStr)
      : [...prevWishlist, idStr];

    setWishlist(nextWishlist);

    let nextProducts = [...prevProducts];
    if (wasInWishlist) {
      nextProducts = nextProducts.filter((p) => String(p._id || p.id) !== idStr);
    } else if (productObj) {
      const alreadyExists = nextProducts.some((p) => String(p._id || p.id) === idStr);
      if (!alreadyExists) {
        nextProducts = [productObj, ...nextProducts];
      }
    }
    setWishlistProducts(nextProducts);

    // If guest mode, persist to localStorage immediately
    if (!isAuthenticated) {
      try {
        localStorage.setItem('jayrup_guest_wishlist', JSON.stringify(nextWishlist));
        localStorage.setItem('jayrup_guest_wishlist_items', JSON.stringify(nextProducts));
      } catch (e) {
        console.error('Failed to save guest wishlist to localStorage', e);
      }
      return;
    }

    // 2. BACKGROUND SERVER SYNC for authenticated users
    try {
      const res = await authService.toggleWishlist(idStr);
      // Handles both direct object and nested data responses safely
      const serverWishlistRaw =
        res?.wishlist ||
        res?.data?.wishlist ||
        (Array.isArray(res) ? res : []);

      const serverIds = serverWishlistRaw.map((item) =>
        typeof item === 'object' && item !== null
          ? String(item._id || item.id)
          : String(item)
      );

      const serverPopulatedProducts = serverWishlistRaw.filter(
        (item) => typeof item === 'object' && item !== null && (item._id || item.id)
      );

      // Finalize with authoritative server state
      setWishlist(serverIds);
      if (serverPopulatedProducts.length > 0) {
        setWishlistProducts(serverPopulatedProducts);
      }

      refreshUser();
    } catch (err) {
      console.error('Failed to sync wishlist with server', err);
      // Revert optimistic update on server error
      setWishlist(prevWishlist);
      setWishlistProducts(prevProducts);
    }
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlist.includes(String(productId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistProducts,
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
