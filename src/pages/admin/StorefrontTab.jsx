import React, { useEffect, useState } from 'react';
import { Megaphone, Share2, Star, Plus, Trash2, TicketPercent, Truck, Sparkles, AlertTriangle } from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { Input, Select, Card } from '../../components/ui/Field.jsx';
import { SocialIcon } from '../../components/common/SocialLinks.jsx';

const SOCIAL = [
  ['instagram', 'Instagram', 'https://www.instagram.com/jayrup.in or @jayrup.in'],
  ['facebook', 'Facebook', 'https://www.facebook.com/jayrup'],
  ['youtube', 'YouTube', 'https://www.youtube.com/@jayrup'],
  ['x', 'X (Twitter)', '@jayrup'],
  ['linkedin', 'LinkedIn', 'https://www.linkedin.com/company/jayrup'],
  ['pinterest', 'Pinterest', 'jayrup'],
  ['threads', 'Threads', '@jayrup.in'],
];

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const couponState = (c) => {
  if (!c) return ['Coupon not found – the coupon line is hidden', 'red'];
  const now = new Date();
  if (c.status !== 'ACTIVE') return ['Coupon is inactive – the coupon line is hidden', 'red'];
  if (c.startDate && new Date(c.startDate) > now) return [`Starts ${new Date(c.startDate).toLocaleDateString('en-IN')} – shown from then`, 'amber'];
  if (c.expiryDate && new Date(c.expiryDate) < now) return ['Coupon has expired – the coupon line is hidden', 'red'];
  if (c.usageLimit && (c.timesUsed || 0) >= c.usageLimit) return ['Coupon fully used – the coupon line is hidden', 'red'];
  return [`Live until ${c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('en-IN') : 'no expiry'}`, 'emerald'];
};

