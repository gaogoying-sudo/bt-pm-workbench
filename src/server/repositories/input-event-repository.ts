import {
  addItem,
  getCollection,
  setCollection,
  updateItem,
  findById
} from '@/server/persistence/local-store';
import {
  ConfirmedEventRecord,
  EventWritebackRecord,
  RawInputRecord,
  StructuredDraftRecord
} from '@/lib/types/input-events';

const RAW = 'rawInputs';
const DRAFT = 'draftInputs';
const CONFIRMED = 'confirmedEvents';
const WRITEBACKS = 'eventWritebacks';

export const inputEventRepository = {
  listRaw(): RawInputRecord[] {
    return getCollection<RawInputRecord>(RAW).slice().reverse();
  },

  createRaw(record: RawInputRecord): RawInputRecord {
    addItem(RAW, record);
    return record;
  },

  listDrafts(status?: StructuredDraftRecord['status']): StructuredDraftRecord[] {
    const drafts = getCollection<StructuredDraftRecord>(DRAFT).slice().reverse();
    return status ? drafts.filter((d) => d.status === status) : drafts;
  },

  getDraft(id: string): StructuredDraftRecord | null {
    return findById<StructuredDraftRecord>(DRAFT, id);
  },

  upsertDraft(record: StructuredDraftRecord): StructuredDraftRecord {
    const existing = this.getDraft(record.id);
    if (!existing) {
      addItem(DRAFT, record);
      return record;
    }
    return updateItem<StructuredDraftRecord>(DRAFT, record.id, record)!;
  },

  updateDraft(id: string, patch: Partial<StructuredDraftRecord>): StructuredDraftRecord | null {
    return updateItem<StructuredDraftRecord>(DRAFT, id, patch);
  },

  listConfirmed(): ConfirmedEventRecord[] {
    return getCollection<ConfirmedEventRecord>(CONFIRMED).slice().reverse();
  },

  createConfirmed(record: ConfirmedEventRecord): ConfirmedEventRecord {
    addItem(CONFIRMED, record);
    return record;
  },

  updateConfirmed(id: string, patch: Partial<ConfirmedEventRecord>): ConfirmedEventRecord | null {
    return updateItem<ConfirmedEventRecord>(CONFIRMED, id, patch);
  },

  listWritebacks(): EventWritebackRecord[] {
    return getCollection<EventWritebackRecord>(WRITEBACKS).slice().reverse();
  },

  createWriteback(record: EventWritebackRecord): EventWritebackRecord {
    addItem(WRITEBACKS, record);
    return record;
  },

  clearAll(): void {
    setCollection(RAW, []);
    setCollection(DRAFT, []);
    setCollection(CONFIRMED, []);
    setCollection(WRITEBACKS, []);
  }
};

