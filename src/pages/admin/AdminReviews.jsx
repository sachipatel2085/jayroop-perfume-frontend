import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle2, XCircle, Trash2, Pin, MessageSquareReply, Search, Loader2, ShieldCheck, ExternalLink, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { Alert } from '../../components/ui/Field.jsx';

const TABS = [
  ['PENDING', 'Waiting for approval'],
  ['APPROVED', 'Published'],
  ['REJECTED', 'Rejected'],
  ['', 'All'],
];
const REJECT_REASONS = ['Not about the product', 'Offensive or abusive language', 'Contains personal details or links', 'Spam / promotional', 'Duplicate review'];
const STATUS_STYLE = {
  PENDING: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  APPROVED: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  REJECTED: 'bg-red-500/10 text-red-300 border-red-500/30',
};
const dt = (d) => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const Stars = ({ v }) => (
  <span className="inline-flex">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} className={`w-3.5 h-3.5 ${s <= v ? 'fill-gold text-gold' : 'text-zinc-700'}`} />
    ))}
  </span>
);

const ReviewCard = ({ r, picked, onPick, onChanged, setMsg }) => {
  const [busy, setBusy] = useState(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [reply, setReply] = useState(r.reply?.text || '');
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState(REJECT_REASONS[0]);

  const act = async (key, fn, ok) => {
    setBusy(key);
    try {
      await fn();
      setMsg({ tone: 'success', text: ok });
      onChanged();
    } catch (err) {
      setMsg({ tone: 'error', text: err.message });
    } finally {
      setBusy(null);
    }
  };

  const img = r.product?.images?.[0]?.url;
  return (
    <li className={`bg-noir-card border rounded-xl p-4 ${picked ? 'border-gold/60' : 'border-zinc-800'}`}>
      <div className="flex gap-3">
        <input type="checkbox" className="accent-[#D4AF37] w-4 h-4 mt-1 cursor-pointer" checked={picked} onChange={onPick} aria-label="Select review" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <div className="flex items-center gap-2 min-w-0">
              {img && <img src={img} alt="" className="w-9 h-9 rounded-md object-cover border border-zinc-800" />}
              <div className="min-w-0">
                <p className="text-xs text-zinc-200 font-semibold truncate">{r.product?.name || 'Deleted product'}</p>
                <p className="text-[10px] text-zinc-500">{dt(r.createdAt)}{r.edited ? ' · edited' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {r.featured && <span className="text-[10px] text-gold inline-flex items-center gap-1"><Pin className="w-3 h-3" />Pinned</span>}
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_STYLE[r.status]}`}>{r.status}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Stars v={r.rating} />
            {r.title && <span className="text-sm text-zinc-100 font-semibold">{r.title}</span>}
          </div>
          <p className="text-[13px] text-zinc-300 mt-1.5 whitespace-pre-line">{r.comment}</p>

          <p className="mt-2 text-[11px] text-zinc-500 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              Shown as <b className="text-zinc-300">{r.displayName}</b>
              {r.reviewerCity ? `, ${r.reviewerCity}` : ''}
            </span>
            <span>{r.user?.email}</span>
            {r.verifiedPurchase ? (
              <span className="text-gold inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Verified purchase</span>
            ) : (
              <span className="text-amber-300">Not a verified buyer</span>
            )}
            {r.helpfulCount > 0 && <span>{r.helpfulCount} found helpful</span>}
            {r.product?.slug && (
              <Link to={`/products/${r.product.slug}#reviews`} target="_blank" className="text-gold inline-flex items-center gap-1 hover:underline">
                View on site <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </p>
          {r.status === 'REJECTED' && r.rejectionReason && <p className="mt-1 text-[11px] text-red-300">Rejected: {r.rejectionReason}</p>}

          {r.reply?.text && !replyOpen && (
            <div className="mt-3 pl-3 border-l-2 border-gold/40 text-xs text-zinc-300">
              <span className="text-gold font-semibold">Your reply:</span> {r.reply.text}
            </div>
          )}

          {replyOpen && (
            <div className="mt-3 space-y-2">
              <textarea
                rows={3}
                maxLength={1500}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Thank the customer, answer their question or explain how you fixed the problem. Shown publicly as ‘Reply from Team Jayrup’."
                className="w-full bg-noir border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-gold"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busy === 'reply'}
                  onClick={() => act('reply', () => adminService.replyToReview(r._id, reply), reply.trim() ? 'Reply published' : 'Reply removed').then(() => setReplyOpen(false))}
                  className="btn-gold rounded-lg !py-1.5 !px-3 text-[11px]"
                >
                  {reply.trim() ? 'Publish reply' : 'Remove reply'}
                </button>
                <button type="button" onClick={() => setReplyOpen(false)} className="btn-outline-gold rounded-lg !py-1.5 !px-3 text-[11px]">Cancel</button>
              </div>
            </div>
          )}

          {rejectOpen && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <select value={reason} onChange={(e) => setReason(e.target.value)} className="bg-noir border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-200">
                {REJECT_REASONS.map((x) => <option key={x}>{x}</option>)}
              </select>
              <button
                type="button"
                onClick={() => act('reject', () => adminService.setReviewStatus(r._id, 'REJECTED', reason), 'Review rejected').then(() => setRejectOpen(false))}
                className="rounded-lg !py-1.5 !px-3 text-[11px] bg-red-500/80 hover:bg-red-500 text-white"
              >
                Reject
              </button>
              <button type="button" onClick={() => setRejectOpen(false)} className="text-[11px] text-zinc-400">Cancel</button>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {r.status !== 'APPROVED' && (
              <button type="button" disabled={Boolean(busy)} onClick={() => act('ok', () => adminService.setReviewStatus(r._id, 'APPROVED'), 'Review published')} className="btn-gold rounded-lg !py-1.5 !px-3 text-[11px]">
                {busy === 'ok' ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <CheckCircle2 className="w-3.5 h-3.5 mr-1" />} Approve & publish
              </button>
            )}
            {r.status !== 'REJECTED' && !rejectOpen && (
              <button type="button" onClick={() => setRejectOpen(true)} className="btn-outline-gold rounded-lg !py-1.5 !px-3 text-[11px]">
                <XCircle className="w-3.5 h-3.5 mr-1" /> {r.status === 'APPROVED' ? 'Unpublish' : 'Reject'}
              </button>
            )}
            {r.status === 'REJECTED' && (
              <button type="button" onClick={() => act('back', () => adminService.setReviewStatus(r._id, 'PENDING'), 'Moved back to pending')} className="btn-outline-gold rounded-lg !py-1.5 !px-3 text-[11px]">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Back to pending
              </button>
            )}
            {!replyOpen && (
              <button type="button" onClick={() => setReplyOpen(true)} className="btn-outline-gold rounded-lg !py-1.5 !px-3 text-[11px]">
                <MessageSquareReply className="w-3.5 h-3.5 mr-1" /> {r.reply?.text ? 'Edit reply' : 'Reply'}
              </button>
            )}
            {r.status === 'APPROVED' && (
              <button type="button" onClick={() => act('pin', () => adminService.toggleReviewFeatured(r._id), r.featured ? 'Unpinned' : 'Pinned to the top')} className="btn-outline-gold rounded-lg !py-1.5 !px-3 text-[11px]">
                <Pin className="w-3.5 h-3.5 mr-1" /> {r.featured ? 'Unpin' : 'Pin to top'}
              </button>
            )}
            <button
              type="button"
              onClick={() => window.confirm('Delete this review permanently?') && act('del', () => adminService.deleteReview(r._id), 'Review deleted')}
              className="rounded-lg !py-1.5 !px-3 text-[11px] border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/40 inline-flex items-center"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export const AdminReviews = () => {
  const [status, setStatus] = useState('PENDING');
  const [search, setSearch] = useState('');
  const [rating, setRating] = useState('');
  const [verified, setVerified] = useState(false);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({ PENDING: 0, APPROVED: 0, REJECTED: 0 });
  const [pageInfo, setPageInfo] = useState({ totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState(() => new Set());
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getReviews({ status: status || undefined, search: search || undefined, rating: rating || undefined, verified: verified ? 1 : undefined, page, limit: 20 });
      setRows(res.data || []);
      setCounts(res.statusCounts || {});
      setPageInfo(res.pagination || { totalPages: 1, total: 0 });
      setPicked(new Set());
    } catch (err) {
      setMsg({ tone: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }, [status, search, rating, verified, page]);

  useEffect(() => {
    const t = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const bulk = async (action) => {
    if (!picked.size) return;
    if (action === 'delete' && !window.confirm(`Delete ${picked.size} review(s) permanently?`)) return;
    try {
      const res = await adminService.bulkReviews([...picked], action, action === 'reject' ? 'Does not meet our review guidelines' : '');
      setMsg({ tone: 'success', text: res?.message || 'Done' });
      load();
    } catch (err) {
      setMsg({ tone: 'error', text: err.message });
    }
  };

  const toggle = (id) =>
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold">Product Reviews</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Approve, reject, reply and pin customer reviews. Only published reviews count towards a product’s rating and appear on the website and in Google results.
          Settings: Admin › Settings › Storefront &amp; Reviews.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(([k, l]) => (
          <button
            key={k || 'all'}
            onClick={() => {
              setStatus(k);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border ${status === k ? 'bg-gold text-black border-gold font-semibold' : 'border-zinc-800 text-zinc-400 hover:text-gold'}`}
          >
            {l}
            {k && counts[k] ? <span className="ml-1.5 opacity-70">{counts[k]}</span> : null}
          </button>
        ))}
      </div>

      <div className="bg-noir-card border border-zinc-800 rounded-xl p-3 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search review text or name…"
            className="w-full bg-noir border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-gold"
          />
        </div>
        <select value={rating} onChange={(e) => { setRating(e.target.value); setPage(1); }} className="bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200">
          <option value="">All ratings</option>
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
        </select>
        <label className="flex items-center gap-2 text-xs text-zinc-300 px-2">
          <input type="checkbox" className="accent-[#D4AF37]" checked={verified} onChange={(e) => { setVerified(e.target.checked); setPage(1); }} /> Verified buyers only
        </label>
      </div>

      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <label className="flex items-center gap-2 text-zinc-400">
          <input
            type="checkbox"
            className="accent-[#D4AF37]"
            checked={rows.length > 0 && rows.every((r) => picked.has(r._id))}
            onChange={(e) => setPicked(e.target.checked ? new Set(rows.map((r) => r._id)) : new Set())}
          />
          Select all on this page {picked.size ? `(${picked.size} selected)` : ''}
        </label>
        {picked.size > 0 && (
          <div className="flex gap-2">
            <button onClick={() => bulk('approve')} className="btn-gold rounded-lg !py-1.5 !px-3 text-[11px]"><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Approve</button>
            <button onClick={() => bulk('reject')} className="btn-outline-gold rounded-lg !py-1.5 !px-3 text-[11px]"><XCircle className="w-3.5 h-3.5 mr-1" />Reject</button>
            <button onClick={() => bulk('delete')} className="rounded-lg !py-1.5 !px-3 text-[11px] border border-red-500/40 text-red-300 inline-flex items-center"><Trash2 className="w-3.5 h-3.5 mr-1" />Delete</button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gold" /></div>
      ) : rows.length === 0 ? (
        <div className="py-16 text-center text-sm text-zinc-500 bg-noir-card border border-zinc-800 rounded-xl">
          {status === 'PENDING' ? 'All caught up – no reviews waiting for approval.' : 'No reviews match these filters.'}
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <ReviewCard key={r._id} r={r} picked={picked.has(r._id)} onPick={() => toggle(r._id)} onChanged={load} setMsg={setMsg} />
          ))}
        </ul>
      )}

      {pageInfo.totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>{pageInfo.total} reviews</span>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-2 rounded-lg border border-zinc-800 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            <span>Page {page} / {pageInfo.totalPages}</span>
            <button disabled={page >= pageInfo.totalPages} onClick={() => setPage(page + 1)} className="p-2 rounded-lg border border-zinc-800 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
};
