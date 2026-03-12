import { manpowerStagePlans } from '@/data/manpower/manpower-stage-plans';
import { projectStageTaskLinks } from '@/data/task-execution/project-stage-task-links';
import { taskActivityRecords } from '@/data/task-execution/task-activity-records';
import { taskExecutionRecords } from '@/data/task-execution/task-execution-records';
import { buildProjectExecutionAggregates } from '@/lib/task-execution/project-aggregate-selectors';
import { buildStageExecutionAggregates } from '@/lib/task-execution/stage-aggregate-selectors';
import { buildTaskExecutionWritebackRecords } from '@/lib/task-execution/writeback-mappers';
import { buildResourcePressureSnapshots } from '@/lib/resources/resource-pressure-builders';
import {
  ProjectProgressSnapshot,
  ProjectProgressStatus,
  ProjectStageProgressSnapshot,
  ResourcePressureLevel,
  StageProgressStatus
} from '@/lib/types/project-progress';
import { ProjectVersionLinkRecord } from '@/lib/types/project-progress';

function resolveProjectProgressStatus(input: {
  blockedTaskCount: number;
  highRiskTaskCount: number;
  completedTaskCount: number;
  totalTaskCount: number;
  weightedProgress: number;
}): ProjectProgressStatus {
  if (input.completedTaskCount > 0 && input.completedTaskCount === input.totalTaskCount) return 'done';
  if (input.blockedTaskCount > 0) return 'blocked';
  if (input.highRiskTaskCount > 0) return 'at-risk';
  if (input.weightedProgress > 0) return 'in-progress';
  return 'not-started';
}

function resolveStageStatus(input: {
  blockedTaskCount: number;
  overdueTaskCount: number;
  completedTaskCount: number;
  taskCount: number;
  weightedProgress: number;
}): StageProgressStatus {
  if (input.completedTaskCount > 0 && input.completedTaskCount === input.taskCount) return 'done';
  if (input.blockedTaskCount > 0) return 'blocked';
  if (input.overdueTaskCount > 0) return 'at-risk';
  if (input.weightedProgress > 0) return 'in-progress';
  return 'not-started';
}

function resolveResourcePressureLevel(projectId: string): ResourcePressureLevel {
  return buildResourcePressureSnapshots().find((snapshot) => snapshot.projectId === projectId)?.pressureLevel ?? 'low';
}

function buildLatestSummary(currentStageName: string | null, pressure: ResourcePressureLevel, baseSummary: string): string {
  const stageText = currentStageName ? `当前阶段：${currentStageName} / Current stage: ${currentStageName}` : '当前阶段待确认 / Current stage pending';
  const pressureText =
    pressure === 'high'
      ? '资源压力高 / Resource pressure high'
      : pressure === 'medium'
        ? '资源压力中等 / Resource pressure medium'
        : '资源压力可控 / Resource pressure manageable';

  return `${stageText}；${pressureText}；${baseSummary}`;
}

