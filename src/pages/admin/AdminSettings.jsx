import React, { useEffect, useState } from 'react';
import { Settings, Banknote, Smartphone, Truck, Building2, Receipt, Globe, Save, CheckCircle2, AlertTriangle, Copy, Loader2, Percent, MapPin, Clock, Calculator, Ban, Info } from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import api from '../../services/api.js';
import { Input, Select, Textarea, Alert, Card } from '../../components/ui/Field.jsx';
import { INDIA_STATES } from '../../config/site.js';

const SECTIONS = [
  ['payments', 'Payments', Smartphone],
  ['shipping', 'Shipping', Truck],
  ['gst', 'GST & Tax', Percent],
  ['business', 'Business', Building2],
  ['invoice', 'Invoices', Receipt],
  ['seo', 'SEO & Tracking', Globe],
];

const RATES = [0, 5, 12, 18, 28, 40];
const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const STATE_CODES = { 'Jammu and Kashmir': '01', 'Himachal Pradesh': '02', Punjab: '03', Chandigarh: '04', Uttarakhand: '05', Haryana: '06', Delhi: '07', Rajasthan: '08', 'Uttar Pradesh': '09', Bihar: '10', Sikkim: '11', 'Arunachal Pradesh': '12', Nagaland: '13', Manipur: '14', Mizoram: '15', Tripura: '16', Meghalaya: '17', Assam: '18', 'West Bengal': '19', Jharkhand: '20', Odisha: '21', Chhattisgarh: '22', 'Madhya Pradesh': '23', Gujarat: '24', 'Dadra and Nagar Haveli and Daman and Diu': '26', Maharashtra: '27', Karnataka: '29', Goa: '30', Lakshadweep: '31', Kerala: '32', 'Tamil Nadu': '33', Puducherry: '34', 'Andaman and Nicobar Islands': '35', Telangana: '36', 'Andhra Pradesh': '37', Ladakh: '38' };
const ZONE_DEFAULTS = [
  { key: 'LOCAL', label: 'Within home state', fee: 60, freeAbove: null, minDays: 2, maxDays: 4, codAvailable: true },
  { key: 'NATIONAL', label: 'Rest of India', fee: 100, freeAbove: null, minDays: 4, maxDays: 7, codAvailable: true },
  { key: 'REMOTE', label: 'North-East, J&K, Ladakh & islands', fee: 150, freeAbove: null, minDays: 7, maxDays: 12, codAvailable: true },
];
const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const r2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

// Mirror of the server's shipping engine – only for the live preview in this screen
const previewShipping = (s, { state, subtotal, units, surface }) => {
  const sh = s.shipping || {};
  const globalFree = sh.freeShippingEnabled === false ? null : Number(s.freeShippingThreshold || 0);
  let fee = Number(s.flatShippingFee || 0);
  let freeAbove = globalFree;
  let days = surface ? s.surfaceDeliveryText || s.estimatedDeliveryText : s.estimatedDeliveryText;
  let zone = 'Simple (one rate for all India)';
  let cod = true;
  if (sh.zoneRatesEnabled) {
    const key = state === s.business?.state ? 'LOCAL' : (sh.remoteStates || []).includes(state) ? 'REMOTE' : 'NATIONAL';
    const z = (sh.zones || ZONE_DEFAULTS).find((x) => x.key === key) || ZONE_DEFAULTS[1];
    zone = z.label || key;
    fee = Number(z.fee || 0);
    if (sh.freeShippingEnabled !== false) freeAbove = z.freeAbove === null || z.freeAbove === '' || z.freeAbove === undefined ? globalFree : Number(z.freeAbove);
    const d = Number(sh.dispatchDays ?? 1) + (surface ? Number(sh.surfaceExtraDays ?? 2) : 0);
    const min = Number(z.minDays || 0) + d;
    const max = Math.max(min, Number(z.maxDays || 0) + d);
    days = min === max ? `${max} business days` : `${min}–${max} business days`;
    cod = z.codAvailable !== false;
  }
  const free = freeAbove !== null && subtotal >= freeAbove;
  const extra = Number(sh.additionalItemFee || 0) * Math.max(0, units - 1);
  return { zone, fee: free ? 0 : fee + extra, free, freeAbove, days, cod };
};

