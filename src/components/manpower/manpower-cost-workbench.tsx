'use client';

import { useEffect, useState } from 'react';
import { InfoCard } from '@/components/ui/info-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { RuleContextPanel } from '@/components/shared/rule-context-panel';
import { SnapshotContextPanel } from '@/components/shared/snapshot-context-panel';
import { manpowerActualInputs } from '@/data/manpower/manpower-actual-inputs';
import { manpowerComparisons } from '@/data/manpower/manpower-comparisons';
import { manpowerPlanVersions } from '@/data/manpower/manpower-plan-versions';
import { manpowerProjects } from '@/data/manpower/manpower-projects';
import { manpowerRoleConfigs } from '@/data/manpower/manpower-role-configs';
import { manpowerStagePlans } from '@/data/manpower/manpower-stage-plans';
import { projectAllocations } from '@/data/resources/project-allocations';
import { projectStageTaskLinks } from '@/data/task-execution/project-stage-task-links';
import { taskActivityRecords } from '@/data/task-execution/task-activity-records';
import { taskExecutionRecords } from '@/data/task-execution/task-execution-records';
import { buildManpowerActualInputAdapterResults } from '@/lib/manpower/actual-input-adapters';
import { buildProjectCostComparisonSnapshots, buildStageCostComparisonSnapshots } from '@/lib/manpower/comparison-builders';
import { buildManpowerCostSummary, buildRoleCostSnapshots } from '@/lib/manpower/cost-calculators';
import { manpowerJsonImportContract } from '@/lib/manpower/json-import-contracts';
import { buildAllocationWritebackPreviews } from '@/lib/resources/allocation-writeback-mappers';
import { buildTaskExecutionWritebackRecords } from '@/lib/task-execution/writeback-mappers';
import { EngineerRoleConfig, ManpowerProjectStatus } from '@/lib/types/manpower';
import { commonViewModes } from '@/lib/view-config/filter-options';

const currencyFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY',
  maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat('zh-CN');
const percentFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

const projectStatusOptions: Array<{ label: string; value: ManpowerProjectStatus | 'all' }> = [
  { label: 'All status', value: 'all' },
  { label: 'Planning', value: 'planning' },
  { label: 'Active', value: 'active' },
  { label: 'At risk', value: 'at-risk' },
  { label: 'On hold', value: 'on-hold' },
  { label: 'Completed', value: 'completed' }
];

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatPersonDays(value: number) {
  return `${numberFormatter.format(value)} PD`;
}

function comparisonTone(level: 'low' | 'medium' | 'high') {
  if (level === 'high') return 'danger' as const;
  if (level === 'medium') return 'warning' as const;
  return 'success' as const;
}

function projectStatusTone(status: ManpowerProjectStatus) {
  if (status === 'at-risk') return 'danger' as const;
  if (status === 'active') return 'default' as const;
  if (status === 'planning') return 'warning' as const;
  return 'muted' as const;
}

