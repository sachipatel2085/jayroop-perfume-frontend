import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, EyeOff, Trash2 } from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { Badge } from '../../components/common/Badge.jsx';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await adminService.getReviews();
      if (Array.isArray(data)) setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await adminService.toggleReviewApproval(id);
      loadReviews();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete review permanently?')) {
      try {
        await adminService.deleteReview(id);
        loadReviews();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold">
          Client Impressions Moderation
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review, approve, and moderate patron product ratings and feedback
        </p>
      </div>

      <div className="bg-noir-card border border-gold/20 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Patron</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Comment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {reviews.map((r) => (
              <tr key={r._id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 font-semibold text-zinc-200">
                  {r.product?.name || 'General Product'}
                </td>
                <td className="py-3 px-4 text-zinc-300">
                  {r.user?.name}
                  {r.verifiedPurchase && (
                    <span className="block text-[10px] text-gold">Verified Purchase</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center text-gold">
                    <Star className="w-3.5 h-3.5 fill-gold mr-1" />
                    <span className="font-bold">{r.rating}/5</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-zinc-300 max-w-xs">
                  {r.title && <p className="font-semibold text-zinc-100">{r.title}</p>}
                  <p className="text-xs line-clamp-2">{r.comment}</p>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={r.isApproved ? 'emerald' : 'noir'}>
                    {r.isApproved ? 'APPROVED' : 'HIDDEN'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => handleToggleStatus(r._id)}
                    className="p-1 text-zinc-400 hover:text-gold"
                    title={r.isApproved ? 'Hide Review' : 'Approve Review'}
                  >
                    {r.isApproved ? <EyeOff className="w-4 h-4 inline" /> : <CheckCircle className="w-4 h-4 inline" />}
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="p-1 text-zinc-400 hover:text-red-400"
                    title="Delete Permanently"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
