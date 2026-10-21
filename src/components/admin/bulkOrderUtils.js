// Shared rules for single + bulk order actions in the admin.
// The server re-checks everything – these only drive the previews and menus.

export const TRANSITIONS = {
  PENDING_PAYMENT: ['CANCELLED'], // unpaid PhonePe orders: re-check payment first, never fulfil
  PAID: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUND_REQUESTED'],
  PROCESSING: ['SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUND_REQUESTED'],
  SHIPPED: ['DELIVERED', 'PROCESSING', 'CANCELLED', 'REFUND_REQUESTED'],
  DELIVERED: ['REFUND_REQUESTED', 'SHIPPED'],
  REFUND_REQUESTED: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
  CANCELLED: [],
  REFUNDED: [],
};

export const BULK_STATUSES = ['PROCESSING', 'SHIPPED', 'DELIVERED', 'REFUND_REQUESTED', 'CANCELLED'];

export const COURIERS = ['Delhivery', 'BlueDart', 'DTDC', 'Shiprocket', 'Xpressbees', 'Ecom Express', 'Ekart', 'India Post Speed Post', 'Other'];

export const BULK_MAX = 200; // per request on the server
export const CHUNK = 50; // per request from the browser (shows progress)

/** What will happen to one order for a given action – used for the preview. */
export const eligibility = (o, action, opts = {}) => {
  const st = o.orderStatus;
  switch (action) {
    case 'STATUS': {
      const to = opts.status;
      if (!to) return ['wait', 'Choose a status'];
      if (st === to) return ['same', 'Already in this status'];
      if (!(TRANSITIONS[st] || []).includes(to)) return ['block', st === 'PENDING_PAYMENT' ? 'Payment not confirmed' : `Not allowed from ${st.replace(/_/g, ' ').toLowerCase()}`];
      return ['ok', ''];
    }
    case 'SHIP':
      if (['CANCELLED', 'REFUNDED', 'PENDING_PAYMENT'].includes(st)) return ['block', st === 'PENDING_PAYMENT' ? 'Payment not confirmed' : 'Order closed'];
      if (st === 'DELIVERED') return ['same', 'Already delivered'];
      if (st === 'SHIPPED' && !opts.awb) return ['same', 'Already shipped'];
      if (opts.requireAwb && !opts.awb) return ['block', 'AWB missing'];
      return ['ok', ''];
    case 'COD_PAYMENT':
      if (o.paymentMethod !== 'COD') return ['block', 'PhonePe order'];
      if (o.paymentStatus === opts.paymentStatus) return ['same', 'Already marked'];
      if (['REFUNDED', 'PARTIALLY_REFUNDED'].includes(o.paymentStatus)) return ['block', 'Refunded'];
      if (st === 'CANCELLED' && opts.paymentStatus === 'PAID') return ['block', 'Cancelled'];
      return ['ok', ''];
    case 'ISSUE_INVOICE':
      if (o.invoice?.number) return ['same', o.invoice.number];
      if (['PENDING_PAYMENT', 'CANCELLED'].includes(st)) return ['block', 'Unpaid / cancelled'];
      return ['ok', ''];
    case 'SYNC_PAYMENT':
      if (o.paymentMethod !== 'ONLINE') return ['block', 'COD order'];
      if (['PAID', 'REFUNDED', 'PARTIALLY_REFUNDED'].includes(o.paymentStatus)) return ['same', 'Already paid'];
      return ['ok', ''];
    case 'RETURN':
      if (!o.returnRequest?.status) return ['block', 'No return request'];
      if (o.returnRequest.status === opts.returnStatus) return ['same', `Already ${o.returnRequest.status.toLowerCase()}`];
      return ['ok', ''];
    case 'RESEND_EMAIL':
      if (!o.customerEmail) return ['block', 'No e-mail'];
      if (opts.emailType === 'SHIPPED' && !['SHIPPED', 'DELIVERED'].includes(st)) return ['block', 'Not shipped'];
      if (opts.emailType === 'DELIVERED' && st !== 'DELIVERED') return ['block', 'Not delivered'];
      if (opts.emailType === 'CONFIRMATION' && ['PENDING_PAYMENT', 'CANCELLED'].includes(st)) return ['block', 'Not confirmed'];
      return ['ok', ''];
    default:
      return ['ok', ''];
  }
};

