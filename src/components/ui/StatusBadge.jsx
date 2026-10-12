import React from 'react';
import { ORDER_STATUS_META } from '../../config/site.js';

const TONES = {
  gold: 'bg-gold/15 text-gold border-gold/40',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  red: 'bg-red-500/15 text-red-300 border-red-500/40',
  blue: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
  noir: 'bg-zinc-800 text-zinc-300 border-zinc-700',
};

export const Pill = ({ tone = 'noir', children, className = '' }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${TONES[tone] || TONES.noir} ${className}`}>
    {children}
  </span>
);

export const OrderStatusBadge = ({ status }) => {
  const meta = ORDER_STATUS_META[status] || { label: status, tone: 'noir' };
  return <Pill tone={meta.tone}>{meta.label}</Pill>;
};

const PAY = {
  PAID: ['Paid', 'emerald'],
  PENDING: ['Unpaid', 'amber'],
  FAILED: ['Payment Failed', 'red'],
  REFUNDED: ['Refunded', 'noir'],
  PARTIALLY_REFUNDED: ['Part Refunded', 'amber'],
};

export const PaymentBadge = ({ method, status }) => {
  const [label, tone] = PAY[status] || [status, 'noir'];
  return (
    <span className="inline-flex flex-wrap gap-1">
      <Pill tone={method === 'COD' ? 'amber' : 'blue'}>{method === 'COD' ? 'COD' : 'PhonePe'}</Pill>
      <Pill tone={method === 'COD' && status === 'PENDING' ? 'noir' : tone}>{method === 'COD' && status === 'PENDING' ? 'Pay on delivery' : label}</Pill>
    </span>
  );
};
