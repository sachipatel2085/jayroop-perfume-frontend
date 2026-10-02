import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Truck, Package, ArrowRight, Download } from 'lucide-react';
import { orderService } from '../services/orderService.js';
import { SEOHead } from '../components/common/SEOHead.jsx';

export const OrderSuccessPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      orderService
        .getOrderByIdentifier(orderNumber)
        .then((data) => {
          setOrder(data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [orderNumber]);

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-16 px-4 sm:px-8 max-w-4xl mx-auto text-center">
      <SEOHead title="Royal Order Confirmed" />

      {/* Royal Success Badge */}
      <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto mb-6 shadow-gold-glow animate-bounce">
        <CheckCircle2 className="w-8 h-8 text-gold" />
      </div>

      <span className="text-[11px] uppercase tracking-[0.3em] text-gold font-semibold">
        Payment & Royal Seal Verified
      </span>

      <h1 className="font-serif text-3xl sm:text-4xl uppercase tracking-wider font-bold text-zinc-100 mt-2 mb-3">
        Thank You for Your Patronage
      </h1>

      <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto font-light leading-relaxed mb-8">
        Your creation has entered the royal distillation and packaging chamber. An email notification and tracking details have been generated.
      </p>

      {/* Order Summary Card */}
      <div className="p-6 sm:p-8 bg-noir-card border border-gold/30 text-left mb-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">
              Royal Reference Number
            </span>
            <h3 className="font-mono text-lg font-bold text-gold tracking-widest">
              {orderNumber}
            </h3>
          </div>

          <Link
            to={`/track-order/${orderNumber}`}
            className="btn-gold text-[10px] py-2.5 px-4 flex items-center justify-center gap-1.5"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Track Live Dispatch</span>
          </Link>
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-4">
            <h4 className="font-serif text-xs uppercase tracking-widest text-zinc-300 font-semibold">
              Items in this Creation Batch
            </h4>
            <div className="divide-y divide-zinc-800/80">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover border border-zinc-800"
                    />
                    <div>
                      <p className="font-semibold text-zinc-200">{item.name}</p>
                      <p className="text-[11px] text-zinc-500">
                        Qty: {item.quantity} {item.variant?.title && `• ${item.variant.title}`}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-zinc-200">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-4 flex flex-col sm:flex-row justify-between text-xs gap-4">
              <div>
                <p className="text-zinc-500 uppercase tracking-wider text-[10px]">
                  Shipping Address
                </p>
                <p className="text-zinc-300 font-medium mt-0.5">
                  {order.shippingAddress?.fullName}
                </p>
                <p className="text-zinc-400 text-[11px]">
                  {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city},{' '}
                  {order.shippingAddress?.postalCode}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-zinc-500 uppercase tracking-wider text-[10px]">
                  Total Paid
                </p>
                <p className="text-gold font-sans text-xl font-bold mt-0.5">
                  ₹{order.total}
                </p>
                <span className="inline-block text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full mt-1">
                  PAID VIA RAZORPAY
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to={`/track-order/${orderNumber}`} className="btn-outline-gold text-xs py-3 px-8">
          View Step-by-Step Live Tracking
        </Link>
        <Link to="/shop" className="text-xs text-zinc-400 hover:text-gold uppercase tracking-wider font-semibold">
          Return to Treasury
        </Link>
      </div>
    </div>
  );
};