const Toggle = ({ checked, onChange, label, desc }) => (
  <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-800 cursor-pointer hover:border-zinc-700">
    <span>
      <span className="block text-sm text-zinc-100 font-medium">{label}</span>
      {desc && <span className="block text-xs text-zinc-500 mt-0.5">{desc}</span>}
    </span>
    <span className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors ${checked ? 'bg-gold' : 'bg-zinc-700'}`}>
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </span>
  </label>
);

const normalise = (data) => ({
  ...data,
  business: data.business || {},
  invoice: data.invoice || {},
  shipping: {
    freeShippingEnabled: true,
    additionalItemFee: 0,
    dispatchDays: 1,
    surfaceExtraDays: 2,
    zoneRatesEnabled: false,
    remoteStates: [],
    blockedPincodes: [],
    codBlockedPincodes: [],
    shippingPolicyNote: '',
    ...(data.shipping || {}),
    zones: ZONE_DEFAULTS.map((d) => ({ ...d, ...((data.shipping?.zones || []).find((z) => z.key === d.key) || {}) })),
  },
});

export const AdminSettings = () => {
  const [s, setS] = useState(null);
  const [tab, setTab] = useState('payments');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    adminService
      .getSettings()
      .then((data) => setS(normalise(data)))
      .catch((err) => setMsg({ tone: 'error', text: err.message }));
  }, []);

  if (!s) return <div className="py-20 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gold" /></div>;

  const set = (patch) => setS((p) => ({ ...p, ...patch }));
  const setB = (patch) => setS((p) => ({ ...p, business: { ...p.business, ...patch } }));
  const setI = (patch) => setS((p) => ({ ...p, invoice: { ...p.invoice, ...patch } }));
  const setSh = (patch) => setS((p) => ({ ...p, shipping: { ...p.shipping, ...patch } }));
  const setZone = (key, patch) => setS((p) => ({ ...p, shipping: { ...p.shipping, zones: p.shipping.zones.map((z) => (z.key === key ? { ...z, ...patch } : z)) } }));
  const gw = s.gateway || {};

  const save = async () => {
    try {
      setSaving(true);
      setMsg(null);
      const { gateway, _id, key, createdAt, updatedAt, __v, ...payload } = s;
      const res = await adminService.updateSettings(payload);
      setS(normalise(res));
      setMsg({ tone: 'success', text: 'Settings saved.' });
    } catch (err) {
      setMsg({ tone: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const copy = (t) => navigator.clipboard?.writeText(t);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold flex items-center gap-3"><Settings className="w-6 h-6 text-gold" />Store Settings</h1>
          <p className="text-xs text-zinc-400 mt-1">Payments, shipping rules, GST identity, invoice format and SEO.</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-gold rounded-lg">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save settings
        </button>
      </div>

      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}

      <nav className="flex gap-2 overflow-x-auto pb-1">
        {SECTIONS.map(([k, l, Icon]) => (
          <button key={k} onClick={() => setTab(k)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs whitespace-nowrap border ${tab === k ? 'bg-gold text-black border-gold font-semibold' : 'border-zinc-800 text-zinc-400 hover:text-gold'}`}>
            <Icon className="w-3.5 h-3.5" /> {l}
          </button>
        ))}
      </nav>

      {tab === 'payments' && (
        <div className="space-y-6">
          <Card title="PhonePe Payment Gateway" icon={Smartphone}>
            <div className={`rounded-xl border p-4 mb-4 ${gw.configured ? 'border-emerald-500/30 bg-emerald-500/[0.06]' : 'border-amber-500/30 bg-amber-500/[0.06]'}`}>
              <p className="flex items-center gap-2 text-sm font-semibold">
                {gw.configured ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {gw.configured ? `Connected · ${gw.environment} · API ${gw.apiVersion}` : 'Not configured'}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Credentials are read from the server <code className="text-gold">.env</code> (PHONEPE_CLIENT_ID, PHONEPE_CLIENT_SECRET, PHONEPE_CLIENT_VERSION, PHONEPE_ENV). They are never stored in the database or shown here.
              </p>
              {gw.environment === 'SANDBOX' && gw.configured && (
                <p className="text-xs text-sky-300 mt-2">Sandbox mode – use PhonePe “Test Mode” keys. To go live switch Test Mode OFF in PhonePe, copy the live keys and set PHONEPE_ENV=PRODUCTION.</p>
              )}
              {gw.environment === 'MOCK' && <p className="text-xs text-amber-300 mt-2">Test simulator is ON (PHONEPE_MOCK=true) – disabled automatically in production.</p>}
              {!gw.webhookConfigured && gw.apiVersion !== 'v1' && <p className="text-xs text-amber-300 mt-2">Webhook username/password not set – payments still work (status is verified on redirect and by the background checker), but set them for instant updates.</p>}
            </div>
            {gw.webhookUrl && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  ['Webhook URL (PhonePe › Developer Settings › Webhook › Create · type “SHA”)', gw.webhookUrl],
                  ['Redirect URL pattern', gw.redirectUrlPattern],
                ].map(([l, v]) => (
                  <div key={l} className="bg-noir border border-zinc-800 rounded-lg p-3">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">{l}</p>
                    <p className="font-mono text-zinc-200 break-all mt-1 flex items-start gap-2">
                      {v}
                      <button type="button" onClick={() => copy(v)} className="text-gold flex-shrink-0" aria-label="Copy"><Copy className="w-3.5 h-3.5" /></button>
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Toggle checked={s.onlinePaymentEnabled !== false} onChange={(v) => set({ onlinePaymentEnabled: v })} label="Accept online payments (PhonePe)" desc="UPI, cards and net banking at checkout." />
            </div>
          </Card>

          <Card title="Cash on Delivery" icon={Banknote}>
            <div className="space-y-4">
              <Toggle checked={Boolean(s.codEnabled)} onChange={(v) => set({ codEnabled: v })} label="Enable Cash on Delivery" desc="Customers can pay cash/UPI to the courier." />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="COD fee (₹)" type="number" min="0" value={s.codExtraFee} onChange={(e) => set({ codExtraFee: e.target.value })} hint="GST is included" />
                <Input label="Min. order for COD (₹)" type="number" min="0" value={s.codMinOrderAmount} onChange={(e) => set({ codMinOrderAmount: e.target.value })} />
                <Input label="Max. order for COD (₹)" type="number" min="0" value={s.codMaxOrderAmount} onChange={(e) => set({ codMaxOrderAmount: e.target.value })} hint="0 = no limit" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === 'shipping' && <ShippingTab s={s} set={set} setSh={setSh} setZone={setZone} Toggle={Toggle} />}

      {tab === 'gst' && <GstTab s={s} setB={setB} setI={setI} Toggle={Toggle} />}

      {tab === 'business' && (
        <Card title="Business identity" icon={Building2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Brand name" value={s.business.brandName} onChange={(e) => setB({ brandName: e.target.value })} />
            <Input label="Trade name (exactly as on GST certificate)" value={s.business.tradeName} onChange={(e) => setB({ tradeName: e.target.value })} />
            <Input
              className="md:col-span-2"
              label="Tagline (invoices & reports)"
              hint="describe the whole range – not one product"
              maxLength={80}
              value={s.business.tagline || ''}
              onChange={(e) => setB({ tagline: e.target.value })}
            />
            <Input label="Legal name (as on GST certificate)" value={s.business.legalName} onChange={(e) => setB({ legalName: e.target.value })} />
            <Input label="Registration note" value={s.business.registrationNote} onChange={(e) => setB({ registrationNote: e.target.value })} />
            <Input label="Udyam (MSME) no." value={s.business.udyamNumber} onChange={(e) => setB({ udyamNumber: e.target.value.toUpperCase() })} />
            <Input label="Phone" value={s.business.phone} onChange={(e) => setB({ phone: e.target.value })} />
            <Input label="Address line 1" value={s.business.addressLine1} onChange={(e) => setB({ addressLine1: e.target.value })} />
            <Input label="Address line 2" value={s.business.addressLine2} onChange={(e) => setB({ addressLine2: e.target.value })} />
            <Input label="City" value={s.business.city} onChange={(e) => setB({ city: e.target.value })} />
            <Input label="District" value={s.business.district} onChange={(e) => setB({ district: e.target.value })} />
            <Select label="State (place of business)" value={s.business.state} onChange={(e) => setB({ state: e.target.value })}>
              {INDIA_STATES.map((st) => <option key={st}>{st}</option>)}
            </Select>
            <Input label="PIN code" value={s.business.postalCode} onChange={(e) => setB({ postalCode: e.target.value })} />
            <Input label="Support e-mail" type="email" value={s.business.email} onChange={(e) => setB({ email: e.target.value })} />
            <Input label="WhatsApp" value={s.business.whatsapp} onChange={(e) => setB({ whatsapp: e.target.value })} />
            <Input label="Instagram URL" value={s.business.instagram} onChange={(e) => setB({ instagram: e.target.value })} />
            <Input label="Facebook URL" value={s.business.facebook} onChange={(e) => setB({ facebook: e.target.value })} />
            <Input label="YouTube URL" value={s.business.youtube} onChange={(e) => setB({ youtube: e.target.value })} />
          </div>
          <p className="text-xs text-zinc-500 mt-4">GSTIN, PAN, GST scheme and tax rates are in the <b>GST &amp; Tax</b> tab. The state above decides CGST+SGST vs IGST on invoices.</p>
        </Card>
      )}

      {tab === 'invoice' && (
        <Card title="Invoice format" icon={Receipt}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Invoice prefix" maxLength={6} value={s.invoice.prefix} onChange={(e) => setI({ prefix: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })} hint={`${s.invoice.prefix || 'JR'}/26-27/00001`} />
            <Input label="Credit note prefix" maxLength={6} value={s.invoice.creditNotePrefix} onChange={(e) => setI({ creditNotePrefix: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })} />
            <Select label="COD invoice is issued when order is" value={s.invoice.autoGenerateForCodOn} onChange={(e) => setI({ autoGenerateForCodOn: e.target.value })}>
              <option value="PLACED">Placed</option>
              <option value="SHIPPED">Shipped (recommended)</option>
              <option value="DELIVERED">Delivered</option>
            </Select>
            <Input label="Signatory" value={s.invoice.signatoryName} onChange={(e) => setI({ signatoryName: e.target.value })} />
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            Tax rates, HSN fallbacks and GST on shipping are in the <b>GST &amp; Tax</b> tab. Each invoice line uses the HSN &amp; GST of its own product (Products › Price, Stock &amp; GST), else its category (Categories), else its product type – so creams,
            perfumes and any future products are taxed correctly in the same order. The fallbacks above are used only when nothing else is set.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Textarea label="Terms printed on invoice" rows={3} value={s.invoice.termsText} onChange={(e) => setI({ termsText: e.target.value })} />
            <Textarea label="Footer thank-you note" rows={3} value={s.invoice.footerNote} onChange={(e) => setI({ footerNote: e.target.value })} />
          </div>
          <p className="text-xs text-zinc-500 mt-3">Invoice numbers restart every financial year (April) and are gap-free. Existing invoices keep their original details.</p>
        </Card>
      )}

      {tab === 'seo' && (
        <Card title="Search engines & tracking" icon={Globe}>
          <div className="space-y-4">
            <Input label="Default meta title" hint={`${(s.defaultMetaTitle || '').length}/60`} value={s.defaultMetaTitle} onChange={(e) => set({ defaultMetaTitle: e.target.value })} />
            <Textarea label="Default meta description" hint={`${(s.defaultMetaDescription || '').length}/160`} rows={3} value={s.defaultMetaDescription} onChange={(e) => set({ defaultMetaDescription: e.target.value })} />
            <Input label="Default keywords" value={s.defaultMetaKeywords} onChange={(e) => set({ defaultMetaKeywords: e.target.value })} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Google Search Console verification code" value={s.googleSiteVerification} onChange={(e) => set({ googleSiteVerification: e.target.value })} />
              <Input label="Bing Webmaster verification code" value={s.bingSiteVerification} onChange={(e) => set({ bingSiteVerification: e.target.value })} />
              <Input label="Google Analytics 4 ID" placeholder="G-XXXXXXX" value={s.googleAnalyticsId} onChange={(e) => set({ googleAnalyticsId: e.target.value })} />
              <Input label="Meta Pixel ID" value={s.metaPixelId} onChange={(e) => set({ metaPixelId: e.target.value })} />
            </div>
            <Input label="Default social share image URL" value={s.ogDefaultImage} onChange={(e) => set({ ogDefaultImage: e.target.value })} hint="1200×630 px" />
            <div className="text-xs text-zinc-500 space-y-1">
              <p>Submit these in Google Search Console & Merchant Center:</p>
              <p className="font-mono text-zinc-300">https://jayrup.in/sitemap.xml</p>
              <p className="font-mono text-zinc-300">https://jayrup.in/google-merchant-feed.xml</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// ═══════════════════════════════ Shipping ═══════════════════════════════
const ShippingTab = ({ s, set, setSh, setZone, Toggle }) => {
  const sh = s.shipping;
  const [pv, setPv] = useState({ state: 'Maharashtra', subtotal: 499, units: 1, surface: true });
  const out = previewShipping(s, pv);
  const toggleRemote = (st) =>
    setSh({ remoteStates: sh.remoteStates.includes(st) ? sh.remoteStates.filter((x) => x !== st) : [...sh.remoteStates, st] });
  const pinText = (arr) => (Array.isArray(arr) ? arr.join(', ') : arr || '');

  return (
    <div className="space-y-6">
      <Card title="Free shipping & base rate" icon={Truck}>
        <div className="space-y-4">
          <Toggle
            checked={sh.freeShippingEnabled !== false}
            onChange={(v) => setSh({ freeShippingEnabled: v })}
            label="Offer free shipping above an order value"
            desc="Customers see “Add ₹X more for FREE delivery” in the bag and at checkout."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Free shipping above (₹)" type="number" min="0" disabled={sh.freeShippingEnabled === false} value={s.freeShippingThreshold} onChange={(e) => set({ freeShippingThreshold: e.target.value })} hint="goods value" />
            <Input label="Standard shipping fee (₹)" type="number" min="0" value={s.flatShippingFee} onChange={(e) => set({ flatShippingFee: e.target.value })} hint={sh.zoneRatesEnabled ? 'not used – zones are ON' : 'all India'} />
            <Input label="Extra fee per additional item (₹)" type="number" min="0" value={sh.additionalItemFee} onChange={(e) => setSh({ additionalItemFee: e.target.value })} hint="0 = same fee for any quantity" />
          </div>
        </div>
      </Card>

      <Card title="Shipping zones" icon={MapPin}>
        <div className="space-y-4">
          <Toggle
            checked={Boolean(sh.zoneRatesEnabled)}
            onChange={(v) => setSh({ zoneRatesEnabled: v })}
            label="Charge by delivery zone"
            desc={`Different fee, free-shipping limit, delivery days and COD for your home state (${s.business?.state || 'set in Business'}), the rest of India and remote regions.`}
          />
          {sh.zoneRatesEnabled && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {sh.zones.map((z) => (
                  <div key={z.key} className="rounded-xl border border-zinc-800 p-4 space-y-3 bg-noir/40">
                    <p className="text-[10px] uppercase tracking-widest text-gold">{z.key === 'LOCAL' ? `Home state · ${s.business?.state || ''}` : z.key === 'NATIONAL' ? 'Rest of India' : 'Remote regions'}</p>
                    <Input label="Name shown to customers" value={z.label} onChange={(e) => setZone(z.key, { label: e.target.value })} />
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Fee (₹)" type="number" min="0" value={z.fee} onChange={(e) => setZone(z.key, { fee: e.target.value })} />
                      <Input label="Free above (₹)" type="number" min="0" placeholder={String(s.freeShippingThreshold ?? '')} value={z.freeAbove ?? ''} onChange={(e) => setZone(z.key, { freeAbove: e.target.value === '' ? null : e.target.value })} hint="blank = store-wide" />
                      <Input label="Min. transit days" type="number" min="0" value={z.minDays} onChange={(e) => setZone(z.key, { minDays: e.target.value })} />
                      <Input label="Max. transit days" type="number" min="0" value={z.maxDays} onChange={(e) => setZone(z.key, { maxDays: e.target.value })} />
                    </div>
                    <label className="flex items-center gap-2 text-xs text-zinc-300">
                      <input type="checkbox" className="accent-[#D4AF37]" checked={z.codAvailable !== false} onChange={(e) => setZone(z.key, { codAvailable: e.target.checked })} />
                      Cash on Delivery available in this zone
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-2">Remote-zone states ({sh.remoteStates.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {INDIA_STATES.filter((st) => st !== s.business?.state).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => toggleRemote(st)}
                      className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${sh.remoteStates.includes(st) ? 'bg-gold/15 border-gold/60 text-gold-light' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      <Card title="Delivery promise" icon={Clock}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input label="Dispatch time (days)" type="number" min="0" value={sh.dispatchDays} onChange={(e) => setSh({ dispatchDays: e.target.value })} hint="packing before pickup" />
          <Input label="Extra days – perfumes (surface)" type="number" min="0" value={sh.surfaceExtraDays} onChange={(e) => setSh({ surfaceExtraDays: e.target.value })} hint="zone mode" />
          <Input label="Delivery text (simple mode)" value={s.estimatedDeliveryText} onChange={(e) => set({ estimatedDeliveryText: e.target.value })} />
          <Input label="Delivery text – perfumes" value={s.surfaceDeliveryText || ''} onChange={(e) => set({ surfaceDeliveryText: e.target.value })} hint="simple mode" />
        </div>
        <Textarea className="mt-4" label="Note shown at checkout (optional)" rows={2} maxLength={300} value={sh.shippingPolicyNote} onChange={(e) => setSh({ shippingPolicyNote: e.target.value })} placeholder="e.g. Orders placed before 2 pm are packed the same day." />
      </Card>

      <Card title="PIN code rules" icon={Ban}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea
            label="We don't deliver to"
            hint="PIN codes or prefixes, comma separated"
            rows={3}
            value={pinText(sh.blockedPincodes)}
            onChange={(e) => setSh({ blockedPincodes: e.target.value })}
            placeholder="e.g. 744, 682551"
          />
          <Textarea
            label="Prepaid only – no COD"
            hint="PIN codes or prefixes, comma separated"
            rows={3}
            value={pinText(sh.codBlockedPincodes)}
            onChange={(e) => setSh({ codBlockedPincodes: e.target.value })}
            placeholder="e.g. 7441 (all of Port Blair)"
          />
        </div>
        <p className="text-xs text-zinc-500 mt-3">A prefix matches every PIN that starts with it – “744” covers all of the Andaman &amp; Nicobar Islands.</p>
      </Card>

      <Card title="Live preview" icon={Calculator}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Select label="Delivery state" value={pv.state} onChange={(e) => setPv({ ...pv, state: e.target.value })}>
            {INDIA_STATES.map((st) => <option key={st}>{st}</option>)}
          </Select>
          <Input label="Bag value (₹)" type="number" min="0" value={pv.subtotal} onChange={(e) => setPv({ ...pv, subtotal: Number(e.target.value) })} />
          <Input label="Items" type="number" min="1" value={pv.units} onChange={(e) => setPv({ ...pv, units: Math.max(1, Number(e.target.value)) })} />
          <label className="flex items-center gap-2 text-xs text-zinc-300 mt-6">
            <input type="checkbox" className="accent-[#D4AF37]" checked={pv.surface} onChange={(e) => setPv({ ...pv, surface: e.target.checked })} /> Contains perfume
          </label>
        </div>
        <dl className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ['Zone', out.zone],
            ['Shipping', out.free ? 'FREE' : inr(out.fee)],
            ['Delivery', out.days],
            ['Cash on Delivery', out.cod && s.codEnabled ? 'Available' : 'Not available'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-noir border border-zinc-800 p-3">
              <dt className="text-[10px] uppercase tracking-wider text-zinc-500">{k}</dt>
              <dd className="text-sm text-zinc-100 mt-1">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="text-xs text-zinc-500 mt-3">The server applies exactly these rules to the bag, checkout, invoices and the Google Merchant feed – customers can’t change them.</p>
      </Card>
    </div>
  );
};

// ═══════════════════════════════ GST & Tax ═══════════════════════════════
// Asks the live public API what the storefront shows right now – confirms the GSTIN really reached the website.
const LiveGstinCheck = ({ savedGstin }) => {
  const [state, setState] = useState(null);
  const check = async () => {
    setState({ loading: true });
    try {
      const res = await api.get('/settings/public', { params: { t: Date.now() } });
      setState({ gstin: res?.data?.gst?.gstin || '' });
    } catch (err) {
      setState({ error: err.message });
    }
  };
  return (
    <div className="mt-4 rounded-lg border border-zinc-800 bg-noir/60 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="text-zinc-400">
        {!state && 'Press “Save settings” first, then check what customers see.'}
        {state?.loading && 'Checking the live website…'}
        {state?.error && <span className="text-red-300">Could not reach the API: {state.error}</span>}
        {state && !state.loading && !state.error && (state.gstin ? (
          <span className="text-emerald-300 inline-flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Live on the website: GSTIN {state.gstin}</span>
        ) : (
          <span className="text-amber-300 inline-flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />
            Not shown on the website{savedGstin ? ' – unsaved changes, “Show GSTIN” off, or the GSTIN/state does not match' : ' – no GSTIN saved yet'}.
          </span>
        ))}
      </div>
      <button type="button" onClick={check} className="btn-outline-gold rounded-lg text-[11px] py-2 px-4">Check website</button>
    </div>
  );
};

const GstTab = ({ s, setB, setI, Toggle }) => {
  const b = s.business;
  const inv = s.invoice;
  const gstin = (b.gstin || '').toUpperCase();
  const validFormat = GSTIN_RE.test(gstin);
  const stateCode = STATE_CODES[b.state] || '';
  const stateOk = !gstin || !stateCode || gstin.slice(0, 2) === stateCode;
  const registered = validFormat && stateOk;
  const composition = inv.gstScheme === 'COMPOSITION';
  const inclusive = inv.pricesIncludeTax !== false;
  const rate = 18;
  const price = 499;
  const incTaxable = r2(price / (1 + rate / 100));

  const status = !gstin
    ? ['Not registered under GST', 'Invoices are issued without tax. Add your GSTIN once you are registered.', 'amber']
    : !validFormat
      ? ['GSTIN format looks wrong', 'A GSTIN has 15 characters, e.g. 24ABCDE1234F1Z5.', 'red']
      : !stateOk
        ? ['GSTIN does not match your state', `GSTIN starts with ${gstin.slice(0, 2)} but ${b.state} is state code ${stateCode}. Fix the state in Business or the GSTIN.`, 'red']
        : composition
          ? ['Registered · Composition scheme', 'Bills of Supply are issued and no GST is collected from customers.', 'sky']
          : ['Registered · Regular scheme', `Tax Invoices with CGST + SGST for ${b.state} customers and IGST for other states.`, 'emerald'];
  const tone = { amber: 'border-amber-500/30 bg-amber-500/[0.06] text-amber-300', red: 'border-red-500/30 bg-red-500/[0.06] text-red-300', sky: 'border-sky-500/30 bg-sky-500/[0.06] text-sky-300', emerald: 'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-300' }[status[2]];

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border p-4 ${tone}`}>
        <p className="flex items-center gap-2 text-sm font-semibold">{status[2] === 'emerald' ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}{status[0]}</p>
        <p className="text-xs text-zinc-400 mt-1">{status[1]}</p>
      </div>

      <Card title="GST registration" icon={Building2}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="GSTIN"
            maxLength={15}
            placeholder={`${stateCode || '24'}ABCDE1234F1Z5`}
            value={b.gstin || ''}
            onChange={(e) => setB({ gstin: e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '') })}
            hint="empty = not registered"
            error={gstin && !registered ? status[1] : undefined}
          />
          <Input label="PAN" maxLength={10} value={b.pan || ''} onChange={(e) => setB({ pan: e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '') })} hint={gstin.length === 15 ? `in GSTIN: ${gstin.slice(2, 12)}` : ''} />
          <Select label="GST scheme" value={inv.gstScheme || 'REGULAR'} onChange={(e) => setI({ gstScheme: e.target.value })}>
            <option value="REGULAR">Regular – collect GST (Tax Invoice)</option>
            <option value="COMPOSITION">Composition – no GST collected (Bill of Supply)</option>
          </Select>
        </div>
        <div className="mt-4">
          <Toggle
            checked={inv.showGstinOnSite !== false}
            onChange={(v) => setI({ showGstinOnSite: v })}
            label="Show GSTIN on the website"
            desc="Footer, contact page and checkout – builds trust and lets business buyers claim input tax credit."
          />
        </div>
        <LiveGstinCheck savedGstin={s.business?.gstin} />
      </Card>

      <Card title="How prices are shown" icon={Percent}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            [true, 'Prices include GST', 'Recommended for consumers (B2C). The price on the product is the final MRP; GST is calculated back on the invoice.', `₹${price} → customer pays ₹${price} (taxable ₹${incTaxable} + GST ₹${r2(price - incTaxable)})`],
            [false, 'Add GST at checkout', 'For wholesale / B2B price lists. Product prices are before GST; GST is added as a separate line at checkout.', `₹${price} → customer pays ₹${r2(price * (1 + rate / 100))} (₹${price} + GST ₹${r2((price * rate) / 100)})`],
          ].map(([val, title, desc, ex]) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => setI({ pricesIncludeTax: val })}
              className={`text-left rounded-xl border p-4 transition-colors ${inclusive === val ? 'border-gold bg-gold/[0.06]' : 'border-zinc-800 hover:border-zinc-600'}`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                <span className={`w-4 h-4 rounded-full border-2 ${inclusive === val ? 'border-gold bg-gold' : 'border-zinc-600'}`} />
                {title}
              </span>
              <span className="block text-xs text-zinc-400 mt-2">{desc}</span>
              <span className="block text-[11px] text-gold/90 mt-3 font-mono">Example at {rate}%: {ex}</span>
            </button>
          ))}
        </div>
        {!inclusive && (
          <p className="mt-4 text-xs text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" /> Customers will pay more than the product price. Make sure your product prices are entered without GST before switching. Orders already placed are not changed.
          </p>
        )}
      </Card>

      <Card title="Tax rates & HSN" icon={Receipt}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Fallback HSN code" hint="if product & category have none" value={inv.defaultHsnCode || ''} onChange={(e) => setI({ defaultHsnCode: e.target.value.replace(/\D/g, '').slice(0, 8) })} />
          <Select label="Fallback GST rate" value={inv.defaultGstRate} onChange={(e) => setI({ defaultGstRate: Number(e.target.value) })}>
            {RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
          </Select>
          <Input label="Shipping SAC code" value={inv.shippingSacCode || ''} onChange={(e) => setI({ shippingSacCode: e.target.value })} />
          <Select className="md:col-span-2" label="GST on shipping & COD fee" value={inv.shippingTaxMode || 'HIGHEST_ITEM_RATE'} onChange={(e) => setI({ shippingTaxMode: e.target.value })}>
            <option value="HIGHEST_ITEM_RATE">Same as the highest product rate in the order (recommended)</option>
            <option value="FIXED">Fixed rate</option>
          </Select>
          {inv.shippingTaxMode === 'FIXED' && (
            <Select label="Fixed shipping GST rate" value={inv.shippingGstRate} onChange={(e) => setI({ shippingGstRate: Number(e.target.value) })}>
              {RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
            </Select>
          )}
        </div>
        <div className="mt-4 rounded-lg bg-noir border border-zinc-800 p-4 text-xs text-zinc-400 space-y-1.5">
          <p className="text-zinc-200 font-medium">Where each product's GST comes from (first match wins)</p>
          <p>1. Product › Price, Stock &amp; GST (HSN + rate) → 2. its Category → 3. its Product type → 4. the fallbacks above.</p>
          <p>Current catalogue: Luxury Perfumes – HSN 3303 @ 18% · Ayurvedic Skin Care – HSN 30049011 @ 5%. Confirm rates with your CA.</p>
        </div>
      </Card>
    </div>
  );
};
