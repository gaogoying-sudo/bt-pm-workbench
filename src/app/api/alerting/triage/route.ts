import { NextRequest } from 'next/server';
import { success, failure, toJsonResponse } from '@/server/contracts/response';
import { alertingService } from '@/server/services/alerting-service';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.alertId || !body?.action || !body?.actorPersonId) return toJsonResponse(failure('alertId/action/actorPersonId required'), 400);
  try {
    const updated = alertingService.triageAlert({
      alertId: body.alertId,
      action: body.action,
      actorPersonId: body.actorPersonId,
      reason: body.reason,
      snoozedUntil: body.snoozedUntil,
      note: body.note
    });
    return toJsonResponse(success(updated, { source: 'alerting-service' }));
  } catch (e: any) {
    return toJsonResponse(failure(e?.message ?? 'triage failed'), 400);
  }
}

