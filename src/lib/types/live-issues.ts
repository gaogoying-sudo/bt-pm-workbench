export type DefectSeverity = 'blocker' | 'high' | 'medium' | 'low';
export type TriageDisposition =
  | 'hotfix'
  | 'rule-tuning'
  | 'accepted-caveat'
  | 'deferred'
  | 'by-design-clarification'
  | 'duplicate';

export type DefectScope =
  | 'ui'
  | 'rules-metrics'
  | 'permission-identity'
  | 'mapping-import-export'
  | 'writeback-snapshot'
  | 'performance-stability'
  | 'docs-runbook';

export interface FixValidationRecord {
  validatedAt: string;
  validatedBy: string;
  steps: string[];
  result: 'pass' | 'fail';
  notes: string;
}

export interface SafeOperatingRangeRecord {
  id: string;
  title: string;
  recommended: string[];
  notRecommended: string[];
  troubleshooting: string[];
  updatedAt: string;
}

export interface KnownIssueRecord {
  id: string;
  title: string;
  severity: DefectSeverity;
  disposition: TriageDisposition;
  scope: DefectScope;
  status: 'open' | 'mitigating' | 'fixed' | 'deferred' | 'accepted';
  affectedPages: string[];
  reproduction: string[];
  workaround: string[];
  fixPlan: string[];
  validation?: FixValidationRecord;
  updatedAt: string;
}

export interface LiveIssueRecord {
  id: string;
  title: string;
  severity: DefectSeverity;
  scope: DefectScope;
  source:
    | 'user-feedback'
    | 'demo-run'
    | 'page-error'
    | 'permission-boundary'
    | 'rule-misjudge'
    | 'import-export-failure'
    | 'identity-mapping-failure'
    | 'writeback-inconsistency'
    | 'performance';
  description: string;
  affectedPages: string[];
  detectedAt: string;
  triage: {
    disposition: TriageDisposition;
    owner: string;
    notes: string;
    hotfixCandidate: boolean;
  };
  validation?: FixValidationRecord;
  status: 'new' | 'triaged' | 'fixing' | 'fixed' | 'deferred' | 'accepted';
  links: Array<{ label: string; ref: string }>;
  updatedAt: string;
}

