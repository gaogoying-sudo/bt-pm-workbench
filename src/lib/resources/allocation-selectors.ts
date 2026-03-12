import { peopleResources } from '@/data/resources/people-resources';
import { projectAllocations } from '@/data/resources/project-allocations';
import { taskActivityRecords } from '@/data/task-execution/task-activity-records';
import { taskExecutionRecords } from '@/data/task-execution/task-execution-records';
import { ResourceAllocationAggregate } from '@/lib/types/resource-allocation';

export function buildResourceAllocationAggregates(): ResourceAllocationAggregate[] {
  return projectAllocations.map((allocation) => {
    const relatedTasks = taskExecutionRecords.filter((task) => task.relatedAllocationIds.includes(allocation.id));
    const plannedWorkDays = relatedTasks.reduce((sum, task) => sum + task.estimatedWorkDays, 0);
    const actualWorkDays = relatedTasks.reduce((sum, task) => {
      const activitySpent = taskActivityRecords
        .filter((activity) => activity.taskId === task.id)
        .reduce((activitySum, activity) => activitySum + activity.spentWorkDays, 0);
      return sum + Math.max(task.actualWorkDays, activitySpent);
    }, 0);
    const person = peopleResources.find((item) => item.id === allocation.personId);
    const totalRate = projectAllocations
      .filter((item) => item.personId === allocation.personId && item.status !== 'closed')
      .reduce((sum, item) => sum + item.allocationRate, 0);

    return {
      allocationId: allocation.id,
      personId: allocation.personId,
      projectId: allocation.projectId,
      roleId: allocation.roleId,
      phaseIds: allocation.phaseIds,
      allocationRate: allocation.allocationRate,
      activeTaskCount: relatedTasks.length,
      plannedWorkDays,
      actualWorkDays,
      conflictFlag: totalRate > 1,
      utilizationPressure: Math.max(totalRate, person?.currentUtilization ?? 0)
    };
  });
}
