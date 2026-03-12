export type TaskProgressStatus = 'not-started' | 'in-progress' | 'blocked' | 'at-risk' | 'done';
export type LoadRiskLevel = 'low' | 'medium' | 'high';
export type WritebackStatus = 'mock-preview' | 'ready' | 'partial';

export interface TaskExecutionAggregate {
  taskId: string;
  plannedWorkDays: number;
  actualWorkDays: number;
  activitySpentWorkDays: number;
  normalizedActualWorkDays: number;
  progress: number;
  progressStatus: TaskProgressStatus;
  riskLevel: 'low' | 'medium' | 'high';
  blockerFlag: boolean;
  overdueFlag: boolean;
  ownerPersonId: string;
  relatedAllocationIds: string[];
}

export interface StageExecutionAggregate {
  projectId: string;
  stageId: string;
  taskCount: number;
  completedTaskCount: number;
  inProgressTaskCount: number;
  blockedTaskCount: number;
  atRiskTaskCount: number;
  stagePlannedWorkDays: number;
  stageActualWorkDays: number;
  weightedProgress: number;
  milestoneRelatedTaskCount: number;
  overdueTaskCount: number;
  blockerTaskCount: number;
  riskSummary: string;
}

export interface ProjectExecutionAggregate {
  projectId: string;
  totalTaskCount: number;
  completedTaskCount: number;
  blockedTaskCount: number;
  highRiskTaskCount: number;
  plannedWorkDays: number;
  actualWorkDays: number;
  weightedProgress: number;
  overdueTaskCount: number;
  activeOwnerCount: number;
  relatedAllocationCount: number;
  writebackCostReadyFlag: boolean;
  summaryText: string;
}

export interface PersonTaskLoadAggregate {
  personId: string;
  ownedTaskCount: number;
  collaboratorTaskCount: number;
  inProgressTaskCount: number;
  blockedTaskCount: number;
  highPriorityTaskCount: number;
  plannedWorkDays: number;
  actualWorkDays: number;
  activitySpentWorkDays: number;
  utilizationReference: number;
  availabilityReference: string;
  relatedProjectIds: string[];
  loadRiskLevel: LoadRiskLevel;
  summaryText: string;
}

export interface AllocationConsumptionAggregate {
  allocationId: string;
  personId: string;
  projectId: string;
  relatedTaskIds: string[];
  plannedWorkDays: number;
  actualWorkDays: number;
  activitySpentWorkDays: number;
  allocationRate: number;
  allocationMode: string;
  utilizationPressure: number;
  writebackReady: boolean;
}

export interface TaskExecutionWritebackRecord {
  id: string;
  sourceType: 'task-execution-aggregate';
  sourceProjectId: string;
  sourceStageId: string;
  sourceTaskIds: string[];
  targetAllocationIds: string[];
  targetPersonIds: string[];
  aggregatedPlannedWorkDays: number;
  aggregatedActualWorkDays: number;
  estimatedActualCost: number;
  writebackStatus: WritebackStatus;
  notes: string;
}
