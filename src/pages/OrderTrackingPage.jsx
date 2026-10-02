import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Truck, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import { orderService } from '../services/orderService.js';
import { OrderTimeline } from '../components/tracking/OrderTimeline.jsx';
import { SEOHead } from '../components/common/SEOHead.jsx';

export const OrderTrackingPage = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  const [inputNumber, setInputNumber] = useState(orderNumber || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = async (refNum) => {
    if (!refNum) return;
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrderByIdentifier(refNum.trim());
      setOrder(data);
    } catch (err) {
      setError(err.message || 'Order not found. Please check your reference number.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      setInputNumber(orderNumber);
      fetchOrder(orderNumber);
    }
  }, [orderNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputNumber.trim()) {
      navigate(`/track-order/${inputNumber.trim()}`);
      fetchOrder(inputNumber.trim());
    }
  };

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-12 px-4 sm:px-8 max-w-4xl mx-auto">
      <SEOHead title="Track Royal Dispatch & Courier" />

      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
          Dispatch & Logistics
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl uppercase tracking-wider font-bold text-zinc-100">
          Track Your Royal Order
        </h1>
        <p className="text-xs text-zinc-400 font-light">
          Monitor your precious cargo from our bottling laboratory to your doorstep.
        </p>
      </div>

      {/* Reference Number Search Bar */}
      <div className="bg-noir-card border border-gold/25 p-5 mb-8 shadow-xl">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            required
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
            placeholder="Enter Royal Order Number (e.g. JR-2026-8941)"
            className="flex-1 bg-noir border border-zinc-800 p-3 text-xs uppercase tracking-wider text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold font-mono"
          />
          <button type="submit" disabled={loading} className="btn-gold py-3 px-6 text-xs">
            <span>{loading ? 'Locating...' : 'Track'}</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 mb-8">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Result */}
      {order && (
        <div className="space-y-6">
          {/* Visual Milestone Timeline */}
          <OrderTimeline order={order} />

          {/* Courier Details & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-noir-card border border-gold/15 space-y-3">
              <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-wider font-semibold">
                <Truck className="w-4 h-4" />
                <span>Courier Logistics</span>
              </div>
              <div className="text-xs space-y-1.5 text-zinc-300">
                <p>
                  Courier Partner:{' '}
                  <strong className="text-zinc-100">{order.courier || 'Pending Dispatch Assignment'}</strong>
                </p>
                <p>
                  Tracking AWB / ID:{' '}
                  <strong className="text-gold font-mono">{order.trackingId || 'Pending Assignment'}</strong>
                </p>
                {order.shippedAt && (
                  <p className="text-[11px] text-zinc-400">
                    Dispatched On: {new Date(order.shippedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 bg-noir-card border border-gold/15 space-y-3">
              <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-wider font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Destination Address</span>
              </div>
              <div className="text-xs text-zinc-300">
                <p className="font-semibold text-zinc-100">{order.shippingAddress?.fullName}</p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city},{' '}
                  {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Phone: {order.shippingAddress?.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Status History Log */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="p-6 bg-noir-card border border-gold/15">
              <h4 className="font-serif text-xs uppercase tracking-widest text-gold font-semibold mb-4">
                Milestone Activity Log
              </h4>
              <div className="divide-y divide-zinc-800/80">
                {order.statusHistory.slice().reverse().map((hist, i) => (
                  <div key={i} className="py-2.5 flex items-start justify-between text-xs gap-4">
                    <div>
                      <span className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">
                        {hist.status.replace('_', ' ')}
                      </span>
                      {hist.note && (
                        <p className="text-[11px] text-zinc-400 mt-0.5">{hist.note}</p>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500 flex-shrink-0">
                      {new Date(hist.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
