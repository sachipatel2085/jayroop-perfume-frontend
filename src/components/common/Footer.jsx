import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo.jsx';
import { ShieldCheck, Truck, RefreshCw, Award, Mail, Phone, MapPin, MessageCircle, Smartphone, CreditCard, Landmark, Banknote, BadgeCheck } from 'lucide-react';
import { BRAND, fullAddress } from '../../config/site.js';
import { useStoreSettings } from '../../hooks/useStoreSettings.js';

const Col = ({ title, links }) => (
  <div>
    <h3 className="font-serif text-xs text-gold tracking-widest uppercase mb-4 font-semibold">{title}</h3>
    <ul className="space-y-2.5 text-xs">
      {links.map(([to, label]) => (
        <li key={to}>
          <Link to={to} className="hover:text-gold transition-colors">{label}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export const Footer = () => {
  const storeSettings = useStoreSettings();
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  return (
    <footer className="bg-noir border-t border-gold/20 text-zinc-400 text-xs" role="contentinfo">
      {/* Trust bar */}
      <div className="border-b border-zinc-900 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            [Truck, 'Delivery across India', 'Free above ₹999 · 7–10 business days'],
            [Award, 'Genuine products', 'Direct from the Jayrup brand'],
            [ShieldCheck, 'Secure PhonePe payments', 'UPI · Cards · Net Banking · COD'],
            [RefreshCw, 'Easy support', 'Damaged item? Report within 3 days'],
          ].map(([Icon, t, s]) => (
            <div key={t} className="flex flex-col items-center">
              <Icon className="w-6 h-6 text-gold mb-2" />
              <p className="font-semibold text-zinc-100 uppercase tracking-wider text-[11px]">{t}</p>
              <p className="text-[10px] text-zinc-500 mt-1">{s}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <BrandLogo size="normal" showTagline={true} />
          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">{BRAND.description}</p>
          <span className="inline-block bg-gradient-to-r from-gold-amber via-gold to-gold-amber text-black text-[10px] font-bold px-3 py-1 rounded-full tracking-wider">
            {BRAND.tagline}
          </span>
          <address className="not-italic pt-2 text-[11px] text-zinc-500 space-y-2">
            <p className="flex gap-2"><MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" /><span>{BRAND.tradeName}, {fullAddress()}</span></p>
            <p className="flex gap-2"><Phone className="w-3.5 h-3.5 text-gold flex-shrink-0" /><a href={BRAND.phoneHref} className="hover:text-gold">{BRAND.phone}</a></p>
            <p className="flex gap-2"><Mail className="w-3.5 h-3.5 text-gold flex-shrink-0" /><a href={`mailto:${BRAND.email}`} className="hover:text-gold">{BRAND.email}</a></p>
            <p className="flex gap-2"><MessageCircle className="w-3.5 h-3.5 text-gold flex-shrink-0" /><a href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-gold">WhatsApp us</a></p>
            {storeSettings?.gst?.gstin && (
              <p className="flex gap-2"><BadgeCheck className="w-3.5 h-3.5 text-gold flex-shrink-0" /><span>GSTIN: <span className="font-mono text-zinc-300">{storeSettings.gst.gstin}</span></span></p>
            )}
          </address>
        </div>

        <Col title="Quick Links" links={[['/', 'Home'], ['/shop', 'Shop All'], ['/about', 'About'], ['/blog', 'Journal'], ['/faq', 'FAQs']]} />
        <Col title="My Account" links={[['/account', 'My Account'], ['/account/orders', 'Orders & Invoices'], ['/track-order', 'Track Order'], ['/wishlist', 'Wishlist'], ['/contact-us', 'Contact Us']]} />
        <Col
          title="More"
          links={[
            ['/terms-and-conditions', 'Terms and Conditions'],
            ['/privacy-policy', 'Privacy Policy'],
            ['/shipping-policy', 'Shipping Policy'],
            ['/refund-return-policy', 'Refund & Return Policy'],
          ]}
        />

        <div>
          <h3 className="font-serif text-xs text-gold tracking-widest uppercase mb-4 font-semibold">Stay in touch</h3>
          <p className="text-zinc-400 text-xs mb-3">New launches, beauty & fragrance tips and member-only offers.</p>
          {joined ? (
            <p className="text-emerald-300 text-xs">Thank you for subscribing!</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setJoined(true);
              }}
              className="space-y-2"
            >
              <label htmlFor="footer-email" className="sr-only">E-mail address</label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your e-mail"
                required
                className="w-full bg-zinc-900/80 border border-gold/30 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold"
              />
              <button type="submit" className="w-full btn-gold rounded-lg text-[10px] !py-2">Subscribe</button>
            </form>
          )}
          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">We accept</p>
            <div className="flex flex-wrap gap-2 text-zinc-300">
              {[
                [Smartphone, 'UPI'],
                [CreditCard, 'Cards'],
                [Landmark, 'Net Banking'],
                [Banknote, 'COD'],
              ].map(([Icon, l]) => (
                <span key={l} className="inline-flex items-center gap-1 text-[10px] border border-zinc-800 rounded-md px-2 py-1"><Icon className="w-3 h-3 text-gold" />{l}</span>
              ))}
            </div>
            <p className="text-[10px] text-zinc-600 mt-2">Payments secured by PhonePe Payment Gateway</p>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-900 py-6 px-4 text-zinc-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <p>
            Copyright © {new Date().getFullYear()} jayrup.in · {BRAND.tradeName} (under {BRAND.legalName} – {BRAND.registration}). All rights reserved.
          </p>
          <p className="text-gold/80">Made in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
};
