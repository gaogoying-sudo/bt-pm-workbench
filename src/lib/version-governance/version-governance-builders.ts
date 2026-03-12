import { projectVersionLinkRecords } from '@/data/project-progress/project-version-link-records';
import { buildProjectProgressSnapshots } from '@/lib/project-progress/project-progress-builders';
import { buildProjectRiskSignals } from '@/lib/project-progress/project-risk-builders';
import { buildSnapshotContext } from '@/lib/snapshots/snapshot-helpers';
import { buildTaskExecutionWritebackRecords } from '@/lib/task-execution/writeback-mappers';
import {
  ReleaseReadinessRecord,
  VersionGovernanceRecord,
  VersionProjectLinkRecord
} from '@/lib/types/version-governance';
import { buildReleaseReadinessRecords } from '@/lib/version-governance/release-readiness-builders';
import { buildVersionRiskSignals } from '@/lib/version-governance/version-risk-builders';
import { VersionGovernanceStatus } from '@/lib/types/version-governance';

export function buildVersionProjectLinkSnapshots(): VersionProjectLinkRecord[] {
  const progressSnapshots = buildProjectProgressSnapshots(projectVersionLinkRecords);

  return projectVersionLinkRecords.map((link) => {
    const snapshot = progressSnapshots.find((item) => item.projectId === link.projectId);

    return {
      id: `vpl-${link.linkedVersionId}-${link.projectId}`,
      linkedVersionId: link.linkedVersionId,
      projectId: link.projectId,
      projectName: snapshot?.projectId ?? link.projectId,
      currentProgress: snapshot?.currentOverallProgress ?? link.currentProgress,
      progressStatus: snapshot?.progressStatus ?? 'not-started',
      resourcePressureLevel: snapshot?.resourcePressureLevel ?? 'low',
      blockedTaskCount: snapshot?.blockedTaskCount ?? 0,
      highRiskTaskCount: snapshot?.highRiskTaskCount ?? 0,
      writebackReadyFlag: snapshot?.writebackReadyFlag ?? false,
      latestSummary: snapshot?.latestSummary ?? link.notes
    };
  });
}

export function buildVersionGovernanceRecords(): {
  records: VersionGovernanceRecord[];
  linkRecords: VersionProjectLinkRecord[];
  readinessRecords: ReleaseReadinessRecord[];
  riskSignals: ReturnType<typeof buildVersionRiskSignals>;
} {
  const progressSnapshots = buildProjectProgressSnapshots(projectVersionLinkRecords);
  const linkRecords = buildVersionProjectLinkSnapshots();
  const linkedVersionIds = [...new Set(projectVersionLinkRecords.map((item) => item.linkedVersionId))];
  const projectRiskSignals = progressSnapshots.flatMap((snapshot) => buildProjectRiskSignals(snapshot.projectId));
  const writebackRecords = buildTaskExecutionWritebackRecords();
  const readinessRecords = buildReleaseReadinessRecords(linkedVersionIds, progressSnapshots, projectVersionLinkRecords, writebackRecords);
  const riskSignals = buildVersionRiskSignals(linkedVersionIds, projectVersionLinkRecords, projectRiskSignals);

  const records = linkedVersionIds.map((linkedVersionId) => {
    const relatedLinks = projectVersionLinkRecords.filter((link) => link.linkedVersionId === linkedVersionId);
    const relatedSnapshots = progressSnapshots.filter((snapshot) =>
      relatedLinks.some((link) => link.projectId === snapshot.projectId)
    );
    const readiness = readinessRecords.find((item) => item.linkedVersionId === linkedVersionId);
    const averageProgress =
      relatedSnapshots.length === 0
        ? 0
        : relatedSnapshots.reduce((sum, snapshot) => sum + snapshot.currentOverallProgress, 0) / relatedSnapshots.length;
    const baselineProgress =
      relatedLinks.length === 0
        ? 0
        : relatedLinks.reduce((sum, link) => sum + link.baselineProgress, 0) / relatedLinks.length;
    const variance = averageProgress - baselineProgress;
    const activeRiskCount = projectRiskSignals.filter((signal) => relatedLinks.some((link) => link.projectId === signal.projectId)).length;
    const blockedProjectCount = relatedSnapshots.filter((snapshot) => snapshot.blockedTaskCount > 0).length;
    const writebackReadyProjectCount = relatedSnapshots.filter((snapshot) => snapshot.writebackReadyFlag).length;

    const governanceStatus: VersionGovernanceStatus =
      blockedProjectCount > 0
        ? 'blocked'
        : readiness?.readinessStatus === 'ready'
          ? 'ready-to-release'
          : activeRiskCount > 0
            ? 'watching'
            : 'on-track';

    return {
      id: `vgr-${linkedVersionId}`,
      linkedVersionId,
      versionName: relatedLinks[0]?.versionName ?? linkedVersionId,
      relationType: relatedLinks[0]?.relationType ?? 'current-plan',
      projectCount: relatedLinks.length,
      averageProgress,
      baselineProgress,
      variance,
      activeRiskCount,
      blockedProjectCount,
      writebackReadyProjectCount,
      releaseReadinessStatus: readiness?.readinessStatus ?? 'pending',
      governanceStatus,
      latestSummary:
        relatedSnapshots[0]?.latestSummary ??
        '版本治理记录由项目进度、风险与回写结果映射生成 / Governance record is built from project progress, risks and write-back results.',
      snapshotContext: buildSnapshotContext({
        notes: '版本治理快照由项目进度中心和任务执行聚合层共同支撑 / Version governance snapshot is backed by project progress and task execution aggregation.'
      }),
      notes: '当前为 v0 mock 版本治理对象，后续可替换为真实发布流程与版本状态服务 / v0 governance object reserved for future release workflow services.'
    };
  });

  return { records, linkRecords, readinessRecords, riskSignals };
}