export function ManpowerCostWorkbench() {
  const [selectedProjectId, setSelectedProjectId] = useState(manpowerProjects[0]?.id ?? '');
  const [selectedStatus, setSelectedStatus] = useState<ManpowerProjectStatus | 'all'>('all');
  const [selectedRoleId, setSelectedRoleId] = useState('all');
  const [selectedVersionId, setSelectedVersionId] = useState('all');
  const manpowerViewModes = commonViewModes.progress.slice(0, 3) as ['项目视图 / Project View', '阶段视图 / Stage View', '风险视图 / Risk View'];
  const [displayMode, setDisplayMode] = useState<(typeof manpowerViewModes)[number]>(manpowerViewModes[0]);
  const [roleDrafts, setRoleDrafts] = useState<EngineerRoleConfig[]>(manpowerRoleConfigs);

  const filteredProjects = manpowerProjects.filter((project) => {
    if (selectedStatus !== 'all' && project.status !== selectedStatus) return false;
    if (selectedVersionId !== 'all' && project.currentPlanVersionId !== selectedVersionId) return false;

    if (selectedRoleId !== 'all') {
      const stagePlans = manpowerStagePlans.filter(
        (stagePlan) => stagePlan.projectId === project.id && stagePlan.versionId === project.currentPlanVersionId
      );
      return stagePlans.some((stagePlan) => stagePlan.plannedRoleIds.includes(selectedRoleId));
    }

    return true;
  });

  useEffect(() => {
    if (!filteredProjects.some((project) => project.id === selectedProjectId)) {
      setSelectedProjectId(filteredProjects[0]?.id ?? manpowerProjects[0]?.id ?? '');
    }
  }, [filteredProjects, selectedProjectId]);

  const selectedProject =
    filteredProjects.find((project) => project.id === selectedProjectId) ?? filteredProjects[0] ?? manpowerProjects[0];
  const selectedProjectVersionId = selectedProject?.currentPlanVersionId ?? '';
  const selectedProjectStages = manpowerStagePlans
    .filter((stagePlan) => stagePlan.projectId === selectedProject?.id && stagePlan.versionId === selectedProjectVersionId)
    .sort((left, right) => left.stageOrder - right.stageOrder);
  const selectedProjectVersions = manpowerPlanVersions.filter((version) => version.projectId === selectedProject?.id);
  const baselineVersion = selectedProjectVersions.find((version) => version.isBaseline);
  const currentVersion = selectedProjectVersions.find((version) => version.id === selectedProjectVersionId);

  const projectComparisonRows = filteredProjects
    .map((project) => ({
      project,
      comparison: manpowerComparisons.find((record) => record.projectId === project.id && !record.stageId),
      baseline: manpowerPlanVersions.find((version) => version.projectId === project.id && version.isBaseline),
      currentVersion: manpowerPlanVersions.find((version) => version.id === project.currentPlanVersionId)
    }))
    .filter((entry) => entry.comparison);

  const totalProjects = filteredProjects.length;
  const totalPlannedPersonDays = projectComparisonRows.reduce((sum, entry) => sum + (entry.comparison?.plannedPersonDays ?? 0), 0);
  const totalActualPersonDays = projectComparisonRows.reduce((sum, entry) => sum + (entry.comparison?.actualPersonDays ?? 0), 0);
  const totalPlannedCost = projectComparisonRows.reduce((sum, entry) => sum + (entry.comparison?.plannedCost ?? 0), 0);
  const totalActualCost = projectComparisonRows.reduce((sum, entry) => sum + (entry.comparison?.actualCost ?? 0), 0);
  const totalCostVariance = totalActualCost - totalPlannedCost;
  const highRiskProjects = projectComparisonRows.filter((entry) => entry.comparison?.riskLevel === 'high').length;

  const stageComparisonRows = selectedProjectStages.map((stagePlan) => ({
    stagePlan,
    comparison: manpowerComparisons.find((record) => record.stageId === stagePlan.id),
    actualInput: manpowerActualInputs.find((record) => record.stageId === stagePlan.id)
  }));

  const highCostProjects = [...projectComparisonRows]
    .sort((left, right) => (right.comparison?.costVariance ?? 0) - (left.comparison?.costVariance ?? 0))
    .slice(0, 3);

  const highVarianceProjects = [...projectComparisonRows]
    .sort((left, right) => Math.abs(right.comparison?.personDaysVariance ?? 0) - Math.abs(left.comparison?.personDaysVariance ?? 0))
    .slice(0, 3);

  const stageAlerts = manpowerComparisons
    .filter((record) => record.stageId && record.riskLevel !== 'low')
    .sort((left, right) => right.costVariance - left.costVariance)
    .slice(0, 4)
    .map((record) => ({
      comparison: record,
      project: manpowerProjects.find((project) => project.id === record.projectId),
      stagePlan: manpowerStagePlans.find((stagePlan) => stagePlan.id === record.stageId)
    }));

  const taskWritebackPreview = buildTaskExecutionWritebackRecords(
    taskExecutionRecords,
    taskActivityRecords,
    projectStageTaskLinks,
    projectAllocations
  );
  const taskWritebackProjectCount = new Set(taskWritebackPreview.map((record) => record.sourceProjectId)).size;
  const taskWritebackTaskCount = taskWritebackPreview.reduce((sum, record) => sum + record.sourceTaskIds.length, 0);
  const adapterResults = buildManpowerActualInputAdapterResults();
  const costSummary = buildManpowerCostSummary();
  const projectCostSnapshots = buildProjectCostComparisonSnapshots();
  const stageCostSnapshots = buildStageCostComparisonSnapshots();
  const roleCostSnapshots = buildRoleCostSnapshots();
  const taskWritebackPlannedDays = costSummary.totalPlannedWorkDays;
  const taskWritebackActualDays = costSummary.totalActualWorkDays;
  const taskWritebackEstimatedCost = costSummary.totalActualCost;
  const allocationWritebackPreview = buildAllocationWritebackPreviews();

  function updateRoleDraft(id: string, field: keyof EngineerRoleConfig, value: string) {
    setRoleDrafts((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        if (field === 'defaultDailyRate' || field === 'defaultMonthlyCost' || field === 'defaultCapacity') {
          return { ...item, [field]: Number(value) || 0 };
        }
        if (field === 'defaultUtilization') {
          return { ...item, [field]: Math.max(0, Math.min(1, Number(value) || 0)) };
        }
        return { ...item, [field]: value };
      })
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4 xl:grid-cols-7">
        <InfoCard title="Total projects" value={totalProjects} hint="Included in current filter scope" />
        <InfoCard title="Planned person-days" value={formatPersonDays(totalPlannedPersonDays)} />
        <InfoCard title="Actual person-days" value={formatPersonDays(totalActualPersonDays)} />
        <InfoCard title="Planned cost" value={formatCurrency(totalPlannedCost)} />
        <InfoCard title="Actual cost" value={formatCurrency(totalActualCost)} />
        <InfoCard
          title="Cost variance"
          value={formatCurrency(totalCostVariance)}
          hint={totalCostVariance > 0 ? 'Above baseline plan' : 'Below baseline plan'}
        />
        <InfoCard title="High risk projects" value={highRiskProjects} hint="Project level high risk count" />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
          <div className="min-w-[180px] flex-1">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Project filter</label>
            <select
              value={selectedProjectId}
              onChange={(event) => setSelectedProjectId(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              {filteredProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Status filter</label>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value as ManpowerProjectStatus | 'all')}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              {projectStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Version filter</label>
            <select
              value={selectedVersionId}
              onChange={(event) => setSelectedVersionId(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="all">All active versions</option>
              {manpowerPlanVersions
                .filter((version) => !version.isBaseline)
                .map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Time range</label>
            <div className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-500">2026 Q1 - Q2</div>
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Role filter</label>
            <select
              value={selectedRoleId}
              onChange={(event) => setSelectedRoleId(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="all">All roles</option>
              {manpowerRoleConfigs.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name} / {role.level}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[240px] flex-1">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Display mode</label>
            <div className="flex flex-wrap gap-2">
              {manpowerViewModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDisplayMode(mode)}
                  className={`rounded-md border px-3 py-2 text-sm ${
                    displayMode === mode
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
          Current mode: <span className="font-medium text-slate-900">{displayMode}</span>. This v0 keeps the structure explicit for later real-data wiring.
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="font-medium text-slate-900">Multi-project summary</h2>
            <p className="text-sm text-slate-500">Project, current version, baseline, plan, actual and variance at one level.</p>
          </div>
          <StatusBadge label={`${filteredProjects.length} projects`} tone="muted" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Current version</th>
                <th className="px-4 py-3">Baseline</th>
                <th className="px-4 py-3">Planned PD</th>
                <th className="px-4 py-3">Actual PD</th>
                <th className="px-4 py-3">Planned cost</th>
                <th className="px-4 py-3">Actual cost</th>
                <th className="px-4 py-3">Variance</th>
                <th className="px-4 py-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {projectComparisonRows.map(({ project, comparison, baseline, currentVersion: rowVersion }) => (
                <tr
                  key={project.id}
                  className={`border-t border-slate-100 ${selectedProject?.id === project.id ? 'bg-slate-50' : 'bg-white'}`}
                >
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setSelectedProjectId(project.id)} className="text-left">
                      <div className="font-medium text-slate-900">{project.name}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span>{project.code}</span>
                        <StatusBadge label={project.status} tone={projectStatusTone(project.status)} />
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-3">{rowVersion?.name ?? '-'}</td>
                  <td className="px-4 py-3">{baseline?.name ?? '-'}</td>
                  <td className="px-4 py-3">{formatPersonDays(comparison!.plannedPersonDays)}</td>
                  <td className="px-4 py-3">{formatPersonDays(comparison!.actualPersonDays)}</td>
                  <td className="px-4 py-3">{formatCurrency(comparison!.plannedCost)}</td>
                  <td className="px-4 py-3">{formatCurrency(comparison!.actualCost)}</td>
                  <td className={`px-4 py-3 font-medium ${comparison!.costVariance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {comparison!.costVariance > 0 ? '+' : ''}
                    {formatCurrency(comparison!.costVariance)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge label={comparison!.riskNote} tone={comparisonTone(comparison!.riskLevel)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="font-medium text-slate-900">Project stage breakdown</h2>
              <p className="text-sm text-slate-500">Stage elasticity, planned effort, actual input and variance for the selected project.</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge label={`Current ${currentVersion?.name ?? '-'}`} tone="default" />
              <StatusBadge label={`Baseline ${baselineVersion?.name ?? '-'}`} tone="muted" />
            </div>
          </div>
          <div className="grid gap-4 border-b border-slate-200 px-4 py-4 md:grid-cols-4">
            <div className="rounded-md bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">Owner</div>
              <div className="mt-2 text-sm font-medium text-slate-900">{selectedProject?.owner}</div>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">Timeline</div>
              <div className="mt-2 text-sm font-medium text-slate-900">
                {selectedProject?.startDate} to {selectedProject?.endDate}
              </div>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">Current version note</div>
              <div className="mt-2 text-sm text-slate-700">{currentVersion?.description}</div>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">Baseline note</div>
              <div className="mt-2 text-sm text-slate-700">{baselineVersion?.description}</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Planned PD</th>
                  <th className="px-4 py-3">Actual PD</th>
                  <th className="px-4 py-3">Planned cost</th>
                  <th className="px-4 py-3">Actual cost</th>
                  <th className="px-4 py-3">Variance</th>
                  <th className="px-4 py-3">Elasticity</th>
                  <th className="px-4 py-3">Risk note</th>
                </tr>
              </thead>
              <tbody>
                {stageComparisonRows.map(({ stagePlan, comparison, actualInput }) => (
                  <tr key={stagePlan.id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{stagePlan.stageName}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {stagePlan.plannedStartDate} - {stagePlan.plannedEndDate}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {stagePlan.plannedRoleIds.map((roleId) => {
                          const role = manpowerRoleConfigs.find((item) => item.id === roleId);
                          return <StatusBadge key={roleId} label={role?.name ?? roleId} tone="muted" />;
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">{formatPersonDays(stagePlan.plannedPersonDays)}</td>
                    <td className="px-4 py-3">
                      {comparison
                        ? formatPersonDays(comparison.actualPersonDays)
                        : actualInput
                          ? formatPersonDays(actualInput.actualPersonDays)
                          : 'Pending input'}
                    </td>
                    <td className="px-4 py-3">{formatCurrency(stagePlan.plannedCost)}</td>
                    <td className="px-4 py-3">
                      {comparison
                        ? formatCurrency(comparison.actualCost)
                        : actualInput
                          ? formatCurrency(actualInput.actualCost)
                          : 'Pending input'}
                    </td>
                    <td className={`px-4 py-3 font-medium ${comparison && comparison.costVariance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {comparison ? `${comparison.costVariance > 0 ? '+' : ''}${formatCurrency(comparison.costVariance)}` : stagePlan.comparisonPlaceholder}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{stagePlan.elasticityFactor.toFixed(2)}</div>
                      <div className="mt-1 text-xs text-slate-500">{stagePlan.elasticityNote}</div>
                    </td>
                    <td className="px-4 py-3">
                      {comparison ? (
                        <StatusBadge label={comparison.riskNote} tone={comparisonTone(comparison.riskLevel)} />
                      ) : (
                        <span className="text-slate-500">{stagePlan.actualInputPlaceholder}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Version context</h2>
          <div className="mt-4 space-y-3 text-sm">
            {selectedProjectVersions.map((version) => (
              <div key={version.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium text-slate-900">{version.name}</div>
                    <div className="mt-1 text-slate-500">{version.createdAt}</div>
                  </div>
                  <div className="flex gap-2">
                    {version.isBaseline ? <StatusBadge label="Baseline" tone="warning" /> : null}
                    <StatusBadge label={version.status} tone={version.isBaseline ? 'warning' : 'default'} />
                  </div>
                </div>
                <p className="mt-2 text-slate-600">{version.description}</p>
                <p className="mt-2 text-xs text-slate-500">Source type: {version.sourceType}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="font-medium text-slate-900">Role configuration</h2>
            <p className="text-sm text-slate-500">Local editable draft for role cost assumptions. No backend save in this round.</p>
          </div>
          <StatusBadge label="Local draft mode" tone="warning" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Daily rate</th>
                <th className="px-4 py-3">Monthly cost</th>
                <th className="px-4 py-3">Utilization</th>
                <th className="px-4 py-3">Capacity cap</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {roleDrafts.map((role) => (
                <tr key={role.id} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{role.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{role.roleType}</div>
                  </td>
                  <td className="px-4 py-3">
                    <input value={role.level} onChange={(event) => updateRoleDraft(role.id, 'level', event.target.value)} className="w-20 rounded-md border border-slate-300 px-2 py-1.5" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" value={role.defaultDailyRate} onChange={(event) => updateRoleDraft(role.id, 'defaultDailyRate', event.target.value)} className="w-24 rounded-md border border-slate-300 px-2 py-1.5" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" value={role.defaultMonthlyCost} onChange={(event) => updateRoleDraft(role.id, 'defaultMonthlyCost', event.target.value)} className="w-28 rounded-md border border-slate-300 px-2 py-1.5" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" min="0" max="1" step="0.01" value={role.defaultUtilization} onChange={(event) => updateRoleDraft(role.id, 'defaultUtilization', event.target.value)} className="w-24 rounded-md border border-slate-300 px-2 py-1.5" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" value={role.defaultCapacity} onChange={(event) => updateRoleDraft(role.id, 'defaultCapacity', event.target.value)} className="w-24 rounded-md border border-slate-300 px-2 py-1.5" />
                  </td>
                  <td className="px-4 py-3">
                    <textarea value={role.notes} onChange={(event) => updateRoleDraft(role.id, 'notes', event.target.value)} rows={2} className="min-w-[220px] rounded-md border border-slate-300 px-2 py-1.5" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Task write-back preview</h2>
          <p className="mt-2 text-sm text-slate-600">
            Preview only. The figures below come from the task execution write-back mapper and are reserved for future manpower actual input integration.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">Writable scope</div>
              <div className="mt-2">Projects: {taskWritebackProjectCount}</div>
              <div className="mt-1">Tasks: {taskWritebackTaskCount}</div>
              <div className="mt-1">Status: mock preview</div>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">Aggregated work days</div>
              <div className="mt-2">Planned: {taskWritebackPlannedDays}</div>
              <div className="mt-1">Actual: {taskWritebackActualDays}</div>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">Estimated actual cost</div>
              <div className="mt-2">{formatCurrency(taskWritebackEstimatedCost)}</div>
              <div className="mt-1 text-xs text-slate-500">Built from task execution, activity and allocation records.</div>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">JSON import guide</h2>
          <p className="mt-2 text-sm text-slate-600">
            Upload is not implemented in v0, but the contract for actual input JSON, role formula parameters, stage actuals and version comparison is already reserved.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">Supported objects</div>
              <ul className="mt-2 space-y-2">
                <li>`versionContext` for current actual and baseline comparison scope.</li>
                <li>`roleFormulaParams` for rate and cost factors.</li>
                <li>`actualStageInputs` for stage-level actual person-days and cost.</li>
                <li>`comparisonOverrides` for risk note and variance reason overrides.</li>
              </ul>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">Future analysis flow</div>
              <ul className="mt-2 space-y-2">
                <li>1. Validate project, version, stage and role IDs.</li>
                <li>2. Map input into `ActualInputRecord` and formula parameter store.</li>
                <li>3. Generate `CostComparisonRecord` for project and stage layers.</li>
                <li>4. Refresh risk summaries, overspend projects and stage alerts.</li>
              </ul>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-slate-950 p-4 text-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Sample JSON contract</h2>
            <StatusBadge label="Placeholder" tone="muted" />
          </div>
          <pre className="mt-4 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-6 text-slate-200">
            <code>{JSON.stringify(manpowerJsonImportContract, null, 2)}</code>
          </pre>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Allocation basis preview</h2>
          <p className="mt-2 text-sm text-slate-600">
            Allocation-level write-back preview is reserved for later actual input adapter mapping from resource allocation into manpower actual input.
          </p>
          <div className="mt-4 space-y-3">
            {allocationWritebackPreview.slice(0, 5).map((preview) => (
              <div key={preview.id} className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
                <div className="font-medium text-slate-900">{preview.projectId} / {preview.personId}</div>
                <div className="mt-1">Actual work days: {preview.actualWorkDays}</div>
                <div className="mt-1">Estimated cost: {formatCurrency(preview.estimatedActualCost)}</div>
                <div className="mt-1 text-xs text-slate-500">{preview.notes}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Allocation rule note</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="rounded-md bg-slate-50 p-3">
              <div className="font-medium text-slate-900">Task to allocation mapping</div>
              <p className="mt-1">`relatedAllocationIds` is used as the first-layer bridge from task execution into allocation-level actual effort.</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <div className="font-medium text-slate-900">Allocation to manpower mapping</div>
              <p className="mt-1">Allocation preview will be consumed by the next manpower adapter layer instead of directly overwriting current mock actual inputs.</p>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="font-medium text-slate-900">Project cost comparison snapshot</h2>
            <p className="text-sm text-slate-500">Built from adapter results so plan vs actual vs variance is no longer only static comparison mock.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Planned days</th>
                  <th className="px-4 py-3">Actual days</th>
                  <th className="px-4 py-3">Planned cost</th>
                  <th className="px-4 py-3">Actual cost</th>
                  <th className="px-4 py-3">Variance</th>
                  <th className="px-4 py-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {projectCostSnapshots.map((snapshot) => (
                  <tr key={snapshot.projectId} className="border-t border-slate-100">
                    <td className="px-4 py-3">{manpowerProjects.find((project) => project.id === snapshot.projectId)?.name ?? snapshot.projectId}</td>
                    <td className="px-4 py-3">{snapshot.plannedWorkDays}</td>
                    <td className="px-4 py-3">{snapshot.actualWorkDays}</td>
                    <td className="px-4 py-3">{formatCurrency(snapshot.plannedCost)}</td>
                    <td className="px-4 py-3">{formatCurrency(snapshot.actualCost)}</td>
                    <td className="px-4 py-3">{formatCurrency(snapshot.varianceCost)}</td>
                    <td className="px-4 py-3"><StatusBadge label={snapshot.riskLevel} tone={comparisonTone(snapshot.riskLevel)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Role cost snapshot</h2>
          <div className="mt-4 space-y-3">
            {roleCostSnapshots.slice(0, 5).map((snapshot) => (
              <div key={snapshot.roleId} className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
                <div className="font-medium text-slate-900">{snapshot.roleName}</div>
                <div className="mt-1">Mapped actual days: {snapshot.mappedActualWorkDays}</div>
                <div className="mt-1">Estimated actual cost: {formatCurrency(snapshot.estimatedActualCost)}</div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <RuleContextPanel
          title="Calculation rules / 计算口径"
          rules={[
            { name: 'Task write-back to actual input', detail: '任务回写实际工天通过 actual input adapter 进入人力成本层，并与已有 actual input 取较大值形成保守口径。' },
            { name: 'Allocation participation', detail: 'allocation write-back preview 作为第二来源参与 actual cost 估算，但当前不直接覆盖原始 mock 数据。' },
            { name: 'Role rate conversion', detail: '默认使用角色日单价做工天成本估算，月成本字段仅作为后续更精细换算的保留位。' },
            { name: 'Comparison output', detail: '统一输出项目层与阶段层 planned vs actual vs variance snapshot，供后续页面和导入链复用。' }
          ]}
        />
        <SnapshotContextPanel title="Snapshot context / 快照口径" context={costSummary.snapshotContext} />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Variance analysis</h2>
          <p className="mt-2 text-sm text-slate-600">Highest cost variance projects</p>
          <div className="mt-4 space-y-3">
            {highCostProjects.map(({ project, comparison }) => (
              <div key={project.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-slate-900">{project.name}</div>
                  <StatusBadge label={comparison!.riskLevel} tone={comparisonTone(comparison!.riskLevel)} />
                </div>
                <div className="mt-2 text-sm text-rose-600">Cost variance {formatCurrency(comparison!.costVariance)}</div>
                <div className="mt-1 text-xs text-slate-500">{comparison!.riskNote}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Largest PD variance projects</h2>
          <div className="mt-4 space-y-3">
            {highVarianceProjects.map(({ project, comparison }) => (
              <div key={project.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-slate-900">{project.name}</div>
                  <span className={`text-sm font-medium ${comparison!.personDaysVariance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {comparison!.personDaysVariance > 0 ? '+' : ''}
                    {comparison!.personDaysVariance} PD
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500">Variance rate {percentFormatter.format(comparison!.varianceRate)}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Stage overspend alerts</h2>
          <div className="mt-4 space-y-3">
            {stageAlerts.map(({ comparison, project, stagePlan }) => (
              <div key={comparison.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-slate-900">
                    {project?.name} / {stagePlan?.stageName}
                  </div>
                  <StatusBadge label={comparison.riskLevel} tone={comparisonTone(comparison.riskLevel)} />
                </div>
                <div className="mt-2 text-sm text-rose-600">
                  Cost variance {formatCurrency(comparison.costVariance)} / PD variance {comparison.personDaysVariance > 0 ? '+' : ''}
                  {comparison.personDaysVariance}
                </div>
                <div className="mt-1 text-xs text-slate-500">{comparison.riskNote}</div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
