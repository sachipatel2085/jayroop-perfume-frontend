import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo.jsx';
import { ShieldCheck, Truck, RefreshCw, Award, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-noir border-t border-gold/20 text-zinc-400 text-xs">
      {/* Royal Guarantees Bar */}
      <div className="border-b border-zinc-900 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Truck className="w-6 h-6 text-gold mb-2" />
            <h4 className="font-semibold text-zinc-100 uppercase tracking-wider text-[11px]">
              Royal Express Delivery
            </h4>
            <p className="text-[10px] text-zinc-500 mt-1">Complimentary across India above ₹999</p>
          </div>

          <div className="flex flex-col items-center">
            <Award className="w-6 h-6 text-gold mb-2" />
            <h4 className="font-semibold text-zinc-100 uppercase tracking-wider text-[11px]">
              100% Authentic Formulation
            </h4>
            <p className="text-[10px] text-zinc-500 mt-1">Distilled with authentic rare extracts</p>
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
              Direct Courier Tracking
            </h4>
            <p className="text-[10px] text-zinc-500 mt-1">Real-time status & dispatch updates</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand & Heritage Bio */}
        <div className="md:col-span-2 space-y-4">
          <BrandLogo size="normal" showTagline={true} />
          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mt-3">
            Jayroop (जयरूप) is a distinguished Indian house of regal perfumery and specialized herbal cosmetics. We distill time-honored heritage with uncompromising botanical purity to awaken enduring confidence.
          </p>
          <div className="pt-2 text-[11px] text-zinc-500 space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span>Headquarters: Mumbai • Rajasthan • Bangalore</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gold" />
              <span>Concierge: +91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gold" />
              <span>care@jayroop.com</span>
            </div>
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="font-serif text-sm text-gold tracking-widest uppercase mb-4">
            Collections
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/category/perfumes" className="hover:text-gold transition-colors">Royal Extraits de Parfum</Link></li>
            <li><Link to="/category/skincare" className="hover:text-gold transition-colors">Jayroop Special Skincare</Link></li>
            <li><Link to="/category/soaps" className="hover:text-gold transition-colors">Artisanal Saffron Soaps</Link></li>
          </ul>
        </div>

        {/* Concierge & Orders */}
        <div>
          <h4 className="font-serif text-sm text-gold tracking-widest uppercase mb-4">
            Concierge
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/about" className="hover:text-gold transition-colors">About Jayroop House</Link></li>
            <li><Link to="/orders" className="hover:text-gold transition-colors">Track Your Order</Link></li>
            <li><Link to="/profile" className="hover:text-gold transition-colors">My Royal Account</Link></li>
            <li><Link to="/wishlist" className="hover:text-gold transition-colors">Saved Wishlist</Link></li>
            <li><Link to="/blog" className="hover:text-gold transition-colors">Royal Blog</Link></li>
          </ul>
        </div>

        {/* Royal Newsletter */}
        <div>
          <h4 className="font-serif text-sm text-gold tracking-widest uppercase mb-4">
            Private Circle
          </h4>
          <p className="text-zinc-400 text-xs mb-3">
            Receive private releases, royal formulations, and limited batch invitations.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); alert('Welcome to the Jayroop Royal Private Circle!'); }} className="space-y-2">
            <input
              type="email"
              placeholder="Your royal email address"
              required
              className="w-full bg-zinc-900/80 border border-gold/30 px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold"
            />
            <button type="submit" className="w-full btn-gold text-[10px] py-2">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-zinc-900 py-6 px-4 text-center text-zinc-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} JAYROOP (JR) ROYAL LUXURY HOUSE. All rights reserved.</p>
          <p className="text-gold/80 font-medium">पिंपल्स भागे, आत्मविश्वास जागे</p>
        </div>
      </div>
    </footer>
  );
};
