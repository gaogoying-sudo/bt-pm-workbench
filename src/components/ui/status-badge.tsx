import { ReactNode } from 'react';

type StatusTone = 'default' | 'success' | 'warning' | 'danger' | 'muted';

const toneClass: Record<StatusTone, string> = {
  default: 'border-blue-200/70 bg-blue-50 text-blue-700',
  success: 'border-emerald-200/70 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200/70 bg-amber-50 text-amber-800',
  danger: 'border-rose-200/70 bg-rose-50 text-rose-700',
  muted: 'border-slate-200/70 bg-slate-50 text-slate-700'
};

export function StatusBadge({ label, tone = 'default' }: { label: ReactNode; tone?: StatusTone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm shadow-slate-900/5 ${toneClass[tone]}`}
    >
      {label}
    </span>
  );
}
