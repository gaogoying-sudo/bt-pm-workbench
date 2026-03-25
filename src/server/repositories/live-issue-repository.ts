import { addItem, getCollection, setCollection, updateItem } from '@/server/persistence/local-store';
import { seededKnownIssues, seededLiveIssues, seededSafeOperatingRange } from '@/data/live-issues/seed';
import { KnownIssueRecord, LiveIssueRecord, SafeOperatingRangeRecord } from '@/lib/types/live-issues';

const LIVE = 'liveIssues';
const KNOWN = 'knownIssues';
const SAFE = 'safeOperatingRange';

export const liveIssueRepository = {
  listLive(): LiveIssueRecord[] {
    const list = getCollection<LiveIssueRecord>(LIVE);
    return list.length === 0 ? seededLiveIssues : list;
  },
  upsertLive(issue: LiveIssueRecord) {
    addItem(LIVE, issue);
  },
  patchLive(id: string, patch: Partial<LiveIssueRecord>) {
    return updateItem<LiveIssueRecord>(LIVE, id, patch);
  },

  listKnown(): KnownIssueRecord[] {
    const list = getCollection<KnownIssueRecord>(KNOWN);
    return list.length === 0 ? seededKnownIssues : list;
  },
  upsertKnown(issue: KnownIssueRecord) {
    addItem(KNOWN, issue);
  },

  getSafeOperatingRange(): SafeOperatingRangeRecord {
    const list = getCollection<SafeOperatingRangeRecord>(SAFE);
    if (list.length === 0) {
      setCollection<SafeOperatingRangeRecord>(SAFE, [seededSafeOperatingRange]);
      return seededSafeOperatingRange;
    }
    return list[0];
  },
  setSafeOperatingRange(record: SafeOperatingRangeRecord) {
    setCollection<SafeOperatingRangeRecord>(SAFE, [record]);
  }
};

