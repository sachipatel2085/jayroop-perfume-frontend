import React, { useMemo, useState } from 'react';
import { X, Printer, Download, ExternalLink, Loader2, FileText, Tag, Layers, Scissors, CheckCircle2, AlertTriangle } from 'lucide-react';
import { adminService } from '../../services/adminService.js';

// Same sizes as the backend (src/services/pdf/printSheet.js) – width × height in points, portrait
const PAPERS = {
  A4: { label: 'A4 (210 × 297 mm)', size: [595.28, 841.89] },
  A5: { label: 'A5 (148 × 210 mm)', size: [419.53, 595.28] },
  A3: { label: 'A3 (297 × 420 mm)', size: [841.89, 1190.55] },
  A6: { label: 'A6 (105 × 148 mm)', size: [297.64, 419.53] },
  LETTER: { label: 'US Letter (8.5 × 11 in)', size: [612, 792] },
  LEGAL: { label: 'US Legal (8.5 × 14 in)', size: [612, 1008] },
  LABEL_4X6: { label: 'Label 4 × 6 in (thermal)', size: [288, 432] },
  LABEL_100X150: { label: 'Label 100 × 150 mm (thermal)', size: [283.46, 425.2] },
  LABEL_4X4: { label: 'Label 4 × 4 in (thermal)', size: [288, 288] },
};
const PER_PAGE = [1, 2, 3, 4, 6, 8, 9, 12, 16];
const MARGINS = [
  [0, 'None'],
  [3, 'Narrow'],
  [6, 'Normal'],
  [12, 'Wide'],
];
const INVOICE_SIZE = [595.28, 841.89]; // invoices are A4
const LABEL_SIZE = [288, 432]; // labels are 4 × 6 in
const MM = 72 / 25.4;

const PRESETS = [
  { key: 'std', name: 'A4 · 1 per page', hint: 'Standard tax invoice', o: { documents: 'INVOICE', paper: 'A4', perPage: 1, orientation: 'auto' } },
  { key: 'save', name: 'A4 · 2 per page', hint: 'Saves half the paper', o: { documents: 'INVOICE', paper: 'A4', perPage: 2, orientation: 'auto' } },
  { key: 'four', name: 'A4 · 4 per page', hint: 'Compact office copies', o: { documents: 'INVOICE', paper: 'A4', perPage: 4, orientation: 'auto' } },
  { key: 'labels', name: 'Thermal labels 4×6', hint: '1 label per sticker', o: { documents: 'LABEL', labelPaper: 'LABEL_4X6', labelsPerPage: 1 } },
  { key: 'labelsA4', name: 'Labels · 4 on A4', hint: 'Normal printer, cut out', o: { documents: 'LABEL', labelPaper: 'A4', labelsPerPage: 4 } },
  { key: 'pack', name: 'Packing set', hint: 'Invoice A4 + 4×6 label', o: { documents: 'BOTH', paper: 'A4', perPage: 1, labelPaper: 'LABEL_4X6', labelsPerPage: 1 } },
];

const DEFAULTS = {
  documents: 'INVOICE',
  copies: ['ORIGINAL'],
  paper: 'A4',
  perPage: 1,
  orientation: 'auto',
  labelPaper: 'LABEL_4X6',
  labelsPerPage: 1,
  margin: 6,
  gap: 4,
  cutLines: true,
  issueMissing: true,
  sort: 'selected',
};
const STORE_KEY = 'jayrup_print_settings';
const loadSaved = () => {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORE_KEY) || '{}') };
  } catch {
    return DEFAULTS;
  }
};

/** Mirror of the backend layout planner – used for the live preview. */
const plan = ({ paper, orientation, perPage, margin, gap, src }) => {
  const [pw, ph] = (PAPERS[paper] || PAPERS.A4).size;
  const orients = orientation === 'portrait' ? [[pw, ph]] : orientation === 'landscape' ? [[ph, pw]] : [[pw, ph], [ph, pw]];
  const m = margin * MM;
  const g = gap * MM;
  let best = null;
  for (const [W, H] of orients) {
    for (let cols = 1; cols <= perPage; cols += 1) {
      const rows = Math.ceil(perPage / cols);
      if (cols * rows - perPage >= Math.min(cols, rows)) continue;
      const cw = (W - 2 * m - (cols - 1) * g) / cols;
      const chh = (H - 2 * m - (rows - 1) * g) / rows;
      if (cw <= 0 || chh <= 0) continue;
      for (const rotate of [false, true]) {
        const w = rotate ? src[1] : src[0];
        const h = rotate ? src[0] : src[1];
        const scale = Math.min(cw / w, chh / h);
        const score = scale - (rotate ? 1e-4 : 0) - (W > H && orientation === 'auto' ? 1e-5 : 0);
        if (!best || score > best.score) best = { W, H, cols, rows, cw, chh, scale, rotate, m, g, score };
      }
    }
  }
  return best;
};

