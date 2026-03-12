import { SnapshotContext } from '@/lib/types/snapshot';

export interface ProjectExecutionPanelSnapshot {
  progress: number;
  status: string;
  currentStage: string | null;
  blockedTaskCount: number;
  highRiskTaskCount: number;
  summary: string;
}

export interface ProjectResourcePanelSnapshot {
  resourcePressureLevel: string;
  overloadedPeople: number;
  constrainedPeople: number;
  summary: string;
}

export interface ProjectCostPanelSnapshot {
  plannedCost: number;
  actualCost: number;
  varianceCost: number;
  summary: string;
}

export interface ProjectVersionPanelSnapshot {
  versionName: string | null;
  governanceStatus: string | null;
  readinessStatus: string | null;
  variance: number | null;
  summary: string;
}

export interface ProjectRiskPanelSnapshot {
  riskCount: number;
  blockerCount: number;
  topSignalTitle: string | null;
  summary: string;
}

export interface ProjectDetailSnapshot {
  projectId: string;
  projectName: string;
  projectCode: string;
  basicSummary: string;
  execution: ProjectExecutionPanelSnapshot;
  resource: ProjectResourcePanelSnapshot;
  cost: ProjectCostPanelSnapshot;
  version: ProjectVersionPanelSnapshot;
  risk: ProjectRiskPanelSnapshot;
  sourceContext: string[];
  snapshotContext: SnapshotContext;
}
