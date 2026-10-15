import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { googleSignInEnabled, loadFirebaseAuth } from '../../config/firebase.js';

const REDIRECT_FLAG = 'jayrup_google_redirect';

// Official multi-colour Google "G"
const GoogleMark = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

const friendlyError = (err) => {
  const code = err?.code || '';
  if (code === 'auth/network-request-failed') return 'Network problem – please check your internet and try again.';
  if (code === 'auth/unauthorized-domain') return 'Google sign-in is not enabled for this website address yet.';
  if (code === 'auth/operation-not-allowed') return 'Google sign-in is switched off. Please use e-mail and password.';
  if (code === 'auth/account-exists-with-different-credential') return 'This e-mail is linked to another sign-in method.';
  return err?.message || 'Google sign-in failed. Please try again.';
};

/**
 * "Continue with Google" – one tap sign-in AND sign-up.
 * onSuccess(user) runs after the Jayrup session is created (user.isNew / user.needsPhone are set).
 */
export const GoogleSignInButton = ({ onSuccess, onError, label = 'Continue with Google', marketingOptIn = false }) => {
  const { loginWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const handled = useRef(false);

  const finish = async (fb, credential) => {
    const idToken = await credential.user.getIdToken();
    const user = await loginWithGoogle(idToken, { marketingOptIn });
    // Jayrup keeps its own session; the Firebase session is not needed any more
    fb.signOut(fb.auth).catch(() => {});
    onSuccess?.(user);
  };

  // Phones that block pop-ups fall back to a full-page redirect – pick up the result when we come back
  useEffect(() => {
    if (!googleSignInEnabled || handled.current) return;
    let pending = false;
    try {
      pending = sessionStorage.getItem(REDIRECT_FLAG) === '1';
    } catch {
      pending = false;
    }
    if (!pending) return;
    handled.current = true;
    setBusy(true);
    (async () => {
      try {
        sessionStorage.removeItem(REDIRECT_FLAG);
        const fb = await loadFirebaseAuth();
        const credential = await fb.getRedirectResult(fb.auth);
        if (credential) await finish(fb, credential);
      } catch (err) {
        onError?.(friendlyError(err));
      } finally {
        setBusy(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!googleSignInEnabled) return null;

  const start = async () => {
    setBusy(true);
    onError?.(null);
    let fb;
    try {
      fb = await loadFirebaseAuth();
      const credential = await fb.signInWithPopup(fb.auth, fb.provider);
      await finish(fb, credential);
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // customer closed the Google window – nothing to report
      } else if (code === 'auth/popup-blocked' && fb) {
        try {
          sessionStorage.setItem(REDIRECT_FLAG, '1');
        } catch {
          /* storage blocked */
        }
        await fb.signInWithRedirect(fb.auth, fb.provider);
        return;
      } else {
        onError?.(friendlyError(err));
      }
    }
    setBusy(false);
  };

  return (
    <button
      type="button"
      onClick={start}
      disabled={busy}
      className="w-full inline-flex items-center justify-center gap-3 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 font-semibold text-sm py-3.5 px-4 border border-zinc-300 shadow-sm transition-colors disabled:opacity-60"
    >
      {busy ? <span className="w-5 h-5 rounded-full border-2 border-zinc-300 border-t-zinc-700 animate-spin" aria-hidden="true" /> : <GoogleMark />}
      <span>{busy ? 'Connecting to Google…' : label}</span>
    </button>
  );
};

export const AuthDivider = ({ children = 'or' }) =>
  googleSignInEnabled ? (
    <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-zinc-500">
      <span className="h-px flex-1 bg-zinc-800" />
      {children}
      <span className="h-px flex-1 bg-zinc-800" />
    </div>
  ) : null;
