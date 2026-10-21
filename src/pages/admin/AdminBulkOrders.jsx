import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Layers,
  Search,
  Upload,
  Download,
  Loader2,
  RefreshCw,
  ArrowRight,
  X,
  Truck,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  ShoppingBag,
} from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { BulkActionBar } from '../../components/admin/BulkActionBar.jsx';
import { BulkActionDialog } from '../../components/admin/BulkActionDialog.jsx';
import { BulkPrintDialog } from '../../components/admin/BulkPrintDialog.jsx';
import { OrderStatusBadge, PaymentBadge, Pill } from '../../components/ui/StatusBadge.jsx';
import { Alert } from '../../components/ui/Field.jsx';
import { COURIERS, exportOrdersCsv, downloadCsv, downloadDispatchTemplate, sheetToRows } from '../../components/admin/bulkOrderUtils.js';

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
const dt = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—');

const QUEUE_TONE = {
  READY_TO_SHIP: 'gold',
  NEEDS_INVOICE: 'amber',
  IN_TRANSIT: 'blue',
  LATE_DELIVERY: 'red',
  COD_UNCOLLECTED: 'amber',
  PAYMENT_PENDING: 'amber',
  RETURNS_OPEN: 'red',
  REFUND_PENDING: 'blue',
};
// What a queue is usually loaded for → opens that action straight away
const QUEUE_ACTION = {
  READY_TO_SHIP: 'SHIP',
  NEEDS_INVOICE: 'ISSUE_INVOICE',
  IN_TRANSIT: 'DELIVERED',
  LATE_DELIVERY: 'DELIVERED',
  COD_UNCOLLECTED: 'COD_PAYMENT',
  PAYMENT_PENDING: 'SYNC_PAYMENT',
  RETURNS_OPEN: 'RETURN',
};

const TABS = [
  ['queues', 'Work queues', Layers],
  ['paste', 'Paste order numbers', Search],
  ['sheet', 'Courier sheet upload', Upload],
];

const RESULT_TONE = { updated: 'emerald', ready: 'emerald', skipped: 'noir', failed: 'red' };
const RESULT_LABEL = { updated: 'Updated', ready: 'Ready', skipped: 'No change', failed: 'Problem' };

