import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Truck,
  ChevronRight,
  Banknote,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Lock,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { paymentService } from '../services/paymentService.js';
import { orderService } from '../services/orderService.js';
import { RazorpayPaymentModal } from '../components/checkout/RazorpayPaymentModal.jsx';
import { SEOHead } from '../components/common/SEOHead.jsx';

export const CheckoutPage = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    items,
    cartCalculation,
    couponCode,
    clearCart,
    instantCheckoutItem,
    completeOrder,
  } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isInstantMode = searchParams.get('mode') === 'instant' && !!instantCheckoutItem;
  const activeItems = isInstantMode ? [instantCheckoutItem] : items;

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

  // Store Configuration Settings (e.g. COD enabled/disabled by Admin)
  const [storeSettings, setStoreSettings] = useState({
    codEnabled: true,
    codExtraFee: 0,
    codMinOrderAmount: 0,
    codMaxOrderAmount: 50000,
    onlinePaymentEnabled: true,
  });
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Payment Selection: 'ONLINE' or 'COD'
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [codSubmitting, setCodSubmitting] = useState(false);
  const [codError, setCodError] = useState(null);

  // Fetch Public Store Settings (COD status)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoadingSettings(true);
        const data = await paymentService.getPublicSettings();
        if (data) {
          setStoreSettings({
            codEnabled: data.codEnabled !== false,
            codExtraFee: data.codExtraFee || 0,
            codMinOrderAmount: data.codMinOrderAmount || 0,
            codMaxOrderAmount: data.codMaxOrderAmount || 50000,
            onlinePaymentEnabled: data.onlinePaymentEnabled !== false,
          });

          // If COD is disabled by admin, enforce online payment
          if (data.codEnabled === false) {
            setPaymentMethod('ONLINE');
          }
        }
      } catch (err) {
        console.warn('Could not load store configuration settings', err);
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchSettings();
  }, []);

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

  // Dynamic calculation for Instant Checkout
  const [instantCalculation, setInstantCalculation] = useState(null);

  useEffect(() => {
    if (isInstantMode && instantCheckoutItem) {
      const calc = async () => {
        try {
          const res = await orderService.calculateCart([instantCheckoutItem], couponCode);
          setInstantCalculation(res);
        } catch (err) {
          console.warn('Instant cart calculation failed, using fallback', err);
          const subtotal = instantCheckoutItem.price * instantCheckoutItem.quantity;
          const shipping = subtotal >= 999 ? 0 : 99;
          setInstantCalculation({
            subtotal,
            discount: 0,
            shipping,
            total: subtotal + shipping,
            items: [instantCheckoutItem],
          });
        }
      };
      calc();
    }
  }, [isInstantMode, instantCheckoutItem, couponCode]);

  const effectiveCalculation = isInstantMode
    ? (instantCalculation || {
        subtotal: instantCheckoutItem.price * instantCheckoutItem.quantity,
        discount: 0,
        shipping: (instantCheckoutItem.price * instantCheckoutItem.quantity) >= 999 ? 0 : 99,
        total: (instantCheckoutItem.price * instantCheckoutItem.quantity) + ((instantCheckoutItem.price * instantCheckoutItem.quantity) >= 999 ? 0 : 99),
        items: [instantCheckoutItem],
      })
    : cartCalculation;

  if (activeItems.length === 0) {
    return (
      <div className="bg-noir min-h-screen py-24 text-center px-4">
        <h2 className="font-serif text-xl uppercase tracking-wider text-zinc-300 mb-4">
          {searchParams.get('mode') === 'instant'
            ? 'Instant Checkout Session Expired'
            : 'Your Royal Bag is Empty'}
        </h2>
        <p className="text-zinc-500 text-xs mb-6">
          {searchParams.get('mode') === 'instant'
            ? 'Please choose a creation from our treasury to initiate an instant checkout.'
            : 'Discover exquisite creations from the Jayrup Haute Parfumerie Treasury.'}
        </p>
        <Link to="/shop" className="btn-gold text-xs py-3 px-8">
          Explore Treasury
        </Link>
      </div>
    );
  }

  const isAddressComplete = Boolean(
    address.fullName &&
      address.phone &&
      address.addressLine1 &&
      address.city &&
      address.state &&
      address.postalCode
  );

  // COD Eligibility checks
  const isCodEligibleByMin =
    storeSettings.codMinOrderAmount === 0 ||
    effectiveCalculation.subtotal >= storeSettings.codMinOrderAmount;
  const isCodEligibleByMax =
    storeSettings.codMaxOrderAmount === 0 ||
    effectiveCalculation.subtotal <= storeSettings.codMaxOrderAmount;
  const isCodAllowed = storeSettings.codEnabled && isCodEligibleByMin && isCodEligibleByMax;

  // Total calculation including COD handling fee if selected
  const codFee = paymentMethod === 'COD' ? storeSettings.codExtraFee || 0 : 0;
  const finalTotal = (effectiveCalculation.total || 0) + codFee;

  const checkoutPayload = {
    items: activeItems.map((i) => ({
      productId: i.productId,
      variantSku: i.variantSku,
      quantity: i.quantity,
    })),
    shippingAddress: address,
    couponCode: couponCode || undefined,
  };

  // Place Cash on Delivery order
  const handlePlaceCodOrder = async () => {
    if (!isAddressComplete) return;

    try {
      setCodSubmitting(true);
      setCodError(null);

      const res = await paymentService.createCodOrder(checkoutPayload);
      const orderNumber = res?.data?.orderNumber || res?.orderNumber;

      completeOrder(isInstantMode);
      navigate(`/order-success/${orderNumber}`);
    } catch (err) {
      setCodError(err.message || 'Failed to place Cash on Delivery order. Please try again.');
    } finally {
      setCodSubmitting(false);
    }
  };

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-10 px-4 sm:px-8 max-w-7xl mx-auto">
      <SEOHead title={isInstantMode ? "Instant Royal Checkout" : "Royal Checkout & Gateway"} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500 mb-6">
        <Link
          to={isInstantMode && instantCheckoutItem?.slug ? `/product/${instantCheckoutItem.slug}` : "/cart"}
          className="hover:text-gold transition-colors"
        >
          {isInstantMode ? 'Product' : 'Bag'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gold font-medium">
          {isInstantMode ? 'Instant Royal Checkout' : 'Secured Checkout'}
        </span>
      </nav>

      {/* Instant Checkout Notice Banner */}
      {isInstantMode && (
        <div className="mb-8 p-4 bg-gold/10 border border-gold/30 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold/20 rounded-full text-gold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gold">
                Instant Royal Checkout Mode
              </p>
              <p className="text-[11px] text-zinc-400">
                Purchasing exclusively: <span className="text-zinc-200 font-semibold">{instantCheckoutItem.name}</span>. Any other treasures in your bag remain preserved.
              </p>
            </div>
          </div>
          {items.length > 0 && (
            <Link
              to="/checkout"
              className="text-[11px] uppercase tracking-wider text-gold hover:underline whitespace-nowrap self-start sm:self-auto font-medium"
            >
              Checkout Full Bag ({items.length} {items.length === 1 ? 'item' : 'items'}) &rarr;
            </Link>
          )}
        </div>
      )}

      <div className="border-b border-gold/20 pb-4 mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-zinc-100 font-semibold">
          {isInstantMode ? 'Instant Royal Checkout' : 'Royal Checkout Concierge'}
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

        {/* Right Column: Order Review & Payment Selection */}
        <div className="space-y-6">
          <div className="p-6 bg-noir-card border border-gold/25 space-y-5 shadow-2xl">
            <h3 className="font-serif text-sm uppercase tracking-wider text-gold font-semibold border-b border-zinc-800 pb-3">
              Order Review & Summary
            </h3>

            {/* Item Thumbnails */}
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {activeItems.map((item) => (
                <div
                  key={`${item.productId}-${item.variantSku || 'default'}`}
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

            {/* PAYMENT METHOD SELECTION */}
            <div className="border-t border-zinc-800 pt-4 space-y-3">
              <label className="block text-zinc-400 uppercase tracking-wider text-[10px] font-semibold">
                Select Payment Mode:
              </label>

              {/* Option 1: Online Payment (Razorpay) */}
              <button
                type="button"
                onClick={() => setPaymentMethod('ONLINE')}
                className={`w-full p-3.5 border rounded text-left transition-all flex items-start gap-3 ${
                  paymentMethod === 'ONLINE'
                    ? 'border-gold bg-gold/10 shadow-gold-glow'
                    : 'border-zinc-800 bg-noir hover:border-zinc-700'
                }`}
              >
                <div className={`p-1.5 rounded-full mt-0.5 ${
                  paymentMethod === 'ONLINE' ? 'bg-gold text-black' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-zinc-100">
                      Online Payment (Instant & Secure)
                    </span>
                    <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Zero Surcharge
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    UPI (Google Pay, PhonePe, Paytm), RuPay, Visa, Mastercard, NetBanking via Razorpay.
                  </p>
                </div>
              </button>

              {/* Option 2: Cash on Delivery (COD) */}
              {storeSettings.codEnabled ? (
                <button
                  type="button"
                  disabled={!isCodAllowed}
                  onClick={() => isCodAllowed && setPaymentMethod('COD')}
                  className={`w-full p-3.5 border rounded text-left transition-all flex items-start gap-3 ${
                    paymentMethod === 'COD'
                      ? 'border-gold bg-gold/10 shadow-gold-glow'
                      : isCodAllowed
                      ? 'border-zinc-800 bg-noir hover:border-zinc-700'
                      : 'border-zinc-800/50 bg-noir/50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className={`p-1.5 rounded-full mt-0.5 ${
                    paymentMethod === 'COD' ? 'bg-gold text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-zinc-100">
                        Cash on Delivery (COD)
                      </span>
                      {storeSettings.codExtraFee > 0 ? (
                        <span className="text-[9px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          +₹{storeSettings.codExtraFee} Fee
                        </span>
                      ) : (
                        <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          Free COD
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Pay with cash or UPI to the delivery courier when your order arrives.
                    </p>
                    {!isCodEligibleByMin && (
                      <p className="text-[10px] text-amber-400 mt-1">
                        Minimum order of ₹{storeSettings.codMinOrderAmount} required for COD.
                      </p>
                    )}
                    {!isCodEligibleByMax && (
                      <p className="text-[10px] text-amber-400 mt-1">
                        Orders above ₹{storeSettings.codMaxOrderAmount} must be paid online.
                      </p>
                    )}
                  </div>
                </button>
              ) : (
                <div className="p-3 bg-noir border border-zinc-800 rounded flex items-center gap-2.5 text-zinc-500 text-xs">
                  <Banknote className="w-4 h-4 opacity-50 flex-shrink-0" />
                  <div>
                    <span className="font-semibold block text-zinc-400 text-[11px]">
                      Cash on Delivery is currently unavailable
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Store admin has disabled COD. Please select Instant Online Payment.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs border-t border-zinc-800 pt-4">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>₹{effectiveCalculation.subtotal || 0}</span>
              </div>

              {effectiveCalculation.discount > 0 && (
                <div className="flex justify-between text-gold">
                  <span>Privilege Discount ({effectiveCalculation.coupon?.code || 'Applied'})</span>
                  <span>-₹{effectiveCalculation.discount}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-400">
                <span>Insured Express Shipping</span>
                <span>
                  {effectiveCalculation.shipping === 0 ? (
                    <strong className="text-emerald-400 font-normal">COMPLIMENTARY</strong>
                  ) : (
                    `₹${effectiveCalculation.shipping}`
                  )}
                </span>
              </div>

              {paymentMethod === 'COD' && storeSettings.codExtraFee > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>COD Handling Surcharge</span>
                  <span>₹{storeSettings.codExtraFee}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold text-zinc-100 pt-3 border-t border-zinc-800">
                <span>Total to Pay</span>
                <span className="text-gold font-sans text-lg">
                  ₹{finalTotal}
                </span>
              </div>
            </div>

            {/* Payment Execution Trigger */}
            <div className="pt-2">
              {paymentMethod === 'ONLINE' ? (
                <div>
                  <RazorpayPaymentModal
                    checkoutData={checkoutPayload}
                    disabled={!isAddressComplete}
                    onSuccess={(orderNumber) => {
                      completeOrder(isInstantMode);
                      navigate(`/order-success/${orderNumber}`);
                    }}
                  />
                  {!isAddressComplete && (
                    <p className="text-[11px] text-zinc-500 text-center mt-2">
                      Please complete required address fields above to unlock payment.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {codError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{codError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handlePlaceCodOrder}
                    disabled={!isAddressComplete || codSubmitting}
                    className="w-full btn-gold py-4 text-xs tracking-[0.2em] font-bold flex items-center justify-center gap-2 shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Truck className="w-4 h-4" />
                    <span>
                      {codSubmitting
                        ? 'Confirming Royal COD Order...'
                        : 'Confirm Cash on Delivery Order'}
                    </span>
                  </button>

                  {!isAddressComplete && (
                    <p className="text-[11px] text-zinc-500 text-center">
                      Please complete required address fields above to confirm order.
                    </p>
                  )}

                  <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                    <ShieldCheck className="w-4 h-4 text-gold" />
                    <span>Zero Advance Risk • Pay Cash/UPI Upon Parcel Delivery</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
