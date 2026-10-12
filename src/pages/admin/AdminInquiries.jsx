import React, { useEffect, useState } from 'react';
import { Inbox, Loader2, Mail, Phone } from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { Pill } from '../../components/ui/StatusBadge.jsx';
import { Alert } from '../../components/ui/Field.jsx';

const STATUSES = ['', 'pending', 'in_progress', 'resolved'];

export const AdminInquiries = () => {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    adminService
      .getInquiries({ status: status || undefined, limit: 100 })
      .then((res) => setRows(res.data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, [status]);

  const update = async (id, newStatus) => {
    try {
      await adminService.updateInquiry(id, { status: newStatus });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold flex items-center gap-3"><Inbox className="w-6 h-6 text-gold" />Customer Messages</h1>
        <p className="text-xs text-zinc-400 mt-1">Enquiries submitted from the Contact Us page.</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <button key={s || 'all'} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded-full text-xs border ${status === s ? 'bg-gold text-black border-gold font-semibold' : 'border-zinc-800 text-zinc-400'}`}>
            {s ? s.replace('_', ' ') : 'All'}
          </button>
        ))}
      </div>
      {error && <Alert>{error}</Alert>}
      {loading ? (
        <div className="py-10 text-center"><Loader2 className="w-5 h-5 animate-spin text-gold inline" /></div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-zinc-500 py-10 text-center">No messages.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((m) => (
            <article key={m._id} className="bg-noir-card border border-zinc-800 rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">{m.subject}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {m.name} · <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="text-gold inline-flex items-center gap-1"><Mail className="w-3 h-3" />{m.email}</a>
                    {m.phone && <> · <a href={`tel:${m.phone}`} className="text-gold inline-flex items-center gap-1"><Phone className="w-3 h-3" />{m.phone}</a></>}
                    {m.orderNumber && <> · Order <span className="font-mono">{m.orderNumber}</span></>}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Pill tone={m.status === 'pending' ? 'amber' : m.status === 'resolved' ? 'emerald' : 'blue'}>{(m.status || 'pending').replace('_', ' ')}</Pill>
                  <select value={m.status || 'pending'} onChange={(e) => update(m._id, e.target.value)} className="bg-noir border border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-200">
                    {STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>
              <p className="text-sm text-zinc-300 mt-3 whitespace-pre-line">{m.message}</p>
              <p className="text-[10px] text-zinc-600 mt-3">{new Date(m.createdAt).toLocaleString('en-IN')}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
