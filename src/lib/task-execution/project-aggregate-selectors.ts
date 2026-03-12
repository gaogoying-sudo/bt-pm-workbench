import { ProjectStageTaskLink, TaskActivityRecord, TaskExecutionRecord } from '@/lib/types/task-execution';
import { ProjectExecutionAggregate } from '@/lib/types/task-execution-aggregation';
import { buildStageExecutionAggregates } from '@/lib/task-execution/stage-aggregate-selectors';
import { buildTaskExecutionAggregates } from '@/lib/task-execution/task-aggregate-selectors';
import { MOCK_TODAY, buildProjectSummaryText, clampProgress } from '@/lib/task-execution/summary-builders';

export function buildProjectExecutionAggregates(
  links: ProjectStageTaskLink[],
  tasks: TaskExecutionRecord[],
  activities: TaskActivityRecord[],
  today: string = MOCK_TODAY
): ProjectExecutionAggregate[] {
  const taskAggregates = buildTaskExecutionAggregates(tasks, activities, today);
  const stageAggregates = buildStageExecutionAggregates(links, tasks, activities, today);
  const projectIds = [...new Set(tasks.map((task) => task.projectId))];

  return projectIds.map((projectId) => {
    const projectTasks = tasks.filter((task) => task.projectId === projectId);
    const projectTaskAggregates = taskAggregates.filter((aggregate) =>
      projectTasks.some((task) => task.id === aggregate.taskId)
    );
    const projectStageAggregates = stageAggregates.filter((aggregate) => aggregate.projectId === projectId);

    const weightedProgress =
      projectStageAggregates.length > 0
        ? projectStageAggregates.reduce((sum, aggregate) => sum + aggregate.weightedProgress, 0) / projectStageAggregates.length
        : projectTaskAggregates.length > 0
          ? projectTaskAggregates.reduce((sum, aggregate) => sum + aggregate.progress, 0) / projectTaskAggregates.length
          : 0;

    const relatedAllocationIds = new Set(projectTasks.flatMap((task) => task.relatedAllocationIds));
    const activeOwnerCount = new Set(projectTasks.filter((task) => task.status !== 'done' && task.status !== 'cancelled').map((task) => task.ownerPersonId)).size;
    const blockedTaskCount = projectTasks.filter((task) => task.status === 'blocked').length;
    const highRiskTaskCount = projectTasks.filter((task) => task.riskLevel === 'high').length;

    return {
      projectId,
      totalTaskCount: projectTasks.length,
      completedTaskCount: projectTasks.filter((task) => task.status === 'done').length,
      blockedTaskCount,
      highRiskTaskCount,
      plannedWorkDays: projectTaskAggregates.reduce((sum, aggregate) => sum + aggregate.plannedWorkDays, 0),
      actualWorkDays: projectTaskAggregates.reduce((sum, aggregate) => sum + aggregate.normalizedActualWorkDays, 0),
      weightedProgress: clampProgress(weightedProgress),
      overdueTaskCount: projectTaskAggregates.filter((aggregate) => aggregate.overdueFlag).length,
      activeOwnerCount,
      relatedAllocationCount: relatedAllocationIds.size,
      writebackCostReadyFlag: relatedAllocationIds.size > 0 && projectTaskAggregates.length > 0,
      summaryText: buildProjectSummaryText({
        totalTaskCount: projectTasks.length,
        blockedTaskCount,
        highRiskTaskCount,
        weightedProgress
      })
    };
  });
}
