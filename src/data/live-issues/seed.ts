import { KnownIssueRecord, LiveIssueRecord, SafeOperatingRangeRecord } from '@/lib/types/live-issues';

const now = new Date().toISOString();

export const seededLiveIssues: LiveIssueRecord[] = [
  {
    id: 'live-001',
    title: 'ESLint config next/typescript missing during build',
    severity: 'medium',
    scope: 'docs-runbook',
    source: 'demo-run',
    description: 'next build shows ESLint config load error; build still compiles but fails lint step.',
    affectedPages: [],
    detectedAt: now,
    triage: {
      disposition: 'accepted-caveat',
      owner: 'maintenance',
      notes: 'Treat as toolchain config issue; fix when aligning eslint/next config.',
      hotfixCandidate: false
    },
    status: 'triaged',
    links: [{ label: 'Build output', ref: 'npm run build' }],
    updatedAt: now
  },
  {
    id: 'live-002',
    title: 'Alert backlog threshold too sensitive for small teams',
    severity: 'low',
    scope: 'rules-metrics',
    source: 'rule-misjudge',
    description: 'Input backlog alerts can be noisy in early adoption; calibrate thresholds.',
    affectedPages: ['/executive-dashboard', '/input-inbox'],
    detectedAt: now,
    triage: {
      disposition: 'rule-tuning',
      owner: 'governance',
      notes: 'Calibrated in alerting-service: watching>=5, critical>=10. Keep monitoring.',
      hotfixCandidate: false
    },
    status: 'fixed',
    links: [{ label: 'alerting-service', ref: 'src/server/services/alerting-service.ts' }],
    updatedAt: now
  }
];

export const seededKnownIssues: KnownIssueRecord[] = [
  {
    id: 'known-001',
    title: 'Feishu identity binding UI not implemented',
    severity: 'high',
    disposition: 'deferred',
    scope: 'permission-identity',
    status: 'deferred',
    affectedPages: ['/login', '/executive-dashboard'],
    reproduction: ['Set auth mode to feishu', 'Login with a user that has no binding'],
    workaround: ['Use mock mode in dev', 'Bind identity manually via data seed (future)'],
    fixPlan: ['Add bind page', 'Add org mapping strategy', 'Add tests for unbound user flow'],
    updatedAt: now
  }
];

export const seededSafeOperatingRange: SafeOperatingRangeRecord = {
  id: 'safe-001',
  title: 'PM-WORKBENCH Safe Operating Range (post-launch v0)',
  recommended: [
    'Use file persistence mode for demo and trial runs: PMW_PERSISTENCE_MODE=file',
    'Use /input-inbox for all operational updates (do not patch data arrays manually)',
    'Treat readiness as external-consumer oriented; keep mapping up to date'
  ],
  notRecommended: [
    'Do not bypass input confirmation/writeback chain',
    'Do not implement page-local “health scores”',
    'Do not change metric meaning without version bump'
  ],
  troubleshooting: ['Check /api/health', 'Check /api/data-governance for mapping/drift warnings', 'Check /api/alerting for proactive signals'],
  updatedAt: now
};

