import { SnapshotContext } from '@/lib/types/snapshot';

export interface ExecutiveOverviewSnapshot {
  totalProjects: number;
  activeProjects: number;
  averageProjectProgress: number;
  highRiskProjects: number;
  readyVersions: number;
  totalWritebackCost: number;
  snapshotContext: SnapshotContext;
}

export interface ProjectHealthSnapshot {
  projectId: string;
  projectName: string;
  progress: number;
  status: string;
  blockedTaskCount: number;
  highRiskTaskCount: number;
  resourcePressureLevel: string;
  versionName: string | null;
  summary: string;
}

export interface ResourceHealthSnapshot {
  totalPeople: number;
  fullyAllocatedCount: number;
  partiallyAvailableCount: number;
  highLoadPeople: number;
  scarceRoleCount: number;
  summary: string;
}

export interface VersionHealthSnapshot {
  linkedVersionId: string;
  versionName: string;
  governanceStatus: string;
  releaseReadinessStatus: string;
  variance: number;
  activeRiskCount: number;
}

export interface DeliveryRiskSnapshot {
  title: string;
  severity: 'low' | 'medium' | 'high';
  sourceModule: string;
  summary: string;
}
