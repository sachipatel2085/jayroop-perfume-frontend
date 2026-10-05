import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/orderService.js';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('jayrup_cart_items') || localStorage.getItem('jayroop_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dedicated single-item instant checkout (Buy Now) state
  const [instantCheckoutItem, setInstantCheckoutItem] = useState(() => {
    try {
      const saved = sessionStorage.getItem('jayrup_instant_checkout');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [couponCode, setCouponCode] = useState(() => {
    return localStorage.getItem('jayrup_coupon') || localStorage.getItem('jayroop_coupon') || '';
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [cartCalculation, setCartCalculation] = useState({
    items: [],
    subtotal: 0,
    discount: 0,
    shipping: 0,
    total: 0,
    coupon: null,
    errors: [],
  });

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('jayrup_cart_items', JSON.stringify(items));
    } catch (err) {
      console.error('Could not save cart to localStorage', err);
    }
  }, [items]);

  // Save applied coupon to local storage
  useEffect(() => {
    if (couponCode) {
      localStorage.setItem('jayrup_coupon', couponCode);
    } else {
      localStorage.removeItem('jayrup_coupon');
      localStorage.removeItem('jayroop_coupon');
    }
  }, [couponCode]);

  // Recalculate totals server-side (Never trust client prices)
  const recalculate = useCallback(async () => {
    if (items.length === 0) {
      setCartCalculation({
        items: [],
        subtotal: 0,
        discount: 0,
        shipping: 0,
        total: 0,
        coupon: null,
        errors: [],
      });
      return;
    }

    try {
      setIsCalculating(true);
      const res = await orderService.calculateCart(items, couponCode);
      setCartCalculation(res);
    } catch (err) {
      console.error('Cart calculation failed:', err.message);
    } finally {
      setIsCalculating(false);
    }
  }, [items, couponCode]);

  useEffect(() => {
    recalculate();
  }, [recalculate]);

  const addToCart = (product, selectedVariant = null, quantity = 1) => {
    setItems((prevItems) => {
      const variantSku = selectedVariant?.sku || '';
      const existingIndex = prevItems.findIndex(
        (i) => i.productId === product._id && i.variantSku === variantSku
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            productId: product._id,
            name: product.name,
            slug: product.slug,
            image: product.images?.[0]?.url || product.images?.[0] || '',
            price: selectedVariant?.salePrice || selectedVariant?.price || product.salePrice || product.price,
            variantSku,
            variantTitle: selectedVariant?.title || '',
            quantity,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, variantSku = '', quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantSku);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.variantSku === (variantSku || '')
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId, variantSku = '') => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => {
          const isSameProduct = String(item.productId) === String(productId);
          const isSameVariant =
            (!variantSku && !item.variantSku) ||
            String(item.variantSku || '') === String(variantSku || '');
          return !(isSameProduct && isSameVariant);
        }
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    localStorage.removeItem('jayrup_cart_items');
    localStorage.removeItem('jayrup_coupon');
    localStorage.removeItem('jayroop_cart_items');
    localStorage.removeItem('jayroop_coupon');
  };

  // Configure single product instant checkout without polluting general cart
  const setInstantCheckout = (product, selectedVariant = null, quantity = 1) => {
    const variantSku = selectedVariant?.sku || '';
    const instantItem = {
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0]?.url || product.images?.[0] || '',
      price: selectedVariant?.salePrice || selectedVariant?.price || product.salePrice || product.price,
      variantSku,
      variantTitle: selectedVariant?.title || '',
      quantity: Math.max(1, Number(quantity) || 1),
    };

    setInstantCheckoutItem(instantItem);
    try {
      sessionStorage.setItem('jayrup_instant_checkout', JSON.stringify(instantItem));
    } catch (err) {
      console.error('Could not save instant checkout item to sessionStorage', err);
    }
    return instantItem;
  };

  const clearInstantCheckout = () => {
    setInstantCheckoutItem(null);
    try {
      sessionStorage.removeItem('jayrup_instant_checkout');
    } catch (err) {
      console.error(err);
    }
  };

  // Complete checkout: If instant checkout, remove ONLY this product from the cart; otherwise clear entire cart
  const completeOrder = (isInstant = false) => {
    if (isInstant && instantCheckoutItem) {
      removeFromCart(instantCheckoutItem.productId, instantCheckoutItem.variantSku);
      clearInstantCheckout();
    } else {
      clearCart();
    }
  };

  const applyCoupon = (code) => {
    setCouponCode(code.trim().toUpperCase());
  };

  const removeCoupon = () => {
    setCouponCode('');
  };

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        couponCode,
        applyCoupon,
        removeCoupon,
        cartCalculation,
        isCalculating,
        totalItemCount,
        isCartOpen,
        setIsCartOpen,
        recalculate,
        // Instant Checkout API
        instantCheckoutItem,
        setInstantCheckout,
        clearInstantCheckout,
        completeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
