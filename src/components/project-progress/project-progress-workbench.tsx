'use client';

import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { InfoCard } from '@/components/ui/info-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { manpowerProjects } from '@/data/manpower/manpower-projects';
import { manpowerPlanVersions } from '@/data/manpower/manpower-plan-versions';
import { manpowerStagePlans } from '@/data/manpower/manpower-stage-plans';
import { projectVersionLinkRecords } from '@/data/project-progress/project-version-link-records';
import { buildProjectProgressSnapshots, buildProjectStageProgressSnapshots } from '@/lib/project-progress/project-progress-builders';
import { buildProjectRiskSignals } from '@/lib/project-progress/project-risk-builders';

const percentFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const progressStatusLabel: Record<string, string> = {
  'not-started': '未开始 / Not Started',
  'in-progress': '进行中 / In Progress',
  'at-risk': '有风险 / At Risk',
  blocked: '阻塞 / Blocked',
  done: '已完成 / Done'
};

const pressureLabel: Record<string, string> = {
  low: '低 / Low',
  medium: '中 / Medium',
  high: '高 / High'
};

const signalSeverityTone: Record<string, 'success' | 'warning' | 'danger'> = {
  low: 'success',
  medium: 'warning',
  high: 'danger'
};

const signalStatusLabel: Record<string, string> = {
  open: '开放 / Open',
  watching: '观察中 / Watching',
  mitigated: '已缓解 / Mitigated'
};

const viewModes = ['项目视图 / Project View', '阶段视图 / Stage View', '风险视图 / Risk View'] as const;

