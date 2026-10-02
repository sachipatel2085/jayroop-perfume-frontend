import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  Truck,
  Package,
  ArrowRight,
} from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { Badge } from '../../components/common/Badge.jsx';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getAnalytics()
      .then((data) => setAnalytics(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-zinc-400 py-10">Loading operational analytics...</div>;
  }

  const statCards = [
    {
      label: 'Gross Paid Revenue',
      value: `₹${analytics?.totalRevenue || 0}`,
      icon: DollarSign,
      color: 'text-gold',
    },
    {
      label: 'Total Orders',
      value: analytics?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'text-blue-400',
    },
    {
      label: 'Active Patrons',
      value: analytics?.totalCustomers || 0,
      icon: Users,
      color: 'text-emerald-400',
    },
    {
      label: 'Pending Shipments',
      value: analytics?.pendingShipments || 0,
      icon: Truck,
      color: 'text-amber-400',
    },
    {
      label: 'Low Stock Alerts',
      value: analytics?.lowStockCount || 0,
      icon: AlertTriangle,
      color: 'text-red-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold">
            Executive Command Console
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time telemetry across revenue, inventory, and order dispatch
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 bg-noir-card border border-gold/15 flex items-center justify-between shadow-lg"
            >
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
                  {card.label}
                </p>
                <h3 className="text-xl font-bold text-zinc-100 font-sans mt-1">
                  {card.value}
                </h3>
              </div>
              <Icon className={`w-6 h-6 ${card.color}`} />
            </div>
          );
        })}
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-noir-card border border-gold/20 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-serif text-sm uppercase tracking-wider text-gold font-semibold">
            Recent Client Orders
          </h3>
          <Link
            to="/admin/orders"
            className="text-xs text-gold hover:underline flex items-center gap-1 uppercase tracking-wider"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="py-3 px-2">Order Reference</th>
                <th className="py-3 px-2">Client</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Total</th>
                <th className="py-3 px-2">Tracking / Courier</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {analytics?.recentOrders?.map((ord) => (
                <tr key={ord._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-mono font-bold text-gold">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-2 text-zinc-300">
                    {ord.shippingAddress?.fullName || ord.user?.name || 'Patron'}
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant={ord.orderStatus === 'PAID' ? 'gold' : ord.orderStatus === 'DELIVERED' ? 'emerald' : 'noir'}>
                      {ord.orderStatus}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 font-bold text-zinc-200">
                    ₹{ord.total}
                  </td>
                  <td className="py-3 px-2 text-zinc-400">
                    {ord.courier ? (
                      <span>{ord.courier} ({ord.trackingId})</span>
                    ) : (
                      <span className="text-zinc-600 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <Link
                      to="/admin/orders"
                      className="text-gold hover:underline text-[11px] font-semibold uppercase"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
