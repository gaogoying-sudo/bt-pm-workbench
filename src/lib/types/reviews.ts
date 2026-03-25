import { EventTargetRef } from '@/lib/types/input-events';

export type ReviewType = 'project-review' | 'stage-review' | 'version-review' | 'risk-postmortem' | 'quality-postmortem';

export interface ReviewEvidenceRef {
  kind: 'snapshot' | 'event' | 'export-bundle' | 'doc' | 'link';
  refId: string;
  label: string;
}

export interface ReviewOutcomeSummary {
  status: 'completed' | 'in-progress' | 'planned';
  highlights: string[];
  risks: string[];
  actions: string[];
}

export interface ReviewRecord {
  id: string;
  reviewType: ReviewType;
  title: string;
  scope: EventTargetRef[];
  createdAt: string;
  createdByPersonId: string;
  outcome: ReviewOutcomeSummary;
  evidence: ReviewEvidenceRef[];
  notes: string;
}

export interface DecisionScopeRef {
  targets: EventTargetRef[];
}

export interface ActionFollowupRecord {
  id: string;
  title: string;
  ownerPersonId: string;
  dueDate: string;
  status: 'open' | 'in-progress' | 'done' | 'cancelled';
  notes: string;
}

export interface DecisionLogRecord {
  id: string;
  title: string;
  decision: string;
  reason: string;
  scope: DecisionScopeRef;
  decidedAt: string;
  decidedByPersonId: string;
  status: 'effective' | 'superseded' | 'cancelled';
  followups: ActionFollowupRecord[];
  relatedReviewId?: string;
}

export interface LessonLearnedRecord {
  id: string;
  title: string;
  lesson: string;
  tags: string[];
  scope: DecisionScopeRef;
  createdAt: string;
  createdByPersonId: string;
  relatedReviewId?: string;
}