export const AdminBulkOrders = () => {
  const [tab, setTab] = useState('queues');
  const [queues, setQueues] = useState([]);
  const [queuesLoading, setQueuesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  // Working list (from a queue or a pasted list) + which of them are ticked
  const [list, setList] = useState([]);
  const [listLabel, setListLabel] = useState('');
  const [checked, setChecked] = useState(() => new Set());
  const [loadingList, setLoadingList] = useState(null);
  const [bulk, setBulk] = useState(null);
  const [printing, setPrinting] = useState(false);

  const selected = useMemo(() => list.filter((o) => checked.has(o._id)), [list, checked]);

  const loadQueues = useCallback(async () => {
    try {
      setQueuesLoading(true);
      const res = await adminService.getOrderQueues();
      setQueues(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setQueuesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQueues();
  }, [loadQueues]);

  const showList = (orders, label, { append = false } = {}) => {
    setList((prev) => {
      if (!append) return orders;
      const seen = new Set(prev.map((o) => o._id));
      return [...prev, ...orders.filter((o) => !seen.has(o._id))];
    });
    setChecked((prev) => {
      const next = append ? new Set(prev) : new Set();
      orders.forEach((o) => next.add(o._id));
      return next;
    });
    setListLabel(label);
  };

  const openQueue = async (q, { act = false } = {}) => {
    try {
      setLoadingList(q.key);
      setNotice(null);
      const res = await adminService.selectOrders({ queue: q.key });
      showList(res.data || [], `${q.label} · ${res.total}`);
      if (res.limited) setNotice(`Loaded the oldest ${res.max} of ${res.total} orders. Process these first, then load the queue again.`);
      if (act && QUEUE_ACTION[q.key] && res.data?.length) {
        const a = QUEUE_ACTION[q.key];
        setBulk(a === 'DELIVERED' ? { action: 'DELIVERED' } : { action: a });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingList(null);
    }
  };

  const onBulkAction = (key) => {
    if (key === 'EXPORT') return exportOrdersCsv(selected);
    if (key === 'PROCESSING') return setBulk({ action: 'STATUS', presetStatus: 'PROCESSING' });
    if (key === 'CANCEL') return setBulk({ action: 'STATUS', presetStatus: 'CANCELLED' });
    return setBulk({ action: key });
  };

  const onBulkDone = (changed) => {
    const byId = new Map(changed.map((o) => [o._id, o]));
    setList((prev) => prev.map((o) => (byId.has(o._id) ? { ...o, ...byId.get(o._id) } : o)));
  };

  const toggle = (id) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const allChecked = list.length > 0 && list.every((o) => checked.has(o._id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold flex items-center gap-3">
            <ClipboardList className="w-6 h-6 text-gold" /> Bulk Order Update
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Ship, deliver, invoice, collect COD and close returns for many orders at once – from a work queue, a pasted list of order numbers, or your courier’s CSV sheet.
          </p>
        </div>
        <Link to="/admin/orders" className="btn-outline-gold rounded-lg !py-2">
          <ShoppingBag className="w-4 h-4 mr-2" /> All orders
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
        {TABS.map(([key, label, Icon]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-full text-xs whitespace-nowrap border inline-flex items-center gap-2 ${
              tab === key ? 'bg-gold text-black border-gold font-semibold' : 'border-zinc-800 text-zinc-400 hover:text-gold'
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {error && (
        <Alert>
          {error}{' '}
          <button className="underline ml-2" onClick={() => setError(null)}>dismiss</button>
        </Alert>
      )}
      {notice && <Alert tone="info">{notice}</Alert>}

      {tab === 'queues' && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400 font-semibold">What needs attention</p>
            <button onClick={loadQueues} className="text-xs text-gold inline-flex items-center gap-1 hover:underline">
              <RefreshCw className={`w-3.5 h-3.5 ${queuesLoading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {(queuesLoading && !queues.length ? Array.from({ length: 8 }, (_, i) => ({ key: `s${i}` })) : queues).map((q) =>
              q.label ? (
                <div key={q.key} className={`rounded-xl border bg-noir-card p-4 flex flex-col gap-3 ${q.count ? 'border-zinc-800' : 'border-zinc-900 opacity-70'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm text-zinc-100 font-semibold">{q.label}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{q.hint}</p>
                    </div>
                    <Pill tone={q.count ? QUEUE_TONE[q.key] || 'gold' : 'noir'}>{q.count}</Pill>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => openQueue(q)}
                      disabled={!q.count || loadingList === q.key}
                      className="btn-outline-gold rounded-lg !py-1.5 !px-3 text-[11px] flex-1 disabled:opacity-40"
                    >
                      {loadingList === q.key ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null} Load list
                    </button>
                    {QUEUE_ACTION[q.key] && (
                      <button
                        onClick={() => openQueue(q, { act: true })}
                        disabled={!q.count || loadingList === q.key}
                        className="btn-gold rounded-lg !py-1.5 !px-3 text-[11px] flex-1 disabled:opacity-40"
                        title="Load these orders and open the matching bulk action"
                      >
                        Act now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div key={q.key} className="rounded-xl border border-zinc-900 bg-noir-card h-32 animate-pulse" />
              )
            )}
          </div>
        </section>
      )}

      {tab === 'paste' && <PasteLookup onFound={(orders, append) => showList(orders, `Pasted list · ${orders.length}`, { append })} hasList={list.length > 0} />}

      {tab === 'sheet' && <CourierSheet onDone={loadQueues} />}

      {tab !== 'sheet' && (
        <section className="space-y-3">
          <BulkActionBar
            selected={selected}
            onSelectPage={!allChecked && list.length ? () => setChecked(new Set(list.map((o) => o._id))) : null}
            onClear={() => setChecked(new Set())}
            onAction={onBulkAction}
            onPrint={() => setPrinting(true)}
          />

          <div className="bg-noir-card border border-zinc-800 rounded-xl overflow-x-auto">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-zinc-800">
              <p className="text-xs text-zinc-300">
                {list.length ? (
                  <>
                    <span className="text-gold font-semibold">{listLabel}</span> · {list.length} loaded · {checked.size} ticked
                  </>
                ) : (
                  'No orders loaded yet – pick a work queue or paste order numbers above.'
                )}
              </p>
              {list.length > 0 && (
                <button
                  onClick={() => {
                    setList([]);
                    setChecked(new Set());
                    setListLabel('');
                  }}
                  className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Clear list
                </button>
              )}
            </div>
            {list.length > 0 && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="py-3 pl-4 pr-1 w-8">
                      <input
                        type="checkbox"
                        className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                        checked={allChecked}
                        onChange={() => setChecked(allChecked ? new Set() : new Set(list.map((o) => o._id)))}
                        aria-label="Tick all loaded orders"
                      />
                    </th>
                    <th className="py-3 px-3">Order</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3 text-right">Total</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Invoice / AWB</th>
                    <th className="py-3 px-3 w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {list.map((o) => (
                    <tr key={o._id} className={checked.has(o._id) ? 'bg-gold/[0.05]' : ''}>
                      <td className="py-2.5 pl-4 pr-1">
                        <input type="checkbox" className="accent-[#D4AF37] w-4 h-4 cursor-pointer" checked={checked.has(o._id)} onChange={() => toggle(o._id)} aria-label={`Tick ${o.orderNumber}`} />
                      </td>
                      <td className="py-2.5 px-3">
                        <Link to={`/admin/orders?search=${encodeURIComponent(o.orderNumber)}`} className="font-mono font-bold text-gold hover:underline">
                          {o.orderNumber}
                        </Link>
                        <span className="block text-[10px] text-zinc-500">{dt(o.createdAt)}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <p className="text-zinc-200">{o.shippingAddress?.fullName}</p>
                        <p className="text-[10px] text-zinc-500">
                          {o.shippingAddress?.city}, {o.shippingAddress?.state} {o.shippingAddress?.postalCode}
                        </p>
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-zinc-100">{money(o.total)}</td>
                      <td className="py-2.5 px-3"><PaymentBadge method={o.paymentMethod} status={o.paymentStatus} /></td>
                      <td className="py-2.5 px-3">
                        <OrderStatusBadge status={o.orderStatus} />
                        {o.returnRequest?.status && <span className="block mt-1 text-[10px] text-amber-300">Return {o.returnRequest.status.toLowerCase()}</span>}
                      </td>
                      <td className="py-2.5 px-3 text-[11px]">
                        <p className="font-mono text-zinc-300">{o.invoice?.number || <span className="text-zinc-600">—</span>}</p>
                        {o.trackingId && <p className="text-zinc-500">{o.courier}: {o.trackingId}</p>}
                      </td>
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => {
                            setList((prev) => prev.filter((x) => x._id !== o._id));
                            setChecked((prev) => {
                              const next = new Set(prev);
                              next.delete(o._id);
                              return next;
                            });
                          }}
                          className="p-1 text-zinc-500 hover:text-red-300"
                          aria-label={`Remove ${o.orderNumber} from list`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {printing && <BulkPrintDialog orders={selected} onClose={() => setPrinting(false)} />}
      {bulk && selected.length > 0 && (
        <BulkActionDialog
          orders={selected}
          action={bulk.action}
          presetStatus={bulk.presetStatus}
          onDone={onBulkDone}
          onClose={() => {
            setBulk(null);
            loadQueues();
          }}
        />
      )}
    </div>
  );
};

/* ───────────────────────── Paste order numbers ───────────────────────── */
const PasteLookup = ({ onFound, hasList }) => {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [missing, setMissing] = useState([]);
  const [error, setError] = useState(null);
  const count = text.split(/[\s,;]+/).filter(Boolean).length;

  const find = async (append) => {
    try {
      setBusy(true);
      setError(null);
      const res = await adminService.lookupOrders(text);
      setMissing(res.missing || []);
      onFound(res.data || [], append);
      if (!res.missing?.length) setText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-noir-card border border-zinc-800 rounded-xl p-5 space-y-3">
      <div>
        <p className="text-sm text-zinc-100 font-semibold">Paste order numbers, invoice numbers or AWBs</p>
        <p className="text-[11px] text-zinc-500 mt-0.5">One per line or separated by commas – copy a column straight from Excel, WhatsApp or the courier portal. Up to 500 at a time.</p>
      </div>
      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={'JR-2526-000123\nJR-2526-000124\nJR/25-26/00045\n1234567890123'}
        className="w-full bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-gold"
      />
      {error && <Alert>{error}</Alert>}
      {missing.length > 0 && (
        <Alert tone="warn">
          Not found ({missing.length}): <span className="font-mono">{missing.join(', ')}</span>
        </Alert>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-zinc-500 mr-auto">{count ? `${count} value${count > 1 ? 's' : ''}` : ''}</span>
        {hasList && (
          <button onClick={() => find(true)} disabled={!count || busy} className="btn-outline-gold rounded-lg !py-2 text-xs">
            Add to current list
          </button>
        )}
        <button onClick={() => find(false)} disabled={!count || busy} className="btn-gold rounded-lg !py-2 text-xs">
          {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />} Find orders
        </button>
      </div>
    </section>
  );
};

/* ───────────────────────── Courier sheet upload ───────────────────────── */
const CourierSheet = ({ onDone }) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [defaultCourier, setDefaultCourier] = useState('Delhivery');
  const [notify, setNotify] = useState(true);
  const [busy, setBusy] = useState(null);
  const [checkedSheet, setCheckedSheet] = useState(null); // text that passed the dry-run
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const fileRef = useRef(null);

  const parsed = useMemo(() => (text.trim() ? sheetToRows(text) : { rows: [], columns: {}, error: null }), [text]);

  const readFile = (file) => {
    if (!file) return;
    if (/\.xlsx?$/i.test(file.name)) {
      setError('Excel files: choose File › Save As › “CSV (Comma delimited)” in Excel, then upload the .csv.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('File is larger than 2 MB – split it into smaller sheets.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setText(String(reader.result || ''));
      setFileName(file.name);
      setResult(null);
      setCheckedSheet(null);
      setError(null);
    };
    reader.readAsText(file);
  };

  const templateWithOrders = async () => {
    try {
      setBusy('tpl');
      const res = await adminService.selectOrders({ queue: 'READY_TO_SHIP' });
      downloadDispatchTemplate(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const send = async (dryRun) => {
    try {
      setBusy(dryRun ? 'check' : 'apply');
      setError(null);
      const res = await adminService.bulkDispatch({ rows: parsed.rows, defaultCourier, notify, dryRun });
      setResult(res.data);
      setFilter('all');
      if (dryRun) setCheckedSheet(text);
      else {
        setCheckedSheet(null);
        onDone?.();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const colNames = { ref: 'Order no.', courier: 'Courier', trackingId: 'AWB', trackingUrl: 'Tracking URL', status: 'Status', codCollected: 'COD collected' };
  const shown = result ? (filter === 'all' ? result.results : result.results.filter((r) => r.result === filter)) : [];
  const ready = checkedSheet === text && result?.dryRun;

  return (
    <section className="space-y-4">
      <div className="grid lg:grid-cols-[1fr_300px] gap-4">
        <div className="bg-noir-card border border-zinc-800 rounded-xl p-5 space-y-4">
          <div>
            <p className="text-sm text-zinc-100 font-semibold flex items-center gap-2"><Truck className="w-4 h-4 text-gold" /> Upload the courier / dispatch sheet</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Columns: <span className="font-mono text-zinc-300">order_number, courier, awb</span> and optional <span className="font-mono text-zinc-300">tracking_url, status, cod_collected</span>. Each row ships the order with its AWB; put <span className="font-mono">DELIVERED</span> in status and <span className="font-mono">yes</span> in cod_collected when the courier’s delivery / remittance report confirms it.
            </p>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              readFile(e.dataTransfer.files?.[0]);
            }}
            className="rounded-xl border-2 border-dashed border-zinc-700 hover:border-gold/60 p-5 text-center"
          >
            <Upload className="w-6 h-6 text-gold mx-auto" />
            <p className="text-xs text-zinc-300 mt-2">{fileName ? `Loaded: ${fileName}` : 'Drop a .csv file here'}</p>
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline-gold rounded-lg !py-1.5 !px-3 text-[11px] mt-3">Choose file</button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.tsv,.txt,text/csv,text/plain"
              className="hidden"
              onChange={(e) => {
                readFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </div>

          <details className="text-xs text-zinc-400">
            <summary className="cursor-pointer text-gold">…or paste the rows</summary>
            <textarea
              rows={6}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setFileName('');
                setResult(null);
              }}
              placeholder={'order_number,courier,awb\nJR-2526-000123,Delhivery,1234567890123'}
              className="mt-2 w-full bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-gold"
            />
          </details>

          {parsed.error && <Alert tone="warn">{parsed.error}</Alert>}
          {parsed.rows.length > 0 && (
            <p className="text-[11px] text-zinc-400">
              <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-400 mr-1" />
              {parsed.rows.length} row{parsed.rows.length > 1 ? 's' : ''} · columns found:{' '}
              {Object.keys(parsed.columns).map((k) => (
                <Pill key={k} tone="noir" className="mr-1">{colNames[k]}</Pill>
              ))}
              {parsed.rows.length > 500 && <span className="text-red-300"> – only 500 rows per upload</span>}
            </p>
          )}
        </div>

        <aside className="bg-noir-card border border-zinc-800 rounded-xl p-5 space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-semibold mb-2">Template</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => downloadDispatchTemplate()} className="btn-outline-gold rounded-lg !py-2 text-xs">
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Blank template
              </button>
              <button onClick={templateWithOrders} disabled={busy === 'tpl'} className="btn-outline-gold rounded-lg !py-2 text-xs">
                {busy === 'tpl' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />} With ready-to-ship orders
              </button>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-semibold mb-2">Courier when a row has none</p>
            <select value={defaultCourier} onChange={(e) => setDefaultCourier(e.target.value)} className="w-full bg-noir border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100">
              {COURIERS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input type="checkbox" className="accent-[#D4AF37]" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
            E-mail customers (shipped / delivered)
          </label>
          <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
            <button onClick={() => send(true)} disabled={!parsed.rows.length || parsed.rows.length > 500 || Boolean(busy)} className="btn-outline-gold rounded-lg !py-2.5 text-xs">
              {busy === 'check' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />} 1 · Check sheet
            </button>
            <button onClick={() => send(false)} disabled={!ready || Boolean(busy) || !result?.updated} className="btn-gold rounded-lg !py-2.5 text-xs">
              {busy === 'apply' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Truck className="w-4 h-4 mr-2" />} 2 · Apply to {ready ? result.updated : ''} orders
            </button>
            <p className="text-[10px] text-zinc-500">Checking changes nothing. Apply unlocks after a check of the current sheet.</p>
          </div>
        </aside>
      </div>

      {error && <Alert>{error}</Alert>}

      {result && (
        <div className="bg-noir-card border border-zinc-800 rounded-xl">
          <div className="px-4 py-3 border-b border-zinc-800 flex flex-wrap items-center gap-2">
            <p className="text-xs text-zinc-200 mr-auto flex items-center gap-2">
              {result.failed ? <AlertTriangle className="w-4 h-4 text-amber-300" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {result.dryRun ? 'Check result – nothing changed yet' : `Applied${result.emails ? ` · ${result.emails} e-mail(s) queued` : ''}`}
            </p>
            {[
              ['all', `All ${result.total}`],
              [result.dryRun ? 'ready' : 'updated', `${result.dryRun ? 'Ready' : 'Updated'} ${result.updated}`],
              ['skipped', `No change ${result.skipped}`],
              ['failed', `Problems ${result.failed}`],
            ].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1 rounded-full text-[11px] border ${filter === k ? 'bg-gold text-black border-gold' : 'border-zinc-700 text-zinc-300'}`}>
                {l}
              </button>
            ))}
            <button
              onClick={() =>
                downloadCsv(
                  `Jayrup-courier-sheet-result-${new Date().toISOString().slice(0, 10)}.csv`,
                  ['Row', 'Reference', 'Order no.', 'Result', 'Details'],
                  result.results.map((r) => [r.line, r.ref, r.orderNumber, RESULT_LABEL[r.result] || r.result, r.message])
                )
              }
              className="text-[11px] text-gold inline-flex items-center gap-1 hover:underline ml-2"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
          </div>
          <ul className="max-h-[28rem] overflow-y-auto divide-y divide-zinc-800/60">
            {shown.map((r) => (
              <li key={r.line} className="px-4 py-2 flex items-center gap-3 text-xs">
                <span className="text-zinc-500 w-10 shrink-0">#{r.line}</span>
                <span className="font-mono text-gold w-36 shrink-0 truncate">{r.orderNumber !== '—' ? r.orderNumber : r.ref || '—'}</span>
                <Pill tone={RESULT_TONE[r.result]}>{RESULT_LABEL[r.result] || r.result}</Pill>
                <span className="text-zinc-300 flex-1 min-w-0">{r.message}</span>
              </li>
            ))}
            {!shown.length && <li className="px-4 py-6 text-center text-xs text-zinc-500">Nothing in this filter.</li>}
          </ul>
        </div>
      )}
    </section>
  );
};
