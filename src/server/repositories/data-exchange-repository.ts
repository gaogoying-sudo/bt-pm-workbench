import { addItem, getCollection, findById, updateItem } from '@/server/persistence/local-store';
import {
  ExportBundleRecord,
  ExportJobRecord,
  ExternalIdentifierBinding,
  ImportJobRecord,
  ImportPreviewRecord,
  SyncStatusRecord
} from '@/lib/types/integrations';

export const collections = {
  importJobs: 'importJobs',
  importPreviews: 'importPreviews',
  exportJobs: 'exportJobs',
  exportBundles: 'exportBundles',
  externalBindings: 'externalIdentifierBindings',
  syncStatus: 'syncStatus'
} as const;

export const dataExchangeRepository = {
  listImportJobs() {
    return getCollection<ImportJobRecord>(collections.importJobs).slice().reverse();
  },
  getImportJob(id: string) {
    return findById<ImportJobRecord>(collections.importJobs, id);
  },
  createImportJob(job: ImportJobRecord) {
    addItem<ImportJobRecord>(collections.importJobs, job);
    return job;
  },
  updateImportJob(id: string, patch: Partial<ImportJobRecord>) {
    return updateItem<ImportJobRecord>(collections.importJobs, id, patch);
  },
  createImportPreview(preview: ImportPreviewRecord) {
    addItem<ImportPreviewRecord>(collections.importPreviews, preview);
    return preview;
  },
  getImportPreview(id: string) {
    return findById<ImportPreviewRecord>(collections.importPreviews, id);
  },

  listExportJobs() {
    return getCollection<ExportJobRecord>(collections.exportJobs).slice().reverse();
  },
  getExportJob(id: string) {
    return findById<ExportJobRecord>(collections.exportJobs, id);
  },
  createExportJob(job: ExportJobRecord) {
    addItem<ExportJobRecord>(collections.exportJobs, job);
    return job;
  },
  updateExportJob(id: string, patch: Partial<ExportJobRecord>) {
    return updateItem<ExportJobRecord>(collections.exportJobs, id, patch);
  },
  createExportBundle(bundle: ExportBundleRecord) {
    addItem<ExportBundleRecord>(collections.exportBundles, bundle);
    return bundle;
  },
  getExportBundle(id: string) {
    return findById<ExportBundleRecord>(collections.exportBundles, id);
  },

  listBindings() {
    return getCollection<ExternalIdentifierBinding>(collections.externalBindings);
  },
  upsertBinding(binding: ExternalIdentifierBinding) {
    addItem<ExternalIdentifierBinding>(collections.externalBindings, binding);
    return binding;
  },

  listSyncStatus() {
    return getCollection<SyncStatusRecord>(collections.syncStatus);
  },
  upsertSyncStatus(record: SyncStatusRecord) {
    addItem<SyncStatusRecord>(collections.syncStatus, record);
    return record;
  }
};

