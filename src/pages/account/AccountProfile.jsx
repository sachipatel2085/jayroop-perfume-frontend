import React, { useState } from 'react';
import { UserCog, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { authService } from '../../services/authService.js';
import { Input, Card, Alert } from '../../components/ui/Field.jsx';

export const AccountProfile = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: (user?.phone || '').replace(/\D/g, '').slice(-10),
    marketingOptIn: Boolean(user?.marketingOptIn),
  });
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [msg, setMsg] = useState(null);
  const [pwMsg, setPwMsg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMsg(null);
      await authService.updateProfile(profile);
      await refreshUser();
      setMsg({ tone: 'success', text: 'Profile updated.' });
    } catch (err) {
      setMsg({ tone: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.next.length < 8) return setPwMsg({ tone: 'error', text: 'New password must be at least 8 characters.' });
    if (pw.next !== pw.confirm) return setPwMsg({ tone: 'error', text: 'Passwords do not match.' });
    try {
      setSavingPw(true);
      setPwMsg(null);
      await authService.changePassword(pw.current, pw.next);
      setPw({ current: '', next: '', confirm: '' });
      setPwMsg({ tone: 'success', text: 'Password changed. Other devices have been signed out.' });
    } catch (err) {
      setPwMsg({ tone: 'error', text: err.message });
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card title="Profile" icon={UserCog}>
        <form onSubmit={saveProfile} className="space-y-4">
          {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
          <Input label="Full name" required value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
          <Input label="E-mail" value={user?.email || ''} disabled hint="Contact support to change" />
          <Input
            label="Mobile"
            inputMode="numeric"
            maxLength={10}
            value={profile.phone}
            onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
          />
          <label className="flex items-center gap-2 text-xs text-zinc-400">
            <input type="checkbox" className="accent-[#D4AF37]" checked={profile.marketingOptIn} onChange={(e) => setProfile((p) => ({ ...p, marketingOptIn: e.target.checked }))} />
            Send me offers and new launch updates
          </label>
          <button type="submit" disabled={saving} className="btn-gold rounded-lg">{saving ? 'Saving…' : 'Save profile'}</button>
        </form>
      </Card>

      <Card title="Change password" icon={KeyRound}>
        <form onSubmit={savePassword} className="space-y-4">
          {pwMsg && <Alert tone={pwMsg.tone}>{pwMsg.text}</Alert>}
          <Input label="Current password" type="password" autoComplete="current-password" required value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} />
          <Input label="New password" type="password" autoComplete="new-password" required minLength={8} hint="Min 8 characters" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} />
          <Input label="Confirm new password" type="password" autoComplete="new-password" required value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} />
          <button type="submit" disabled={savingPw} className="btn-outline-gold rounded-lg">{savingPw ? 'Updating…' : 'Update password'}</button>
        </form>
      </Card>
    </div>
  );
};
