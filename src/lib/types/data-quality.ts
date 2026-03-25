export type DataQualitySeverity = 'info' | 'warning' | 'critical';
export type DataQualityStatus = 'pass' | 'warn' | 'fail';

export interface DataQualityCheckRecord {
  id: string;
  code: string;
  title: string;
  description: string;
  severity: DataQualitySeverity;
  status: DataQualityStatus;
  scope: 'portfolio' | 'project' | 'version';
  scopeId: string | null;
  evidence: string[];
  detectedAt: string;
  suggestedAction: string;
}

export interface DataDriftSignalRecord {
  id: string;
  metricCode: string;
  metricVersion: string;
  scope: 'portfolio' | 'project' | 'version';
  scopeId: string | null;
  baselineDate: string;
  snapshotDate: string;
  deltaSummary: string;
  severity: DataQualitySeverity;
  detectedAt: string;
}

export interface RuleChangeImpactRecord {
  id: string;
  metricCode: string;
  fromVersion: string;
  toVersion: string;
  changedAt: string;
  changedBy: string;
  changeReason: string;
  impactedPages: string[];
  recomputeRequired: boolean;
  notes: string;
}

export interface HistoricalTrustMarker {
  id: string;
  scope: 'portfolio' | 'project' | 'version';
  scopeId: string | null;
  trustLevel: 'trusted' | 'caveated' | 'untrusted';
  notes: string;
  updatedAt: string;
}

export interface DataGovernancePack {
  generatedAt: string;
  checks: DataQualityCheckRecord[];
  driftSignals: DataDriftSignalRecord[];
  ruleImpacts: RuleChangeImpactRecord[];
  trustMarkers: HistoricalTrustMarker[];
}

