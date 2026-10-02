import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, HeartHandshake, Compass, Award, ArrowRight, Droplets, Leaf } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead.jsx';
import logoImg from '../assets/jayroop-logo.webp';

export const AboutUs = () => {
  return (
    <div className="bg-noir min-h-screen text-zinc-100 overflow-hidden">
      <SEOHead
        title="About Us | Jayroop (JR) Royal Fragrance & Skincare House"
        description="Discover the heritage, artisanal distillation, and Ayurvedic skincare science behind Jayroop. पिंपल्स भागे, आत्मविश्वास जागे."
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-24 sm:pt-28 sm:pb-32 px-4 sm:px-8 border-b border-gold/20 flex flex-col items-center text-center">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-noir pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Logo Emblem */}
          <div className="inline-block p-1 rounded-full border-2 border-gold/50 shadow-gold-glow mb-2">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-noir">
              <img
                src={logoImg}
                alt="Jayroop Royal House Crest"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-noir-card text-gold text-xs uppercase tracking-[0.25em] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-amber" />
            <span>The Heritage of Jayroop (जयरूप)</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl uppercase tracking-wider font-bold text-zinc-100 leading-tight">
            Crafting Regal Fragrance & <br />
            <span className="text-gradient-gold">Enduring Confidence</span>
          </h1>

          {/* Hindi Slogan Pill */}
          <div className="inline-block">
            <span className="bg-gradient-to-r from-gold-amber via-gold to-gold-amber text-black text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full tracking-wider shadow-md">
              पिंपल्स भागे, आत्मविश्वास जागे
            </span>
          </div>

          <p className="text-sm sm:text-base text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed pt-2">
            Jayroop Royal House unites the time-honored artisanal distillation traditions of princely India with modern dermatological botanical purity — creating extraordinary extraits de parfum and transformative skincare formulations.
          </p>
        </div>
      </section>

      {/* 2. THE GENESIS & BRAND STORY */}
      <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-gold text-xs uppercase tracking-[0.2em] font-medium">
              <Compass className="w-4 h-4" />
              <span>Our Genesis</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl uppercase tracking-wider font-bold text-zinc-100 leading-snug">
              Born from the Splendor of Royal Courtyards
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              In the historic realms of India, fragrance was never an afterthought — it was an imperial signature, a veil of majesty, and an unspoken proclamation of regal aura. Fragrant oils distilled from Kannauj damask roses, wild Assamese agarwood, Kashmiri saffron, and sandalwood were aged in cool cellars to grace noble courts.
            </p>

            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              <strong>Jayroop (JR)</strong> was established to revive this magnificent heritage for the modern connoisseur. Each creation is formulated without dilution, utilizing unprecedented perfume oil concentrations (Extrait de Parfum at 30%+) to deliver timeless sillage that lingers from twilight until dawn.
            </p>

            <div className="border-l-2 border-gold pl-4 py-1 text-xs text-gold/90 italic font-serif">
              "To wear Jayroop is not merely to adorn a scent; it is to step into your sovereign self."
            </div>
          </div>

          <div className="relative">
            <div className="relative border border-gold/30 bg-noir-card p-3 shadow-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1000"
                alt="Artisanal perfume bottles"
                className="w-full h-80 sm:h-96 object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-noir/90 backdrop-blur-md border border-gold/20">
                <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Artisanal Maturation</p>
                <p className="text-xs text-zinc-300 mt-0.5">Slow-macerated in small batches with rare authentic botanicals.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE CONFIDENCE REVOLUTION — "पिंपल्स भागे, आत्मविश्वास जागे" */}
      <section className="py-20 px-4 sm:px-8 bg-noir-card border-y border-gold/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="relative border border-gold/30 bg-noir p-3 shadow-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1608248597359-01582236a31f?auto=format&fit=crop&q=80&w=1000"
                alt="Botanical skincare ingredients"
                className="w-full h-80 sm:h-96 object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-noir/90 backdrop-blur-md border border-gold/20">
                <span className="bg-gold-amber text-black text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                  Jayroop Special
                </span>
                <p className="text-xs text-zinc-200 font-semibold mt-1">Holistic Herbal Acne & Skin Clarifying Mastery</p>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 text-gold-amber text-xs uppercase tracking-[0.2em] font-medium">
              <Leaf className="w-4 h-4" />
              <span>Skin Transformation</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl uppercase tracking-wider font-bold text-zinc-100 leading-snug">
              True Royalty Begins with Inner Radiance
            </h2>

            <div className="inline-block bg-gold/15 border border-gold/40 px-3 py-1 text-gold text-xs font-semibold rounded">
              पिंपल्स भागे, आत्मविश्वास जागे
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              We believe that genuine luxury transcends outward fragrance — it stems from supreme self-assurance and unblemished skin health. When stubborn acne and imperfections compromise your spirit, your true royal essence is veiled.
            </p>

            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              This conviction sparked the creation of our renowned <strong>Jayroop Special Pimples Cream</strong>. Developed through painstaking Ayurvedic research, this specialized cream blends pure Kashmiri saffron, wild neem bark, turmeric rhizome, and calming botanicals to target root impurities without stinging or drying the skin.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-noir p-3 border border-zinc-800">
                <p className="font-serif text-lg text-gold font-bold">100%</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Herbal Actives</p>
              </div>
              <div className="bg-noir p-3 border border-zinc-800">
                <p className="font-serif text-lg text-gold font-bold">0%</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Steroids or Bleach</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE FOUR PILLARS OF ROYALTY */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold block mb-3">
          Our Unwavering Standards
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl uppercase tracking-wider font-bold text-zinc-100 mb-14">
          The Four Royal Pillars
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {/* Pillar 1 */}
          <div className="bg-noir-card border border-gold/20 hover:border-gold/60 p-6 transition-all duration-300 group">
            <div className="w-10 h-10 rounded border border-gold/40 flex items-center justify-center text-gold mb-4 group-hover:bg-gold/10 transition-colors">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm uppercase tracking-wider font-bold text-zinc-100 mb-2">
              Extrait Potency
            </h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              We never produce weak dilutions. Our fragrances are crafted at true Extrait de Parfum concentration (30%+), ensuring superior performance that commands respect.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-noir-card border border-gold/20 hover:border-gold/60 p-6 transition-all duration-300 group">
            <div className="w-10 h-10 rounded border border-gold/40 flex items-center justify-center text-gold mb-4 group-hover:bg-gold/10 transition-colors">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm uppercase tracking-wider font-bold text-zinc-100 mb-2">
              Botanical Purity
            </h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Only authentic botanicals, wild-harvested herbs, and sustainably distilled essences are admitted into our royal formulations. Completely free from toxins.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-noir-card border border-gold/20 hover:border-gold/60 p-6 transition-all duration-300 group">
            <div className="w-10 h-10 rounded border border-gold/40 flex items-center justify-center text-gold mb-4 group-hover:bg-gold/10 transition-colors">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm uppercase tracking-wider font-bold text-zinc-100 mb-2">
              Artisanal Crystalline Flacons
            </h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Housed in heavyweight crystalline glass vessels with gold-finished caps and regal emblems, engineered to be centerpiece heirlooms on your vanity.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-noir-card border border-gold/20 hover:border-gold/60 p-6 transition-all duration-300 group">
            <div className="w-10 h-10 rounded border border-gold/40 flex items-center justify-center text-gold mb-4 group-hover:bg-gold/10 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm uppercase tracking-wider font-bold text-zinc-100 mb-2">
              Ethical & Cruelty-Free
            </h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Cruelty-free by sacred principle. We never test on animals and support fair, regenerative Indian agricultural communities in Assam, Kashmir, and Kannauj.
            </p>
          </div>
        </div>
      </section>

      {/* 5. ROYAL CONCIERGE & INVITATION CTA */}
      <section className="py-20 px-4 sm:px-8 border-t border-gold/20 bg-gradient-to-b from-noir to-noir-card text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
            Begin Your Regal Journey
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl uppercase tracking-wider font-bold text-zinc-100">
            Experience the Distillations of Royalty
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl mx-auto leading-relaxed">
            Step into the world of Jayroop. Discover our signature fragrances, explore the Jayroop Special Skincare collection, or consult our Royal Concierge for personalized recommendations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/category/perfumes" className="btn-gold text-xs py-3 px-8">
              Explore Fragrances
            </Link>
            <Link to="/category/skincare" className="btn-outline-gold text-xs py-3 px-8">
              Explore Skincare
            </Link>
            <Link to="/blog" className="px-6 py-3 text-xs uppercase tracking-widest text-zinc-300 hover:text-gold transition-colors">
              Read Our Blog →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
