import { manpowerRoleConfigs } from '@/data/manpower/manpower-role-configs';
import { sensitiveCostProfiles } from '@/data/resources/sensitive-cost-profiles';
import { peopleResources } from '@/data/resources/people-resources';
import { projectAllocations } from '@/data/resources/project-allocations';
import { resourceRoles } from '@/data/resources/resource-roles';
import { projectStageTaskLinks } from '@/data/task-execution/project-stage-task-links';
import { taskActivityRecords } from '@/data/task-execution/task-activity-records';
import { taskExecutionRecords } from '@/data/task-execution/task-execution-records';
import { ProjectAllocationRecord } from '@/lib/types/people-resources';
import { ProjectStageTaskLink, TaskActivityRecord, TaskExecutionRecord } from '@/lib/types/task-execution';
import { TaskExecutionWritebackRecord } from '@/lib/types/task-execution-aggregation';
import { buildAllocationConsumptionAggregates } from '@/lib/task-execution/allocation-consumption-selectors';
import { buildTaskExecutionAggregates } from '@/lib/task-execution/task-aggregate-selectors';
import { MOCK_TODAY } from '@/lib/task-execution/summary-builders';

function estimateDailyCostByAllocation(allocation: ProjectAllocationRecord): number {
  const sensitiveProfile = sensitiveCostProfiles.find((profile) => profile.personId === allocation.personId);
  if (sensitiveProfile) {
    return sensitiveProfile.monthlyBaseCost / 21;
  }

  const person = peopleResources.find((item) => item.id === allocation.personId);
  const role = resourceRoles.find((item) => item.id === allocation.roleId);
  const roleName = role?.name ?? person?.primaryRoleId ?? '';
  const manpowerRole = manpowerRoleConfigs.find((item) => roleName.toLowerCase().includes(item.name.toLowerCase()));

  if (manpowerRole) {
    return manpowerRole.defaultDailyRate;
  }

  return 2000;
}

export function buildTaskExecutionWritebackRecords(
  tasks: TaskExecutionRecord[] = taskExecutionRecords,
  activities: TaskActivityRecord[] = taskActivityRecords,
  links: ProjectStageTaskLink[] = projectStageTaskLinks,
  allocations: ProjectAllocationRecord[] = projectAllocations,
  today: string = MOCK_TODAY
): TaskExecutionWritebackRecord[] {
  const taskAggregates = buildTaskExecutionAggregates(tasks, activities, today);
  const allocationAggregates = buildAllocationConsumptionAggregates(allocations, tasks, activities, today);
  const keys = [...new Set(tasks.map((task) => `${task.projectId}::${task.stageId}`))];

  return keys.map((key) => {
    const [sourceProjectId, sourceStageId] = key.split('::');
    const scopedTasks = tasks.filter((task) => task.projectId === sourceProjectId && task.stageId === sourceStageId);
    const scopedTaskIds = scopedTasks.map((task) => task.id);
    const scopedTaskAggregates = taskAggregates.filter((aggregate) => scopedTaskIds.includes(aggregate.taskId));
    const targetAllocationIds = [...new Set(scopedTasks.flatMap((task) => task.relatedAllocationIds))];
    const targetPersonIds = [...new Set(scopedTasks.map((task) => task.ownerPersonId))];
    const estimatedActualCost = targetAllocationIds.reduce((sum, allocationId) => {
      const allocation = allocations.find((item) => item.id === allocationId);
      const allocationAggregate = allocationAggregates.find((item) => item.allocationId === allocationId);
      if (!allocation || !allocationAggregate) return sum;
      return sum + allocationAggregate.actualWorkDays * estimateDailyCostByAllocation(allocation);
    }, 0);

    const milestoneLinks = links.filter(
      (link) => link.projectId === sourceProjectId && link.stageId === sourceStageId && link.isMilestoneRelated
    ).length;

    return {
      id: `writeback-${sourceProjectId}-${sourceStageId}`,
      sourceType: 'task-execution-aggregate',
      sourceProjectId,
      sourceStageId,
      sourceTaskIds: scopedTaskIds,
      targetAllocationIds,
      targetPersonIds,
      aggregatedPlannedWorkDays: scopedTaskAggregates.reduce((sum, aggregate) => sum + aggregate.plannedWorkDays, 0),
      aggregatedActualWorkDays: scopedTaskAggregates.reduce((sum, aggregate) => sum + aggregate.normalizedActualWorkDays, 0),
      estimatedActualCost: Number(estimatedActualCost.toFixed(0)),
      writebackStatus: targetAllocationIds.length > 0 ? 'ready' : 'partial',
      notes: `Built from taskExecutionRecords, taskActivityRecords and projectAllocations. Milestone links: ${milestoneLinks}.`
    };
  });
}
