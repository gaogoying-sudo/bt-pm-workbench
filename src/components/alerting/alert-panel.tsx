'use client';

import { useEffect, useMemo, useState } from 'react';
import { StatusBadge } from '@/components/ui/status-badge';
import { InfoCard } from '@/components/ui/info-card';
import { useCurrentUser } from '@/components/identity/current-user-provider';

function toneForSeverity(sev: string) {
  if (sev === 'critical') return 'danger';
  if (sev === 'warning') return 'warning';
  return 'muted';
}

async function postJson(path: string, body: any) {
  const res = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  return res.json();
}

export function AlertPanel(props: { scope: 'portfolio' | 'project' | 'version'; scopeId?: string | null; title?: string }) {
  const { context } = useCurrentUser();
  const actorPersonId = context.userId;
  const scopeId = props.scopeId ?? null;

  const [pack, setPack] = useState<any>(null);
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    const qs = new URLSearchParams({ scope: props.scope, ...(scopeId ? { scopeId } : {}) });
    Promise.all([
      fetch(`/api/alerting?${qs.toString()}`).then((r) => r.json()),
      fetch(`/api/recommendations?${qs.toString()}`).then((r) => r.json())
    ])
      .then(([a, b]) => {
        setPack(a?.data ?? null);
        setRecs(b?.data ?? []);
      })
      .catch(() => {
        setPack(null);
        setRecs([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.scope, scopeId]);

  const alerts = pack?.alerts ?? [];
  const critical = alerts.filter((a: any) => a.severity === 'critical' && a.status !== 'resolved');
  const open = alerts.filter((a: any) => a.status === 'new' || a.status === 'acknowledged' || a.status === 'snoozed' || a.status === 'in-progress');

  const topAlerts = useMemo(() => {
    const rank = (a: any) => (a.severity === 'critical' ? 0 : a.severity === 'warning' ? 1 : 2);
    return [...alerts].sort((a: any, b: any) => rank(a) - rank(b)).slice(0, 6);
  }, [alerts]);

  const triageAlert = async (alertId: string, action: 'ack' | 'dismiss' | 'snooze' | 'resolve') => {
    await postJson('/api/alerting/triage', { alertId, action, actorPersonId });
    load();
  };
  const triageRec = async (recommendationId: string, action: 'ack' | 'dismiss' | 'snooze' | 'start' | 'done') => {
    await postJson('/api/recommendations/triage', { recommendationId, action, actorPersonId });
    load();
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-medium text-slate-900">{props.title ?? '主动预警与建议 / Proactive Alerts & Recommendations'}</h2>
          <p className="text-sm text-slate-500">v0 rule-based alerts/forecasts with explanation & triage states.</p>
        </div>
        <button type="button" onClick={load} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <InfoCard title="Open alerts" value={open.length} />
        <InfoCard title="Critical alerts" value={critical.length} />
        <InfoCard title="Recommendations" value={recs.length} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="rounded-md border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div className="font-medium text-slate-900">Alerts</div>
            <StatusBadge label={`${topAlerts.length}`} tone="muted" />
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {topAlerts.map((a: any) => (
              <div key={a.id} className="rounded-md border border-slate-200 p-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium text-slate-900">{a.title}</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge label={a.severity} tone={toneForSeverity(a.severity)} />
                    <StatusBadge label={a.status} tone="muted" />
                  </div>
                </div>
                <div className="mt-1 text-xs text-slate-500">{a.summary}</div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-slate-600">Why / Evidence</summary>
                  <div className="mt-2 space-y-1 text-xs text-slate-600">
                    <div className="rounded bg-slate-50 p-2">{a.why}</div>
                    <ul className="list-disc pl-5">
                      {(a.evidence ?? []).slice(0, 8).map((e: any) => (
                        <li key={`${e.kind}-${e.refId}`}>{e.kind}: {e.label}</li>
                      ))}
                    </ul>
                  </div>
                </details>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button className="rounded-md border border-slate-300 px-2 py-1 text-xs" onClick={() => triageAlert(a.id, 'ack')}>Ack</button>
                  <button className="rounded-md border border-slate-300 px-2 py-1 text-xs" onClick={() => triageAlert(a.id, 'snooze')}>Snooze</button>
                  <button className="rounded-md border border-slate-300 px-2 py-1 text-xs" onClick={() => triageAlert(a.id, 'dismiss')}>Dismiss</button>
                  <button className="rounded-md border border-slate-300 px-2 py-1 text-xs" onClick={() => triageAlert(a.id, 'resolve')}>Resolve</button>
                </div>
              </div>
            ))}
            {topAlerts.length === 0 ? <p className="text-sm text-slate-500">No alerts.</p> : null}
          </div>
        </article>

        <article className="rounded-md border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div className="font-medium text-slate-900">Recommendations</div>
            <StatusBadge label={`${recs.length}`} tone="muted" />
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {recs.slice(0, 6).map((r: any) => (
              <div key={r.id} className="rounded-md border border-slate-200 p-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium text-slate-900">{r.title}</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge label={r.priority} tone={r.priority === 'p0' ? 'danger' : r.priority === 'p1' ? 'warning' : 'muted'} />
                    <StatusBadge label={r.status} tone="muted" />
                  </div>
                </div>
                <div className="mt-1 text-xs text-slate-500">{r.reason?.summary}</div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-slate-600">Why / Evidence</summary>
                  <div className="mt-2 space-y-1 text-xs text-slate-600">
                    <ul className="list-disc pl-5">
                      {(r.reason?.evidence ?? []).slice(0, 8).map((e: any) => (
                        <li key={`${e.kind}-${e.refId}`}>{e.kind}: {e.label}</li>
                      ))}
                    </ul>
                  </div>
                </details>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button className="rounded-md border border-slate-300 px-2 py-1 text-xs" onClick={() => triageRec(r.id, 'ack')}>Ack</button>
                  <button className="rounded-md border border-slate-300 px-2 py-1 text-xs" onClick={() => triageRec(r.id, 'start')}>Start</button>
                  <button className="rounded-md border border-slate-300 px-2 py-1 text-xs" onClick={() => triageRec(r.id, 'done')}>Done</button>
                  <button className="rounded-md border border-slate-300 px-2 py-1 text-xs" onClick={() => triageRec(r.id, 'snooze')}>Snooze</button>
                  <button className="rounded-md border border-slate-300 px-2 py-1 text-xs" onClick={() => triageRec(r.id, 'dismiss')}>Dismiss</button>
                </div>
              </div>
            ))}
            {recs.length === 0 ? <p className="text-sm text-slate-500">No recommendations.</p> : null}
          </div>
        </article>
      </div>
    </section>
  );
}

