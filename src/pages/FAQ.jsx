import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Truck,
  CreditCard,
  Droplets,
  RotateCcw,
  ShieldCheck,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { SEO } from '../components/seo/SEO.jsx';
import { FAQSchema } from '../components/seo/FAQSchema.jsx';
import { BreadcrumbSchema } from '../components/seo/BreadcrumbSchema.jsx';

const FAQ_DATA = [
  // 1. Orders & Payment
  {
    category: 'Orders & Payments',
    question: 'What is "Instant Royal Checkout" and how does it work?',
    answer:
      'Instant Royal Checkout enables you to acquire a specific creation immediately with a single click without mixing or altering other treasures residing in your Royal Bag. Once you complete your instant order, only that purchased item is cleared from your bag (if it was previously added), preserving all your other selections intact for future checkout.',
  },
  {
    category: 'Orders & Payments',
    question: 'Is Cash on Delivery (COD) available for my pincode?',
    answer:
      'Yes, Cash on Delivery is enabled across 27,000+ pin codes in India for orders up to ₹50,000. Store management maintains an active toggle for COD; when active, you can pay via cash or scan the courier’s UPI QR code upon parcel arrival.',
  },
  {
    category: 'Orders & Payments',
    question: 'How secure is my online payment transaction?',
    answer:
      'All digital transactions are processed directly through Razorpay, an RBI-licensed gateway certified to PCI-DSS Level 1 (the highest global bank-grade encryption standard). Jayrup never stores or views your raw credit/debit card numbers, CVVs, or UPI PINs.',
  },
  {
    category: 'Orders & Payments',
    question: 'How do I apply a private privilege coupon code?',
    answer:
      'You can apply your privilege code during checkout in the Order Summary box. If your coupon meets order value criteria, your royal discount is calculated instantly on your final bill.',
  },

  // 2. Shipping & Tracking
  {
    category: 'Shipping & Delivery',
    question: 'What are the delivery timelines across India?',
    answer:
      'Orders are prepared and dispatched within 24 to 48 business hours. For Tier 1 metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata), air transit takes 2 to 4 business days. For Tier 2 and Tier 3 cities, delivery typically takes 4 to 6 business days.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'Is shipping complimentary on all orders?',
    answer:
      'Yes, we provide complimentary insured air express shipping across India on all orders containing products worth ₹999 or above. For orders under ₹999, a nominal flat handling fee of ₹99 is added at checkout.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'How can I track my parcel in real time?',
    answer:
      'As soon as your parcel is handed over to our courier partners (Bluedart, Delhivery, DTDC), you receive an automated SMS and email containing your tracking Air Waybill (AWB) number. You can also track your order instantly on our website via the "Track Your Order" page.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'What should I do if the parcel arrives damaged or tampered?',
    answer:
      'Do not accept any outer box that appears crushed, torn, or resealed with generic transparent tape. Inform the courier of your refusal due to outer damage, and contact our Concierge within 4 hours. We recommend recording a continuous 30-second unboxing video to claim instant priority replacement.',
  },

  // 3. Fragrance Artistry & Longevity
  {
    category: 'Fragrance Artistry',
    question: 'What sets Jayrup Extraits de Parfum apart from standard commercial perfumes?',
    answer:
      'Most commercial perfumes are diluted Eau de Toilettes (10-12% oil) or light Eau de Parfums (15-18% oil). Jayrup formulates exclusively in high-potency Extrait de Parfum (30%+ perfume oil concentration). Distilled with rare botanical absolutes (Kannauj Damask rose, Assamese oud, and Kashmiri saffron), our creations offer remarkable projection and lingering 12-to-24 hour longevity.',
  },
  {
    category: 'Fragrance Artistry',
    question: 'Why do natural artisanal perfumes mature over time?',
    answer:
      'Because we utilize authentic botanical absolutes and precious resins rather than synthetic isolates, our fragrance oils undergo a natural aging process known as maceration. Over months, the formulation becomes rounder, richer, and deeper in character.',
  },
  {
    category: 'Fragrance Artistry',
    question: 'Where should I apply my Extrait de Parfum for maximum longevity?',
    answer:
      'Apply to warm pulse points: the sides of the neck, hollow of the clavicle, behind the earlobes, and inner wrists. Do not rub your wrists together, as friction fractures delicate top-note volatile molecules. A light spritz on natural fabrics (silk, wool, linen) will allow the scent to radiate for days.',
  },

  // 4. Skincare & Herbal Purity
  {
    category: 'Specialized Skincare',
    question: 'What is the philosophy behind "पिंपल्स भागे, आत्मविश्वास जागे"?',
    answer:
      'Jayrup’s specialized skincare collection is formulated to address stubborn blemishes, acne marks, and hormonal breakouts using authentic Ayurvedic botanicals (neem extract, wild turmeric, Kashmiri saffron, red sandalwood). By clarifying the skin naturally without harsh chemicals, we help restore radiant complexion and unshakeable personal confidence.',
  },
  {
    category: 'Specialized Skincare',
    question: 'Are Jayrup soaps and skincare products suitable for sensitive skin?',
    answer:
      'Yes, our skincare creations are dermatologically tested, sulphate-free, and formulated with gentle cold-pressed oils. However, as individual skin biologies differ, we advise conducting a 24-hour patch test on your inner forearm before applying to the face.',
  },

  // 5. Returns & Replacements
  {
    category: 'Returns & Replacements',
    question: 'Can I return or exchange a perfume if I change my mind?',
    answer:
      'Under Indian cosmetic and personal care hygiene regulations (Cosmetics Rules, 2020), opened, tested, or unsealed cosmetic and fragrance bottles cannot be accepted for return. However, if your bottle arrived broken, defective, leaking, or with a faulty spray nozzle, we provide a 100% complimentary replacement or refund under our 7-Day Patron Guarantee.',
  },
  {
    category: 'Returns & Replacements',
    question: 'How quickly are refunds credited to my account?',
    answer:
      'For prepaid orders (UPI, Cards, NetBanking), Razorpay credits the refund to your original payment instrument within 5 to 7 banking working days. For COD orders, our finance team transfers the full amount via NEFT or UPI within 2 to 4 business days upon receiving your bank details.',
  },
  {
    category: 'Returns & Replacements',
    question: 'Can I cancel an order after placing it?',
    answer:
      'You can cancel your order within 4 hours of placing it (prior to courier manifest and warehouse dispatch) for an instant 100% refund. Once dispatched and handed to the air courier, orders cannot be canceled mid-transit.',
  },
];

