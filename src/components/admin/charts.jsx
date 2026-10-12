import React, { useMemo, useState } from 'react';

const fmtK = (n) => {
  const v = Number(n || 0);
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(1)}Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(1)}L`;
  if (v >= 1e3) return `₹${(v / 1e3).toFixed(1)}k`;
  return `₹${Math.round(v)}`;
};

/**
 * Revenue area chart + order bars (dual axis), hover tooltip. Pure SVG, responsive.
 * data: [{ period: '2026-10-01', revenue, orders }]
 */
export const RevenueChart = ({ data = [], height = 260 }) => {
  const [hover, setHover] = useState(null);
  const W = 900;
  const H = height;
  const pad = { l: 56, r: 40, t: 16, b: 34 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const { maxRev, maxOrd, points, ticks } = useMemo(() => {
    const maxR = Math.max(1, ...data.map((d) => d.revenue));
    const niceMax = Math.ceil(maxR / Math.pow(10, Math.floor(Math.log10(maxR)))) * Math.pow(10, Math.floor(Math.log10(maxR)));
    const maxO = Math.max(1, ...data.map((d) => d.orders));
    const step = data.length > 1 ? iw / (data.length - 1) : 0;
    const pts = data.map((d, i) => ({
      ...d,
      x: pad.l + (data.length > 1 ? i * step : iw / 2),
      y: pad.t + ih - (d.revenue / niceMax) * ih,
      barH: (d.orders / maxO) * ih * 0.45,
    }));
    return { maxRev: niceMax, maxOrd: maxO, points: pts, ticks: [0, 0.25, 0.5, 0.75, 1].map((t) => t * niceMax) };
  }, [data, ih, iw, pad.l, pad.t]);

  if (!data.length) return <div className="h-40 flex items-center justify-center text-xs text-zinc-500">No data for this period</div>;

  const line = points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L${points[points.length - 1].x},${pad.t + ih} L${points[0].x},${pad.t + ih} Z`;
  const barW = Math.max(2, Math.min(18, (iw / Math.max(points.length, 1)) * 0.5));
  const labelEvery = Math.ceil(points.length / 10);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Revenue and orders chart">
        <defs>
          <linearGradient id="revFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => {
          const y = pad.t + ih - (t / maxRev) * ih;
          return (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="#27272F" strokeDasharray="3 4" />
              <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#71717A">{fmtK(t)}</text>
            </g>
          );
        })}
        {points.map((p) => (
          <rect key={`b-${p.period}`} x={p.x - barW / 2} y={pad.t + ih - p.barH} width={barW} height={p.barH} rx="2" fill="#3F3F4E" opacity="0.8" />
        ))}
        <path d={area} fill="url(#revFill)" />
        <path d={line} fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) =>
          i % labelEvery === 0 || i === points.length - 1 ? (
            <text key={`l-${p.period}`} x={p.x} y={H - 10} textAnchor="middle" fontSize="11" fill="#71717A">
              {p.period.length > 7 ? new Date(`${p.period}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : p.period}
            </text>
          ) : null
        )}
        <text x={W - pad.r + 6} y={pad.t + 10} fontSize="10" fill="#71717A">orders</text>
        <text x={W - pad.r + 6} y={pad.t + 22} fontSize="10" fill="#A1A1AA">max {maxOrd}</text>
        {hover && (
          <g>
            <line x1={hover.x} x2={hover.x} y1={pad.t} y2={pad.t + ih} stroke="#D4AF37" strokeOpacity="0.4" />
            <circle cx={hover.x} cy={hover.y} r="5" fill="#0B0B0D" stroke="#D4AF37" strokeWidth="2.5" />
          </g>
        )}
        {points.map((p, i) => (
          <rect
            key={`h-${p.period}`}
            x={p.x - (iw / Math.max(points.length, 1)) / 2}
            y={pad.t}
            width={iw / Math.max(points.length, 1)}
            height={ih}
            fill="transparent"
            onMouseEnter={() => setHover({ ...p, i })}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>
      {hover && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full bg-noir border border-gold/40 rounded-lg px-3 py-2 text-xs shadow-xl whitespace-nowrap"
          style={{ left: `${(hover.x / W) * 100}%`, top: `${(hover.y / H) * 100}%` }}
        >
          <p className="text-zinc-400">{hover.period}</p>
          <p className="text-gold font-bold">₹{Number(hover.revenue).toLocaleString('en-IN')}</p>
          <p className="text-zinc-300">{hover.orders} orders · {hover.units ?? 0} units</p>
        </div>
      )}
    </div>
  );
};

/** Horizontal bar list (top products / states / payment mix) */
export const BarList = ({ rows = [], valueKey = 'revenue', labelKey = 'name', format = (v) => `₹${Number(v).toLocaleString('en-IN')}`, sub }) => {
  const max = Math.max(1, ...rows.map((r) => Number(r[valueKey]) || 0));
  if (!rows.length) return <p className="text-xs text-zinc-500 py-6 text-center">No data</p>;
  return (
    <ul className="space-y-2.5">
      {rows.map((r, i) => (
        <li key={`${r[labelKey]}-${i}`}>
          <div className="flex items-baseline justify-between gap-3 text-xs mb-1">
            <span className="text-zinc-200 truncate">{r[labelKey]}</span>
            <span className="text-zinc-100 font-semibold whitespace-nowrap">
              {format(r[valueKey])}
              {sub && <span className="text-zinc-500 font-normal ml-1.5">{sub(r)}</span>}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold" style={{ width: `${(Number(r[valueKey]) / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
};

/** Donut for 2–6 slices */
export const Donut = ({ slices = [], size = 140 }) => {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const r = 52;
  const C = 2 * Math.PI * r;
  let offset = 0;
  const palette = ['#D4AF37', '#0EA5E9', '#22C55E', '#F97316', '#A855F7', '#71717A'];
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox="0 0 140 140" role="img" aria-label="Distribution">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#1B1B22" strokeWidth="18" />
        {slices.map((s, i) => {
          const len = (s.value / total) * C;
          const el = (
            <circle key={s.label} cx="70" cy="70" r={r} fill="none" stroke={palette[i % palette.length]} strokeWidth="18" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} transform="rotate(-90 70 70)" />
          );
          offset += len;
          return el;
        })}
        <text x="70" y="66" textAnchor="middle" fontSize="18" fontWeight="700" fill="#F4F4F5">{slices.reduce((sum, x) => sum + x.value, 0)}</text>
        <text x="70" y="84" textAnchor="middle" fontSize="10" fill="#71717A">total</text>
      </svg>
      <ul className="space-y-1.5 text-xs">
        {slices.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: palette[i % palette.length] }} />
            <span className="text-zinc-300">{s.label}</span>
            <span className="text-zinc-500">{s.value} ({Math.round((s.value / total) * 100)}%)</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Sparkline = ({ values = [], width = 120, height = 32 }) => {
  if (values.length < 2) return null;
  const max = Math.max(1, ...values);
  const step = width / (values.length - 1);
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)},${(height - (v / max) * (height - 4) - 2).toFixed(1)}`).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={d} fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
