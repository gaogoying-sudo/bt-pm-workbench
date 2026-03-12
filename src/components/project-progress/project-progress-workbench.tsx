'use client';

import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { InfoCard } from '@/components/ui/info-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { RuleContextPanel } from '@/components/shared/rule-context-panel';
import { SnapshotContextPanel } from '@/components/shared/snapshot-context-panel';
import { SourceContextPanel } from '@/components/shared/source-context-panel';
import { manpowerProjects } from '@/data/manpower/manpower-projects';
import { manpowerPlanVersions } from '@/data/manpower/manpower-plan-versions';
import { manpowerStagePlans } from '@/data/manpower/manpower-stage-plans';
import { projectVersionLinkRecords } from '@/data/project-progress/project-version-link-records';
import { buildProjectProgressSnapshots, buildProjectStageProgressSnapshots } from '@/lib/project-progress/project-progress-builders';
import { buildProjectRiskSignals } from '@/lib/project-progress/project-risk-builders';
import { commonViewModes, progressStatusOptions, resourcePressureOptions } from '@/lib/view-config/filter-options';
import { formatBilingualLabel } from '@/lib/view-config/bilingual-label-builders';
import { projectProgressStatusLabels, resourcePressureLabels, signalSeverityLabels } from '@/lib/view-config/status-labels';
import { mapRiskTone } from '@/lib/view-config/tone-mappers';
import { buildSnapshotContext } from '@/lib/snapshots/snapshot-helpers';

const percentFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export function ProjectProgressWorkbench() {
  const progressSnapshots = useMemo(() => buildProjectProgressSnapshots(projectVersionLinkRecords), []);
  const [selectedProjectId, setSelectedProjectId] = useState(progressSnapshots[0]?.projectId ?? '');
  const [selectedStatus, setSelectedStatus] = useState<string | 'all'>('all');
  const [selectedRisk, setSelectedRisk] = useState<string | 'all'>('all');
  const [selectedStageId, setSelectedStageId] = useState<string | 'all'>('all');
  const [selectedVersionId, setSelectedVersionId] = useState<string | 'all'>('all');
  const [viewMode, setViewMode] = useState<(typeof commonViewModes.progress)[number]>(commonViewModes.progress[0]);

  const filteredSnapshots = progressSnapshots.filter((snapshot) => {
    if (selectedStatus !== 'all' && snapshot.progressStatus !== selectedStatus) return false;
    if (selectedRisk !== 'all' && snapshot.resourcePressureLevel !== selectedRisk) return false;
    if (selectedStageId !== 'all' && snapshot.currentStageId !== selectedStageId) return false;
    if (selectedVersionId !== 'all' && snapshot.linkedVersionId !== selectedVersionId) return false;
    return true;
  });

  useEffect(() => {
    if (!filteredSnapshots.some((snapshot) => snapshot.projectId === selectedProjectId)) {
      setSelectedProjectId(filteredSnapshots[0]?.projectId ?? progressSnapshots[0]?.projectId ?? '');
    }
  }, [filteredSnapshots, progressSnapshots, selectedProjectId]);

  const selectedSnapshot =
    filteredSnapshots.find((snapshot) => snapshot.projectId === selectedProjectId) ??
    filteredSnapshots[0] ??
    progressSnapshots[0];
  const selectedProject = manpowerProjects.find((project) => project.id === selectedSnapshot?.projectId);
  const stageSnapshots = selectedSnapshot ? buildProjectStageProgressSnapshots(selectedSnapshot.projectId) : [];
  const riskSignals = selectedSnapshot ? buildProjectRiskSignals(selectedSnapshot.projectId) : [];
  const versionLinks = projectVersionLinkRecords.filter((record) => record.projectId === selectedSnapshot?.projectId);
  const snapshotContext = buildSnapshotContext({
    notes: '项目进度页面使用项目进度快照和项目风险信号，不在页面层做重复聚合。'
  });

  const totalProjects = filteredSnapshots.length;
  const averageProgress =
    filteredSnapshots.length > 0
      ? filteredSnapshots.reduce((sum, snapshot) => sum + snapshot.currentOverallProgress, 0) / filteredSnapshots.length
      : 0;
  const activeProjects = filteredSnapshots.filter((snapshot) => snapshot.progressStatus === 'in-progress').length;
  const highRiskProjects = filteredSnapshots.filter((snapshot) => snapshot.resourcePressureLevel === 'high' || snapshot.highRiskTaskCount > 0).length;
  const blockedProjects = filteredSnapshots.filter((snapshot) => snapshot.blockedTaskCount > 0).length;
  const writebackReadyProjects = filteredSnapshots.filter((snapshot) => snapshot.writebackReadyFlag).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="项目进度 / Project Progress"
        description="复用任务执行聚合、资源压力和回写结果，统一查看项目级进度、阶段拆解、风险与版本关联。"
      />

      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <InfoCard title="项目总数 / Total Projects" value={totalProjects} />
        <InfoCard title="平均项目进度 / Average Progress" value={percentFormatter.format(averageProgress)} />
        <InfoCard title="进行中项目 / Active Projects" value={activeProjects} />
        <InfoCard title="高风险项目 / High-risk Projects" value={highRiskProjects} />
        <InfoCard title="阻塞项目 / Blocked Projects" value={blockedProjects} />
        <InfoCard title="可回写项目 / Write-back Ready Projects" value={writebackReadyProjects} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">项目筛选 / Project Filter</label>
            <select value={selectedProjectId} onChange={(event) => setSelectedProjectId(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              {filteredSnapshots.map((snapshot) => (
                <option key={snapshot.projectId} value={snapshot.projectId}>
                  {manpowerProjects.find((project) => project.id === snapshot.projectId)?.name ?? snapshot.projectId}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">状态筛选 / Status Filter</label>
            <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              {progressStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">风险筛选 / Risk Filter</label>
            <select value={selectedRisk} onChange={(event) => setSelectedRisk(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              {resourcePressureOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">阶段筛选 / Stage Filter</label>
            <select value={selectedStageId} onChange={(event) => setSelectedStageId(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="all">全部 / All</option>
              {manpowerStagePlans.map((stage) => (
                <option key={stage.id} value={stage.id}>{stage.stageName} / {stage.projectId}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">版本筛选 / Version Filter</label>
            <select value={selectedVersionId} onChange={(event) => setSelectedVersionId(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="all">全部 / All</option>
              {manpowerPlanVersions.map((version) => (
                <option key={version.id} value={version.id}>{version.name}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[260px] flex-1">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">展示模式 / View Mode</label>
            <div className="flex flex-wrap gap-2">
              {commonViewModes.progress.map((mode) => (
                <button key={mode} type="button" onClick={() => setViewMode(mode)} className={`rounded-md border px-3 py-2 text-sm ${viewMode === mode ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
          当前模式 / Current Mode: <span className="font-medium text-slate-900">{viewMode}</span>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="font-medium text-slate-900">项目进度总表 / Project Progress Table</h2>
              <p className="text-sm text-slate-500">统一查看项目进度、当前阶段、资源压力和版本关联。</p>
            </div>
            <StatusBadge label={`${filteredSnapshots.length} 个项目 / projects`} tone="muted" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">项目名称 / Project</th>
                  <th className="px-4 py-3">当前进度 / Progress</th>
                  <th className="px-4 py-3">当前阶段 / Current Stage</th>
                  <th className="px-4 py-3">活跃任务 / Active Tasks</th>
                  <th className="px-4 py-3">已完成 / Completed</th>
                  <th className="px-4 py-3">阻塞 / Blocked</th>
                  <th className="px-4 py-3">高风险 / High Risk</th>
                  <th className="px-4 py-3">资源压力 / Resource Pressure</th>
                  <th className="px-4 py-3">版本关联 / Linked Version</th>
                  <th className="px-4 py-3">回写状态 / Write-back Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSnapshots.map((snapshot) => (
                  <tr key={snapshot.projectId} className={`border-t border-slate-100 ${selectedSnapshot?.projectId === snapshot.projectId ? 'bg-slate-50' : 'bg-white'}`}>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => setSelectedProjectId(snapshot.projectId)} className="text-left">
                        <div className="font-medium text-slate-900">{manpowerProjects.find((project) => project.id === snapshot.projectId)?.name ?? snapshot.projectId}</div>
                        <div className="text-xs text-slate-500">{snapshot.latestSummary}</div>
                      </button>
                    </td>
                    <td className="px-4 py-3">{percentFormatter.format(snapshot.currentOverallProgress)}</td>
                    <td className="px-4 py-3">{manpowerStagePlans.find((stage) => stage.id === snapshot.currentStageId)?.stageName ?? '-'}</td>
                    <td className="px-4 py-3">{snapshot.activeTaskCount}</td>
                    <td className="px-4 py-3">{snapshot.completedTaskCount}</td>
                    <td className="px-4 py-3">{snapshot.blockedTaskCount}</td>
                    <td className="px-4 py-3">{snapshot.highRiskTaskCount}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={formatBilingualLabel(resourcePressureLabels[snapshot.resourcePressureLevel])} tone={mapRiskTone(snapshot.resourcePressureLevel)} />
                    </td>
                    <td className="px-4 py-3">{projectVersionLinkRecords.find((record) => record.projectId === snapshot.projectId)?.versionName ?? '-'}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={snapshot.writebackReadyFlag ? '已就绪 / Ready' : '待补齐 / Pending'} tone={snapshot.writebackReadyFlag ? 'success' : 'warning'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">单项目进度详情 / Project Detail</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="rounded-md bg-slate-50 p-3">
              <div className="text-lg font-semibold text-slate-900">{selectedProject?.name ?? '-'}</div>
              <div className="mt-1 text-slate-500">{selectedProject?.code ?? '-'}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge label={selectedSnapshot ? formatBilingualLabel(projectProgressStatusLabels[selectedSnapshot.progressStatus]) : '-'} tone={mapRiskTone(selectedSnapshot?.progressStatus)} />
                <StatusBadge label={selectedSnapshot ? formatBilingualLabel(resourcePressureLabels[selectedSnapshot.resourcePressureLevel]) : '-'} tone={mapRiskTone(selectedSnapshot?.resourcePressureLevel)} />
              </div>
            </div>
            <div className="rounded-md border border-slate-200 p-3">
              <div>当前阶段 / Current Stage: {manpowerStagePlans.find((stage) => stage.id === selectedSnapshot?.currentStageId)?.stageName ?? '-'}</div>
              <div className="mt-1">项目摘要 / Summary: {selectedSnapshot?.latestSummary}</div>
              <div className="mt-1">任务来源 / Task Source Context: {selectedSnapshot?.sourceTaskAggregateCount ?? 0} 个任务聚合</div>
              <div className="mt-1">资源压力说明 / Resource Pressure Context: {selectedSnapshot ? formatBilingualLabel(resourcePressureLabels[selectedSnapshot.resourcePressureLevel]) : '-'}</div>
              <div className="mt-1">版本关联摘要 / Version Link Context: {versionLinks[0]?.notes ?? '未关联 / Not linked'}</div>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="font-medium text-slate-900">项目阶段进度拆解 / Stage Progress Breakdown</h2>
            <p className="text-sm text-slate-500">查看所选项目在各阶段的推进、工天和风险信号。</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">阶段 / Stage</th>
                  <th className="px-4 py-3">阶段进度 / Progress</th>
                  <th className="px-4 py-3">任务数 / Tasks</th>
                  <th className="px-4 py-3">进行中 / In Progress</th>
                  <th className="px-4 py-3">已完成 / Completed</th>
                  <th className="px-4 py-3">阻塞 / Blocked</th>
                  <th className="px-4 py-3">逾期 / Overdue</th>
                  <th className="px-4 py-3">计划工天 / Planned Work Days</th>
                  <th className="px-4 py-3">实际工天 / Actual Work Days</th>
                  <th className="px-4 py-3">风险提示 / Risk Hint</th>
                </tr>
              </thead>
              <tbody>
                {stageSnapshots.map((snapshot) => (
                  <tr key={snapshot.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">{snapshot.stageName}</td>
                    <td className="px-4 py-3">{percentFormatter.format(snapshot.stageProgress)}</td>
                    <td className="px-4 py-3">{snapshot.taskCount}</td>
                    <td className="px-4 py-3">{snapshot.inProgressTaskCount}</td>
                    <td className="px-4 py-3">{snapshot.completedTaskCount}</td>
                    <td className="px-4 py-3">{snapshot.blockedTaskCount}</td>
                    <td className="px-4 py-3">{snapshot.overdueTaskCount}</td>
                    <td className="px-4 py-3">{snapshot.plannedWorkDays}</td>
                    <td className="px-4 py-3">{snapshot.actualWorkDays}</td>
                    <td className="px-4 py-3">{snapshot.riskSummary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">风险与阻塞 / Risks & Blockers</h2>
          <div className="mt-4 space-y-3">
            {riskSignals.map((signal) => (
              <div key={signal.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-slate-900">{signal.title}</div>
                  <StatusBadge label={formatBilingualLabel(signalSeverityLabels[signal.severity])} tone={mapRiskTone(signal.severity)} />
                </div>
                <div className="mt-2 text-sm text-slate-700">{signal.summary}</div>
                <div className="mt-1 text-xs text-slate-500">建议动作 / Suggested Action: {signal.suggestedAction}</div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <SourceContextPanel
          title="进度来源说明 / Progress Source Context"
          sources={[
            { name: '任务执行聚合 / Task Execution Aggregates', detail: '项目总进度和阶段进度来自 ProjectExecutionAggregate 与 StageExecutionAggregate。' },
            { name: '人员与资源引用 / People & Resource Reference', detail: '资源压力等级来自 allocation 计算层，而不是页面内的临时判断。' },
            { name: '人力回写引用 / Manpower Write-back Reference', detail: 'writebackReadyFlag 用于说明后续连接实际投入偏差分析的准备情况。' }
          ]}
        />
        <RuleContextPanel
          title="聚合口径说明 / Aggregation Rules"
          rules={[
            { name: '实际工天口径 / Actual Work Day Rule', detail: '实际工天仍采用 v0 mock 规则，任务主记录与 activity spent work days 取较大值。' },
            { name: 'Weighted Progress', detail: '优先使用阶段任务 weight；若某阶段 weight 总和为 0，则退化为任务 progress 平均值。' },
            { name: '当前状态 / Current Scope', detail: '当前仍是 v0 mock 口径，后续可替换为真实执行记录和项目状态回写。' }
          ]}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">版本关联预留区 / Version Link Placeholder</h2>
          <div className="mt-4 space-y-3">
            {versionLinks.map((link) => (
              <div key={link.id} className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
                <div className="font-medium text-slate-900">{link.versionName}</div>
                <div className="mt-1">基线进度 / Baseline Progress: {percentFormatter.format(link.baselineProgress)}</div>
                <div className="mt-1">当前进度 / Current Progress: {percentFormatter.format(link.currentProgress)}</div>
                <div className="mt-1">偏差 / Variance: {percentFormatter.format(link.variance)}</div>
                <div className="mt-1 text-xs text-slate-500">{link.notes}</div>
              </div>
            ))}
          </div>
        </article>
        <SnapshotContextPanel title="快照口径 / Snapshot Context" context={snapshotContext} />
      </section>
    </div>
  );
}
