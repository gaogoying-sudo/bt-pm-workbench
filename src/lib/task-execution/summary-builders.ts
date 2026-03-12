import { LoadRiskLevel } from '@/lib/types/task-execution-aggregation';

export const MOCK_TODAY = '2026-03-12';

export function buildStageRiskSummary(input: {
  blockedTaskCount: number;
  atRiskTaskCount: number;
  overdueTaskCount: number;
}): string {
  if (input.blockedTaskCount > 0) {
    return 'Blocked tasks require immediate action';
  }
  if (input.atRiskTaskCount > 0 || input.overdueTaskCount > 0) {
    return 'Execution risk needs active follow-up';
  }
  return 'Stage execution is currently stable';
}

export function buildProjectSummaryText(input: {
  totalTaskCount: number;
  blockedTaskCount: number;
  highRiskTaskCount: number;
  weightedProgress: number;
}): string {
  if (input.blockedTaskCount > 0) {
    return `${input.blockedTaskCount} blocked tasks are slowing project execution`;
  }
  if (input.highRiskTaskCount > 0) {
    return `${input.highRiskTaskCount} high-risk tasks need mitigation`;
  }
  return `Project is progressing at ${Math.round(input.weightedProgress * 100)}% across ${input.totalTaskCount} tasks`;
}

export function buildLoadRiskLevel(input: {
  blockedTaskCount: number;
  highPriorityTaskCount: number;
  utilizationReference: number;
  availabilityReference: string;
}): LoadRiskLevel {
  if (
    input.blockedTaskCount >= 2 ||
    input.highPriorityTaskCount >= 3 ||
    input.utilizationReference >= 0.9 ||
    input.availabilityReference === 'fully-allocated' ||
    input.availabilityReference === 'unavailable'
  ) {
    return 'high';
  }

  if (
    input.blockedTaskCount >= 1 ||
    input.highPriorityTaskCount >= 2 ||
    input.utilizationReference >= 0.75 ||
    input.availabilityReference === 'partially-available'
  ) {
    return 'medium';
  }

  return 'low';
}

export function buildPersonLoadSummary(input: {
  ownedTaskCount: number;
  blockedTaskCount: number;
  highPriorityTaskCount: number;
  loadRiskLevel: LoadRiskLevel;
}): string {
  if (input.loadRiskLevel === 'high') {
    return `High pressure with ${input.blockedTaskCount} blocked and ${input.highPriorityTaskCount} high-priority tasks`;
  }
  if (input.loadRiskLevel === 'medium') {
    return `Moderate pressure across ${input.ownedTaskCount} owned tasks`;
  }
  return `Load is manageable across ${input.ownedTaskCount} owned tasks`;
}

export function clampProgress(value: number): number {
  return Math.max(0, Math.min(1, value));
}
