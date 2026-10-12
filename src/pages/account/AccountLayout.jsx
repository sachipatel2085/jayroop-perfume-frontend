import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, MapPin, UserCog, Heart, LogOut, LifeBuoy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { SEO } from '../../components/seo/SEO.jsx';

const NAV = [
  { to: '/account', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/account/orders', label: 'My Orders', icon: Package },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/account/profile', label: 'Profile & Security', icon: UserCog },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
];

export const AccountLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-noir min-h-screen text-zinc-100">
      <SEO title="My Account" searchIndexing="NOINDEX_NOFOLLOW" />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-gold/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark text-black font-serif font-bold text-xl flex items-center justify-center">
              {(user?.name || 'J').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-gold">My Account</p>
              <h1 className="font-serif text-xl sm:text-2xl tracking-wide text-zinc-100">Hello, {user?.name?.split(' ')[0] || 'there'}</h1>
              <p className="text-xs text-zinc-500">{user?.email}</p>
            </div>
          </div>
          <a href="mailto:care@jayrup.in" className="hidden sm:inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-gold">
            <LifeBuoy className="w-4 h-4" /> Need help? care@jayrup.in
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-8">
          <aside>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 -mx-1 px-1" aria-label="Account">
              {NAV.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                      isActive ? 'bg-gold text-black font-semibold' : 'text-zinc-400 hover:text-gold hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </nav>
          </aside>
          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
