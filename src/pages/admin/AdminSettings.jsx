import React, { useEffect, useState } from 'react';
import { Settings, Banknote, Smartphone, Truck, Building2, Receipt, Globe, Save, CheckCircle2, AlertTriangle, Copy, Loader2 } from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { Input, Select, Textarea, Alert, Card } from '../../components/ui/Field.jsx';
import { INDIA_STATES } from '../../config/site.js';

const SECTIONS = [
  ['payments', 'Payments', Smartphone],
  ['shipping', 'Shipping', Truck],
  ['business', 'Business & GST', Building2],
  ['invoice', 'Invoices', Receipt],
  ['seo', 'SEO & Tracking', Globe],
];

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

export const AdminSettings = () => {
  const [s, setS] = useState(null);
  const [tab, setTab] = useState('payments');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    adminService
      .getSettings()
      .then((data) => setS({ ...data, business: data.business || {}, invoice: data.invoice || {} }))
      .catch((err) => setMsg({ tone: 'error', text: err.message }));
  }, []);

  if (!s) return <div className="py-20 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gold" /></div>;

  const set = (patch) => setS((p) => ({ ...p, ...patch }));
  const setB = (patch) => setS((p) => ({ ...p, business: { ...p.business, ...patch } }));
  const setI = (patch) => setS((p) => ({ ...p, invoice: { ...p.invoice, ...patch } }));
  const gw = s.gateway || {};

  const save = async () => {
    try {
      setSaving(true);
      setMsg(null);
      const { gateway, _id, key, createdAt, updatedAt, __v, ...payload } = s;
      const res = await adminService.updateSettings(payload);
      setS({ ...res, business: res.business || {}, invoice: res.invoice || {} });
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
              {gw.environment === 'MOCK' && <p className="text-xs text-amber-300 mt-2">Test simulator is ON (PHONEPE_MOCK=true) – disabled automatically in production.</p>}
              {!gw.webhookConfigured && gw.apiVersion !== 'v1' && <p className="text-xs text-amber-300 mt-2">Webhook username/password not set – payments still work (status is verified on redirect and by the background checker), but set them for instant updates.</p>}
            </div>
            {gw.webhookUrl && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  ['Webhook URL (PhonePe dashboard › Webhooks)', gw.webhookUrl],
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

      {tab === 'shipping' && (
        <Card title="Shipping rules" icon={Truck}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Free shipping above (₹)" type="number" min="0" value={s.freeShippingThreshold} onChange={(e) => set({ freeShippingThreshold: e.target.value })} />
            <Input label="Flat shipping fee (₹)" type="number" min="0" value={s.flatShippingFee} onChange={(e) => set({ flatShippingFee: e.target.value })} hint="incl. GST" />
            <Input label="Delivery estimate text" value={s.estimatedDeliveryText} onChange={(e) => set({ estimatedDeliveryText: e.target.value })} />
          </div>
          <p className="text-xs text-zinc-500 mt-3">These rules are applied on the server for cart, checkout, invoices and Google Merchant feed – the browser can’t change them.</p>
        </Card>
      )}

      {tab === 'business' && (
        <Card title="Business identity & GST" icon={Building2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Brand name" value={s.business.brandName} onChange={(e) => setB({ brandName: e.target.value })} />
            <Input label="Trade name" value={s.business.tradeName} onChange={(e) => setB({ tradeName: e.target.value })} />
            <Input label="Legal name (as on GST certificate)" value={s.business.legalName} onChange={(e) => setB({ legalName: e.target.value })} />
            <Input label="Registration note" value={s.business.registrationNote} onChange={(e) => setB({ registrationNote: e.target.value })} />
            <Input label="GSTIN" maxLength={15} placeholder="24XXXXX0000X1Z5" value={s.business.gstin} onChange={(e) => setB({ gstin: e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '') })} hint="Leave empty if not registered" />
            <Input label="PAN" maxLength={10} value={s.business.pan} onChange={(e) => setB({ pan: e.target.value.toUpperCase() })} />
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
          <p className="text-xs text-zinc-500 mt-4">
            With a valid GSTIN, invoices become <b>Tax Invoices</b> with CGST+SGST (Gujarat customers) or IGST (other states). Without a GSTIN, a plain invoice without tax is issued.
          </p>
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
            <Input label="Default HSN code" value={s.invoice.defaultHsnCode} onChange={(e) => setI({ defaultHsnCode: e.target.value })} />
            <Select label="Default product GST rate" value={s.invoice.defaultGstRate} onChange={(e) => setI({ defaultGstRate: Number(e.target.value) })}>
              {[0, 5, 12, 18, 28].map((r) => <option key={r} value={r}>{r}%</option>)}
            </Select>
            <Select label="GST on shipping / COD fee" value={s.invoice.shippingGstRate} onChange={(e) => setI({ shippingGstRate: Number(e.target.value) })}>
              {[0, 5, 12, 18, 28].map((r) => <option key={r} value={r}>{r}%</option>)}
            </Select>
            <Input label="Shipping SAC code" value={s.invoice.shippingSacCode} onChange={(e) => setI({ shippingSacCode: e.target.value })} />
            <Input label="Signatory" value={s.invoice.signatoryName} onChange={(e) => setI({ signatoryName: e.target.value })} />
          </div>
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
