import React, { useEffect, useState } from 'react';
import { Users, Search, Loader2, FileSpreadsheet } from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { Pill } from '../../components/ui/StatusBadge.jsx';
import { Alert } from '../../components/ui/Field.jsx';

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const d = (x) => (x ? new Date(x).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

export const AdminCustomers = () => {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      adminService
        .getCustomers({ search: search || undefined, page, limit: 25 })
        .then((res) => {
          setRows(res.data || []);
          setMeta({ total: res.total, totalPages: res.totalPages || 1 });
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [search, page]);

  const toggle = async (u) => {
    if (!window.confirm(`${u.isActive ? 'Block' : 'Unblock'} ${u.email}?`)) return;
    const updated = await adminService.setCustomerStatus(u._id, !u.isActive);
    setRows((prev) => prev.map((r) => (r._id === u._id ? { ...r, isActive: updated.isActive } : r)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold flex items-center gap-3"><Users className="w-6 h-6 text-gold" />Customers</h1>
          <p className="text-xs text-zinc-400 mt-1">{meta.total} registered customers</p>
        </div>
        <button onClick={() => adminService.exportReport('customers', 'xlsx', {}).catch((e) => setError(e.message))} className="btn-outline-gold rounded-lg !py-2">
          <FileSpreadsheet className="w-4 h-4 mr-2" /> Customer report (Excel)
        </button>
      </div>
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, e-mail or phone…" className="w-full bg-noir-card border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-gold" />
      </div>
      {error && <Alert>{error}</Alert>}
      <div className="bg-noir-card border border-zinc-800 rounded-xl overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-[10px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4 text-right">Orders</th>
              <th className="py-3 px-4 text-right">Lifetime value</th>
              <th className="py-3 px-4">Last order</th>
              <th className="py-3 px-4">Joined</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {loading ? (
              <tr><td colSpan={7} className="py-10 text-center"><Loader2 className="w-5 h-5 animate-spin text-gold inline" /></td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="py-10 text-center text-zinc-500">No customers found.</td></tr>
            ) : (
              rows.map((u) => (
                <tr key={u._id} className="hover:bg-white/[0.03]">
                  <td className="py-3 px-4"><p className="text-zinc-100 font-medium">{u.name}</p><p className="text-zinc-500">{u.email}</p></td>
                  <td className="py-3 px-4 text-zinc-300">{u.phone || '—'}</td>
                  <td className="py-3 px-4 text-right text-zinc-200">{u.orders}</td>
                  <td className="py-3 px-4 text-right font-semibold text-gold">{money(u.spent)}</td>
                  <td className="py-3 px-4 text-zinc-400">{d(u.lastOrder)}</td>
                  <td className="py-3 px-4 text-zinc-400">{d(u.createdAt)}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => toggle(u)} title="Click to toggle">
                      <Pill tone={u.isActive ? 'emerald' : 'red'}>{u.isActive ? 'Active' : 'Blocked'}</Pill>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded-lg text-xs ${n === page ? 'bg-gold text-black font-bold' : 'border border-zinc-800 text-zinc-400'}`}>{n}</button>
          ))}
        </div>
      )}
    </div>
  );
};
