import { AlertRuleRecord } from '@/lib/types/alerting';

const now = new Date().toISOString();

export const alertRules: AlertRuleRecord[] = [
  {
    id: 'rule-progress-delta-down',
    code: 'alert.project.progress.delta.down',
    name: 'Project progress delta worsening',
    description: 'Baseline vs current progress delta is negative beyond threshold (trend down).',
    severity: 'warning',
    enabled: true,
    version: 'v1',
    changedAt: now,
    changedBy: 'system',
    changeReason: 'Initial proactive governance pack'
  },
  {
    id: 'rule-quality-readiness-down',
    code: 'alert.project.quality.readiness.down',
    name: 'Quality readiness down',
    description: 'Quality score or gate status indicates degraded readiness.',
    severity: 'warning',
    enabled: true,
    version: 'v1',
    changedAt: now,
    changedBy: 'system',
    changeReason: 'Initial proactive governance pack'
  },
  {
    id: 'rule-event-backlog',
    code: 'alert.input.backlog',
    name: 'Input confirmation backlog',
    description: 'Drafts awaiting confirmation exceed threshold.',
    severity: 'warning',
    enabled: true,
    version: 'v1',
    changedAt: now,
    changedBy: 'system',
    changeReason: 'Initial proactive governance pack'
  },
  {
    id: 'rule-external-mapping-gap',
    code: 'alert.external.mapping.gap',
    name: 'External mapping gap',
    description: 'External readiness degraded due to missing mapping.',
    severity: 'info',
    enabled: true,
    version: 'v1',
    changedAt: now,
    changedBy: 'system',
    changeReason: 'Initial proactive governance pack'
  }
];

