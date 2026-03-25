import { NextRequest } from 'next/server';
import { success, failure, toJsonResponse } from '@/server/contracts/response';
import { dataExchangeRepository } from '@/server/repositories/data-exchange-repository';

export async function GET(_request: NextRequest, { params }: { params: { bundleId: string } }) {
  const bundle = dataExchangeRepository.getExportBundle(params.bundleId);
  if (!bundle) return toJsonResponse(failure('Bundle not found'), 404);
  return toJsonResponse(success(bundle, { source: 'data-exchange-repository' }));
}

