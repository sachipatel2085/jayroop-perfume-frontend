import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Users, AlertTriangle, Truck, ArrowRight, CalendarDays, Clock, RotateCcw, BarChart3, Package, Loader2 } from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { OrderStatusBadge, PaymentBadge } from '../../components/ui/StatusBadge.jsx';
import { RevenueChart } from '../../components/admin/charts.jsx';

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export const AdminDashboard = () => {
  const [a, setA] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getAnalytics()
      .then(setA)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gold" /></div>;

  const revenueCards = [
    { label: 'Today', value: money(a?.today?.revenue), sub: `${a?.today?.orders || 0} orders`, icon: Clock },
    { label: 'Last 7 days', value: money(a?.last7Days?.revenue), sub: `${a?.last7Days?.orders || 0} orders`, icon: CalendarDays },
    { label: 'This month', value: money(a?.thisMonth?.revenue), sub: `${a?.thisMonth?.orders || 0} orders`, icon: BarChart3 },
    { label: 'Lifetime sales', value: money(a?.totalRevenue), sub: `AOV ${money(a?.averageOrderValue)}`, icon: IndianRupee, accent: true },
  ];

  const actionCards = [
    { label: 'To ship', value: a?.pendingShipments || 0, icon: Truck, to: '/admin/orders?status=PROCESSING', tone: 'text-amber-300' },
    { label: 'Payments pending (24h)', value: a?.pendingPayments || 0, icon: Clock, to: '/admin/orders?status=PENDING_PAYMENT', tone: 'text-sky-300' },
    { label: 'Refund requests', value: a?.refundRequests || 0, icon: RotateCcw, to: '/admin/orders?status=REFUND_REQUESTED', tone: 'text-red-300' },
    { label: 'Low stock products', value: a?.lowStockCount || 0, icon: AlertTriangle, to: '/admin/inventory', tone: 'text-red-300' },
    { label: 'Customers', value: a?.totalCustomers || 0, icon: Users, to: '/admin/customers', tone: 'text-emerald-300' },
    { label: 'Active products', value: a?.totalProducts || 0, icon: Package, to: '/admin/products', tone: 'text-gold' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold">Dashboard</h1>
          <p className="text-xs text-zinc-400 mt-1">Sales, fulfilment and stock at a glance.</p>
        </div>
        <Link to="/admin/reports" className="btn-outline-gold rounded-lg !py-2">
          <BarChart3 className="w-4 h-4 mr-2" /> Full reports & GST
        </Link>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {revenueCards.map(({ label, value, sub, icon: Icon, accent }) => (
          <div key={label} className={`rounded-xl p-5 border ${accent ? 'bg-gradient-to-br from-gold/20 to-gold/5 border-gold/40' : 'bg-noir-card border-zinc-800'}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400">{label}</span>
              <Icon className="w-4 h-4 text-gold" />
            </div>
            <p className={`text-2xl font-bold mt-2 ${accent ? 'text-gold' : 'text-zinc-100'}`}>{value}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-noir-card border border-gold/20 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-sm uppercase tracking-[0.2em] text-gold">Last 14 days</h2>
          <span className="text-[11px] text-zinc-500">Valid sales (paid online + confirmed COD)</span>
        </div>
        <RevenueChart data={(a?.last14 || []).map((d) => ({ period: d.date, revenue: d.revenue, orders: d.orders }))} height={220} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {actionCards.map(({ label, value, icon: Icon, to, tone }) => (
          <Link key={label} to={to} className="bg-noir-card border border-zinc-800 hover:border-gold/40 rounded-xl p-4 transition-colors">
            <Icon className={`w-5 h-5 ${tone}`} />
            <p className="text-xl font-bold text-zinc-100 mt-2">{value}</p>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-noir-card border border-zinc-800 rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="font-serif text-sm uppercase tracking-[0.2em] text-gold">Recent orders</h2>
          <Link to="/admin/orders" className="text-xs text-gold hover:underline inline-flex items-center gap-1">All orders <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="py-3 px-5">Order</th>
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Payment</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {(a?.recentOrders || []).map((o) => (
                <tr key={o._id} className="hover:bg-white/[0.03]">
                  <td className="py-3 px-5">
                    <Link to={`/admin/orders?search=${o.orderNumber}`} className="font-mono font-bold text-gold hover:underline">{o.orderNumber}</Link>
                    <span className="block text-[10px] text-zinc-500">{new Date(o.createdAt).toLocaleString('en-IN')}</span>
                  </td>
                  <td className="py-3 px-5 text-zinc-300">{o.shippingAddress?.fullName || o.user?.name}</td>
                  <td className="py-3 px-5"><PaymentBadge method={o.paymentMethod} status={o.paymentStatus} /></td>
                  <td className="py-3 px-5"><OrderStatusBadge status={o.orderStatus} /></td>
                  <td className="py-3 px-5 text-right font-bold text-zinc-100">{money(o.total)}</td>
                </tr>
              ))}
              {!a?.recentOrders?.length && (
                <tr><td colSpan={5} className="py-8 text-center text-zinc-500"><ShoppingBag className="w-5 h-5 inline mr-2" />No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
