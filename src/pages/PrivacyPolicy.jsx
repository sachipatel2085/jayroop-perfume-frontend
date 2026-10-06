import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Sparkles,
  Server,
  CreditCard,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead.jsx';

export const PrivacyPolicy = () => {
  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-10 px-4 sm:px-8 max-w-6xl mx-auto">
      <SEOHead
        title="Privacy Policy & Patron Data Protection Charter | Jayrup Royal House"
        description="Learn how Jayrup (जयरूप) protects your personal data, ensures 256-bit bank-grade payment security, and complies with DPDP Act 2023."
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500 mb-8">
        <Link to="/" className="hover:text-gold transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gold font-medium">Privacy Policy</span>
      </nav>

      {/* Header Banner */}
      <header className="relative border-b border-gold/25 pb-8 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-[10px] uppercase tracking-[0.2em] font-semibold mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-gold" />
          <span>Patron Confidentiality & Trust</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-zinc-100 font-bold">
          Privacy Policy & <br className="hidden sm:inline" />
          <span className="text-gradient-gold">Data Protection Charter</span>
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 mt-3 max-w-2xl leading-relaxed">
          At Jayrup (जयरूप) Royal Luxury House, we revere your privacy with the same sacred precision that guides our perfume extraits and herbal skincare formulations. This charter explains how your personal data is collected, safeguarded, and respected.
        </p>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-500 mt-4">
          <span>Effective Date: October 2026</span>
          <span>•</span>
          <span>Compliant with DPDP Act 2023 & Indian IT Act 2000</span>
          <span>•</span>
          <span className="text-gold/90">Version 2.4</span>
        </div>
      </header>

      {/* Trust Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        <div className="p-5 bg-noir-card border border-gold/20 flex flex-col justify-between">
          <div className="p-2.5 bg-gold/10 text-gold rounded w-fit mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              256-Bit SSL Encryption
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              All transactions, transmissions, and passwords are encrypted end-to-end.
            </p>
          </div>
        </div>

        <div className="p-5 bg-noir-card border border-gold/20 flex flex-col justify-between">
          <div className="p-2.5 bg-gold/10 text-gold rounded w-fit mb-3">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              Zero Card Storage
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              Payment credentials are never saved on our servers. Processed via Razorpay (PCI-DSS Level 1).
            </p>
          </div>
        </div>

        <div className="p-5 bg-noir-card border border-gold/20 flex flex-col justify-between">
          <div className="p-2.5 bg-gold/10 text-gold rounded w-fit mb-3">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              No Data Selling
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              We never rent, lease, or monetize your contact or purchase information to third parties.
            </p>
          </div>
        </div>

        <div className="p-5 bg-noir-card border border-gold/20 flex flex-col justify-between">
          <div className="p-2.5 bg-gold/10 text-gold rounded w-fit mb-3">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              Patron Sovereignty
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              Full rights to inspect, update, or purge your account and communication records anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-12 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>1. Preamble & Scope of Agreement</span>
          </h2>
          <p>
            This Privacy Policy governs the collection, processing, storage, and transfer of personal information collected through our official portal (<strong>jayrup.com</strong>), mobile interfaces, concierge helplines, and affiliated communication channels operated by <strong>JAYRUP (JR) ROYAL LUXURY HOUSE</strong> (hereinafter referred to as <em>"Jayrup"</em>, <em>"we"</em>, <em>"us"</em>, or <em>"our"</em>).
          </p>
          <p>
            By accessing our treasury, initiating a Royal Instant Checkout, creating a patron account, or interacting with our concierge, you unequivocally consent to the data practices documented within this policy in compliance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 and the Digital Personal Data Protection Act, 2023 (DPDP Act).
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>2. Information We Collect</span>
          </h2>
          <p>
            To deliver an extraordinary luxury experience and fulfill your orders, we collect information across three categories:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 bg-noir-card border border-zinc-800 rounded space-y-2">
              <h3 className="font-bold text-zinc-100 uppercase tracking-wider text-xs text-gold">
                A. Patron Identity Details
              </h3>
              <p className="text-[11px] text-zinc-400">
                Your full name, email address, primary mobile contact number, shipping and billing residential addresses, postal pin codes, and saved account credentials.
              </p>
            </div>

            <div className="p-4 bg-noir-card border border-zinc-800 rounded space-y-2">
              <h3 className="font-bold text-zinc-100 uppercase tracking-wider text-xs text-gold">
                B. Order & Payment Data
              </h3>
              <p className="text-[11px] text-zinc-400">
                Records of creations ordered, customized variant selections, transaction identifiers, payment methods (Razorpay UPI, Credit/Debit card token, or Cash on Delivery), and promotional privilege codes redeemed.
              </p>
            </div>

            <div className="p-4 bg-noir-card border border-zinc-800 rounded space-y-2">
              <h3 className="font-bold text-zinc-100 uppercase tracking-wider text-xs text-gold">
                C. Device & Digital Telemetry
              </h3>
              <p className="text-[11px] text-zinc-400">
                Internet Protocol (IP) address, operating system, browser specifications, pages explored, session timestamps, and referral sources to optimize storefront performance and security.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>3. Purpose & Legal Basis of Processing</span>
          </h2>
          <p>
            Every byte of data collected is processed strictly for authentic, legitimate purposes:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-300">
            <li>
              <strong>Order Fulfillment & Safe Transit:</strong> Coordinating with our insured courier partners (Bluedart, Delhivery, DTDC) to deliver your fragrant parcel safely to your doorstep.
            </li>
            <li>
              <strong>Instant Order Updates:</strong> Dispatching real-time SMS, WhatsApp, and email alerts containing courier AWB tracking numbers and dispatch confirmations.
            </li>
            <li>
              <strong>Financial Verification & Anti-Fraud Protection:</strong> Authenticating payment orders via Razorpay and validating Cash on Delivery verification protocols to eliminate unauthorized transactions.
            </li>
            <li>
              <strong>Dedicated Concierge Care:</strong> Addressing inquiries regarding olfactory notes, bottle maceration, skincare regimens (<em>"पिंपल्स भागे, आत्मविश्वास जागे"</em>), and 7-day transit replacements.
            </li>
            <li>
              <strong>Curated Private Circle Privileges:</strong> Transmitting notifications for limited reserve harvests, seasonal batch releases, and exclusive member discounts (strictly with your opt-in consent).
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>4. Payment Gateway Security (Razorpay)</span>
          </h2>
          <div className="p-4 bg-zinc-950 border border-gold/30 rounded space-y-3">
            <p>
              We partner exclusively with <strong>Razorpay Software Private Limited</strong>, an RBI-licensed payment aggregator certified to the highest international security benchmark: <strong>PCI-DSS Level 1 Compliance</strong>.
            </p>
            <p className="text-zinc-400 text-xs">
              When entering your credit/debit card numbers, CVV codes, net banking passwords, or UPI handles, your information is transmitted via end-to-end 256-bit encrypted channels directly to Razorpay's vault. Jayrup does not receive, view, or retain raw card numbers or financial security PINs at any juncture.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>5. Cookies & Local Storage</span>
          </h2>
          <p>
            Our storefront utilizes encrypted session cookies and browser local storage strictly for functional convenience:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-300">
            <li>
              <strong>Essential Bag Persistence:</strong> Preserving items in your Royal Bag and Wishlist across browser sessions without losing your selections.
            </li>
            <li>
              <strong>Instant Royal Checkout Isolation:</strong> Managing isolated single-item transactions without disturbing previous items stored in your general cart.
            </li>
            <li>
              <strong>Security Tokens:</strong> Maintaining authenticated customer login sessions through secure JSON Web Tokens (JWT).
            </li>
          </ul>
          <p className="text-xs text-zinc-400">
            You may disable cookies via your browser preferences; however, doing so may disable cart preservation and interactive account functionalities.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>6. Third-Party Disclosures & Logistics</span>
          </h2>
          <p>
            We do not sell, rent, or trade your personal information. We disclose select data only to vetted service partners strictly under non-disclosure obligations:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-300">
            <li>
              <strong>Logistics Carriers:</strong> Name, delivery address, and phone number shared with authorized shipping carriers (Bluedart, Delhivery, DTDC, Xpressbees) solely to facilitate delivery.
            </li>
            <li>
              <strong>Cloud & Infrastructure Providers:</strong> Encrypted hosting providers (MongoDB Atlas, Cloudinary Media CDN) that uphold strict ISO-27001 data security credentials.
            </li>
            <li>
              <strong>Legal Mandates:</strong> Where compelled by valid summons, warrants, or orders of Indian judicial authorities and law enforcement bodies.
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>7. Patron Rights Under Indian DPDP Act 2023</span>
          </h2>
          <p>
            As an esteemed patron of Jayrup, you hold unconditional rights over your digital personal data:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-noir-card border border-zinc-800">
              <h4 className="font-semibold text-gold uppercase text-xs mb-1">Right to Access & Review</h4>
              <p className="text-[11px] text-zinc-400">
                You may request a complete summary of your personal information and transaction history stored within our archives.
              </p>
            </div>
            <div className="p-4 bg-noir-card border border-zinc-800">
              <h4 className="font-semibold text-gold uppercase text-xs mb-1">Right to Correction & Rectification</h4>
              <p className="text-[11px] text-zinc-400">
                Update or rectify inaccurate phone numbers, names, or residential addresses anytime via your Profile Concierge.
              </p>
            </div>
            <div className="p-4 bg-noir-card border border-zinc-800">
              <h4 className="font-semibold text-gold uppercase text-xs mb-1">Right to Erasure (Be Forgotten)</h4>
              <p className="text-[11px] text-zinc-400">
                Request permanent deactivation and deletion of your patron profile (subject to statutory GST taxation record retention requirements).
              </p>
            </div>
            <div className="p-4 bg-noir-card border border-zinc-800">
              <h4 className="font-semibold text-gold uppercase text-xs mb-1">Right to Revoke Marketing Consent</h4>
              <p className="text-[11px] text-zinc-400">
                Unsubscribe instantly from private newsletter announcements with one click or via a direct WhatsApp message.
              </p>
            </div>
          </div>
        </section>

        {/* Section 8: Grievance Redressal Officer */}
        <section className="p-6 bg-noir-card border border-gold/30 rounded space-y-4">
          <div className="flex items-center gap-2 text-gold">
            <Bell className="w-5 h-5" />
            <h2 className="font-serif text-base sm:text-lg uppercase tracking-wider font-bold">
              8. Grievance Redressal Officer
            </h2>
          </div>
          <p className="text-xs text-zinc-300">
            In compliance with the Information Technology Act, 2000 and rules made thereunder, as well as the Consumer Protection (E-Commerce) Rules, 2020, the designated Grievance Officer for Jayrup is:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="space-y-1.5 border-l-2 border-gold pl-3">
              <p className="font-bold text-zinc-100">Shri Alok Vardhan</p>
              <p className="text-zinc-400 text-[11px]">Nodal Grievance & Compliance Officer</p>
              <p className="text-zinc-400 text-[11px]">Jayrup (JR) Royal Luxury House</p>
            </div>

            <div className="space-y-2 text-[11px] text-zinc-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold" />
                <span>Grievance Email: <strong>grievance@jayrup.com</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold" />
                <span>Concierge Desk: <strong>+91 98765 43210</strong> (Mon–Sat, 10 AM – 7 PM IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span>Corporate Atelier: Nariman Point, Mumbai, Maharashtra 400021, India</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-zinc-500 pt-2 border-t border-zinc-800">
            All privacy complaints are formally acknowledged within 48 business hours and resolved within 30 days from the date of receipt.
          </p>
        </section>
      </div>

      {/* Back to Treasury CTA */}
      <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/terms-of-service" className="text-xs text-gold hover:underline">
          View Terms of Service & Patron Agreement &rarr;
        </Link>
        <Link to="/shop" className="btn-gold text-xs py-3 px-8">
          Return to Royal Treasury
        </Link>
      </div>
    </div>
  );
};
