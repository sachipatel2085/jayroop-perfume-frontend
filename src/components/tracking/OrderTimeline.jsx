import React from 'react';
import { CheckCircle2, Clock, Truck, PackageCheck, AlertCircle, ExternalLink } from 'lucide-react';

export const OrderTimeline = ({ order }) => {
  if (!order) return null;

  const steps = [
    { key: 'PENDING_PAYMENT', label: 'Order Placed', icon: Clock },
    { key: 'PAID', label: 'Payment Confirmed', icon: CheckCircle2 },
    { key: 'PROCESSING', label: 'Processing & Bottling', icon: PackageCheck },
    { key: 'SHIPPED', label: 'Shipped via Courier', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 0;
      case 'PAID':
        return 1;
      case 'PROCESSING':
        return 2;
      case 'SHIPPED':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 1;
    }
  };

  const isCancelled = order.orderStatus === 'CANCELLED';
  const isRefunded = order.orderStatus === 'REFUNDED';
  const currentStep = getStepIndex(order.orderStatus);

  if (isCancelled || isRefunded) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/30 text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
        <h4 className="font-serif text-base uppercase tracking-wider text-red-400 font-bold">
          Order {isCancelled ? 'Cancelled' : 'Refunded'}
        </h4>
        <p className="text-xs text-zinc-400 mt-1">
          This order has been {isCancelled ? 'cancelled' : 'refunded'}. Please reach out to Royal Concierge if you need assistance.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-noir-card border border-gold/25 p-6 my-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Live Status</span>
          <h4 className="font-serif text-base text-gold uppercase tracking-wider font-semibold">
            {order.orderStatus.replace('_', ' ')}
          </h4>
        </div>

        {/* Courier & Tracking Details */}
        {order.courier && order.trackingId && (
          <div className="bg-noir border border-gold/30 px-3.5 py-2 text-right">
            <div className="text-[10px] uppercase tracking-wider text-zinc-400">
              Dispatched via <strong className="text-zinc-200">{order.courier}</strong>
            </div>
            <div className="flex items-center gap-1.5 justify-end mt-0.5">
              <span className="text-xs font-mono font-bold text-gold tracking-wider">
                {order.trackingId}
              </span>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-light hover:text-white inline-flex items-center"
                  title="Track on Courier Portal"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Visual Timeline Steps */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-2">
        {steps.map((step, idx) => {
          const isDone = idx <= currentStep;
          const isCurrent = idx === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:gap-2 flex-1 text-left sm:text-center z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div>
                <span
                  className={`text-[11px] uppercase tracking-wider font-semibold block ${
                    isCurrent
                      ? 'text-gold-light font-bold'
                      : isDone
                      ? 'text-zinc-200'
                      : 'text-zinc-600'
                  }`}
                >
                  {step.label}
                </span>

                {idx === 3 && order.trackingId && (
                  <span className="text-[10px] text-gold/90 font-mono block mt-0.5">
                    {order.courier}: {order.trackingId}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
