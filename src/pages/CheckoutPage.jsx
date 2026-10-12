import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Truck,
  ChevronRight,
  Banknote,
  Smartphone,
  Lock,
  Zap,
  Tag,
  Building2,
  ChevronDown,
  CheckCircle2,
  BadgePercent,
  CreditCard,
  Landmark,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { paymentService } from '../services/paymentService.js';
import { orderService } from '../services/orderService.js';
import { SEO } from '../components/seo/SEO.jsx';
import { Input, Select, Card, Alert, Spinner } from '../components/ui/Field.jsx';
import { INDIA_STATES, formatINR } from '../config/site.js';

const emptyAddress = (user) => ({
  fullName: user?.name || '',
  phone: (user?.phone || '').replace(/\D/g, '').slice(-10),
  email: user?.email || '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: 'Gujarat',
  postalCode: '',
  country: 'India',
});

const validate = (a) => {
  const e = {};
  if (!a.fullName?.trim()) e.fullName = 'Enter the recipient name';
  if (!/^[6-9]\d{9}$/.test(String(a.phone).replace(/\D/g, '').slice(-10))) e.phone = 'Enter a valid 10-digit mobile number';
  if (!a.addressLine1?.trim() || a.addressLine1.trim().length < 6) e.addressLine1 = 'Enter house / flat no. and street';
  if (!a.city?.trim()) e.city = 'Enter city';
  if (!a.state) e.state = 'Select state';
  if (!/^[1-9][0-9]{5}$/.test(String(a.postalCode).trim())) e.postalCode = 'Enter a valid 6-digit PIN code';
  return e;
};

