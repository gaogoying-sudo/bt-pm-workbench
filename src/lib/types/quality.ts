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

export type DeliverableType = 'prd' | 'tech-design' | 'test-plan' | 'release-note' | 'demo' | 'other';

export interface DeliverableQualityRecord {
  id: string;
  projectId: string;
  stageId: string | null;
  linkedVersionId: string | null;
  deliverableType: DeliverableType;
  title: string;
  ownerId: string | null;
  reviewStatus: QualityStatus;
  severity: QualitySeverity;
  reviewedAt: string | null;
  notes: string;
}

export interface QualityIssueRecord {
  id: string;
  projectId: string;
  stageId: string | null;
  linkedVersionId: string | null;
  title: string;
  status: 'open' | 'mitigating' | 'closed';
  severity: QualitySeverity;
  createdAt: string;
  closedAt: string | null;
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

export interface VersionQualityGateRecord {
  id: string;
  linkedVersionId: string;
  gateName: string;
  gateStatus: 'passed' | 'pending' | 'blocked';
  qualityScore: number;
  blockingIssues: number;
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

export interface StageQualitySnapshot {
  projectId: string;
  stageId: string;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  pendingChecks: number;
  qualityScore: number;
  summary: string;
}

export interface QualitySummaryRecord {
  scope: 'portfolio' | 'project' | 'version';
  scopeId: string | null;
  totalChecks: number;
  qualityScore: number;
  blockingGates: number;
  openIssues: number;
  summary: string;
}
