import React from 'react';

const base =
  'w-full bg-noir border border-zinc-800 rounded-lg px-3 py-2.5 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

export const Label = ({ children, required, htmlFor, hint }) => (
  <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-2 mb-1.5">
    <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
      {children}
      {required && <span className="text-gold ml-0.5">*</span>}
    </span>
    {hint && <span className="text-[10px] text-zinc-500 normal-case tracking-normal">{hint}</span>}
  </label>
);

export const FieldError = ({ children }) => (children ? <p className="mt-1 text-[11px] text-red-400">{children}</p> : null);

export const Input = ({ label, required, error, hint, id, className = '', ...props }) => {
  const fid = id || props.name;
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={fid} required={required} hint={hint}>
          {label}
        </Label>
      )}
      <input id={fid} required={required} className={`${base} ${error ? 'border-red-500/60' : ''}`} {...props} />
      <FieldError>{error}</FieldError>
    </div>
  );
};

export const Select = ({ label, required, error, hint, id, className = '', children, ...props }) => {
  const fid = id || props.name;
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={fid} required={required} hint={hint}>
          {label}
        </Label>
      )}
      <select id={fid} required={required} className={`${base} appearance-none bg-[length:12px] pr-8`} {...props}>
        {children}
      </select>
      <FieldError>{error}</FieldError>
    </div>
  );
};

export const Textarea = ({ label, required, error, hint, id, className = '', ...props }) => {
  const fid = id || props.name;
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={fid} required={required} hint={hint}>
          {label}
        </Label>
      )}
      <textarea id={fid} required={required} className={`${base} leading-relaxed`} {...props} />
      <FieldError>{error}</FieldError>
    </div>
  );
};

export const Card = ({ children, className = '', title, icon: Icon, action }) => (
  <section className={`bg-noir-card border border-gold/15 rounded-xl ${className}`}>
    {title && (
      <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800/80">
        <h2 className="flex items-center gap-2 font-serif text-[13px] uppercase tracking-[0.18em] text-gold font-semibold">
          {Icon && <Icon className="w-4 h-4" />}
          {title}
        </h2>
        {action}
      </header>
    )}
    <div className={title ? 'p-5' : ''}>{children}</div>
  </section>
);

export const Alert = ({ tone = 'error', children, className = '' }) => {
  const tones = {
    error: 'bg-red-500/10 border-red-500/30 text-red-300',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    info: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
    warn: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  };
  return <div className={`px-4 py-3 rounded-lg border text-xs leading-relaxed ${tones[tone]} ${className}`}>{children}</div>;
};

export const Spinner = ({ className = 'w-5 h-5' }) => (
  <span className={`inline-block ${className} border-2 border-gold border-t-transparent rounded-full animate-spin`} aria-hidden="true" />
);

export const PageLoader = ({ label = 'Loading…' }) => (
  <div className="py-24 flex flex-col items-center gap-4 text-gold">
    <Spinner className="w-10 h-10" />
    <p className="font-serif text-xs uppercase tracking-widest">{label}</p>
  </div>
);
