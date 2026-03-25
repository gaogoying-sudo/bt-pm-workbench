import { AlertEvidenceRef } from '@/lib/types/alerting';
import { EventTargetRef } from '@/lib/types/input-events';

export type ActionPriority = 'p0' | 'p1' | 'p2' | 'p3';
export type RecommendationStatus =
  | 'new'
  | 'acknowledged'
  | 'snoozed'
  | 'dismissed'
  | 'planned'
  | 'in-progress'
  | 'done'
  | 'done-monitor';

export interface RecommendationReasonRecord {
  summary: string;
  linkedAlertId?: string;
  linkedRuleCode?: string;
  evidence: AlertEvidenceRef[];
}

export interface SuggestedActionRecord {
  id: string;
  title: string;
  steps: string[];
  expectedImpact: string;
  ownerSuggestion?: { personId?: string; roleHint?: string };
}

export interface ActionPlaybookRecord {
  id: string;
  code: string;
  name: string;
  description: string;
  defaultPriority: ActionPriority;
  suggestedActions: SuggestedActionRecord[];
}

export interface RecommendationRecord {
  id: string;
  title: string;
  priority: ActionPriority;
  status: RecommendationStatus;
  targets: EventTargetRef[];
  playbookCode: string;
  reason: RecommendationReasonRecord;
  createdAt: string;
  lastUpdatedAt: string;
  lastUpdatedBy: { personId: string; displayName?: string } | null;
  outcome?: {
    resolvedAt?: string;
    outcomeSummary?: string;
    linkedDecisionId?: string;
    linkedReviewId?: string;
  };
  triage?: {
    dismissedReason?: string;
    snoozedUntil?: string;
  };
}

