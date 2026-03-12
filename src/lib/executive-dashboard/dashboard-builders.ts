import { manpowerProjects } from '@/data/manpower/manpower-projects';
import { manpowerRoleConfigs } from '@/data/manpower/manpower-role-configs';
import { peopleResources } from '@/data/resources/people-resources';
import { buildProjectProgressSnapshots } from '@/lib/project-progress/project-progress-builders';
import { projectVersionLinkRecords } from '@/data/project-progress/project-version-link-records';
import { buildProjectRiskSignals } from '@/lib/project-progress/project-risk-builders';
import { buildSnapshotContext } from '@/lib/snapshots/snapshot-helpers';
import { buildPersonTaskLoadAggregates } from '@/lib/task-execution/person-load-selectors';
import { taskActivityRecords } from '@/data/task-execution/task-activity-records';
import { taskExecutionRecords } from '@/data/task-execution/task-execution-records';
import { buildTaskExecutionWritebackRecords } from '@/lib/task-execution/writeback-mappers';
import { buildVersionGovernanceRecords } from '@/lib/version-governance/version-governance-builders';
import {
  DeliveryRiskSnapshot,
  ExecutiveOverviewSnapshot,
  ProjectHealthSnapshot,
  ResourceHealthSnapshot,
  VersionHealthSnapshot
} from '@/lib/types/executive-dashboard';
import { hiringDemands } from '@/data/resources/hiring-demands';

export function buildExecutiveOverviewSnapshot(): ExecutiveOverviewSnapshot {
  const projectSnapshots = buildProjectProgressSnapshots(projectVersionLinkRecords);
  const versionGovernance = buildVersionGovernanceRecords();
  const writebackRecords = buildTaskExecutionWritebackRecords();

  return {
    totalProjects: projectSnapshots.length,
    activeProjects: projectSnapshots.filter((item) => item.progressStatus === 'in-progress').length,
    averageProjectProgress:
      projectSnapshots.reduce((sum, item) => sum + item.currentOverallProgress, 0) / Math.max(projectSnapshots.length, 1),
    highRiskProjects: projectSnapshots.filter((item) => item.highRiskTaskCount > 0 || item.resourcePressureLevel === 'high').length,
    readyVersions: versionGovernance.records.filter((item) => item.releaseReadinessStatus === 'ready').length,
    totalWritebackCost: writebackRecords.reduce((sum, item) => sum + item.estimatedActualCost, 0),
    snapshotContext: buildSnapshotContext({
      notes: '管理驾驶舱聚合项目进度、资源负载、版本治理和人力回写结果 / Dashboard aggregates project progress, resource load, version governance and manpower write-back.'
    })
  };
}

export function buildProjectHealthSnapshots(): ProjectHealthSnapshot[] {
  const projectSnapshots = buildProjectProgressSnapshots(projectVersionLinkRecords);

  return projectSnapshots.map((snapshot) => ({
    projectId: snapshot.projectId,
    projectName: manpowerProjects.find((project) => project.id === snapshot.projectId)?.name ?? snapshot.projectId,
    progress: snapshot.currentOverallProgress,
    status: snapshot.progressStatus,
    blockedTaskCount: snapshot.blockedTaskCount,
    highRiskTaskCount: snapshot.highRiskTaskCount,
    resourcePressureLevel: snapshot.resourcePressureLevel,
    versionName: projectVersionLinkRecords.find((link) => link.projectId === snapshot.projectId)?.versionName ?? null,
    summary: snapshot.latestSummary
  }));
}

export function buildResourceHealthSnapshot(): ResourceHealthSnapshot {
  const personLoads = buildPersonTaskLoadAggregates(peopleResources, taskExecutionRecords, taskActivityRecords);
  const scarceRoleCount = manpowerRoleConfigs.filter((role) => {
    const availableCount = peopleResources.filter(
      (person) =>
        (person.primaryRoleId === role.id || person.secondaryRoleIds.includes(role.id)) &&
        person.availabilityStatus !== 'fully-allocated' &&
        person.availabilityStatus !== 'unavailable'
    ).length;
    const demandCount = hiringDemands.filter((demand) => demand.roleId === role.id && demand.status !== 'closed').length;
    return availableCount <= 1 && demandCount > 0;
  }).length;

  return {
    totalPeople: peopleResources.length,
    fullyAllocatedCount: peopleResources.filter((person) => person.availabilityStatus === 'fully-allocated').length,
    partiallyAvailableCount: peopleResources.filter((person) => person.availabilityStatus === 'partially-available').length,
    highLoadPeople: personLoads.filter((item) => item.loadRiskLevel === 'high').length,
    scarceRoleCount,
    summary: '资源健康度来自人员状态、可投入性、任务负载和招聘缺口摘要 / Resource health comes from people status, availability, task load and hiring gap.'
  };
}

export function buildVersionHealthSnapshots(): VersionHealthSnapshot[] {
  const versionGovernance = buildVersionGovernanceRecords();

  return versionGovernance.records.map((record) => ({
    linkedVersionId: record.linkedVersionId,
    versionName: record.versionName,
    governanceStatus: record.governanceStatus,
    releaseReadinessStatus: record.releaseReadinessStatus,
    variance: record.variance,
    activeRiskCount: record.activeRiskCount
  }));
}

export function buildDeliveryRiskSnapshots(): DeliveryRiskSnapshot[] {
  const projectSnapshots = buildProjectProgressSnapshots(projectVersionLinkRecords);
  const projectRisks = projectSnapshots.flatMap((snapshot) => buildProjectRiskSignals(snapshot.projectId));
  const versionGovernance = buildVersionGovernanceRecords();

  return [
    ...projectRisks.slice(0, 4).map((signal) => ({
      title: signal.title,
      severity: signal.severity,
      sourceModule: '项目进度 / Project Progress',
      summary: signal.summary
    })),
    ...versionGovernance.riskSignals.slice(0, 3).map((signal) => ({
      title: signal.title,
      severity: signal.severity,
      sourceModule: '版本推进 / Version Governance',
      summary: signal.summary
    }))
  ];
}
