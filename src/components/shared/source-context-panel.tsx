import { StatusBadge } from '@/components/ui/status-badge';

export function SourceContextPanel({
  title,
  description,
  sources
}: {
  title: string;
  description?: string;
  sources: Array<{ name: string; detail: string }>;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-medium text-slate-900">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
        <StatusBadge label={`${sources.length} 项 / sources`} tone="muted" />
      </div>
      <div className="mt-4 space-y-3">
        {sources.map((source) => (
          <div key={source.name} className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
            <div className="font-medium text-slate-900">{source.name}</div>
            <p className="mt-1">{source.detail}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
