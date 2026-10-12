import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Input, Alert } from '../../components/ui/Field.jsx';
import { AuthShell, safeRedirect } from './AuthShell.jsx';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = safeRedirect(params.get('redirect'), '/account');

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', marketingOptIn: true });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) return setError('Please enter a valid 10-digit mobile number.');
    if (!agree) return setError('Please accept the Terms and Privacy Policy.');
    try {
      setLoading(true);
      setError(null);
      await register({ ...form, email: form.email.trim() });
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      seoTitle="Create your account"
      subtitle="Faster checkout, order tracking and GST invoices in one place"
      footer={
        <>
          Already registered?{' '}
          <Link to={`/login${params.get('redirect') ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="text-gold hover:underline font-semibold">
            Sign in
          </Link>
        </>
      }
    >
      {error && <Alert>{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full name" name="name" autoComplete="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="E-mail" type="email" name="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input
          label="Mobile number"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={10}
          hint="For delivery updates"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
        />
        <Input label="Password" type="password" name="password" autoComplete="new-password" required minLength={8} hint="Min 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label className="flex items-start gap-2 text-[11px] text-zinc-400">
          <input type="checkbox" className="mt-0.5 accent-[#D4AF37]" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>
            I agree to the <Link to="/terms-and-conditions" className="text-gold hover:underline">Terms and Conditions</Link> and{' '}
            <Link to="/privacy-policy" className="text-gold hover:underline">Privacy Policy</Link>.
          </span>
        </label>
        <label className="flex items-center gap-2 text-[11px] text-zinc-400">
          <input type="checkbox" className="accent-[#D4AF37]" checked={form.marketingOptIn} onChange={(e) => setForm({ ...form, marketingOptIn: e.target.checked })} />
          Send me offers and launch updates
        </label>
        <button type="submit" disabled={loading} className="w-full btn-gold rounded-lg py-3.5">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
};
