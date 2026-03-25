import { inputEventRepository } from '@/server/repositories/input-event-repository';
import { inputParserService } from '@/server/services/input-parser-service';
import { inputResolverService } from '@/server/services/input-resolver-service';
import {
  EventActorRecord,
  RawInputRecord,
  StructuredDraftPayload,
  StructuredDraftRecord
} from '@/lib/types/input-events';

function nowIso() {
  return new Date().toISOString();
}

function clamp(min: number, x: number, max: number) {
  return Math.max(min, Math.min(max, x));
}

function tryExtractProgressDelta(text: string): number | null {
  const m = text.match(/([+-]?\\d{1,3})\\s*%/);
  if (!m) return null;
  const v = Number(m[1]);
  if (Number.isNaN(v)) return null;
  return clamp(-1, v / 100, 1);
}

export const inputDraftService = {
  captureRaw(rawText: string, actor: EventActorRecord, sourceType: RawInputRecord['source']['sourceType']) {
    const raw: RawInputRecord = {
      id: `raw-${nowIso().replace(/[:.]/g, '-')}`,
      source: {
        sourceType,
        capturedAt: nowIso(),
        capturedBy: actor
      },
      rawText,
      status: 'raw'
    };

    inputEventRepository.createRaw(raw);
    return raw;
  },

  createDraftFromRaw(raw: RawInputRecord, actor: EventActorRecord): StructuredDraftRecord {
    const parsedIntent = inputParserService.parse(raw.rawText);
    const resolution = inputResolverService.resolve(raw.rawText, parsedIntent);

    const progressDelta = tryExtractProgressDelta(raw.rawText) ?? 0;

    const payload: StructuredDraftPayload =
      parsedIntent.eventType === 'progress-update'
        ? { eventType: 'progress-update', projectId: resolution.resolvedProjectId, stageId: resolution.resolvedStageId, progressDelta, comment: raw.rawText }
        : parsedIntent.eventType === 'task-activity'
          ? {
              eventType: 'task-activity',
              taskId: resolution.resolvedTaskId,
              recordType: 'worklog',
              progressDelta,
              spentWorkDays: 0,
              comment: raw.rawText,
              blockerFlag: false,
              riskFlag: false
            }
          : parsedIntent.eventType === 'manpower-actual-input'
            ? {
                eventType: 'manpower-actual-input',
                projectId: resolution.resolvedProjectId,
                versionId: null,
                stageId: null,
                roleId: null,
                actualPersonDays: 0,
                actualCost: null,
                note: raw.rawText
              }
            : parsedIntent.eventType === 'risk-event'
              ? {
                  eventType: 'risk-event',
                  projectId: resolution.resolvedProjectId,
                  title: 'Risk event',
                  severity: 'medium',
                  summary: raw.rawText
                }
              : parsedIntent.eventType === 'quality-check'
                ? {
                    eventType: 'quality-check',
                    projectId: resolution.resolvedProjectId,
                    stageId: null,
                    taskId: null,
                    checkType: 'deliverable-review',
                    title: 'Quality check',
                    status: 'pending',
                    severity: 'minor',
                    notes: raw.rawText
                  }
                : {
                    eventType: parsedIntent.eventType,
                    projectId: resolution.resolvedProjectId,
                    title: 'Note',
                    content: raw.rawText
                  };

    const unresolved = resolution.unresolvedHints.length > 0;
    const warnings = unresolved ? [`Unresolved: ${resolution.unresolvedHints.join(', ')}`] : [];

    const draft: StructuredDraftRecord = {
      id: `draft-${nowIso().replace(/[:.]/g, '-')}`,
      rawInputId: raw.id,
      status: 'awaiting-confirmation',
      parsedIntent,
      resolution,
      payload,
      createdAt: nowIso(),
      createdBy: actor,
      lastUpdatedAt: nowIso(),
      lastUpdatedBy: actor,
      needsHumanConfirmation: true,
      warnings
    };

    inputEventRepository.upsertDraft(draft);
    return draft;
  }
};

