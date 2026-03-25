import { SnapshotContext } from '@/lib/types/snapshot';

export interface SnapshotParams {
  snapshotDate?: string;
  baselineDate?: string;
  compareDate?: string;
}

const DEFAULT_SNAPSHOT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_BASELINE_DATE = '2026-02-01';

export const snapshotService = {
  resolveSnapshotContext(params?: SnapshotParams): SnapshotContext {
    const snapshotDate = params?.snapshotDate ?? DEFAULT_SNAPSHOT_DATE;
    const baselineDate = params?.baselineDate ?? DEFAULT_BASELINE_DATE;
    const compareDate = params?.compareDate ?? null;

    return {
      snapshotDate,
      baselineDate,
      compareDate,
      comparisonBasis: compareDate
        ? `Comparing ${snapshotDate} against ${compareDate}`
        : `Snapshot at ${snapshotDate}, baseline ${baselineDate}`,
      timelineLabel: `Snapshot ${snapshotDate}`,
      notes: compareDate ? `Multi-point comparison enabled` : undefined
    };
  },

  getSnapshotDate(params?: SnapshotParams): string {
    return params?.snapshotDate ?? DEFAULT_SNAPSHOT_DATE;
  }
};
