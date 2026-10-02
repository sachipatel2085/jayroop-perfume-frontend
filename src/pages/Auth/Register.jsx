import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { BrandLogo } from '../../components/common/BrandLogo.jsx';
import { SEOHead } from '../../components/common/SEOHead.jsx';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-noir min-h-screen text-zinc-100 flex items-center justify-center py-16 px-4">
      <SEOHead title="Join the Royal House of Jayroop" />

      <div className="w-full max-w-md bg-noir-card border border-gold/30 p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <BrandLogo size="large" showTagline={false} />
          <h2 className="font-serif text-xl sm:text-2xl uppercase tracking-wider font-bold text-zinc-100">
            Create Patron Account
          </h2>
          <p className="text-xs text-zinc-400 font-light">
            Receive exclusive royal releases, bespoke offers, and complimentary shipping
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
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Maharaja Rohan Sharma"
                className="w-full bg-noir border border-zinc-800 p-2.5 pl-10 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1.5 font-medium">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="patron@gmail.com"
                className="w-full bg-noir border border-zinc-800 p-2.5 pl-10 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1.5 font-medium">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-noir border border-zinc-800 p-2.5 pl-10 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1.5 font-medium">
              Choose Password * (Min 6 Characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            {loading ? 'Registering...' : 'Register Royal Account'}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400 border-t border-zinc-800 pt-4">
          <span>Already registered? </span>
          <Link to="/login" className="text-gold hover:underline font-semibold">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
