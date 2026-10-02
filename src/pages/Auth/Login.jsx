import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { BrandLogo } from '../../components/common/BrandLogo.jsx';
import { SEOHead } from '../../components/common/SEOHead.jsx';

export const Login = () => {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await login({ email, password });
      if (res.role === 'ADMIN' || res.role === 'SUPER_ADMIN') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAccount = (quickEmail, quickPassword) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
  };

  return (
    <div className="bg-noir min-h-screen text-zinc-100 flex items-center justify-center py-16 px-4">
      <SEOHead title="Sign In to Royal Patron Account" />

      <div className="w-full max-w-md bg-noir-card border border-gold/30 p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <BrandLogo size="large" showTagline={false} />
          <h2 className="font-serif text-xl sm:text-2xl uppercase tracking-wider font-bold text-zinc-100">
            Royal Salon Access
          </h2>
          <p className="text-xs text-zinc-400 font-light">
            Sign in to access your bespoke orders and saved wishlist
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1.5 font-medium">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@jayroop.com"
                className="w-full bg-noir border border-zinc-800 p-2.5 pl-10 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1.5 font-medium">
              Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-noir border border-zinc-800 p-2.5 pl-10 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3 text-xs tracking-widest font-bold"
          >
            {loading ? 'Authenticating...' : 'Enter Royal Salon'}
          </button>
        </form>

        {/* Quick Demo Login Credentials Pills for Evaluators */}
        <div className="pt-4 border-t border-zinc-800 text-center space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">
            Quick One-Click Test Accounts:
          </p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => fillQuickAccount('admin@jayroop.com', 'Admin@12345')}
              className="text-[10px] bg-gold/15 text-gold border border-gold/40 px-3 py-1 rounded hover:bg-gold/25 transition-colors"
            >
              Demo Admin (admin@jayroop.com)
            </button>
            <button
              type="button"
              onClick={() => fillQuickAccount('customer@jayroop.com', 'Customer@12345')}
              className="text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700 px-3 py-1 rounded hover:bg-zinc-700 transition-colors"
            >
              Demo Customer
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-zinc-400">
          <span>New to Jayroop Royal House? </span>
          <Link to="/register" className="text-gold hover:underline font-semibold">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
