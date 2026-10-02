import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ShieldCheck } from 'lucide-react';
import { productService } from '../../services/productService.js';
import { useAuth } from '../../context/AuthContext.jsx';

export const ReviewSection = ({ productId }) => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (productId) {
      productService
        .getProductReviews(productId)
        .then((res) => {
          if (Array.isArray(res)) setReviews(res);
        })
        .catch(() => {});
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      setMessage(null);
      await productService.submitReview({
        productId,
        rating,
        title,
        comment,
      });
      setMessage({ type: 'success', text: 'Thank you! Your royal review has been submitted.' });
      setTitle('');
      setComment('');
      // Reload reviews
      const updated = await productService.getProductReviews(productId);
      if (Array.isArray(updated)) setReviews(updated);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gold/20 pt-10 my-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl text-zinc-100 tracking-wider uppercase">
            Client Impressions & Reviews
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Experiences from verified patrons across India
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {reviews.length === 0 ? (
            <div className="p-8 text-center bg-noir-card border border-zinc-800 text-zinc-500 text-sm">
              Be the first distinguished patron to share an impression of this creation.
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-5 bg-noir-card border border-gold/15 transition-all hover:border-gold/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-gold">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-gold text-gold' : 'text-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {rev.title && (
                  <h4 className="font-semibold text-zinc-200 text-sm mb-1">
                    {rev.title}
                  </h4>
                )}

                <p className="text-zinc-300 text-xs leading-relaxed mb-3">
                  {rev.comment}
                </p>

                <div className="flex items-center gap-2 text-[10px] text-zinc-400 border-t border-zinc-800/80 pt-2">
                  <span className="font-medium text-zinc-300">
                    {rev.user?.name || 'Verified Patron'}
                  </span>
                  {rev.verifiedPurchase && (
                    <span className="flex items-center gap-1 text-gold font-semibold">
                      <ShieldCheck className="w-3 h-3 text-gold" />
                      Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Submit Review Form */}
        <div className="bg-noir-card border border-gold/25 p-6 h-fit">
          <h4 className="font-serif text-sm text-gold tracking-widest uppercase mb-4">
            Leave an Impression
          </h4>

          {message && (
            <div
              className={`p-3 text-xs mb-4 ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}
            >
              {message.text}
            </div>
          )}

          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1.5">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 text-gold focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= rating ? 'fill-gold text-gold' : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Majestic projection & timeless warmth"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Your Review *
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about longevity, fragrance development, or skincare results..."
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-gold text-[10px] py-2.5"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-zinc-400 text-xs mb-3">
                Please sign in to share a verified product review.
              </p>
              <a href="/login" className="btn-outline-gold text-[10px] py-2 px-4 inline-block">
                Sign In to Review
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
