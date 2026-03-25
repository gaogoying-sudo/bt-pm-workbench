import { NextRequest } from 'next/server';
import { success, failure, toJsonResponse } from '@/server/contracts/response';
import { recommendationService } from '@/server/services/recommendation-service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scope = (searchParams.get('scope') ?? 'portfolio') as 'portfolio' | 'project' | 'version';
  const scopeId = searchParams.get('scopeId');
  if ((scope === 'project' || scope === 'version') && !scopeId) return toJsonResponse(failure('scopeId required'), 400);
  const list = recommendationService.list({ scope, scopeId: scopeId ?? null });
  return toJsonResponse(success(list, { total: list.length, source: 'recommendation-service' }));
}

