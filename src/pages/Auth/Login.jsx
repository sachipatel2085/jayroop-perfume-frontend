import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Input, Alert } from '../../components/ui/Field.jsx';
import { AuthShell, safeRedirect } from './AuthShell.jsx';
import { GoogleSignInButton, AuthDivider } from '../../components/auth/GoogleSignInButton.jsx';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const redirect = safeRedirect(params.get('redirect') || location.state?.from?.pathname, '/account');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const afterLogin = (res) => {
    if ((res.role === 'ADMIN' || res.role === 'SUPER_ADMIN') && !params.get('redirect')) navigate('/admin');
    else navigate(redirect, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await login({ email: email.trim(), password });
      afterLogin(res);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      seoTitle="Sign in to your account"
      subtitle="Access your orders, invoices, addresses and wishlist"
      footer={
        <>
          New to Jayrup?{' '}
          <Link to={`/register${params.get('redirect') ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="text-gold hover:underline font-semibold">
            Create an account
          </Link>
        </>
      }
    >
      {error && <Alert>{error}</Alert>}
      <GoogleSignInButton onSuccess={afterLogin} onError={setError} />
      <AuthDivider>or sign in with e-mail</AuthDivider>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="E-mail" type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="relative">
          <Input label="Password" type={show ? 'text' : 'password'} name="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-[34px] text-zinc-500 hover:text-gold" aria-label={show ? 'Hide password' : 'Show password'}>
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex justify-end -mt-2">
          <Link to="/forgot-password" className="text-xs text-zinc-400 hover:text-gold">Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="w-full btn-gold rounded-lg py-3.5">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
};
