import { NextRequest } from 'next/server';
import { success, toJsonResponse } from '@/server/contracts/response';
import { externalSystems, integrationContracts, payloadSchemas } from '@/data/integrations/external-systems';
import { dataExchangeRepository } from '@/server/repositories/data-exchange-repository';

export async function GET(_request: NextRequest) {
  return toJsonResponse(
    success(
      {
        externalSystems,
        integrationContracts,
        payloadSchemas,
        counts: {
          importJobs: dataExchangeRepository.listImportJobs().length,
          exportJobs: dataExchangeRepository.listExportJobs().length,
          bindings: dataExchangeRepository.listBindings().length
        }
      },
      { source: 'data-exchange' }
    )
  );
}

