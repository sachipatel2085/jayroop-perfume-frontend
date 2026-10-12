import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package } from 'lucide-react';
import { orderService } from '../../services/orderService.js';
import { OrderCard } from './orderHelpers.jsx';
import { PageLoader, Alert } from '../../components/ui/Field.jsx';

const TABS = [
  ['all', 'All'],
  ['active', 'In progress'],
  ['completed', 'Delivered'],
  ['cancelled', 'Cancelled / Refunds'],
];

export const AccountOrders = () => {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'all';
  const page = Number(params.get('page') || 1);
  const [state, setState] = useState({ data: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    orderService
      .getMyOrders({ status: tab === 'all' ? undefined : tab, page, limit: 10 })
      .then((res) => setState({ data: res.data || [], total: res.total || 0, totalPages: res.totalPages || 1 }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [tab, page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl uppercase tracking-wider text-zinc-100">My Orders</h2>
          <p className="text-xs text-zinc-500 mt-1">Track, download invoices, cancel or reorder.</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setParams(key === 'all' ? {} : { tab: key })}
            className={`px-4 py-2 rounded-full text-xs whitespace-nowrap border transition-colors ${
              tab === key ? 'bg-gold text-black border-gold font-semibold' : 'border-zinc-800 text-zinc-400 hover:border-gold/50 hover:text-gold'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <Alert>{error}</Alert>}

      {loading ? (
        <PageLoader label="Loading orders" />
      ) : state.data.length === 0 ? (
        <div className="bg-noir-card border border-zinc-800 rounded-xl p-12 text-center">
          <Package className="w-12 h-12 mx-auto text-zinc-700 mb-3" />
          <p className="text-sm text-zinc-400 mb-5">No orders here yet.</p>
          <Link to="/shop" className="btn-gold">Explore products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {state.data.map((o) => (
            <OrderCard key={o._id} order={o} />
          ))}
        </div>
      )}

      {state.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {Array.from({ length: state.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setParams({ ...(tab !== 'all' ? { tab } : {}), page: String(p) })}
              className={`w-9 h-9 rounded-lg text-sm ${p === page ? 'bg-gold text-black font-bold' : 'border border-zinc-800 text-zinc-400 hover:text-gold'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