export function ProjectProgressWorkbench() {
  const progressSnapshots = useMemo(() => buildProjectProgressSnapshots(projectVersionLinkRecords), []);
  const [selectedProjectId, setSelectedProjectId] = useState(progressSnapshots[0]?.projectId ?? '');
  const [selectedStatus, setSelectedStatus] = useState<string | 'all'>('all');
  const [selectedRisk, setSelectedRisk] = useState<string | 'all'>('all');
  const [selectedStageId, setSelectedStageId] = useState<string | 'all'>('all');
  const [selectedVersionId, setSelectedVersionId] = useState<string | 'all'>('all');
  const [viewMode, setViewMode] = useState<(typeof viewModes)[number]>('项目视图 / Project View');

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
        description="项目级、阶段级、风险与版本关联的统一进度展示层，复用任务执行聚合、人员负载和回写预览结果。"
      />

      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <InfoCard title="项目总数 / Total Projects" value={totalProjects} />
        <InfoCard title="平均项目进度 / Average Progress" value={percentFormatter.format(averageProgress)} />
        <InfoCard title="进行中项目数 / Active Projects" value={activeProjects} />
        <InfoCard title="高风险项目数 / High-risk Projects" value={highRiskProjects} />
        <InfoCard title="阻塞项目数 / Blocked Projects" value={blockedProjects} />
        <InfoCard title="可回写项目数 / Write-back Ready Projects" value={writebackReadyProjects} />
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
              <option value="all">全部 / All</option>
              {Object.entries(progressStatusLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">风险筛选 / Risk Filter</label>
            <select value={selectedRisk} onChange={(event) => setSelectedRisk(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="all">全部 / All</option>
              <option value="high">高 / High</option>
              <option value="medium">中 / Medium</option>
              <option value="low">低 / Low</option>
            </select>
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">阶段筛选 / Stage Filter</label>
            <select value={selectedStageId} onChange={(event) => setSelectedStageId(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="all">全部 / All</option>
              {manpowerStagePlans.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.stageName} / {stage.projectId}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">版本筛选 / Version Filter</label>
            <select value={selectedVersionId} onChange={(event) => setSelectedVersionId(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="all">全部 / All</option>
              {manpowerPlanVersions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.name}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[260px] flex-1">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">展示模式 / View Mode</label>
            <div className="flex flex-wrap gap-2">
              {viewModes.map((mode) => (
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
              <p className="text-sm text-slate-500">统一查看项目级进度、阶段、风险、资源压力与版本关联。</p>
            </div>
            <StatusBadge label={`${filteredSnapshots.length} 个项目 / projects`} tone="muted" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">项目 / Project</th>
                  <th className="px-4 py-3">当前进度 / Progress</th>
                  <th className="px-4 py-3">当前阶段 / Current Stage</th>
                  <th className="px-4 py-3">活跃任务 / Active Tasks</th>
                  <th className="px-4 py-3">已完成 / Completed</th>
                  <th className="px-4 py-3">阻塞 / Blocked</th>
                  <th className="px-4 py-3">高风险 / High Risk</th>
                  <th className="px-4 py-3">资源压力 / Resource Pressure</th>
                  <th className="px-4 py-3">版本关联 / Linked Version</th>
                  <th className="px-4 py-3">回写状态 / Write-back</th>
                  <th className="px-4 py-3">摘要 / Summary</th>
                </tr>
              </thead>
              <tbody>
                {filteredSnapshots.map((snapshot) => (
                  <tr key={snapshot.projectId} className={`border-t border-slate-100 ${selectedSnapshot?.projectId === snapshot.projectId ? 'bg-slate-50' : 'bg-white'}`}>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => setSelectedProjectId(snapshot.projectId)} className="text-left">
                        <div className="font-medium text-slate-900">{manpowerProjects.find((project) => project.id === snapshot.projectId)?.name ?? snapshot.projectId}</div>
                        <div className="text-xs text-slate-500">{manpowerProjects.find((project) => project.id === snapshot.projectId)?.code}</div>
                      </button>
                    </td>
                    <td className="px-4 py-3">{percentFormatter.format(snapshot.currentOverallProgress)}</td>
                    <td className="px-4 py-3">{manpowerStagePlans.find((stage) => stage.id === snapshot.currentStageId)?.stageName ?? '-'}</td>
                    <td className="px-4 py-3">{snapshot.activeTaskCount}</td>
                    <td className="px-4 py-3">{snapshot.completedTaskCount}</td>
                    <td className="px-4 py-3">{snapshot.blockedTaskCount}</td>
                    <td className="px-4 py-3">{snapshot.highRiskTaskCount}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={pressureLabel[snapshot.resourcePressureLevel]} tone={signalSeverityTone[snapshot.resourcePressureLevel]} />
                    </td>
                    <td className="px-4 py-3">{projectVersionLinkRecords.find((record) => record.projectId === snapshot.projectId)?.versionName ?? '-'}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={snapshot.writebackReadyFlag ? '可回写 / Ready' : '待补齐 / Pending'} tone={snapshot.writebackReadyFlag ? 'success' : 'warning'} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">{snapshot.latestSummary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">单项目详情 / Project Detail</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-md bg-slate-50 p-3">
              <div className="text-lg font-semibold text-slate-900">{selectedProject?.name}</div>
              <div className="mt-1 text-sm text-slate-500">{selectedProject?.code}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge label={progressStatusLabel[selectedSnapshot?.progressStatus ?? 'not-started']} tone={selectedSnapshot?.progressStatus === 'blocked' ? 'danger' : selectedSnapshot?.progressStatus === 'at-risk' ? 'warning' : 'success'} />
                <StatusBadge label={`资源压力 / ${pressureLabel[selectedSnapshot?.resourcePressureLevel ?? 'low']}`} tone={signalSeverityTone[selectedSnapshot?.resourcePressureLevel ?? 'low']} />
              </div>
            </div>
            <div className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
              <div className="text-xs uppercase tracking-wide text-slate-500">基础信息 / Basic Info</div>
              <div className="mt-2">当前阶段 / Current Stage: {manpowerStagePlans.find((stage) => stage.id === selectedSnapshot?.currentStageId)?.stageName ?? '-'}</div>
              <div className="mt-1">项目摘要 / Summary: {selectedSnapshot?.latestSummary}</div>
              <div className="mt-1">任务来源 / Task Source: {selectedSnapshot?.sourceTaskAggregateCount} 个任务聚合、{selectedSnapshot?.sourceStageAggregateCount} 个阶段聚合</div>
              <div className="mt-1">版本关联 / Version Link: {versionLinks[0]?.versionName ?? '未关联 / Not Linked'}</div>
            </div>
            <div className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
              <div className="text-xs uppercase tracking-wide text-slate-500">风险与阻塞 / Risk & Blocker</div>
              <div className="mt-2">风险摘要 / Risk Summary: {riskSignals[0]?.summary ?? '暂无高优先信号 / No high-priority signal'}</div>
              <div className="mt-1">阻塞摘要 / Blocker Summary: {selectedSnapshot?.blockedTaskCount ? `${selectedSnapshot.blockedTaskCount} 个阻塞任务 / blocked tasks` : '当前无阻塞项目级摘要 / No project-level blocker summary'}</div>
              <div className="mt-1">资源压力说明 / Resource Pressure Context: {pressureLabel[selectedSnapshot?.resourcePressureLevel ?? 'low']}</div>
              <div className="mt-1">版本关系说明 / Version Link Context: {versionLinks[0]?.notes ?? '后续接入版本推进中心 / Reserved for version governance'}</div>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="font-medium text-slate-900">阶段进度拆解 / Stage Progress Breakdown</h2>
            <p className="text-sm text-slate-500">查看所选项目在各阶段的推进状态、任务和工天表现。</p>
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
                  <StatusBadge label={signalStatusLabel[signal.status]} tone={signalSeverityTone[signal.severity]} />
                </div>
                <div className="mt-2 text-sm text-slate-700">{signal.summary}</div>
                <div className="mt-1 text-xs text-slate-500">类型 / Type: {signal.signalType}</div>
                <div className="mt-1 text-xs text-slate-500">来源阶段 / Stage: {manpowerStagePlans.find((stage) => stage.id === signal.relatedStageId)?.stageName ?? '项目级 / Project Level'}</div>
                <div className="mt-1 text-xs text-slate-500">来源任务数 / Related Tasks: {signal.relatedTaskIds.length}</div>
                <div className="mt-1 text-xs text-slate-500">建议动作 / Suggested Action: {signal.suggestedAction}</div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">进度来源说明 / Progress Source Context</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="rounded-md bg-slate-50 p-3">
              <div className="font-medium text-slate-900">任务执行聚合 / Task Execution Aggregates</div>
              <p className="mt-1">项目总进度和阶段进度直接复用 `ProjectExecutionAggregate` 与 `StageExecutionAggregate` 的结果，再映射成项目进度展示快照。</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <div className="font-medium text-slate-900">人员与资源引用 / People & Resource Reference</div>
              <p className="mt-1">资源压力等级引用人员任务负载聚合，使用负责人的负载风险作为项目资源压力信号输入。</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <div className="font-medium text-slate-900">人力投入回写说明 / Manpower Write-back Reference</div>
              <p className="mt-1">项目级 `writebackReadyFlag` 与版本关系说明用于后续连接人力成本模块的实际投入预览与偏差分析。</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <div className="font-medium text-slate-900">当前口径 / Current v0 Rule</div>
              <p className="mt-1">当前仍是 mock 口径，后续可替换为真实执行记录、真实项目状态回写与版本推进记录，而不改变页面结构。</p>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">版本关联预留 / Version Link Placeholder</h2>
          <div className="mt-4 space-y-3">
            {versionLinks.map((link) => (
              <div key={link.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-slate-900">{link.versionName}</div>
                  <StatusBadge label={link.relationType} tone="muted" />
                </div>
                <div className="mt-2 text-sm text-slate-700">基线进度 / Baseline Progress: {percentFormatter.format(link.baselineProgress)}</div>
                <div className="mt-1 text-sm text-slate-700">当前进度 / Current Progress: {percentFormatter.format(link.currentProgress)}</div>
                <div className="mt-1 text-sm text-slate-700">偏差 / Variance: {percentFormatter.format(link.variance)}</div>
                <div className="mt-1 text-xs text-slate-500">{link.notes}</div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
