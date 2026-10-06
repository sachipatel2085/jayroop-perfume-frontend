import React from 'react';
import { Link } from 'react-router-dom';
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Clock,
  Sparkles,
  Banknote,
  Truck,
  Mail,
  Phone,
  Video,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead.jsx';

export const ReturnRefundPolicy = () => {
  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-10 px-4 sm:px-8 max-w-6xl mx-auto">
      <SEOHead
        title="Return, Refund & Cancellation Policy | Jayrup Royal House"
        description="Read Jayrup's 7-Day patron replacement guarantee, unboxing protocol, 100% pre-dispatch cancellation policy, and seamless 5-7 day refunds."
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500 mb-8">
        <Link to="/" className="hover:text-gold transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gold font-medium">Return & Refund Policy</span>
      </nav>

      {/* Header Banner */}
      <header className="relative border-b border-gold/25 pb-8 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-[10px] uppercase tracking-[0.2em] font-semibold mb-4">
          <RotateCcw className="w-3.5 h-3.5 text-gold" />
          <span>Patron Satisfaction Pledge</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-zinc-100 font-bold">
          Return, Refund & <br className="hidden sm:inline" />
          <span className="text-gradient-gold">Cancellation Charter</span>
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 mt-3 max-w-2xl leading-relaxed">
          At Jayrup (जयरूप), our creations represent the pinnacle of royal olfactory distillation and dermatological excellence. We stand wholeheartedly behind every bottle that departs our cellars.
        </p>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-500 mt-4">
          <span>7-Day Replacement Window</span>
          <span>•</span>
          <span>100% Full Refund Guarantee</span>
          <span>•</span>
          <span className="text-gold/90">Doorstep Reverse Logistics</span>
        </div>
      </header>

      {/* Core Perks Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        <div className="p-5 bg-noir-card border border-gold/20 flex flex-col justify-between">
          <div className="p-2.5 bg-gold/10 text-gold rounded w-fit mb-3">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              7-Day Assurance
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              Damaged, leaking, or wrong items replaced or refunded within 7 days of delivery.
            </p>
          </div>
        </div>

        <div className="p-5 bg-noir-card border border-gold/20 flex flex-col justify-between">
          <div className="p-2.5 bg-gold/10 text-gold rounded w-fit mb-3">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              5–7 Day Bank Refund
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              Fast credit back to your original payment mode (Razorpay / UPI / Card / Bank NEFT).
            </p>
          </div>
        </div>

        <div className="p-5 bg-noir-card border border-gold/20 flex flex-col justify-between">
          <div className="p-2.5 bg-gold/10 text-gold rounded w-fit mb-3">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              Doorstep Reverse Pickup
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              Complimentary courier collection from your residence at our expense.
            </p>
          </div>
        </div>

        <div className="p-5 bg-noir-card border border-gold/20 flex flex-col justify-between">
          <div className="p-2.5 bg-gold/10 text-gold rounded w-fit mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              Pre-Dispatch Cancel
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              Cancel with 1 click before courier dispatch for immediate 100% refund.
            </p>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="space-y-12 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
        {/* Section 1: Hygiene Standard Notice */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>1. Luxury Hygiene & Personal Care Regulatory Standard</span>
          </h2>
          <p>
            Due to the sterile nature of <strong>Extrait de Parfum, herbal cosmetic formulations, and artisanal saffron soaps</strong>, products once opened, sprayed, or applied to skin cannot be resold under Indian health, hygiene, and cosmetic safety standards (Cosmetics Rules, 2020).
          </p>
          <div className="p-4 bg-noir-card border border-gold/25 rounded space-y-2">
            <p className="text-zinc-200 font-semibold text-xs uppercase tracking-wider text-gold">
              What is Protected Under Our Policy:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300 text-xs">
              <li>Product arrived damaged, cracked, or broken during air/surface transit.</li>
              <li>Atomizer pump or spray nozzle is defective or non-functional upon initial delivery.</li>
              <li>Visible perfume oil leakage inside the box upon opening.</li>
              <li>Incorrect product or variant size delivered versus your confirmed order receipt.</li>
              <li>Missing items or unsealed packaging received.</li>
            </ul>
          </div>
        </section>

        {/* Section 2: Recommended Unboxing Video */}
        <section className="p-6 bg-noir-card border border-gold/30 rounded space-y-4">
          <div className="flex items-center gap-2 text-gold">
            <Video className="w-5 h-5" />
            <h2 className="font-serif text-base sm:text-lg uppercase tracking-wider font-bold">
              2. The 30-Second Unboxing Video Advisory
            </h2>
          </div>
          <p className="text-xs text-zinc-300">
            Because luxury fragrances travel in heavy glass flacons, postal transit shocks can occasionally cause transit fractures.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-3 bg-noir border border-zinc-800 rounded">
              <span className="text-[10px] uppercase font-bold text-gold block mb-1">Step 1 • Record</span>
              <p className="text-[11px] text-zinc-400">
                Record a brief, continuous video showing the outer courier box, shipping label, and unsealing of the package.
              </p>
            </div>
            <div className="p-3 bg-noir border border-zinc-800 rounded">
              <span className="text-[10px] uppercase font-bold text-gold block mb-1">Step 2 • Inspect</span>
              <p className="text-[11px] text-zinc-400">
                Reveal the bottle in the recording to demonstrate any transit leakage or crack.
              </p>
            </div>
            <div className="p-3 bg-noir border border-zinc-800 rounded">
              <span className="text-[10px] uppercase font-bold text-gold block mb-1">Step 3 • Instant Approval</span>
              <p className="text-[11px] text-zinc-400">
                Sharing this video enables our Concierge to approve an instant replacement within 4 business hours without complex investigations!
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Return & Replacement Procedure */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>3. How to Initiate a Return or Replacement</span>
          </h2>
          <p>
            Initiating a claim is effortless and respectful of your time:
          </p>
          <div className="space-y-3 pt-2">
            <div className="p-4 bg-noir-card border border-zinc-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-bold text-zinc-100 text-xs">Contact the Royal Concierge within 7 Days</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Reach out via WhatsApp at <strong>+91 98765 43210</strong> or email <strong>care@jayrup.com</strong>. Include your Order Number (e.g. <em>JR-1024</em>), 2 clear photographs of the defect/leakage, or the unboxing clip.
                </p>
              </div>
            </div>

            <div className="p-4 bg-noir-card border border-zinc-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-bold text-zinc-100 text-xs">Quality Assessment & Approval</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Our quality team reviews your request within 24 business hours. Once verified, a replacement order or reverse pickup is immediately scheduled.
                </p>
              </div>
            </div>

            <div className="p-4 bg-noir-card border border-zinc-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-bold text-zinc-100 text-xs">Complimentary Reverse Pickup</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Our designated courier executive will pick up the item from your residence. Please place the item back into its original protective foam and carton.
                </p>
              </div>
            </div>

            <div className="p-4 bg-noir-card border border-zinc-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                4
              </span>
              <div>
                <p className="font-bold text-zinc-100 text-xs">Replacement Dispatch or Refund Credit</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  A fresh, unopened replacement unit is dispatched with priority air courier, or your refund is initiated immediately to your bank account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Refund Timelines & Payment Modes */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>4. Refund Timelines & Settlement Modes</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 bg-noir-card border border-zinc-800 rounded space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gold">
                Prepaid Orders (Razorpay / UPI / Cards)
              </h3>
              <p className="text-zinc-300 text-xs">
                Refunds are credited back directly to the original source instrument (Debit/Credit Card, UPI VPA, or NetBanking) via Razorpay.
              </p>
              <p className="text-[11px] text-emerald-400 font-medium">
                ⏱️ Settlement Time: 5 – 7 Banking Working Days
              </p>
            </div>

            <div className="p-5 bg-noir-card border border-zinc-800 rounded space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gold">
                Cash on Delivery (COD) Orders
              </h3>
              <p className="text-zinc-300 text-xs">
                Since cash was collected by the courier, our finance team will request your Bank Account details (Account Number, IFSC, Account Holder Name) or UPI ID.
              </p>
              <p className="text-[11px] text-emerald-400 font-medium">
                ⏱️ Direct Bank NEFT / IMPS Credit: 2 – 4 Working Days
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Cancellation Policy */}
        <section className="space-y-4">
          <h2 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
            <span>5. Order Cancellation Charter</span>
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-zinc-300">
            <li>
              <strong>Prior to Courier Dispatch:</strong> You may cancel any order within 4 hours of ordering by contacting our concierge via WhatsApp or email. A 100% full refund is issued instantly with zero penalty or deduction.
            </li>
            <li>
              <strong>Post-Dispatch Cancellation:</strong> Once assigned an Air Waybill (AWB) and handed over to the courier partner, an order cannot be canceled mid-flight. You may politely refuse the parcel at the door when the courier arrives, and our warehouse will process your refund once the parcel returns to our facility.
            </li>
          </ul>
        </section>
      </div>

      {/* Footer Concierge Strip */}
      <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Mail className="w-4 h-4 text-gold" />
          <span>Claims & Inquiries: care@jayrup.com</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/contact" className="btn-outline-gold text-xs py-2.5 px-6">
            Contact Concierge
          </Link>
          <Link to="/shipping-policy" className="btn-gold text-xs py-2.5 px-6">
            View Shipping Policy
          </Link>
        </div>
      </div>
    </div>
  );
};
