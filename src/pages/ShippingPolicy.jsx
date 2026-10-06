import React from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  PackageCheck,
  Clock,
  ShieldCheck,
  MapPin,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  Phone,
  Mail,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead.jsx';

export const ShippingPolicy = () => {
  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-10 px-4 sm:px-8 max-w-6xl mx-auto">
      <SEOHead
        title="Shipping & Delivery Policy | Royal Insured Transit | Jayrup"
        description="Review Jayrup's shipping terms, complimentary pan-India delivery over ₹999, express 24-48h dispatch, and real-time courier tracking."
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500 mb-8">
        <Link to="/" className="hover:text-gold transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gold font-medium">Shipping Policy</span>
      </nav>

      {/* Header Banner */}
      <header className="relative border-b border-gold/25 pb-8 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-[10px] uppercase tracking-[0.2em] font-semibold mb-4">
          <Truck className="w-3.5 h-3.5 text-gold" />
          <span>Royal Express Transit</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-zinc-100 font-bold">
          Shipping & Delivery <br className="hidden sm:inline" />
          <span className="text-gradient-gold">Royal Transit Charter</span>
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 mt-3 max-w-2xl leading-relaxed">
          Every Jayrup Extrait de Parfum and artisanal herbal creation is packaged with tamper-proof royal wax seals and cushioned in premium impact-resistant cases to arrive at your sanctuary in pristine state.
        </p>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-500 mt-4">
          <span>Pan-India Coverage: 27,000+ Pin Codes</span>
          <span>•</span>
          <span>Complimentary Delivery Above ₹999</span>
          <span>•</span>
          <span className="text-gold/90">Air Express Transit</span>
        </div>
      </header>

      {/* Core Perks Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        <div className="p-5 bg-noir-card border border-gold/20 flex flex-col justify-between">
          <div className="p-2.5 bg-gold/10 text-gold rounded w-fit mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              24–48h Dispatch
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              Orders placed before 2:00 PM IST dispatched same or following business day.
            </p>
          </div>
        </div>

        <div className="p-5 bg-noir-card border border-gold/20 flex flex-col justify-between">
          <div className="p-2.5 bg-gold/10 text-gold rounded w-fit mb-3">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              Complimentary Transit
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              Zero shipping fee on all orders containing products worth ₹999 or above.
            </p>
          </div>
        </div>

        <div className="p-5 bg-noir-card border border-gold/20 flex flex-col justify-between">
          <div className="p-2.5 bg-gold/10 text-gold rounded w-fit mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              100% Insured Transit
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              Full transit insurance against accidental spillage, breakage, or courier loss.
            </p>
          </div>
        </div>

        <div className="p-5 bg-noir-card border border-gold/20 flex flex-col justify-between">
          <div className="p-2.5 bg-gold/10 text-gold rounded w-fit mb-3">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              Real-Time Tracking
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              Automated SMS, email, and live courier AWB tracking right up to your doorstep.
            </p>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="space-y-12 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
        {/* Section 1: Delivery Estimates */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>1. Estimated Delivery Timeframes</span>
          </h2>
          <p>
            We partner with India's premier air and surface express networks — including <strong>Bluedart Express, Delhivery Air, DTDC Platinum, and Xpressbees</strong>. Typical transit timeframes from our central humidity-controlled cellars in Mumbai & Bangalore are as follows:
          </p>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border border-zinc-800 text-xs">
              <thead className="bg-zinc-900/80 text-gold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 border-b border-zinc-800">Destination Region</th>
                  <th className="p-3 border-b border-zinc-800">Dispatch Mode</th>
                  <th className="p-3 border-b border-zinc-800">Estimated Delivery Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr className="hover:bg-zinc-900/30">
                  <td className="p-3 font-medium text-zinc-100">Tier 1 Metro Hubs (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune)</td>
                  <td className="p-3 text-gold">Priority Air Express</td>
                  <td className="p-3 font-semibold text-emerald-400">2 – 4 Business Days</td>
                </tr>
                <tr className="hover:bg-zinc-900/30">
                  <td className="p-3 font-medium text-zinc-100">Tier 2 State Capitals & Commercial Cities (Ahmedabad, Jaipur, Chandigarh, Lucknow, Kochi, Indore)</td>
                  <td className="p-3">Express Surface / Air</td>
                  <td className="p-3 font-semibold text-zinc-200">3 – 5 Business Days</td>
                </tr>
                <tr className="hover:bg-zinc-900/30">
                  <td className="p-3 font-medium text-zinc-100">Tier 3 Towns & Suburban Districts</td>
                  <td className="p-3">Standard Express Surface</td>
                  <td className="p-3 font-semibold text-zinc-200">4 – 6 Business Days</td>
                </tr>
                <tr className="hover:bg-zinc-900/30">
                  <td className="p-3 font-medium text-zinc-100">North East, Jammu & Kashmir, Ladakh, Andaman & Nicobar, Remote Outposts</td>
                  <td className="p-3">Special Air Logistics</td>
                  <td className="p-3 font-semibold text-zinc-200">5 – 8 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-zinc-500 italic">
            * Business days exclude Sundays and nationally gazetted public holidays. Inclement weather conditions or regional regulatory delays may occasionally cause nominal extensions.
          </p>
        </section>

        {/* Section 2: Shipping Charges */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>2. Shipping Fees & Complimentary Privileges</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 bg-noir-card border border-gold/30 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-gold">
                  Orders ₹999 and Above
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Complimentary
                </span>
              </div>
              <p className="text-zinc-300 text-xs">
                Enjoy <strong>100% Free Insured Express Delivery</strong> across all serviceable pincodes in India. No promotional code is required; the waiver applies automatically at checkout.
              </p>
            </div>

            <div className="p-5 bg-noir-card border border-zinc-800 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-200">
                  Orders Under ₹999
                </span>
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  Flat ₹99
                </span>
              </div>
              <p className="text-zinc-400 text-xs">
                A nominal fee of ₹99 is added to cover specialized shock-absorbent luxury packaging and priority air courier handling.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Cash on Delivery Terms */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>3. Cash on Delivery (COD) Protocol</span>
          </h2>
          <p>
            To honor patron flexibility, Jayrup extends Cash on Delivery across most pin codes in India:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-300">
            <li>
              <strong>Verification Call/OTP:</strong> To prevent counterfeit orders and logistics wastage, high-value COD orders may undergo an automated WhatsApp or voice confirmation prior to warehouse dispatch.
            </li>
            <li>
              <strong>Payment Modes at Doorstep:</strong> Delivery couriers accept cash as well as direct UPI QR scan payments (Google Pay, PhonePe, Paytm, BHIM) upon handover of the parcel.
            </li>
            <li>
              <strong>Order Limits:</strong> Cash on Delivery is eligible up to ₹50,000 per order. For higher orders, kindly utilize our bank-grade Razorpay online gateway.
            </li>
            <li>
              <strong>Refusal Protocol:</strong> Unwarranted repeated refusals of COD deliveries without reasonable cause may restrict a patron account to prepaid modes for subsequent orders.
            </li>
          </ul>
        </section>

        {/* Section 4: Live Order Tracking */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>4. Real-Time Tracking & Dispatch Notifications</span>
          </h2>
          <p>
            As soon as your creation is bottled, packaged, and assigned a unique Air Waybill (AWB) number, you will receive:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-noir-card border border-zinc-800 rounded">
              <h4 className="font-bold text-zinc-200 text-xs uppercase mb-1">1. Dispatch SMS & Email</h4>
              <p className="text-[11px] text-zinc-400">
                Direct notification containing your carrier name, tracking AWB number, and direct tracking link.
              </p>
            </div>
            <div className="p-4 bg-noir-card border border-zinc-800 rounded">
              <h4 className="font-bold text-zinc-200 text-xs uppercase mb-1">2. On-Site Tracking Page</h4>
              <p className="text-[11px] text-zinc-400">
                Track your parcel anytime by entering your Order Number or Phone on our{' '}
                <Link to="/track-order" className="text-gold underline">
                  Live Tracking Portal
                </Link>.
              </p>
            </div>
            <div className="p-4 bg-noir-card border border-zinc-800 rounded">
              <h4 className="font-bold text-zinc-200 text-xs uppercase mb-1">3. Out-for-Delivery Alert</h4>
              <p className="text-[11px] text-zinc-400">
                Morning notification on the day of delivery along with courier delivery executive contact information.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Packaging & Tamper Seal Integrity */}
        <section className="p-6 bg-noir-card border border-amber-500/30 rounded space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <h2 className="font-serif text-base sm:text-lg uppercase tracking-wider font-bold">
              5. Tamper-Evident Packaging & Delivery Acceptance
            </h2>
          </div>
          <p className="text-xs text-zinc-300">
            All Jayrup parcels are sealed using specialized security tape embossed with the <strong>Jayrup (JR) Royal Crest</strong>.
          </p>
          <div className="p-3 bg-noir border border-zinc-800 rounded space-y-1 text-xs">
            <p className="font-bold text-zinc-200">
              Crucial Patron Advisory:
            </p>
            <p className="text-zinc-400 text-[11px]">
              If the outer parcel packaging appears torn, tampered with, crushed, or resealed with transparent tape, <strong>DO NOT ACCEPT</strong> the delivery from the courier. Mark the parcel as <em>"Refused due to outer tamper"</em> on the courier manifest and notify our Concierge within 4 hours.
            </p>
          </div>
          <p className="text-[11px] text-zinc-400">
            For peace of mind, we strongly recommend recording a continuous 30-second unboxing video when unwrapping your fragrant creation. In the rare event of transit leakage or glass damage, this video guarantees an instant, no-questions-asked replacement!
          </p>
        </section>

        {/* Section 6: Delivery Re-attempts & Address Changes */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>6. Delivery Attempts & Address Corrections</span>
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-zinc-300">
            <li>
              <strong>3 Delivery Attempts:</strong> Our courier partners will make up to three distinct attempts to deliver your parcel before marking it as Return-to-Origin (RTO).
            </li>
            <li>
              <strong>Address Alterations:</strong> If you notice an error in your address after ordering, notify our concierge at <strong>care@jayrup.com</strong> or WhatsApp within 2 hours of order placement. Once handed to the air courier, rerouting may incur carrier re-manifest fees.
            </li>
            <li>
              <strong>P.O. Box & Military APO Restrictions:</strong> We deliver to registered residential, corporate, and hotel addresses across India. Due to courier constraints, delivery to unattended Post Office Box numbers is not supported.
            </li>
          </ul>
        </section>
      </div>

      {/* Footer Concierge Strip */}
      <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Phone className="w-4 h-4 text-gold" />
          <span>Dispatch Enquiries: +91 98765 43210</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/track-order" className="btn-outline-gold text-xs py-2.5 px-6">
            Track Active Parcel
          </Link>
          <Link to="/return-policy" className="btn-gold text-xs py-2.5 px-6">
            View Return & Refund Policy
          </Link>
        </div>
      </div>
    </div>
  );
};
