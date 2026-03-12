import { SnapshotContext } from '@/lib/types/snapshot';

export interface ManpowerActualInputAdapterResult {
  projectId: string;
  stageId: string | null;
  sourceTaskCount: number;
  sourceAllocationCount: number;
  adaptedActualWorkDays: number;
  adaptedActualCost: number;
  notes: string;
}

export interface ManpowerCostSummary {
  totalPlannedCost: number;
  totalActualCost: number;
  totalVarianceCost: number;
  totalPlannedWorkDays: number;
  totalActualWorkDays: number;
  snapshotContext: SnapshotContext;
}

export interface StageCostComparisonSnapshot {
  projectId: string;
  stageId: string;
  plannedWorkDays: number;
  actualWorkDays: number;
  plannedCost: number;
  actualCost: number;
  varianceCost: number;
  varianceRate: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ProjectCostComparisonSnapshot {
  projectId: string;
  plannedWorkDays: number;
  actualWorkDays: number;
  plannedCost: number;
  actualCost: number;
  varianceCost: number;
  varianceRate: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface RoleCostSnapshot {
  roleId: string;
  roleName: string;
  defaultDailyRate: number;
  defaultMonthlyCost: number;
  mappedActualWorkDays: number;
  estimatedActualCost: number;
}
