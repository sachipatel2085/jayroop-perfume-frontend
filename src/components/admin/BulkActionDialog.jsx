import React, { useMemo, useState } from 'react';
import {
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Truck,
  PackageCheck,
  RefreshCw,
  Wallet,
  Receipt,
  RotateCcw,
  StickyNote,
  Mail,
  Download,
  Layers,
} from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { OrderStatusBadge, Pill } from '../ui/StatusBadge.jsx';
import { ORDER_STATUS_META } from '../../config/site.js';
import { BULK_STATUSES, COURIERS, CHUNK, eligibility, downloadCsv } from './bulkOrderUtils.js';

export const BULK_ACTIONS = {
  STATUS: { title: 'Change order status', icon: RefreshCw, button: 'Update status' },
  SHIP: { title: 'Mark as shipped', icon: Truck, button: 'Mark shipped' },
  DELIVERED: { title: 'Mark as delivered', icon: PackageCheck, button: 'Mark delivered' },
  COD_PAYMENT: { title: 'COD payment', icon: Wallet, button: 'Save payment status' },
  ISSUE_INVOICE: { title: 'Issue GST invoices', icon: Receipt, button: 'Issue invoices' },
  SYNC_PAYMENT: { title: 'Check PhonePe payments', icon: RefreshCw, button: 'Check with PhonePe' },
  RETURN: { title: 'Return requests', icon: RotateCcw, button: 'Update requests' },
  NOTE: { title: 'Add internal note', icon: StickyNote, button: 'Add note' },
  RESEND_EMAIL: { title: 'Re-send customer e-mail', icon: Mail, button: 'Send e-mails' },
};

const RESULT_TONE = { updated: 'emerald', skipped: 'noir', failed: 'red' };
const RESULT_LABEL = { updated: 'Done', skipped: 'No change', failed: 'Failed' };

const Field = ({ label, hint, children }) => (
  <div>
    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-semibold mb-2">{label}</p>
    {children}
    {hint && <p className="text-[10px] text-zinc-500 mt-1.5">{hint}</p>}
  </div>
);

