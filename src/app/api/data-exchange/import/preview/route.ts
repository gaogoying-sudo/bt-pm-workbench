import { NextRequest } from 'next/server';
import { success, failure, toJsonResponse } from '@/server/contracts/response';
import { dataExchangeService } from '@/server/services/data-exchange-service';

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as null | {
    externalSystemId?: string;
    contractId?: string;
    createdByPersonId?: string;
    rawJson?: unknown;
  };
  if (!body?.externalSystemId || !body.contractId || !body.createdByPersonId) {
    return toJsonResponse(failure('externalSystemId, contractId, createdByPersonId are required'), 400);
  }
  try {
    const result = dataExchangeService.createImportPreview({
      externalSystemId: body.externalSystemId,
      contractId: body.contractId,
      createdByPersonId: body.createdByPersonId,
      rawJson: body.rawJson ?? {}
    });
    return toJsonResponse(success(result, { source: 'data-exchange-service' }), 201);
  } catch (e) {
    return toJsonResponse(failure(e instanceof Error ? e.message : String(e)), 400);
  }
}