export const StorefrontTab = ({ s, set, setB, Toggle }) => {
  const a = s.announcement || {};
  const r = s.reviews || {};
  const setA = (patch) => set({ announcement: { ...a, ...patch } });
  const setR = (patch) => set({ reviews: { ...r, ...patch } });
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    adminService
      .getCoupons()
      .then((d) => setCoupons(Array.isArray(d) ? d : d?.data || []))
      .catch(() => setCoupons([]));
  }, []);

  const coupon = coupons.find((c) => c.code === (a.couponCode || '').toUpperCase());
  const [cState, cTone] = couponState(coupon);
  const freeOn = a.showFreeShipping !== false && s.shipping?.freeShippingEnabled !== false && Number(s.freeShippingThreshold) > 0;
  const couponLive = cTone === 'emerald';
  const discount = coupon ? (coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : inr(coupon.discountValue)) : '10%';
  const preview = [
    freeOn && [Truck, (a.freeShippingText || '').replace('{amount}', inr(s.freeShippingThreshold))],
    a.couponCode && couponLive && [TicketPercent, (a.couponText || '').replace('{discount}', discount).replace('{code}', a.couponCode)],
    ...(a.messages || []).filter((m) => m.text).map((m) => [Sparkles, m.text]),
  ].filter(Boolean);
  const messages = a.messages || [];
  const setMsg = (k, patch) => setA({ messages: messages.map((m, j) => (j === k ? { ...m, ...patch } : m)) });

  return (
    <div className="space-y-6">
      <Card title="Announcement strip" icon={Megaphone}>
        <div className="space-y-4">
          <Toggle checked={a.enabled !== false} onChange={(v) => setA({ enabled: v })} label="Show the strip on every page" desc="The thin line above the menu on the whole website." />

          <div className="rounded-xl border border-zinc-800 p-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 mb-2">Live preview</p>
            {a.enabled === false || !preview.length ? (
              <p className="text-xs text-zinc-500">Hidden – nothing to show.</p>
            ) : (
              <div className="bg-gradient-to-r from-noir via-[#161309] to-noir border border-gold/20 py-1.5 px-3 flex flex-wrap items-center justify-center gap-3 text-[11px] uppercase tracking-[0.18em] text-gold-light">
                {preview.map(([Icon, t], k) => (
                  <span key={k} className="inline-flex items-center gap-1.5">
                    {k > 0 && <span className="text-zinc-600 mr-1.5">•</span>}
                    <Icon className="w-3 h-3 text-gold" /> {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-[auto_1fr] gap-4 items-start">
            <Toggle checked={a.showFreeShipping !== false} onChange={(v) => setA({ showFreeShipping: v })} label="Free-delivery line" />
            <Input
              label="Free-delivery text"
              hint={`{amount} = your free-shipping limit (${inr(s.freeShippingThreshold)}). Hidden automatically when free shipping is off.`}
              value={a.freeShippingText || ''}
              maxLength={120}
              onChange={(e) => setA({ freeShippingText: e.target.value })}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Select label="Coupon to promote" value={a.couponCode || ''} onChange={(e) => setA({ couponCode: e.target.value })}>
              <option value="">— No coupon line —</option>
              {coupons.map((c) => (
                <option key={c._id} value={c.code}>
                  {c.code} · {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : inr(c.discountValue)} off{c.status !== 'ACTIVE' ? ' (inactive)' : ''}
                </option>
              ))}
              {a.couponCode && !coupon && <option value={a.couponCode}>{a.couponCode} (not found)</option>}
            </Select>
            <Input label="Coupon text" hint="{code} = coupon code (tap to copy) · {discount} = 10% / ₹100" value={a.couponText || ''} maxLength={120} onChange={(e) => setA({ couponText: e.target.value })} />
          </div>
          {a.couponCode && (
            <p className={`text-xs flex items-center gap-1.5 ${cTone === 'emerald' ? 'text-emerald-300' : cTone === 'amber' ? 'text-amber-300' : 'text-red-300'}`}>
              {cTone !== 'emerald' && <AlertTriangle className="w-3.5 h-3.5" />} {a.couponCode}: {cState}. The coupon line only shows while the coupon is live.
            </p>
          )}

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-semibold">Extra messages (optional, up to 4)</p>
            {messages.map((m, k) => (
              <div key={k} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input value={m.text || ''} maxLength={140} placeholder="e.g. New: Charm body spray for her" onChange={(e) => setMsg(k, { text: e.target.value })} className="bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100" />
                <input value={m.link || ''} placeholder="Link (optional) e.g. /category/body-sprays" onChange={(e) => setMsg(k, { link: e.target.value })} className="bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100" />
                <button type="button" onClick={() => setA({ messages: messages.filter((_, j) => j !== k) })} className="p-2 text-zinc-500 hover:text-red-400" aria-label="Remove message">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {messages.length < 4 && (
              <button type="button" onClick={() => setA({ messages: [...messages, { text: '', link: '' }] })} className="text-xs text-gold inline-flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add message
              </button>
            )}
          </div>
        </div>
      </Card>

      <Card title="Social media" icon={Share2}>
        <p className="text-xs text-zinc-500 mb-4">
          Shown in the footer and on the Contact page, and published to Google as your official profiles (schema “sameAs”). Paste the profile link or just the @handle.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {SOCIAL.map(([k, label, ph]) => (
            <div key={k} className="flex items-end gap-2">
              <span className="mb-2 w-9 h-9 shrink-0 rounded-full border border-gold/30 text-gold flex items-center justify-center">
                <SocialIcon name={k} />
              </span>
              <Input className="flex-1" label={label} placeholder={ph} value={s.business?.[k] || ''} onChange={(e) => setB({ [k]: e.target.value })} />
            </div>
          ))}
        </div>
      </Card>

      <Card title="Product reviews" icon={Star}>
        <div className="grid md:grid-cols-2 gap-3">
          <Toggle checked={r.enabled !== false} onChange={(v) => setR({ enabled: v })} label="Accept new reviews" desc="Existing approved reviews always stay visible." />
          <Toggle checked={r.autoApproveVerified !== false} onChange={(v) => setR({ autoApproveVerified: v })} label="Publish verified buyers instantly" desc="Reviews from customers who bought the product skip moderation." />
          <Toggle checked={Boolean(r.buyersOnly)} onChange={(v) => setR({ buyersOnly: v })} label="Only buyers can review" desc="Blocks reviews from people who have not ordered the product." />
          <Input label="Minimum review length (characters)" type="number" min={0} max={500} value={r.minLength ?? 20} onChange={(e) => setR({ minLength: e.target.value })} />
        </div>
        <p className="text-xs text-zinc-500 mt-3">Reviews from non-buyers always wait for your approval in Admin › Reviews. Links in reviews are blocked automatically.</p>
      </Card>
    </div>
  );
};
