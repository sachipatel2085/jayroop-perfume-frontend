import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Truck,
  Search,
  X,
  FileText,
  Printer,
  Tag,
  RefreshCw,
  RotateCcw,
  Save,
  Receipt,
  User,
  MapPin,
  CreditCard,
  StickyNote,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
  Package,
} from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { OrderStatusBadge, PaymentBadge, Pill } from '../../components/ui/StatusBadge.jsx';
import { Alert } from '../../components/ui/Field.jsx';
import { ORDER_STATUS_META } from '../../config/site.js';

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const dt = (d) => (d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');

const STATUS_TABS = ['', 'PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'RETURN_OPEN', 'REFUND_REQUESTED', 'CANCELLED', 'REFUNDED'];
const TAB_LABEL = { RETURN_OPEN: 'Return requests' };
const RETURN_REASON_LABEL = {
  DAMAGED: 'Damaged / broken',
  LEAKING: 'Leaking / spilled',
  WRONG_ITEM: 'Wrong item / size',
  MISSING_ITEM: 'Item missing',
  SEAL_BROKEN: 'Seal broken / tampered',
  NOT_AS_DESCRIBED: 'Not as described',
  CHANGED_MIND: 'Changed mind (unused)',
};
const TRANSITIONS = {
  PENDING_PAYMENT: ['PROCESSING', 'CANCELLED'],
  PAID: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUND_REQUESTED'],
  PROCESSING: ['SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUND_REQUESTED'],
  SHIPPED: ['DELIVERED', 'PROCESSING', 'CANCELLED', 'REFUND_REQUESTED'],
  DELIVERED: ['REFUND_REQUESTED', 'SHIPPED'],
  REFUND_REQUESTED: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
  CANCELLED: [],
  REFUNDED: [],
};
const COURIERS = ['Delhivery', 'BlueDart', 'DTDC', 'Shiprocket', 'Xpressbees', 'Ecom Express', 'Ekart', 'India Post Speed Post', 'Other'];

export const AdminOrders = () => {
  const [params, setParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, statusCounts: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const filters = {
    status: params.get('status') || '',
    paymentMethod: params.get('pm') || '',
    search: params.get('search') || '',
    from: params.get('from') || '',
    to: params.get('to') || '',
    page: Number(params.get('page') || 1),
  };
  const [searchInput, setSearchInput] = useState(filters.search);

  const setFilter = (patch) => {
    const next = { ...Object.fromEntries(params.entries()), ...patch };
    if (!('page' in patch)) next.page = '1';
    Object.keys(next).forEach((k) => (next[k] === '' || next[k] === undefined) && delete next[k]);
    setParams(next);
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getOrders({
        status: filters.status || undefined,
        paymentMethod: filters.paymentMethod || undefined,
        search: filters.search || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
        page: filters.page,
        limit: 20,
      });
      setOrders(res.data || []);
      setMeta({ total: res.total, totalPages: res.totalPages || 1, statusCounts: res.statusCounts || {} });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => searchInput !== filters.search && setFilter({ search: searchInput }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const onUpdated = (o) => {
    setSelected(o);
    setOrders((prev) => prev.map((x) => (x._id === o._id ? { ...x, ...o } : x)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold">Orders</h1>
          <p className="text-xs text-zinc-400 mt-1">Fulfil, invoice, print labels, verify PhonePe payments and refund — all in one place.</p>
        </div>
        <button
          onClick={() => adminService.exportReport('orders', 'xlsx', { from: filters.from || undefined, to: filters.to || undefined }).catch((e) => setError(e.message))}
          className="btn-outline-gold rounded-lg !py-2"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" /> Export to Excel
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setFilter({ status: s })}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border ${
              filters.status === s ? 'bg-gold text-black border-gold font-semibold' : 'border-zinc-800 text-zinc-400 hover:text-gold'
            }`}
          >
            {s ? TAB_LABEL[s] || ORDER_STATUS_META[s]?.label || s : 'All'}
            {s && meta.statusCounts[s] ? <span className="ml-1.5 opacity-70">{meta.statusCounts[s]}</span> : null}
          </button>
        ))}
      </div>

      <div className="bg-noir-card border border-zinc-800 rounded-xl p-3 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search order no., invoice no., name, phone, e-mail, AWB or PhonePe txn…"
            className="w-full bg-noir border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-gold"
          />
        </div>
        <select value={filters.paymentMethod} onChange={(e) => setFilter({ pm: e.target.value })} className="bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200">
          <option value="">All payments</option>
          <option value="ONLINE">PhonePe</option>
          <option value="COD">COD</option>
        </select>
        <input type="date" value={filters.from} onChange={(e) => setFilter({ from: e.target.value })} className="bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 [color-scheme:dark]" aria-label="From" />
        <input type="date" value={filters.to} onChange={(e) => setFilter({ to: e.target.value })} className="bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 [color-scheme:dark]" aria-label="To" />
      </div>

      {error && <Alert>{error}</Alert>}

      <div className="bg-noir-card border border-zinc-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4 text-right">Total</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Invoice / AWB</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {loading && (
              <tr><td colSpan={7} className="py-10 text-center"><Loader2 className="w-5 h-5 animate-spin text-gold inline" /></td></tr>
            )}
            {!loading && orders.length === 0 && (
              <tr><td colSpan={7} className="py-10 text-center text-zinc-500">No orders match these filters.</td></tr>
            )}
            {!loading &&
              orders.map((o) => (
                <tr key={o._id} onClick={() => setSelected(o)} className="hover:bg-white/[0.03] cursor-pointer">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-gold">{o.orderNumber}</span>
                    <span className="block text-[10px] text-zinc-500">{dt(o.createdAt)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-zinc-200 font-medium">{o.shippingAddress?.fullName}</p>
                    <p className="text-[10px] text-zinc-500">{o.shippingAddress?.city}, {o.shippingAddress?.state} · {o.shippingAddress?.phone}</p>
                  </td>
                  <td className="py-3 px-4 text-zinc-400">{o.items?.reduce((s, i) => s + i.quantity, 0)} units</td>
                  <td className="py-3 px-4 text-right font-bold text-zinc-100">{money(o.total)}</td>
                  <td className="py-3 px-4"><PaymentBadge method={o.paymentMethod} status={o.paymentStatus} /></td>
                  <td className="py-3 px-4"><OrderStatusBadge status={o.orderStatus} /></td>
                  <td className="py-3 px-4 text-[11px]">
                    <p className="font-mono text-zinc-300">{o.invoice?.number || <span className="text-zinc-600">—</span>}</p>
                    {o.trackingId && <p className="text-zinc-500">{o.courier}: {o.trackingId}</p>}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>{meta.total} orders</span>
          <div className="flex items-center gap-2">
            <button disabled={filters.page <= 1} onClick={() => setFilter({ page: String(filters.page - 1) })} className="p-2 rounded-lg border border-zinc-800 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            <span>Page {filters.page} / {meta.totalPages}</span>
            <button disabled={filters.page >= meta.totalPages} onClick={() => setFilter({ page: String(filters.page + 1) })} className="p-2 rounded-lg border border-zinc-800 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {selected && <OrderDrawer orderId={selected._id} onClose={() => setSelected(null)} onUpdated={onUpdated} />}
    </div>
  );
};

const Section = ({ title, icon: Icon, children, action }) => (
  <section className="border border-zinc-800 rounded-xl">
    <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
      <h3 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
        <Icon className="w-3.5 h-3.5" /> {title}
      </h3>
      {action}
    </header>
    <div className="p-4">{children}</div>
  </section>
);

const OrderDrawer = ({ orderId, onClose, onUpdated }) => {
  const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState(null);
  const [msg, setMsg] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', note: '' });
  const [tracking, setTracking] = useState({ courier: 'Delhivery', trackingId: '', trackingUrl: '', note: '' });
  const [refund, setRefund] = useState({ amount: '', reason: '', manual: false });
  const [note, setNote] = useState('');
  const [retResolution, setRetResolution] = useState('');

  const load = useCallback(async () => {
    const o = await adminService.getOrder(orderId);
    setOrder(o);
    setNote(o.adminNote || '');
    setTracking((t) => ({ ...t, courier: o.courier || 'Delhivery', trackingId: o.trackingId || '', trackingUrl: o.trackingUrl || '' }));
    setStatusForm({ status: '', note: '' });
  }, [orderId]);

  useEffect(() => {
    load().catch((e) => setMsg({ tone: 'error', text: e.message }));
  }, [load]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const act = async (key, fn, success) => {
    try {
      setBusy(key);
      setMsg(null);
      const res = await fn();
      if (res && res._id) {
        setOrder(res);
        onUpdated(res);
      } else {
        await load();
      }
      if (success) setMsg({ tone: 'success', text: success });
    } catch (err) {
      setMsg({ tone: 'error', text: err.message });
    } finally {
      setBusy(null);
    }
  };

  if (!order) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 flex justify-end">
        <div className="w-full max-w-3xl bg-noir h-full flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-gold" /></div>
      </div>
    );
  }

  const a = order.shippingAddress || {};
  const nextStatuses = TRANSITIONS[order.orderStatus] || [];
  const refundable = Math.max(0, Number(order.total) - Number(order.refundedAmount || 0));
  const canRefund = ['PAID', 'PARTIALLY_REFUNDED'].includes(order.paymentStatus);
  const canInvoice = !['PENDING_PAYMENT', 'CANCELLED'].includes(order.orderStatus);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end" onClick={onClose}>
      <aside className="w-full max-w-3xl bg-noir h-full overflow-y-auto border-l border-gold/30 shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="sticky top-0 z-10 bg-noir/95 backdrop-blur border-b border-zinc-800 px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-lg font-bold text-gold">{order.orderNumber}</p>
            <p className="text-[11px] text-zinc-500">{dt(order.createdAt)} · {order.user?.email || order.customerEmail}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <OrderStatusBadge status={order.orderStatus} />
              <PaymentBadge method={order.paymentMethod} status={order.paymentStatus} />
              {order.invoice?.number && <Pill tone="gold">{order.invoice.number}{order.invoice.status === 'CANCELLED' ? ' · CANCELLED' : ''}</Pill>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white" aria-label="Close"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5">
          {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
          {order.adminNote?.includes('⚠') && <Alert tone="warn">{order.adminNote}</Alert>}

          {/* Documents */}
          <div className="flex flex-wrap gap-2">
            {order.invoice?.number ? (
              <>
                <button onClick={() => act('inv', () => adminService.openInvoice(order._id))} className="btn-gold rounded-lg !py-2 !px-3"><Printer className="w-3.5 h-3.5 mr-1.5" />Print invoice</button>
                <button onClick={() => act('inv2', () => adminService.openInvoice(order._id, 'duplicate'))} className="btn-outline-gold rounded-lg !py-2 !px-3"><FileText className="w-3.5 h-3.5 mr-1.5" />Duplicate copy</button>
                <button onClick={() => act('inv3', () => adminService.downloadInvoice(order._id, order.invoice.number.replace(/\//g, '-')))} className="btn-outline-gold rounded-lg !py-2 !px-3"><Receipt className="w-3.5 h-3.5 mr-1.5" />Download PDF</button>
              </>
            ) : (
              canInvoice && (
                <button onClick={() => act('gen', () => adminService.generateInvoice(order._id), 'Invoice issued')} disabled={busy === 'gen'} className="btn-gold rounded-lg !py-2 !px-3">
                  {busy === 'gen' ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Receipt className="w-3.5 h-3.5 mr-1.5" />}Generate GST invoice
                </button>
              )
            )}
            <button onClick={() => act('lbl', () => adminService.openLabel(order._id))} className="btn-outline-gold rounded-lg !py-2 !px-3"><Tag className="w-3.5 h-3.5 mr-1.5" />Shipping label (4×6)</button>
            {order.paymentMethod === 'ONLINE' && !['PAID', 'REFUNDED', 'PARTIALLY_REFUNDED'].includes(order.paymentStatus) && (
              <button onClick={() => act('sync', () => adminService.syncPayment(order._id), 'Payment status refreshed from PhonePe')} className="btn-outline-gold rounded-lg !py-2 !px-3">
                {busy === 'sync' ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}Check PhonePe status
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Section title="Customer" icon={User}>
              <p className="text-sm text-zinc-100">{a.fullName}</p>
              <p className="text-xs text-zinc-400">{a.phone} · {order.customerEmail || order.user?.email}</p>
              {order.billingDetails?.gstin && <p className="text-xs text-zinc-300 mt-2">GSTIN <span className="font-mono">{order.billingDetails.gstin}</span> {order.billingDetails.businessName}</p>}
              {order.customerNote && <p className="text-xs text-amber-200/90 mt-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">“{order.customerNote}”</p>}
            </Section>
            <Section title="Ship to" icon={MapPin}>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {a.fullName}<br />{a.addressLine1}{a.addressLine2 ? `, ${a.addressLine2}` : ''}<br />{a.city}, {a.state} – {a.postalCode}<br />{a.phone}
              </p>
            </Section>
          </div>

          <Section title={`Items (${order.items.length})`} icon={Package}>
            <ul className="divide-y divide-zinc-800">
              {order.items.map((i, idx) => (
                <li key={idx} className="py-2 flex items-center gap-3 text-xs">
                  <img src={i.image} alt="" className="w-10 h-10 rounded object-cover border border-zinc-800" />
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-100 truncate">{i.name}{i.variant?.title ? ` · ${i.variant.title}` : ''}</p>
                    <p className="text-zinc-500">
                      SKU {i.variant?.sku || i.sku || '—'} · HSN {i.hsnCode || '—'} · GST {i.gstRate ?? 18}%{i.categoryName ? ` · ${i.categoryName}` : ''}
                      {i.returnable === false ? ' · non-returnable' : ''}
                    </p>
                  </div>
                  <span className="text-zinc-400">{i.quantity} × {money(i.price)}</span>
                  <span className="text-zinc-100 font-semibold w-20 text-right">{money(i.subtotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 pt-3 border-t border-zinc-800 text-xs space-y-1">
              <div className="flex justify-between text-zinc-400"><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
              {order.discount > 0 && <div className="flex justify-between text-emerald-300"><dt>Discount {order.appliedCoupon?.code}</dt><dd>-{money(order.discount)}</dd></div>}
              <div className="flex justify-between text-zinc-400"><dt>Shipping</dt><dd>{money(order.shipping)}</dd></div>
              {order.codFee > 0 && <div className="flex justify-between text-zinc-400"><dt>COD fee</dt><dd>{money(order.codFee)}</dd></div>}
              {order.taxAmount > 0 && <div className="flex justify-between text-zinc-400"><dt>GST added</dt><dd>{money(order.taxAmount)}</dd></div>}
              {order.shippingZone && <div className="flex justify-between text-zinc-500 text-xs"><dt>Shipping zone</dt><dd>{order.shippingZone}</dd></div>}
              {order.invoice?.number && (
                <div className="flex justify-between text-zinc-500">
                  <dt>Taxable {money(order.invoice.totalTaxable)} · {order.invoice.isInterState ? `IGST ${money(order.invoice.totalIgst)}` : `CGST ${money(order.invoice.totalCgst)} + SGST ${money(order.invoice.totalSgst)}`}</dt>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-gold pt-1"><dt>Total</dt><dd>{money(order.total)}</dd></div>
              {order.refundedAmount > 0 && <div className="flex justify-between text-sky-300"><dt>Refunded</dt><dd>{money(order.refundedAmount)}</dd></div>}
            </dl>
          </Section>

          {order.returnRequest && (
            <Section title="Return / replacement request" icon={RefreshCw}>
              <div className="space-y-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone={order.returnRequest.status === 'OPEN' ? 'amber' : order.returnRequest.status === 'APPROVED' ? 'emerald' : order.returnRequest.status === 'REJECTED' ? 'red' : 'noir'}>
                    {order.returnRequest.status}
                  </Pill>
                  <span className="text-zinc-200">{RETURN_REASON_LABEL[order.returnRequest.reason] || order.returnRequest.reason}</span>
                  <span className="text-zinc-500">· wants {order.returnRequest.preferredResolution?.toLowerCase()} · {dt(order.returnRequest.requestedAt)}</span>
                </div>
                <p className="text-zinc-400">{(order.returnRequest.items || []).map((i) => `${i.name} × ${i.quantity}`).join(', ')}</p>
                {order.returnRequest.message && <p className="text-zinc-300 whitespace-pre-line bg-white/[0.03] rounded-lg p-3">{order.returnRequest.message}</p>}
                {order.returnRequest.resolution && <p className="text-zinc-400">Resolution: {order.returnRequest.resolution}</p>}
                <textarea
                  rows={2}
                  value={retResolution}
                  onChange={(e) => setRetResolution(e.target.value)}
                  placeholder="Message to customer (e.g. pickup scheduled, replacement dispatched, refund initiated)…"
                  className="w-full bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-gold"
                />
                <div className="flex flex-wrap gap-2">
                  {['APPROVED', 'REJECTED', 'CLOSED'].map((st) => (
                    <button
                      key={st}
                      disabled={busy === `ret-${st}`}
                      onClick={() => act(`ret-${st}`, () => adminService.updateReturnRequest(order._id, { status: st, resolution: retResolution }), `Return request ${st.toLowerCase()} – customer notified by e-mail`)}
                      className={`rounded-lg !py-2 !px-3 ${st === 'APPROVED' ? 'btn-gold' : 'btn-outline-gold'}`}
                    >
                      {st === 'APPROVED' ? 'Approve' : st === 'REJECTED' ? 'Reject' : 'Close'}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-500">After approving: ship the replacement, or use “Refund” below for a refund (credit note is issued automatically).</p>
              </div>
            </Section>
          )}

          <Section title="Payment" icon={CreditCard}>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <p className="text-zinc-500">Gateway</p><p className="text-zinc-200">{order.paymentInfo?.gateway}</p>
              {order.paymentInfo?.merchantOrderId && (<><p className="text-zinc-500">Merchant Order ID</p><p className="text-zinc-200 font-mono break-all">{order.paymentInfo.merchantOrderId}</p></>)}
              {order.paymentInfo?.transactionId && (<><p className="text-zinc-500">PhonePe Txn ID</p><p className="text-zinc-200 font-mono break-all">{order.paymentInfo.transactionId}</p></>)}
              {order.paymentInfo?.paymentMode && (<><p className="text-zinc-500">Mode</p><p className="text-zinc-200">{order.paymentInfo.paymentMode}</p></>)}
              {order.paymentInfo?.paidAt && (<><p className="text-zinc-500">Paid at</p><p className="text-zinc-200">{dt(order.paymentInfo.paidAt)}</p></>)}
              {order.paymentInfo?.attempts > 0 && (<><p className="text-zinc-500">Attempts</p><p className="text-zinc-200">{order.paymentInfo.attempts}</p></>)}
            </div>

            {order.refunds?.length > 0 && (
              <ul className="mt-4 space-y-2">
                {order.refunds.map((r) => (
                  <li key={r.merchantRefundId} className="flex items-center justify-between gap-2 text-xs bg-noir-card border border-zinc-800 rounded-lg px-3 py-2">
                    <span className="text-zinc-300">{money(r.amount)} · {r.reason || 'Refund'} <span className="text-zinc-600 font-mono">{r.merchantRefundId}</span></span>
                    <span className="flex items-center gap-2">
                      <Pill tone={['COMPLETED', 'MANUAL'].includes(r.state) ? 'emerald' : r.state === 'FAILED' ? 'red' : 'amber'}>{r.state}</Pill>
                      {r.state === 'PENDING' && (
                        <button onClick={() => act('rs', () => adminService.syncRefund(order._id, r.merchantRefundId), 'Refund status refreshed')} className="text-gold hover:underline">check</button>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {canRefund && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!window.confirm(`Refund ${refund.amount ? money(refund.amount) : money(refundable)} ${refund.manual ? '(record manual refund)' : 'via PhonePe'}?`)) return;
                  act('refund', () => adminService.refundOrder(order._id, refund), 'Refund processed');
                }}
                className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-[120px_1fr_auto] gap-2 items-end"
              >
                <label className="text-[10px] uppercase text-zinc-500">Amount<input type="number" min="1" max={refundable} step="0.01" placeholder={String(refundable)} value={refund.amount} onChange={(e) => setRefund({ ...refund, amount: e.target.value })} className="mt-1 w-full bg-noir border border-zinc-800 rounded-lg px-2 py-2 text-xs text-zinc-100" /></label>
                <label className="text-[10px] uppercase text-zinc-500">Reason<input value={refund.reason} onChange={(e) => setRefund({ ...refund, reason: e.target.value })} placeholder="Damaged item / return / goodwill" className="mt-1 w-full bg-noir border border-zinc-800 rounded-lg px-2 py-2 text-xs text-zinc-100" /></label>
                <button type="submit" disabled={busy === 'refund'} className="px-4 py-2 rounded-lg bg-sky-500/15 border border-sky-500/40 text-sky-200 text-xs hover:bg-sky-500/25 inline-flex items-center">
                  {busy === 'refund' ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <RotateCcw className="w-3.5 h-3.5 mr-1" />}Refund
                </button>
                <label className="sm:col-span-3 flex items-center gap-2 text-[11px] text-zinc-500">
                  <input type="checkbox" className="accent-[#D4AF37]" checked={refund.manual} onChange={(e) => setRefund({ ...refund, manual: e.target.checked })} />
                  {order.paymentMethod === 'COD' ? 'COD refund paid by bank/UPI outside the website (record only)' : 'Already refunded outside PhonePe (record only, no gateway call)'}
                </label>
              </form>
            )}
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Section title="Update status" icon={RefreshCw}>
              {nextStatuses.length ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!statusForm.status) return;
                    if (statusForm.status === 'CANCELLED' && !window.confirm('Cancel this order? Stock will be restored and online payments refunded automatically.')) return;
                    act('status', () => adminService.updateOrderStatus(order._id, statusForm), `Status updated to ${statusForm.status}`);
                  }}
                  className="space-y-2"
                >
                  <select value={statusForm.status} onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })} className="w-full bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100">
                    <option value="">Select new status…</option>
                    {nextStatuses.map((s) => <option key={s} value={s}>{ORDER_STATUS_META[s]?.label || s}</option>)}
                  </select>
                  <input value={statusForm.note} onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })} placeholder="Note shown in timeline (optional)" className="w-full bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100" />
                  <button type="submit" disabled={!statusForm.status || busy === 'status'} className="btn-gold rounded-lg !py-2 w-full">{busy === 'status' ? 'Updating…' : 'Update status'}</button>
                </form>
              ) : (
                <p className="text-xs text-zinc-500">This order is closed.</p>
              )}
            </Section>

            <Section title="Courier & tracking" icon={Truck}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  act('track', () => adminService.updateOrderTracking(order._id, tracking), 'Tracking saved – customer notified');
                }}
                className="space-y-2"
              >
                <select value={tracking.courier} onChange={(e) => setTracking({ ...tracking, courier: e.target.value })} className="w-full bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100">
                  {COURIERS.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input required value={tracking.trackingId} onChange={(e) => setTracking({ ...tracking, trackingId: e.target.value })} placeholder="AWB / tracking number" className="w-full bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono" />
                <input value={tracking.trackingUrl} onChange={(e) => setTracking({ ...tracking, trackingUrl: e.target.value })} placeholder="Tracking URL (auto for major couriers)" className="w-full bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100" />
                <button type="submit" disabled={busy === 'track' || ['CANCELLED', 'REFUNDED', 'PENDING_PAYMENT'].includes(order.orderStatus)} className="btn-outline-gold rounded-lg !py-2 w-full">
                  {busy === 'track' ? 'Saving…' : 'Save & mark shipped'}
                </button>
                {order.trackingUrl && (
                  <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-gold inline-flex items-center gap-1 hover:underline">Open courier tracking <ExternalLink className="w-3 h-3" /></a>
                )}
              </form>
            </Section>
          </div>

          <Section
            title="Internal note"
            icon={StickyNote}
            action={
              <button onClick={() => act('note', () => adminService.updateOrderNote(order._id, note), 'Note saved')} className="text-xs text-gold inline-flex items-center gap-1">
                <Save className="w-3.5 h-3.5" /> Save
              </button>
            }
          >
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Only visible to admins" className="w-full bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100" />
          </Section>

          <Section title="Timeline" icon={Receipt}>
            <ol className="relative border-l border-zinc-800 ml-1.5 space-y-3">
              {[...order.statusHistory].reverse().map((h, i) => (
                <li key={i} className="ml-4 text-xs">
                  <span className={`absolute -left-[5px] w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-gold' : 'bg-zinc-700'}`} />
                  <div className="flex flex-wrap items-center gap-2">
                    <OrderStatusBadge status={h.status} />
                    <span className="text-zinc-500">{dt(h.timestamp)} · {h.updatedBy}</span>
                  </div>
                  {h.note && <p className="text-zinc-400 mt-0.5">{h.note}</p>}
                </li>
              ))}
            </ol>
          </Section>
        </div>
      </aside>
    </div>
  );
};
