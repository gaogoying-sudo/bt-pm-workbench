import { NextRequest } from 'next/server';
import { success, failure, toJsonResponse } from '@/server/contracts/response';
import { alertingService } from '@/server/services/alerting-service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scope = (searchParams.get('scope') ?? 'portfolio') as 'portfolio' | 'project' | 'version';
  const scopeId = searchParams.get('scopeId');
  const snapshotDate = searchParams.get('snapshotDate') ?? undefined;
  if ((scope === 'project' || scope === 'version') && !scopeId) return toJsonResponse(failure('scopeId required'), 400);
  const pack = alertingService.getPack({ scope, scopeId: scopeId ?? null, snapshotDate });
  return toJsonResponse(success(pack, { source: 'alerting-service' }));
}

