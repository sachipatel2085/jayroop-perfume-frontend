import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Sparkles, Flag, BadgeCheck, Target, HeartHandshake, Mail, Globe, ChevronRight } from 'lucide-react';
import { SEO } from '../components/seo/SEO.jsx';
import { OrganizationSchema } from '../components/seo/OrganizationSchema.jsx';
import { BreadcrumbSchema } from '../components/seo/BreadcrumbSchema.jsx';
import logoImg from '../assets/jayroop-logo.webp';
import { BRAND, legalIdentity } from '../config/site.js';
import { productService } from '../services/productService.js';

const DIFFERENT = [
  { icon: Leaf, title: 'Thoughtfully Chosen Ingredients', text: 'Herbal, skin-friendly and fine aromatic ingredients inspired by traditional Indian wellness and perfumery.' },
  { icon: ShieldCheck, title: 'Cosmetic Safety Focused', text: 'Every product – cosmetic or Ayurvedic medicine – is made by licensed, GMP-certified manufacturers following quality and safety guidelines.' },
  { icon: Sparkles, title: 'Simple & Effective', text: 'No unnecessary complexity — focused formulas and long-lasting fragrances that deliver what they promise.' },
  { icon: Flag, title: 'Made in India', text: 'Proudly developed and manufactured in India, for Indian skin, climate and lifestyles.' },
  { icon: BadgeCheck, title: 'Quality & Transparency', text: 'We believe in clear communication, honest branding, and authentic products.' },
];

const Bullet = ({ children }) => (
  <li className="flex items-start gap-3">
    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
    <span>{children}</span>
  </li>
);

export const AboutUs = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    productService
      .getCategories()
      .then((c) => Array.isArray(c) && setCategories(c))
      .catch(() => {});
  }, []);

  return (
  <div className="bg-noir min-h-screen text-zinc-100">
    <SEO
      title="About Jayrup – Skincare & Fragrances Made in India"
      description="Jayrup creates safe, effective and affordable skincare and long-lasting fragrances, combining traditional wisdom with modern cosmetic science. Learn about our journey, quality standards and vision."
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
            At Jayrup, we believe that looking and feeling your best should be simple, safe and affordable. Our goal is to create effective cosmetic and personal-care
            products — from skincare to long-lasting fragrances — that support everyday confidence.
          </p>
          <p className="mt-4 text-sm text-zinc-400 leading-relaxed max-w-2xl">
            Our journey began with Jayrup Pimples Cream and has grown into a range of skincare and perfumes, with more products on the way. Developed in India, every Jayrup
            product is made to suit Indian skin types, lifestyles and climate conditions — rooted in traditional inspiration, modern cosmetic standards and honest formulations.
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
            We combine traditional Indian knowledge — Ayurvedic botanicals and the art of perfumery — with modern cosmetic science to develop products that are gentle,
            effective and suitable for regular use.
          </p>
          <p className="mt-4 text-zinc-400 leading-relaxed">
            Every Jayrup product is created with a focus on safety, consistency and real results, without unnecessary additives.
          </p>
        </div>
        <div className="bg-noir-card border border-gold/20 rounded-2xl p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold mb-4">Every product is designed to</p>
          <ul className="space-y-3 text-zinc-200">
            <Bullet>Be safe for regular, everyday use</Bullet>
            <Bullet>Deliver visible results and lasting performance</Bullet>
            <Bullet>Offer honest quality at a fair price</Bullet>
          </ul>
        </div>
      </section>

      {/* Our range – built from the live catalogue, so new categories appear automatically */}
      <section className="bg-gradient-to-br from-gold/[0.08] to-transparent border border-gold/20 rounded-3xl p-6 sm:p-10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Our Range</p>
        <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider mt-2">Explore Jayrup</h2>
        <p className="mt-4 text-zinc-300 leading-relaxed max-w-3xl">
          From our first product, Jayrup Pimples Cream – an Ayurvedic cream for pimple-prone skin – to our long-lasting Royal Flora perfume, every Jayrup product carries the same promise of quality, safety and
          customer trust.
        </p>
        {categories.length > 0 && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/category/${c.slug}`}
                className="group bg-noir-card border border-zinc-800 hover:border-gold/50 rounded-xl p-4 flex items-center justify-between gap-3 transition-colors"
              >
                <span className="text-sm font-semibold text-zinc-100 group-hover:text-gold">{c.name}</span>
                <ChevronRight className="w-4 h-4 text-gold" />
              </Link>
            ))}
          </div>
        )}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <p className="text-xs text-amber-100/80 rounded-lg border border-amber-500/30 bg-amber-500/[0.06] px-4 py-3 leading-relaxed">
            Jayrup products are cosmetics and Ayurvedic proprietary medicines for external use, made by licensed manufacturers in line with applicable Indian standards. Please read the label before use.
          </p>
          <Link to="/shop" className="btn-gold self-start sm:self-auto whitespace-nowrap">Shop all products</Link>
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
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">Our vision is to grow Jayrup into a trusted Indian beauty and fragrance brand offering products that support:</p>
          <ul className="mt-3 space-y-1.5 text-sm text-zinc-300">
            <Bullet>Healthy, clear skin</Bullet>
            <Bullet>Signature fragrances for every day</Bullet>
            <Bullet>Everyday confidence</Bullet>
          </ul>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            As we expand, new products will be introduced under the Jayrup brand with the same focus on quality, safety, and customer trust.
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
          {legalIdentity()} operates as a brand owner and marketer. All products are manufactured by licensed third-party cosmetic manufacturers and marketed under the
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
};

export default AboutUs;
