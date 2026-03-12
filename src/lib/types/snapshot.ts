export interface SnapshotContext {
  snapshotDate: string;
  baselineDate?: string | null;
  compareDate?: string | null;
  comparisonBasis: string;
  timelineLabel: string;
  notes?: string;
}

export interface SnapshotMetadata {
  id: string;
  module: string;
  context: SnapshotContext;
}
