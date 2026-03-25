import {
  MetricDictionaryPack,
  MetricDefinitionRecord,
  MetricDimensionRecord,
  MetricDisplayContract,
  MetricFormulaRecord,
  MetricVersionRecord,
  ScoringRuleRecord,
  StatusInterpretationRecord,
  ThresholdRuleRecord
} from '@/lib/types/metrics';

const now = new Date().toISOString();

const dimensions: MetricDimensionRecord[] = [
  { id: 'dim-scope', code: 'scope', name: 'Scope', description: 'Metric scope: portfolio/project/version' },
  { id: 'dim-snapshot', code: 'snapshotDate', name: 'Snapshot Date', description: 'Time dimension used for computation' },
  { id: 'dim-compare', code: 'compareMode', name: 'Compare Mode', description: 'current/baseline/compare' }
];

const formulas: MetricFormulaRecord[] = [
  {
    id: 'f-project-health-v1',
    formula: 'healthScore = weighted(progressDelta, riskSignals, qualityScore, writebackCoverage)',
    inputs: ['progressDelta', 'riskSignals', 'qualityScore', 'writebackCoverage'],
    notes: 'v1 uses existing snapshots and summaries; stable and explainable.'
  },
  {
    id: 'f-external-readiness-v1',
    formula: 'readinessLevel derived from mapping + exportReady + quality gate + blocker count',
    inputs: ['externalMapping', 'exportReady', 'qualityGate', 'blockers'],
    notes: 'Readiness is external-consumer oriented, not internal progress.'
  }
];

const versions: MetricVersionRecord[] = [
  { id: 'mv-health-1', metricCode: 'project.healthScore', version: 'v1', status: 'active', releasedAt: now, changeNotes: 'Initial frozen definition for closeout + governance.' },
  { id: 'mv-progress-delta-1', metricCode: 'project.progressDelta', version: 'v1', status: 'active', releasedAt: now, changeNotes: 'Uses timeline points current vs baseline/compare.' },
  { id: 'mv-quality-ready-1', metricCode: 'project.qualityReadiness', version: 'v1', status: 'active', releasedAt: now, changeNotes: 'Uses quality summary score + gate status.' },
  { id: 'mv-release-ready-1', metricCode: 'version.releaseReadiness', version: 'v1', status: 'active', releasedAt: now, changeNotes: 'Uses version governance + quality gate + writeback coverage.' },
  { id: 'mv-external-ready-1', metricCode: 'external.readiness', version: 'v1', status: 'active', releasedAt: now, changeNotes: 'Uses readiness-builders with mapping checks.' }
];

const scoringRules: ScoringRuleRecord[] = [
  {
    id: 'sr-health-1',
    code: 'rule.project.health.v1',
    name: 'Project health score v1',
    metricCode: 'project.healthScore',
    version: 'v1',
    status: 'active',
    ruleText: 'Score is a weighted aggregate of progress delta, risk and quality; blocked signals dominate.',
    rationale: 'Management needs a stable summary; v1 favors explainability over ML.',
    changedAt: now,
    changedBy: 'system',
    changeReason: 'Initial governance freeze'
  }
];

const thresholds: ThresholdRuleRecord[] = [
  {
    id: 'th-quality-ready-1',
    metricCode: 'project.qualityReadiness',
    version: 'v1',
    thresholds: [
      { label: 'Good', min: 0.85, status: 'good' },
      { label: 'Watching', min: 0.7, max: 0.85, status: 'watching' },
      { label: 'Blocked', max: 0.7, status: 'blocked' }
    ],
    notes: 'Score is the aggregated pass rate; blocked gates force blocked status.'
  }
];

const interpretations: StatusInterpretationRecord[] = [
  {
    id: 'si-external-ready-1',
    metricCode: 'external.readiness',
    version: 'v1',
    bilingualLabel: { zh: '外部就绪', en: 'External Readiness' },
    explanation: 'External readiness means the state is safe to be consumed by external systems (supply/delivery/reporting).'
  }
];

function makeDisplay(metricCode: string, valueType: MetricDisplayContract['valueType'], zh: string, en: string, pages: string[], unitLabel?: string) {
  const display: MetricDisplayContract = {
    id: `disp-${metricCode}`,
    metricCode,
    valueType,
    unitLabel,
    displayName: { zh, en },
    primaryPages: pages
  };
  return display;
}

const metrics: MetricDefinitionRecord[] = [
  {
    id: 'm-health',
    code: 'project.healthScore',
    name: 'Project Health Score',
    description: 'A management-facing summary score for project health.',
    sources: ['project progress timeline', 'risk signals', 'quality summary', 'writeback coverage'],
    dimensions: ['scope', 'snapshotDate', 'compareMode'],
    formulaRef: 'f-project-health-v1',
    display: makeDisplay('project.healthScore', 'score', '项目健康度', 'Project Health', ['/executive-dashboard', '/projects/[projectId]']),
    currentVersion: 'v1',
    deprecated: false
  },
  {
    id: 'm-progress-delta',
    code: 'project.progressDelta',
    name: 'Project Progress Delta',
    description: 'Delta of average progress vs baseline/compare snapshot.',
    sources: ['timeline points'],
    dimensions: ['snapshotDate', 'compareMode'],
    formulaRef: 'f-project-health-v1',
    display: makeDisplay('project.progressDelta', 'ratio', '进度偏差', 'Progress Delta', ['/executive-dashboard', '/project-progress'], 'Δ%'),
    currentVersion: 'v1',
    deprecated: false
  },
  {
    id: 'm-quality-ready',
    code: 'project.qualityReadiness',
    name: 'Quality Readiness',
    description: 'Quality readiness from quality score and gate status.',
    sources: ['quality summary', 'quality gate records'],
    dimensions: ['snapshotDate'],
    formulaRef: 'f-project-health-v1',
    display: makeDisplay('project.qualityReadiness', 'score', '质量就绪度', 'Quality Readiness', ['/project-progress', '/version-governance', '/projects/[projectId]']),
    currentVersion: 'v1',
    deprecated: false
  },
  {
    id: 'm-release-ready',
    code: 'version.releaseReadiness',
    name: 'Version Release Readiness',
    description: 'Release readiness derived from governance + quality + writeback.',
    sources: ['version governance', 'quality gates', 'writeback'],
    dimensions: ['snapshotDate', 'compareMode'],
    formulaRef: 'f-project-health-v1',
    display: makeDisplay('version.releaseReadiness', 'text', '版本可发布度', 'Release Readiness', ['/version-governance']),
    currentVersion: 'v1',
    deprecated: false
  },
  {
    id: 'm-external-ready',
    code: 'external.readiness',
    name: 'External Readiness',
    description: 'External-consumer readiness, independent from internal progress.',
    sources: ['readiness-builders', 'data-exchange bindings'],
    dimensions: ['snapshotDate'],
    formulaRef: 'f-external-readiness-v1',
    display: makeDisplay('external.readiness', 'text', '外部就绪', 'External Readiness', ['/executive-dashboard', '/projects/[projectId]', '/version-governance', '/data-exchange']),
    currentVersion: 'v1',
    deprecated: false
  }
];

export const metricDictionaryPack: MetricDictionaryPack = {
  generatedAt: now,
  metrics,
  dimensions,
  formulas,
  versions,
  scoringRules,
  thresholds,
  interpretations
};

