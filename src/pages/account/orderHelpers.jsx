import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileDown, Truck, RotateCcw, CreditCard, ChevronRight } from 'lucide-react';
import { OrderStatusBadge, PaymentBadge } from '../../components/ui/StatusBadge.jsx';
import { orderService } from '../../services/orderService.js';
import { paymentService } from '../../services/paymentService.js';
import { useCart } from '../../context/CartContext.jsx';
import { formatINR, formatDate } from '../../config/site.js';

export const useBuyAgain = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  return (order) => {
    order.items.forEach((item) => {
      addToCart(
        { _id: item.product, name: item.name, slug: item.slug, images: [{ url: item.image }], price: item.price },
        item.variant?.sku ? { sku: item.variant.sku, title: item.variant.title, price: item.price } : null,
        item.quantity
      );
    });
    navigate('/cart');
  };
};

export const usePayNow = () => {
  const [busy, setBusy] = useState(false);
  const pay = async (orderNumber) => {
    try {
      setBusy(true);
      const res = await paymentService.retry(orderNumber);
      if (res.alreadyPaid) window.location.assign(`/account/orders/${orderNumber}`);
      else window.location.assign(res.redirectUrl);
    } catch (err) {
      alert(err.message);
      setBusy(false);
    }
  };
  return { pay, busy };
};

export const OrderCard = ({ order }) => {
  const buyAgain = useBuyAgain();
  const { pay, busy } = usePayNow();
  const [downloading, setDownloading] = useState(false);

  const handleInvoice = async () => {
    try {
      setDownloading(true);
      await orderService.downloadInvoice(order.orderNumber);
    } catch (err) {
      alert(err.message);
    } finally {
      setDownloading(false);
    }
  };

  const units = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <article className="bg-noir-card border border-gold/15 hover:border-gold/35 rounded-xl transition-colors">
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800/80">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="font-mono text-sm font-bold text-gold">{order.orderNumber}</span>
          <span className="text-zinc-500">{formatDate(order.createdAt)}</span>
          <span className="text-zinc-500">{units} item{units > 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.orderStatus} />
          <PaymentBadge method={order.paymentMethod} status={order.paymentStatus} />
        </div>
      </header>

      <Link to={`/account/orders/${order.orderNumber}`} className="flex items-center gap-4 px-5 py-4 group">
        <div className="flex -space-x-3">
          {order.items.slice(0, 4).map((item, i) => (
            <img key={i} src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover border-2 border-noir-card bg-noir" loading="lazy" />
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-zinc-100 line-clamp-1">{order.items.map((i) => i.name).join(', ')}</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {order.orderStatus === 'SHIPPED' && order.courier ? `Shipped via ${order.courier} · AWB ${order.trackingId}` : null}
            {order.orderStatus === 'DELIVERED' && order.deliveredAt ? `Delivered on ${formatDate(order.deliveredAt)}` : null}
            {order.orderStatus === 'PENDING_PAYMENT' ? 'Payment pending – complete payment to confirm' : null}
          </p>
        </div>
        <div className="text-right">
          <p className="text-base font-bold text-zinc-100">{formatINR(order.total)}</p>
          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-gold ml-auto mt-1" />
        </div>
      </Link>

      <footer className="flex flex-wrap gap-2 px-5 pb-4">
        {order.canRetryPayment && (
          <button onClick={() => pay(order.orderNumber)} disabled={busy} className="btn-gold !px-4 !py-2 rounded-lg">
            <CreditCard className="w-3.5 h-3.5 mr-1.5" /> {busy ? 'Opening PhonePe…' : 'Pay now'}
          </button>
        )}
        {order.hasInvoice && (
          <button onClick={handleInvoice} disabled={downloading} className="btn-outline-gold !px-4 !py-2 rounded-lg">
            <FileDown className="w-3.5 h-3.5 mr-1.5" /> {downloading ? 'Preparing…' : 'Invoice'}
          </button>
        )}
        {['PAID', 'PROCESSING', 'SHIPPED'].includes(order.orderStatus) && (
          <Link to={`/track-order/${order.orderNumber}`} className="btn-outline-gold !px-4 !py-2 rounded-lg">
            <Truck className="w-3.5 h-3.5 mr-1.5" /> Track
          </Link>
        )}
        {['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.orderStatus) && (
          <button onClick={() => buyAgain(order)} className="btn-outline-gold !px-4 !py-2 rounded-lg">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Buy again
          </button>
        )}
      </footer>
    </article>
  );
};
