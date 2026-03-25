import {
  ExportBundleRecord,
  ExportJobRecord,
  ExportPayloadRecord,
  ImportJobRecord,
  ImportPreviewRecord
} from '@/lib/types/integrations';
import { dataExchangeRepository } from '@/server/repositories/data-exchange-repository';
import { externalSystems, integrationContracts, payloadSchemas } from '@/data/integrations/external-systems';
import { buildProjectExternalReadinessSummaries, buildVersionReleaseReadinessRecords } from '@/lib/integrations/readiness-builders';

function nowIso() {
  return new Date().toISOString();
}

function newId(prefix: string) {
  return `${prefix}-${nowIso().replace(/[:.]/g, '-')}`;
}

export const dataExchangeService = {
  listImportJobs() {
    return dataExchangeRepository.listImportJobs();
  },

  listExportJobs() {
    return dataExchangeRepository.listExportJobs();
  },

  createImportPreview(input: { externalSystemId: string; contractId: string; createdByPersonId: string; rawJson: unknown }): { job: ImportJobRecord; preview: ImportPreviewRecord } {
    const contract = integrationContracts.find((c) => c.id === input.contractId);
    if (!contract) throw new Error('Unknown contractId');
    const schema = payloadSchemas.find((s) => s.id === contract.payloadSchemaId);
    if (!schema) throw new Error('Unknown payload schema');

    const jobId = newId('import');
    const auditId = newId('audit');
    const job: ImportJobRecord = {
      id: jobId,
      externalSystemId: input.externalSystemId,
      contractId: input.contractId,
      createdAt: nowIso(),
      createdByPersonId: input.createdByPersonId,
      status: 'received',
      source: { sourceType: 'json', rawJson: input.rawJson, filename: null },
      previewId: null,
      applyResult: null,
      audit: {
        id: auditId,
        targetSystemId: input.externalSystemId,
        contractId: input.contractId,
        contractVersion: contract.contractVersion,
        payloadSchemaId: schema.id,
        payloadVersion: schema.version,
        exportedAt: null,
        importedAt: nowIso(),
        exportedByPersonId: null,
        importedByPersonId: input.createdByPersonId,
        mappingSnapshotRef: null,
        applyTrace: []
      }
    };
    dataExchangeRepository.createImportJob(job);

    const validation = {
      valid: true,
      errors: [] as string[],
      warnings: [] as string[],
      mappingMisses: [] as string[],
      overwriteWarnings: [] as string[]
    };

    if (typeof input.rawJson !== 'object' || input.rawJson === null) {
      validation.valid = false;
      validation.errors.push('rawJson must be an object');
    } else {
      for (const f of schema.requiredFields) {
        if (!(f in (input.rawJson as any))) {
          validation.valid = false;
          validation.errors.push(`missing required field: ${f}`);
        }
      }
    }

    const preview: ImportPreviewRecord = {
      id: newId('preview'),
      jobId,
      validation,
      previewSummary: validation.valid ? 'Preview OK. Ready for apply.' : 'Preview has errors. Fix before apply.',
      inferredTargets: [{ internalType: 'project', internalId: (input.rawJson as any)?.projectId ?? null, note: 'Matched by projectId field.' }]
    };
    dataExchangeRepository.createImportPreview(preview);
    dataExchangeRepository.updateImportJob(jobId, { status: 'previewed', previewId: preview.id });

    return { job: dataExchangeRepository.getImportJob(jobId)!, preview };
  },

  applyImport(jobId: string): ImportJobRecord {
    const job = dataExchangeRepository.getImportJob(jobId);
    if (!job) throw new Error('Import job not found');
    if (!job.previewId) throw new Error('No preview exists for this job');
    const preview = dataExchangeRepository.getImportPreview(job.previewId);
    if (!preview) throw new Error('Preview not found');
    if (!preview.validation.valid) {
      dataExchangeRepository.updateImportJob(jobId, { status: 'rejected', applyResult: { ok: false, appliedCount: 0, failedCount: 1, trace: preview.validation.errors } });
      return dataExchangeRepository.getImportJob(jobId)!;
    }

    // Minimal apply: upsert external identifier binding if payload contains externalProjectId
    const payload = job.source.rawJson as any;
    const trace: string[] = [];
    let applied = 0;

    if (payload?.projectId && payload?.externalProjectId) {
      dataExchangeRepository.upsertBinding({
        id: newId('bind'),
        internalType: 'project',
        internalId: payload.projectId,
        externalSystemId: job.externalSystemId,
        externalIdentifier: payload.externalProjectId,
        status: 'active',
        lastSyncedAt: nowIso(),
        notes: 'Imported binding from JSON payload.'
      });
      applied += 1;
      trace.push('Upserted ExternalIdentifierBinding(project)');
    } else {
      trace.push('No binding applied (missing projectId/externalProjectId)');
    }

    dataExchangeRepository.updateImportJob(jobId, { status: 'applied', applyResult: { ok: true, appliedCount: applied, failedCount: 0, trace } });
    return dataExchangeRepository.getImportJob(jobId)!;
  },

  createExportBundle(input: { externalSystemId: string; contractId: string; createdByPersonId: string }): { job: ExportJobRecord; bundle: ExportBundleRecord } {
    const contract = integrationContracts.find((c) => c.id === input.contractId);
    if (!contract) throw new Error('Unknown contractId');
    const schema = payloadSchemas.find((s) => s.id === contract.payloadSchemaId);
    if (!schema) throw new Error('Unknown payload schema');

    const jobId = newId('export');
    const auditId = newId('audit');
    const job: ExportJobRecord = {
      id: jobId,
      externalSystemId: input.externalSystemId,
      contractId: input.contractId,
      createdAt: nowIso(),
      createdByPersonId: input.createdByPersonId,
      status: 'generated',
      target: { targetType: 'archive-file-target', notes: 'Download JSON bundle.' },
      bundleId: null,
      audit: {
        id: auditId,
        targetSystemId: input.externalSystemId,
        contractId: input.contractId,
        contractVersion: contract.contractVersion,
        payloadSchemaId: schema.id,
        payloadVersion: schema.version,
        exportedAt: nowIso(),
        importedAt: null,
        exportedByPersonId: input.createdByPersonId,
        importedByPersonId: null,
        mappingSnapshotRef: null,
        applyTrace: []
      }
    };
    dataExchangeRepository.createExportJob(job);

    const payloads: ExportPayloadRecord[] =
      input.contractId === 'contract-supply-readiness'
        ? buildProjectExternalReadinessSummaries().map((p) => ({ id: newId('payload'), schemaId: schema.id, payload: p }))
        : buildVersionReleaseReadinessRecords().map((v) => ({ id: newId('payload'), schemaId: schema.id, payload: v }));

    const bundle: ExportBundleRecord = {
      id: newId('bundle'),
      jobId,
      format: schema.format,
      payloadRecords: payloads,
      createdAt: nowIso()
    };
    dataExchangeRepository.createExportBundle(bundle);
    dataExchangeRepository.updateExportJob(jobId, { bundleId: bundle.id, status: 'exported' });

    return { job: dataExchangeRepository.getExportJob(jobId)!, bundle };
  }
};

