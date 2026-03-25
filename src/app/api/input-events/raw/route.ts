import { NextRequest } from 'next/server';
import { success, failure, toJsonResponse } from '@/server/contracts/response';
import { inputDraftService } from '@/server/services/input-draft-service';
import { inputEventRepository } from '@/server/repositories/input-event-repository';

function actorFromRequest() {
  return { actorId: 'user-local', actorType: 'user' as const, displayName: 'Local User' };
}

export async function GET(_request: NextRequest) {
  const raw = inputEventRepository.listRaw();
  return toJsonResponse(success(raw, { total: raw.length, source: 'input-event-repository' }));
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as null | { rawText?: string; sourceType?: any };
  if (!body?.rawText) return toJsonResponse(failure('rawText is required'), 400);
  const actor = actorFromRequest();
  const sourceType = body.sourceType ?? 'free-text';
  const raw = inputDraftService.captureRaw(body.rawText, actor, sourceType);
  const draft = inputDraftService.createDraftFromRaw(raw, actor);
  return toJsonResponse(success({ raw, draft }, { source: 'input-draft-service' }), 201);
}

