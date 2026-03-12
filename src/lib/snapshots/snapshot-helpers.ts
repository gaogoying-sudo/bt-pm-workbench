import { SnapshotContext } from '@/lib/types/snapshot';

export const DEFAULT_SNAPSHOT_DATE = '2026-03-12';
export const DEFAULT_BASELINE_DATE = '2026-02-01';
export const DEFAULT_COMPARE_DATE = '2026-03-01';

export function buildSnapshotContext(input?: Partial<SnapshotContext>): SnapshotContext {
  const snapshotDate = input?.snapshotDate ?? DEFAULT_SNAPSHOT_DATE;
  const baselineDate = input?.baselineDate ?? DEFAULT_BASELINE_DATE;
  const compareDate = input?.compareDate ?? DEFAULT_COMPARE_DATE;

  return {
    snapshotDate,
    baselineDate,
    compareDate,
    comparisonBasis:
      input?.comparisonBasis ??
      '当前采用 v0 mock 聚合口径，以固定快照日、基线日和对比日作为治理视图输入 / Current view uses v0 mock aggregation with fixed snapshot, baseline and compare dates.',
    timelineLabel:
      input?.timelineLabel ??
      `快照 ${snapshotDate} / Snapshot ${snapshotDate}`,
    notes: input?.notes
  };
}

export function buildSnapshotLabel(context: SnapshotContext) {
  return `${context.timelineLabel} | 基线 ${context.baselineDate ?? '-'} / Baseline ${context.baselineDate ?? '-'}`;
}
