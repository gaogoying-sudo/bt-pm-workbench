import { ProjectAllocationRecord } from '@/lib/types/people-resources';
import { TaskActivityRecord, TaskExecutionRecord } from '@/lib/types/task-execution';
import { AllocationConsumptionAggregate } from '@/lib/types/task-execution-aggregation';
import { buildTaskExecutionAggregates } from '@/lib/task-execution/task-aggregate-selectors';
import { MOCK_TODAY } from '@/lib/task-execution/summary-builders';

export function buildAllocationConsumptionAggregates(
  allocations: ProjectAllocationRecord[],
  tasks: TaskExecutionRecord[],
  activities: TaskActivityRecord[],
  today: string = MOCK_TODAY
): AllocationConsumptionAggregate[] {
  const taskAggregates = buildTaskExecutionAggregates(tasks, activities, today);

  return allocations.map((allocation) => {
    const relatedTasks = tasks.filter((task) => task.relatedAllocationIds.includes(allocation.id));

    // v0 rule:
    // when a task points to multiple allocation ids, split its task days evenly across them.
    // this avoids double counting in allocation-level consumption summaries.
    const rolledUp = relatedTasks.reduce(
      (sum, task) => {
        const aggregate = taskAggregates.find((item) => item.taskId === task.id);
        const divisor = Math.max(1, task.relatedAllocationIds.length);
        return {
          plannedWorkDays: sum.plannedWorkDays + (aggregate ? aggregate.plannedWorkDays / divisor : 0),
          actualWorkDays: sum.actualWorkDays + (aggregate ? aggregate.actualWorkDays / divisor : 0),
          activitySpentWorkDays: sum.activitySpentWorkDays + (aggregate ? aggregate.activitySpentWorkDays / divisor : 0)
        };
      },
      { plannedWorkDays: 0, actualWorkDays: 0, activitySpentWorkDays: 0 }
    );

    const utilizationPressure =
      allocation.allocationRate > 0 ? rolledUp.actualWorkDays / (allocation.allocationRate * 22) : 0;

    return {
      allocationId: allocation.id,
      personId: allocation.personId,
      projectId: allocation.projectId,
      relatedTaskIds: relatedTasks.map((task) => task.id),
      plannedWorkDays: Number(rolledUp.plannedWorkDays.toFixed(2)),
      actualWorkDays: Number(rolledUp.actualWorkDays.toFixed(2)),
      activitySpentWorkDays: Number(rolledUp.activitySpentWorkDays.toFixed(2)),
      allocationRate: allocation.allocationRate,
      allocationMode: allocation.allocationMode,
      utilizationPressure: Number(utilizationPressure.toFixed(2)),
      writebackReady: relatedTasks.length > 0
    };
  });
}
