import { qualityCheckRecords, qualityGateDefinitions } from '@/data/quality/quality-check-records';
import { QualityCheckRecord, QualityGateDefinition } from '@/lib/types/quality';
import { resolveProjectId } from '@/lib/identity/unified-project-registry';

export const qualityRepository = {
  findAllChecks(): QualityCheckRecord[] {
    return qualityCheckRecords;
  },

  findChecksByProjectId(projectId: string): QualityCheckRecord[] {
    const canonicalId = resolveProjectId(projectId);
    return qualityCheckRecords.filter((c) => c.projectId === canonicalId);
  },

  findCheckById(id: string): QualityCheckRecord | null {
    return qualityCheckRecords.find((c) => c.id === id) ?? null;
  },

  findAllGateDefinitions(): QualityGateDefinition[] {
    return qualityGateDefinitions;
  },

  findGatesByProjectId(projectId: string): QualityGateDefinition[] {
    const canonicalId = resolveProjectId(projectId);
    return qualityGateDefinitions.filter((g) => g.projectId === canonicalId);
  }
};
