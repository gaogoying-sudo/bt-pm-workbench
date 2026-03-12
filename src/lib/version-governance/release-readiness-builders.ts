import { TaskExecutionWritebackRecord } from '@/lib/types/task-execution-aggregation';
import { ProjectProgressSnapshot } from '@/lib/types/project-progress';
import { ReleaseReadinessRecord } from '@/lib/types/version-governance';

export function buildReleaseReadinessRecords(
  linkedVersionIds: string[],
  projectSnapshots: ProjectProgressSnapshot[],
  versionProjectLinks: Array<{ linkedVersionId: string; projectId: string }>,
  writebackRecords: TaskExecutionWritebackRecord[]
): ReleaseReadinessRecord[] {
  return linkedVersionIds.map((linkedVersionId) => {
    const relatedProjects = versionProjectLinks.filter((link) => link.linkedVersionId === linkedVersionId);
    const relatedSnapshots = projectSnapshots.filter((snapshot) =>
      relatedProjects.some((project) => project.projectId === snapshot.projectId)
    );
    const relatedWritebacks = writebackRecords.filter((record) =>
      relatedProjects.some((project) => project.projectId === record.sourceProjectId)
    );
    const projectCoverage =
      relatedProjects.length === 0
        ? 0
        : relatedSnapshots.filter((snapshot) => snapshot.writebackReadyFlag).length / relatedProjects.length;
    const taskWritebackCoverage =
      relatedWritebacks.length === 0
        ? 0
        : relatedWritebacks.filter((record) => record.writebackStatus === 'ready').length / relatedWritebacks.length;
    const blockerCount = relatedSnapshots.reduce((sum, snapshot) => sum + snapshot.blockedTaskCount, 0);
    const highRiskCount = relatedSnapshots.reduce((sum, snapshot) => sum + snapshot.highRiskTaskCount, 0);

    const readinessStatus =
      blockerCount > 0
        ? 'blocked'
        : projectCoverage >= 0.8 && taskWritebackCoverage >= 0.7
          ? 'ready'
          : highRiskCount > 0
            ? 'watching'
            : 'pending';

    return {
      id: `readiness-${linkedVersionId}`,
      linkedVersionId,
      readinessStatus,
      projectCoverage,
      taskWritebackCoverage,
      blockerCount,
      highRiskCount,
      recommendedAction:
        readinessStatus === 'ready'
          ? '进入发布检查清单与冻结前确认 / Move into release checklist and pre-freeze validation.'
          : readinessStatus === 'blocked'
            ? '优先清理阻塞任务与阶段延迟 / Clear blocked tasks and delayed stages first.'
            : readinessStatus === 'watching'
              ? '持续观察高风险项目与回写缺口 / Watch high-risk projects and write-back gaps.'
              : '补齐项目覆盖与执行回写记录 / Improve project coverage and execution write-back records.',
      notes: '发布准备度来自项目进度快照覆盖率与任务回写覆盖率 / Readiness is derived from project progress coverage and task write-back coverage.'
    };
  });
}
