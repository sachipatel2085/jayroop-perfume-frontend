import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  FileText,
  Download,
  Calendar,
  IndianRupee,
  ShoppingBag,
  Receipt,
  Users,
  RotateCcw,
  Percent,
  Package,
  Landmark,
  MapPinned,
  Wallet,
  Boxes,
  Eye,
  X,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { RevenueChart, BarList, Donut } from '../../components/admin/charts.jsx';
import { Alert } from '../../components/ui/Field.jsx';

const ist = (d) => new Date(d.getTime() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
const today = () => new Date();
const daysAgo = (n) => new Date(Date.now() - n * 86400000);

const PRESETS = [
  { key: 'today', label: 'Today', range: () => [today(), today()] },
  { key: '7d', label: '7 days', range: () => [daysAgo(6), today()] },
  { key: '30d', label: '30 days', range: () => [daysAgo(29), today()] },
  {
    key: 'month',
    label: 'This month',
    range: () => {
      const n = new Date();
      return [new Date(n.getFullYear(), n.getMonth(), 1, 12), n];
    },
  },
  {
    key: 'lastmonth',
    label: 'Last month',
    range: () => {
      const n = new Date();
      return [new Date(n.getFullYear(), n.getMonth() - 1, 1, 12), new Date(n.getFullYear(), n.getMonth(), 0, 12)];
    },
  },
  {
    key: 'fy',
    label: 'This FY',
    range: () => {
      const n = new Date();
      const y = n.getMonth() >= 3 ? n.getFullYear() : n.getFullYear() - 1;
      return [new Date(y, 3, 1, 12), n];
    },
  },
];

const REPORTS = [
  { key: 'sales', title: 'Sales Register', desc: 'Every valid order with taxable value, CGST/SGST/IGST and net sales + line items.', icon: Receipt },
  { key: 'gst', title: 'GST Report (GSTR-1)', desc: 'B2B, B2CL, B2CS, HSN (B2B/B2C), credit notes & documents issued – ready for your CA.', icon: Landmark },
  { key: 'hsn', title: 'HSN Summary', desc: 'HSN/SAC-wise quantity, taxable value and tax for GSTR-1 Table 12.', icon: Percent },
  { key: 'products', title: 'Product-wise Sales', desc: 'Units, revenue, discounts, tax and current stock per product & variant.', icon: Package },
  { key: 'orders', title: 'Order Book', desc: 'All orders in the period with status, payment, courier & AWB.', icon: ShoppingBag },
  { key: 'payments', title: 'PhonePe Payments & Refunds', desc: 'Transaction IDs, payment modes, success rate and refunds.', icon: Wallet },
  { key: 'customers', title: 'Customer Report', desc: 'Orders, lifetime value and AOV per customer.', icon: Users },
  { key: 'statewise', title: 'State-wise Sales', desc: 'Revenue and GST split by delivery state.', icon: MapPinned },
  { key: 'inventory', title: 'Inventory Valuation', desc: 'Stock on hand, value and low-stock alerts (current snapshot).', icon: Boxes },
];

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export const AdminReports = () => {
  const [preset, setPreset] = useState('30d');
  const [from, setFrom] = useState(ist(daysAgo(29)));
  const [to, setTo] = useState(ist(today()));
  const [groupBy, setGroupBy] = useState('day');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(null); // `${type}-${format}`
  const [preview, setPreview] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setData(await adminService.getReportOverview({ from, to, groupBy }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [from, to, groupBy]);

  useEffect(() => {
    load();
  }, [load]);

  const applyPreset = (p) => {
    const [f, t] = p.range();
    setPreset(p.key);
    setFrom(ist(f));
    setTo(ist(t));
    setGroupBy(p.key === 'fy' ? 'month' : 'day');
  };

  const exportReport = async (type, format) => {
    try {
      setBusy(`${type}-${format}`);
      await adminService.exportReport(type, format, { from, to });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const openPreview = async (type) => {
    try {
      setBusy(`${type}-preview`);
      setPreview(await adminService.previewReport(type, { from, to }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const k = data?.kpis || {};
  const cards = useMemo(
    () => [
      { label: 'Gross Sales', value: money(k.grossSales), icon: IndianRupee, accent: true },
      { label: 'Net Sales (after refunds)', value: money(k.netSales), icon: TrendingUp },
      { label: 'Orders', value: k.orders ?? 0, icon: ShoppingBag },
      { label: 'Avg. Order Value', value: money(k.averageOrderValue), icon: BarChart3 },
      { label: 'Taxable Value', value: money(k.taxableValue), icon: Receipt },
      { label: 'GST Collected', value: money(k.taxCollected), icon: Landmark },
      { label: 'Discounts Given', value: money(k.discounts), icon: Percent },
      { label: 'Refunds', value: money(k.refunds), icon: RotateCcw },
      { label: 'Units Sold', value: k.unitsSold ?? 0, icon: Package },
      { label: 'Customers (new)', value: `${k.uniqueCustomers ?? 0} (${k.newCustomers ?? 0})`, icon: Users },
      { label: 'PhonePe Success Rate', value: k.paymentSuccessRate === null || k.paymentSuccessRate === undefined ? '—' : `${k.paymentSuccessRate}%`, icon: Wallet },
      { label: 'Cancelled Orders', value: k.cancelledOrders ?? 0, icon: X },
    ],
    [k]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-gold" /> Reports & Analytics
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Sales, GST and operations – download any report as Excel or PDF.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => applyPreset(p)}
              className={`px-3 py-1.5 rounded-full text-xs border ${preset === p.key ? 'bg-gold text-black border-gold font-semibold' : 'border-zinc-800 text-zinc-400 hover:text-gold hover:border-gold/40'}`}
            >
              {p.label}
            </button>
          ))}
          <div className="flex items-center gap-1.5 bg-noir-card border border-zinc-800 rounded-lg px-2 py-1">
            <Calendar className="w-3.5 h-3.5 text-gold" />
            <input type="date" value={from} max={to} onChange={(e) => { setFrom(e.target.value); setPreset('custom'); }} className="bg-transparent text-xs text-zinc-200 focus:outline-none [color-scheme:dark]" aria-label="From date" />
            <span className="text-zinc-600">→</span>
            <input type="date" value={to} min={from} onChange={(e) => { setTo(e.target.value); setPreset('custom'); }} className="bg-transparent text-xs text-zinc-200 focus:outline-none [color-scheme:dark]" aria-label="To date" />
          </div>
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="bg-noir-card border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-200" aria-label="Group by">
            <option value="day">Daily</option>
            <option value="month">Monthly</option>
          </select>
        </div>
      </div>

      {error && <Alert>{error}</Alert>}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {cards.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className={`rounded-xl p-4 border ${accent ? 'bg-gradient-to-br from-gold/20 to-gold/5 border-gold/40' : 'bg-noir-card border-zinc-800'}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400">{label}</span>
              <Icon className="w-4 h-4 text-gold" />
            </div>
            <p className={`mt-2 text-lg font-bold ${accent ? 'text-gold' : 'text-zinc-100'}`}>{loading ? '…' : value}</p>
          </div>
        ))}
      </div>

      <div className="bg-noir-card border border-gold/20 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-sm uppercase tracking-[0.2em] text-gold">Revenue trend</h2>
          <span className="text-[11px] text-zinc-500">{data?.range?.from} → {data?.range?.to} · gold line = revenue, bars = orders</span>
        </div>
        {loading ? <div className="h-60 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-gold" /></div> : <RevenueChart data={data?.series || []} />}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-noir-card border border-zinc-800 rounded-xl p-5 xl:col-span-1">
          <h3 className="font-serif text-xs uppercase tracking-[0.2em] text-gold mb-4">Top products</h3>
          <BarList rows={data?.topProducts || []} labelKey="name" valueKey="revenue" sub={(r) => `· ${r.units} u`} />
        </div>
        <div className="bg-noir-card border border-zinc-800 rounded-xl p-5">
          <h3 className="font-serif text-xs uppercase tracking-[0.2em] text-gold mb-4">Top states</h3>
          <BarList rows={data?.states || []} labelKey="state" valueKey="revenue" sub={(r) => `· ${r.orders}`} />
        </div>
        <div className="bg-noir-card border border-zinc-800 rounded-xl p-5 space-y-6">
          <div>
            <h3 className="font-serif text-xs uppercase tracking-[0.2em] text-gold mb-4">Payment mix</h3>
            <Donut slices={(data?.paymentMix || []).map((p) => ({ label: `${p.method === 'COD' ? 'COD' : 'PhonePe'} · ${money(p.amount)}`, value: p.orders }))} />
          </div>
          <div>
            <h3 className="font-serif text-xs uppercase tracking-[0.2em] text-gold mb-3">Order status</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(data?.statusBreakdown || {}).map(([s, n]) => (
                <span key={s} className="text-[11px] px-2.5 py-1 rounded-full bg-noir border border-zinc-800 text-zinc-300">
                  {s.replace(/_/g, ' ').toLowerCase()} <b className="text-gold ml-1">{n}</b>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-serif text-lg uppercase tracking-wider text-zinc-100">Download centre</h2>
            <p className="text-xs text-zinc-500">Period: {from} → {to}. Excel files are formatted, filterable and include totals; PDFs are print-ready.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {REPORTS.map(({ key, title, desc, icon: Icon }) => (
            <article key={key} className="bg-noir-card border border-zinc-800 hover:border-gold/40 rounded-xl p-5 flex flex-col transition-colors">
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0"><Icon className="w-5 h-5" /></span>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-800/80">
                <button onClick={() => exportReport(key, 'xlsx')} disabled={!!busy} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs hover:bg-emerald-500/20 disabled:opacity-50">
                  {busy === `${key}-xlsx` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />} Excel
                </button>
                <button onClick={() => exportReport(key, 'pdf')} disabled={!!busy} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs hover:bg-red-500/20 disabled:opacity-50">
                  {busy === `${key}-pdf` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />} PDF
                </button>
                <button onClick={() => openPreview(key)} disabled={!!busy} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-700 text-zinc-300 text-xs hover:text-gold ml-auto disabled:opacity-50">
                  {busy === `${key}-preview` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />} Preview
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="max-w-6xl mx-auto bg-noir-card border border-gold/30 rounded-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <div>
                <h3 className="font-serif text-lg uppercase tracking-wider text-gold">{preview.title}</h3>
                <p className="text-xs text-zinc-500">{preview.period}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => exportReport(preview.type, 'xlsx')} className="btn-outline-gold !py-2 !px-3 rounded-lg"><Download className="w-3.5 h-3.5 mr-1" />Excel</button>
                <button onClick={() => exportReport(preview.type, 'pdf')} className="btn-outline-gold !py-2 !px-3 rounded-lg"><Download className="w-3.5 h-3.5 mr-1" />PDF</button>
                <button onClick={() => setPreview(null)} aria-label="Close" className="p-2 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-3">
                {preview.kpis?.map((kp) => (
                  <div key={kp.label} className="bg-noir border border-zinc-800 rounded-lg px-4 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">{kp.label}</p>
                    <p className="text-sm font-bold text-zinc-100">{kp.type === 'money' ? money(kp.value) : kp.type === 'percentRaw' ? `${kp.value}%` : kp.value}</p>
                  </div>
                ))}
              </div>
              {preview.sheets?.map((sheet) => (
                <div key={sheet.name}>
                  <h4 className="text-xs uppercase tracking-widest text-gold mb-2">
                    {sheet.name} <span className="text-zinc-500 normal-case tracking-normal">({sheet.totalRows} rows{sheet.totalRows > sheet.rows.length ? `, showing ${sheet.rows.length}` : ''})</span>
                  </h4>
                  <div className="overflow-x-auto border border-zinc-800 rounded-lg max-h-96">
                    <table className="w-full text-[11px]">
                      <thead className="bg-noir sticky top-0">
                        <tr>
                          {sheet.columns.map((c) => (
                            <th key={c.key} className={`px-3 py-2 text-gold font-semibold whitespace-nowrap ${['money', 'int', 'percent'].includes(c.type) ? 'text-right' : 'text-left'}`}>{c.header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sheet.rows.length === 0 && (
                          <tr><td colSpan={sheet.columns.length} className="px-3 py-6 text-center text-zinc-500">No records</td></tr>
                        )}
                        {sheet.rows.map((r, i) => (
                          <tr key={i} className="border-t border-zinc-800/70 hover:bg-white/[0.02]">
                            {sheet.columns.map((c) => (
                              <td key={c.key} className={`px-3 py-1.5 whitespace-nowrap ${['money', 'int', 'percent'].includes(c.type) ? 'text-right text-zinc-200' : 'text-zinc-300'}`}>
                                {c.type === 'money' ? money(r[c.key]) : c.type === 'percent' ? `${Math.round(Number(r[c.key] || 0) * 1000) / 10}%` : String(r[c.key] ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
