'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/status-badge';
import { InfoCard } from '@/components/ui/info-card';
import { SnapshotContextPanel } from '@/components/shared/snapshot-context-panel';
import { buildSnapshotContext } from '@/lib/snapshots/snapshot-helpers';

type Draft = any;

async function postJson(path: string, body: any) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function patchJson(path: string, body: any) {
  const res = await fetch(path, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function getJson(path: string) {
  const res = await fetch(path);
  return res.json();
}

export function InputInboxWorkbench() {
  const [rawText, setRawText] = useState('');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [confirmed, setConfirmed] = useState<any[]>([]);
  const [writebacks, setWritebacks] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [template, setTemplate] = useState<'free' | 'weekly-sync' | 'release-review'>('free');

  const snapshotContext = useMemo(
    () =>
      buildSnapshotContext({
        notes: '输入事件层的时间口径：事件确认后写回影响聚合与快照；当前存储为本地轻量 persistence。'
      }),
    []
  );

  async function refresh() {
    const data = await getJson('/api/input-events/confirm');
    setDrafts(data?.data?.queue ?? []);
    setConfirmed(data?.data?.confirmed ?? []);
    setWritebacks(data?.data?.writebacks ?? []);
  }

  useEffect(() => {
    refresh();
  }, []);

  const projectIdForReturnLink = useMemo(() => {
    const firstWithProjectId = confirmed.find((evt) => typeof evt?.payload?.projectId === 'string' && (evt.payload.projectId as string).trim());
    return firstWithProjectId?.payload?.projectId ?? null;
  }, [confirmed]);

  async function capture() {
    if (!rawText.trim()) return;
    setBusy(true);
    try {
      await postJson('/api/input-events/raw', { rawText, sourceType: 'free-text' });
      setRawText('');
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function updateDraftPayload(draftId: string, patch: any) {
    setBusy(true);
    try {
      await patchJson('/api/input-events/drafts', { id: draftId, patch: { payload: { ...patch } } });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function confirmDraft(draftId: string, patch?: any) {
    setBusy(true);
    try {
      await postJson('/api/input-events/confirm', { draftId, action: 'confirm', patch, applyWriteback: true });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function rejectDraft(draftId: string) {
    setBusy(true);
    try {
      await postJson('/api/input-events/confirm', { draftId, action: 'reject', reason: 'Rejected by user' });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Quick Capture / 快速输入</h2>
        <p className="mt-1 text-sm text-slate-500">输入原文会先进入 raw，再生成 draft，必须人工确认后才写回。</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-xs text-slate-500">
            Template / 场景模板
            <select
              className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
              value={template}
              onChange={(e) => {
                const v = e.target.value as any;
                setTemplate(v);
                if (v === 'weekly-sync') {
                  setRawText('【Weekly Sync】pm-workbench 进度 +10%，阻塞：联调延期；风险：高；需要 followup：补齐 external mapping');
                }
                if (v === 'release-review') {
                  setRawText('【Release Review】version-pmw-r2 结论：GO；门禁：passed；待办：补齐质量检查 owner 与截止时间');
                }
              }}
            >
              <option value="free">Free text</option>
              <option value="weekly-sync">场景A：进展例会</option>
              <option value="release-review">场景B：发布评审</option>
            </select>
          </label>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <textarea
            className="min-h-[90px] w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="例如：PM-WORKBENCH 进度 +10% 已完成聚合 API；或：project-pm-workbench 风险：联调延期"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button
              className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50"
              disabled={busy || !rawText.trim()}
              onClick={capture}
            >
              Capture → Draft
            </button>
            <button className="rounded-md border border-slate-300 px-3 py-2 text-sm" disabled={busy} onClick={refresh}>
              Refresh
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <InfoCard title="待确认 / Awaiting" value={drafts.length} />
        <InfoCard title="已确认 / Confirmed (recent)" value={confirmed.length} />
        <InfoCard title="写回记录 / Writebacks (recent)" value={writebacks.length} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Confirmation Queue / 确认队列</h2>
        <div className="mt-4 space-y-4">
          {drafts.length === 0 ? <p className="text-sm text-slate-500">暂无待确认草稿。</p> : null}
          {drafts.map((d) => (
            <article key={d.id} className="rounded-md border border-slate-200 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-medium text-slate-900">{d.parsedIntent?.eventType}</div>
                <div className="flex items-center gap-2">
                  <StatusBadge label={d.status} tone="muted" />
                  <StatusBadge label={`conf ${Math.round((d.parsedIntent?.confidence ?? 0) * 100)}%`} tone="default" />
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{d.payload?.comment ?? d.payload?.notes ?? d.payload?.summary ?? ''}</p>
              {d.warnings?.length ? (
                <ul className="mt-2 list-disc pl-5 text-xs text-amber-700">
                  {d.warnings.map((w: string, idx: number) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-3 grid gap-2 md:grid-cols-3">
                <label className="text-xs text-slate-500">
                  projectId
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                    value={d.payload?.projectId ?? ''}
                    onChange={(e) => updateDraftPayload(d.id, { ...d.payload, projectId: e.target.value })}
                    placeholder="project-pm-workbench"
                  />
                </label>
                <label className="text-xs text-slate-500">
                  versionId (manpower)
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                    value={d.payload?.versionId ?? ''}
                    onChange={(e) => updateDraftPayload(d.id, { ...d.payload, versionId: e.target.value })}
                    placeholder="version-pmw-0.1"
                  />
                </label>
                <label className="text-xs text-slate-500">
                  progressDelta (%)
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                    value={typeof d.payload?.progressDelta === 'number' ? Math.round(d.payload.progressDelta * 100) : ''}
                    onChange={(e) =>
                      updateDraftPayload(d.id, { ...d.payload, progressDelta: Number(e.target.value || 0) / 100 })
                    }
                    placeholder="10"
                  />
                </label>
              </div>

              {d.payload?.eventType === 'decision-note' ? (
                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  <label className="text-xs text-slate-500">
                    decisionType
                    <select
                      className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                      value={d.payload?.decisionType ?? 'general'}
                      onChange={(e) => updateDraftPayload(d.id, { ...d.payload, decisionType: e.target.value })}
                    >
                      <option value="general">general</option>
                      <option value="weekly-sync">weekly-sync</option>
                      <option value="release-review">release-review</option>
                    </select>
                  </label>
                  <label className="text-xs text-slate-500">
                    linkedVersionId
                    <input
                      className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                      value={d.payload?.linkedVersionId ?? ''}
                      onChange={(e) => updateDraftPayload(d.id, { ...d.payload, linkedVersionId: e.target.value })}
                      placeholder="version-pmw-r2"
                    />
                  </label>
                  <label className="text-xs text-slate-500">
                    releaseDecision
                    <select
                      className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                      value={d.payload?.releaseDecision ?? ''}
                      onChange={(e) => updateDraftPayload(d.id, { ...d.payload, releaseDecision: e.target.value })}
                    >
                      <option value="">-</option>
                      <option value="go">go</option>
                      <option value="no-go">no-go</option>
                      <option value="defer">defer</option>
                    </select>
                  </label>
                </div>
              ) : null}

              <div className="mt-3 flex items-center gap-2">
                <button
                  className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                  disabled={busy}
                  onClick={() => confirmDraft(d.id)}
                >
                  Confirm + Writeback
                </button>
                <button className="rounded-md bg-rose-600 px-3 py-2 text-sm text-white disabled:opacity-50" disabled={busy} onClick={() => rejectDraft(d.id)}>
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Recent Confirmed Events / 最近确认事件</h2>
          <div className="mt-3 space-y-2 text-sm">
            {(confirmed ?? []).slice(0, 10).map((e) => (
              <div key={e.id} className="rounded-md border border-slate-200 p-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{e.eventType}</span>
                  <StatusBadge label={e.status} tone="muted" />
                </div>
                <div className="mt-1 text-xs text-slate-500">{e.confirmedAt}</div>
              </div>
            ))}
          </div>
        </article>
        <SnapshotContextPanel title="快照口径 / Snapshot Context" context={snapshotContext} />
      </section>

      {projectIdForReturnLink ? (
        <section className="mt-2 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-slate-600">确认写回后回到哪里</div>
            <div className="flex flex-wrap gap-3">
              <Link className="text-blue-700" href={`/projects/${projectIdForReturnLink}`}>
                去项目 / Project
              </Link>
              <Link className="text-blue-700" href="/executive-dashboard">
                去驾驶舱 / Dashboard
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

