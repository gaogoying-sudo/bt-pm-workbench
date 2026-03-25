export type ReleaseReadinessStatus =
  | 'ready'
  | 'ready-with-caveats'
  | 'blocked'
  | 'deferred'
  | 'non-critical-gap-accepted';

export interface AcceptanceCriterionRecord {
  id: string;
  category:
    | 'master-data'
    | 'core-pages'
    | 'snapshot-quality'
    | 'input-events'
    | 'identity-access'
    | 'external-collaboration'
    | 'persistence-env-testing-docs'
    | 'management-review';
  title: string;
  description: string;
  status: 'pass' | 'fail' | 'caveat';
  evidence: string[];
  owner: string;
}

export interface FinalAcceptanceChecklistRecord {
  id: string;
  title: string;
  createdAt: string;
  criteria: AcceptanceCriterionRecord[];
}

export interface CriticalGapRecord {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  disposition: 'must-fix' | 'defer' | 'accepted';
  status: 'open' | 'mitigating' | 'closed';
  owner: string;
  notes: string;
}

export interface ReleaseReadinessRecord {
  id: string;
  status: ReleaseReadinessStatus;
  summary: string;
  blockers: string[];
  caveats: string[];
  decidedAt: string;
}

export interface RoleWalkthroughRecord {
  id: string;
  role: 'executive' | 'project-owner' | 'member' | 'observer';
  goal: string;
  steps: Array<{ label: string; path: string; expected: string }>;
}

export interface DemoReadinessRecord {
  id: string;
  status: 'ready' | 'needs-reset' | 'blocked';
  demoDataMode: 'seed' | 'file-persisted';
  resetSteps: string[];
  notes: string;
}

