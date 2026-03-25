import { NextRequest } from 'next/server';
import { success, failure, toJsonResponse } from '@/server/contracts/response';
import { inputEventRepository } from '@/server/repositories/input-event-repository';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') ?? undefined;
  const drafts = inputEventRepository.listDrafts(status as any);
  return toJsonResponse(success(drafts, { total: drafts.length, source: 'input-event-repository' }));
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as null | { id?: string; patch?: any };
  if (!body?.id || !body.patch) return toJsonResponse(failure('id and patch are required'), 400);
  const updated = inputEventRepository.updateDraft(body.id, body.patch);
  if (!updated) return toJsonResponse(failure('Draft not found'), 404);
  return toJsonResponse(success(updated, { source: 'input-event-repository' }));
}

