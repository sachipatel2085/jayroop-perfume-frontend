import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star, ShieldCheck, ThumbsUp, Pin, MessageSquareReply, Loader2, Pencil, Trash2, Clock, XCircle, CheckCircle2 } from 'lucide-react';
import { productService } from '../../services/productService.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Stars = ({ value, size = 'w-3.5 h-3.5' }) => (
  <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} className={`${size} ${s <= Math.round(value) ? 'fill-gold text-gold' : 'text-zinc-700'}`} aria-hidden="true" />
    ))}
  </span>
);

const LABEL = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very good', 5: 'Excellent' };
const dateIN = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/**
 * Product reviews – rating summary with distribution, filters & sorting, verified badges, brand replies,
 * "helpful" votes, and the customer's own review (with its moderation status) that they can edit or delete.
 */
export const ReviewSection = ({ productId, onSummary }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [list, setList] = useState([]);
  const [summary, setSummary] = useState({ average: 0, count: 0, verified: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filter, setFilter] = useState({ sort: 'recent', rating: '', verified: false });
  const [loading, setLoading] = useState(true);
  const [mine, setMine] = useState(null);
  const [form, setForm] = useState({ rating: 0, title: '', comment: '' });
  const [hover, setHover] = useState(0);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const load = useCallback(
    async (page = 1) => {
      if (!productId) return;
      setLoading(true);
      try {
        const res = await productService.getReviewsPage(productId, {
          page,
          limit: 8,
          sort: filter.sort,
          rating: filter.rating || undefined,
          verified: filter.verified ? 1 : undefined,
        });
        setList((prev) => (page === 1 ? res.data || [] : [...prev, ...(res.data || [])]));
        if (res.summary) {
          setSummary(res.summary);
          onSummary?.(res.summary);
        }
        setPageInfo(res.pagination || { page: 1, totalPages: 1, total: (res.data || []).length });
      } catch {
        /* keep previous list */
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productId, filter]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const loadMine = useCallback(async () => {
    if (!isAuthenticated || !productId) return setMine(null);
    try {
      const m = await productService.getMyReview(productId);
      setMine(m);
      if (m?.review) setForm({ rating: m.review.rating, title: m.review.title || '', comment: m.review.comment || '' });
    } catch {
      setMine(null);
    }
  }, [isAuthenticated, productId]);

  useEffect(() => {
    loadMine();
  }, [loadMine]);

  const minLength = mine?.minLength ?? 20;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.rating) return setMessage({ type: 'error', text: 'Please choose a star rating.' });
    if (form.comment.trim().length < minLength) return setMessage({ type: 'error', text: `Please write at least ${minLength} characters.` });
    try {
      setSubmitting(true);
      setMessage(null);
      const res = await productService.submitReview({ productId, ...form });
      setMessage({ type: 'success', text: res?.message || 'Thank you for your review!' });
      setEditing(false);
      await Promise.all([loadMine(), load(1)]);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const removeMine = async () => {
    if (!mine?.review || !window.confirm('Delete your review?')) return;
    try {
      await productService.deleteMyReview(mine.review._id);
      setForm({ rating: 0, title: '', comment: '' });
      setMessage({ type: 'success', text: 'Your review was removed.' });
      await Promise.all([loadMine(), load(1)]);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const helpful = async (rev) => {
    if (!isAuthenticated) return setMessage({ type: 'error', text: 'Sign in to mark reviews as helpful.' });
    try {
      const r = await productService.toggleReviewHelpful(rev._id);
      setList((prev) => prev.map((x) => (x._id === rev._id ? { ...x, helpfulCount: r.helpfulCount, votedHelpful: r.votedHelpful } : x)));
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const total = summary.count || 0;
  const showForm = isAuthenticated && mine?.canReview !== false && (!mine?.review || editing);
  const statusBox = mine?.review && !editing && (
    <div
      className={`p-3 rounded-lg text-xs border mb-4 ${
        mine.review.status === 'APPROVED'
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          : mine.review.status === 'REJECTED'
            ? 'bg-red-500/10 border-red-500/30 text-red-300'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
      }`}
    >
      <p className="flex items-center gap-1.5 font-semibold">
        {mine.review.status === 'APPROVED' ? <CheckCircle2 className="w-4 h-4" /> : mine.review.status === 'REJECTED' ? <XCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
        {mine.review.status === 'APPROVED' ? 'Your review is live' : mine.review.status === 'REJECTED' ? 'Your review was not published' : 'Your review is waiting for approval'}
      </p>
      {mine.review.rejectionReason && <p className="mt-1 text-zinc-300">Reason: {mine.review.rejectionReason}</p>}
      <div className="mt-2 flex items-center gap-1 text-zinc-300">
        <Stars value={mine.review.rating} size="w-3 h-3" /> <span className="ml-1 line-clamp-1">{mine.review.title || mine.review.comment}</span>
      </div>
      <div className="mt-3 flex gap-3">
        <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-1 text-gold hover:underline">
          <Pencil className="w-3 h-3" /> Edit
        </button>
        <button type="button" onClick={removeMine} className="inline-flex items-center gap-1 text-zinc-400 hover:text-red-400">
          <Trash2 className="w-3 h-3" /> Delete
        </button>
      </div>
    </div>
  );

  return (
    <section id="reviews" className="border-t border-gold/20 pt-10 my-10 scroll-mt-24" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="font-serif text-xl sm:text-2xl text-zinc-100 tracking-wider uppercase">
        Customer Reviews
      </h2>
      <p className="text-xs text-zinc-400 mt-1">Genuine reviews from Jayrup customers. Verified buyers are marked.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Summary + write */}
        <aside className="space-y-6">
          <div className="bg-noir-card border border-gold/20 p-6 rounded-xl">
            <div className="flex items-end gap-3">
              <span className="font-serif text-5xl text-zinc-100 leading-none">{total ? summary.average.toFixed(1) : '–'}</span>
              <div className="pb-1">
                <Stars value={summary.average} size="w-4 h-4" />
                <p className="text-[11px] text-zinc-400 mt-1">
                  {total ? `${total} review${total > 1 ? 's' : ''}` : 'No reviews yet'}
                  {summary.verified ? ` · ${summary.verified} verified` : ''}
                </p>
              </div>
            </div>
            <ul className="mt-5 space-y-1.5">
              {[5, 4, 3, 2, 1].map((n) => {
                const c = summary.distribution?.[n] || 0;
                const pct = total ? Math.round((c / total) * 100) : 0;
                const active = String(filter.rating) === String(n);
                return (
                  <li key={n}>
                    <button
                      type="button"
                      disabled={!c}
                      onClick={() => setFilter((f) => ({ ...f, rating: active ? '' : n }))}
                      className={`w-full flex items-center gap-2 text-[11px] ${active ? 'text-gold' : 'text-zinc-400'} disabled:opacity-40 hover:text-gold`}
                      aria-pressed={active}
                    >
                      <span className="w-8 text-left">{n} ★</span>
                      <span className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <span className="block h-full bg-gold" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="w-9 text-right">{pct}%</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-noir-card border border-gold/25 p-6 rounded-xl">
            <h3 className="font-serif text-sm text-gold tracking-widest uppercase mb-4">{mine?.review ? 'Your review' : 'Write a review'}</h3>
            {message && (
              <div className={`p-3 text-xs mb-4 rounded-lg border ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-red-500/10 text-red-300 border-red-500/30'}`}>
                {message.text}
              </div>
            )}
            {statusBox}

            {!isAuthenticated && (
              <div className="text-center py-2">
                <p className="text-zinc-400 text-xs mb-3">Sign in to share your experience with this product.</p>
                <Link to={`/login?redirect=${encodeURIComponent(`${location.pathname}#reviews`)}`} className="btn-outline-gold text-[10px] py-2 px-4 inline-block">
                  Sign in to review
                </Link>
              </div>
            )}
            {isAuthenticated && mine?.canReview === false && !mine?.review && (
              <p className="text-xs text-zinc-400">Only customers who bought this product can review it. Your review link appears here after your order is confirmed.</p>
            )}

            {showForm && (
              <form onSubmit={submit} className="space-y-4 text-xs">
                {mine?.verifiedBuyer && (
                  <p className="inline-flex items-center gap-1.5 text-[11px] text-gold">
                    <ShieldCheck className="w-3.5 h-3.5" /> You bought this – your review gets the Verified Purchase badge
                  </p>
                )}
                <div>
                  <span className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1.5">Your rating *</span>
                  <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Rating">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={form.rating === s}
                        aria-label={`${s} star${s > 1 ? 's' : ''} – ${LABEL[s]}`}
                        onMouseEnter={() => setHover(s)}
                        onClick={() => setForm((f) => ({ ...f, rating: s }))}
                        className="p-0.5"
                      >
                        <Star className={`w-6 h-6 ${s <= (hover || form.rating) ? 'fill-gold text-gold' : 'text-zinc-700'}`} />
                      </button>
                    ))}
                    <span className="ml-2 text-zinc-400">{LABEL[hover || form.rating] || ''}</span>
                  </div>
                </div>
                <label className="block">
                  <span className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Headline</span>
                  <input
                    type="text"
                    maxLength={120}
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Sum it up in a few words"
                    className="w-full bg-noir border border-zinc-800 rounded-lg p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                  />
                </label>
                <label className="block">
                  <span className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Your review *</span>
                  <textarea
                    rows={5}
                    maxLength={3000}
                    value={form.comment}
                    onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                    placeholder="What did you like? How long did it last? Would you recommend it?"
                    className="w-full bg-noir border border-zinc-800 rounded-lg p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                  />
                  <span className={`block text-right text-[10px] mt-1 ${form.comment.trim().length < minLength ? 'text-zinc-500' : 'text-emerald-400'}`}>
                    {form.comment.trim().length}/{minLength} min
                  </span>
                </label>
                <p className="text-[10px] text-zinc-500">Please keep it honest and about the product. No links, phone numbers or personal details.</p>
                <div className="flex gap-2">
                  <button type="submit" disabled={submitting} className="flex-1 btn-gold text-[10px] py-2.5 rounded-lg">
                    {submitting ? 'Submitting…' : mine?.review ? 'Update review' : 'Submit review'}
                  </button>
                  {editing && (
                    <button type="button" onClick={() => setEditing(false)} className="btn-outline-gold text-[10px] py-2.5 px-4 rounded-lg">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </aside>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap gap-2 text-[11px]">
              {filter.rating && (
                <button type="button" onClick={() => setFilter((f) => ({ ...f, rating: '' }))} className="px-3 py-1.5 rounded-full bg-gold text-black font-semibold">
                  {filter.rating} ★ only ✕
                </button>
              )}
              <button
                type="button"
                onClick={() => setFilter((f) => ({ ...f, verified: !f.verified }))}
                className={`px-3 py-1.5 rounded-full border ${filter.verified ? 'bg-gold text-black border-gold font-semibold' : 'border-zinc-700 text-zinc-300'}`}
              >
                Verified purchases
              </button>
            </div>
            <select
              value={filter.sort}
              onChange={(e) => setFilter((f) => ({ ...f, sort: e.target.value }))}
              className="bg-noir border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200"
              aria-label="Sort reviews"
            >
              <option value="recent">Most recent</option>
              <option value="helpful">Most helpful</option>
              <option value="highest">Highest rating</option>
              <option value="lowest">Lowest rating</option>
            </select>
          </div>

          {loading && !list.length ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-gold" />
            </div>
          ) : list.length === 0 ? (
            <div className="p-8 text-center bg-noir-card border border-zinc-800 rounded-xl text-zinc-500 text-sm">
              {total ? 'No reviews match this filter.' : 'No reviews yet – be the first to share your experience.'}
            </div>
          ) : (
            <ul className="space-y-4">
              {list.map((rev) => (
                <li key={rev._id} className="p-5 bg-noir-card border border-gold/15 rounded-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Stars value={rev.rating} />
                      {rev.featured && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-gold">
                          <Pin className="w-3 h-3" /> Top review
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      {dateIN(rev.createdAt)}
                      {rev.edited ? ' · edited' : ''}
                    </span>
                  </div>
                  {rev.title && <h3 className="font-semibold text-zinc-100 text-sm mt-2">{rev.title}</h3>}
                  <p className="text-zinc-300 text-[13px] leading-relaxed mt-1.5 whitespace-pre-line">{rev.comment}</p>

                  {rev.reply && (
                    <div className="mt-3 ml-2 pl-3 border-l-2 border-gold/40">
                      <p className="flex items-center gap-1.5 text-[11px] text-gold font-semibold">
                        <MessageSquareReply className="w-3.5 h-3.5" /> Reply from {rev.reply.by}
                      </p>
                      <p className="text-xs text-zinc-300 mt-1 whitespace-pre-line">{rev.reply.text}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400 border-t border-zinc-800/80 pt-3 mt-3">
                    <span className="flex items-center gap-2">
                      <span className="font-medium text-zinc-200">{rev.reviewerName}</span>
                      {rev.reviewerCity && <span className="text-zinc-500">{rev.reviewerCity}</span>}
                      {rev.verifiedPurchase && (
                        <span className="flex items-center gap-1 text-gold font-semibold">
                          <ShieldCheck className="w-3 h-3" /> Verified Purchase
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => helpful(rev)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border ${rev.votedHelpful ? 'border-gold text-gold' : 'border-zinc-800 hover:border-gold/50'}`}
                      aria-pressed={rev.votedHelpful}
                    >
                      <ThumbsUp className="w-3 h-3" /> Helpful{rev.helpfulCount ? ` (${rev.helpfulCount})` : ''}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {pageInfo.page < pageInfo.totalPages && (
            <div className="text-center mt-6">
              <button type="button" onClick={() => load(pageInfo.page + 1)} disabled={loading} className="btn-outline-gold text-[11px] py-2.5 px-6 rounded-lg">
                {loading ? 'Loading…' : `Show more reviews (${pageInfo.total - list.length} more)`}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
