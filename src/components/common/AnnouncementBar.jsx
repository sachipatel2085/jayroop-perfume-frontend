import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Truck, TicketPercent, Copy, Check } from 'lucide-react';
import { useStoreSettings } from '../../hooks/useStoreSettings.js';

const ICON = { SHIPPING: Truck, COUPON: TicketPercent, MESSAGE: Sparkles };

const Item = ({ item }) => {
  const [copied, setCopied] = useState(false);
  const Icon = ICON[item.type] || Sparkles;
  if (item.type === 'COUPON') {
    // "{code}" in the admin text becomes a tap-to-copy code
    const [before, after = ''] = item.text.split('{code}');
    const copy = () => {
      navigator.clipboard?.writeText(item.code).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };
    return (
      <span className="inline-flex items-center gap-1.5">
        <Icon className="w-3 h-3 text-gold flex-shrink-0" aria-hidden="true" />
        <span>{before}</span>
        <button type="button" onClick={copy} className="inline-flex items-center gap-1 font-bold underline decoration-dotted underline-offset-2 hover:text-white" title="Copy code">
          {item.code}
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 opacity-70" />}
        </button>
        <span>{after}</span>
      </span>
    );
  }
  const body = (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="w-3 h-3 text-gold flex-shrink-0" aria-hidden="true" />
      <span>{item.text}</span>
    </span>
  );
  if (item.link) {
    return /^https?:\/\//.test(item.link) ? (
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-white">{body}</a>
    ) : (
      <Link to={item.link} className="hover:text-white">{body}</Link>
    );
  }
  return body;
};

/**
 * Strip above the navigation on every storefront page. Fully controlled from
 * Admin › Settings › Storefront › Announcement strip. The coupon line appears only while the coupon is live.
 */
export const AnnouncementBar = () => {
  const settings = useStoreSettings();
  const bar = settings?.announcement;
  const items = bar?.enabled ? bar.items || [] : [];
  const [i, setI] = useState(0);

  // On phones one message at a time, rotating
  useEffect(() => {
    if (items.length < 2) return undefined;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;
  return (
    <div className="bg-gradient-to-r from-noir via-[#161309] to-noir border-b border-gold/20 py-1.5 px-3 sm:px-4 text-center" role="region" aria-label="Offers">
      {/* Desktop: everything in one line */}
      <div className="hidden md:flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.2em] text-gold-light">
        {items.map((it, k) => (
          <React.Fragment key={k}>
            {k > 0 && <span className="text-zinc-600" aria-hidden="true">•</span>}
            <Item item={it} />
          </React.Fragment>
        ))}
      </div>
      {/* Mobile: rotating */}
      <div className="md:hidden text-[10px] uppercase tracking-[0.16em] text-gold-light truncate" aria-live="polite">
        <Item item={items[i % items.length]} />
      </div>
    </div>
  );
};
