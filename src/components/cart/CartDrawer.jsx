import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

export const CartDrawer = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartCalculation,
    isCalculating,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    applyCoupon(inputCoupon.trim());
    setInputCoupon('');
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-noir-card border-l border-gold/30 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold" />
              <h3 className="font-serif text-base uppercase tracking-widest text-zinc-100 font-semibold">
                Royal Shopping Bag
              </h3>
              <span className="text-xs text-gold/80 font-sans">
                ({items.reduce((s, i) => s + i.quantity, 0)})
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-zinc-400 hover:text-gold p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20 text-zinc-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
                <p className="font-serif text-sm uppercase tracking-wider text-zinc-400">
                  Your shopping bag is empty
                </p>
                <p className="text-xs mt-1">Discover our royal perfumes & skincare creations.</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="mt-6 btn-outline-gold text-[10px] py-2.5 px-6"
                >
                  Explore Creations
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantSku}`}
                  className="flex gap-4 p-3 bg-noir border border-gold/15 relative"
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=200'}
                    alt={item.name}
                    className="w-16 h-16 object-cover bg-zinc-900 border border-zinc-800"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-xs font-semibold text-zinc-100 truncate">
                      {item.name}
                    </h4>

                    {item.variantTitle && (
                      <span className="inline-block text-[10px] text-gold/80 tracking-wider font-sans">
                        Size: {item.variantTitle}
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-zinc-200">
                        ₹{item.price * item.quantity}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-zinc-800 bg-noir-card">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.variantSku, item.quantity - 1)}
                          className="px-2 py-1 text-zinc-400 hover:text-gold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-medium text-zinc-200">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.variantSku, item.quantity + 1)}
                          className="px-2 py-1 text-zinc-400 hover:text-gold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId, item.variantSku)}
                    className="text-zinc-600 hover:text-red-400 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-zinc-800 bg-noir/90 space-y-4">
              {/* Coupon Applicator */}
              <div className="border border-gold/20 p-2.5 bg-noir-card">
                {cartCalculation?.coupon ? (
                  <div className="flex items-center justify-between text-xs text-gold">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code <strong>{cartCalculation.coupon.code}</strong> Applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-400 hover:underline text-[10px] uppercase font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      placeholder="Coupon Code (e.g. ROYAL10)"
                      className="flex-1 bg-noir border border-zinc-800 px-3 py-1.5 text-xs text-white uppercase placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                    />
                    <button type="submit" className="btn-outline-gold py-1.5 px-3 text-[10px]">
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Server-recalculated Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>₹{cartCalculation.subtotal || 0}</span>
                </div>

                {cartCalculation.discount > 0 && (
                  <div className="flex justify-between text-gold">
                    <span>Royal Privilege Discount</span>
                    <span>-₹{cartCalculation.discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span>
                    {cartCalculation.shipping === 0 ? (
                      <strong className="text-emerald-400 font-normal">COMPLIMENTARY</strong>
                    ) : (
                      `₹${cartCalculation.shipping}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-zinc-100 pt-2 border-t border-zinc-800">
                  <span>Final Total</span>
                  <span className="text-gold font-sans text-base">
                    ₹{cartCalculation.total || 0}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckoutClick}
                disabled={isCalculating}
                className="w-full btn-gold py-3 text-xs flex items-center justify-center gap-2 group"
              >
                <span>{isCalculating ? 'Recalculating...' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
