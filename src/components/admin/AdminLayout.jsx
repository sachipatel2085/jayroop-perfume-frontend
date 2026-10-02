import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Video,
  Tag,
  Boxes,
  MessageSquare,
  BookOpen,
  FileText,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { BrandLogo } from '../common/BrandLogo.jsx';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products & Variants', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Orders & Tracking', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Hero Ads & Videos', path: '/admin/ads', icon: Video },
    { label: 'Coupons', path: '/admin/coupons', icon: Tag },
    { label: 'Inventory & Stock', path: '/admin/inventory', icon: Boxes },
    { label: 'Client Reviews', path: '/admin/reviews', icon: MessageSquare },
    { label: 'Editorial Blogs', path: '/admin/blogs', icon: BookOpen },
    { label: 'Security Audit Logs', path: '/admin/audit-logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-200 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-noir border-r border-gold/20 justify-between">
        <div>
          {/* Admin Header */}
          <div className="p-5 border-b border-zinc-800/80">
            <BrandLogo size="small" showTagline={false} />
            <div className="mt-3 flex items-center gap-1.5 px-2 py-1 bg-gold/10 border border-gold/30 rounded text-[10px] text-gold uppercase tracking-wider font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Control Center</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded font-medium transition-all ${
                    isActive
                      ? 'bg-gold text-black shadow-gold-glow font-bold'
                      : 'text-zinc-400 hover:text-gold hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 space-y-2 text-xs">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-zinc-400 hover:text-gold hover:bg-white/5 transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 transition-colors rounded text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-noir-card border-b border-zinc-800 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-zinc-300 hover:text-gold"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="hidden sm:block text-xs uppercase tracking-wider text-zinc-400">
            Jayroop Architecture Console • <span className="text-gold">Version 1.0 Production</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-zinc-400">
              Logged in as <strong className="text-zinc-200">{user?.name}</strong> ({user?.role})
            </span>
            <Link to="/" className="btn-outline-gold text-[10px] py-1.5 px-3">
              Storefront
            </Link>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {sidebarOpen && (
          <div className="lg:hidden bg-noir border-b border-gold/30 p-4 space-y-2 text-xs">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="block py-2 px-3 text-zinc-300 hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Page Content */}
        <main className="p-6 lg:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
