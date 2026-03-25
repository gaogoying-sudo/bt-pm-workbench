export type QualityCheckType =
  | 'deliverable-review'
  | 'code-review'
  | 'test-coverage'
  | 'acceptance-criteria'
  | 'documentation-completeness'
  | 'regression-check';

export type QualityStatus = 'pending' | 'in-review' | 'passed' | 'failed' | 'waived';
export type QualitySeverity = 'info' | 'minor' | 'major' | 'critical';

export interface QualityCheckRecord {
  id: string;
  projectId: string;
  stageId: string | null;
  taskId: string | null;
  checkType: QualityCheckType;
  title: string;
  description: string;
  status: QualityStatus;
  severity: QualitySeverity;
  reviewerId: string | null;
  checkedAt: string;
  resolvedAt: string | null;
  notes: string;
}

export interface QualityGateDefinition {
  id: string;
  projectId: string;
  stageId: string;
  gateName: string;
  requiredCheckTypes: QualityCheckType[];
  passThreshold: number;
  isBlocking: boolean;
  notes: string;
}

export interface ProjectQualitySnapshot {
  projectId: string;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  pendingChecks: number;
  criticalFailures: number;
  qualityScore: number;
  summary: string;
}
