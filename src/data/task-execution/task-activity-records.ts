import { TaskActivityRecord } from '@/lib/types/task-execution';

export const taskActivityRecords: TaskActivityRecord[] = [
  { id: 'act-001', taskId: 'task-pmw-epic-ui', recordDate: '2026-03-18', personId: 'person-dylan', recordType: 'progress-update', progressDelta: 0.12, spentWorkDays: 1, comment: 'Epic scope narrowed to current three modules.', riskFlag: false, blockerFlag: false },
  { id: 'act-002', taskId: 'task-pmw-design-system', recordDate: '2026-03-19', personId: 'person-alice', recordType: 'risk', progressDelta: 0, spentWorkDays: 0.5, comment: 'Design review turnaround slowed due leave overlap.', riskFlag: true, blockerFlag: false },
  { id: 'act-003', taskId: 'task-ops-epic-release', recordDate: '2026-04-25', personId: 'person-ben', recordType: 'blocker', progressDelta: -0.03, spentWorkDays: 1, comment: 'Upstream service changed payload again in test.', riskFlag: true, blockerFlag: true },
  { id: 'act-004', taskId: 'task-ops-regression', recordDate: '2026-04-27', personId: 'person-cora', recordType: 'worklog', progressDelta: 0.08, spentWorkDays: 1.5, comment: 'Updated regression matrix, pending stable env rerun.', riskFlag: false, blockerFlag: true },
  { id: 'act-005', taskId: 'task-ai-eval-framework', recordDate: '2026-04-12', personId: 'person-felix', recordType: 'completion', progressDelta: 0.2, spentWorkDays: 1, comment: 'Baseline evaluation report published.', riskFlag: false, blockerFlag: false },
  { id: 'act-006', taskId: 'task-ai-epic-pilot', recordDate: '2026-04-20', personId: 'person-felix', recordType: 'progress-update', progressDelta: 0.1, spentWorkDays: 1, comment: 'Pilot flow advanced after prompt tuning.', riskFlag: true, blockerFlag: false },
  { id: 'act-007', taskId: 'task-data-metrics', recordDate: '2026-03-28', personId: 'person-grace', recordType: 'blocker', progressDelta: 0, spentWorkDays: 0.5, comment: 'Paused due upstream interface ambiguity.', riskFlag: true, blockerFlag: true },
  { id: 'act-008', taskId: 'task-pmw-task-center', recordDate: '2026-03-25', personId: 'person-dylan', recordType: 'progress-update', progressDelta: 0.18, spentWorkDays: 1, comment: 'Execution center structure and data contract drafted.', riskFlag: false, blockerFlag: false }
];
