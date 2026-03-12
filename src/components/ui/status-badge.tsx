import { ReactNode } from 'react';

type StatusTone = 'default' | 'success' | 'warning' | 'danger' | 'muted';

const toneClass: Record<StatusTone, string> = {
  default: 'bg-blue-100 text-blue-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
  muted: 'bg-slate-100 text-slate-700'
};

export function StatusBadge({ label, tone = 'default' }: { label: ReactNode; tone?: StatusTone }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${toneClass[tone]}`}>{label}</span>;
}
