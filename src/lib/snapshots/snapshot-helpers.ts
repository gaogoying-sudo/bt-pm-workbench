import { SnapshotContext } from '@/lib/types/snapshot';

export const DEFAULT_SNAPSHOT_DATE = new Date().toISOString().slice(0, 10);
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
      (compareDate
        ? `对比 ${snapshotDate} 与 ${compareDate} / Comparing ${snapshotDate} against ${compareDate}`
        : `快照 ${snapshotDate}，基线 ${baselineDate} / Snapshot ${snapshotDate}, baseline ${baselineDate}`),
    timelineLabel:
      input?.timelineLabel ??
      `快照 ${snapshotDate} / Snapshot ${snapshotDate}`,
    notes: input?.notes
  };
}

export function buildSnapshotLabel(context: SnapshotContext) {
  return `${context.timelineLabel} | 基线 ${context.baselineDate ?? '-'} / Baseline ${context.baselineDate ?? '-'}`;
}

export function buildMultiPointSnapshotContext(
  snapshotDate: string,
  baselineDate: string,
  compareDate: string
): SnapshotContext {
  return buildSnapshotContext({
    snapshotDate,
    baselineDate,
    compareDate,
    comparisonBasis: `多时点对比: 快照 ${snapshotDate} vs 对比 ${compareDate}，基线 ${baselineDate}`,
    notes: 'Multi-point comparison context for timeline analysis.'
  });
}
