import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, RotateCcw, AlertCircle, Send, CheckCircle2, Clock, ChevronRight, BadgeCheck } from 'lucide-react';
import { SEO } from '../components/seo/SEO.jsx';
import { OrganizationSchema } from '../components/seo/OrganizationSchema.jsx';
import { BreadcrumbSchema } from '../components/seo/BreadcrumbSchema.jsx';
import { contactService } from '../services/contactService.js';
import { Input, Select, Textarea, Alert } from '../components/ui/Field.jsx';
import { BRAND, fullAddress } from '../config/site.js';
import { useStoreSettings, legalFrom } from '../hooks/useStoreSettings.js';
import { SocialLinks } from '../components/common/SocialLinks.jsx';

const SUBJECTS = [
  'General Inquiry',
  'Order & Tracking Inquiry',
  'Return & Replacement Request',
  'Complaint',
  'Payment Issue',
  'Product Question',
  'Wholesale & Corporate Gifting',
  'Grievance & Feedback',
];

export const ContactUs = () => {
  const storeSettings = useStoreSettings();
  const legal = legalFrom(storeSettings, BRAND);
  const [form, setForm] = useState({ name: '', email: '', phone: '', orderNumber: '', subject: 'General Inquiry', message: '', website: '' });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      setStatus(null);
      const res = await contactService.submitInquiry(form);
      setStatus({ tone: 'success', text: res?.message || 'Thank you! We will get back to you shortly.' });
      setForm({ name: '', email: '', phone: '', orderNumber: '', subject: 'General Inquiry', message: '', website: '' });
    } catch (err) {
      setStatus({ tone: 'error', text: err.message });
    } finally {
      setSending(false);
    }
  };

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const mapQuery = encodeURIComponent('Metropolis Complex, Gambhoi, Himatnagar, Sabarkantha, Gujarat 383030');

  return (
    <div className="bg-noir min-h-screen text-zinc-100">
      <SEO
        title="Contact Jayrup – Customer Care, Orders & Returns"
        description="Questions about a Jayrup product or your order? Call +91 94081 33100 or email care@jayrup.in. Business address: G-28 Metropolis Complex, Gambhoi, Himatnagar, Gujarat 383030."
        canonicalUrl="/contact-us"
      >
        <OrganizationSchema />
        <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'Contact Us', url: '/contact-us' }]} />
      </SEO>

      <header className="border-b border-gold/15 bg-gradient-to-b from-gold/[0.06] to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-14">
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500 mb-5" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-gold">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gold">Contact Us</span>
          </nav>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold font-semibold">Have any queries?</p>
          <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider font-bold mt-2">We’re here to help.</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-14 space-y-14">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-noir-card border border-gold/20 rounded-2xl p-6">
            <AlertCircle className="w-6 h-6 text-gold mb-3" />
            <h2 className="font-serif text-lg uppercase tracking-wider">Complaints</h2>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              We’re sorry if something didn’t meet your expectations. Please share your concern, and our support team will get back to you promptly to resolve it with care.
            </p>
            <a href={BRAND.phoneHref} className="mt-4 inline-flex items-center gap-2 text-gold font-semibold"><Phone className="w-4 h-4" />{BRAND.phone}</a>
          </div>
          <div className="bg-noir-card border border-gold/20 rounded-2xl p-6">
            <RotateCcw className="w-6 h-6 text-gold mb-3" />
            <h2 className="font-serif text-lg uppercase tracking-wider">Returns</h2>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              If you received a damaged or incorrect product, don’t worry — we’ve got you covered. Kindly contact us within 7 days of delivery with your order details, and
              we’ll assist you through our easy return or replacement process.
            </p>
            <a href={`mailto:${BRAND.email}`} className="mt-4 inline-flex items-center gap-2 text-gold font-semibold"><Mail className="w-4 h-4" />{BRAND.email}</a>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Don’t be a stranger!</p>
              <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider mt-2">You tell us. We listen.</h2>
              <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
                At Jayrup, your voice matters to us. Whether it’s a question about our products, feedback on your experience, or a suggestion to help us improve —
                we’re always here to listen and assist you.
              </p>
              <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                Your satisfaction is our priority, and we’re committed to providing you with smooth, reliable, and friendly support every time.
              </p>
            </div>

            <div className="bg-noir-card border border-zinc-800 rounded-2xl p-6 space-y-4 text-sm">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Business</p>
              <p className="font-semibold text-zinc-100">{legal.legalName}</p>
              <p className="text-xs text-zinc-500 -mt-2">Owner of the {legal.brand} brand</p>
              <p className="flex gap-3 text-zinc-400"><MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" /><span><span className="text-zinc-500 block text-xs">Business address</span>{legal.legalName}, {fullAddress()}</span></p>
              <p className="flex gap-3 text-zinc-400"><Phone className="w-4 h-4 text-gold" /><a href={BRAND.phoneHref} className="hover:text-gold">{BRAND.phone}</a></p>
              <p className="flex gap-3 text-zinc-400"><Mail className="w-4 h-4 text-gold" /><a href={`mailto:${BRAND.email}`} className="hover:text-gold">{BRAND.email}</a></p>
              <p className="flex gap-3 text-zinc-400"><MessageCircle className="w-4 h-4 text-gold" /><a href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-gold">Chat on WhatsApp</a></p>
              {storeSettings?.gst?.gstin && (
                <p className="flex gap-3 text-zinc-400"><BadgeCheck className="w-4 h-4 text-gold" /><span>GSTIN: <span className="font-mono text-zinc-200">{storeSettings.gst.gstin}</span></span></p>
              )}
              <p className="flex gap-3 text-zinc-400"><Clock className="w-4 h-4 text-gold" />Mon – Sat, 10:00 AM – 6:00 PM IST</p>
              {legal.social.length > 0 && (
                <div className="pt-2 border-t border-zinc-800">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gold mb-2">Follow us</p>
                  <SocialLinks links={legal.social} />
                </div>
              )}
            </div>
          </div>

          <form onSubmit={submit} className="bg-noir-card border border-gold/25 rounded-2xl p-6 sm:p-8 space-y-4" noValidate={false}>
            <h2 className="font-serif text-lg uppercase tracking-wider text-gold">Send us a message</h2>
            {status && (
              <Alert tone={status.tone}>
                {status.tone === 'success' && <CheckCircle2 className="w-4 h-4 inline mr-1.5" />}
                {status.text}
              </Alert>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Name" required name="name" autoComplete="name" value={form.name} onChange={f('name')} />
              <Input label="Email" required type="email" name="email" autoComplete="email" value={form.email} onChange={f('email')} />
              <Input label="Phone" type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={f('phone')} />
              <Input label="Order number" name="orderNumber" placeholder="JR-…" value={form.orderNumber} onChange={f('orderNumber')} />
            </div>
            <Select label="Subject" name="subject" value={form.subject} onChange={f('subject')}>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </Select>
            <Textarea label="Comment or Message" required name="message" rows={6} maxLength={3000} value={form.message} onChange={f('message')} />
            {/* honeypot – hidden from humans */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={f('website')} className="hidden" aria-hidden="true" />
            <button type="submit" disabled={sending} className="btn-gold rounded-lg w-full sm:w-auto">
              <Send className="w-4 h-4 mr-2" /> {sending ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </section>

        <section className="rounded-2xl overflow-hidden border border-zinc-800">
          <iframe
            title="Jayrup business location on Google Maps"
            src={`https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`}
            className="w-full h-80 grayscale-[40%] invert-[90%] hue-rotate-180"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      </div>
    </div>
  );
};

export default ContactUs;
