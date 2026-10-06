import React, { useState, useEffect } from 'react';
import {
  Settings,
  Banknote,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Save,
  Truck,
  Info,
  Globe,
  Search,
  KeyRound,
  Eye,
} from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { Badge } from '../../components/common/Badge.jsx';
import { ImageDropzone } from '../../components/common/ImageDropzone.jsx';

export const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [settings, setSettings] = useState({
    codEnabled: true,
    codExtraFee: 0,
    codMinOrderAmount: 0,
    codMaxOrderAmount: 50000,
    onlinePaymentEnabled: true,
    defaultMetaTitle: 'Jayrup (JR) | Royal Luxury Fragrance & Skincare House',
    defaultMetaDescription:
      'Jayrup (जयरूप) - Royal Indian Luxury House of High-Potency Extraits de Parfum and Ayurvedic Skincare. पिंपल्स भागे, आत्मविश्वास जागे.',
    defaultMetaKeywords:
      'luxury perfume, extrait de parfum, oud, kannauj rose, ayurvedic skincare, pimples soap, jayrup',
    googleSiteVerification: '',
    ogDefaultImage: '',
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSettings();
      if (data) {
        setSettings({
          codEnabled: data.codEnabled !== false,
          codExtraFee: data.codExtraFee || 0,
          codMinOrderAmount: data.codMinOrderAmount || 0,
          codMaxOrderAmount: data.codMaxOrderAmount || 50000,
          onlinePaymentEnabled: data.onlinePaymentEnabled !== false,
          defaultMetaTitle:
            data.defaultMetaTitle ||
            'Jayrup (JR) | Royal Luxury Fragrance & Skincare House',
          defaultMetaDescription:
            data.defaultMetaDescription ||
            'Jayrup (जयरूप) - Royal Indian Luxury House of High-Potency Extraits de Parfum and Ayurvedic Skincare. पिंपल्स भागे, आत्मविश्वास जागे.',
          defaultMetaKeywords:
            data.defaultMetaKeywords ||
            'luxury perfume, extrait de parfum, oud, kannauj rose, ayurvedic skincare, pimples soap, jayrup',
          googleSiteVerification: data.googleSiteVerification || '',
          ogDefaultImage: data.ogDefaultImage || '',
        });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load store settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMessage('');
      setErrorMessage('');

      const res = await adminService.updateSettings(settings);
      setSuccessMessage(
        res?.message ||
          `Settings saved. Cash on Delivery is now ${settings.codEnabled ? 'ENABLED' : 'DISABLED'}.`
      );

      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save store settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif text-xs uppercase tracking-widest text-gold">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-gold" />
            <span>Store Configuration & Payments</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Toggle Cash on Delivery (COD), configure order thresholds, and manage payment gateway rules
          </p>
        </div>

        <Badge variant={settings.codEnabled ? 'emerald' : 'rose'}>
          COD STATUS: {settings.codEnabled ? 'ACTIVE & ENABLED' : 'OFFLINE (DISABLED)'}
        </Badge>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 rounded">
          <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 rounded">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: CASH ON DELIVERY (COD) CONTROLS */}
        <div className="p-6 bg-noir-card border border-gold/25 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-gold/10 border border-gold/30 text-gold">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base uppercase tracking-wider text-zinc-100 font-semibold">
                  Cash on Delivery (COD) Control
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Allow patrons to pay cash or doorstep UPI upon parcel delivery
                </p>
              </div>
            </div>

            {/* MASTER TOGGLE SWITCH */}
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold tracking-wider uppercase ${settings.codEnabled ? 'text-gold' : 'text-zinc-500'}`}>
                {settings.codEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={settings.codEnabled}
                onClick={() => setSettings({ ...settings, codEnabled: !settings.codEnabled })}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-300 focus:outline-none ${
                  settings.codEnabled
                    ? 'bg-gold border-gold shadow-gold-glow'
                    : 'bg-zinc-800 border-zinc-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-black shadow-lg ring-0 transition duration-300 ${
                    settings.codEnabled ? 'translate-x-7 bg-black' : 'translate-x-0 bg-zinc-400'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* COD Notice Box */}
          <div className={`p-4 border rounded text-xs flex items-start gap-3 transition-colors ${
            settings.codEnabled
              ? 'bg-gold/5 border-gold/20 text-zinc-300'
              : 'bg-red-500/5 border-red-500/20 text-zinc-400'
          }`}>
            <Info className={`w-4 h-4 flex-shrink-0 mt-0.5 ${settings.codEnabled ? 'text-gold' : 'text-red-400'}`} />
            <div>
              <p className="font-semibold text-zinc-200">
                {settings.codEnabled ? 'Cash on Delivery is currently Live' : 'Cash on Delivery is currently Offline'}
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {settings.codEnabled
                  ? 'Patrons will see and be able to select "Cash on Delivery" as a payment option during checkout.'
                  : 'At checkout, the "Cash on Delivery" option will be locked/hidden, and patrons must pay online via Razorpay (UPI, Cards, NetBanking).'}
              </p>
            </div>
          </div>

          {/* COD Extra Configurations */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1.5 font-semibold">
                COD Extra Handling Fee (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500 text-xs">₹</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={settings.codExtraFee}
                  onChange={(e) =>
                    setSettings({ ...settings, codExtraFee: Math.max(0, Number(e.target.value) || 0) })
                  }
                  placeholder="0"
                  className="w-full bg-noir border border-zinc-800 p-2.5 pl-7 text-zinc-100 text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">Set to 0 for Complimentary Free COD</p>
            </div>

            <div>
              <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1.5 font-semibold">
                Minimum Order Value for COD (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500 text-xs">₹</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={settings.codMinOrderAmount}
                  onChange={(e) =>
                    setSettings({ ...settings, codMinOrderAmount: Math.max(0, Number(e.target.value) || 0) })
                  }
                  placeholder="0"
                  className="w-full bg-noir border border-zinc-800 p-2.5 pl-7 text-zinc-100 text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">Orders below this must pay online</p>
            </div>

            <div>
              <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1.5 font-semibold">
                Maximum Order Value for COD (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500 text-xs">₹</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={settings.codMaxOrderAmount}
                  onChange={(e) =>
                    setSettings({ ...settings, codMaxOrderAmount: Math.max(0, Number(e.target.value) || 0) })
                  }
                  placeholder="50000"
                  className="w-full bg-noir border border-zinc-800 p-2.5 pl-7 text-zinc-100 text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">High-value cap to minimize return risk</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: ONLINE PAYMENT GATEWAY (RAZORPAY) */}
        <div className="p-6 bg-noir-card border border-gold/15 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm uppercase tracking-wider text-zinc-100 font-semibold">
                  Online Payment Gateway (Razorpay)
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Instant automated settlement via UPI, RuPay, Cards & NetBanking
                </p>
              </div>
            </div>

            <Badge variant="emerald">ALWAYS ACTIVE</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
            <div className="p-3 bg-noir border border-zinc-800">
              <p className="text-gold font-bold">UPI Fast Pay</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">GPay, PhonePe, Paytm</p>
            </div>
            <div className="p-3 bg-noir border border-zinc-800">
              <p className="text-zinc-200 font-bold">Debit & Credit Cards</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Visa, Mastercard, RuPay</p>
            </div>
            <div className="p-3 bg-noir border border-zinc-800">
              <p className="text-zinc-200 font-bold">Net Banking</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">50+ Indian Banks</p>
            </div>
            <div className="p-3 bg-noir border border-zinc-800">
              <p className="text-zinc-200 font-bold">Digital Wallets</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Amazon Pay, Mobikwik</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: GLOBAL STOREFRONT SEO & WEBMASTER CONFIGURATION */}
        <div className="p-6 bg-noir-card border border-gold/25 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-gold/10 border border-gold/30 text-gold">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base uppercase tracking-wider text-zinc-100 font-semibold">
                  Global Storefront SEO & Webmaster Configuration
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Set default meta tags, Google Search Console verification, and social share banners
                </p>
              </div>
            </div>

            <Badge variant="gold">SEARCH ENGINE VISIBILITY</Badge>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Default Meta Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-zinc-300 uppercase tracking-wider text-[11px] font-semibold">
                  Default Storefront Meta Title (Homepage Title)
                </label>
                <span
                  className={`text-[10px] font-mono ${
                    (settings.defaultMetaTitle || '').length > 60
                      ? 'text-amber-400 font-bold'
                      : 'text-zinc-500'
                  }`}
                >
                  {(settings.defaultMetaTitle || '').length} / 60 chars (Optimal: 50-60)
                </span>
              </div>
              <input
                type="text"
                value={settings.defaultMetaTitle}
                onChange={(e) =>
                  setSettings({ ...settings, defaultMetaTitle: e.target.value })
                }
                placeholder="Jayrup (JR) | Royal Luxury Fragrance & Skincare House"
                className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 text-xs focus:outline-none focus:border-gold"
              />
            </div>

            {/* Default Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-zinc-300 uppercase tracking-wider text-[11px] font-semibold">
                  Default Storefront Meta Description
                </label>
                <span
                  className={`text-[10px] font-mono ${
                    (settings.defaultMetaDescription || '').length > 160
                      ? 'text-amber-400 font-bold'
                      : 'text-zinc-500'
                  }`}
                >
                  {(settings.defaultMetaDescription || '').length} / 160 chars (Optimal: 150-160)
                </span>
              </div>
              <textarea
                rows={3}
                value={settings.defaultMetaDescription}
                onChange={(e) =>
                  setSettings({ ...settings, defaultMetaDescription: e.target.value })
                }
                placeholder="Jayrup (जयरूप) - Royal Indian Luxury House of High-Potency Extraits de Parfum..."
                className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 text-xs focus:outline-none focus:border-gold resize-none"
              />
            </div>

            {/* Default Meta Keywords & Google Site Verification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 uppercase tracking-wider text-[11px] mb-1.5 font-semibold">
                  Default Meta Keywords (Comma-separated)
                </label>
                <input
                  type="text"
                  value={settings.defaultMetaKeywords}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultMetaKeywords: e.target.value })
                  }
                  placeholder="luxury perfume, extrait de parfum, oud, kannauj rose..."
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-300 uppercase tracking-wider text-[11px] mb-1.5 font-semibold flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-gold" />
                  <span>Google Search Console Verification Token</span>
                </label>
                <input
                  type="text"
                  value={settings.googleSiteVerification}
                  onChange={(e) =>
                    setSettings({ ...settings, googleSiteVerification: e.target.value })
                  }
                  placeholder="e.g. googled41d8cd98f00b204e or verification code"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 text-xs focus:outline-none focus:border-gold font-mono"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Injects &lt;meta name="google-site-verification" content="..."&gt; into &lt;head&gt;
                </p>
              </div>
            </div>

            {/* Default Social Share (OG) Banner */}
            <div>
              <ImageDropzone
                value={settings.ogDefaultImage}
                onChange={(url) => setSettings({ ...settings, ogDefaultImage: url })}
                folder="settings"
                label="Default OpenGraph / Social Share Banner"
                hint="Banner image displayed when sharing store links on WhatsApp, iMessage, Twitter, Facebook (1200x630 recommended)"
              />
            </div>

            {/* Live Google Search Snippet Preview */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <Search className="w-3.5 h-3.5 text-gold" />
                <span>Google Search SERP Preview (Homepage)</span>
              </div>
              <div className="p-3 bg-[#1f1f1f] rounded border border-zinc-700/50 space-y-1 font-sans">
                <div className="flex items-center gap-1.5 text-[11px] text-[#bdc1c6] truncate">
                  <span className="w-4 h-4 rounded-full bg-gold/30 flex items-center justify-center text-[9px] text-gold font-bold">
                    JR
                  </span>
                  <span>https://jayrup.com</span>
                </div>
                <h4 className="text-base text-[#8ab4f8] hover:underline cursor-pointer font-normal line-clamp-1">
                  {settings.defaultMetaTitle || 'Jayrup (JR) | Royal Luxury Fragrance & Skincare House'}
                </h4>
                <p className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed font-light">
                  {settings.defaultMetaDescription ||
                    'Jayrup (जयरूप) - Royal Indian Luxury House of High-Potency Extraits de Parfum and Ayurvedic Skincare.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-gold py-3 px-8 text-xs font-bold tracking-widest uppercase flex items-center gap-2 shadow-gold-glow"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Store Settings...' : 'Save & Publish Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