export const CheckoutPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { items, couponCode, applyCoupon, removeCoupon, instantCheckoutItem, completeOrder } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isInstantMode = searchParams.get('mode') === 'instant' && !!instantCheckoutItem;
  const activeItems = useMemo(() => (isInstantMode ? [instantCheckoutItem] : items), [isInstantMode, instantCheckoutItem, items]);

  const [address, setAddress] = useState(() => emptyAddress(user));
  const [touched, setTouched] = useState({});
  const [saveAddress, setSaveAddress] = useState(true);
  const [showGst, setShowGst] = useState(false);
  const [billing, setBilling] = useState({ gstin: '', businessName: '' });
  const [customerNote, setCustomerNote] = useState('');
  const [couponInput, setCouponInput] = useState(couponCode || '');

  const [settings, setSettings] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [calc, setCalc] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [agree, setAgree] = useState(true);

  // Store settings (COD rules, PhonePe availability, shipping)
  useEffect(() => {
    paymentService
      .getPublicSettings()
      .then((s) => {
        setSettings(s);
        if (s && !s.onlinePaymentEnabled && s.codEnabled) setPaymentMethod('COD');
      })
      .catch(() => setSettings({ codEnabled: true, onlinePaymentEnabled: true }));
  }, []);

  // Prefill from default saved address
  useEffect(() => {
    if (user?.addresses?.length) {
      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setAddress((prev) => ({ ...prev, ...def, email: prev.email || user.email, phone: String(def.phone || '').replace(/\D/g, '').slice(-10) }));
      setSaveAddress(false);
    } else if (user) {
      setAddress((prev) => ({ ...prev, fullName: prev.fullName || user.name || '', email: prev.email || user.email || '' }));
    }
  }, [user]);

  // Server-side price calculation (includes COD fee when COD is selected)
  useEffect(() => {
    if (!activeItems.length) return;
    let alive = true;
    setCalcLoading(true);
    orderService
      .calculateCart(
        activeItems.map((i) => ({ productId: i.productId, variantSku: i.variantSku, quantity: i.quantity, name: i.name })),
        couponCode,
        paymentMethod
      )
      .then((res) => alive && setCalc(res))
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setCalcLoading(false));
    return () => {
      alive = false;
    };
  }, [activeItems, couponCode, paymentMethod]);

  const errors = validate(address);
  const isAddressValid = Object.keys(errors).length === 0;
  const fieldError = (k) => (touched[k] || touched.__all ? errors[k] : undefined);
  const setField = (k) => (e) => setAddress((a) => ({ ...a, [k]: e.target.value }));
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const subtotal = calc?.subtotal || 0;
  const codAllowed =
    settings?.codEnabled &&
    (!settings.codMinOrderAmount || subtotal >= settings.codMinOrderAmount) &&
    (!settings.codMaxOrderAmount || subtotal <= settings.codMaxOrderAmount);
  const onlineAllowed = settings?.onlinePaymentEnabled !== false;
  const stockErrors = (calc?.errors || []).filter((e) => !e.startsWith('Coupon') && !e.startsWith('Invalid coupon'));
  const couponError = (calc?.errors || []).find((e) => e.startsWith('Coupon') || e.startsWith('Invalid coupon'));

  useEffect(() => {
    if (settings && paymentMethod === 'COD' && !codAllowed && onlineAllowed) setPaymentMethod('ONLINE');
  }, [settings, codAllowed, onlineAllowed, paymentMethod]);

  if (authLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner className="w-8 h-8" /></div>;

  if (!activeItems.length) {
    return (
      <div className="bg-noir min-h-[70vh] py-24 text-center px-4">
        <SEO title="Checkout" searchIndexing="NOINDEX_NOFOLLOW" />
        <h1 className="font-serif text-xl uppercase tracking-wider text-zinc-300 mb-3">Your bag is empty</h1>
        <p className="text-zinc-500 text-sm mb-6">Add products to your bag to checkout.</p>
        <Link to="/shop" className="btn-gold">Continue Shopping</Link>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-noir min-h-[70vh] py-20 px-4">
        <SEO title="Checkout – Sign in" searchIndexing="NOINDEX_NOFOLLOW" />
        <div className="max-w-md mx-auto bg-noir-card border border-gold/25 rounded-2xl p-8 text-center space-y-5">
          <Lock className="w-10 h-10 text-gold mx-auto" />
          <h1 className="font-serif text-xl uppercase tracking-wider text-zinc-100">Sign in to checkout</h1>
          <p className="text-sm text-zinc-400">
            An account lets you track orders, download GST invoices and reorder in one tap. It takes less than a minute.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} className="btn-gold">Sign In</Link>
            <Link to={`/register?redirect=${encodeURIComponent(location.pathname + location.search)}`} className="btn-outline-gold">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) applyCoupon(couponInput);
  };

  const handlePlaceOrder = async () => {
    setTouched({ __all: true });
    setError(null);
    if (!isAddressValid) {
      setError('Please complete your delivery details.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!agree) {
      setError('Please accept the Terms and Refund Policy to continue.');
      return;
    }
    if (stockErrors.length) {
      setError(stockErrors.join(' '));
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        items: activeItems.map((i) => ({ productId: i.productId, variantSku: i.variantSku, quantity: i.quantity, name: i.name })),
        shippingAddress: { ...address, phone: String(address.phone).replace(/\D/g, '').slice(-10) },
        couponCode: couponError ? undefined : couponCode || undefined,
        paymentMethod,
        billingDetails: showGst ? billing : undefined,
        customerNote,
        saveAddress,
      };
      const res = await paymentService.checkout(payload);

      if (paymentMethod === 'COD') {
        completeOrder(isInstantMode);
        navigate(`/order-success/${res.orderNumber}`, { replace: true });
        return;
      }
      if (!res?.redirectUrl) throw new Error('Could not start PhonePe payment. Please try again.');
      try {
        sessionStorage.setItem('jayrup_pending_payment', JSON.stringify({ orderNumber: res.orderNumber, instant: isInstantMode }));
      } catch {
        /* ignore */
      }
      window.location.assign(res.redirectUrl);
    } catch (err) {
      setError(err.message || 'Could not place your order. Please try again.');
      setSubmitting(false);
    }
  };

  const total = calc?.total ?? 0;

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-8 px-4 sm:px-8 max-w-7xl mx-auto">
      <SEO title="Secure Checkout" searchIndexing="NOINDEX_NOFOLLOW" />

      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500 mb-6" aria-label="Breadcrumb">
        <Link to={isInstantMode && instantCheckoutItem?.slug ? `/products/${instantCheckoutItem.slug}` : '/cart'} className="hover:text-gold">
          {isInstantMode ? 'Product' : 'Bag'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gold">Checkout</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span>Payment</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-gold/20 pb-5 mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider font-semibold">Secure Checkout</h1>
          <p className="text-xs text-zinc-400 mt-1">Encrypted payments via PhonePe · Cash on Delivery available</p>
        </div>
        {isInstantMode && (
          <div className="flex items-center gap-2 text-xs text-gold bg-gold/10 border border-gold/30 rounded-full px-3 py-1.5">
            <Zap className="w-3.5 h-3.5" /> Buy Now – only “{instantCheckoutItem.name}”
          </div>
        )}
      </div>

      {error && <Alert className="mb-6">{error}</Alert>}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* ───────── Left ───────── */}
        <div className="space-y-6">
          <Card title="Delivery Address" icon={MapPin}>
            {user?.addresses?.length > 0 && (
              <div className="mb-5">
                <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-2">Saved addresses</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {user.addresses.map((a) => {
                    const selected = address.addressLine1 === a.addressLine1 && address.postalCode === a.postalCode;
                    return (
                      <button
                        key={a._id}
                        type="button"
                        onClick={() => setAddress((prev) => ({ ...prev, ...a, phone: String(a.phone).replace(/\D/g, '').slice(-10) }))}
                        className={`text-left p-3 rounded-lg border transition-all ${selected ? 'border-gold bg-gold/10' : 'border-zinc-800 hover:border-zinc-600'}`}
                      >
                        <span className="flex items-center justify-between text-sm font-semibold text-zinc-100">
                          {a.fullName}
                          {selected && <CheckCircle2 className="w-4 h-4 text-gold" />}
                        </span>
                        <span className="block text-xs text-zinc-400 mt-0.5 line-clamp-2">
                          {a.addressLine1}, {a.city}, {a.state} – {a.postalCode}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full name" required name="fullName" autoComplete="name" value={address.fullName} onChange={setField('fullName')} onBlur={blur('fullName')} error={fieldError('fullName')} />
              <Input
                label="Mobile number"
                required
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                placeholder="10-digit mobile"
                value={address.phone}
                onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                onBlur={blur('phone')}
                error={fieldError('phone')}
                hint="For delivery updates"
              />
              <Input className="sm:col-span-2" label="House / Flat no., Building, Street" required name="addressLine1" autoComplete="address-line1" value={address.addressLine1} onChange={setField('addressLine1')} onBlur={blur('addressLine1')} error={fieldError('addressLine1')} />
              <Input className="sm:col-span-2" label="Area, Landmark (optional)" name="addressLine2" autoComplete="address-line2" value={address.addressLine2} onChange={setField('addressLine2')} />
              <Input
                label="PIN code"
                required
                name="postalCode"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                value={address.postalCode}
                onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                onBlur={blur('postalCode')}
                error={fieldError('postalCode')}
              />
              <Input label="City / Town" required name="city" autoComplete="address-level2" value={address.city} onChange={setField('city')} onBlur={blur('city')} error={fieldError('city')} />
              <Select label="State" required name="state" autoComplete="address-level1" value={address.state} onChange={setField('state')} error={fieldError('state')}>
                <option value="">Select state</option>
                {INDIA_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
              <Input label="E-mail (for invoice)" name="email" type="email" autoComplete="email" value={address.email} onChange={setField('email')} />
            </div>

            <label className="mt-4 flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
              <input type="checkbox" className="accent-[#D4AF37]" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
              Save this address to my account
            </label>
          </Card>

          <Card>
            <button type="button" onClick={() => setShowGst((v) => !v)} className="w-full flex items-center justify-between px-5 py-4 text-left">
              <span className="flex items-center gap-2 text-sm text-zinc-200">
                <Building2 className="w-4 h-4 text-gold" /> Need a GST invoice for your business? <span className="text-zinc-500 text-xs">(optional)</span>
              </span>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showGst ? 'rotate-180' : ''}`} />
            </button>
            {showGst && (
              <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="GSTIN" name="gstin" maxLength={15} placeholder="24ABCDE1234F1Z5" value={billing.gstin} onChange={(e) => setBilling((b) => ({ ...b, gstin: e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '') }))} />
                <Input label="Registered business name" name="businessName" value={billing.businessName} onChange={(e) => setBilling((b) => ({ ...b, businessName: e.target.value }))} />
                <p className="sm:col-span-2 text-[11px] text-zinc-500">Your GSTIN will be printed on the tax invoice so you can claim input tax credit.</p>
              </div>
            )}
          </Card>

          <Card title="Payment Method" icon={Lock}>
            <div className="space-y-3" role="radiogroup" aria-label="Payment method">
              <button
                type="button"
                role="radio"
                aria-checked={paymentMethod === 'ONLINE'}
                disabled={!onlineAllowed}
                onClick={() => setPaymentMethod('ONLINE')}
                className={`w-full p-4 rounded-xl border text-left transition-all flex gap-4 ${
                  paymentMethod === 'ONLINE' ? 'border-gold bg-gold/[0.08] shadow-gold-glow' : 'border-zinc-800 hover:border-zinc-600'
                } ${!onlineAllowed ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${paymentMethod === 'ONLINE' ? 'border-gold' : 'border-zinc-600'}`}>
                  {paymentMethod === 'ONLINE' && <span className="w-2.5 h-2.5 rounded-full bg-gold" />}
                </span>
                <span className="flex-1">
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-zinc-100">Pay online with PhonePe</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">Recommended</span>
                  </span>
                  <span className="block text-xs text-zinc-400 mt-1">UPI (PhonePe, GPay, Paytm, BHIM), Debit / Credit Cards, Net Banking</span>
                  <span className="mt-2 flex gap-3 text-zinc-500">
                    <Smartphone className="w-4 h-4" /><CreditCard className="w-4 h-4" /><Landmark className="w-4 h-4" />
                  </span>
                  {!onlineAllowed && <span className="block text-[11px] text-amber-300 mt-1">Online payment is temporarily unavailable.</span>}
                </span>
              </button>

              {settings?.codEnabled && (
                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentMethod === 'COD'}
                  disabled={!codAllowed}
                  onClick={() => codAllowed && setPaymentMethod('COD')}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex gap-4 ${
                    paymentMethod === 'COD' ? 'border-gold bg-gold/[0.08] shadow-gold-glow' : 'border-zinc-800 hover:border-zinc-600'
                  } ${!codAllowed ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-gold' : 'border-zinc-600'}`}>
                    {paymentMethod === 'COD' && <span className="w-2.5 h-2.5 rounded-full bg-gold" />}
                  </span>
                  <span className="flex-1">
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-zinc-100 flex items-center gap-2"><Banknote className="w-4 h-4 text-gold" />Cash on Delivery</span>
                      <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        {settings.codExtraFee > 0 ? `+${formatINR(settings.codExtraFee)} fee` : 'No extra fee'}
                      </span>
                    </span>
                    <span className="block text-xs text-zinc-400 mt-1">Pay by cash or UPI to the delivery partner.</span>
                    {settings.codMinOrderAmount > 0 && subtotal < settings.codMinOrderAmount && (
                      <span className="block text-[11px] text-amber-300 mt-1">COD available on orders above {formatINR(settings.codMinOrderAmount)}.</span>
                    )}
                    {settings.codMaxOrderAmount > 0 && subtotal > settings.codMaxOrderAmount && (
                      <span className="block text-[11px] text-amber-300 mt-1">COD available up to {formatINR(settings.codMaxOrderAmount)}. Please pay online.</span>
                    )}
                  </span>
                </button>
              )}
            </div>

            <div className="mt-5">
              <Input label="Order note (optional)" name="customerNote" maxLength={300} placeholder="Delivery instructions, landmark, preferred time…" value={customerNote} onChange={(e) => setCustomerNote(e.target.value)} />
            </div>
          </Card>
        </div>

        {/* ───────── Right: summary ───────── */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
          <Card title={`Order Summary (${activeItems.reduce((s, i) => s + i.quantity, 0)})`} icon={Tag}>
            <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {(calc?.items?.length ? calc.items : activeItems).map((item) => (
                <li key={`${item.product || item.productId}-${item.variant?.sku || item.variantSku || ''}`} className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-zinc-800 bg-noir flex-shrink-0">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />}
                    <span className="absolute -top-1 -right-1 bg-gold text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-100 font-medium line-clamp-2">{item.name}</p>
                    <p className="text-[11px] text-zinc-500">{item.variant?.title || item.variantTitle || ''}</p>
                    {item.inStock === false && <p className="text-[11px] text-red-400">Insufficient stock</p>}
                  </div>
                  <span className="text-sm font-semibold text-zinc-200">{formatINR(item.subtotal ?? item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <form onSubmit={handleApplyCoupon} className="mt-5 flex gap-2">
              <div className="relative flex-1">
                <BadgePercent className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  aria-label="Coupon code"
                  className="w-full bg-noir border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-sm uppercase tracking-wider focus:outline-none focus:border-gold"
                />
              </div>
              {couponCode && !couponError ? (
                <button type="button" onClick={() => { removeCoupon(); setCouponInput(''); }} className="px-4 rounded-lg border border-zinc-700 text-xs text-zinc-300 hover:text-white">Remove</button>
              ) : (
                <button type="submit" className="px-4 rounded-lg border border-gold/50 text-xs text-gold hover:bg-gold/10">Apply</button>
              )}
            </form>
            {couponError && <p className="text-[11px] text-red-400 mt-1.5">{couponError}</p>}
            {calc?.coupon && <p className="text-[11px] text-emerald-300 mt-1.5">“{calc.coupon.code}” applied – you save {formatINR(calc.discount)}</p>}

            <dl className="mt-5 space-y-2 text-sm border-t border-zinc-800 pt-4">
              <div className="flex justify-between text-zinc-400"><dt>Subtotal</dt><dd>{formatINR(calc?.subtotal)}</dd></div>
              {calc?.mrpTotal > calc?.subtotal && (
                <div className="flex justify-between text-emerald-300/90 text-xs"><dt>MRP savings</dt><dd>-{formatINR(calc.mrpTotal - calc.subtotal)}</dd></div>
              )}
              {calc?.discount > 0 && <div className="flex justify-between text-emerald-300"><dt>Coupon discount</dt><dd>-{formatINR(calc.discount)}</dd></div>}
              <div className="flex justify-between text-zinc-400">
                <dt className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" />Shipping</dt>
                <dd>{calc?.shipping ? formatINR(calc.shipping) : <span className="text-emerald-300">FREE</span>}</dd>
              </div>
              {calc?.codFee > 0 && <div className="flex justify-between text-amber-300"><dt>COD handling</dt><dd>{formatINR(calc.codFee)}</dd></div>}
              {calc?.amountToFreeShipping > 0 && (
                <p className="text-[11px] text-gold/90 bg-gold/5 border border-gold/20 rounded-lg px-3 py-2">
                  Add {formatINR(calc.amountToFreeShipping)} more for FREE delivery.
                </p>
              )}
              <div className="flex justify-between items-baseline pt-3 border-t border-zinc-800">
                <dt className="font-semibold text-zinc-100">Total <span className="text-[10px] font-normal text-zinc-500">(incl. GST)</span></dt>
                <dd className="text-2xl font-extrabold text-gold">{calcLoading ? <Spinner className="w-5 h-5" /> : formatINR(total)}</dd>
              </div>
            </dl>

            {calc?.estimatedDeliveryText && (
              <p className="mt-3 text-[11px] text-zinc-400">
                Estimated delivery: <span className="text-zinc-200">{calc.estimatedDeliveryText}</span>
                {calc.surfaceOnly && ' · perfumes ship by surface transport as per courier safety rules'}
              </p>
            )}
            {calc?.items?.some((i) => i.returnable === false) && (
              <p className="mt-1 text-[11px] text-zinc-500">
                {calc.items.filter((i) => i.returnable === false).map((i) => i.name).join(', ')} – not returnable once opened; replaced if damaged, leaking or wrong.
              </p>
            )}
            {stockErrors.length > 0 && <Alert tone="warn" className="mt-4">{stockErrors.join(' ')}</Alert>}

            <label className="mt-4 flex items-start gap-2 text-[11px] text-zinc-400 cursor-pointer">
              <input type="checkbox" className="mt-0.5 accent-[#D4AF37]" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>
                I agree to the <Link to="/terms-and-conditions" className="text-gold hover:underline">Terms</Link>,{' '}
                <Link to="/shipping-policy" className="text-gold hover:underline">Shipping</Link> and{' '}
                <Link to="/refund-return-policy" className="text-gold hover:underline">Return & Refund Policy</Link>.
              </span>
            </label>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={submitting || calcLoading || !calc || (!onlineAllowed && !codAllowed)}
              className="mt-4 w-full btn-gold py-4 rounded-lg text-[13px] tracking-[0.18em] font-bold flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Spinner className="w-4 h-4 border-black border-t-transparent" />
                  {paymentMethod === 'ONLINE' ? 'Redirecting to PhonePe…' : 'Placing order…'}
                </>
              ) : paymentMethod === 'ONLINE' ? (
                <>
                  <Lock className="w-4 h-4" /> Pay {formatINR(total)} securely
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" /> Place COD order · {formatINR(total)}
                </>
              )}
            </button>

            <p className="mt-3 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-gold" />
              {paymentMethod === 'ONLINE' ? 'You will be redirected to PhonePe’s secure payment page' : 'Pay when your order arrives'}
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
};
