import { NextRequest } from 'next/server';
import { success, toJsonResponse, failure } from '@/server/contracts/response';
import { dataGovernanceService } from '@/server/services/data-governance-service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scope = (searchParams.get('scope') ?? 'portfolio') as 'portfolio' | 'project';
  const scopeId = searchParams.get('scopeId');
  const snapshotDate = searchParams.get('snapshotDate') ?? undefined;
  const baselineDate = searchParams.get('baselineDate') ?? undefined;
  if (scope === 'project' && !scopeId) return toJsonResponse(failure('scopeId required for project scope'), 400);
  const pack = dataGovernanceService.getGovernancePack({ scope, scopeId: scopeId ?? null, snapshotDate, baselineDate });
  return toJsonResponse(success(pack, { source: 'data-governance-service' }));
}

