import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Sparkles, Flag, BadgeCheck, Target, HeartHandshake, Mail, Globe, ChevronRight } from 'lucide-react';
import { SEO } from '../components/seo/SEO.jsx';
import { OrganizationSchema } from '../components/seo/OrganizationSchema.jsx';
import { BreadcrumbSchema } from '../components/seo/BreadcrumbSchema.jsx';
import logoImg from '../assets/jayroop-logo.webp';
import { BRAND } from '../config/site.js';

const DIFFERENT = [
  { icon: Leaf, title: 'Ayurvedic Inspired Ingredients', text: 'Carefully selected herbal and skin-friendly components inspired by traditional wellness practices.' },
  { icon: ShieldCheck, title: 'Cosmetic Safety Focused', text: 'Formulated as a Class 3 Cosmetic Product, following quality and safety guidelines.' },
  { icon: Sparkles, title: 'Simple & Effective Formulas', text: 'No unnecessary complexity — just focused skincare that works.' },
  { icon: Flag, title: 'Made in India', text: 'Proudly developed and manufactured in India for Indian skin needs.' },
  { icon: BadgeCheck, title: 'Quality & Transparency', text: 'We believe in clear communication, honest branding, and authentic products.' },
];

const Bullet = ({ children }) => (
  <li className="flex items-start gap-3">
    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
    <span>{children}</span>
  </li>
);