const Chip = ({ active, onClick, children, tone }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
      active
        ? tone === 'danger'
          ? 'bg-red-500/20 text-red-200 border-red-500/60 font-semibold'
          : 'bg-gold text-black border-gold font-semibold'
        : 'border-zinc-700 text-zinc-300 hover:border-gold/60'
    }`}
  >
    {children}
  </button>
);

const inputCls = 'w-full bg-noir border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-gold';

/**
 * One dialog for every bulk order action: options → live preview → progress → per-order results.
 * Orders are sent in chunks; one failed order never stops the others.
 */
export const BulkActionDialog = ({ orders, action: initialAction, presetStatus, onClose, onDone }) => {
  const [action] = useState(initialAction === 'DELIVERED' ? 'STATUS' : initialAction);
  const [opts, setOpts] = useState(() => ({
    status: presetStatus || (initialAction === 'DELIVERED' ? 'DELIVERED' : ''),
    note: '',
    notify: true,
    courier: 'Delhivery',
    requireAwb: false,
    awbs: {},
    paymentStatus: 'PAID',
    returnStatus: 'APPROVED',
    resolution: '',
    mode: 'append',
    emailType: 'SHIPPED',
    confirm: '',
  }));
  const set = (patch) => setOpts((p) => ({ ...p, ...patch }));
  const [bulkAwb, setBulkAwb] = useState('');
  const [phase, setPhase] = useState('form'); // form | running | done
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const PRESET_TITLES = { PROCESSING: 'Move to processing', CANCELLED: 'Cancel orders', DELIVERED: 'Mark as delivered', SHIPPED: 'Mark as shipped' };
  const meta = {
    ...(BULK_ACTIONS[initialAction] || BULK_ACTIONS[action]),
    ...(presetStatus ? { title: PRESET_TITLES[presetStatus] || BULK_ACTIONS.STATUS.title } : {}),
  };
  const Icon = meta.icon;

  const preview = useMemo(() => {
    const rows = orders.map((o) => {
      const [kind, why] = eligibility(o, action, { ...opts, awb: (opts.awbs[o._id] || '').trim() });
      return { o, kind, why };
    });
    return {
      rows,
      ok: rows.filter((r) => r.kind === 'ok').length,
      same: rows.filter((r) => r.kind === 'same').length,
      block: rows.filter((r) => r.kind === 'block').length,
    };
  }, [orders, action, opts]);

  const isCancel = action === 'STATUS' && opts.status === 'CANCELLED';
  const needsChoice = (action === 'STATUS' && !opts.status) || (action === 'NOTE' && !opts.note.trim());
  const cancelBlocked = isCancel && opts.confirm.trim().toUpperCase() !== 'CANCEL';
  const noneEligible = preview.ok === 0 && action !== 'NOTE';

  const pasteAwbs = () => {
    const list = bulkAwb.split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean);
    const next = { ...opts.awbs };
    orders.forEach((o, i) => {
      if (list[i]) next[o._id] = list[i];
    });
    set({ awbs: next });
    setBulkAwb('');
  };

  const run = async (subset = orders) => {
    setPhase('running');
    setError(null);
    const ids = subset.map((o) => o._id);
    const chunk = action === 'SYNC_PAYMENT' ? 25 : CHUNK;
    setProgress({ done: 0, total: ids.length });
    const collected = [];
    const changed = [];
    // On "retry failed" keep the earlier results of the orders that are not re-run
    const base = subset === orders ? [] : results.filter((r) => !ids.includes(r.id));
    const merged = () => [...base, ...collected];
    const payload = {
      action,
      status: opts.status,
      note: opts.note,
      notify: opts.notify,
      courier: opts.courier,
      requireAwb: opts.requireAwb,
      tracking: opts.awbs,
      paymentStatus: opts.paymentStatus,
      returnStatus: opts.returnStatus,
      resolution: opts.resolution,
      mode: opts.mode,
      emailType: opts.emailType,
      confirm: isCancel ? 'CANCEL' : undefined,
    };
    try {
      for (let i = 0; i < ids.length; i += chunk) {
        const res = await adminService.bulkOrders({ ...payload, orderIds: ids.slice(i, i + chunk) });
        collected.push(...(res.data?.results || []));
        changed.push(...(res.data?.orders || []));
        setProgress({ done: Math.min(ids.length, i + chunk), total: ids.length });
        setResults(merged());
      }
    } catch (err) {
      setError(err.message);
    }
    setResults(merged());
    setPhase('done');
    if (changed.length) onDone?.(changed);
  };

  const counts = {
    updated: results.filter((r) => r.result === 'updated').length,
    skipped: results.filter((r) => r.result === 'skipped').length,
    failed: results.filter((r) => r.result === 'failed').length,
  };
  const failedOrders = orders.filter((o) => results.some((r) => r.id === o._id && r.result === 'failed'));
  const shownResults = filter === 'all' ? results : results.filter((r) => r.result === filter);

  const exportResults = () =>
    downloadCsv(
      `Jayrup-bulk-${action.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Order no.', 'Result', 'Details', 'Status before', 'Status after'],
      results.map((r) => [r.orderNumber, RESULT_LABEL[r.result] || r.result, r.message, r.from || '', r.to || ''])
    );

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3" role="dialog" aria-modal="true" aria-labelledby="bulk-action-title">
      <div className="w-full max-w-3xl max-h-[94vh] flex flex-col bg-noir-card border border-gold/30 rounded-2xl shadow-2xl">
        <header className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between gap-3">
          <div>
            <h2 id="bulk-action-title" className="font-serif text-lg text-zinc-100 flex items-center gap-2">
              <Icon className="w-5 h-5 text-gold" /> {meta.title}
            </h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {orders.length} order{orders.length === 1 ? '' : 's'} selected · each order is checked on its own, nothing is changed for orders that don’t qualify
            </p>
          </div>
          <button onClick={onClose} disabled={phase === 'running'} className="p-2 rounded-lg text-zinc-400 hover:text-gold disabled:opacity-30" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {phase === 'form' && (
            <>
              {action === 'STATUS' && (
                <Field label="New status">
                  <div className="flex flex-wrap gap-2">
                    {BULK_STATUSES.map((s) => (
                      <Chip key={s} active={opts.status === s} tone={s === 'CANCELLED' ? 'danger' : undefined} onClick={() => set({ status: s, confirm: '' })}>
                        {ORDER_STATUS_META[s]?.label || s}
                      </Chip>
                    ))}
                  </div>
                </Field>
              )}

              {action === 'SHIP' && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Courier partner">
                      <select value={opts.courier} onChange={(e) => set({ courier: e.target.value })} className={inputCls}>
                        {COURIERS.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Paste AWB numbers" hint="One per line, in the same order as the list below – fills the AWB boxes.">
                      <div className="flex gap-2">
                        <textarea rows={2} value={bulkAwb} onChange={(e) => setBulkAwb(e.target.value)} placeholder={'AWB1\nAWB2…'} className={`${inputCls} font-mono resize-y`} />
                        <button type="button" onClick={pasteAwbs} disabled={!bulkAwb.trim()} className="btn-outline-gold rounded-lg !py-2 !px-3 text-xs">Fill</button>
                      </div>
                    </Field>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-zinc-300">
                    <input type="checkbox" className="accent-[#D4AF37]" checked={opts.requireAwb} onChange={(e) => set({ requireAwb: e.target.checked })} />
                    Only ship orders that have an AWB number (otherwise orders without AWB are just marked shipped)
                  </label>
                </>
              )}

              {action === 'COD_PAYMENT' && (
                <Field label="Cash-on-Delivery payment" hint="Use “Collected” after the courier remits the COD amount. PhonePe orders are skipped – the gateway confirms those.">
                  <div className="flex flex-wrap gap-2">
                    <Chip active={opts.paymentStatus === 'PAID'} onClick={() => set({ paymentStatus: 'PAID' })}>Collected / received</Chip>
                    <Chip active={opts.paymentStatus === 'PENDING'} onClick={() => set({ paymentStatus: 'PENDING' })}>Still pending</Chip>
                    <Chip active={opts.paymentStatus === 'FAILED'} tone="danger" onClick={() => set({ paymentStatus: 'FAILED' })}>Not paid / refused</Chip>
                  </div>
                </Field>
              )}

              {action === 'ISSUE_INVOICE' && (
                <p className="text-xs text-zinc-400 leading-relaxed">
                  A GST tax invoice with the next serial number is issued for every confirmed order that doesn’t have one. Unpaid and cancelled orders are skipped. Numbers are issued in the order shown below.
                </p>
              )}

              {action === 'SYNC_PAYMENT' && (
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Asks PhonePe for the real status of each unpaid online order. Paid orders are confirmed, stock is reserved and the invoice is issued automatically. Up to 25 orders are checked per batch.
                </p>
              )}

              {action === 'RETURN' && (
                <>
                  <Field label="Decision">
                    <div className="flex flex-wrap gap-2">
                      <Chip active={opts.returnStatus === 'APPROVED'} onClick={() => set({ returnStatus: 'APPROVED' })}>Approve</Chip>
                      <Chip active={opts.returnStatus === 'REJECTED'} tone="danger" onClick={() => set({ returnStatus: 'REJECTED' })}>Reject</Chip>
                      <Chip active={opts.returnStatus === 'CLOSED'} onClick={() => set({ returnStatus: 'CLOSED' })}>Close</Chip>
                    </div>
                  </Field>
                  <Field label="Message to customers">
                    <textarea rows={2} value={opts.resolution} onChange={(e) => set({ resolution: e.target.value })} placeholder="e.g. Pickup will be scheduled within 48 hours." className={inputCls} />
                  </Field>
                </>
              )}

              {action === 'NOTE' && (
                <>
                  <Field label="Internal note (admins only)">
                    <textarea rows={3} value={opts.note} onChange={(e) => set({ note: e.target.value })} placeholder="e.g. Packed by Ravi – batch 21 Oct" className={inputCls} />
                  </Field>
                  <div className="flex flex-wrap gap-2">
                    <Chip active={opts.mode === 'append'} onClick={() => set({ mode: 'append' })}>Add below existing notes</Chip>
                    <Chip active={opts.mode === 'replace'} tone="danger" onClick={() => set({ mode: 'replace' })}>Replace existing notes</Chip>
                  </div>
                </>
              )}

              {action === 'RESEND_EMAIL' && (
                <Field label="Which e-mail" hint="E-mails are sent one after another in the background.">
                  <div className="flex flex-wrap gap-2">
                    <Chip active={opts.emailType === 'CONFIRMATION'} onClick={() => set({ emailType: 'CONFIRMATION' })}>Order confirmation</Chip>
                    <Chip active={opts.emailType === 'SHIPPED'} onClick={() => set({ emailType: 'SHIPPED' })}>Shipped + tracking</Chip>
                    <Chip active={opts.emailType === 'DELIVERED'} onClick={() => set({ emailType: 'DELIVERED' })}>Delivered + review request</Chip>
                  </div>
                </Field>
              )}

              {['STATUS', 'SHIP'].includes(action) && (
                <Field label="Timeline note (optional)" hint="Shown to the customer in the order timeline.">
                  <input value={opts.note} onChange={(e) => set({ note: e.target.value })} placeholder={isCancel ? 'Reason for cancelling' : 'e.g. Handed to courier at 4 pm'} className={inputCls} />
                </Field>
              )}

              {['STATUS', 'SHIP', 'RETURN'].includes(action) && (
                <label className="flex items-center gap-2 text-xs text-zinc-300">
                  <input type="checkbox" className="accent-[#D4AF37]" checked={opts.notify} onChange={(e) => set({ notify: e.target.checked })} />
                  E-mail customers about this update
                </label>
              )}

              {isCancel && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 space-y-2">
                  <p className="text-xs text-red-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    Cancelling restores stock, raises credit notes for invoiced orders and automatically refunds paid PhonePe orders. This cannot be undone.
                  </p>
                  <input value={opts.confirm} onChange={(e) => set({ confirm: e.target.value })} placeholder="Type CANCEL to confirm" className={`${inputCls} border-red-500/40 font-mono uppercase`} />
                </div>
              )}

              {/* Preview */}
              <div className="rounded-xl border border-zinc-800">
                <div className="px-4 py-3 border-b border-zinc-800 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-zinc-400 uppercase tracking-[0.18em] text-[10px] font-semibold mr-auto">Preview</span>
                  {action !== 'NOTE' && (
                    <>
                      <Pill tone="emerald">{preview.ok} will change</Pill>
                      {preview.same > 0 && <Pill tone="noir">{preview.same} no change</Pill>}
                      {preview.block > 0 && <Pill tone="red">{preview.block} not eligible</Pill>}
                    </>
                  )}
                </div>
                <ul className="max-h-72 overflow-y-auto divide-y divide-zinc-800/60">
                  {preview.rows.map(({ o, kind, why }) => (
                    <li key={o._id} className={`px-4 py-2 flex items-center gap-3 text-xs ${kind === 'block' ? 'opacity-60' : ''}`}>
                      <span className="font-mono text-gold w-32 shrink-0 truncate">{o.orderNumber}</span>
                      <span className="text-zinc-300 truncate flex-1 min-w-0">
                        {o.shippingAddress?.fullName}
                        <span className="text-zinc-500"> · {o.shippingAddress?.city} · {o.paymentMethod === 'COD' ? 'COD' : 'PhonePe'}</span>
                      </span>
                      <OrderStatusBadge status={o.orderStatus} />
                      {action === 'SHIP' ? (
                        <input
                          value={opts.awbs[o._id] ?? ''}
                          onChange={(e) => set({ awbs: { ...opts.awbs, [o._id]: e.target.value } })}
                          placeholder={o.trackingId || 'AWB'}
                          aria-label={`AWB for ${o.orderNumber}`}
                          className="w-36 bg-noir border border-zinc-700 rounded px-2 py-1 text-[11px] font-mono text-zinc-100 focus:outline-none focus:border-gold"
                        />
                      ) : (
                        action !== 'NOTE' && (
                          <span className={`w-36 text-right text-[11px] ${kind === 'ok' ? 'text-emerald-300' : kind === 'block' ? 'text-red-300' : 'text-zinc-500'}`}>
                            {kind === 'ok' ? '✓ ready' : why}
                          </span>
                        )
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {phase !== 'form' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-300 mb-2">
                  <span className="flex items-center gap-2">
                    {phase === 'running' ? <Loader2 className="w-4 h-4 animate-spin text-gold" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {phase === 'running' ? `Updating ${progress.done} / ${progress.total}…` : 'Finished'}
                  </span>
                  <span className="text-zinc-500">{progress.total ? Math.round((progress.done / progress.total) * 100) : 0}%</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-gold transition-all" style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }} />
                </div>
              </div>

              {error && (
                <p className="flex items-start gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                </p>
              )}

              <div className="grid grid-cols-3 gap-3">
                {[
                  ['updated', 'Updated', 'text-emerald-300'],
                  ['skipped', 'No change', 'text-zinc-300'],
                  ['failed', 'Failed', 'text-red-300'],
                ].map(([k, l, c]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setFilter(filter === k ? 'all' : k)}
                    className={`rounded-xl border px-4 py-3 text-left ${filter === k ? 'border-gold' : 'border-zinc-800'}`}
                  >
                    <span className={`block text-2xl font-bold ${c}`}>{counts[k]}</span>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500">{l}</span>
                  </button>
                ))}
              </div>

              <ul className="rounded-xl border border-zinc-800 max-h-80 overflow-y-auto divide-y divide-zinc-800/60">
                {shownResults.length === 0 && <li className="px-4 py-6 text-center text-xs text-zinc-500">{phase === 'running' ? 'Working…' : 'Nothing here.'}</li>}
                {shownResults.map((r) => (
                  <li key={`${r.id}-${r.orderNumber}`} className="px-4 py-2 flex items-center gap-3 text-xs">
                    <span className="font-mono text-gold w-32 shrink-0 truncate">{r.orderNumber}</span>
                    <Pill tone={RESULT_TONE[r.result]}>{RESULT_LABEL[r.result] || r.result}</Pill>
                    <span className="text-zinc-300 flex-1 min-w-0">{r.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <footer className="px-5 py-4 border-t border-zinc-800 flex flex-wrap items-center justify-end gap-2">
          {phase === 'form' && (
            <>
              <span className="mr-auto text-[11px] text-zinc-500">{noneEligible && !needsChoice ? 'None of the selected orders qualify for this action.' : ''}</span>
              <button type="button" onClick={onClose} className="btn-outline-gold rounded-lg !py-2.5">Cancel</button>
              <button
                type="button"
                onClick={() => run()}
                disabled={needsChoice || cancelBlocked || noneEligible}
                className={`rounded-lg !py-2.5 ${isCancel ? 'px-5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold disabled:opacity-40 inline-flex items-center' : 'btn-gold'}`}
              >
                <Layers className="w-4 h-4 mr-2" />
                {isCancel ? 'Cancel orders' : meta.button}
                {action === 'NOTE' ? ` (${orders.length})` : preview.ok ? ` (${preview.ok})` : ''}
              </button>
            </>
          )}
          {phase === 'done' && (
            <>
              <button type="button" onClick={exportResults} disabled={!results.length} className="btn-outline-gold rounded-lg !py-2.5 mr-auto">
                <Download className="w-4 h-4 mr-2" /> Results CSV
              </button>
              {failedOrders.length > 0 && (
                <button type="button" onClick={() => run(failedOrders)} className="btn-outline-gold rounded-lg !py-2.5">
                  <RefreshCw className="w-4 h-4 mr-2" /> Retry {failedOrders.length} failed
                </button>
              )}
              <button type="button" onClick={onClose} className="btn-gold rounded-lg !py-2.5">Done</button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};
