'use client';

import { useEffect, useMemo, useState } from 'react';
import { StatusBadge } from '@/components/ui/status-badge';
import { InfoCard } from '@/components/ui/info-card';
import Link from 'next/link';

async function getJson(path: string) {
  const res = await fetch(path);
  return res.json();
}

export function CloseoutWorkbench() {
  const [pack, setPack] = useState<any>(null);
  useEffect(() => {
    getJson('/api/closeout')
      .then((j) => setPack(j?.data ?? null))
      .catch(() => setPack(null));
  }, []);

  const checklist = pack?.checklist;
  const rr = pack?.releaseReadiness;
  const gaps = pack?.criticalGaps ?? [];
  const walkthroughs = pack?.roleWalkthroughs ?? [];
  const demo = pack?.demoReadiness;

  const stats = useMemo(() => {
    const criteria = checklist?.criteria ?? [];
    const pass = criteria.filter((c: any) => c.status === 'pass').length;
    const fail = criteria.filter((c: any) => c.status === 'fail').length;
    const caveat = criteria.filter((c: any) => c.status === 'caveat').length;
    return { pass, fail, caveat, total: criteria.length };
  }, [checklist]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <InfoCard title="Criteria passed" value={`${stats.pass}/${stats.total}`} />
        <InfoCard title="Criteria caveats" value={stats.caveat} />
        <InfoCard title="Criteria failed" value={stats.fail} />
        <InfoCard title="Known gaps" value={gaps.length} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Release readiness / 发布就绪</h2>
        <div className="mt-3 flex items-center gap-3">
          <StatusBadge label={rr?.status ?? '-'} tone={rr?.status === 'ready' ? 'success' : rr?.status === 'blocked' ? 'danger' : 'warning'} />
          <span className="text-sm text-slate-700">{rr?.summary ?? '-'}</span>
        </div>
        {rr?.caveats?.length ? (
          <ul className="mt-3 list-disc pl-5 text-sm text-slate-600">
            {rr.caveats.map((c: string) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Final acceptance checklist / 最终验收清单</h2>
        <div className="mt-3 space-y-2">
          {(checklist?.criteria ?? []).map((c: any) => (
            <div key={c.id} className="rounded-md border border-slate-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium text-slate-900">{c.title}</div>
                <StatusBadge label={c.status} tone={c.status === 'pass' ? 'success' : c.status === 'fail' ? 'danger' : 'warning'} />
              </div>
              <p className="mt-1 text-sm text-slate-700">{c.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(c.evidence ?? []).slice(0, 6).map((e: string) => (
                  <span key={e} className="rounded bg-slate-50 px-2 py-1 text-xs text-slate-600">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Management review path / 管理评审路径</h2>
        <p className="mt-1 text-sm text-slate-500">按角色走查路线（可直接点击）。</p>
        <div className="mt-3 space-y-3">
          {walkthroughs.map((w: any) => (
            <div key={w.id} className="rounded-md border border-slate-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium text-slate-900">{w.role}</div>
                <span className="text-xs text-slate-500">{w.goal}</span>
              </div>
              <ol className="mt-2 list-decimal pl-5 text-sm text-slate-700">
                {w.steps.map((s: any) => (
                  <li key={s.path} className="mt-1">
                    <Link href={s.path} className="text-blue-700">
                      {s.label} → {s.path}
                    </Link>
                    <div className="text-xs text-slate-500">{s.expected}</div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Demo readiness / 演示就绪</h2>
        <div className="mt-3 flex items-center gap-2">
          <StatusBadge label={demo?.status ?? '-'} tone={demo?.status === 'ready' ? 'success' : demo?.status === 'blocked' ? 'danger' : 'warning'} />
          <span className="text-sm text-slate-700">mode: {demo?.demoDataMode ?? '-'}</span>
        </div>
        <ul className="mt-3 list-disc pl-5 text-sm text-slate-600">
          {(demo?.resetSteps ?? []).map((s: string) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Known gaps / 已知缺口</h2>
        {gaps.length === 0 ? <p className="mt-2 text-sm text-slate-500">None.</p> : null}
        <div className="mt-3 space-y-2">
          {gaps.map((g: any) => (
            <div key={g.id} className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium text-slate-900">{g.title}</div>
                <StatusBadge label={g.disposition} tone={g.disposition === 'must-fix' ? 'danger' : g.disposition === 'accepted' ? 'success' : 'warning'} />
              </div>
              <div className="mt-1 text-xs text-slate-500">{g.severity} · {g.status} · owner: {g.owner}</div>
              <p className="mt-2 text-xs text-slate-600">{g.notes}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