export const AboutUs = () => (
  <div className="bg-noir min-h-screen text-zinc-100">
    <SEO
      title="About Jayrup – Ayurvedic-Inspired Skincare Made in India"
      description="Jayrup creates safe, effective and affordable cosmetic skincare inspired by Ayurveda and modern cosmetic science. Learn about Jayrup Pimples Cream, our philosophy, quality standards and vision."
      canonicalUrl="/about"
    >
      <OrganizationSchema />
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }]} />
    </SEO>

    {/* Hero */}
    <section className="relative overflow-hidden border-b border-gold/15">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_60%)]" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-center">
        <div>
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-gold">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gold">About</span>
          </nav>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold font-semibold">About Us</p>
          <h1 className="font-serif text-4xl sm:text-5xl uppercase tracking-wider font-bold mt-3">About Jayrup</h1>
          <p className="mt-6 text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
            At Jayrup, we believe that clear, healthy skin should be achievable without harsh chemicals or complicated routines. Our goal is to create safe, effective, and
            affordable cosmetic skincare products that support everyday skin confidence.
          </p>
          <p className="mt-4 text-sm text-zinc-400 leading-relaxed max-w-2xl">
            Jayrup Pimples Cream is our first step toward building a trusted Indian skincare brand rooted in Ayurvedic inspiration, modern cosmetic standards, and honest
            formulations. Developed in India, Jayrup is focused on delivering skincare solutions that suit Indian skin types, lifestyles, and climate conditions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-gold">Shop Jayrup</Link>
            <Link to="/contact-us" className="btn-outline-gold">Contact Us</Link>
          </div>
        </div>
        <div className="hidden lg:flex justify-center">
          <img src={logoImg} alt="Jayrup logo" width="300" height="300" className="w-72 h-72 object-contain drop-shadow-[0_0_40px_rgba(212,175,55,0.25)]" loading="eager" />
        </div>
      </div>
    </section>

    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 space-y-20">
      {/* Philosophy */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider">Our Philosophy</h2>
          <p className="mt-4 text-zinc-400 leading-relaxed">
            We combine traditional Ayurvedic knowledge with modern cosmetic science to develop products that are gentle, effective, and suitable for regular use.
          </p>
          <p className="mt-4 text-zinc-400 leading-relaxed">
            Every Jayrup product is created with a focus on skin safety, consistency, and visible results, without unnecessary additives.
          </p>
        </div>
        <div className="bg-noir-card border border-gold/20 rounded-2xl p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold mb-4">Our formulations are designed to</p>
          <ul className="space-y-3 text-zinc-200">
            <Bullet>Support reduction of pimples and acne marks</Bullet>
            <Bullet>Help control excess oil</Bullet>
            <Bullet>Promote clearer-looking, healthier skin</Bullet>
          </ul>
        </div>
      </section>

      {/* First product */}
      <section className="bg-gradient-to-br from-gold/[0.08] to-transparent border border-gold/20 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Our First Product</p>
          <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider mt-2">Jayrup Pimples Cream</h2>
          <p className="mt-4 text-zinc-300 leading-relaxed">
            Jayrup Pimples Cream is an Ayurvedic-inspired cosmetic skincare product formulated for people dealing with:
          </p>
          <ul className="mt-4 space-y-2 text-zinc-200">
            <Bullet>Pimples &amp; acne</Bullet>
            <Bullet>Acne marks</Bullet>
            <Bullet>Oily and uneven skin</Bullet>
          </ul>
          <p className="mt-4 text-zinc-400 leading-relaxed">With regular use, it helps improve the appearance of skin while fitting seamlessly into daily skincare routines.</p>
        </div>
        <div className="flex flex-col justify-between gap-6">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-5 text-sm text-amber-100/90 leading-relaxed">
            Jayrup Pimples Cream is intended for external use only and complies with applicable cosmetic safety standards.
          </div>
          <Link to="/shop" className="btn-gold self-start">View product</Link>
        </div>
      </section>

      {/* What makes us different */}
      <section>
        <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-center">What Makes Jayrup Different</h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DIFFERENT.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-noir-card border border-zinc-800 hover:border-gold/40 rounded-2xl p-6 transition-colors">
              <span className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-4"><Icon className="w-5 h-5" /></span>
              <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trademark / Vision / Commitment */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-noir-card border border-zinc-800 rounded-2xl p-6">
          <BadgeCheck className="w-6 h-6 text-gold mb-3" />
          <h2 className="font-serif text-lg uppercase tracking-wider">Trademark &amp; Authenticity</h2>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            The brand “Jayrup Pimples Cream” is a trademark applied under the Trade Marks Act, 1999 (Class 3 – Cosmetics). We are committed to protecting our brand identity
            and delivering genuine, authentic products to our customers.
          </p>
        </div>
        <div className="bg-noir-card border border-zinc-800 rounded-2xl p-6">
          <Target className="w-6 h-6 text-gold mb-3" />
          <h2 className="font-serif text-lg uppercase tracking-wider">Our Vision</h2>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">Our vision is to grow Jayrup into a trusted cosmetic skincare brand offering multiple products that support:</p>
          <ul className="mt-3 space-y-1.5 text-sm text-zinc-300">
            <Bullet>Clear skin</Bullet>
            <Bullet>Healthy routines</Bullet>
            <Bullet>Everyday confidence</Bullet>
          </ul>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            As we expand, new skincare solutions will be introduced under the Jayrup brand with the same focus on quality, safety, and customer trust.
          </p>
        </div>
        <div className="bg-noir-card border border-zinc-800 rounded-2xl p-6">
          <HeartHandshake className="w-6 h-6 text-gold mb-3" />
          <h2 className="font-serif text-lg uppercase tracking-wider">Our Commitment</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-zinc-300">
            <Bullet>Quality-focused manufacturing</Bullet>
            <Bullet>Ethical cosmetic practices</Bullet>
            <Bullet>Customer satisfaction</Bullet>
            <Bullet>Continuous improvement</Bullet>
          </ul>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">We are here to build long-term trust, not just sell products.</p>
        </div>
      </section>

      <section className="border-t border-zinc-800 pt-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
        <p className="text-sm text-zinc-500 leading-relaxed max-w-3xl">
          Jayrup Pimples Cream operates as a brand owner and marketer. All products are manufactured by licensed third-party cosmetic manufacturers and marketed under the
          Jayrup brand in compliance with Indian laws.
        </p>
        <div className="bg-noir-card border border-gold/20 rounded-xl p-5 text-sm min-w-[260px]">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold mb-2">Contact Us</p>
          <p className="font-semibold">{BRAND.tradeName}</p>
          <p className="flex items-center gap-2 text-zinc-400 mt-2"><Mail className="w-4 h-4 text-gold" /><a href={`mailto:${BRAND.email}`} className="hover:text-gold">{BRAND.email}</a></p>
          <p className="flex items-center gap-2 text-zinc-400 mt-1"><Globe className="w-4 h-4 text-gold" />https://jayrup.in</p>
        </div>
      </section>
    </div>
  </div>
);

export default AboutUs;
