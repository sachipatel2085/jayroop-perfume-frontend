import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle, Search, Edit3, Eye, ExternalLink, X } from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { Badge } from '../../components/common/Badge.jsx';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Modals
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [trackingForm, setTrackingForm] = useState({
    courier: 'BlueDart',
    trackingId: '',
    note: '',
  });

  const [statusModalOrder, setStatusModalOrder] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: 'PROCESSING',
    note: '',
  });

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await adminService.getOrders(params);
      if (res?.data) setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, search]);

  const handleOpenTrackingModal = (ord) => {
    setTrackingModalOrder(ord);
    setTrackingForm({
      courier: ord.courier || 'BlueDart',
      trackingId: ord.trackingId || '',
      note: '',
    });
  };

  const handleSaveTracking = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateOrderTracking(trackingModalOrder._id, trackingForm);
      setTrackingModalOrder(null);
      loadOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenStatusModal = (ord) => {
    setStatusModalOrder(ord);
    setStatusForm({
      status: ord.orderStatus,
      note: '',
    });
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateOrderStatus(statusModalOrder._id, statusForm);
      setStatusModalOrder(null);
      loadOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold">
            Order Fulfillment & Courier Dispatch
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Transition order stages, enter manual courier tracking IDs, and audit milestones
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-noir-card border border-gold/20 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order number (JR-...), tracking ID, or client name..."
          className="flex-1 bg-noir border border-zinc-800 p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-gold"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-noir border border-zinc-800 p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-gold"
        >
          <option value="">All Statuses</option>
          <option value="PENDING_PAYMENT">PENDING PAYMENT</option>
          <option value="PAID">PAID</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-noir-card border border-gold/20 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="py-3 px-4">Order Reference</th>
              <th className="py-3 px-4">Patron Details</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Fulfillment Status</th>
              <th className="py-3 px-4">Courier / Tracking ID</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {orders.map((ord) => (
              <tr key={ord._id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-gold">
                  {ord.orderNumber}
                  <span className="block text-[10px] text-zinc-500 font-sans font-normal">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <p className="font-semibold text-zinc-200">
                    {ord.shippingAddress?.fullName || ord.user?.name || 'Patron'}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    {ord.shippingAddress?.city}, {ord.shippingAddress?.state} • {ord.shippingAddress?.phone}
                  </p>
                </td>

                <td className="py-3 px-4 font-bold text-zinc-200 font-sans">
                  ₹{ord.total}
                </td>

                <td className="py-3 px-4">
                  <Badge variant={ord.paymentStatus === 'PAID' ? 'emerald' : 'noir'}>
                    {ord.paymentStatus}
                  </Badge>
                </td>

                <td className="py-3 px-4">
                  <button
                    onClick={() => handleOpenStatusModal(ord)}
                    className="hover:opacity-80 transition-opacity"
                    title="Click to change order status"
                  >
                    <Badge variant={ord.orderStatus === 'DELIVERED' ? 'emerald' : ord.orderStatus === 'SHIPPED' ? 'amber' : 'gold'}>
                      {ord.orderStatus}
                    </Badge>
                  </button>
                </td>

                <td className="py-3 px-4">
                  {ord.trackingId ? (
                    <div className="text-zinc-300">
                      <span className="font-semibold text-zinc-100">{ord.courier}: </span>
                      <span className="font-mono text-gold font-bold">{ord.trackingId}</span>
                    </div>
                  ) : (
                    <span className="text-zinc-600 italic">No Tracking Assigned</span>
                  )}
                </td>

                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenTrackingModal(ord)}
                    className="btn-outline-gold py-1 px-2.5 text-[10px] inline-flex items-center gap-1"
                    title="Assign Courier & Tracking ID"
                  >
                    <Truck className="w-3 h-3" />
                    <span>Assign Courier</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual Tracking Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-noir-card border border-gold/40 p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg text-gold uppercase tracking-wider font-semibold">
                Assign Tracking Details
              </h3>
              <button onClick={() => setTrackingModalOrder(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-zinc-400 text-xs">
              Assigning a courier and tracking ID will automatically notify the customer and promote order status to <strong className="text-gold">SHIPPED</strong>.
            </p>

            <form onSubmit={handleSaveTracking} className="space-y-4">
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-medium">
                  Courier Partner *
                </label>
                <select
                  value={trackingForm.courier}
                  onChange={(e) => setTrackingForm({ ...trackingForm, courier: e.target.value })}
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                >
                  <option value="BlueDart">BlueDart Express</option>
                  <option value="Delhivery">Delhivery Logistics</option>
                  <option value="DTDC">DTDC Courier</option>
                  <option value="Shiprocket">Shiprocket Prime</option>
                  <option value="India Post EMS">India Post Speed Post</option>
                  <option value="Custom Courier">Other / Bespoke Hand Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-medium">
                  Tracking Number / AWB *
                </label>
                <input
                  type="text"
                  required
                  value={trackingForm.trackingId}
                  onChange={(e) => setTrackingForm({ ...trackingForm, trackingId: e.target.value })}
                  placeholder="e.g. BD849201948IN"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 font-mono tracking-wider focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-medium">
                  Internal Dispatch Note
                </label>
                <input
                  type="text"
                  value={trackingForm.note}
                  onChange={(e) => setTrackingForm({ ...trackingForm, note: e.target.value })}
                  placeholder="e.g. Handed over to BlueDart hub"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold py-2 px-6 text-xs">
                  Save & Update Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {statusModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-noir-card border border-gold/40 p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg text-gold uppercase tracking-wider font-semibold">
                Change Order Status
              </h3>
              <button onClick={() => setStatusModalOrder(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-medium">
                  Order Status
                </label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                >
                  <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                  <option value="PAID">PAID</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-medium">
                  Audit / Milestone Note
                </label>
                <input
                  type="text"
                  value={statusForm.note}
                  onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })}
                  placeholder="e.g. Packaged in royal gift presentation"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStatusModalOrder(null)}
                  className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold py-2 px-6 text-xs">
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
