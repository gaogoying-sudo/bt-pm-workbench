import { inputEventRepository } from '@/server/repositories/input-event-repository';
import { ConfirmedEventRecord, EventTargetRef, EventWritebackRecord } from '@/lib/types/input-events';
import { qualityCheckRecords } from '@/data/quality/quality-check-records';
import { manpowerActualInputs } from '@/data/manpower/manpower-actual-inputs';
import { taskActivityRecords } from '@/data/task-execution/task-activity-records';
import { taskExecutionRecords } from '@/data/task-execution/task-execution-records';
import { TaskActivityRecord } from '@/lib/types/task-execution';
import { ActualInputRecord } from '@/lib/types/manpower';
import { QualityCheckRecord } from '@/lib/types/quality';
import { addProjectRiskEvent } from '@/lib/input-events/event-projection-store';

function nowIso() {
  return new Date().toISOString();
}

function makeWriteback(event: ConfirmedEventRecord): EventWritebackRecord {
  return {
    id: `wb-${nowIso().replace(/[:.]/g, '-')}`,
    eventId: event.id,
    status: 'pending',
    appliedAt: null,
    error: null,
    affectedEntities: event.targets,
    trace: []
  };
}

export const eventWritebackService = {
  apply(event: ConfirmedEventRecord): EventWritebackRecord {
    const wb = makeWriteback(event);
    const trace: string[] = [];
    const affected: EventTargetRef[] = [...event.targets];

    try {
      if (event.payload.eventType === 'task-activity') {
        const payload = event.payload;
        const taskId = payload.taskId;
        if (!taskId) throw new Error('taskId is required for task-activity');
        const record: TaskActivityRecord = {
          id: `act-${nowIso().replace(/[:.]/g, '-')}`,
          taskId,
          recordDate: nowIso().slice(0, 10),
          personId: event.confirmedBy.actorId,
          recordType: payload.recordType,
          progressDelta: payload.progressDelta,
          spentWorkDays: payload.spentWorkDays,
          comment: payload.comment,
          riskFlag: payload.riskFlag,
          blockerFlag: payload.blockerFlag
        };
        taskActivityRecords.unshift(record);
        affected.push({ targetType: 'task-execution', targetId: taskId });
        trace.push('Added TaskActivityRecord');
      }

      if (event.payload.eventType === 'progress-update') {
        const payload = event.payload;
        const projectId = payload.projectId;
        if (!projectId) throw new Error('projectId is required for progress-update');

        const task =
          taskExecutionRecords.find((t) => t.projectId === projectId && t.stageId === (payload.stageId ?? t.stageId)) ??
          taskExecutionRecords.find((t) => t.projectId === projectId) ??
          null;
        if (!task) throw new Error('No task found under project for progress-update');

        const record: TaskActivityRecord = {
          id: `act-${nowIso().replace(/[:.]/g, '-')}`,
          taskId: task.id,
          recordDate: nowIso().slice(0, 10),
          personId: event.confirmedBy.actorId,
          recordType: 'progress-update',
          progressDelta: payload.progressDelta,
          spentWorkDays: 0,
          comment: payload.comment,
          riskFlag: false,
          blockerFlag: false
        };
        taskActivityRecords.unshift(record);
        trace.push(`Applied progress update via TaskActivityRecord on ${task.id}`);
        affected.push({ targetType: 'task-execution', targetId: task.id, canonicalProjectId: projectId });
      }

      if (event.payload.eventType === 'manpower-actual-input') {
        const payload = event.payload;
        if (!payload.projectId || !payload.versionId) {
          throw new Error('projectId and versionId are required for manpower-actual-input');
        }
        const rec: ActualInputRecord = {
          id: `ai-${nowIso().replace(/[:.]/g, '-')}`,
          projectId: payload.projectId,
          versionId: payload.versionId,
          stageId: payload.stageId ?? undefined,
          roleId: payload.roleId ?? undefined,
          actualPersonDays: payload.actualPersonDays,
          actualCost: payload.actualCost ?? 0,
          sourceType: 'manual-json',
          recordedAt: nowIso().slice(0, 10),
          note: payload.note
        };
        manpowerActualInputs.unshift(rec);
        affected.push({ targetType: 'project', targetId: payload.projectId });
        trace.push('Added ActualInputRecord');
      }

      if (event.payload.eventType === 'quality-check') {
        const payload = event.payload;
        if (!payload.projectId) throw new Error('projectId is required for quality-check');
        const qc: QualityCheckRecord = {
          id: `qc-${nowIso().replace(/[:.]/g, '-')}`,
          projectId: payload.projectId,
          stageId: payload.stageId ?? null,
          taskId: payload.taskId ?? null,
          checkType: payload.checkType as any,
          title: payload.title,
          description: payload.notes,
          status: payload.status as any,
          severity: payload.severity as any,
          reviewerId: event.confirmedBy.actorId,
          checkedAt: nowIso().slice(0, 10),
          resolvedAt: payload.status === 'passed' || payload.status === 'failed' ? nowIso().slice(0, 10) : null,
          notes: payload.notes
        };
        qualityCheckRecords.unshift(qc);
        affected.push({ targetType: 'quality-record', targetId: qc.id, canonicalProjectId: payload.projectId });
        trace.push('Added QualityCheckRecord');
      }

      // risk-event and progress-update are currently projected via existing builders; keep writeback record for trace
      if (event.payload.eventType === 'risk-event') {
        const payload = event.payload;
        if (!payload.projectId) throw new Error('projectId is required for risk-event');
        const projectionId = `pre-${nowIso().replace(/[:.]/g, '-')}`;
        addProjectRiskEvent({
          id: projectionId,
          projectId: payload.projectId,
          title: payload.title,
          severity: payload.severity,
          summary: payload.summary,
          createdAt: nowIso(),
          createdBy: event.confirmedBy,
          sourceEventId: event.id,
          eventType: event.payload.eventType
        });
        affected.push({ targetType: 'risk-record', targetId: projectionId, canonicalProjectId: payload.projectId });
        trace.push('Recorded risk event into projection store');
      }

      wb.status = 'applied';
      wb.appliedAt = nowIso();
      wb.trace = trace;
      wb.affectedEntities = affected;
      inputEventRepository.createWriteback(wb);
      inputEventRepository.updateConfirmed(event.id, { status: 'written-back' });
      return wb;
    } catch (e) {
      wb.status = 'failed';
      wb.error = e instanceof Error ? e.message : String(e);
      wb.trace = trace;
      inputEventRepository.createWriteback(wb);
      return wb;
    }
  }
};

