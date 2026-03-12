'use client';

import { useEffect, useMemo, useState } from 'react';
import { releaseWindowRecords } from '@/data/version-governance/release-window-records';
import { PageHeader } from '@/components/ui/page-header';
import { InfoCard } from '@/components/ui/info-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { RuleContextPanel } from '@/components/shared/rule-context-panel';
import { SnapshotContextPanel } from '@/components/shared/snapshot-context-panel';
import { SourceContextPanel } from '@/components/shared/source-context-panel';
import { buildVersionGovernanceRecords } from '@/lib/version-governance/version-governance-builders';
import { commonViewModes } from '@/lib/view-config/filter-options';
import { fieldLabel } from '@/lib/view-config/label-maps';
import { formatBilingualLabel } from '@/lib/view-config/bilingual-label-builders';
import { mapRiskTone } from '@/lib/view-config/tone-mappers';
import { releaseStatusLabels, signalSeverityLabels } from '@/lib/view-config/status-labels';

const percentFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export function VersionGovernanceWorkbench() {
  const governance = useMemo(() => buildVersionGovernanceRecords(), []);
  const [selectedVersionId, setSelectedVersionId] = useState(governance.records[0]?.linkedVersionId ?? '');
  const [selectedRisk, setSelectedRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'on-track' | 'watching' | 'blocked' | 'ready-to-release'>('all');
  const [viewMode, setViewMode] = useState<(typeof commonViewModes.governance)[number]>(commonViewModes.governance[0]);

  const filteredRecords = governance.records.filter((record) => {
    if (selectedStatus !== 'all' && record.governanceStatus !== selectedStatus) return false;
    if (selectedRisk !== 'all') {
      const hasSeverity = governance.riskSignals.some(
        (signal) => signal.linkedVersionId === record.linkedVersionId && signal.severity === selectedRisk
      );
      if (!hasSeverity) return false;
    }
    return true;
  });

  useEffect(() => {
    if (!filteredRecords.some((record) => record.linkedVersionId === selectedVersionId)) {
      setSelectedVersionId(filteredRecords[0]?.linkedVersionId ?? governance.records[0]?.linkedVersionId ?? '');
    }
  }, [filteredRecords, governance.records, selectedVersionId]);

  const selectedRecord =
    filteredRecords.find((record) => record.linkedVersionId === selectedVersionId) ?? filteredRecords[0] ?? governance.records[0];
  const linkedProjects = governance.linkRecords.filter((record) => record.linkedVersionId === selectedRecord?.linkedVersionId);
  const readiness = governance.readinessRecords.find((record) => record.linkedVersionId === selectedRecord?.linkedVersionId);
  const risks = governance.riskSignals.filter((signal) => signal.linkedVersionId === selectedRecord?.linkedVersionId);
  const releaseWindow = releaseWindowRecords.find((window) => window.linkedVersionId === selectedRecord?.linkedVersionId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="版本推进 / Version Governance"
        description="复用项目进度快照、风险信号和任务执行回写结果，统一查看版本基线、发布准备度、发布窗口和治理风险。"
      />

      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <InfoCard title="版本总数 / Total Versions" value={filteredRecords.length} />
        <InfoCard
          title="平均推进度 / Average Progress"
          value={percentFormatter.format(filteredRecords.reduce((sum, item) => sum + item.averageProgress, 0) / Math.max(filteredRecords.length, 1))}
        />
        <InfoCard title="高风险版本 / High-risk Versions" value={filteredRecords.filter((item) => item.activeRiskCount > 1).length} />
        <InfoCard title="阻塞版本 / Blocked Versions" value={filteredRecords.filter((item) => item.governanceStatus === 'blocked').length} />
        <InfoCard title="可发布版本 / Ready Versions" value={filteredRecords.filter((item) => item.releaseReadinessStatus === 'ready').length} />
        <InfoCard title="可回写项目 / Write-back Ready Projects" value={filteredRecords.reduce((sum, item) => sum + item.writebackReadyProjectCount, 0)} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
          <div className="min-w-[220px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">版本筛选 / Version Filter</label>
            <select value={selectedVersionId} onChange={(event) => setSelectedVersionId(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              {filteredRecords.map((record) => (
                <option key={record.linkedVersionId} value={record.linkedVersionId}>
                  {record.versionName}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">状态筛选 / Status Filter</label>
            <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as typeof selectedStatus)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="all">全部 / All</option>
              <option value="on-track">按计划 / On Track</option>
              <option value="watching">观察中 / Watching</option>
              <option value="blocked">受阻 / Blocked</option>
              <option value="ready-to-release">可发布 / Ready to Release</option>
            </select>
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">风险筛选 / Risk Filter</label>
            <select value={selectedRisk} onChange={(event) => setSelectedRisk(event.target.value as typeof selectedRisk)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="all">全部 / All</option>
              <option value="high">{formatBilingualLabel(signalSeverityLabels.high)}</option>
              <option value="medium">{formatBilingualLabel(signalSeverityLabels.medium)}</option>
              <option value="low">{formatBilingualLabel(signalSeverityLabels.low)}</option>
            </select>
          </div>
          <div className="min-w-[260px] flex-1">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">展示模式 / View Mode</label>
            <div className="flex flex-wrap gap-2">
              {commonViewModes.governance.map((mode) => (
                <button key={mode} type="button" onClick={() => setViewMode(mode)} className={`rounded-md border px-3 py-2 text-sm ${viewMode === mode ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">当前模式 / Current Mode: <span className="font-medium text-slate-900">{viewMode}</span></div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="font-medium text-slate-900">版本总表 / Version Governance Table</h2>
              <p className="text-sm text-slate-500">查看版本推进状态、基线偏差、治理风险与回写覆盖。</p>
            </div>
            <StatusBadge label={`${filteredRecords.length} 个版本 / versions`} tone="muted" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">{fieldLabel('version')}</th>
                  <th className="px-4 py-3">{fieldLabel('project')}</th>
                  <th className="px-4 py-3">平均进度 / Average Progress</th>
                  <th className="px-4 py-3">基线进度 / Baseline Progress</th>
                  <th className="px-4 py-3">偏差 / Variance</th>
                  <th className="px-4 py-3">治理状态 / Governance Status</th>
                  <th className="px-4 py-3">发布准备度 / Release Readiness</th>
                  <th className="px-4 py-3">{fieldLabel('writeback')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className={`border-t border-slate-100 ${selectedRecord?.linkedVersionId === record.linkedVersionId ? 'bg-slate-50' : 'bg-white'}`}>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => setSelectedVersionId(record.linkedVersionId)} className="text-left">
                        <div className="font-medium text-slate-900">{record.versionName}</div>
                        <div className="text-xs text-slate-500">{record.relationType}</div>
                      </button>
                    </td>
                    <td className="px-4 py-3">{record.projectCount}</td>
                    <td className="px-4 py-3">{percentFormatter.format(record.averageProgress)}</td>
                    <td className="px-4 py-3">{percentFormatter.format(record.baselineProgress)}</td>
                    <td className={`px-4 py-3 font-medium ${record.variance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{percentFormatter.format(record.variance)}</td>
                    <td className="px-4 py-3"><StatusBadge label={record.governanceStatus} tone={mapRiskTone(record.governanceStatus)} /></td>
                    <td className="px-4 py-3"><StatusBadge label={formatBilingualLabel(releaseStatusLabels[record.releaseReadinessStatus])} tone={mapRiskTone(record.releaseReadinessStatus)} /></td>
                    <td className="px-4 py-3">{record.writebackReadyProjectCount} / {record.projectCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">单版本详情 / Version Detail</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="rounded-md bg-slate-50 p-3">
              <div className="text-lg font-semibold text-slate-900">{selectedRecord?.versionName}</div>
              <div className="mt-1 text-slate-500">{selectedRecord?.latestSummary}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge label={selectedRecord?.governanceStatus} tone={mapRiskTone(selectedRecord?.governanceStatus)} />
                <StatusBadge label={selectedRecord ? formatBilingualLabel(releaseStatusLabels[selectedRecord.releaseReadinessStatus]) : '-'} tone={mapRiskTone(selectedRecord?.releaseReadinessStatus)} />
              </div>
            </div>
            <div className="rounded-md border border-slate-200 p-3">
              <div>关联项目数 / Linked Projects: {selectedRecord?.projectCount ?? 0}</div>
              <div className="mt-1">活跃风险数 / Active Risks: {selectedRecord?.activeRiskCount ?? 0}</div>
              <div className="mt-1">阻塞项目数 / Blocked Projects: {selectedRecord?.blockedProjectCount ?? 0}</div>
              <div className="mt-1">回写就绪项目 / Write-back Ready: {selectedRecord?.writebackReadyProjectCount ?? 0}</div>
              <div className="mt-1">说明 / Notes: {selectedRecord?.notes}</div>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="font-medium text-slate-900">版本关联项目 / Linked Projects</h2>
            <p className="text-sm text-slate-500">查看版本下各项目的进度、资源压力和回写状态。</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">{fieldLabel('project')}</th>
                  <th className="px-4 py-3">{fieldLabel('progress')}</th>
                  <th className="px-4 py-3">进度状态 / Progress Status</th>
                  <th className="px-4 py-3">资源压力 / Resource Pressure</th>
                  <th className="px-4 py-3">阻塞任务 / Blocked Tasks</th>
                  <th className="px-4 py-3">高风险任务 / High-risk Tasks</th>
                  <th className="px-4 py-3">{fieldLabel('writeback')}</th>
                </tr>
              </thead>
              <tbody>
                {linkedProjects.map((project) => (
                  <tr key={project.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">{project.projectId}</td>
                    <td className="px-4 py-3">{percentFormatter.format(project.currentProgress)}</td>
                    <td className="px-4 py-3"><StatusBadge label={project.progressStatus} tone={mapRiskTone(project.progressStatus)} /></td>
                    <td className="px-4 py-3"><StatusBadge label={project.resourcePressureLevel} tone={mapRiskTone(project.resourcePressureLevel)} /></td>
                    <td className="px-4 py-3">{project.blockedTaskCount}</td>
                    <td className="px-4 py-3">{project.highRiskTaskCount}</td>
                    <td className="px-4 py-3"><StatusBadge label={project.writebackReadyFlag ? '已就绪 / Ready' : '待补齐 / Pending'} tone={project.writebackReadyFlag ? 'success' : 'warning'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">发布准备度 / Release Readiness</h2>
          <div className="mt-4 space-y-3">
            {readiness ? (
              <div className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-slate-900">{formatBilingualLabel(releaseStatusLabels[readiness.readinessStatus])}</div>
                  <StatusBadge label={percentFormatter.format(readiness.projectCoverage)} tone={mapRiskTone(readiness.readinessStatus)} />
                </div>
                <div className="mt-2">项目覆盖率 / Project Coverage: {percentFormatter.format(readiness.projectCoverage)}</div>
                <div className="mt-1">回写覆盖率 / Write-back Coverage: {percentFormatter.format(readiness.taskWritebackCoverage)}</div>
                <div className="mt-1">阻塞数 / Blockers: {readiness.blockerCount}</div>
                <div className="mt-1">高风险数 / High Risks: {readiness.highRiskCount}</div>
                <div className="mt-1 text-xs text-slate-500">{readiness.recommendedAction}</div>
              </div>
            ) : null}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-4 xl:col-span-2">
          <h2 className="font-medium text-slate-900">风险与阻塞 / Risks & Blockers</h2>
          <div className="mt-4 space-y-3">
            {risks.map((risk) => (
              <div key={risk.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-slate-900">{risk.title}</div>
                  <StatusBadge label={formatBilingualLabel(signalSeverityLabels[risk.severity])} tone={mapRiskTone(risk.severity)} />
                </div>
                <div className="mt-2 text-sm text-slate-700">{risk.summary}</div>
                <div className="mt-1 text-xs text-slate-500">建议动作 / Suggested Action: {risk.suggestedAction}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">发布窗口占位 / Release Window Placeholder</h2>
          {releaseWindow ? (
            <div className="mt-4 rounded-md border border-slate-200 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">{releaseWindow.windowName}</div>
              <div className="mt-2">窗口时间 / Window: {releaseWindow.plannedStartDate} ~ {releaseWindow.plannedEndDate}</div>
              <div className="mt-1">发布负责人 / Release Manager: {releaseWindow.releaseManager}</div>
              <div className="mt-1">状态 / Status: {releaseWindow.status}</div>
              <div className="mt-1 text-xs text-slate-500">{releaseWindow.notes}</div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">当前版本尚未配置发布窗口占位 / No release window placeholder for this version yet.</p>
          )}
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <SourceContextPanel
          title="来源与回写说明 / Source & Write-back Context"
          description="版本治理页并不直接重算项目执行，而是消费已有项目进度快照、风险信号和任务回写结果。"
          sources={[
            { name: '项目进度快照 / Project Progress Snapshots', detail: '来自 `ProjectProgressSnapshot`，用于汇总项目进度、阻塞和回写就绪状态。' },
            { name: '项目风险信号 / Project Risk Signals', detail: '来自 `ProjectRiskSignal`，聚合为版本风险聚集和治理清单输入。' },
            { name: '任务执行回写 / Task Execution Write-back', detail: '来自 `TaskExecutionWritebackRecord`，用于发布准备度和回写覆盖率判断。' },
            { name: '版本关联占位 / Version Link Placeholder', detail: '来自 `ProjectVersionLinkRecord` 与发布窗口 mock 数据，保留未来版本治理接入点。' }
          ]}
        />
        <RuleContextPanel
          title="治理口径说明 / Governance Rules"
          rules={[
            { name: '版本推进度 / Version Progress', detail: '当前取关联项目进度快照的平均值，与基线进度做偏差比较。' },
            { name: '发布准备度 / Release Readiness', detail: '结合项目回写覆盖率、任务回写覆盖率、阻塞数与高风险数形成 v0 状态。' },
            { name: '风险聚集 / Risk Cluster', detail: '将项目级风险信号按 linkedVersionId 汇总，不在页面层重新散落 map/reduce。' }
          ]}
        />
      </section>

      {selectedRecord ? <SnapshotContextPanel title="快照口径 / Snapshot Context" context={selectedRecord.snapshotContext} /> : null}
    </div>
  );
}
