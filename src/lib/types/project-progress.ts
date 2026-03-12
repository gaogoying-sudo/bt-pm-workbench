export type ProjectProgressStatus =
  | 'not-started'
  | 'in-progress'
  | 'at-risk'
  | 'blocked'
  | 'done';

export type ResourcePressureLevel = 'low' | 'medium' | 'high';
export type StageProgressStatus = 'not-started' | 'in-progress' | 'at-risk' | 'blocked' | 'done';
export type ProjectSignalType =
  | 'blocked-task'
  | 'overdue-task'
  | 'high-risk-task'
  | 'resource-pressure'
  | 'writeback-gap'
  | 'stage-delay';
export type ProjectSignalSeverity = 'low' | 'medium' | 'high';
export type ProjectSignalStatus = 'open' | 'watching' | 'mitigated';
export type ProjectVersionRelationType =
  | 'baseline-reference'
  | 'current-plan'
  | 'release-target'
  | 'milestone-alignment';

export interface ProjectProgressSnapshot {
  id: string;
  projectId: string;
  currentOverallProgress: number;
  progressStatus: ProjectProgressStatus;
  currentStageId: string | null;
  activeTaskCount: number;
  completedTaskCount: number;
  blockedTaskCount: number;
  overdueTaskCount: number;
  highRiskTaskCount: number;
  activeOwnerCount: number;
  resourcePressureLevel: ResourcePressureLevel;
  latestSummary: string;
  sourceTaskAggregateCount: number;
  sourceStageAggregateCount: number;
  writebackReadyFlag: boolean;
  linkedVersionId: string | null;
  notes: string;
}

export interface ProjectStageProgressSnapshot {
  id: string;
  projectId: string;
  stageId: string;
  stageName: string;
  stageOrder: number;
  stageProgress: number;
  stageStatus: StageProgressStatus;
  taskCount: number;
  completedTaskCount: number;
  inProgressTaskCount: number;
  blockedTaskCount: number;
  overdueTaskCount: number;
  milestoneTaskCount: number;
  plannedWorkDays: number;
  actualWorkDays: number;
  riskSummary: string;
  blockerSummary: string;
  notes: string;
}

export interface ProjectRiskSignal {
  id: string;
  projectId: string;
  signalType: ProjectSignalType;
  severity: ProjectSignalSeverity;
  title: string;
  summary: string;
  relatedStageId: string | null;
  relatedTaskIds: string[];
  sourceType: string;
  suggestedAction: string;
  status: ProjectSignalStatus;
}

export interface ProjectVersionLinkRecord {
  id: string;
  projectId: string;
  linkedVersionId: string;
  versionName: string;
  relationType: ProjectVersionRelationType;
  progressSnapshotDate: string;
  baselineProgress: number;
  currentProgress: number;
  variance: number;
  notes: string;
}
