export type MetricValueType = 'ratio' | 'count' | 'currency' | 'text' | 'score';

export interface MetricDimensionRecord {
  id: string;
  code: string;
  name: string;
  description: string;
  allowedValues?: string[];
}

export interface MetricFormulaRecord {
  id: string;
  formula: string;
  inputs: string[];
  notes: string;
}

export interface MetricVersionRecord {
  id: string;
  metricCode: string;
  version: string;
  status: 'active' | 'deprecated' | 'draft';
  releasedAt: string;
  changeNotes: string;
  replacedByVersion?: string;
}

export interface ThresholdRuleRecord {
  id: string;
  metricCode: string;
  version: string;
  thresholds: Array<{
    label: string;
    min?: number;
    max?: number;
    status: 'good' | 'watching' | 'blocked' | 'unknown';
  }>;
  notes: string;
}

export interface StatusInterpretationRecord {
  id: string;
  metricCode: string;
  version: string;
  bilingualLabel: { zh: string; en: string };
  explanation: string;
}

export interface MetricDisplayContract {
  id: string;
  metricCode: string;
  valueType: MetricValueType;
  unitLabel?: string;
  displayName: { zh: string; en: string };
  primaryPages: string[];
}

export interface MetricDefinitionRecord {
  id: string;
  code: string;
  name: string;
  description: string;
  sources: string[];
  dimensions: string[];
  formulaRef: string;
  display: MetricDisplayContract;
  currentVersion: string;
  deprecated: boolean;
}

export interface ScoringRuleRecord {
  id: string;
  code: string;
  name: string;
  metricCode: string;
  version: string;
  status: 'active' | 'deprecated' | 'draft';
  ruleText: string;
  rationale: string;
  changedAt: string;
  changedBy: string;
  changeReason: string;
}

export interface MetricDictionaryPack {
  generatedAt: string;
  metrics: MetricDefinitionRecord[];
  dimensions: MetricDimensionRecord[];
  formulas: MetricFormulaRecord[];
  versions: MetricVersionRecord[];
  scoringRules: ScoringRuleRecord[];
  thresholds: ThresholdRuleRecord[];
  interpretations: StatusInterpretationRecord[];
}

