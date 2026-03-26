export function InfoCard({ title, value, hint }: { title: string; value: string | number; hint?: string }) {
  return (
    <article className="pmw-surface p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 drop-shadow-sm">{value}</p>
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </article>
  );
}