// ───────── CSV helpers (Excel-friendly) ─────────
const cell = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const downloadCsv = (filename, header, rows) => {
  const body = [header, ...rows].map((r) => r.map(cell).join(',')).join('\r\n');
  const blob = new Blob(['﻿', body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
};

const d = (v) => (v ? new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

export const exportOrdersCsv = (orders) =>
  downloadCsv(
    `Jayrup-orders-${new Date().toISOString().slice(0, 10)}.csv`,
    ['Order no.', 'Order date', 'Customer', 'Phone', 'E-mail', 'City', 'State', 'PIN', 'Units', 'Total (₹)', 'Payment', 'Payment status', 'Order status', 'Invoice no.', 'Courier', 'AWB', 'Shipped on', 'Delivered on'],
    orders.map((o) => [
      o.orderNumber,
      d(o.createdAt),
      o.shippingAddress?.fullName,
      o.shippingAddress?.phone,
      o.customerEmail,
      o.shippingAddress?.city,
      o.shippingAddress?.state,
      o.shippingAddress?.postalCode,
      (o.items || []).reduce((s, i) => s + (Number(i.quantity) || 0), 0),
      Number(o.total || 0).toFixed(2),
      o.paymentMethod === 'COD' ? 'COD' : 'PhonePe',
      o.paymentStatus,
      o.orderStatus,
      o.invoice?.number || '',
      o.courier || '',
      o.trackingId || '',
      d(o.shippedAt),
      d(o.deliveredAt),
    ])
  );

/** Courier sheet template – order number + courier + AWB (+ optional status / COD collected). */
export const downloadDispatchTemplate = (orders = []) =>
  downloadCsv(
    'Jayrup-courier-sheet.csv',
    ['order_number', 'courier', 'awb', 'tracking_url', 'status', 'cod_collected'],
    orders.length
      ? orders.map((o) => [o.orderNumber, o.courier || '', o.trackingId || '', '', '', ''])
      : [
          ['JR-2526-000123', 'Delhivery', '1234567890123', '', '', ''],
          ['JR-2526-000124', 'BlueDart', '90876543210', '', 'DELIVERED', 'yes'],
        ]
  );

/** Small CSV / TSV parser (quotes, commas inside quotes, CRLF). */
export const parseDelimited = (text) => {
  const src = String(text || '').replace(/^﻿/, '');
  const firstLine = src.split(/\r?\n/, 1)[0] || '';
  const delim = [',', '\t', ';'].map((c) => [c, firstLine.split(c).length]).sort((a, b) => b[1] - a[1])[0][0];
  const rows = [];
  let row = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];
    if (q) {
      if (ch === '"' && src[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === delim) {
      row.push(cur);
      cur = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i += 1;
      row.push(cur);
      rows.push(row);
      row = [];
      cur = '';
    } else cur += ch;
  }
  if (cur || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows.map((r) => r.map((c) => c.trim())).filter((r) => r.some(Boolean));
};

const HEADER_ALIASES = {
  ref: ['order_number', 'order number', 'order no', 'order no.', 'order', 'order id', 'orderid', 'reference', 'ref', 'invoice', 'invoice no'],
  courier: ['courier', 'courier name', 'courier partner', 'carrier', 'logistics'],
  trackingId: ['awb', 'awb no', 'awb number', 'tracking', 'tracking id', 'tracking number', 'tracking no', 'waybill', 'docket', 'consignment'],
  trackingUrl: ['tracking_url', 'tracking url', 'url', 'link'],
  status: ['status', 'order status', 'delivery status'],
  codCollected: ['cod_collected', 'cod collected', 'cod', 'cash collected', 'remitted'],
};

/** Turn a pasted / uploaded courier sheet into rows for /orders/bulk/dispatch. */
export const sheetToRows = (text) => {
  const grid = parseDelimited(text);
  if (!grid.length) return { rows: [], columns: {}, error: 'The sheet is empty.' };
  const norm = (h) => h.toLowerCase().replace(/[_\-.]+/g, ' ').replace(/\s+/g, ' ').trim();
  const head = grid[0].map(norm);
  const columns = {};
  for (const [key, names] of Object.entries(HEADER_ALIASES)) {
    const idx = head.findIndex((h) => names.map(norm).includes(h));
    if (idx >= 0) columns[key] = idx;
  }
  let body = grid.slice(1);
  if (columns.ref === undefined) {
    // No header row – assume: order, courier, awb
    if (/^JR-/i.test(grid[0][0] || '')) {
      body = grid;
      Object.assign(columns, { ref: 0, courier: 1, trackingId: 2 });
    } else {
      return { rows: [], columns, error: 'Could not find an “order_number” column. Download the template to see the format.' };
    }
  }
  const rows = body.map((r) => {
    const out = {};
    for (const [k, i] of Object.entries(columns)) out[k] = r[i] ?? '';
    return out;
  });
  return { rows, columns, error: null };
};
