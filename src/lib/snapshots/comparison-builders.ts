import {
  ManpowerCostTimelinePoint,
  ProjectProgressTimelinePoint,
  ResourcePressureTimelinePoint,
  SnapshotComparisonRecord,
  VersionGovernanceTimelinePoint
} from '@/lib/types/timeline-snapshot';

export function compareProjectProgress(
  subjectId: string,
  current: ProjectProgressTimelinePoint,
  baseline: ProjectProgressTimelinePoint | null,
  compare: ProjectProgressTimelinePoint | null
): SnapshotComparisonRecord<ProjectProgressTimelinePoint> {
  const deltaBaseline = baseline ? current.overallProgress - baseline.overallProgress : null;
  const deltaCompare = compare ? current.overallProgress - compare.overallProgress : null;
  const summary = [
    `progress ${Math.round(current.overallProgress * 100)}%`,
    deltaBaseline !== null ? `vs baseline ${deltaBaseline >= 0 ? '+' : ''}${Math.round(deltaBaseline * 100)}%` : null,
    deltaCompare !== null ? `vs compare ${deltaCompare >= 0 ? '+' : ''}${Math.round(deltaCompare * 100)}%` : null
  ]
    .filter(Boolean)
    .join(', ');

  return { module: 'project-progress', subjectId, current, baseline, compare, deltaSummary: summary };
}

export function compareVersionGovernance(
  subjectId: string,
  current: VersionGovernanceTimelinePoint,
  baseline: VersionGovernanceTimelinePoint | null,
  compare: VersionGovernanceTimelinePoint | null
): SnapshotComparisonRecord<VersionGovernanceTimelinePoint> {
  const delta = (other: VersionGovernanceTimelinePoint | null) =>
    other ? current.averageProgress - other.averageProgress : null;
  const summary = [
    `avg progress ${Math.round(current.averageProgress * 100)}%`,
    delta(baseline) !== null ? `vs baseline ${delta(baseline)! >= 0 ? '+' : ''}${Math.round(delta(baseline)! * 100)}%` : null,
    delta(compare) !== null ? `vs compare ${delta(compare)! >= 0 ? '+' : ''}${Math.round(delta(compare)! * 100)}%` : null
  ]
    .filter(Boolean)
    .join(', ');

  return { module: 'version-governance', subjectId, current, baseline, compare, deltaSummary: summary };
}

export function compareResourcePressure(
  subjectId: string,
  current: ResourcePressureTimelinePoint,
  baseline: ResourcePressureTimelinePoint | null,
  compare: ResourcePressureTimelinePoint | null
): SnapshotComparisonRecord<ResourcePressureTimelinePoint> {
  const deltaOverload = (other: ResourcePressureTimelinePoint | null) =>
    other ? current.overloadedPeople - other.overloadedPeople : null;
  const summary = [
    `overloaded ${current.overloadedPeople}`,
    deltaOverload(baseline) !== null ? `vs baseline ${deltaOverload(baseline)! >= 0 ? '+' : ''}${deltaOverload(baseline)!}` : null,
    deltaOverload(compare) !== null ? `vs compare ${deltaOverload(compare)! >= 0 ? '+' : ''}${deltaOverload(compare)!}` : null
  ]
    .filter(Boolean)
    .join(', ');

  return { module: 'resource-pressure', subjectId, current, baseline, compare, deltaSummary: summary };
}

export function compareManpowerCost(
  subjectId: string,
  current: ManpowerCostTimelinePoint,
  baseline: ManpowerCostTimelinePoint | null,
  compare: ManpowerCostTimelinePoint | null
): SnapshotComparisonRecord<ManpowerCostTimelinePoint> {
  const delta = (other: ManpowerCostTimelinePoint | null) =>
    other ? current.varianceCost - other.varianceCost : null;
  const summary = [
    `variance ${current.varianceCost}`,
    delta(baseline) !== null ? `vs baseline ${delta(baseline)! >= 0 ? '+' : ''}${delta(baseline)!}` : null,
    delta(compare) !== null ? `vs compare ${delta(compare)! >= 0 ? '+' : ''}${delta(compare)!}` : null
  ]
    .filter(Boolean)
    .join(', ');

  return { module: 'manpower-cost', subjectId, current, baseline, compare, deltaSummary: summary };
}

