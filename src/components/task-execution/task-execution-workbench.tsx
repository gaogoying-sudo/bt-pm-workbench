'use client';

import { useEffect, useState } from 'react';
import { InfoCard } from '@/components/ui/info-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { manpowerProjects } from '@/data/manpower/manpower-projects';
import { manpowerStagePlans } from '@/data/manpower/manpower-stage-plans';
import { peopleResources } from '@/data/resources/people-resources';
import { resourceRoles } from '@/data/resources/resource-roles';
import { projectAllocations } from '@/data/resources/project-allocations';
import { projectStageTaskLinks } from '@/data/task-execution/project-stage-task-links';
import { taskActivityRecords } from '@/data/task-execution/task-activity-records';
import { taskDependencies } from '@/data/task-execution/task-dependencies';
import { taskExecutionRecords } from '@/data/task-execution/task-execution-records';
import { taskViewPresets } from '@/data/task-execution/task-view-presets';
import { TaskPriority, TaskStatus } from '@/lib/types/task-execution';
import { buildAllocationConsumptionAggregates } from '@/lib/task-execution/allocation-consumption-selectors';
import { buildResourceAllocationAggregates } from '@/lib/resources/allocation-selectors';
import { buildAllocationWritebackPreviews } from '@/lib/resources/allocation-writeback-mappers';
import { buildPersonTaskLoadAggregates } from '@/lib/task-execution/person-load-selectors';
import { buildProjectExecutionAggregates } from '@/lib/task-execution/project-aggregate-selectors';
import { buildStageExecutionAggregates } from '@/lib/task-execution/stage-aggregate-selectors';
import { buildTaskExecutionAggregates } from '@/lib/task-execution/task-aggregate-selectors';
import { buildTaskExecutionWritebackRecords } from '@/lib/task-execution/writeback-mappers';
import { MOCK_TODAY } from '@/lib/task-execution/summary-builders';
import { commonViewModes, taskStatusOptions as sharedTaskStatusOptions } from '@/lib/view-config/filter-options';

const percentFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const priorityOptions: Array<{ label: string; value: TaskPriority | 'all' }> = [
  { label: 'All priority', value: 'all' },
  { label: 'P0', value: 'p0' },
  { label: 'P1', value: 'p1' },
  { label: 'P2', value: 'p2' },
  { label: 'P3', value: 'p3' }
];

function taskStatusTone(status: TaskStatus) {
  if (status === 'done') return 'success' as const;
  if (status === 'blocked' || status === 'at-risk') return 'danger' as const;
  if (status === 'in-progress' || status === 'ready') return 'warning' as const;
  return 'muted' as const;
}

function riskTone(level: 'low' | 'medium' | 'high') {
  if (level === 'high') return 'danger' as const;
  if (level === 'medium') return 'warning' as const;
  return 'success' as const;
}

