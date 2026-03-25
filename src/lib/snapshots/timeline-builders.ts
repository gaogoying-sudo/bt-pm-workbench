import { buildProjectProgressSnapshots } from '@/lib/project-progress/project-progress-builders';
import { buildResourcePressureSnapshots } from '@/lib/resources/resource-pressure-builders';
import { buildProjectCostComparisonSnapshots } from '@/lib/manpower/comparison-builders';
import { buildVersionGovernanceRecords } from '@/lib/version-governance/version-governance-builders';
import { projectVersionLinkRecords } from '@/data/project-progress/project-version-link-records';
import { dateFactor, clamp01 } from '@/lib/snapshots/time-variation';
import {
  ManpowerCostTimelinePoint,
  ProjectProgressTimelinePoint,
  ResourcePressureTimelinePoint,
  VersionGovernanceTimelinePoint
} from '@/lib/types/timeline-snapshot';

export function buildProjectProgressTimelinePoints(snapshotDate: string): ProjectProgressTimelinePoint[] {
  const factor = dateFactor(snapshotDate);
  const base = buildProjectProgressSnapshots(projectVersionLinkRecords);

  return base.map((s) => ({
    projectId: s.projectId,
    snapshotDate,
    overallProgress: clamp01(s.currentOverallProgress + factor * 0.4),
    progressStatus: s.progressStatus,
    blockedTaskCount: Math.max(0, Math.round(s.blockedTaskCount + factor * 3)),
    highRiskTaskCount: Math.max(0, Math.round(s.highRiskTaskCount + factor * 2)),
    resourcePressureLevel: s.resourcePressureLevel
  }));
}

export function buildResourcePressureTimelinePoints(snapshotDate: string): ResourcePressureTimelinePoint[] {
  const factor = dateFactor(snapshotDate);
  const base = buildResourcePressureSnapshots();

  return base.map((s) => ({
    projectId: s.projectId,
    snapshotDate,
    pressureLevel: s.pressureLevel,
    overloadedPeople: Math.max(0, Math.round(s.overloadedPeople + factor * 2)),
    constrainedPeople: Math.max(0, Math.round(s.constrainedPeople + factor * 2))
  }));
}

export function buildManpowerCostTimelinePoints(snapshotDate: string): ManpowerCostTimelinePoint[] {
  const factor = dateFactor(snapshotDate);
  const base = buildProjectCostComparisonSnapshots();

  return base.map((s) => ({
    projectId: s.projectId,
    snapshotDate,
    plannedCost: s.plannedCost,
    actualCost: Math.max(0, Math.round(s.actualCost * (1 + factor))),
    varianceCost: Math.round((s.actualCost * (1 + factor)) - s.plannedCost),
    varianceRate: s.plannedCost === 0 ? 0 : ((s.actualCost * (1 + factor)) - s.plannedCost) / s.plannedCost,
    riskLevel: s.riskLevel
  }));
}

export function buildVersionGovernanceTimelinePoints(snapshotDate: string): VersionGovernanceTimelinePoint[] {
  const factor = dateFactor(snapshotDate);
  const base = buildVersionGovernanceRecords();

  return base.records.map((r) => ({
    linkedVersionId: r.linkedVersionId,
    snapshotDate,
    governanceStatus: r.governanceStatus,
    releaseReadinessStatus: r.releaseReadinessStatus,
    averageProgress: clamp01(r.averageProgress + factor * 0.3),
    activeRiskCount: Math.max(0, Math.round(r.activeRiskCount + factor * 2))
  }));
}

