import { describe, expect, it } from 'vitest';
import { resolveProjectId, getProjectIdentity } from '@/lib/identity/unified-project-registry';
import { buildProjectQualitySnapshots } from '@/lib/quality/quality-builders';
import { buildSnapshotContext } from '@/lib/snapshots/snapshot-helpers';
import { buildProjectProgressTimelinePoints } from '@/lib/snapshots/timeline-builders';
import { inputDraftService } from '@/server/services/input-draft-service';
import { inputConfirmationService } from '@/server/services/input-confirmation-service';
import { eventWritebackService } from '@/server/services/event-writeback-service';
import { inputEventRepository } from '@/server/repositories/input-event-repository';

describe('foundation: identity / quality / snapshot / input-event chains', () => {
  it('unified project identity resolution works', () => {
    const canonical = resolveProjectId('pm-workbench');
    expect(canonical).toContain('project-');
    expect(getProjectIdentity(canonical)).not.toBeNull();
  });

  it('quality aggregation produces snapshots', () => {
    const qs = buildProjectQualitySnapshots();
    expect(qs.length).toBeGreaterThan(0);
    expect(qs[0]).toHaveProperty('qualityScore');
  });

  it('snapshot timeline points accept explicit dates', () => {
    const ctx = buildSnapshotContext({ snapshotDate: '2026-03-25', baselineDate: '2026-02-01', compareDate: '2026-03-01' });
    const points = buildProjectProgressTimelinePoints(ctx.snapshotDate);
    expect(points.length).toBeGreaterThan(0);
    expect(points[0].snapshotDate).toBe('2026-03-25');
  });

  it('input raw -> draft -> confirm -> writeback works (quality-check)', () => {
    inputEventRepository.clearAll();
    const actor = { personId: 'person-alice', actorType: 'user' as const, displayName: 'Alice Zhang' };
    const raw = inputDraftService.captureRaw('quality: project-pm-workbench deliverable review pending', actor, 'free-text');
    const draft = inputDraftService.createDraftFromRaw(raw, actor);
    const confirmed = inputConfirmationService.confirmDraft(draft.id, actor, {
      eventType: 'quality-check',
      projectId: 'project-pm-workbench',
      title: 'Test quality check',
      status: 'pending',
      severity: 'minor',
      notes: 'from test'
    });
    const wb = eventWritebackService.apply(confirmed);
    expect(wb.status).toBe('applied');
    expect(inputEventRepository.listConfirmed().length).toBe(1);
    expect(inputEventRepository.listWritebacks().length).toBe(1);
  });
});

