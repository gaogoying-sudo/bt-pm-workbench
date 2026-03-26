'use client';

import { useEffect, useMemo, useState } from 'react';
import { InfoCard } from '@/components/ui/info-card';
import { StatusBadge } from '@/components/ui/status-badge';
import Link from 'next/link';

async function getJson(path: string) {
  const res = await fetch(path);
  return res.json();
}

async function postJson(path: string, body: any) {
  const res = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  return res.json();
}

export function DataExchangeWorkbench() {
  const [meta, setMeta] = useState<any>(null);
  const [importJobs, setImportJobs] = useState<any[]>([]);
  const [exportJobs, setExportJobs] = useState<any[]>([]);
  const [rawJson, setRawJson] = useState('{\n  \"projectId\": \"project-pm-workbench\",\n  \"projectCode\": \"PMW\",\n  \"projectName\": \"PM-WORKBENCH\",\n  \"snapshotDate\": \"2026-03-25\",\n  \"readinessLevel\": \"ready\",\n  \"externalProjectId\": \"SUP-10001\"\n}');
  const [busy, setBusy] = useState(false);
  const [lastPreview, setLastPreview] = useState<any>(null);

  const projectIdForReturnLink = useMemo(() => {
    try {
      const parsed = JSON.parse(rawJson);
      return parsed?.projectId ?? null;
    } catch {
      return null;
    }
  }, [rawJson]);

  async function refresh() {
    const m = await getJson('/api/data-exchange');
    const ij = await getJson('/api/data-exchange/import/jobs');
    const ej = await getJson('/api/data-exchange/export/jobs');
    setMeta(m?.data ?? null);
    setImportJobs(ij?.data ?? []);
    setExportJobs(ej?.data ?? []);
  }

  useEffect(() => {
    refresh();
  }, []);

  const systems = meta?.externalSystems ?? [];
  const contracts = meta?.integrationContracts ?? [];
  const supplyContract = contracts.find((c: any) => c.id === 'contract-supply-readiness') ?? contracts[0];
  const mgmtContract = contracts.find((c: any) => c.id === 'contract-mgmt-summary') ?? contracts[0];

  async function previewImport() {
    setBusy(true);
    try {
      const parsed = JSON.parse(rawJson);
      const result = await postJson('/api/data-exchange/import/preview', {
        externalSystemId: supplyContract?.systemId ?? 'ext-supply',
        contractId: supplyContract?.id ?? 'contract-supply-readiness',
        createdByPersonId: 'person-alice',
        rawJson: parsed
      });
      setLastPreview(result?.data ?? null);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function applyImport(jobId: string) {
    setBusy(true);
    try {
      await postJson('/api/data-exchange/import/apply', { jobId });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function generateExport(contractId: string, systemId: string) {
    setBusy(true);
    try {
      const result = await postJson('/api/data-exchange/export/generate', {
        externalSystemId: systemId,
        contractId,
        createdByPersonId: 'person-alice'
      });
      const bundleId = result?.data?.bundle?.id;
      if (bundleId) {
        const bundle = await getJson(`/api/data-exchange/export/bundles/${bundleId}`);
        const dataStr = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bundle?.data ?? {}, null, 2));
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = `${bundleId}.json`;
        a.click();
      }
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <InfoCard title="Import jobs" value={importJobs.length} />
        <InfoCard title="Export jobs" value={exportJobs.length} />
        <InfoCard title="Bindings" value={meta?.counts?.bindings ?? 0} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-medium text-slate-900">Import Preview / 导入预览（JSON）</h2>
          <button className="rounded-md border border-slate-200 px-3 py-1.5 text-sm" disabled={busy} onClick={refresh}>
            Refresh
          </button>
        </div>
        <p className="mt-1 text-sm text-slate-500">先 preview，再 apply。包含 required fields 校验与 mapping 骨架。</p>
        <textarea className="mt-3 w-full min-h-[180px] rounded-md border border-slate-300 px-3 py-2 text-sm font-mono" value={rawJson} onChange={(e) => setRawJson(e.target.value)} />
        <div className="mt-3 flex items-center gap-2">
          <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50" disabled={busy} onClick={previewImport}>
            Preview
          </button>
          {lastPreview?.job?.id ? (
            <button className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white disabled:opacity-50" disabled={busy} onClick={() => applyImport(lastPreview.job.id)}>
              Apply (job: {lastPreview.job.id})
            </button>
          ) : null}
        </div>
        {lastPreview?.preview ? (
          <div className="mt-3 rounded-md border border-slate-200 p-3 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <div className="font-medium">Validation</div>
              <StatusBadge label={lastPreview.preview.validation.valid ? 'valid' : 'invalid'} tone={lastPreview.preview.validation.valid ? 'success' : 'danger'} />
            </div>
            {lastPreview.preview.validation.errors?.length ? (
              <ul className="mt-2 list-disc pl-5 text-xs text-rose-700">
                {lastPreview.preview.validation.errors.map((e: string) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-slate-500">{lastPreview.preview.previewSummary}</p>
            )}
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Export Bundle / 导出包</h2>
        <p className="mt-1 text-sm text-slate-500">生成 export bundle（JSON 下载），带 audit/job 记录。</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50" disabled={busy} onClick={() => generateExport('contract-supply-readiness', 'ext-archive')}>
            Export Supply Readiness
          </button>
          <button className="rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50" disabled={busy} onClick={() => generateExport('contract-mgmt-summary', 'ext-archive')}>
            Export Mgmt Summary
          </button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Import history</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {importJobs.slice(0, 8).map((j) => (
              <div key={j.id} className="rounded-md border border-slate-200 p-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{j.id}</span>
                  <StatusBadge label={j.status} tone={j.status === 'applied' ? 'success' : j.status === 'rejected' ? 'danger' : 'muted'} />
                </div>
                <div className="mt-1 text-xs text-slate-500">{j.contractId} · {j.externalSystemId}</div>
              </div>
            ))}
            {importJobs.length === 0 ? <p className="text-sm text-slate-500">No import jobs yet.</p> : null}
          </div>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Export history</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {exportJobs.slice(0, 8).map((j) => (
              <div key={j.id} className="rounded-md border border-slate-200 p-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{j.id}</span>
                  <StatusBadge label={j.status} tone={j.status === 'exported' ? 'success' : j.status.includes('failed') ? 'danger' : 'muted'} />
                </div>
                <div className="mt-1 text-xs text-slate-500">{j.contractId} · bundle {j.bundleId ?? '-'}</div>
              </div>
            ))}
            {exportJobs.length === 0 ? <p className="text-sm text-slate-500">No export jobs yet.</p> : null}
          </div>
        </article>
      </section>

      {projectIdForReturnLink ? (
        <section className="mt-2 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-slate-600">结果回看</div>
            <div className="flex flex-wrap gap-3">
              <Link className="text-blue-700" href={`/projects/${projectIdForReturnLink}`}>
                去项目 / Project
              </Link>
              <Link className="text-blue-700" href={`/projects/${projectIdForReturnLink}/version`}>
                去版本治理 / Version
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

