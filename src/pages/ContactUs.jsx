import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Building,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead.jsx';
import { contactService } from '../services/contactService.js';

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    subject: 'Order & Tracking Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      await contactService.submitInquiry(formData);

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        orderNumber: '',
        subject: 'Order & Tracking Inquiry',
        message: '',
      });
    } catch (err) {
      setError(
        err.message ||
          'Could not submit inquiry at this moment. Please reach our concierge directly via WhatsApp or email.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-10 px-4 sm:px-8 max-w-7xl mx-auto">
      <SEOHead
        title="Contact Royal Concierge | Jayrup (जयरूप) Luxury Fragrance House"
        description="Connect with Jayrup's master perfumers, customer care, and order concierge. Instant WhatsApp, phone support, and corporate gifting enquiries."
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500 mb-8">
        <Link to="/" className="hover:text-gold transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gold font-medium">Contact Royal Concierge</span>
      </nav>

      {/* Header Banner */}
      <header className="relative border-b border-gold/25 pb-8 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-[10px] uppercase tracking-[0.2em] font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>At Your Sovereign Service</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-zinc-100 font-bold">
          The Royal Concierge & <br className="hidden sm:inline" />
          <span className="text-gradient-gold">Private Inquiries</span>
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 mt-3 max-w-2xl leading-relaxed">
          Whether you seek personalized olfactory guidance, skincare advice (<em>"पिंपल्स भागे, आत्मविश्वास जागे"</em>), corporate gifting curation, or priority order assistance, our dedicated concierge awaits.
        </p>
      </header>

      {/* Two Column Layout: Form & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Interactive Contact Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 bg-noir-card border border-gold/25 shadow-2xl space-y-6">
            <div>
              <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gold" />
                <span>Transmit a Royal Inquiry</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Our concierge desk formally attends to all messages within 4 business hours.
              </p>
            </div>

            {success ? (
              <div className="p-6 bg-gold/10 border border-gold/40 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-gold mx-auto" />
                <h3 className="font-serif text-base uppercase tracking-wider text-gold font-bold">
                  Inquiry Successfully Received
                </h3>
                <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                  Thank you for conferring with the House of Jayrup. Our executive concierge team has received your communication and will reply directly to your email and phone shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="btn-gold text-[11px] py-2.5 px-6 mt-2"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Maharani Ananya Singhania"
                      className="w-full bg-noir border border-zinc-800 p-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. ananya@luxury.com"
                      className="w-full bg-noir border border-zinc-800 p-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                      Contact Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-noir border border-zinc-800 p-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                      Order Identifier (If Applicable)
                    </label>
                    <input
                      type="text"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      placeholder="e.g. JR-10492"
                      className="w-full bg-noir border border-zinc-800 p-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Inquiry Subject *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-3 text-xs text-zinc-100 focus:outline-none focus:border-gold"
                  >
                    <option value="Order & Tracking Inquiry">Order & Tracking Inquiry</option>
                    <option value="Product & Fragrance Consultation">Product & Fragrance Consultation</option>
                    <option value="Skincare Guidance">Skincare Guidance (पिंपल्स भागे, आत्मविश्वास जागे)</option>
                    <option value="Wholesale & Corporate Gifting">Wholesale & Corporate Gifting</option>
                    <option value="Return & Replacement Request">Return & Replacement Request</option>
                    <option value="Grievance & Feedback">Grievance & Feedback</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Your Message / Detailed Request *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Kindly describe your inquiry, bespoke requirement, or olfactory preference in detail..."
                    className="w-full bg-noir border border-zinc-800 p-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold py-4 text-xs tracking-[0.2em] font-bold flex items-center justify-center gap-2 shadow-gold-glow disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Transmitting to Concierge...' : 'Submit Inquiry'}</span>
                </button>

                <p className="text-[10px] text-zinc-500 text-center flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                  <span>Your personal contact information is protected under our Privacy Charter.</span>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Direct Channels & Atelier Info */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Direct Cards */}
          <div className="space-y-4">
            {/* Phone & WhatsApp Card */}
            <div className="p-5 bg-noir-card border border-gold/20 flex items-start gap-4">
              <div className="p-3 bg-gold/10 text-gold rounded-full flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-100">
                  Direct Royal Helpline & WhatsApp
                </h3>
                <p className="text-gold font-mono text-sm font-semibold">
                  +91 98765 43210
                </p>
                <p className="text-[11px] text-zinc-400">
                  Instant WhatsApp assistance available 7 days a week for immediate order and tracking support.
                </p>
              </div>
            </div>

            {/* Email Inboxes Card */}
            <div className="p-5 bg-noir-card border border-gold/20 flex items-start gap-4">
              <div className="p-3 bg-gold/10 text-gold rounded-full flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 text-xs">
                <h3 className="font-bold uppercase tracking-wider text-zinc-100">
                  Official Correspondence Inboxes
                </h3>
                <div className="space-y-1 text-[11px] text-zinc-400">
                  <p>
                    <span className="text-zinc-200">Patron Care:</span>{' '}
                    <strong className="text-gold">care@jayrup.com</strong>
                  </p>
                  <p>
                    <span className="text-zinc-200">Order Updates:</span>{' '}
                    <strong className="text-zinc-300">orders@jayrup.com</strong>
                  </p>
                  <p>
                    <span className="text-zinc-200">Corporate & Gifting:</span>{' '}
                    <strong className="text-zinc-300">partnerships@jayrup.com</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="p-5 bg-noir-card border border-gold/20 flex items-start gap-4">
              <div className="p-3 bg-gold/10 text-gold rounded-full flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <h3 className="font-bold uppercase tracking-wider text-zinc-100">
                  Concierge Operational Hours
                </h3>
                <p className="text-zinc-300 text-[11px]">
                  <strong>Monday – Saturday:</strong> 10:00 AM – 7:00 PM IST
                </p>
                <p className="text-zinc-400 text-[11px]">
                  <strong>Sunday:</strong> Automated tracking active; urgent queries attended via WhatsApp.
                </p>
              </div>
            </div>

            {/* Physical Ateliers Card */}
            <div className="p-5 bg-noir-card border border-gold/20 flex items-start gap-4">
              <div className="p-3 bg-gold/10 text-gold rounded-full flex-shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div className="space-y-2 text-xs">
                <h3 className="font-bold uppercase tracking-wider text-zinc-100">
                  Headquarters & Regional Ateliers
                </h3>
                <div className="text-[11px] text-zinc-400 space-y-1.5">
                  <p>
                    <strong className="text-zinc-200">Corporate Atelier:</strong><br />
                    Jayrup Royal House, 12th Floor, Nariman Point, Mumbai, Maharashtra 400021
                  </p>
                  <p>
                    <strong className="text-zinc-200">Central Distillation Cellar:</strong><br />
                    Heritage Perfumery Enclave, Kannauj, Uttar Pradesh 209725
                  </p>
                  <p>
                    <strong className="text-zinc-200">Southern Logistics Hub:</strong><br />
                    Whitefield Air Cargo Facility, Bengaluru, Karnataka 560066
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Link to FAQs */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <HelpCircle className="w-4 h-4 text-gold" />
                <span>Seeking Immediate Answers?</span>
              </div>
              <Link to="/faq" className="text-gold font-medium hover:underline text-[11px]">
                Explore FAQ Treasury &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