const SheetPreview = ({ p, count, kind }) => {
  if (!p) return null;
  const box = 150;
  const k = box / Math.max(p.W, p.H);
  const cells = [];
  for (let i = 0; i < p.cols * p.rows; i += 1) {
    const c = i % p.cols;
    const r = Math.floor(i / p.cols);
    const filled = i < count;
    cells.push(
      <div
        key={i}
        className={`absolute rounded-[2px] border ${filled ? 'border-gold/70 bg-gold/15' : 'border-dashed border-zinc-700'}`}
        style={{ left: (p.m + c * (p.cw + p.g)) * k, top: (p.m + r * (p.chh + p.g)) * k, width: p.cw * k, height: p.chh * k }}
      >
        {filled && (
          <span className="absolute inset-0 flex items-center justify-center text-[9px] text-gold-light">
            {kind === 'LABEL' ? <Tag className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
          </span>
        )}
      </div>
    );
  }
  return (
    <div className="relative bg-white/95 shadow-lg" style={{ width: p.W * k, height: p.H * k }}>
      {cells}
    </div>
  );
};

const Chip = ({ active, onClick, children, title }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${active ? 'bg-gold text-black border-gold font-semibold' : 'border-zinc-700 text-zinc-300 hover:border-gold/60'}`}
  >
    {children}
  </button>
);

const Field = ({ label, children, hint }) => (
  <div>
    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-semibold mb-2">{label}</p>
    {children}
    {hint && <p className="text-[10px] text-zinc-500 mt-1.5">{hint}</p>}
  </div>
);

const readability = (scale) =>
  scale >= 0.62 ? ['Easy to read', 'text-emerald-300'] : scale >= 0.44 ? ['Small but readable', 'text-amber-300'] : ['Very small – office copy only', 'text-red-300'];

export const BulkPrintDialog = ({ orders, onClose }) => {
  const [o, setO] = useState(loadSaved);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const set = (patch) => setO((p) => ({ ...p, ...patch }));

  const withInvoice = orders.filter((x) => x.invoice?.number).length;
  const wantInvoices = o.documents !== 'LABEL';
  const wantLabels = o.documents !== 'INVOICE';
  const invoiceCount = wantInvoices ? (o.issueMissing ? orders.length : withInvoice) * Math.max(1, o.copies.length) : 0;
  const labelCount = wantLabels ? orders.length : 0;

  const invPlan = useMemo(() => plan({ ...o, paper: o.paper, perPage: o.perPage, src: INVOICE_SIZE }), [o]);
  const lblPlan = useMemo(() => plan({ ...o, paper: o.labelPaper, perPage: o.labelsPerPage, src: LABEL_SIZE }), [o]);
  const sheets = (wantInvoices ? Math.ceil(invoiceCount / o.perPage) : 0) + (wantLabels ? Math.ceil(labelCount / o.labelsPerPage) : 0);

  const toggleCopy = (c) => {
    const has = o.copies.includes(c);
    const next = has ? o.copies.filter((x) => x !== c) : [...o.copies, c];
    set({ copies: next.length ? ['ORIGINAL', 'DUPLICATE', 'TRIPLICATE'].filter((x) => next.includes(x)) : ['ORIGINAL'] });
  };

  const run = async (mode) => {
    setBusy(mode);
    setError(null);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(o));
    } catch {
      /* storage unavailable */
    }
    // open the tab before the request so pop-up blockers allow it
    const win = mode === 'open' ? window.open('', '_blank') : null;
    if (win) win.document.write('<p style="font-family:sans-serif;padding:24px;color:#555">Preparing PDF…</p>');
    try {
      const { blob, summary } = await adminService.bulkPrint({ ...o, orderIds: orders.map((x) => x._id) });
      setResult(summary);
      const url = URL.createObjectURL(blob);
      if (mode === 'open') {
        win.location.href = url;
      } else if (mode === 'download') {
        const a = document.createElement('a');
        a.href = url;
        a.download = `Jayrup-${o.documents === 'LABEL' ? 'labels' : 'invoices'}-${new Date().toISOString().slice(0, 10)}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        // Print straight from a hidden frame – the browser print dialog opens with the PDF
        const frame = document.createElement('iframe');
        frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
        frame.src = url;
        frame.onload = () => {
          try {
            frame.contentWindow.focus();
            frame.contentWindow.print();
          } catch {
            window.open(url, '_blank');
          }
        };
        document.body.appendChild(frame);
        setTimeout(() => frame.remove(), 10 * 60 * 1000);
      }
      setTimeout(() => URL.revokeObjectURL(url), 10 * 60 * 1000);
    } catch (err) {
      if (win) win.close();
      setError(err.message || 'Could not create the PDF');
    } finally {
      setBusy(null);
    }
  };

  const [invRead, invReadCls] = readability(invPlan?.scale || 1);
  const [lblRead, lblReadCls] = readability(Math.min(1, (lblPlan?.scale || 1) * 1.6)); // labels use bigger type

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3" role="dialog" aria-modal="true" aria-labelledby="bulk-print-title">
      <div className="w-full max-w-4xl max-h-[94vh] overflow-y-auto bg-noir-card border border-gold/30 rounded-2xl shadow-2xl">
        <header className="sticky top-0 z-10 bg-noir-card/95 backdrop-blur px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 id="bulk-print-title" className="font-serif text-lg text-zinc-100 flex items-center gap-2">
              <Printer className="w-5 h-5 text-gold" /> Print {orders.length} order{orders.length > 1 ? 's' : ''}
            </h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {withInvoice} with invoice · {orders.length - withInvoice} without · one PDF, ready to print
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-zinc-400 hover:text-gold" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="p-5 grid lg:grid-cols-[1fr_260px] gap-6">
          <div className="space-y-5">
            <Field label="Quick presets">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESETS.map((p) => (
                  <button key={p.key} type="button" onClick={() => set(p.o)} className="text-left rounded-lg border border-zinc-800 hover:border-gold/60 px-3 py-2">
                    <span className="block text-xs text-zinc-100 font-semibold">{p.name}</span>
                    <span className="block text-[10px] text-zinc-500">{p.hint}</span>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="What to print">
              <div className="flex flex-wrap gap-2">
                <Chip active={o.documents === 'INVOICE'} onClick={() => set({ documents: 'INVOICE' })}>Invoices</Chip>
                <Chip active={o.documents === 'LABEL'} onClick={() => set({ documents: 'LABEL' })}>Shipping labels</Chip>
                <Chip active={o.documents === 'BOTH'} onClick={() => set({ documents: 'BOTH' })}>Invoices + labels</Chip>
              </div>
            </Field>

            {wantInvoices && (
              <>
                <Field label="Invoice copies" hint="GST rules: original for the customer, duplicate for the courier, triplicate for your records.">
                  <div className="flex flex-wrap gap-2">
                    {[
                      ['ORIGINAL', 'Original (recipient)'],
                      ['DUPLICATE', 'Duplicate (transporter)'],
                      ['TRIPLICATE', 'Triplicate (supplier)'],
                    ].map(([c, l]) => (
                      <Chip key={c} active={o.copies.includes(c)} onClick={() => toggleCopy(c)}>{l}</Chip>
                    ))}
                  </div>
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Invoice paper size">
                    <select value={o.paper} onChange={(e) => set({ paper: e.target.value })} className="w-full bg-noir border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100">
                      {Object.entries(PAPERS).map(([k, p]) => (
                        <option key={k} value={k}>{p.label}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Orientation">
                    <div className="flex gap-2">
                      {['auto', 'portrait', 'landscape'].map((v) => (
                        <Chip key={v} active={o.orientation === v} onClick={() => set({ orientation: v })}>{v === 'auto' ? 'Auto (best fit)' : v[0].toUpperCase() + v.slice(1)}</Chip>
                      ))}
                    </div>
                  </Field>
                </div>

                <Field label="Invoices per sheet" hint={`Up to ${o.perPage} invoice${o.perPage > 1 ? 's' : ''} on each ${PAPERS[o.paper]?.label.split(' (')[0]} sheet – fewer when fewer are selected.`}>
                  <div className="flex flex-wrap gap-2">
                    {PER_PAGE.map((n) => (
                      <Chip key={n} active={o.perPage === n} onClick={() => set({ perPage: n })}>{n}</Chip>
                    ))}
                  </div>
                </Field>
              </>
            )}

            {wantLabels && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Label paper">
                  <select value={o.labelPaper} onChange={(e) => set({ labelPaper: e.target.value })} className="w-full bg-noir border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100">
                    {Object.entries(PAPERS).map(([k, p]) => (
                      <option key={k} value={k}>{p.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Labels per sheet">
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 4, 6, 8].map((n) => (
                      <Chip key={n} active={o.labelsPerPage === n} onClick={() => set({ labelsPerPage: n })}>{n}</Chip>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Margins">
                <div className="flex flex-wrap gap-2">
                  {MARGINS.map(([v, l]) => (
                    <Chip key={v} active={o.margin === v} onClick={() => set({ margin: v, gap: v ? Math.min(4, v) : 0 })}>{l}</Chip>
                  ))}
                </div>
              </Field>
              <Field label="Order of pages">
                <select value={o.sort} onChange={(e) => set({ sort: e.target.value })} className="w-full bg-noir border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100">
                  <option value="selected">As selected</option>
                  <option value="date">Order date (oldest first)</option>
                  <option value="invoice">Invoice number</option>
                </select>
              </Field>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-zinc-300">
                <input type="checkbox" className="accent-[#D4AF37]" checked={o.cutLines} onChange={(e) => set({ cutLines: e.target.checked })} />
                <Scissors className="w-3.5 h-3.5 text-gold" /> Dashed cut lines between documents
              </label>
              {wantInvoices && (
                <label className="flex items-center gap-2 text-xs text-zinc-300">
                  <input type="checkbox" className="accent-[#D4AF37]" checked={o.issueMissing} onChange={(e) => set({ issueMissing: e.target.checked })} />
                  <Layers className="w-3.5 h-3.5 text-gold" /> Issue invoices for selected orders that don’t have one yet
                  <span className="text-zinc-500">(paid / COD orders only)</span>
                </label>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-noir p-4 flex flex-col items-center gap-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-semibold self-start">Sheet preview</p>
              {wantInvoices && (
                <>
                  <SheetPreview p={invPlan} count={Math.min(o.perPage, invoiceCount || o.perPage)} kind="INVOICE" />
                  <p className="text-[11px] text-center text-zinc-400">
                    {PAPERS[o.paper]?.label.split(' (')[0]} {invPlan?.W > invPlan?.H ? 'landscape' : 'portrait'} · {invPlan?.cols}×{invPlan?.rows}
                    {invPlan?.rotate ? ' · turned 90°' : ''}
                    <br />
                    Invoice printed at {Math.round((invPlan?.scale || 1) * 100)}% · <span className={invReadCls}>{invRead}</span>
                  </p>
                </>
              )}
              {wantLabels && (
                <>
                  <SheetPreview p={lblPlan} count={Math.min(o.labelsPerPage, labelCount)} kind="LABEL" />
                  <p className="text-[11px] text-center text-zinc-400">
                    Labels on {PAPERS[o.labelPaper]?.label.split(' (')[0]} · {lblPlan?.cols}×{lblPlan?.rows} · <span className={lblReadCls}>{lblRead}</span>
                  </p>
                </>
              )}
            </div>
            <div className="rounded-xl border border-zinc-800 p-4 text-xs text-zinc-300 space-y-1">
              {wantInvoices && <p>{invoiceCount} invoice page{invoiceCount === 1 ? '' : 's'}</p>}
              {wantLabels && <p>{labelCount} label{labelCount === 1 ? '' : 's'}</p>}
              <p className="text-gold font-semibold">≈ {sheets} sheet{sheets === 1 ? '' : 's'} of paper</p>
              <p className="text-[10px] text-zinc-500 pt-1">In the print window choose “Actual size” / 100 % scale and the same paper size for an exact fit.</p>
            </div>
          </aside>
        </div>

        {(error || result) && (
          <div className="px-5 pb-2">
            {error && (
              <p className="flex items-start gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
              </p>
            )}
            {result && (
              <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 space-y-1">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> PDF ready – {result.invoices} invoice page(s), {result.labels} label(s)
                  {result.issued ? ` · ${result.issued} new invoice(s) issued` : ''}
                </p>
                {result.skipped?.length > 0 && <p className="text-amber-300">Skipped: {result.skipped.join(' · ')}</p>}
              </div>
            )}
          </div>
        )}

        <footer className="sticky bottom-0 bg-noir-card/95 backdrop-blur px-5 py-4 border-t border-zinc-800 flex flex-wrap items-center justify-end gap-2">
          <button type="button" onClick={() => run('open')} disabled={Boolean(busy)} className="btn-outline-gold rounded-lg !py-2.5">
            {busy === 'open' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ExternalLink className="w-4 h-4 mr-2" />} Preview
          </button>
          <button type="button" onClick={() => run('download')} disabled={Boolean(busy)} className="btn-outline-gold rounded-lg !py-2.5">
            {busy === 'download' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />} Download PDF
          </button>
          <button type="button" onClick={() => run('print')} disabled={Boolean(busy)} className="btn-gold rounded-lg !py-2.5">
            {busy === 'print' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Printer className="w-4 h-4 mr-2" />} Print now
          </button>
        </footer>
      </div>
    </div>
  );
};
