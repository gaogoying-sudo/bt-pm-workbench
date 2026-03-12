import { SnapshotContext } from '@/lib/types/snapshot';

export interface ResourceAllocationAggregate {
  allocationId: string;
  personId: string;
  projectId: string;
  roleId: string;
  phaseIds: string[];
  allocationRate: number;
  activeTaskCount: number;
  plannedWorkDays: number;
  actualWorkDays: number;
  conflictFlag: boolean;
  utilizationPressure: number;
}

export interface ResourcePressureSnapshot {
  projectId: string;
  overloadedPeople: number;
  constrainedPeople: number;
  pressureLevel: 'low' | 'medium' | 'high';
  summary: string;
  snapshotContext: SnapshotContext;
}

export interface HiringGapSnapshot {
  projectId: string;
  roleId: string;
  demandHeadcount: number;
  availableHeadcount: number;
  mismatchLevel: 'low' | 'medium' | 'high';
  summary: string;
}

export interface AllocationUtilizationSnapshot {
  personId: string;
  totalAllocationRate: number;
  utilizationStatus: 'available' | 'partial' | 'full' | 'overloaded';
  relatedProjectIds: string[];
  summary: string;
}

export interface AllocationWritebackPreview {
  id: string;
  projectId: string;
  personId: string;
  roleId: string;
  actualWorkDays: number;
  estimatedActualCost: number;
  notes: string;
}
