import { addItem, findById, getCollection, setCollection } from '@/server/persistence/local-store';
import { SnapshotBatchRecord } from '@/lib/types/timeline-snapshot';

const COLLECTION = 'snapshotBatches';

export const snapshotBatchStore = {
  list(): SnapshotBatchRecord[] {
    return getCollection<SnapshotBatchRecord>(COLLECTION).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  get(id: string): SnapshotBatchRecord | null {
    return findById<SnapshotBatchRecord>(COLLECTION, id);
  },

  create(record: SnapshotBatchRecord): SnapshotBatchRecord {
    addItem(COLLECTION, record);
    return record;
  },

  clear(): void {
    setCollection<SnapshotBatchRecord>(COLLECTION, []);
  }
};

