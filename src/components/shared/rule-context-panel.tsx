import { StatusBadge } from '@/components/ui/status-badge';

export function RuleContextPanel({
  title,
  rules
}: {
  title: string;
  rules: Array<{ name: string; detail: string }>;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-medium text-slate-900">{title}</h2>
        <StatusBadge label="v0 mock 规则 / v0 mock rules" tone="warning" />
      </div>
      <div className="mt-4 space-y-3">
        {rules.map((rule) => (
          <div key={rule.name} className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
            <div className="font-medium text-slate-900">{rule.name}</div>
            <p className="mt-1">{rule.detail}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
