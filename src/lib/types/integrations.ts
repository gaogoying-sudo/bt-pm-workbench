export type ExternalSystemType =
  | 'supply-chain-placeholder'
  | 'procurement-placeholder'
  | 'delivery-ops-placeholder'
  | 'management-reporting-export'
  | 'archive-file-target'
  | 'external-api-target-placeholder';

export interface ExternalSystemRecord {
  id: string;
  name: string;
  systemType: ExternalSystemType;
  ownerTeam?: string;
  notes?: string;
}

export type PayloadFormat = 'json' | 'csv' | 'xlsx-placeholder';

export interface ExternalPayloadSchema {
  id: string;
  contractId: string;
  version: string;
  format: PayloadFormat;
  description: string;
  requiredFields: string[];
}

export interface IntegrationContractRecord {
  id: string;
  systemId: string;
  contractName: string;
  contractVersion: string;
  payloadSchemaId: string;
  notes?: string;
}

export type MappingStatus = 'active' | 'missing' | 'deprecated' | 'conflicted';

export interface ExternalIdentifierBinding {
  id: string;
  internalType: 'project' | 'version' | 'person' | 'orgUnit';
  internalId: string;
  externalSystemId: string;
  externalIdentifier: string;
  status: MappingStatus;
  lastSyncedAt: string | null;
  notes?: string;
}

export interface SyncStatusRecord {
  id: string;
  externalSystemId: string;
  contractId: string;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  lastError: string | null;
  retryable: boolean;
  notes?: string;
}

export interface DeliveryEnvelopeRecord<TPayload = unknown> {
  id: string;
  externalSystemId: string;
  contractId: string;
  payloadSchemaId: string;
  payload: TPayload;
  createdAt: string;
  createdByPersonId: string;
}

export interface ImportSourceRecord {
  sourceType: 'file-placeholder' | 'json';
  filename?: string | null;
  rawJson?: unknown;
}

export interface ImportValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  mappingMisses: string[];
  overwriteWarnings: string[];
}

export interface ImportPreviewRecord {
  id: string;
  jobId: string;
  validation: ImportValidationResult;
  previewSummary: string;
  inferredTargets: Array<{ internalType: string; internalId: string | null; note: string }>;
}

export interface ImportApplyResult {
  ok: boolean;
  appliedCount: number;
  failedCount: number;
  trace: string[];
}

export interface ImportJobRecord {
  id: string;
  externalSystemId: string;
  contractId: string;
  createdAt: string;
  createdByPersonId: string;
  status: 'received' | 'previewed' | 'applied' | 'rejected' | 'failed';
  source: ImportSourceRecord;
  previewId: string | null;
  applyResult: ImportApplyResult | null;
  audit: ExportImportAuditRecord;
}

export interface ExportTargetRecord {
  targetType: 'archive-file-target' | 'management-reporting-export' | 'external-api-target-placeholder';
  notes?: string;
}

export interface ExportPayloadRecord {
  id: string;
  schemaId: string;
  payload: unknown;
}

export interface ExportBundleRecord {
  id: string;
  jobId: string;
  format: PayloadFormat;
  payloadRecords: ExportPayloadRecord[];
  createdAt: string;
}

export interface ExportJobRecord {
  id: string;
  externalSystemId: string;
  contractId: string;
  createdAt: string;
  createdByPersonId: string;
  status: 'generated' | 'failed' | 'exported' | 'retryable-failed';
  target: ExportTargetRecord;
  bundleId: string | null;
  audit: ExportImportAuditRecord;
}

export interface ExportImportAuditRecord {
  id: string;
  targetSystemId: string;
  contractId: string;
  contractVersion: string;
  payloadSchemaId: string;
  payloadVersion: string;
  exportedAt: string | null;
  importedAt: string | null;
  exportedByPersonId: string | null;
  importedByPersonId: string | null;
  mappingSnapshotRef: string | null;
  applyTrace: string[];
}

