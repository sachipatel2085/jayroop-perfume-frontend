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
  {
    category: 'Orders & Payments',
    question: 'Which payment methods do you accept?',
    answer:
      'You can pay online through PhonePe Payment Gateway using UPI (PhonePe, Google Pay, Paytm, BHIM and other UPI apps), debit/credit cards and net banking. Cash on Delivery (COD) is also available on eligible orders.',
  },
  {
    category: 'Orders & Payments',
    question: 'Is it safe to pay online on jayrup.in?',
    answer:
      'Yes. Online payments are processed on PhonePe’s secure payment page. Jayrup never sees or stores your card number, CVV or UPI PIN, and every payment is verified with PhonePe before your order is confirmed.',
  },
  {
    category: 'Orders & Payments',
    question: 'My money was debited but the order shows “payment pending”. What should I do?',
    answer:
      'Most payments are confirmed within a few minutes – your order updates automatically. If PhonePe marks the payment as failed, any amount debited is reversed to your account by your bank. You can also retry payment from My Orders, or write to care@jayrup.in with your order number.',
  },
  {
    category: 'Orders & Payments',
    question: 'Will I get a GST invoice?',
    answer:
      'Yes. A GST invoice is generated for every order (after payment for prepaid orders, and on dispatch for COD orders). You can download it any time from My Account › My Orders. Businesses can add their GSTIN at checkout to claim input tax credit.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'How long does delivery take?',
    answer:
      'Orders are shipped through registered domestic courier companies and/or Speed Post and are delivered within 7–10 business days from the date of order/payment, depending on your location and the courier partner.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'Do you deliver all over India? Do you ship internationally?',
    answer: 'We currently ship across India. International shipping is not available at this time.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'How can I track my order?',
    answer:
      'Once your order is shipped you receive a shipment confirmation e-mail/SMS with the courier name and tracking number. You can also track it on the Track Order page or in My Account › My Orders. Tracking may take 24–48 hours to activate after dispatch.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'Are there any shipping charges?',
    answer: 'Shipping charges, if applicable, are shown clearly at checkout before you pay. Orders above ₹999 ship free.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'Why do perfume orders take a little longer?',
    answer:
      'Alcohol-based perfumes are classified as flammable goods by courier companies, so they can only travel by surface (road/rail) transport and not by air. Orders containing perfumes may take 2–3 extra business days. The expected delivery time is shown on every product page and at checkout.',
  },
  {
    category: 'Products & Usage',
    question: 'Where can I find ingredients, net quantity and usage directions?',
    answer:
      'Every product page lists the key ingredients, how to use, precautions, net quantity, shelf life, manufacturer / marketer details and country of origin – the same information printed on the pack. Many products also have their own FAQs on the product page.',
  },
  {
    category: 'Products & Usage',
    question: 'Are Jayrup products safe for daily use?',
    answer:
      'All Jayrup products are Class 3 cosmetics made by licensed manufacturers for external use and comply with applicable cosmetic safety standards. As with any cosmetic, read the label, do a patch test first and discontinue use if irritation occurs.',
  },
  {
    category: 'Products & Usage',
    question: 'Are the products genuine? How do I check the batch and expiry?',
    answer:
      'Jayrup products are sold directly by the brand, so every product is 100% genuine. The batch number, manufacturing date and best-before / expiry date are printed on each pack.',
  },
  {
    category: 'Skincare',
    question: 'Which skincare product is right for my skin type?',
    answer:
      'Each skincare product page shows the skin types and concerns it is made for, along with directions and precautions. If you are unsure, write to care@jayrup.in or WhatsApp us and our team will guide you.',
  },
  {
    category: 'Skincare',
    question: 'How soon will I see results?',
    answer:
      'Results vary from person to person and depend on skin type, consistency of use and lifestyle. Follow the directions on the product page and use the product regularly for the recommended period.',
  },
  {
    category: 'Fragrances',
    question: 'How should I apply perfume for it to last longer?',
    answer:
      'Spray on pulse points such as the wrists, neck and behind the ears on moisturised skin, and avoid rubbing your wrists together. Store the bottle away from direct sunlight and heat.',
  },
  {
    category: 'Fragrances',
    question: 'What is the difference between Eau de Parfum, Eau de Toilette and Attar?',
    answer:
      'They differ in fragrance concentration. Eau de Parfum (EDP) has a higher concentration and usually lasts longer than Eau de Toilette (EDT). Attar is a concentrated, alcohol-free perfume oil. The concentration, notes and expected longevity are listed on each perfume’s product page.',
  },
  {
    category: 'Fragrances',
    question: 'Can I return a perfume if I don’t like the smell?',
    answer:
      'For hygiene reasons, perfumes cannot be returned once the seal or cap lock is opened or the product has been used, and fragrance preference is personal. Bottles that arrive broken, leaking, tampered or a wrong fragrance/size are always replaced or refunded. Read the notes and fragrance family on the product page before buying.',
  },
  {
    category: 'Returns & Replacements',
    question: 'What is your return policy?',
    answer:
      'Return or exchange is available within 3 days of delivery. The item must be unused, sealed, in the same condition and with original packaging; sale items may not be eligible. Some products (for example opened perfumes) are non-returnable – this is shown on each product page. Damaged, leaking or wrong items are always replaced or refunded.',
  },
  {
    category: 'Returns & Replacements',
    question: 'I received a damaged or leaking product. What should I do?',
    answer:
      'Open the order in My Account › My Orders and choose “Report a problem / Return”, or contact us within 48 hours of delivery with photos of the product and packaging at care@jayrup.in or +91 94081 33100. An unboxing video helps us resolve it faster. We will arrange a replacement or refund as per our policy.',
  },
  {
    category: 'Returns & Replacements',
    question: 'Can I cancel my order?',
    answer:
      'Orders that are not yet dispatched can be cancelled from My Account › My Orders. Once an order is shipped or out for delivery it cannot be cancelled; you may refuse it at the doorstep.',
  },
  {
    category: 'Returns & Replacements',
    question: 'How long does a refund take?',
    answer:
      'Approved refunds are initiated to the original payment method through PhonePe and can take up to 15 days to be credited. For COD orders the amount is transferred to your bank account or UPI ID.',
  },
];

const CATEGORIES = [
  'All Questions',
  'Orders & Payments',
  'Shipping & Delivery',
  'Products & Usage',
  'Skincare',
  'Fragrances',
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
        title="FAQs – Orders, Delivery, Payments & Product Usage | Jayrup"
        description="Answers to common questions about Jayrup skincare and perfumes, product usage, delivery timelines, PhonePe & COD payments, GST invoices, returns and refunds."
        canonicalUrl="/faq"
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
              Try searching with different keywords or contact our support team directly.
            </p>
            <Link to="/contact-us" className="btn-gold text-xs py-2.5 px-6 inline-block mt-2">
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
          Still have questions?
        </h3>
        <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
          Our customer care team is available Monday to Saturday, 10 AM – 6 PM IST, to help with orders, products and returns.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/contact-us" className="btn-gold text-xs py-3 px-8">
            Contact Us
          </Link>
          <a
            href="https://wa.me/919408133100"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold text-xs py-3 px-8 flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </div>
  );
};
