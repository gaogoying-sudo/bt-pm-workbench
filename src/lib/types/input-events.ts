export type InputSourceType =
  | 'voice-transcript-placeholder'
  | 'free-text'
  | 'structured-form'
  | 'manual-admin-entry'
  | 'external-message-placeholder';

export type EventProcessingStatus =
  | 'raw'
  | 'parsed'
  | 'draft'
  | 'awaiting-confirmation'
  | 'confirmed'
  | 'written-back'
  | 'rejected'
  | 'superseded';

export type InputEventType =
  | 'requirement-input'
  | 'progress-update'
  | 'task-activity'
  | 'manpower-actual-input'
  | 'risk-event'
  | 'quality-check'
  | 'issue-blocker'
  | 'decision-note'
  | 'stage-update';

export type EventTargetType =
  | 'project'
  | 'stage'
  | 'task-execution'
  | 'person'
  | 'role'
  | 'risk-record'
  | 'quality-record'
  | 'snapshot-batch';

export interface EventActorRecord {
  actorId: string;
  actorType: 'user' | 'system';
  displayName?: string;
}

export interface EventTargetRef {
  targetType: EventTargetType;
  targetId: string;
  canonicalProjectId?: string;
}

export interface InputSourceRecord {
  sourceType: InputSourceType;
  sourceRef?: string; // e.g. transcriptId / messageId placeholder
  capturedAt: string;
  capturedBy: EventActorRecord;
  meta?: Record<string, string | number | boolean | null>;
}

export interface RawInputRecord {
  id: string;
  source: InputSourceRecord;
  rawText: string;
  status: EventProcessingStatus; // raw
}

export interface ParsedInputIntent {
  eventType: InputEventType;
  confidence: number; // 0..1
  reason: string;
  extracted?: Record<string, string | number | boolean | null>;
}

export interface InputResolutionRecord {
  resolvedProjectId: string | null;
  resolvedStageId: string | null;
  resolvedTaskId: string | null;
  resolvedPersonId: string | null;
  resolvedRoleId: string | null;
  targets: EventTargetRef[];
  unresolvedHints: string[];
}

export type StructuredDraftPayload =
  | {
      eventType: 'progress-update';
      projectId: string | null;
      stageId: string | null;
      progressDelta: number; // -1..1
      comment: string;
    }
  | {
      eventType: 'task-activity';
      taskId: string | null;
      recordType: 'progress-update' | 'worklog' | 'blocker' | 'risk' | 'completion';
      progressDelta: number; // -1..1
      spentWorkDays: number;
      comment: string;
      blockerFlag: boolean;
      riskFlag: boolean;
    }
  | {
      eventType: 'manpower-actual-input';
      projectId: string | null;
      versionId: string | null;
      stageId: string | null;
      roleId: string | null;
      actualPersonDays: number;
      actualCost: number | null;
      note: string;
    }
  | {
      eventType: 'risk-event';
      projectId: string | null;
      title: string;
      severity: 'low' | 'medium' | 'high';
      summary: string;
    }
  | {
      eventType: 'quality-check';
      projectId: string | null;
      stageId: string | null;
      taskId: string | null;
      checkType: string;
      title: string;
      status: 'pending' | 'in-review' | 'passed' | 'failed' | 'waived';
      severity: 'info' | 'minor' | 'major' | 'critical';
      notes: string;
    }
  | {
      eventType: 'decision-note' | 'requirement-input' | 'issue-blocker' | 'stage-update';
      projectId: string | null;
      title: string;
      content: string;
    };

export interface StructuredDraftRecord {
  id: string;
  rawInputId: string;
  status: EventProcessingStatus; // draft/awaiting-confirmation
  parsedIntent: ParsedInputIntent;
  resolution: InputResolutionRecord;
  payload: StructuredDraftPayload;
  createdAt: string;
  createdBy: EventActorRecord;
  lastUpdatedAt: string;
  lastUpdatedBy: EventActorRecord;
  needsHumanConfirmation: boolean;
  warnings: string[];
}

export interface ConfirmedEventRecord {
  id: string;
  draftId: string;
  eventType: InputEventType;
  targets: EventTargetRef[];
  payload: StructuredDraftPayload;
  confirmedAt: string;
  confirmedBy: EventActorRecord;
  status: EventProcessingStatus; // confirmed/written-back
  notes?: string;
}

export interface EventWritebackRecord {
  id: string;
  eventId: string;
  status: 'pending' | 'applied' | 'failed';
  appliedAt: string | null;
  error: string | null;
  affectedEntities: EventTargetRef[];
  trace: string[];
}

