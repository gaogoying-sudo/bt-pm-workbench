import { NextRequest } from 'next/server';
import { success, failure, toJsonResponse } from '@/server/contracts/response';
import { buildProjectExternalReadinessSummaries, buildVersionReleaseReadinessRecords } from '@/lib/integrations/readiness-builders';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') ?? 'project';
  if (type === 'project') {
    const data = buildProjectExternalReadinessSummaries();
    return toJsonResponse(success(data, { total: data.length, source: 'readiness-builders' }));
  }
  if (type === 'version') {
    const data = buildVersionReleaseReadinessRecords();
    return toJsonResponse(success(data, { total: data.length, source: 'readiness-builders' }));
  }
  return toJsonResponse(failure('Unknown readiness type'), 400);
}

