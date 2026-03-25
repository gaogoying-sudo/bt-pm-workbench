export type ExternalReadinessLevel = 'not-ready' | 'partially-ready' | 'ready' | 'blocked';

export interface SupplyReadinessRecord {
  projectId: string;
  readinessLevel: ExternalReadinessLevel;
  missingMappings: string[];
  blockers: string[];
  notes: string;
}

export interface DeliveryReadinessRecord {
  projectId: string;
  readinessLevel: ExternalReadinessLevel;
  riskBlockers: string[];
  qualityGates: string[];
  notes: string;
}

export interface ProjectExternalReadinessSummary {
  projectId: string;
  snapshotDate: string;
  readinessLevel: ExternalReadinessLevel;
  exportReady: boolean;
  supplyReady: boolean;
  deliveryReady: boolean;
  reasons: string[];
  notes: string;
}

export interface VersionReleaseReadinessRecord {
  linkedVersionId: string;
  readinessLevel: ExternalReadinessLevel;
  releaseReadinessStatus: string;
  qualityGateStatus: string | null;
  notes: string;
}

export interface ResourceReadinessRecord {
  projectId: string;
  readinessLevel: ExternalReadinessLevel;
  resourcePressureLevel: string;
  notes: string;
}

export interface RiskBlockerSummary {
  projectId: string;
  blockerCount: number;
  topBlockerTitle: string | null;
  notes: string;
}

export interface QualityGateExportSummary {
  projectId: string;
  qualityScore: number;
  criticalFailures: number;
  notes: string;
}

