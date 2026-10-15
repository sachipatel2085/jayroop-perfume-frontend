import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Smartphone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { authService } from '../../services/authService.js';

const SKIP_KEY = 'jayrup_phone_skip';
const HIDDEN_ON = ['/login', '/register', '/forgot-password', '/reset-password'];

const readSkip = () => {
  try {
    return sessionStorage.getItem(SKIP_KEY) === '1';
  } catch {
    return false;
  }
};

/**
 * Asks a signed-in customer for a mobile number when the account has none (typical after
 * "Continue with Google", because Google doesn't share phone numbers). The number is saved to the
 * profile and pre-fills the checkout address – payments always use the delivery address phone.
 */
export const PhoneRequiredModal = () => {
  const { user, isAuthenticated, isAdmin, loading, setUser } = useAuth();
  const { pathname } = useLocation();
  const [skipped, setSkipped] = useState(readSkip);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const input = useRef(null);

  const open =
    isAuthenticated && !loading && Boolean(user?.email) && !isAdmin && !user?.phone && !skipped && !HIDDEN_ON.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => input.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open]);

  if (!open) return null;

  const save = async (e) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) return setError('Please enter a valid 10-digit Indian mobile number.');
    try {
      setSaving(true);
      setError('');
      const updated = await authService.updateProfile({ phone: digits });
      setUser((prev) => {
        const next = { ...prev, phone: updated?.phone ?? digits };
        try {
          localStorage.setItem('jayrup_user', JSON.stringify(next));
        } catch {
          /* storage unavailable */
        }
        return next;
      });
    } catch (err) {
      setError(err.message || 'Could not save your number. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const skip = () => {
    try {
      sessionStorage.setItem(SKIP_KEY, '1');
    } catch {
      /* storage unavailable */
    }
    setSkipped(true);
  };

  const firstName = String(user?.name || '').split(' ')[0];

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="phone-modal-title">
      <form onSubmit={save} className="w-full sm:max-w-md bg-noir-card border border-gold/30 sm:rounded-2xl rounded-t-2xl shadow-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-start gap-4">
          <span className="w-12 h-12 shrink-0 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-gold" aria-hidden="true" />
          </span>
          <div>
            <h2 id="phone-modal-title" className="font-serif text-xl text-zinc-100">
              {firstName ? `Welcome, ${firstName}!` : 'One last step'}
            </h2>
            <p className="text-sm text-zinc-400 mt-1">Add your mobile number for order updates and so our courier partner can reach you at delivery.</p>
          </div>
        </div>

        <div>
          <label htmlFor="phone-modal-input" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Mobile number
          </label>
          <div className="flex rounded-lg border border-zinc-700 focus-within:border-gold bg-noir overflow-hidden">
            <span className="px-3 flex items-center text-sm text-zinc-400 border-r border-zinc-700 select-none">+91</span>
            <input
              ref={input}
              id="phone-modal-input"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="flex-1 bg-transparent px-3 py-3 text-zinc-100 text-base tracking-wider outline-none"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'phone-modal-error' : undefined}
            />
          </div>
          {error && (
            <p id="phone-modal-error" className="text-xs text-red-400 mt-1.5">
              {error}
            </p>
          )}
        </div>

        <button type="submit" disabled={saving || phone.length !== 10} className="w-full btn-gold rounded-lg py-3.5 disabled:opacity-60">
          {saving ? 'Saving…' : 'Save & continue'}
        </button>

        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Used only for your orders – never shared
          </span>
          <button type="button" onClick={skip} className="underline hover:text-zinc-300">
            Skip for now
          </button>
        </div>
      </form>
    </div>
  );
};
