import { EventTargetRef } from '@/lib/types/input-events';

export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertStatus =
  | 'new'
  | 'acknowledged'
  | 'snoozed'
  | 'dismissed'
  | 'action-planned'
  | 'in-progress'
  | 'resolved'
  | 'resolved-monitor';

export interface AlertEvidenceRef {
  kind: 'metric' | 'snapshot' | 'quality' | 'readiness' | 'event' | 'data-quality' | 'link';
  refId: string;
  label: string;
  details?: string;
}

export interface AlertRuleRecord {
  id: string;
  code: string;
  name: string;
  description: string;
  severity: AlertSeverity;
  enabled: boolean;
  version: string;
  changedAt: string;
  changedBy: string;
  changeReason: string;
}

export interface TrendSignalRecord {
  id: string;
  signalType: 'slope-down' | 'threshold-breach' | 'repeated-anomaly';
  metricCode: string;
  metricVersion: string;
  scope: 'portfolio' | 'project' | 'version' | 'person';
  scopeId: string | null;
  window: { baselineDate: string; snapshotDate: string };
  summary: string;
  severity: AlertSeverity;
  evidence: AlertEvidenceRef[];
  detectedAt: string;
}

export interface ForecastRecord {
  id: string;
  forecastType: 'release-readiness' | 'workload-pressure' | 'event-backlog' | 'quality-readiness';
  scope: 'portfolio' | 'project' | 'version';
  scopeId: string | null;
  horizonDays: number;
  summary: string;
  confidence: 'low' | 'medium' | 'high';
  evidence: AlertEvidenceRef[];
  generatedAt: string;
}

export interface LeadIndicatorRecord {
  id: string;
  indicatorType: 'backlog' | 'mapping-gap' | 'quality-gate-risk' | 'writeback-gap';
  scope: 'portfolio' | 'project' | 'version';
  scopeId: string | null;
  value: number;
  unit: string;
  status: 'good' | 'watching' | 'blocked';
  summary: string;
  evidence: AlertEvidenceRef[];
  generatedAt: string;
}

export interface AlertRecord {
  id: string;
  ruleCode: string;
  title: string;
  severity: AlertSeverity;
  status: AlertStatus;
  scope: 'portfolio' | 'project' | 'version' | 'person';
  scopeId: string | null;
  targets: EventTargetRef[];
  summary: string;
  why: string;
  evidence: AlertEvidenceRef[];
  suggestedNextActions: string[];
  createdAt: string;
  lastUpdatedAt: string;
  lastUpdatedBy: { personId: string; displayName?: string } | null;
  triage?: {
    acknowledgedAt?: string;
    dismissedReason?: string;
    snoozedUntil?: string;
    resolvedAt?: string;
    resolutionNote?: string;
  };
}

export interface AlertTriggerRecord {
  id: string;
  alertId: string;
  triggeredAt: string;
  triggerReason: string;
  evidence: AlertEvidenceRef[];
}

export interface AlertingPack {
  generatedAt: string;
  rules: AlertRuleRecord[];
  alerts: AlertRecord[];
  trendSignals: TrendSignalRecord[];
  forecasts: ForecastRecord[];
  leadIndicators: LeadIndicatorRecord[];
}

