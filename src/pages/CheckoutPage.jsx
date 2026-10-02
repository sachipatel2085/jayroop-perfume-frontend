import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Truck, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { RazorpayPaymentModal } from '../components/checkout/RazorpayPaymentModal.jsx';
import { SEOHead } from '../components/common/SEOHead.jsx';

export const CheckoutPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { items, cartCalculation, couponCode } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  // Pre-fill default address if user has saved addresses
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setAddress({
        fullName: defaultAddr.fullName,
        phone: defaultAddr.phone,
        addressLine1: defaultAddr.addressLine1,
        addressLine2: defaultAddr.addressLine2 || '',
        city: defaultAddr.city,
        state: defaultAddr.state,
        postalCode: defaultAddr.postalCode,
        country: defaultAddr.country || 'India',
      });
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="bg-noir min-h-screen py-24 text-center px-4">
        <h2 className="font-serif text-xl uppercase tracking-wider text-zinc-300 mb-4">
          Your Royal Bag is Empty
        </h2>
        <Link to="/shop" className="btn-gold text-xs py-3 px-8">
          Explore Treasury
        </Link>
      </div>
    );
  }

  const isAddressComplete =
    Boolean(address.fullName &&
    address.phone &&
    address.addressLine1 &&
    address.city &&
    address.state &&
    address.postalCode);

  const checkoutPayload = {
    items: items.map((i) => ({
      productId: i.productId,
      variantSku: i.variantSku,
      quantity: i.quantity,
    })),
    shippingAddress: address,
    couponCode: couponCode || undefined,
  };

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-10 px-4 sm:px-8 max-w-7xl mx-auto">
      <SEOHead title="Royal Checkout & Gateway" />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500 mb-6">
        <Link to="/cart" className="hover:text-gold transition-colors">Bag</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gold font-medium">Secured Checkout</span>
      </nav>

      <div className="border-b border-gold/20 pb-4 mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-zinc-100 font-semibold">
          Royal Checkout Concierge
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Complimentary insured transit to your residence
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Delivery Address Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-noir-card border border-gold/20 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <MapPin className="w-4 h-4 text-gold" />
              <h3 className="font-serif text-sm uppercase tracking-wider text-gold font-semibold">
                Delivery Residence & Recipient
              </h3>
            </div>

            {/* Saved Address Quick Selector if logged in */}
            {user?.addresses && user.addresses.length > 1 && (
              <div className="mb-4">
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1.5">
                  Select from Saved Addresses:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {user.addresses.map((a, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAddress(a)}
                      className={`p-3 text-left border transition-all ${
                        address.addressLine1 === a.addressLine1
                          ? 'border-gold bg-gold/10'
                          : 'border-zinc-800 bg-noir'
                      }`}
                    >
                      <p className="font-bold text-zinc-200">{a.fullName}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{a.addressLine1}, {a.city}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  placeholder="e.g. Maharaja Rohan Sharma"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Address Line 1 (Villa/Flat, Building, Street) *
                </label>
                <input
                  type="text"
                  required
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  placeholder="e.g. Royal Palm Residency, 4th Avenue"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Address Line 2 (Landmark, Sector)
                </label>
                <input
                  type="text"
                  value={address.addressLine2}
                  onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                  placeholder="e.g. Near Royal Club"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="e.g. Mumbai"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="e.g. Maharashtra"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Postal PIN Code *
                </label>
                <input
                  type="text"
                  required
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  placeholder="e.g. 400065"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Country
                </label>
                <input
                  type="text"
                  disabled
                  value={address.country}
                  className="w-full bg-noir/50 border border-zinc-800/50 p-2.5 text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Razorpay Trigger */}
        <div className="space-y-6">
          <div className="p-6 bg-noir-card border border-gold/25 space-y-5">
            <h3 className="font-serif text-sm uppercase tracking-wider text-gold font-semibold border-b border-zinc-800 pb-3">
              Order Review & Summary
            </h3>

            {/* Item Thumbnails */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantSku}`}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover border border-zinc-800"
                    />
                    <div>
                      <p className="font-semibold text-zinc-200 line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-zinc-500">
                        Qty: {item.quantity} {item.variantTitle && `• ${item.variantTitle}`}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-zinc-300">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs border-t border-zinc-800 pt-4">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>₹{cartCalculation.subtotal || 0}</span>
              </div>

              {cartCalculation.discount > 0 && (
                <div className="flex justify-between text-gold">
                  <span>Privilege Discount ({cartCalculation.coupon?.code})</span>
                  <span>-₹{cartCalculation.discount}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-400">
                <span>Insured Express Shipping</span>
                <span>
                  {cartCalculation.shipping === 0 ? (
                    <strong className="text-emerald-400 font-normal">COMPLIMENTARY</strong>
                  ) : (
                    `₹${cartCalculation.shipping}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-zinc-100 pt-3 border-t border-zinc-800">
                <span>Total to Pay</span>
                <span className="text-gold font-sans text-lg">
                  ₹{cartCalculation.total || 0}
                </span>
              </div>
            </div>

            {/* Razorpay Gateway Payment Component */}
            <div className="pt-2">
              <RazorpayPaymentModal
                checkoutData={checkoutPayload}
                disabled={!isAddressComplete}
              />
              {!isAddressComplete && (
                <p className="text-[11px] text-zinc-500 text-center mt-2">
                  Please complete required address fields above to unlock payment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
