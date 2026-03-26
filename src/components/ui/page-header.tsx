function splitZhEn(text: string): { zh: string; en: string | null } {
  const separators = [' / ', '｜', ' | ', ' - '];
  for (const sep of separators) {
    if (text.includes(sep)) {
      const [left, ...rest] = text.split(sep);
      const right = rest.join(sep).trim();
      const zh = left.trim();
      const en = right.length > 0 ? right : null;
      return { zh, en };
    }
  }
  return { zh: text, en: null };
}

export function PageHeader({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  const t = splitZhEn(title);
  const d = splitZhEn(description);
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="pmw-title text-2xl font-semibold text-slate-900">{t.zh}</h1>
          {t.en ? <span className="pmw-subtitle text-xs font-medium">{t.en}</span> : null}
        </div>
        <div className="mt-1">
          <p className="text-sm text-slate-600">{d.zh}</p>
          {d.en ? <p className="mt-0.5 text-xs text-slate-400">{d.en}</p> : null}
        </div>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
