import { NextRequest } from 'next/server';
import { success, failure, toJsonResponse } from '@/server/contracts/response';
import { recommendationService } from '@/server/services/recommendation-service';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.recommendationId || !body?.action || !body?.actorPersonId)
    return toJsonResponse(failure('recommendationId/action/actorPersonId required'), 400);
  try {
    const updated = recommendationService.triage({
      recommendationId: body.recommendationId,
      action: body.action,
      actorPersonId: body.actorPersonId,
      reason: body.reason,
      snoozedUntil: body.snoozedUntil,
      outcomeSummary: body.outcomeSummary
    });
    return toJsonResponse(success(updated, { source: 'recommendation-service' }));
  } catch (e: any) {
    return toJsonResponse(failure(e?.message ?? 'triage failed'), 400);
  }
}

