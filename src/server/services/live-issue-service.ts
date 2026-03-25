import { liveIssueRepository } from '@/server/repositories/live-issue-repository';
import { LiveIssueRecord } from '@/lib/types/live-issues';

function nowIso() {
  return new Date().toISOString();
}

export const liveIssueService = {
  listPack() {
    return {
      liveIssues: liveIssueRepository.listLive(),
      knownIssues: liveIssueRepository.listKnown(),
      safeOperatingRange: liveIssueRepository.getSafeOperatingRange()
    };
  },

  create(issue: Omit<LiveIssueRecord, 'id' | 'detectedAt' | 'updatedAt' | 'status'>) {
    const record: LiveIssueRecord = {
      ...issue,
      id: `live-${nowIso().replace(/[:.]/g, '-')}`,
      detectedAt: nowIso(),
      updatedAt: nowIso(),
      status: 'new'
    };
    liveIssueRepository.upsertLive(record);
    return record;
  },

  patch(id: string, patch: Partial<LiveIssueRecord>) {
    return liveIssueRepository.patchLive(id, { ...patch, updatedAt: nowIso() });
  }
};

