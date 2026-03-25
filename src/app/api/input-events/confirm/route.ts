import { NextRequest } from 'next/server';
import { success, failure, toJsonResponse } from '@/server/contracts/response';
import { inputConfirmationService } from '@/server/services/input-confirmation-service';
import { eventWritebackService } from '@/server/services/event-writeback-service';
import { inputEventRepository } from '@/server/repositories/input-event-repository';

function actorFromRequest() {
  return { actorId: 'user-local', actorType: 'user' as const, displayName: 'Local User' };
}

export async function GET(_request: NextRequest) {
  const queue = inputConfirmationService.listQueue();
  const confirmed = inputEventRepository.listConfirmed().slice(0, 50);
  const writebacks = inputEventRepository.listWritebacks().slice(0, 50);
  return toJsonResponse(success({ queue, confirmed, writebacks }, { source: 'input-confirmation-service' }));
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as null | {
    draftId?: string;
    action?: 'confirm' | 'reject';
    patch?: any;
    reason?: string;
    applyWriteback?: boolean;
  };
  if (!body?.draftId || !body.action) return toJsonResponse(failure('draftId and action are required'), 400);

  const actor = actorFromRequest();
  if (body.action === 'reject') {
    const updated = inputConfirmationService.rejectDraft(body.draftId, actor, body.reason);
    return toJsonResponse(success({ draft: updated }, { source: 'input-confirmation-service' }));
  }

  const confirmed = inputConfirmationService.confirmDraft(body.draftId, actor, body.patch);
  const writeback = body.applyWriteback === false ? null : eventWritebackService.apply(confirmed);
  return toJsonResponse(success({ confirmed, writeback }, { source: 'event-writeback-service' }), 201);
}

