import { SnapshotContext } from '@/lib/types/snapshot';

export type VersionGovernanceStatus = 'on-track' | 'watching' | 'blocked' | 'ready-to-release';
export type ReleaseReadinessStatus = 'ready' | 'watching' | 'blocked' | 'pending';
export type ReleaseWindowStatus = 'planned' | 'tentative' | 'locked' | 'missed';
export type VersionRiskSignalType = 'progress-gap' | 'release-readiness' | 'risk-cluster' | 'writeback-gap' | 'resource-pressure';

export interface VersionGovernanceRecord {
  id: string;
  linkedVersionId: string;
  versionName: string;
  relationType: string;
  projectCount: number;
  averageProgress: number;
  baselineProgress: number;
  variance: number;
  activeRiskCount: number;
  blockedProjectCount: number;
  writebackReadyProjectCount: number;
  releaseReadinessStatus: ReleaseReadinessStatus;
  governanceStatus: VersionGovernanceStatus;
  latestSummary: string;
  snapshotContext: SnapshotContext;
  notes: string;
}

export interface VersionProjectLinkRecord {
  id: string;
  linkedVersionId: string;
  projectId: string;
  projectName: string;
  currentProgress: number;
  progressStatus: string;
  resourcePressureLevel: string;
  blockedTaskCount: number;
  highRiskTaskCount: number;
  writebackReadyFlag: boolean;
  latestSummary: string;
}

export interface ReleaseReadinessRecord {
  id: string;
  linkedVersionId: string;
  readinessStatus: ReleaseReadinessStatus;
  projectCoverage: number;
  taskWritebackCoverage: number;
  blockerCount: number;
  highRiskCount: number;
  recommendedAction: string;
  notes: string;
}

export interface ReleaseWindowRecord {
  id: string;
  linkedVersionId: string;
  windowName: string;
  plannedStartDate: string;
  plannedEndDate: string;
  releaseManager: string;
  status: ReleaseWindowStatus;
  notes: string;
}

export interface VersionRiskSignal {
  id: string;
  linkedVersionId: string;
  signalType: VersionRiskSignalType;
  severity: 'low' | 'medium' | 'high';
  title: string;
  summary: string;
  relatedProjectIds: string[];
  sourceType: string;
  suggestedAction: string;
  status: 'open' | 'watching' | 'mitigated';
}
