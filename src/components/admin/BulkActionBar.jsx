import React, { useEffect, useRef, useState } from 'react';
import {
  CheckSquare,
  Printer,
  Truck,
  PackageCheck,
  RefreshCw,
  ChevronDown,
  Wallet,
  Receipt,
  RotateCcw,
  StickyNote,
  Mail,
  FileSpreadsheet,
  Ban,
  Loader2,
  Package,
} from 'lucide-react';

const MORE = [
  ['COD_PAYMENT', 'COD payment received', Wallet],
  ['ISSUE_INVOICE', 'Issue GST invoices', Receipt],
  ['SYNC_PAYMENT', 'Check PhonePe payments', RefreshCw],
  ['RETURN', 'Approve / reject returns', RotateCcw],
  ['NOTE', 'Add internal note', StickyNote],
  ['RESEND_EMAIL', 'Re-send customer e-mail', Mail],
  ['EXPORT', 'Export selected (Excel CSV)', FileSpreadsheet],
  ['CANCEL', 'Cancel orders…', Ban],
];

/**
 * Sticky bar shown while orders are selected: quick status buttons, a "More" menu and printing.
 * `onAction(key)` receives: PROCESSING | SHIP | DELIVERED | STATUS | COD_PAYMENT | ISSUE_INVOICE |
 * SYNC_PAYMENT | RETURN | NOTE | RESEND_EMAIL | EXPORT | CANCEL
 */
export const BulkActionBar = ({ selected, matchingTotal = 0, onSelectAllMatching, selectingAll = false, onSelectPage, onClear, onAction, onPrint }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => menuRef.current && !menuRef.current.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  if (!selected.length) return null;
  const withInvoice = selected.filter((o) => o.invoice?.number).length;
  const value = selected.reduce((s, o) => s + Number(o.total || 0), 0);
  const byStatus = selected.reduce((m, o) => ({ ...m, [o.orderStatus]: (m[o.orderStatus] || 0) + 1 }), {});

  return (
    <div className="sticky top-2 z-30 rounded-xl border border-gold/40 bg-noir-card/95 backdrop-blur px-4 py-3 shadow-xl space-y-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-200">
        <CheckSquare className="w-4 h-4 text-gold" />
        <span>
          <strong>{selected.length}</strong> order{selected.length > 1 ? 's' : ''} selected
        </span>
        <span className="text-zinc-500">
          · ₹{value.toLocaleString('en-IN', { maximumFractionDigits: 0 })} · {withInvoice} invoiced ·{' '}
          {Object.entries(byStatus)
            .map(([k, n]) => `${n} ${k.replace(/_/g, ' ').toLowerCase()}`)
            .join(', ')}
        </span>
        <span className="ml-auto flex items-center gap-3">
          {onSelectPage && (
            <button onClick={onSelectPage} className="text-gold hover:underline">
              Select whole page
            </button>
          )}
          {onSelectAllMatching && matchingTotal > selected.length && (
            <button onClick={onSelectAllMatching} disabled={selectingAll} className="text-gold hover:underline inline-flex items-center gap-1">
              {selectingAll && <Loader2 className="w-3 h-3 animate-spin" />}
              Select all {matchingTotal} matching orders
            </button>
          )}
          <button onClick={onClear} className="text-zinc-400 hover:text-white">
            Clear
          </button>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => onAction('PROCESSING')} className="btn-outline-gold rounded-lg !py-2 !px-3 text-xs">
          <Package className="w-4 h-4 mr-1.5" /> Processing
        </button>
        <button onClick={() => onAction('SHIP')} className="btn-outline-gold rounded-lg !py-2 !px-3 text-xs">
          <Truck className="w-4 h-4 mr-1.5" /> Mark shipped
        </button>
        <button onClick={() => onAction('DELIVERED')} className="btn-gold rounded-lg !py-2 !px-3 text-xs">
          <PackageCheck className="w-4 h-4 mr-1.5" /> Mark delivered
        </button>
        <button onClick={() => onAction('STATUS')} className="btn-outline-gold rounded-lg !py-2 !px-3 text-xs">
          <RefreshCw className="w-4 h-4 mr-1.5" /> Change status
        </button>

        <div className="relative" ref={menuRef}>
          <button onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="menu" className="btn-outline-gold rounded-lg !py-2 !px-3 text-xs">
            More actions <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <div role="menu" className="absolute left-0 mt-2 w-64 rounded-xl border border-zinc-700 bg-noir shadow-2xl py-1 z-40">
              {MORE.map(([key, label, Icon]) => (
                <button
                  key={key}
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    onAction(key);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs hover:bg-white/5 ${key === 'CANCEL' ? 'text-red-300 border-t border-zinc-800 mt-1' : 'text-zinc-200'}`}
                >
                  <Icon className={`w-4 h-4 ${key === 'CANCEL' ? 'text-red-400' : 'text-gold'}`} /> {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {onPrint && (
          <button onClick={onPrint} className="btn-gold rounded-lg !py-2 !px-3 text-xs sm:ml-auto">
            <Printer className="w-4 h-4 mr-1.5" /> Invoices / labels PDF
          </button>
        )}
      </div>
    </div>
  );
};
