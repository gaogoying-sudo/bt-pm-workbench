import { ProjectStageTaskLink, TaskExecutionRecord, TaskActivityRecord } from '@/lib/types/task-execution';
import { StageExecutionAggregate } from '@/lib/types/task-execution-aggregation';
import { buildTaskExecutionAggregates } from '@/lib/task-execution/task-aggregate-selectors';
import { MOCK_TODAY, buildStageRiskSummary, clampProgress } from '@/lib/task-execution/summary-builders';

export function buildStageExecutionAggregates(
  links: ProjectStageTaskLink[],
  tasks: TaskExecutionRecord[],
  activities: TaskActivityRecord[],
  today: string = MOCK_TODAY
): StageExecutionAggregate[] {
  const taskAggregates = buildTaskExecutionAggregates(tasks, activities, today);
  const stageKeys = [...new Set(links.map((link) => `${link.projectId}::${link.stageId}`))];

  return stageKeys.map((key) => {
    const [projectId, stageId] = key.split('::');
    const stageLinks = links.filter((link) => link.projectId === projectId && link.stageId === stageId);
    const stageTasks = stageLinks
      .map((link) => tasks.find((task) => task.id === link.taskId))
      .filter((task): task is TaskExecutionRecord => Boolean(task));
    const stageTaskAggregates = stageTasks
      .map((task) => taskAggregates.find((aggregate) => aggregate.taskId === task.id))
      .filter((aggregate): aggregate is NonNullable<typeof aggregate> => Boolean(aggregate));

    const totalWeight = stageLinks.reduce((sum, link) => sum + link.weight, 0);
    const weightedProgress =
      totalWeight > 0
        ? stageLinks.reduce((sum, link) => {
            const aggregate = stageTaskAggregates.find((item) => item.taskId === link.taskId);
            return sum + (aggregate ? aggregate.progress * link.weight : 0);
          }, 0) / totalWeight
        : stageTaskAggregates.length > 0
          ? stageTaskAggregates.reduce((sum, aggregate) => sum + aggregate.progress, 0) / stageTaskAggregates.length
          : 0;

    const blockedTaskCount = stageTaskAggregates.filter((aggregate) => aggregate.progressStatus === 'blocked').length;
    const atRiskTaskCount = stageTasks.filter((task) => task.riskLevel === 'high' || task.status === 'at-risk').length;
    const overdueTaskCount = stageTaskAggregates.filter((aggregate) => aggregate.overdueFlag).length;

    return {
      projectId,
      stageId,
      taskCount: stageTasks.length,
      completedTaskCount: stageTasks.filter((task) => task.status === 'done').length,
      inProgressTaskCount: stageTasks.filter((task) => task.status === 'in-progress' || task.status === 'ready').length,
      blockedTaskCount,
      atRiskTaskCount,
      stagePlannedWorkDays: stageTaskAggregates.reduce((sum, aggregate) => sum + aggregate.plannedWorkDays, 0),
      stageActualWorkDays: stageTaskAggregates.reduce((sum, aggregate) => sum + aggregate.normalizedActualWorkDays, 0),
      weightedProgress: clampProgress(weightedProgress),
      milestoneRelatedTaskCount: stageLinks.filter((link) => link.isMilestoneRelated).length,
      overdueTaskCount,
      blockerTaskCount: stageTaskAggregates.filter((aggregate) => aggregate.blockerFlag).length,
      riskSummary: buildStageRiskSummary({
        blockedTaskCount,
        atRiskTaskCount,
        overdueTaskCount
      })
    };
  });
}
