import { SnapshotContext } from '@/lib/types/snapshot';

export type SnapshotPointType = 'baseline' | 'current' | 'compare';

export interface SnapshotSeriesPoint {
  pointType: SnapshotPointType;
  date: string;
  label: string;
}

export interface SnapshotBatchRecord {
  id: string;
  createdAt: string;
  context: SnapshotContext;
  points: SnapshotSeriesPoint[];
  notes?: string;
}

export interface SnapshotComparisonRecord<T> {
  module: 'project-progress' | 'version-governance' | 'resource-pressure' | 'manpower-cost';
  subjectId: string;
  current: T;
  baseline: T | null;
  compare: T | null;
  deltaSummary: string;
}

export interface ProjectProgressTimelinePoint {
  projectId: string;
  snapshotDate: string;
  overallProgress: number;
  progressStatus: string;
  blockedTaskCount: number;
  highRiskTaskCount: number;
  resourcePressureLevel: string;
}

export interface VersionGovernanceTimelinePoint {
  linkedVersionId: string;
  snapshotDate: string;
  governanceStatus: string;
  releaseReadinessStatus: string;
  averageProgress: number;
  activeRiskCount: number;
}

export interface ResourcePressureTimelinePoint {
  projectId: string;
  snapshotDate: string;
  pressureLevel: string;
  overloadedPeople: number;
  constrainedPeople: number;
}

export interface ManpowerCostTimelinePoint {
  projectId: string;
  snapshotDate: string;
  plannedCost: number;
  actualCost: number;
  varianceCost: number;
  varianceRate: number;
  riskLevel: 'low' | 'medium' | 'high';
}

