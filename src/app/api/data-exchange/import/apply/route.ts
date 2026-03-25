import { NextRequest } from 'next/server';
import { success, failure, toJsonResponse } from '@/server/contracts/response';
import { dataExchangeService } from '@/server/services/data-exchange-service';

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as null | { jobId?: string };
  if (!body?.jobId) return toJsonResponse(failure('jobId is required'), 400);
  try {
    const job = dataExchangeService.applyImport(body.jobId);
    return toJsonResponse(success(job, { source: 'data-exchange-service' }));
  } catch (e) {
    return toJsonResponse(failure(e instanceof Error ? e.message : String(e)), 400);
  }
}

