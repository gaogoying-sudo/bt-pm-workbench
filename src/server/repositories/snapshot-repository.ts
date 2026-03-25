import { projectVersionLinkRecords } from '@/data/project-progress/project-version-link-records';
import { releaseWindowRecords } from '@/data/version-governance/release-window-records';
import { ProjectVersionLinkRecord } from '@/lib/types/project-progress';
import { ReleaseWindowRecord } from '@/lib/types/version-governance';
import { SnapshotContext } from '@/lib/types/snapshot';
import { resolveProjectId } from '@/lib/identity/unified-project-registry';

export const snapshotRepository = {
  findAllVersionLinks(): ProjectVersionLinkRecord[] {
    return projectVersionLinkRecords;
  },

  findVersionLinksByProjectId(projectId: string): ProjectVersionLinkRecord[] {
    const canonicalId = resolveProjectId(projectId);
    return projectVersionLinkRecords.filter((l) => l.projectId === canonicalId);
  },

  findAllReleaseWindows(): ReleaseWindowRecord[] {
    return releaseWindowRecords;
  },

  buildSnapshotContext(overrides?: Partial<SnapshotContext>): SnapshotContext {
    const now = new Date().toISOString().slice(0, 10);
    return {
      snapshotDate: overrides?.snapshotDate ?? now,
      baselineDate: overrides?.baselineDate ?? '2026-02-01',
      compareDate: overrides?.compareDate ?? null,
      comparisonBasis: overrides?.comparisonBasis ?? `Snapshot taken at ${overrides?.snapshotDate ?? now}`,
      timelineLabel: overrides?.timelineLabel ?? `Snapshot ${overrides?.snapshotDate ?? now}`,
      notes: overrides?.notes
    };
  }
};
