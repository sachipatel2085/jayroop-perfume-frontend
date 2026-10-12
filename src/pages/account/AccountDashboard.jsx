import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Heart, MapPin, ArrowRight } from 'lucide-react';
import { orderService } from '../../services/orderService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { OrderCard } from './orderHelpers.jsx';
import { PageLoader } from '../../components/ui/Field.jsx';

export const AccountDashboard = () => {
  const { user } = useAuth();
  const wishlist = useWishlist();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([orderService.getMyOrders({ limit: 3 }), orderService.getMyOrders({ status: 'active', limit: 1 })])
      .then(([all, act]) => {
        setOrders(all.data || []);
        setTotal(all.total || 0);
        setActive(act.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const wishCount = wishlist?.wishlistCount ?? 0;
  const stats = [
    { label: 'Total orders', value: total, icon: Package, to: '/account/orders' },
    { label: 'In progress', value: active, icon: Truck, to: '/account/orders?tab=active' },
    { label: 'Wishlist', value: wishCount, icon: Heart, to: '/wishlist' },
    { label: 'Saved addresses', value: user?.addresses?.length || 0, icon: MapPin, to: '/account/addresses' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to} className="bg-noir-card border border-gold/15 hover:border-gold/40 rounded-xl p-4 transition-colors">
            <Icon className="w-5 h-5 text-gold mb-3" />
            <p className="text-2xl font-bold text-zinc-100">{value}</p>
            <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-sm uppercase tracking-[0.2em] text-gold">Recent orders</h2>
          <Link to="/account/orders" className="text-xs text-zinc-400 hover:text-gold inline-flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <PageLoader label="Loading orders" />
        ) : orders.length ? (
          <div className="space-y-4">
            {orders.map((o) => (
              <OrderCard key={o._id} order={o} />
            ))}
          </div>
        ) : (
          <div className="bg-noir-card border border-zinc-800 rounded-xl p-10 text-center">
            <Package className="w-10 h-10 mx-auto text-zinc-700 mb-3" />
            <p className="text-sm text-zinc-400 mb-5">You haven’t placed any orders yet.</p>
            <Link to="/shop" className="btn-gold">Start shopping</Link>
          </div>
        )}
      </section>
    </div>
  );
};
