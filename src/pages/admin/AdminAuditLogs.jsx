import React, { useState, useEffect } from 'react';
import { FileText, ShieldAlert } from 'lucide-react';
import { adminService } from '../../services/adminService.js';

export const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getAuditLogs({ limit: 50 })
      .then((res) => {
        if (Array.isArray(res)) setLogs(res);
        else if (res?.data) setLogs(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold">
          Administrative Security Audit Logs
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Cryptographically recorded actions, tracking updates, and master catalog modifications
        </p>
      </div>

      <div className="bg-noir-card border border-gold/20 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="py-3 px-4">Action Type</th>
              <th className="py-3 px-4">Admin Email</th>
              <th className="py-3 px-4">Target Resource</th>
              <th className="py-3 px-4">Details Diff / Metadata</th>
              <th className="py-3 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500 font-sans">
                  No administrative operations recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-gold">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-zinc-300 font-sans">
                    {log.adminEmail}
                  </td>
                  <td className="py-3 px-4 text-zinc-400 font-sans">
                    {log.resource} ({log.resourceId})
                  </td>
                  <td className="py-3 px-4 text-zinc-400 font-sans max-w-sm truncate">
                    {JSON.stringify(log.details)}
                  </td>
                  <td className="py-3 px-4 text-zinc-500 font-sans text-[10px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
