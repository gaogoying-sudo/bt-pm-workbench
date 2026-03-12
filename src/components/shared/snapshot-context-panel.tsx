import { StatusBadge } from '@/components/ui/status-badge';
import { SnapshotContext } from '@/lib/types/snapshot';

export function SnapshotContextPanel({
  title,
  context
}: {
  title: string;
  context: SnapshotContext;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-medium text-slate-900">{title}</h2>
        <StatusBadge label={context.timelineLabel} tone="muted" />
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm text-slate-700">
        <div className="rounded-md bg-slate-50 p-3">
          <div className="text-xs uppercase tracking-wide text-slate-500">当前快照日期 / Snapshot Date</div>
          <div className="mt-2 font-medium text-slate-900">{context.snapshotDate}</div>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <div className="text-xs uppercase tracking-wide text-slate-500">基线日期 / Baseline Date</div>
          <div className="mt-2 font-medium text-slate-900">{context.baselineDate ?? '-'}</div>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <div className="text-xs uppercase tracking-wide text-slate-500">对比口径 / Comparison Basis</div>
          <div className="mt-2">{context.compareDate ?? '-'}</div>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600">{context.comparisonBasis}</p>
      {context.notes ? <p className="mt-1 text-xs text-slate-500">{context.notes}</p> : null}
    </article>
  );
}
