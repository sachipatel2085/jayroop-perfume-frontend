import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  Scale,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Gavel,
  BookOpen,
  Mail,
  Phone,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead.jsx';

export const TermsOfService = () => {
  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-10 px-4 sm:px-8 max-w-6xl mx-auto">
      <SEOHead
        title="Terms of Service & Patron Agreement | Jayrup Royal House"
        description="Review the legal terms, conditions of purchase, intellectual property rights, and consumer agreements of Jayrup (जयरूप) Royal Luxury House."
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500 mb-8">
        <Link to="/" className="hover:text-gold transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gold font-medium">Terms of Service</span>
      </nav>

      {/* Header Banner */}
      <header className="relative border-b border-gold/25 pb-8 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-[10px] uppercase tracking-[0.2em] font-semibold mb-4">
          <Scale className="w-3.5 h-3.5 text-gold" />
          <span>Legal Agreement & Covenant</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-zinc-100 font-bold">
          Terms of Service & <br className="hidden sm:inline" />
          <span className="text-gradient-gold">Patron Covenant</span>
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 mt-3 max-w-2xl leading-relaxed">
          These Terms of Service govern your access to and procurement of creations from the official online boutique of <strong>JAYRUP (JR) ROYAL LUXURY HOUSE</strong>. By utilizing our portal, you enter into a binding covenant with us.
        </p>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-500 mt-4">
          <span>Governed by Indian Law</span>
          <span>•</span>
          <span>Jurisdiction: Mumbai, Maharashtra</span>
          <span>•</span>
          <span className="text-gold/90">Last Updated: October 2026</span>
        </div>
      </header>

      {/* Core Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        <div className="p-5 bg-noir-card border border-gold/20 flex flex-col justify-between">
          <div className="p-2.5 bg-gold/10 text-gold rounded w-fit mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              Clear Covenant
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              Transparent terms governing catalog access, ordering, and delivery.
            </p>
          </div>
        </div>

        <div className="p-5 bg-noir-card border border-gold/20 flex flex-col justify-between">
          <div className="p-2.5 bg-gold/10 text-gold rounded w-fit mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              Authentic Creations
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              100% genuine Extrait de Parfum and dermatological Ayurvedic cosmetics.
            </p>
          </div>
        </div>

        <div className="p-5 bg-noir-card border border-gold/20 flex flex-col justify-between">
          <div className="p-2.5 bg-gold/10 text-gold rounded w-fit mb-3">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              Consumer Rights
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              Protected under Consumer Protection (E-Commerce) Rules, 2020.
            </p>
          </div>
        </div>

        <div className="p-5 bg-noir-card border border-gold/20 flex flex-col justify-between">
          <div className="p-2.5 bg-gold/10 text-gold rounded w-fit mb-3">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              Arbitration & Redress
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              Expedited grievance redressal with statutory response within 48 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="space-y-12 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>1. Acceptance of Terms</span>
          </h2>
          <p>
            By visiting <strong>jayrup.com</strong>, browsing our treasury, creating an account, or placing an order, you agree to be bound by these Terms of Service, our Privacy Policy, and our Shipping and Return policies. If you do not accept these terms in their entirety, you must discontinue your use of this boutique.
          </p>
          <p>
            You affirm that you are at least 18 years of age or possess legal parental or guardian consent to execute financial transactions on our portal.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>2. Creations, Batch Maturation & Pricing</span>
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-zinc-300">
            <li>
              <strong>Artisanal Formulation Variations:</strong> Our Extraits de Parfum are handcrafted utilizing rare raw essences (natural Kannauj Damask rose, Assamese agarwood oil, aged vetiver, saffron extracts). Because natural harvests vary slightly between seasons, subtle shifts in color or aromatic nuance are natural hallmarks of genuine perfumery rather than defects.
            </li>
            <li>
              <strong>Pricing & Taxes:</strong> All prices displayed on our website are denominated in Indian Rupees (INR) and are inclusive of all statutory Goods and Services Tax (GST) unless explicitly noted.
            </li>
            <li>
              <strong>Typographical Discrepancies:</strong> In the rare instance an item is cataloged with an incorrect price due to technical error, Jayrup reserves the right to cancel the affected order and issue an immediate 100% refund.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>3. Order Acceptance, Instant Checkout & Payment</span>
          </h2>
          <p>
            Your order constitutes an offer to purchase. An order is confirmed when we generate a unique Order Identifier (e.g. <em>JR-XXXX</em>) and payment is received or COD is verified.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-300">
            <li>
              <strong>Instant Royal Checkout Isolation:</strong> Selecting "Instant Royal Checkout" creates an isolated transaction for that specific creation. Other items residing in your Royal Bag remain preserved for future checkout.
            </li>
            <li>
              <strong>Payment Gateways:</strong> We accept online payments via RBI-authorized gateway <strong>Razorpay</strong> (UPI, Credit/Debit Cards, NetBanking, RuPay) and Cash on Delivery (COD) up to ₹50,000 per order.
            </li>
            <li>
              <strong>Right to Cancel:</strong> We reserve the right to refuse or cancel orders suspected of commercial unauthorized reselling, fraud, or automated script scraping.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>4. Intellectual Property Rights</span>
          </h2>
          <p>
            All content published on this portal — including but not limited to the brand name <strong>JAYRUP (JR)</strong>, the royal crest logo, typography, product names, fragrance descriptions, photography, video recordings, software code, and the distinctive brand motto <em>"पिंपल्स भागे, आत्मविश्वास जागे"</em> — is the exclusive intellectual property of <strong>Jayrup Royal Luxury House</strong> protected under the Indian Copyright Act, 1957 and Trade Marks Act, 1999.
          </p>
          <p className="text-zinc-400 text-xs">
            Any reproduction, duplication, redistribution, or unauthorized commercial exploitation of our trademarked marks, imagery, or textual copy without prior written consent is strictly prohibited and subject to civil and criminal legal action.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>5. Cosmetic & Dermatological Patch Test Advisory</span>
          </h2>
          <div className="p-4 bg-noir-card border border-gold/30 rounded space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gold">
              Patron Health & Sensitivity Disclaimer
            </h3>
            <p className="text-zinc-300 text-xs">
              While Jayrup skincare and fragrance formulations are crafted with pure herbal botanical extracts and dermatologist-tested ingredients, individual skin biologies and allergies vary.
            </p>
            <p className="text-zinc-400 text-[11px]">
              We advise patrons with hypersensitive skin to conduct a simple 24-hour patch test on the inner forearm or wrist before complete topical application. In case of unexpected redness, irritation, or discomfort, discontinue use immediately and rinse thoroughly with cool water.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>6. Limitation of Liability</span>
          </h2>
          <p>
            To the maximum extent permissible under applicable Indian jurisprudence, Jayrup Royal Luxury House, its directors, master distillers, and affiliates shall not be liable for any indirect, incidental, or consequential damages resulting from website downtime, minor delays in courier transit caused by force majeure events, or individual skin sensitivities.
          </p>
          <p className="text-xs text-zinc-400">
            In any event, our maximum aggregate liability to you for any claim arising out of your purchase shall be strictly limited to the actual amount paid by you for the specific creation in question.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>7. Governing Law & Dispute Resolution</span>
          </h2>
          <p>
            These Terms of Service and any transactional disputes arising out of the purchase of Jayrup creations shall be governed by and construed in accordance with the laws of the Republic of India.
          </p>
          <p>
            Any dispute, claim, or controversy shall first be subjected to amicable conciliation with our Nodal Grievance Officer. If unresolved within 30 days, it shall be submitted to the exclusive jurisdiction of the competent courts of law in <strong>Mumbai, Maharashtra, India</strong>.
          </p>
        </section>
      </div>

      {/* Footer Concierge Strip */}
      <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/privacy-policy" className="text-xs text-gold hover:underline">
          &larr; View Privacy Policy Charter
        </Link>
        <Link to="/contact" className="btn-gold text-xs py-2.5 px-6">
          Contact Legal Concierge
        </Link>
      </div>
    </div>
  );
};
