import { ExternalSystemRecord, ExternalPayloadSchema, IntegrationContractRecord } from '@/lib/types/integrations';

export const externalSystems: ExternalSystemRecord[] = [
  { id: 'ext-archive', name: 'Archive / Export Files', systemType: 'archive-file-target', notes: 'Local export/download target.' },
  { id: 'ext-mgmt', name: 'Management Reporting', systemType: 'management-reporting-export', notes: 'Exec/management export placeholder.' },
  { id: 'ext-supply', name: 'Supply Chain (Placeholder)', systemType: 'supply-chain-placeholder', notes: 'Future supply chain integration.' }
];

export const payloadSchemas: ExternalPayloadSchema[] = [
  {
    id: 'schema-project-readiness-v1',
    contractId: 'contract-supply-readiness',
    version: 'v1',
    format: 'json',
    description: 'Project external readiness summary payload for supply/delivery consumers.',
    requiredFields: ['projectId', 'projectCode', 'projectName', 'snapshotDate', 'readinessLevel']
  }
];

export const integrationContracts: IntegrationContractRecord[] = [
  {
    id: 'contract-supply-readiness',
    systemId: 'ext-supply',
    contractName: 'Supply Readiness Export',
    contractVersion: 'v1',
    payloadSchemaId: 'schema-project-readiness-v1',
    notes: 'Exports readiness summary for external consumers.'
  },
  {
    id: 'contract-mgmt-summary',
    systemId: 'ext-mgmt',
    contractName: 'Management Summary Export',
    contractVersion: 'v1',
    payloadSchemaId: 'schema-project-readiness-v1',
    notes: 'Placeholder: exports readiness summary for management reporting.'
  }
];

