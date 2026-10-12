import React, { useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, Star, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { authService } from '../../services/authService.js';
import { Input, Select, Alert } from '../../components/ui/Field.jsx';
import { INDIA_STATES } from '../../config/site.js';

const blank = (user) => ({
  fullName: user?.name || '',
  phone: (user?.phone || '').replace(/\D/g, '').slice(-10),
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: 'Gujarat',
  postalCode: '',
  isDefault: false,
});

export const AccountAddresses = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState(null); // null = closed
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const open = (addr = null) => {
    setError(null);
    setEditingId(addr?._id || null);
    setForm(addr ? { ...addr, phone: String(addr.phone).replace(/\D/g, '').slice(-10) } : blank(user));
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      if (editingId) await authService.updateAddress(editingId, form);
      else await authService.addAddress(form);
      await refreshUser();
      setForm(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Remove this address?')) return;
    await authService.deleteAddress(id);
    refreshUser();
  };

  const makeDefault = async (id) => {
    await authService.setDefaultAddress(id);
    refreshUser();
  };

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl uppercase tracking-wider text-zinc-100">Saved Addresses</h2>
          <p className="text-xs text-zinc-500 mt-1">Used for faster checkout. Up to 10 addresses.</p>
        </div>
        <button onClick={() => open()} className="btn-gold rounded-lg !px-4">
          <Plus className="w-4 h-4 mr-1.5" /> Add address
        </button>
      </div>

      {!user?.addresses?.length ? (
        <div className="bg-noir-card border border-zinc-800 rounded-xl p-12 text-center">
          <MapPin className="w-10 h-10 mx-auto text-zinc-700 mb-3" />
          <p className="text-sm text-zinc-400">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.addresses.map((a) => (
            <div key={a._id} className={`bg-noir-card rounded-xl p-5 border ${a.isDefault ? 'border-gold/60' : 'border-zinc-800'}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-zinc-100">{a.fullName}</p>
                {a.isDefault && <span className="text-[10px] uppercase tracking-wider bg-gold/15 text-gold border border-gold/40 rounded-full px-2 py-0.5">Default</span>}
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mt-2">
                {a.addressLine1}
                {a.addressLine2 ? `, ${a.addressLine2}` : ''}
                <br />
                {a.city}, {a.state} – {a.postalCode}
                <br />
                Phone: {a.phone}
              </p>
              <div className="flex flex-wrap gap-3 mt-4 text-xs">
                <button onClick={() => open(a)} className="inline-flex items-center gap-1 text-zinc-300 hover:text-gold"><Pencil className="w-3.5 h-3.5" />Edit</button>
                {!a.isDefault && <button onClick={() => makeDefault(a._id)} className="inline-flex items-center gap-1 text-zinc-300 hover:text-gold"><Star className="w-3.5 h-3.5" />Make default</button>}
                <button onClick={() => remove(a._id)} className="inline-flex items-center gap-1 text-zinc-500 hover:text-red-400 ml-auto"><Trash2 className="w-3.5 h-3.5" />Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {form && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
          <form onSubmit={save} className="bg-noir-card border border-gold/30 rounded-2xl p-6 max-w-lg w-full space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg uppercase tracking-wider text-gold">{editingId ? 'Edit address' : 'New address'}</h3>
              <button type="button" onClick={() => setForm(null)} aria-label="Close"><X className="w-5 h-5 text-zinc-400" /></button>
            </div>
            {error && <Alert>{error}</Alert>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full name" required value={form.fullName} onChange={f('fullName')} />
              <Input label="Mobile" required inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} />
              <Input className="sm:col-span-2" label="House / Flat, Building, Street" required value={form.addressLine1} onChange={f('addressLine1')} />
              <Input className="sm:col-span-2" label="Area / Landmark" value={form.addressLine2} onChange={f('addressLine2')} />
              <Input label="PIN code" required inputMode="numeric" maxLength={6} value={form.postalCode} onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value.replace(/\D/g, '').slice(0, 6) }))} />
              <Input label="City" required value={form.city} onChange={f('city')} />
              <Select className="sm:col-span-2" label="State" required value={form.state} onChange={f('state')}>
                {INDIA_STATES.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </div>
            <label className="flex items-center gap-2 text-xs text-zinc-400">
              <input type="checkbox" className="accent-[#D4AF37]" checked={Boolean(form.isDefault)} onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))} />
              Set as default address
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setForm(null)} className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300">Cancel</button>
              <button type="submit" disabled={saving} className="btn-gold rounded-lg">{saving ? 'Saving…' : 'Save address'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
