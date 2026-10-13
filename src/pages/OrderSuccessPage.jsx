import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Truck, FileDown, ShoppingBag, Mail, Package } from 'lucide-react';
import { orderService } from '../services/orderService.js';
import { SEO } from '../components/seo/SEO.jsx';
import { PageLoader, Alert } from '../components/ui/Field.jsx';
import { formatINR, formatDate } from '../config/site.js';
import { trackPurchase } from '../utils/analytics.js';

export const OrderSuccessPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    orderService
      .getMyOrder(orderNumber)
      .then((o) => {
        setOrder(o);
        if (o && (o.paymentStatus === 'PAID' || o.paymentMethod === 'COD')) trackPurchase(o);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  const handleInvoice = async () => {
    try {
      setDownloading(true);
      await orderService.downloadInvoice(orderNumber);
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <PageLoader label="Loading your order" />;

  const isCod = order?.paymentMethod === 'COD';
  const eta = new Date(Date.now() + 8 * 86400000);

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-14 px-4 sm:px-8 max-w-3xl mx-auto">
      <SEO title="Order confirmed" searchIndexing="NOINDEX_NOFOLLOW" />

      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-400/60 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold font-semibold">
          {isCod ? 'Order placed · Cash on Delivery' : 'Payment received · Order confirmed'}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl uppercase tracking-wider font-bold mt-2 mb-3">Thank you!</h1>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto">
          We’ve received your order and will start packing it right away. A confirmation has been sent to{' '}
          <span className="text-zinc-200">{order?.customerEmail || 'your e-mail'}</span>.
        </p>
      </div>

      {error && <Alert className="mt-6">{error}</Alert>}

      {order && (
        <div className="mt-10 bg-noir-card border border-gold/25 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-800/70">
            {[
              ['Order no.', <span key="o" className="font-mono text-gold">{order.orderNumber}</span>],
              ['Date', formatDate(order.createdAt)],
              [isCod ? 'Pay on delivery' : 'Paid', formatINR(order.total)],
              ['Est. delivery', `By ${formatDate(eta)}`],
            ].map(([k, v]) => (
              <div key={k} className="bg-noir-card p-4">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">{k}</p>
                <p className="text-sm font-semibold text-zinc-100 mt-1">{v}</p>
              </div>
            ))}
          </div>

          <ul className="divide-y divide-zinc-800/80 px-5">
            {order.items.map((item, idx) => (
              <li key={idx} className="py-4 flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-zinc-800" />
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.slug}`} className="text-sm font-medium text-zinc-100 hover:text-gold line-clamp-1">{item.name}</Link>
                  <p className="text-xs text-zinc-500">Qty {item.quantity}{item.variant?.title ? ` · ${item.variant.title}` : ''}</p>
                </div>
                <span className="text-sm font-semibold">{formatINR(item.subtotal)}</span>
              </li>
            ))}
          </ul>

          <div className="px-5 py-4 border-t border-zinc-800 grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Delivering to</p>
              <p className="text-zinc-200">{order.shippingAddress?.fullName}</p>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {order.shippingAddress?.addressLine1}
                {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}, {order.shippingAddress?.city},{' '}
                {order.shippingAddress?.state} – {order.shippingAddress?.postalCode}
              </p>
            </div>
            <dl className="space-y-1 text-xs sm:text-right">
              <div className="flex sm:justify-end gap-4 text-zinc-400"><dt>Subtotal</dt><dd>{formatINR(order.subtotal)}</dd></div>
              {order.discount > 0 && <div className="flex sm:justify-end gap-4 text-emerald-300"><dt>Discount</dt><dd>-{formatINR(order.discount)}</dd></div>}
              <div className="flex sm:justify-end gap-4 text-zinc-400"><dt>Shipping</dt><dd>{order.shipping ? formatINR(order.shipping) : 'FREE'}</dd></div>
              {order.codFee > 0 && <div className="flex sm:justify-end gap-4 text-zinc-400"><dt>COD fee</dt><dd>{formatINR(order.codFee)}</dd></div>}
              {order.taxAmount > 0 && <div className="flex sm:justify-end gap-4 text-zinc-400"><dt>GST</dt><dd>{formatINR(order.taxAmount)}</dd></div>}
              <div className="flex sm:justify-end gap-4 text-base font-bold text-gold pt-1"><dt>Total</dt><dd>{formatINR(order.total)}</dd></div>
            </dl>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
        <Link to={`/account/orders/${orderNumber}`} className="btn-gold">
          <Package className="w-4 h-4 mr-2" /> View order details
        </Link>
        {order?.hasInvoice && (
          <button onClick={handleInvoice} disabled={downloading} className="btn-outline-gold">
            <FileDown className="w-4 h-4 mr-2" /> {downloading ? 'Preparing…' : 'Download invoice'}
          </button>
        )}
        <Link to={`/track-order/${orderNumber}`} className="btn-outline-gold">
          <Truck className="w-4 h-4 mr-2" /> Track order
        </Link>
        <Link to="/shop" className="text-xs text-zinc-400 hover:text-gold uppercase tracking-wider inline-flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4" /> Continue shopping
        </Link>
      </div>

      <p className="mt-10 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
        <Mail className="w-4 h-4" /> Questions? Write to <a href="mailto:care@jayrup.in" className="text-gold">care@jayrup.in</a> or call +91 94081 33100
      </p>
    </div>
  );
};
