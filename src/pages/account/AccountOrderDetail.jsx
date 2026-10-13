import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  FileDown,
  Truck,
  XCircle,
  RotateCcw,
  CreditCard,
  MapPin,
  Receipt,
  ExternalLink,
  Check,
  Package,
  ClipboardCheck,
  Home,
  LifeBuoy,
  AlertTriangle,
} from 'lucide-react';
import { orderService } from '../../services/orderService.js';
import { OrderStatusBadge, PaymentBadge, Pill } from '../../components/ui/StatusBadge.jsx';
import { Card, PageLoader, Alert, Textarea, Select } from '../../components/ui/Field.jsx';
import { useBuyAgain, usePayNow } from './orderHelpers.jsx';
import { formatINR, formatDate } from '../../config/site.js';

const STEPS = [
  { key: 'placed', label: 'Order placed', icon: ClipboardCheck },
  { key: 'confirmed', label: 'Confirmed', icon: Check },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

const stepIndex = (o) => {
  if (o.orderStatus === 'DELIVERED') return 3;
  if (o.orderStatus === 'SHIPPED') return 2;
  if (['PAID', 'PROCESSING'].includes(o.orderStatus)) return 1;
  return 0;
};

// Must match RETURN_REASONS on the server (config/productTypes.js)
const RETURN_REASONS = [
  ['DAMAGED', 'Item arrived damaged / broken', true],
  ['LEAKING', 'Leaking or spilled product', true],
  ['WRONG_ITEM', 'Received a wrong item / size', true],
  ['MISSING_ITEM', 'Item missing from the package', true],
  ['SEAL_BROKEN', 'Seal broken / tampered on arrival', true],
  ['NOT_AS_DESCRIBED', 'Not as shown on the website', true],
  ['CHANGED_MIND', 'No longer needed (unused, sealed)', false],
];
const RETURN_STATUS = { OPEN: ['Under review', 'amber'], APPROVED: ['Approved', 'emerald'], REJECTED: ['Not approved', 'red'], CLOSED: ['Closed', 'noir'] };

const MODE = { UPI_INTENT: 'UPI', UPI_COLLECT: 'UPI', UPI_QR: 'UPI QR', CARD: 'Card', NET_BANKING: 'Net Banking', TOKEN: 'Saved card' };

export const AccountOrderDetail = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [showCancel, setShowCancel] = useState(false);
  const [reason, setReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showReturn, setShowReturn] = useState(false);
  const [ret, setRet] = useState({ reason: '', message: '', preferredResolution: 'REPLACEMENT', items: [] });
  const [returning, setReturning] = useState(false);
  const buyAgain = useBuyAgain();
  const { pay, busy } = usePayNow();

  const load = () =>
    orderService
      .getMyOrder(orderNumber)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  const handleCancel = async () => {
    try {
      setCancelling(true);
      const updated = await orderService.cancelMyOrder(orderNumber, reason);
      setOrder(updated);
      setShowCancel(false);
      setNotice(
        updated.paymentMethod === 'ONLINE' && updated.paymentStatus !== 'FAILED'
          ? 'Order cancelled. Your refund has been initiated to the original payment method (up to 15 days).'
          : 'Order cancelled successfully.'
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  const itemKey = (i) => i.variant?.sku || i.sku;
  const openReturn = () => {
    setRet({ reason: '', message: '', preferredResolution: 'REPLACEMENT', items: order.items.map(itemKey) });
    setShowReturn(true);
  };
  const selectedItems = order ? order.items.filter((i) => ret.items.includes(itemKey(i))) : [];
  const blockedForChangeOfMind = selectedItems.filter((i) => i.returnable === false);
  const handleReturn = async () => {
    try {
      setReturning(true);
      setError(null);
      const res = await orderService.requestReturn(orderNumber, ret);
      setOrder(res.data);
      setShowReturn(false);
      setNotice(res.message || 'Request received.');
    } catch (err) {
      setError(err.message);
      setShowReturn(false);
    } finally {
      setReturning(false);
    }
  };

  const handleInvoice = async (inline = false) => {
    try {
      setDownloading(true);
      await orderService.downloadInvoice(orderNumber, { inline });
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <PageLoader label="Loading order" />;
  if (!order)
    return (
      <div className="space-y-4">
        <Alert>{error || 'Order not found'}</Alert>
        <Link to="/account/orders" className="btn-outline-gold">Back to orders</Link>
      </div>
    );

  const current = stepIndex(order);
  const cancelled = ['CANCELLED', 'REFUND_REQUESTED', 'REFUNDED'].includes(order.orderStatus);
  const a = order.shippingAddress || {};

  return (
    <div className="space-y-6">
      <Link to="/account/orders" className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-gold">
        <ArrowLeft className="w-4 h-4" /> All orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl tracking-wider text-zinc-100">
            Order <span className="font-mono text-gold">{order.orderNumber}</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Placed on {formatDate(order.createdAt, true)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={order.orderStatus} />
          <PaymentBadge method={order.paymentMethod} status={order.paymentStatus} />
        </div>
      </div>

      {notice && <Alert tone="success">{notice}</Alert>}
      {error && <Alert>{error}</Alert>}

      {/* Progress */}
      {!cancelled && order.orderStatus !== 'PENDING_PAYMENT' && (
        <Card>
          <ol className="grid grid-cols-4 p-5">
            {STEPS.map((s, i) => {
              const done = i <= current;
              const Icon = s.icon;
              return (
                <li key={s.key} className="relative flex flex-col items-center text-center">
                  {i > 0 && <span className={`absolute top-5 right-1/2 w-full h-0.5 ${i <= current ? 'bg-gold' : 'bg-zinc-800'}`} aria-hidden="true" />}
                  <span className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 ${done ? 'bg-gold border-gold text-black' : 'bg-noir border-zinc-700 text-zinc-500'}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className={`mt-2 text-[11px] sm:text-xs ${done ? 'text-zinc-100' : 'text-zinc-500'}`}>{s.label}</span>
                  {s.key === 'shipped' && order.shippedAt && <span className="text-[10px] text-zinc-500">{formatDate(order.shippedAt)}</span>}
                  {s.key === 'delivered' && order.deliveredAt && <span className="text-[10px] text-zinc-500">{formatDate(order.deliveredAt)}</span>}
                </li>
              );
            })}
          </ol>
          {order.trackingId && (
            <div className="border-t border-zinc-800 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-zinc-300">
                <Truck className="w-4 h-4 inline mr-2 text-gold" />
                {order.courier} · AWB <span className="font-mono text-gold">{order.trackingId}</span>
              </span>
              {order.trackingUrl && (
                <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gold inline-flex items-center gap-1 hover:underline">
                  Track with courier <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </Card>
      )}

      {order.orderStatus === 'PENDING_PAYMENT' && (
        <Alert tone="warn">
          This order is waiting for payment. Complete the payment to confirm it — unpaid orders are cancelled automatically after 2 hours.
        </Alert>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {order.canRetryPayment && (
          <button onClick={() => pay(order.orderNumber)} disabled={busy} className="btn-gold rounded-lg">
            <CreditCard className="w-4 h-4 mr-2" /> {busy ? 'Opening PhonePe…' : `Pay ${formatINR(order.total)} now`}
          </button>
        )}
        {order.hasInvoice ? (
          <>
            <button onClick={() => handleInvoice(false)} disabled={downloading} className="btn-outline-gold rounded-lg">
              <FileDown className="w-4 h-4 mr-2" /> {downloading ? 'Preparing…' : 'Download invoice (PDF)'}
            </button>
            <button onClick={() => handleInvoice(true)} className="btn-outline-gold rounded-lg">
              <Receipt className="w-4 h-4 mr-2" /> View / Print
            </button>
          </>
        ) : (
          !cancelled &&
          order.orderStatus !== 'PENDING_PAYMENT' && (
            <span className="text-xs text-zinc-500 self-center">
              <Receipt className="w-4 h-4 inline mr-1" /> GST invoice will be available once your order is dispatched.
            </span>
          )
        )}
        {['PAID', 'PROCESSING', 'SHIPPED'].includes(order.orderStatus) && (
          <Link to={`/track-order/${order.orderNumber}`} className="btn-outline-gold rounded-lg">
            <Truck className="w-4 h-4 mr-2" /> Live tracking
          </Link>
        )}
        {(order.orderStatus === 'DELIVERED' || cancelled) && (
          <button onClick={() => buyAgain(order)} className="btn-outline-gold rounded-lg">
            <RotateCcw className="w-4 h-4 mr-2" /> Buy again
          </button>
        )}
        {order.canRequestReturn && (
          <button onClick={openReturn} className="px-5 py-3 rounded-lg border border-amber-500/40 text-amber-200 text-xs uppercase tracking-[0.15em] hover:bg-amber-500/10 inline-flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" /> Report a problem / Return
          </button>
        )}
        {order.canCancel && (
          <button onClick={() => setShowCancel(true)} className="px-5 py-3 rounded-lg border border-red-500/40 text-red-300 text-xs uppercase tracking-[0.15em] hover:bg-red-500/10 inline-flex items-center">
            <XCircle className="w-4 h-4 mr-2" /> Cancel order
          </button>
        )}
      </div>

      {order.returnRequest && (
        <Card title="Return / replacement request" icon={RotateCcw}>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Pill tone={RETURN_STATUS[order.returnRequest.status]?.[1] || 'amber'}>{RETURN_STATUS[order.returnRequest.status]?.[0] || order.returnRequest.status}</Pill>
            <span className="text-zinc-300">{RETURN_REASONS.find(([k]) => k === order.returnRequest.reason)?.[1] || order.returnRequest.reason}</span>
            <span className="text-xs text-zinc-500">· requested {formatDate(order.returnRequest.requestedAt, true)} · wants {order.returnRequest.preferredResolution === 'REFUND' ? 'refund' : 'replacement'}</span>
          </div>
          <p className="text-xs text-zinc-400 mt-2">{(order.returnRequest.items || []).map((i) => `${i.name} × ${i.quantity}`).join(', ')}</p>
          {order.returnRequest.resolution && <p className="text-xs text-zinc-300 mt-2">Update from our team: {order.returnRequest.resolution}</p>}
          {order.returnRequest.status === 'OPEN' && <p className="text-[11px] text-zinc-500 mt-2">Our team will contact you within 24–48 hours. Please keep the product, packaging and photos / unboxing video ready.</p>}
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <Card title="Items" icon={Package}>
            <ul className="divide-y divide-zinc-800/80 -my-2">
              {order.items.map((item, idx) => (
                <li key={idx} className="py-3 flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover border border-zinc-800" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.slug}`} className="text-sm text-zinc-100 hover:text-gold line-clamp-2">{item.name}</Link>
                    <p className="text-xs text-zinc-500">{item.variant?.title ? `${item.variant.title} · ` : ''}Qty {item.quantity} × {formatINR(item.price)}</p>
                    {item.returnable === false && <p className="text-[10px] text-zinc-500">Non-returnable once opened · replaced if damaged / wrong</p>}
                    {order.orderStatus === 'DELIVERED' && (
                      <Link to={`/products/${item.slug}#reviews`} className="text-[11px] text-gold hover:underline">Rate & review</Link>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-zinc-100">{formatINR(item.subtotal)}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Order timeline" icon={ClipboardCheck}>
            <ol className="relative border-l border-zinc-800 ml-2 space-y-5">
              {[...order.statusHistory].reverse().map((h, i) => (
                <li key={i} className="ml-5">
                  <span className={`absolute -left-[5px] w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-gold' : 'bg-zinc-600'}`} />
                  <div className="flex flex-wrap items-center gap-2">
                    <OrderStatusBadge status={h.status} />
                    <time className="text-[11px] text-zinc-500">{formatDate(h.timestamp, true)}</time>
                  </div>
                  {h.note && <p className="text-xs text-zinc-400 mt-1">{h.note}</p>}
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Payment" icon={CreditCard}>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between text-zinc-400"><dt>Items</dt><dd>{formatINR(order.subtotal)}</dd></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-300"><dt>Discount {order.appliedCoupon?.code ? `(${order.appliedCoupon.code})` : ''}</dt><dd>-{formatINR(order.discount)}</dd></div>
              )}
              <div className="flex justify-between text-zinc-400"><dt>Shipping</dt><dd>{order.shipping ? formatINR(order.shipping) : 'FREE'}</dd></div>
              {order.codFee > 0 && <div className="flex justify-between text-zinc-400"><dt>COD charges</dt><dd>{formatINR(order.codFee)}</dd></div>}
              {order.taxAmount > 0 && <div className="flex justify-between text-zinc-400"><dt>GST</dt><dd>{formatINR(order.taxAmount)}</dd></div>}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-zinc-800"><dt>Total</dt><dd className="text-gold">{formatINR(order.total)}</dd></div>
              {order.refundedAmount > 0 && <div className="flex justify-between text-sky-300"><dt>Refunded</dt><dd>{formatINR(order.refundedAmount)}</dd></div>}
            </dl>
            <div className="mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-400 space-y-1">
              <p>Method: <span className="text-zinc-200">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : `PhonePe${order.paymentInfo?.paymentMode ? ` · ${MODE[order.paymentInfo.paymentMode] || order.paymentInfo.paymentMode}` : ''}`}</span></p>
              {order.paymentInfo?.transactionId && <p className="break-all">Txn ID: <span className="font-mono text-zinc-300">{order.paymentInfo.transactionId}</span></p>}
              {order.invoice?.number && <p>Invoice: <span className="font-mono text-zinc-300">{order.invoice.number}</span></p>}
              {order.invoice?.creditNote?.number && <p>Credit note: <span className="font-mono text-zinc-300">{order.invoice.creditNote.number}</span></p>}
            </div>
            {order.refunds?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-zinc-800 space-y-2">
                {order.refunds.map((r) => (
                  <div key={r.merchantRefundId} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Refund {formatINR(r.amount)}</span>
                    <Pill tone={r.state === 'COMPLETED' || r.state === 'MANUAL' ? 'emerald' : r.state === 'FAILED' ? 'red' : 'amber'}>{r.state === 'MANUAL' ? 'Processed' : r.state}</Pill>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Delivery address" icon={MapPin}>
            <p className="text-sm text-zinc-100">{a.fullName}</p>
            <p className="text-xs text-zinc-400 leading-relaxed mt-1">
              {a.addressLine1}
              {a.addressLine2 ? `, ${a.addressLine2}` : ''}
              <br />
              {a.city}, {a.state} – {a.postalCode}
              <br />
              Phone: {a.phone}
            </p>
            {order.billingDetails?.gstin && (
              <p className="text-xs text-zinc-400 mt-3">
                GSTIN: <span className="font-mono text-zinc-200">{order.billingDetails.gstin}</span>
                {order.billingDetails.businessName ? ` · ${order.billingDetails.businessName}` : ''}
              </p>
            )}
          </Card>

          <Card title="Need help?" icon={LifeBuoy}>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Damaged, leaking or wrong item? Use “Report a problem” above (available for 3 days after delivery) or contact us with photos. Call{' '}
              <a href="tel:+919408133100" className="text-gold">+91 94081 33100</a> or e-mail{' '}
              <a href={`mailto:care@jayrup.in?subject=Order ${order.orderNumber}`} className="text-gold">care@jayrup.in</a>.
            </p>
          </Card>
        </div>
      </div>

      {showReturn && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="bg-noir-card border border-gold/30 rounded-2xl p-6 max-w-lg w-full space-y-4 my-8">
            <h3 className="font-serif text-lg uppercase tracking-wider text-zinc-100">Report a problem</h3>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-2">Which items?</p>
              <div className="space-y-2">
                {order.items.map((i) => {
                  const k = itemKey(i);
                  const on = ret.items.includes(k);
                  return (
                    <label key={k} className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer ${on ? 'border-gold/60 bg-gold/5' : 'border-zinc-800'}`}>
                      <input type="checkbox" className="accent-[#D4AF37]" checked={on} onChange={() => setRet((r) => ({ ...r, items: on ? r.items.filter((x) => x !== k) : [...r.items, k] }))} />
                      <img src={i.image} alt="" className="w-10 h-10 rounded object-cover" />
                      <span className="text-xs text-zinc-200 flex-1">
                        {i.name}
                        {i.variant?.title ? ` (${i.variant.title})` : ''} × {i.quantity}
                        {i.returnable === false && <span className="block text-[10px] text-zinc-500">Non-returnable once opened</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
            <Select label="What went wrong?" value={ret.reason} onChange={(e) => setRet((r) => ({ ...r, reason: e.target.value }))}>
              <option value="">Choose a reason…</option>
              {RETURN_REASONS.map(([k, l, anyItem]) => (
                <option key={k} value={k} disabled={!anyItem && blockedForChangeOfMind.length > 0}>
                  {l}
                  {!anyItem && blockedForChangeOfMind.length > 0 ? ' – not available for opened/non-returnable items' : ''}
                </option>
              ))}
            </Select>
            <Select label="I would prefer" value={ret.preferredResolution} onChange={(e) => setRet((r) => ({ ...r, preferredResolution: e.target.value }))}>
              <option value="REPLACEMENT">A replacement</option>
              <option value="REFUND">A refund</option>
            </Select>
            <Textarea
              label="Describe the problem"
              rows={4}
              maxLength={1500}
              value={ret.message}
              onChange={(e) => setRet((r) => ({ ...r, message: e.target.value }))}
              placeholder="Tell us what happened. Our team will ask for photos / an unboxing video on e-mail or WhatsApp."
            />
            <p className="text-[11px] text-zinc-500">
              As per our <Link to="/refund-return-policy" className="underline">Refund &amp; Return Policy</Link>, requests are accepted within 3 days of delivery.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowReturn(false)} className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300">Close</button>
              <button onClick={handleReturn} disabled={returning || !ret.reason || ret.items.length === 0} className="btn-gold rounded-lg !py-2">
                {returning ? 'Sending…' : 'Submit request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-noir-card border border-gold/30 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-serif text-lg uppercase tracking-wider text-zinc-100">Cancel this order?</h3>
            <p className="text-xs text-zinc-400">
              {order.paymentStatus === 'PAID'
                ? `${formatINR(order.total)} will be refunded to your original payment method (PhonePe). Refunds can take up to 15 days to reflect.`
                : 'Your order will be cancelled and nothing will be charged.'}
            </p>
            <Textarea label="Reason (optional)" rows={3} maxLength={200} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ordered by mistake, changed address…" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCancel(false)} className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300">Keep order</button>
              <button onClick={handleCancel} disabled={cancelling} className="px-4 py-2 rounded-lg bg-red-500/90 hover:bg-red-500 text-white text-sm font-semibold">
                {cancelling ? 'Cancelling…' : 'Yes, cancel order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
