import { projects } from '@/data/projects';
import { manpowerProjects } from '@/data/manpower/manpower-projects';
import { buildProjectCostComparisonSnapshots } from '@/lib/manpower/comparison-builders';
import { buildProjectProgressSnapshots, buildProjectStageProgressSnapshots } from '@/lib/project-progress/project-progress-builders';
import { buildProjectRiskSignals } from '@/lib/project-progress/project-risk-builders';
import { projectVersionLinkRecords } from '@/data/project-progress/project-version-link-records';
import { buildResourcePressureSnapshots } from '@/lib/resources/resource-pressure-builders';
import { buildSnapshotContext } from '@/lib/snapshots/snapshot-helpers';
import { ProjectDetailSnapshot } from '@/lib/types/project-detail';
import { buildVersionGovernanceRecords } from '@/lib/version-governance/version-governance-builders';

const projectIdMap: Record<string, string> = {
  'pm-workbench': 'project-pm-workbench',
  'ops-console': 'project-ops-console'
};

export function buildProjectDetailSnapshot(projectId: string): ProjectDetailSnapshot | null {
  const baseProject = projects.find((project) => project.id === projectId);
  if (!baseProject) return null;

  const mappedProjectId = projectIdMap[projectId];
  const progressSnapshot = mappedProjectId
    ? buildProjectProgressSnapshots(projectVersionLinkRecords).find((snapshot) => snapshot.projectId === mappedProjectId)
    : null;
  const stageSnapshots = mappedProjectId ? buildProjectStageProgressSnapshots(mappedProjectId) : [];
  const riskSignals = mappedProjectId ? buildProjectRiskSignals(mappedProjectId) : [];
  const resourcePressure = mappedProjectId
    ? buildResourcePressureSnapshots().find((snapshot) => snapshot.projectId === mappedProjectId)
    : null;
  const costSnapshot = mappedProjectId
    ? buildProjectCostComparisonSnapshots().find((snapshot) => snapshot.projectId === mappedProjectId)
    : null;
  const versionLink = mappedProjectId
    ? projectVersionLinkRecords.find((link) => link.projectId === mappedProjectId)
    : null;
  const versionRecord = versionLink
    ? buildVersionGovernanceRecords().records.find((record) => record.linkedVersionId === versionLink.linkedVersionId)
    : null;
  const mappedProject = mappedProjectId
    ? manpowerProjects.find((project) => project.id === mappedProjectId)
    : null;

  return {
    projectId,
    projectName: baseProject.name,
    projectCode: baseProject.code,
    basicSummary: baseProject.summary,
    execution: {
      progress: progressSnapshot?.currentOverallProgress ?? 0,
      status: progressSnapshot?.progressStatus ?? baseProject.status,
      currentStage:
        stageSnapshots.find((stage) => stage.stageProgress < 1)?.stageName ?? stageSnapshots.at(-1)?.stageName ?? null,
      blockedTaskCount: progressSnapshot?.blockedTaskCount ?? 0,
      highRiskTaskCount: progressSnapshot?.highRiskTaskCount ?? 0,
      summary:
        progressSnapshot?.latestSummary ??
        '当前项目尚未接入执行聚合快照，保留旧项目信息展示 / Project is not yet fully linked with execution aggregation.'
    },
    resource: {
      resourcePressureLevel: resourcePressure?.pressureLevel ?? 'low',
      overloadedPeople: resourcePressure?.overloadedPeople ?? 0,
      constrainedPeople: resourcePressure?.constrainedPeople ?? 0,
      summary: resourcePressure?.summary ?? '资源压力聚合暂未接入该项目 / Resource pressure aggregation is not linked yet.'
    },
    cost: {
      plannedCost: costSnapshot?.plannedCost ?? 0,
      actualCost: costSnapshot?.actualCost ?? 0,
      varianceCost: costSnapshot?.varianceCost ?? 0,
      summary:
        costSnapshot
          ? '人力成本摘要来自统一 comparison builder / Cost summary comes from the shared comparison builder.'
          : '当前项目暂无成本比较快照 / No cost comparison snapshot yet.'
    },
    version: {
      versionName: versionLink?.versionName ?? baseProject.currentVersion,
      governanceStatus: versionRecord?.governanceStatus ?? null,
      readinessStatus: versionRecord?.releaseReadinessStatus ?? null,
      variance: versionRecord?.variance ?? null,
      summary:
        versionRecord
          ? '版本摘要来自版本治理中心 builder / Version summary comes from the version governance builder.'
          : '当前项目暂无版本治理快照 / No version governance snapshot yet.'
    },
    risk: {
      riskCount: riskSignals.length,
      blockerCount: riskSignals.filter((signal) => signal.signalType === 'blocked-task').length,
      topSignalTitle: riskSignals[0]?.title ?? null,
      summary:
        riskSignals[0]?.summary ??
        '当前项目暂无聚合风险信号，保留旧项目状态摘要 / No aggregated risk signal is linked yet.'
    },
    sourceContext: [
      '项目进度中心 / Project Progress Center',
      '资源分配计算层 / Resource Allocation Calculation Layer',
      '人力成本比较层 / Manpower Comparison Layer',
      '版本治理中心 / Version Governance Center'
    ],
    snapshotContext: buildSnapshotContext({
      notes: mappedProject
        ? `当前详情页已接入 ${mappedProject.name} 的聚合快照 / Detail page is linked with aggregated snapshots for ${mappedProject.name}.`
        : '当前详情页仅接入旧项目基础数据，等待后续项目 ID 统一映射 / Base project data only until more IDs are mapped.'
    })
  };
}