const CATEGORIES = [
  'All Questions',
  'Orders & Payments',
  'Shipping & Delivery',
  'Fragrance Artistry',
  'Specialized Skincare',
  'Returns & Replacements',
];

export const FAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Questions');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndices, setOpenIndices] = useState([0]); // First item open by default

  const toggleAccordion = (index) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All Questions' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-10 px-4 sm:px-8 max-w-6xl mx-auto">
      <SEO
        title="Frequently Asked Questions (FAQ) | Jayrup Royal House"
        description="Find authoritative answers to common questions about Jayrup luxury perfumes, Cash on Delivery, shipping timelines, skincare benefits, and 7-day replacements."
        canonicalUrl="https://jayrup.com/faq"
      >
        <FAQSchema faqs={FAQ_DATA} />
        <BreadcrumbSchema
          items={[
            { name: 'Home', url: '/' },
            { name: 'Frequently Asked Questions', url: '/faq' },
          ]}
        />
      </SEO>

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500 mb-8">
        <Link to="/" className="hover:text-gold transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gold font-medium">Frequently Asked Questions</span>
      </nav>

      {/* Header Banner */}
      <header className="relative border-b border-gold/25 pb-8 mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-[10px] uppercase tracking-[0.2em] font-semibold mb-4">
          <HelpCircle className="w-3.5 h-3.5 text-gold" />
          <span>Curated Patron Assistance</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-zinc-100 font-bold">
          Frequently Asked <br />
          <span className="text-gradient-gold">Questions & Guidance</span>
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed">
          Explore answers to frequently asked questions regarding our extraits de parfum, herbal skincare formulations, dispatch logistics, and payment options.
        </p>

        {/* Search Bar */}
        <div className="relative mt-6 max-w-xl mx-auto">
          <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. COD, tracking, returns, perfume oil, skin)..."
            className="w-full bg-noir-card border border-gold/30 pl-11 pr-4 py-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold shadow-lg"
          />
        </div>
      </header>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-gold text-black font-bold shadow-gold-glow'
                : 'bg-noir-card border border-zinc-800 text-zinc-400 hover:text-gold hover:border-gold/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center bg-noir-card border border-zinc-800 space-y-3">
            <HelpCircle className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-sm text-zinc-300 font-serif">No questions found matching your search</p>
            <p className="text-xs text-zinc-500">
              Try searching with different keywords or contact our Royal Concierge directly.
            </p>
            <Link to="/contact" className="btn-gold text-xs py-2.5 px-6 inline-block mt-2">
              Inquire with Concierge
            </Link>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className="bg-noir-card border border-gold/20 overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-gold/5 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gold/80 block">
                      {faq.category}
                    </span>
                    <h3 className="font-serif text-sm sm:text-base text-zinc-100 font-semibold leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gold flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-0 border-t border-zinc-800/80">
                    <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed pt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still Need Assistance CTA Box */}
      <div className="mt-16 p-8 bg-noir-card border border-gold/30 rounded text-center max-w-4xl mx-auto space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-zinc-100 font-bold">
          Still Have Questions for the House of Jayrup?
        </h3>
        <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
          Our master olfactory consultants and customer care team are available Monday through Saturday to assist you with bespoke requests and order inquiries.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/contact" className="btn-gold text-xs py-3 px-8">
            Write to Concierge
          </Link>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold text-xs py-3 px-8 flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp Instant Assistance</span>
          </a>
        </div>
      </div>
    </div>
  );
};
