import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, X } from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { Badge } from '../../components/common/Badge.jsx';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minimumOrder: 999,
    maximumDiscount: 500,
    expiryDate: '2028-12-31',
    status: 'ACTIVE',
  });

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCoupons();
      if (Array.isArray(data)) setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.createCoupon(formData);
      setShowModal(false);
      loadCoupons();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete coupon?')) {
      try {
        await adminService.deleteCoupon(id);
        loadCoupons();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold">
            Privilege Coupons & Discounts
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure percentage and flat order discount privileges
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-gold py-2.5 px-4 text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon Privilege</span>
        </button>
      </div>

      <div className="bg-noir-card border border-gold/20 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="py-3 px-4">Coupon Code</th>
              <th className="py-3 px-4">Discount</th>
              <th className="py-3 px-4">Min. Order Value</th>
              <th className="py-3 px-4">Max. Discount Cap</th>
              <th className="py-3 px-4">Times Redeemed</th>
              <th className="py-3 px-4">Expiry Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {coupons.map((c) => (
              <tr key={c._id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-gold text-sm tracking-wider">
                  {c.code}
                </td>
                <td className="py-3 px-4 font-semibold text-zinc-200">
                  {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                </td>
                <td className="py-3 px-4 text-zinc-300">₹{c.minimumOrder}</td>
                <td className="py-3 px-4 text-zinc-400">
                  {c.maximumDiscount ? `₹${c.maximumDiscount}` : 'No Cap'}
                </td>
                <td className="py-3 px-4 font-bold text-zinc-300">{c.timesUsed}</td>
                <td className="py-3 px-4 text-zinc-400">
                  {new Date(c.expiryDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <Badge variant={c.status === 'ACTIVE' ? 'gold' : 'noir'}>
                    {c.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => handleDelete(c._id)} className="p-1 text-zinc-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-noir-card border border-gold/40 p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg text-gold uppercase tracking-wider font-semibold">
                Create Coupon Privilege
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-medium">
                  Coupon Code * (e.g. ROYAL20)
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 font-mono tracking-wider focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-medium">
                    Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  >
                    <option value="PERCENTAGE">PERCENTAGE (%)</option>
                    <option value="FIXED">FLAT VALUE (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-medium">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-medium">
                    Min. Order (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.minimumOrder}
                    onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-medium">
                    Max. Cap (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.maximumDiscount}
                    onChange={(e) => setFormData({ ...formData, maximumDiscount: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-medium">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold py-2 px-6 text-xs">
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
