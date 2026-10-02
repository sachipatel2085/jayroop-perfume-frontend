import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { SEOHead } from '../components/common/SEOHead.jsx';

export const CartPage = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCalculation,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = React.useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon.trim());
      setInputCoupon('');
    }
  };

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      <SEOHead title="Your Royal Shopping Bag" />

      <div className="border-b border-gold/20 pb-6 mb-8 text-center sm:text-left">
        <h1 className="font-serif text-2xl sm:text-4xl uppercase tracking-wider text-zinc-100 font-semibold">
          Your Royal Bag
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review your selected extraits and botanical preparations
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 bg-noir-card border border-zinc-800 p-8">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
          <h3 className="font-serif text-lg uppercase tracking-wider text-zinc-300 mb-2">
            Your Bag is Empty
          </h3>
          <p className="text-xs text-zinc-500 mb-6">
            Discover our royal collections distilled for timeless distinction.
          </p>
          <Link to="/shop" className="btn-gold text-xs py-3 px-8">
            Explore Treasury
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items Table */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantSku}`}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-noir-card border border-gold/15"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover bg-zinc-900 border border-zinc-800 flex-shrink-0"
                  />
                  <div>
                    <Link
                      to={`/products/${item.slug}`}
                      className="font-serif text-sm font-semibold text-zinc-100 hover:text-gold transition-colors"
                    >
                      {item.name}
                    </Link>
                    {item.variantTitle && (
                      <p className="text-xs text-gold/80 mt-0.5">
                        Size: {item.variantTitle}
                      </p>
                    )}
                    <p className="text-xs font-bold text-zinc-300 mt-1">
                      ₹{item.price} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 border-zinc-800/80 pt-3 sm:pt-0">
                  {/* Quantity picker */}
                  <div className="flex items-center border border-zinc-800 bg-noir">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantSku, item.quantity - 1)}
                      className="px-2.5 py-1 text-zinc-400 hover:text-gold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-bold text-zinc-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantSku, item.quantity + 1)}
                      className="px-2.5 py-1 text-zinc-400 hover:text-gold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-sm font-bold text-zinc-100 min-w-16 text-right">
                    ₹{item.price * item.quantity}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.productId, item.variantSku)}
                    className="text-zinc-600 hover:text-red-400 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={clearCart}
                className="text-xs text-zinc-500 hover:text-red-400 uppercase tracking-wider"
              >
                Clear Entire Bag
              </button>
              <Link to="/shop" className="text-xs text-gold hover:text-white uppercase tracking-wider font-semibold">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary & Checkout Box */}
          <div className="bg-noir-card border border-gold/25 p-6 h-fit space-y-6">
            <h3 className="font-serif text-base uppercase tracking-widest text-gold font-semibold border-b border-zinc-800 pb-3">
              Privilege Summary
            </h3>

            {/* Coupon Application */}
            <div>
              {cartCalculation?.coupon ? (
                <div className="flex items-center justify-between text-xs text-gold bg-noir p-3 border border-gold/30">
                  <span>Code <strong>{cartCalculation.coupon.code}</strong> Applied</span>
                  <button onClick={removeCoupon} className="text-red-400 hover:underline text-[10px] uppercase font-bold">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Coupon Code"
                    className="flex-1 bg-noir border border-zinc-800 px-3 py-2 text-xs uppercase placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                  />
                  <button type="submit" className="btn-outline-gold py-2 px-3 text-[10px]">
                    Apply
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-2.5 text-xs border-t border-zinc-800 pt-4">
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

              <div className="flex justify-between text-base font-bold text-zinc-100 pt-3 border-t border-zinc-800">
                <span>Final Amount</span>
                <span className="text-gold font-sans text-lg">
                  ₹{cartCalculation.total || 0}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-gold py-3.5 text-xs flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-2 text-[10px] text-zinc-500 text-center flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Razorpay Secured Bank-Grade Checkout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