export function TaskExecutionWorkbench() {
  const [selectedTaskId, setSelectedTaskId] = useState(taskExecutionRecords[0]?.id ?? '');
  const [selectedProjectId, setSelectedProjectId] = useState<string | 'all'>('all');
  const [selectedStageId, setSelectedStageId] = useState<string | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all');
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | 'all'>('all');
  const [viewMode, setViewMode] = useState<(typeof commonViewModes.task)[number]>(commonViewModes.task[0]);

  const filteredTasks = taskExecutionRecords.filter((task) => {
    if (selectedProjectId !== 'all' && task.projectId !== selectedProjectId) return false;
    if (selectedStageId !== 'all' && task.stageId !== selectedStageId) return false;
    if (selectedStatus !== 'all' && task.status !== selectedStatus) return false;
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
    if (selectedOwnerId !== 'all' && task.ownerPersonId !== selectedOwnerId) return false;
    return true;
  });

  useEffect(() => {
    if (!filteredTasks.some((task) => task.id === selectedTaskId)) {
      setSelectedTaskId(filteredTasks[0]?.id ?? taskExecutionRecords[0]?.id ?? '');
    }
  }, [filteredTasks, selectedTaskId]);

  const selectedTask = filteredTasks.find((task) => task.id === selectedTaskId) ?? filteredTasks[0] ?? taskExecutionRecords[0];
  const selectedTaskChildren = taskExecutionRecords.filter((task) => task.parentTaskId === selectedTask?.id);
  const selectedTaskParent = taskExecutionRecords.find((task) => task.id === selectedTask?.parentTaskId);
  const selectedTaskDependencies = taskDependencies.filter((dependency) => dependency.fromTaskId === selectedTask?.id || dependency.toTaskId === selectedTask?.id);
  const selectedTaskActivities = taskActivityRecords.filter((activity) => activity.taskId === selectedTask?.id);

  const taskAggregates = buildTaskExecutionAggregates(taskExecutionRecords, taskActivityRecords, MOCK_TODAY);
  const stageAggregates = buildStageExecutionAggregates(projectStageTaskLinks, taskExecutionRecords, taskActivityRecords, MOCK_TODAY);
  const projectAggregates = buildProjectExecutionAggregates(projectStageTaskLinks, taskExecutionRecords, taskActivityRecords, MOCK_TODAY);
  const personLoadAggregates = buildPersonTaskLoadAggregates(peopleResources, taskExecutionRecords, taskActivityRecords, MOCK_TODAY);
  const allocationAggregates = buildAllocationConsumptionAggregates(projectAllocations, taskExecutionRecords, taskActivityRecords, MOCK_TODAY);
  const resourceAllocationAggregates = buildResourceAllocationAggregates();
  const allocationWritebackPreviews = buildAllocationWritebackPreviews();
  const writebackRecords = buildTaskExecutionWritebackRecords(
    taskExecutionRecords,
    taskActivityRecords,
    projectStageTaskLinks,
    projectAllocations,
    MOCK_TODAY
  );

  const totalTasks = taskAggregates.length;
  const inProgressTasks = taskAggregates.filter((aggregate) => aggregate.progressStatus === 'in-progress').length;
  const blockedTasks = taskAggregates.filter((aggregate) => aggregate.progressStatus === 'blocked').length;
  const highRiskTasks = taskAggregates.filter((aggregate) => aggregate.riskLevel === 'high').length;
  const doneTasks = taskAggregates.filter((aggregate) => aggregate.progressStatus === 'done').length;
  const overdueTasks = taskAggregates.filter((aggregate) => aggregate.overdueFlag).length;
  const crossProjectOwners = new Set(
    peopleResources.filter((person) => {
      const ownedProjects = new Set(taskExecutionRecords.filter((task) => task.ownerPersonId === person.id).map((task) => task.projectId));
      return ownedProjects.size > 1;
    }).map((person) => person.id)
  ).size;

  const stageBreakdowns = stageAggregates.filter((aggregate) => aggregate.taskCount > 0);
  const personLoadRows = personLoadAggregates.filter(
    (aggregate) => aggregate.ownedTaskCount > 0 || aggregate.collaboratorTaskCount > 0
  );

  const blockerTasks = taskExecutionRecords.filter((task) => task.status === 'blocked');
  const highRiskDependencies = taskDependencies.filter((dependency) => {
    const from = taskExecutionRecords.find((task) => task.id === dependency.fromTaskId);
    const to = taskExecutionRecords.find((task) => task.id === dependency.toTaskId);
    return dependency.status === 'active' && (from?.riskLevel === 'high' || to?.riskLevel === 'high');
  });
  const priorityActionTasks = taskExecutionRecords.filter(
    (task) => (task.status === 'blocked' || task.riskLevel === 'high') && (task.priority === 'p0' || task.priority === 'p1')
  );

  const selectedTaskAggregate = taskAggregates.find((aggregate) => aggregate.taskId === selectedTask?.id);
  const selectedTaskAllocationDetails = resourceAllocationAggregates.filter((aggregate) => selectedTask?.relatedAllocationIds.includes(aggregate.allocationId));
  const totalPlannedWorkDays = taskAggregates.reduce((sum, aggregate) => sum + aggregate.plannedWorkDays, 0);
  const totalActualWorkDays = taskAggregates.reduce((sum, aggregate) => sum + aggregate.normalizedActualWorkDays, 0);
  const readyWritebackCount = writebackRecords.filter((record) => record.writebackStatus === 'ready').length;
  const writebackEstimatedCost = writebackRecords.reduce((sum, record) => sum + record.estimatedActualCost, 0);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4 xl:grid-cols-7">
        <InfoCard title="Total tasks" value={totalTasks} />
        <InfoCard title="In progress" value={inProgressTasks} />
        <InfoCard title="Blocked" value={blockedTasks} />
        <InfoCard title="High risk" value={highRiskTasks} />
        <InfoCard title="Done" value={doneTasks} />
        <InfoCard title="Overdue" value={overdueTasks} />
        <InfoCard title="Cross-project owners" value={crossProjectOwners} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
          <div className="min-w-[160px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Project filter</label>
            <select value={selectedProjectId} onChange={(event) => setSelectedProjectId(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="all">All projects</option>
              {manpowerProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Stage filter</label>
            <select value={selectedStageId} onChange={(event) => setSelectedStageId(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="all">All stages</option>
              {manpowerStagePlans.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.stageName} / {manpowerProjects.find((project) => project.id === stage.projectId)?.code}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Status filter</label>
            <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as TaskStatus | 'all')} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              {sharedTaskStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Priority filter</label>
            <select value={selectedPriority} onChange={(event) => setSelectedPriority(event.target.value as TaskPriority | 'all')} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Owner filter</label>
            <select value={selectedOwnerId} onChange={(event) => setSelectedOwnerId(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="all">All owners</option>
              {peopleResources.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.displayName}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[260px] flex-1">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Display mode</label>
            <div className="flex flex-wrap gap-2">
              {commonViewModes.task.map((mode) => (
                <button key={mode} type="button" onClick={() => setViewMode(mode)} className={`rounded-md border px-3 py-2 text-sm ${viewMode === mode ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
          Current mode: <span className="font-medium text-slate-900">{viewMode}</span>. Presets reserved for future task boards: {taskViewPresets.map((preset) => preset.name).join(' / ')}.
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="font-medium text-slate-900">Task table</h2>
              <p className="text-sm text-slate-500">Execution chain from project to stage, owner, collaboration, progress and risk.</p>
            </div>
            <StatusBadge label={`${filteredTasks.length} tasks`} tone="muted" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Task</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Collaborators</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Planned window</th>
                  <th className="px-4 py-3">Actual days</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Blocker</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} className={`border-t border-slate-100 ${selectedTask?.id === task.id ? 'bg-slate-50' : 'bg-white'}`}>
                    <td className="px-4 py-3">{task.taskCode}</td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => setSelectedTaskId(task.id)} className="text-left">
                        <div className="font-medium text-slate-900">{task.title}</div>
                        <div className="text-xs text-slate-500">{task.taskType}</div>
                      </button>
                    </td>
                    <td className="px-4 py-3">{manpowerProjects.find((project) => project.id === task.projectId)?.name ?? task.projectId}</td>
                    <td className="px-4 py-3">{manpowerStagePlans.find((stage) => stage.id === task.stageId)?.stageName ?? task.stageId}</td>
                    <td className="px-4 py-3">{task.taskLevel}</td>
                    <td className="px-4 py-3">{peopleResources.find((person) => person.id === task.ownerPersonId)?.displayName ?? task.ownerPersonId}</td>
                    <td className="px-4 py-3">{task.collaboratorPersonIds.length}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={task.status} tone={taskStatusTone(task.status)} />
                    </td>
                    <td className="px-4 py-3">{task.priority}</td>
                    <td className="px-4 py-3">{percentFormatter.format(task.progress)}</td>
                    <td className="px-4 py-3">{task.plannedStartDate} to {task.plannedEndDate}</td>
                    <td className="px-4 py-3">{task.actualWorkDays} / {task.estimatedWorkDays}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={task.riskLevel} tone={riskTone(task.riskLevel)} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">{task.blockerSummary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Task detail</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-md bg-slate-50 p-3">
              <div className="text-lg font-semibold text-slate-900">{selectedTask?.title}</div>
              <div className="mt-1 text-sm text-slate-500">{selectedTask?.taskCode}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge label={selectedTask?.status} tone={selectedTask ? taskStatusTone(selectedTask.status) : 'muted'} />
                <StatusBadge label={selectedTask?.priority} tone="warning" />
                <StatusBadge label={selectedTask?.riskLevel} tone={selectedTask ? riskTone(selectedTask.riskLevel) : 'muted'} />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
                <div className="text-xs uppercase tracking-wide text-slate-500">Project and stage</div>
                <div className="mt-2">Project: {manpowerProjects.find((project) => project.id === selectedTask?.projectId)?.name}</div>
                <div className="mt-1">Stage: {manpowerStagePlans.find((stage) => stage.id === selectedTask?.stageId)?.stageName}</div>
                <div className="mt-1">Type / level: {selectedTask?.taskType} / {selectedTask?.taskLevel}</div>
              </div>
              <div className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
                <div className="text-xs uppercase tracking-wide text-slate-500">Owner and collaborators</div>
                <div className="mt-2">Owner: {peopleResources.find((person) => person.id === selectedTask?.ownerPersonId)?.displayName}</div>
                <div className="mt-1">Collaborators: {selectedTask?.collaboratorPersonIds.map((personId) => peopleResources.find((person) => person.id === personId)?.displayName ?? personId).join(', ') || 'None'}</div>
                <div className="mt-1">Related allocations: {selectedTask?.relatedAllocationIds.join(', ') || 'None'}</div>
              </div>
            </div>

            <div className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
              <div className="text-xs uppercase tracking-wide text-slate-500">Parent and children</div>
              <div className="mt-2">Parent task: {selectedTaskParent ? `${selectedTaskParent.taskCode} / ${selectedTaskParent.title}` : 'None'}</div>
              <div className="mt-1">Child tasks: {selectedTaskChildren.map((task) => task.taskCode).join(', ') || 'None'}</div>
            </div>

            <div className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
              <div className="text-xs uppercase tracking-wide text-slate-500">Dependencies and progress</div>
              <div className="mt-2">Dependencies: {selectedTaskDependencies.map((dependency) => dependency.id).join(', ') || 'None'}</div>
              <div className="mt-1">Progress: {selectedTaskAggregate ? percentFormatter.format(selectedTaskAggregate.progress) : '-'}</div>
              <div className="mt-1">Planned: {selectedTask?.plannedStartDate} to {selectedTask?.plannedEndDate}</div>
              <div className="mt-1">Actual: {selectedTask?.actualStartDate ?? 'Not started'} to {selectedTask?.actualEndDate ?? 'Open'}</div>
            </div>

            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <div className="text-xs uppercase tracking-wide text-amber-700">Risk and blocker</div>
              <div className="mt-2">Risk: {selectedTask?.riskLevel}</div>
              <div className="mt-1">Blocker: {selectedTask?.blockerSummary}</div>
              <div className="mt-1">Deliverable: {selectedTask?.deliverableSummary}</div>
              <div className="mt-1">Notes: {selectedTask?.notes}</div>
            </div>

            <div className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
              <div className="text-xs uppercase tracking-wide text-slate-500">Execution record summary</div>
              <div className="mt-2">Activity count: {selectedTaskActivities.length}</div>
              <div className="mt-1">Normalized actual days: {selectedTaskAggregate?.normalizedActualWorkDays ?? 0}</div>
              <div className="mt-1">Latest record: {selectedTaskActivities[0]?.recordType ?? 'No record yet'}</div>
              <div className="mt-1">Latest comment: {selectedTaskActivities[0]?.comment ?? 'Execution log placeholder reserved for future input.'}</div>
            </div>

            <div className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
              <div className="text-xs uppercase tracking-wide text-slate-500">Allocation linkage summary</div>
              <div className="mt-2">Related allocations: {selectedTaskAllocationDetails.length}</div>
              <div className="mt-1">Allocation work days: {selectedTaskAllocationDetails.reduce((sum, item) => sum + item.actualWorkDays, 0)}</div>
              <div className="mt-1">Conflict flags: {selectedTaskAllocationDetails.filter((item) => item.conflictFlag).length}</div>
              <div className="mt-1 text-xs text-slate-500">
                {selectedTaskAllocationDetails.map((item) => `${item.allocationId}:${Math.round(item.allocationRate * 100)}%`).join(' / ') || 'No allocation aggregate bound to this task.'}
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="font-medium text-slate-900">Project stage task breakdown</h2>
              <p className="text-sm text-slate-500">Task distribution and weighted stage progress for project execution.</p>
            </div>
            <StatusBadge label={`${stageBreakdowns.length} stage rows`} tone="muted" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Tasks</th>
                  <th className="px-4 py-3">In progress</th>
                  <th className="px-4 py-3">Blocked</th>
                  <th className="px-4 py-3">Done</th>
                  <th className="px-4 py-3">Stage progress</th>
                  <th className="px-4 py-3">Risk hint</th>
                </tr>
              </thead>
              <tbody>
                {stageBreakdowns.map((row) => (
                  <tr key={`${row.projectId}-${row.stageId}`} className="border-t border-slate-100">
                    <td className="px-4 py-3">{manpowerProjects.find((project) => project.id === row.projectId)?.name ?? row.projectId}</td>
                    <td className="px-4 py-3">{manpowerStagePlans.find((stage) => stage.id === row.stageId)?.stageName ?? row.stageId}</td>
                    <td className="px-4 py-3">{row.taskCount}</td>
                    <td className="px-4 py-3">{row.inProgressTaskCount}</td>
                    <td className="px-4 py-3">{row.blockedTaskCount}</td>
                    <td className="px-4 py-3">{row.completedTaskCount}</td>
                    <td className="px-4 py-3">{percentFormatter.format(row.weightedProgress)}</td>
                    <td className="px-4 py-3">{row.riskSummary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="font-medium text-slate-900">People task load</h2>
            <p className="text-sm text-slate-500">Read-only load summary using people and resource records.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Person</th>
                  <th className="px-4 py-3">Primary role</th>
                  <th className="px-4 py-3">Tasks</th>
                  <th className="px-4 py-3">In progress</th>
                  <th className="px-4 py-3">High priority</th>
                  <th className="px-4 py-3">Blocker links</th>
                  <th className="px-4 py-3">Utilization ref</th>
                  <th className="px-4 py-3">Availability ref</th>
                </tr>
              </thead>
              <tbody>
                {personLoadRows.map((row) => {
                  const person = peopleResources.find((item) => item.id === row.personId);
                  return (
                  <tr key={row.personId} className="border-t border-slate-100">
                    <td className="px-4 py-3">{person?.displayName ?? row.personId}</td>
                    <td className="px-4 py-3">{resourceRoles.find((role) => role.id === person?.primaryRoleId)?.name ?? person?.primaryRoleId ?? '-'}</td>
                    <td className="px-4 py-3">{row.ownedTaskCount + row.collaboratorTaskCount}</td>
                    <td className="px-4 py-3">{row.inProgressTaskCount}</td>
                    <td className="px-4 py-3">{row.highPriorityTaskCount}</td>
                    <td className="px-4 py-3">{row.blockedTaskCount}</td>
                    <td className="px-4 py-3">{percentFormatter.format(row.utilizationReference)}</td>
                    <td className="px-4 py-3">{row.availabilityReference}</td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Dependency chain summary</h2>
          <div className="mt-4 space-y-3">
            {taskDependencies.map((dependency) => {
              const from = taskExecutionRecords.find((task) => task.id === dependency.fromTaskId);
              const to = taskExecutionRecords.find((task) => task.id === dependency.toTaskId);
              return (
                <div key={dependency.id} className="rounded-md border border-slate-200 p-3">
                  <div className="font-medium text-slate-900">{from?.taskCode} to {to?.taskCode}</div>
                  <div className="mt-1 text-sm text-slate-700">{dependency.dependencyType} / {dependency.status}</div>
                  <div className="mt-1 text-xs text-slate-500">{dependency.notes}</div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Current blockers and high-risk dependencies</h2>
          <div className="mt-4 space-y-3">
            {blockerTasks.map((task) => (
              <div key={task.id} className="rounded-md border border-rose-200 bg-rose-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-rose-900">{task.taskCode}</div>
                  <StatusBadge label={task.status} tone="danger" />
                </div>
                <div className="mt-2 text-sm text-rose-900">{task.blockerSummary}</div>
              </div>
            ))}
            {highRiskDependencies.map((dependency) => (
              <div key={dependency.id} className="rounded-md border border-amber-200 bg-amber-50 p-3">
                <div className="font-medium text-amber-900">{dependency.id}</div>
                <div className="mt-1 text-sm text-amber-900">{dependency.notes}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Priority actions</h2>
          <div className="mt-4 space-y-3">
            {priorityActionTasks.map((task) => (
              <div key={task.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-slate-900">{task.taskCode}</div>
                  <StatusBadge label={task.priority} tone="warning" />
                </div>
                <div className="mt-1 text-sm text-slate-700">{task.title}</div>
                <div className="mt-1 text-xs text-slate-500">{task.blockerSummary}</div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="font-medium text-slate-900">Execution write-back summary</h2>
              <p className="text-sm text-slate-500">Aggregated from task records, activity logs and project allocations for downstream cost write-back.</p>
            </div>
            <StatusBadge label={`${readyWritebackCount}/${writebackRecords.length} ready`} tone="warning" />
          </div>
          <div className="grid gap-4 border-b border-slate-200 px-4 py-4 md:grid-cols-4">
            <InfoCard title="Planned work days" value={totalPlannedWorkDays} />
            <InfoCard title="Actual work days" value={totalActualWorkDays} />
            <InfoCard title="Write-back projects" value={projectAggregates.filter((item) => item.writebackCostReadyFlag).length} />
            <InfoCard title="Estimated actual cost" value={`CNY ${writebackEstimatedCost}`} />
          </div>
          <div className="grid gap-4 border-b border-slate-200 px-4 py-4 md:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">Project progress snapshot</div>
              <div className="mt-2 space-y-1">
                {projectAggregates.slice(0, 3).map((aggregate) => (
                  <div key={aggregate.projectId}>
                    {manpowerProjects.find((project) => project.id === aggregate.projectId)?.code}: {percentFormatter.format(aggregate.weightedProgress)}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">Stage progress snapshot</div>
              <div className="mt-2 space-y-1">
                {stageAggregates.slice(0, 3).map((aggregate) => (
                  <div key={`${aggregate.projectId}-${aggregate.stageId}`}>
                    {manpowerStagePlans.find((stage) => stage.id === aggregate.stageId)?.stageName}: {percentFormatter.format(aggregate.weightedProgress)}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">Person load snapshot</div>
              <div className="mt-2 space-y-1">
                {personLoadRows.slice(0, 3).map((aggregate) => (
                  <div key={aggregate.personId}>
                    {peopleResources.find((person) => person.id === aggregate.personId)?.displayName}: {aggregate.loadRiskLevel}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">Allocation linkage snapshot</div>
              <div className="mt-2 space-y-1">
                {allocationWritebackPreviews.slice(0, 3).map((preview) => (
                  <div key={preview.id}>
                    {preview.projectId} / {preview.personId}: {preview.actualWorkDays}d
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Task count</th>
                  <th className="px-4 py-3">Planned days</th>
                  <th className="px-4 py-3">Actual days</th>
                  <th className="px-4 py-3">Estimated cost</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {writebackRecords.map((record) => (
                  <tr key={record.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">{manpowerProjects.find((project) => project.id === record.sourceProjectId)?.name ?? record.sourceProjectId}</td>
                    <td className="px-4 py-3">{manpowerStagePlans.find((stage) => stage.id === record.sourceStageId)?.stageName ?? record.sourceStageId}</td>
                    <td className="px-4 py-3">{record.sourceTaskIds.length}</td>
                    <td className="px-4 py-3">{record.aggregatedPlannedWorkDays}</td>
                    <td className="px-4 py-3">{record.aggregatedActualWorkDays}</td>
                    <td className="px-4 py-3">CNY {record.estimatedActualCost}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={record.writebackStatus} tone={record.writebackStatus === 'ready' ? 'success' : 'warning'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
            Data sources: `taskExecutionRecords`, `taskActivityRecords`, `projectStageTaskLinks`, `projectAllocations`.
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Aggregation rules</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="rounded-md bg-slate-50 p-3">
              <div className="font-medium text-slate-900">Actual work day rule</div>
              <p className="mt-1">Task master `actualWorkDays` is kept, activity logs are summed as `activitySpentWorkDays`, and `normalizedActualWorkDays` uses the larger of the two values.</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <div className="font-medium text-slate-900">Weighted progress rule</div>
              <p className="mt-1">Stage progress uses `ProjectStageTaskLink.weight`; if a stage has zero total weight, it falls back to average task progress. Output stays in 0-1.</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <div className="font-medium text-slate-900">Overdue and blocker rule</div>
              <p className="mt-1">Overdue means not done and planned end earlier than {MOCK_TODAY}. Blocker means blocked status, non-empty blocker summary, or blocker activity flag.</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <div className="font-medium text-slate-900">Current scope</div>
              <p className="mt-1">These are v0 mock rules and can be replaced later by real worklog, execution record and cost service inputs without changing page structure.</p>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="font-medium text-slate-900">Execution record placeholder</h2>
              <p className="text-sm text-slate-500">Sample activity records reserved for later progress write-back and worklog input.</p>
            </div>
            <StatusBadge label={`${taskActivityRecords.length} records`} tone="muted" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Task</th>
                  <th className="px-4 py-3">Person</th>
                  <th className="px-4 py-3">Record type</th>
                  <th className="px-4 py-3">Progress delta</th>
                  <th className="px-4 py-3">Spent days</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Blocker</th>
                  <th className="px-4 py-3">Comment</th>
                </tr>
              </thead>
              <tbody>
                {taskActivityRecords.map((record) => (
                  <tr key={record.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">{record.recordDate}</td>
                    <td className="px-4 py-3">{taskExecutionRecords.find((task) => task.id === record.taskId)?.taskCode ?? record.taskId}</td>
                    <td className="px-4 py-3">{peopleResources.find((person) => person.id === record.personId)?.displayName ?? record.personId}</td>
                    <td className="px-4 py-3">{record.recordType}</td>
                    <td className="px-4 py-3">{percentFormatter.format(record.progressDelta)}</td>
                    <td className="px-4 py-3">{record.spentWorkDays}</td>
                    <td className="px-4 py-3">{record.riskFlag ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">{record.blockerFlag ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3 text-slate-600">{record.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Write-back extension notes</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="rounded-md bg-slate-50 p-3">
              <div className="font-medium text-slate-900">Task progress to project progress</div>
              <p className="mt-1">Use `ProjectStageTaskLink.weight` to aggregate task progress into stage and project execution percent.</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <div className="font-medium text-slate-900">Task worklog to manpower and allocations</div>
              <p className="mt-1">Map `TaskActivityRecord.spentWorkDays` and `relatedAllocationIds` into allocation consumption and person load snapshots.</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <div className="font-medium text-slate-900">Task execution to cost analysis</div>
              <p className="mt-1">Combine actual work days with allocation and role rates, then emit data into the manpower cost comparison layer.</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <div className="font-medium text-slate-900">Version and execution expansion</div>
              <p className="mt-1">Future version linkage can attach task snapshots to specific plan versions without changing the current task UI structure.</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
