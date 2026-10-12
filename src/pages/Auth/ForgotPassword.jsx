import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import { Input, Alert } from '../../components/ui/Field.jsx';
import { AuthShell } from './AuthShell.jsx';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await authService.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Forgot password" subtitle="We’ll e-mail you a secure link to reset it" footer={<Link to="/login" className="text-gold hover:underline">Back to sign in</Link>}>
      {sent ? (
        <Alert tone="success">If an account exists for <b>{email}</b>, a reset link is on its way. The link is valid for 30 minutes — please check your spam folder too.</Alert>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && <Alert>{error}</Alert>}
          <Input label="E-mail" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" disabled={loading} className="w-full btn-gold rounded-lg py-3.5">{loading ? 'Sending…' : 'Send reset link'}</button>
        </form>
      )}
    </AuthShell>
  );
};
