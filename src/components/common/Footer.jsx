import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo.jsx';
import {
  ShieldCheck,
  Truck,
  RefreshCw,
  Award,
  Mail,
  Phone,
  MapPin,
  Clock,
  HelpCircle,
  FileText,
  Lock,
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-noir border-t border-gold/20 text-zinc-400 text-xs">
      {/* Royal Guarantees Bar */}
      <div className="border-b border-zinc-900 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Truck className="w-6 h-6 text-gold mb-2" />
            <h4 className="font-semibold text-zinc-100 uppercase tracking-wider text-[11px]">
              Royal Express Transit
            </h4>
            <p className="text-[10px] text-zinc-500 mt-1">Complimentary across India above ₹999</p>
          </div>

          <div className="flex flex-col items-center">
            <Award className="w-6 h-6 text-gold mb-2" />
            <h4 className="font-semibold text-zinc-100 uppercase tracking-wider text-[11px]">
              100% Authentic Formulation
            </h4>
            <p className="text-[10px] text-zinc-500 mt-1">High-potency 30%+ Extrait de Parfum</p>
          </div>

          <div className="flex flex-col items-center">
            <ShieldCheck className="w-6 h-6 text-gold mb-2" />
            <h4 className="font-semibold text-zinc-100 uppercase tracking-wider text-[11px]">
              Secured Razorpay Payments
            </h4>
            <p className="text-[10px] text-zinc-500 mt-1">256-bit bank-grade encryption</p>
          </div>

          <div className="flex flex-col items-center">
            <RefreshCw className="w-6 h-6 text-gold mb-2" />
            <h4 className="font-semibold text-zinc-100 uppercase tracking-wider text-[11px]">
              7-Day Patron Assurance
            </h4>
            <p className="text-[10px] text-zinc-500 mt-1">Hassle-free replacement for transit claims</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
        {/* Col 1: Brand & Heritage Bio (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-4">
          <BrandLogo size="normal" showTagline={true} />
          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mt-3">
            Jayrup (जयरूप) is a distinguished Indian house of regal perfumery and specialized herbal cosmetics. We distill time-honored heritage with uncompromising botanical purity to awaken enduring confidence.
          </p>

          <div className="inline-block pt-1">
            <span className="bg-gradient-to-r from-gold-amber via-gold to-gold-amber text-black text-[10px] font-bold px-3 py-1 rounded-full tracking-wider shadow-sm">
              पिंपल्स भागे, आत्मविश्वास जागे
            </span>
          </div>

          <div className="pt-2 text-[11px] text-zinc-500 space-y-1.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <span>Atelier: Nariman Point, Mumbai • Kannauj • Bangalore</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <span>Royal Helpline & WhatsApp: +91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <span>Patron Care: care@jayrup.com</span>
            </div>
          </div>
        </div>

        {/* Col 2: Treasury Collections */}
        <div>
          <h4 className="font-serif text-xs text-gold tracking-widest uppercase mb-4 font-semibold">
            Collections
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/category/perfumes" className="hover:text-gold transition-colors">
                Royal Extraits de Parfum
              </Link>
            </li>
            <li>
              <Link to="/category/skincare" className="hover:text-gold transition-colors">
                Jayrup Special Skincare
              </Link>
            </li>
            <li>
              <Link to="/category/soaps" className="hover:text-gold transition-colors">
                Artisanal Saffron Soaps
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-gold transition-colors">
                Complete Treasury Catalog
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Royal Concierge */}
        <div>
          <h4 className="font-serif text-xs text-gold tracking-widest uppercase mb-4 font-semibold">
            Concierge Desk
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/contact" className="hover:text-gold transition-colors">
                Contact Concierge
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-gold transition-colors">
                Frequently Asked Questions
              </Link>
            </li>
            <li>
              <Link to="/track-order" className="hover:text-gold transition-colors">
                Track Your Parcel
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gold transition-colors">
                About House of Jayrup
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-gold transition-colors">
                The Royal Journal & Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Policies & Regulatory */}
        <div>
          <h4 className="font-serif text-xs text-gold tracking-widest uppercase mb-4 font-semibold">
            Policies & Charter
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/privacy-policy" className="hover:text-gold transition-colors">
                Privacy Policy Charter
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="hover:text-gold transition-colors">
                Shipping & Delivery Terms
              </Link>
            </li>
            <li>
              <Link to="/return-policy" className="hover:text-gold transition-colors">
                Return & Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="hover:text-gold transition-colors">
                Terms of Service Covenant
              </Link>
            </li>
            <li>
              <Link to="/cancellation-policy" className="hover:text-gold transition-colors">
                Cancellation Charter
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 5: Private Circle Newsletter */}
        <div>
          <h4 className="font-serif text-xs text-gold tracking-widest uppercase mb-4 font-semibold">
            Private Circle
          </h4>
          <p className="text-zinc-400 text-xs mb-3">
            Receive private harvest announcements and limited batch invitations.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Welcome to the Jayrup Royal Private Circle!');
            }}
            className="space-y-2"
          >
            <input
              type="email"
              placeholder="Your royal email"
              required
              className="w-full bg-zinc-900/80 border border-gold/30 px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold"
            />
            <button type="submit" className="w-full btn-gold text-[10px] py-2">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Legal & Policy Quick Link Navigation Bar */}
      <div className="border-t border-zinc-900 py-4 px-4 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-zinc-500">
          <Link to="/privacy-policy" className="hover:text-gold transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/shipping-policy" className="hover:text-gold transition-colors">
            Shipping Policy
          </Link>
          <span>•</span>
          <Link to="/return-policy" className="hover:text-gold transition-colors">
            Return & Refund Policy
          </Link>
          <span>•</span>
          <Link to="/terms-of-service" className="hover:text-gold transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-gold transition-colors">
            Contact Us
          </Link>
          <span>•</span>
          <Link to="/faq" className="hover:text-gold transition-colors">
            FAQs
          </Link>
        </div>
      </div>

      {/* Copyright & Seal */}
      <div className="border-t border-zinc-900 py-6 px-4 text-center text-zinc-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} JAYRUP (JR) ROYAL LUXURY HOUSE. All rights reserved.</p>
          <p className="text-gold/80 font-medium">पिंपल्स भागे, आत्मविश्वास जागे • Handcrafted in India</p>
        </div>
      </div>
    </footer>
  );
};