export function buildProjectProgressSnapshots(
  versionLinks: ProjectVersionLinkRecord[]
): ProjectProgressSnapshot[] {
  const projectAggregates = buildProjectExecutionAggregates(projectStageTaskLinks, taskExecutionRecords, taskActivityRecords);
  const stageAggregates = buildStageExecutionAggregates(projectStageTaskLinks, taskExecutionRecords, taskActivityRecords);
  const writebackRecords = buildTaskExecutionWritebackRecords();

  return projectAggregates.map((aggregate) => {
    const projectStages = stageAggregates
      .filter((stage) => stage.projectId === aggregate.projectId)
      .sort((left, right) => {
        const leftOrder = manpowerStagePlans.find((item) => item.id === left.stageId)?.stageOrder ?? 999;
        const rightOrder = manpowerStagePlans.find((item) => item.id === right.stageId)?.stageOrder ?? 999;
        return leftOrder - rightOrder;
      });

    const currentStage =
      projectStages.find((stage) => stage.completedTaskCount < stage.taskCount) ?? projectStages.at(-1);
    const linkedVersion = versionLinks.find((item) => item.projectId === aggregate.projectId);
    const pressure = resolveResourcePressureLevel(aggregate.projectId);
    const currentStageName = currentStage ? manpowerStagePlans.find((stage) => stage.id === currentStage.stageId)?.stageName ?? null : null;

    return {
      id: `pps-${aggregate.projectId}`,
      projectId: aggregate.projectId,
      currentOverallProgress: aggregate.weightedProgress,
      progressStatus: resolveProjectProgressStatus({
        blockedTaskCount: aggregate.blockedTaskCount,
        highRiskTaskCount: aggregate.highRiskTaskCount,
        completedTaskCount: aggregate.completedTaskCount,
        totalTaskCount: aggregate.totalTaskCount,
        weightedProgress: aggregate.weightedProgress
      }),
      currentStageId: currentStage?.stageId ?? null,
      activeTaskCount: aggregate.totalTaskCount - aggregate.completedTaskCount,
      completedTaskCount: aggregate.completedTaskCount,
      blockedTaskCount: aggregate.blockedTaskCount,
      overdueTaskCount: aggregate.overdueTaskCount,
      highRiskTaskCount: aggregate.highRiskTaskCount,
      activeOwnerCount: aggregate.activeOwnerCount,
      resourcePressureLevel: pressure,
      latestSummary: buildLatestSummary(currentStageName, pressure, aggregate.summaryText),
      sourceTaskAggregateCount: taskExecutionRecords.filter((task) => task.projectId === aggregate.projectId).length,
      sourceStageAggregateCount: projectStages.length,
      writebackReadyFlag: writebackRecords.some(
        (record) => record.sourceProjectId === aggregate.projectId && record.writebackStatus === 'ready'
      ),
      linkedVersionId: linkedVersion?.linkedVersionId ?? null,
      notes: '项目进度快照由任务聚合、人员负载与回写预览共同构建 / Snapshot is built from task aggregates, people load and write-back preview.'
    };
  });
}

export function buildProjectStageProgressSnapshots(projectId: string): ProjectStageProgressSnapshot[] {
  const stageAggregates = buildStageExecutionAggregates(projectStageTaskLinks, taskExecutionRecords, taskActivityRecords);
  const stages = manpowerStagePlans
    .filter((stage) => stage.projectId === projectId)
    .sort((left, right) => left.stageOrder - right.stageOrder);

  return stageAggregates
    .filter((aggregate) => aggregate.projectId === projectId)
    .map((aggregate) => {
      const stageMeta = stages.find((stage) => stage.id === aggregate.stageId);
      const blockedTasks = taskExecutionRecords.filter(
        (task) => task.projectId === projectId && task.stageId === aggregate.stageId && task.status === 'blocked'
      );

      return {
        id: `psps-${projectId}-${aggregate.stageId}`,
        projectId,
        stageId: aggregate.stageId,
        stageName: stageMeta?.stageName ?? aggregate.stageId,
        stageOrder: stageMeta?.stageOrder ?? 999,
        stageProgress: aggregate.weightedProgress,
        stageStatus: resolveStageStatus({
          blockedTaskCount: aggregate.blockedTaskCount,
          overdueTaskCount: aggregate.overdueTaskCount,
          completedTaskCount: aggregate.completedTaskCount,
          taskCount: aggregate.taskCount,
          weightedProgress: aggregate.weightedProgress
        }),
        taskCount: aggregate.taskCount,
        completedTaskCount: aggregate.completedTaskCount,
        inProgressTaskCount: aggregate.inProgressTaskCount,
        blockedTaskCount: aggregate.blockedTaskCount,
        overdueTaskCount: aggregate.overdueTaskCount,
        milestoneTaskCount: aggregate.milestoneRelatedTaskCount,
        plannedWorkDays: aggregate.stagePlannedWorkDays,
        actualWorkDays: aggregate.stageActualWorkDays,
        riskSummary: aggregate.riskSummary,
        blockerSummary:
          blockedTasks.length > 0
            ? `${blockedTasks.length} 个阻塞任务 / ${blockedTasks.length} blocked tasks`
            : '当前无显式阻塞 / No explicit blocker',
        notes: '阶段进度快照来自阶段聚合结果与任务阻塞摘要 / Stage snapshot comes from stage aggregates and task blocker signals.'
      };
    })
    .sort((left, right) => left.stageOrder - right.stageOrder);
}
