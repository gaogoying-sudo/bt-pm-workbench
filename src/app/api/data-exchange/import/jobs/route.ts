import { NextRequest } from 'next/server';
import { success, toJsonResponse } from '@/server/contracts/response';
import { dataExchangeRepository } from '@/server/repositories/data-exchange-repository';

export async function GET(_request: NextRequest) {
  const jobs = dataExchangeRepository.listImportJobs();
  return toJsonResponse(success(jobs, { total: jobs.length, source: 'data-exchange-repository' }));
}

