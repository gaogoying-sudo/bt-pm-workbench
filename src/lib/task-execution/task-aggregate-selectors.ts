import { TaskActivityRecord, TaskExecutionRecord } from '@/lib/types/task-execution';
import { TaskExecutionAggregate, TaskProgressStatus } from '@/lib/types/task-execution-aggregation';
import { MOCK_TODAY, clampProgress } from '@/lib/task-execution/summary-builders';

function resolveProgressStatus(task: TaskExecutionRecord): TaskProgressStatus {
  if (task.status === 'done') return 'done';
  if (task.status === 'blocked') return 'blocked';
  if (task.status === 'at-risk') return 'at-risk';
  if (task.progress > 0 || task.status === 'in-progress' || task.status === 'ready') return 'in-progress';
  return 'not-started';
}

export function buildTaskExecutionAggregates(
  tasks: TaskExecutionRecord[],
  activities: TaskActivityRecord[],
  today: string = MOCK_TODAY
): TaskExecutionAggregate[] {
  return tasks.map((task) => {
    const taskActivities = activities.filter((activity) => activity.taskId === task.id);
    const activitySpentWorkDays = taskActivities.reduce((sum, activity) => sum + activity.spentWorkDays, 0);

    // v0 rule:
    // - actualWorkDays keeps the task master record's own field.
    // - activitySpentWorkDays keeps execution log input separately.
    // - normalizedActualWorkDays uses max(actualWorkDays, activitySpentWorkDays)
    //   so downstream write-back sees the more complete mock value without losing either source.
    const normalizedActualWorkDays = Math.max(task.actualWorkDays, activitySpentWorkDays);

    const blockerFlag =
      task.status === 'blocked' ||
      (task.blockerSummary.trim().length > 0 && task.blockerSummary !== 'No active blocker.') ||
      taskActivities.some((activity) => activity.blockerFlag);

    const overdueFlag = task.status !== 'done' && new Date(task.plannedEndDate) < new Date(today);

    return {
      taskId: task.id,
      plannedWorkDays: task.estimatedWorkDays,
      actualWorkDays: task.actualWorkDays,
      activitySpentWorkDays,
      normalizedActualWorkDays,
      progress: clampProgress(task.progress),
      progressStatus: resolveProgressStatus(task),
      riskLevel: task.riskLevel,
      blockerFlag,
      overdueFlag,
      ownerPersonId: task.ownerPersonId,
      relatedAllocationIds: task.relatedAllocationIds
    };
  });
}

export function getTaskExecutionAggregateById(
  taskId: string,
  tasks: TaskExecutionRecord[],
  activities: TaskActivityRecord[],
  today: string = MOCK_TODAY
): TaskExecutionAggregate | undefined {
  return buildTaskExecutionAggregates(tasks, activities, today).find((aggregate) => aggregate.taskId === taskId);
}
