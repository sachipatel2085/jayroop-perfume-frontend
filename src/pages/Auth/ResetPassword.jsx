import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Input, Alert } from '../../components/ui/Field.jsx';
import { AuthShell } from './AuthShell.jsx';

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (pw.length < 8) return setError('Password must be at least 8 characters.');
    if (pw !== confirm) return setError('Passwords do not match.');
    try {
      setLoading(true);
      setError(null);
      await authService.resetPassword(token, pw);
      // AuthContext reads the token from storage on reload
      window.location.assign('/account');
      refreshUser?.();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Choose a new password" footer={<Link to="/login" className="text-gold hover:underline">Back to sign in</Link>}>
      <form onSubmit={submit} className="space-y-4">
        {error && <Alert>{error}</Alert>}
        <Input label="New password" type="password" autoComplete="new-password" required minLength={8} hint="Min 8 characters" value={pw} onChange={(e) => setPw(e.target.value)} />
        <Input label="Confirm password" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <button type="submit" disabled={loading} className="w-full btn-gold rounded-lg py-3.5">{loading ? 'Saving…' : 'Reset password'}</button>
        <button type="button" onClick={() => navigate('/forgot-password')} className="w-full text-xs text-zinc-500 hover:text-gold">Link expired? Request a new one</button>
      </form>
    </AuthShell>
  );
};
