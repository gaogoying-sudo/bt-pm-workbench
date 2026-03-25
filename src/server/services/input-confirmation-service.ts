import {
  ConfirmedEventRecord,
  EventActorRecord,
  StructuredDraftRecord
} from '@/lib/types/input-events';
import { inputEventRepository } from '@/server/repositories/input-event-repository';

function nowIso() {
  return new Date().toISOString();
}

export const inputConfirmationService = {
  listQueue() {
    return inputEventRepository.listDrafts('awaiting-confirmation');
  },

  confirmDraft(draftId: string, actor: EventActorRecord, patch?: Partial<StructuredDraftRecord['payload']>) {
    const draft = inputEventRepository.getDraft(draftId);
    if (!draft) throw new Error('Draft not found');

    const updatedDraft: StructuredDraftRecord = {
      ...draft,
      payload: { ...(draft.payload as any), ...(patch as any) },
      status: 'confirmed',
      needsHumanConfirmation: false,
      lastUpdatedAt: nowIso(),
      lastUpdatedBy: actor
    };

    inputEventRepository.upsertDraft(updatedDraft);

    const confirmed: ConfirmedEventRecord = {
      id: `evt-${nowIso().replace(/[:.]/g, '-')}`,
      draftId: updatedDraft.id,
      eventType: updatedDraft.parsedIntent.eventType,
      targets: updatedDraft.resolution.targets,
      payload: updatedDraft.payload,
      confirmedAt: nowIso(),
      confirmedBy: actor,
      status: 'confirmed'
    };

    inputEventRepository.createConfirmed(confirmed);
    return confirmed;
  },

  rejectDraft(draftId: string, actor: EventActorRecord, reason?: string) {
    const draft = inputEventRepository.getDraft(draftId);
    if (!draft) throw new Error('Draft not found');
    const updated = inputEventRepository.updateDraft(draftId, {
      status: 'rejected',
      warnings: [...draft.warnings, ...(reason ? [reason] : [])],
      lastUpdatedAt: nowIso(),
      lastUpdatedBy: actor
    });
    return updated;
  }
};

