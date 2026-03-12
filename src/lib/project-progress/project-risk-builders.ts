import { peopleResources } from '@/data/resources/people-resources';
import { projectStageTaskLinks } from '@/data/task-execution/project-stage-task-links';
import { taskActivityRecords } from '@/data/task-execution/task-activity-records';
import { taskExecutionRecords } from '@/data/task-execution/task-execution-records';
import { buildPersonTaskLoadAggregates } from '@/lib/task-execution/person-load-selectors';
import { buildProjectExecutionAggregates } from '@/lib/task-execution/project-aggregate-selectors';
import { buildStageExecutionAggregates } from '@/lib/task-execution/stage-aggregate-selectors';
import { buildTaskExecutionWritebackRecords } from '@/lib/task-execution/writeback-mappers';
import { ProjectRiskSignal } from '@/lib/types/project-progress';

export function buildProjectRiskSignals(projectId: string): ProjectRiskSignal[] {
  const projectAggregate = buildProjectExecutionAggregates(projectStageTaskLinks, taskExecutionRecords, taskActivityRecords).find(
    (aggregate) => aggregate.projectId === projectId
  );
  const stageAggregates = buildStageExecutionAggregates(projectStageTaskLinks, taskExecutionRecords, taskActivityRecords).filter(
    (aggregate) => aggregate.projectId === projectId
  );
  const personLoads = buildPersonTaskLoadAggregates(peopleResources, taskExecutionRecords, taskActivityRecords);
  const projectTasks = taskExecutionRecords.filter((task) => task.projectId === projectId);
  const writebacks = buildTaskExecutionWritebackRecords().filter((record) => record.sourceProjectId === projectId);

  const signals: ProjectRiskSignal[] = [];

  if (projectAggregate && projectAggregate.blockedTaskCount > 0) {
    signals.push({
      id: `prs-${projectId}-blocked`,
      projectId,
      signalType: 'blocked-task',
      severity: 'high',
      title: '阻塞任务聚集 / Blocked Tasks Cluster',
      summary: `${projectAggregate.blockedTaskCount} 个阻塞任务正在影响项目推进 / Blocked tasks are slowing project execution.`,
      relatedStageId: stageAggregates.find((aggregate) => aggregate.blockedTaskCount > 0)?.stageId ?? null,
      relatedTaskIds: projectTasks.filter((task) => task.status === 'blocked').map((task) => task.id),
      sourceType: 'task-execution-aggregate',
      suggestedAction: '优先清理阻塞依赖并恢复关键路径任务 / Clear blockers on the critical path first.',
      status: 'open'
    });
  }

  if (projectAggregate && projectAggregate.overdueTaskCount > 0) {
    signals.push({
      id: `prs-${projectId}-overdue`,
      projectId,
      signalType: 'overdue-task',
      severity: projectAggregate.overdueTaskCount > 1 ? 'high' : 'medium',
      title: '逾期任务信号 / Overdue Task Signal',
      summary: `${projectAggregate.overdueTaskCount} 个任务逾期 / Overdue tasks have crossed the planned window.`,
      relatedStageId: stageAggregates.find((aggregate) => aggregate.overdueTaskCount > 0)?.stageId ?? null,
      relatedTaskIds: projectTasks
        .filter((task) => task.status !== 'done' && new Date(task.plannedEndDate) < new Date('2026-03-12'))
        .map((task) => task.id),
      sourceType: 'task-execution-aggregate',
      suggestedAction: '复盘计划窗口并调整阶段节奏 / Revisit plan window and rebalance stage cadence.',
      status: 'watching'
    });
  }

  if (projectAggregate && projectAggregate.highRiskTaskCount > 0) {
    signals.push({
      id: `prs-${projectId}-highrisk`,
      projectId,
      signalType: 'high-risk-task',
      severity: 'high',
      title: '高风险任务信号 / High-risk Task Signal',
      summary: `${projectAggregate.highRiskTaskCount} 个高风险任务需要治理 / High-risk tasks need mitigation tracking.`,
      relatedStageId: stageAggregates.find((aggregate) => aggregate.atRiskTaskCount > 0)?.stageId ?? null,
      relatedTaskIds: projectTasks.filter((task) => task.riskLevel === 'high').map((task) => task.id),
      sourceType: 'task-execution-aggregate',
      suggestedAction: '建立专项跟踪并拆分风险处置动作 / Add focused mitigation actions for high-risk tasks.',
      status: 'open'
    });
  }

  const relatedOwnerIds = new Set(projectTasks.map((task) => task.ownerPersonId));
  const highPressureLoads = personLoads.filter(
    (load) => relatedOwnerIds.has(load.personId) && load.loadRiskLevel === 'high'
  );

  if (highPressureLoads.length > 0) {
    signals.push({
      id: `prs-${projectId}-pressure`,
      projectId,
      signalType: 'resource-pressure',
      severity: 'medium',
      title: '资源压力信号 / Resource Pressure Signal',
      summary: `${highPressureLoads.length} 位负责人处于高负载 / Owners are under elevated load pressure.`,
      relatedStageId: null,
      relatedTaskIds: [],
      sourceType: 'people-task-load-aggregate',
      suggestedAction: '检查任务拆分与资源补位空间 / Check task split and backup capacity options.',
      status: 'watching'
    });
  }

  if (writebacks.some((record) => record.writebackStatus !== 'ready')) {
    signals.push({
      id: `prs-${projectId}-writeback`,
      projectId,
      signalType: 'writeback-gap',
      severity: 'low',
      title: '回写缺口信号 / Write-back Gap Signal',
      summary: '部分阶段尚未满足回写条件 / Some stages are not ready for write-back preview.',
      relatedStageId: writebacks.find((record) => record.writebackStatus !== 'ready')?.sourceStageId ?? null,
      relatedTaskIds: [],
      sourceType: 'task-execution-writeback',
      suggestedAction: '补齐 allocation 关联与执行记录口径 / Complete allocation linkage and execution logging.',
      status: 'watching'
    });
  }

  stageAggregates
    .filter((aggregate) => aggregate.overdueTaskCount > 0 || aggregate.blockedTaskCount > 0)
    .forEach((aggregate) => {
      signals.push({
        id: `prs-${projectId}-${aggregate.stageId}-delay`,
        projectId,
        signalType: 'stage-delay',
        severity: aggregate.blockedTaskCount > 0 ? 'high' : 'medium',
        title: '阶段延迟信号 / Stage Delay Signal',
        summary: aggregate.riskSummary,
        relatedStageId: aggregate.stageId,
        relatedTaskIds: projectTasks.filter((task) => task.stageId === aggregate.stageId).map((task) => task.id),
        sourceType: 'stage-execution-aggregate',
        suggestedAction: '聚焦阶段关键任务并复核里程碑权重 / Focus on critical stage tasks and milestone weighting.',
        status: 'open'
      });
    });

  return signals;
}
