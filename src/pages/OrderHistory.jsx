import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import { orderService } from '../services/orderService.js';
import { Badge } from '../components/common/Badge.jsx';
import { SEOHead } from '../components/common/SEOHead.jsx';

export const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getMyOrders()
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'emerald';
      case 'SHIPPED':
        return 'amber';
      case 'PAID':
      case 'PROCESSING':
        return 'gold';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'red';
      default:
        return 'noir';
    }
  };

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-12 px-4 sm:px-8 max-w-5xl mx-auto">
      <SEOHead title="Order History & Tracking" />

      <div className="border-b border-gold/20 pb-6 mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-zinc-100 font-semibold">
          Order Treasury & Tracking
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Historical records of your bespoke fragrance and skincare orders
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-xs uppercase tracking-widest text-gold">Loading Orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-noir-card border border-zinc-800 p-8">
          <Package className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
          <h3 className="font-serif text-base uppercase tracking-wider text-zinc-300 mb-2">
            No Past Orders Found
          </h3>
          <p className="text-xs text-zinc-500 mb-6">
            You haven't placed an order with Jayroop yet.
          </p>
          <Link to="/shop" className="btn-gold text-xs py-3 px-8">
            Explore Creations
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord._id}
              className="p-6 bg-noir-card border border-gold/15 hover:border-gold/35 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-gold tracking-widest">
                      {ord.orderNumber}
                    </span>
                    <Badge variant={getStatusBadgeVariant(ord.orderStatus)}>
                      {ord.orderStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-zinc-500 block mt-1">
                    Placed on {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                    {new Date(ord.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:text-right">
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 block">Total</span>
                    <span className="text-base font-bold text-zinc-100 font-sans">
                      ₹{ord.total}
                    </span>
                  </div>

                  <Link
                    to={`/track-order/${ord.orderNumber}`}
                    className="btn-gold text-[10px] py-2 px-3.5 flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Live</span>
                  </Link>
                </div>
              </div>

              {/* Items Snapshot */}
              <div className="flex flex-wrap gap-4 pt-1">
                {ord.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-noir p-2.5 border border-zinc-800/80">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover border border-zinc-800"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-zinc-200">{item.name}</p>
                      <p className="text-[10px] text-zinc-500">
                        Qty: {item.quantity} {item.variant?.title && `• ${item.variant.title}`}
                      </p>
                      <p className="text-[11px] font-bold text-gold mt-0.5">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tracking ID Info if shipped */}
              {ord.trackingId && (
                <div className="pt-2 text-xs text-zinc-400 flex items-center justify-between border-t border-zinc-850">
                  <span>
                    Dispatched with <strong>{ord.courier}</strong> (AWB: <span className="font-mono text-gold">{ord.trackingId}</span>)
                  </span>
                  <Link
                    to={`/track-order/${ord.orderNumber}`}
                    className="text-gold-light hover:underline text-[11px] uppercase tracking-wider font-semibold"
                  >
                    View Status Timeline →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
