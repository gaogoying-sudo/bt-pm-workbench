import { manpowerRoleConfigs } from '@/data/manpower/manpower-role-configs';
import { manpowerActualInputs } from '@/data/manpower/manpower-actual-inputs';
import { manpowerComparisons } from '@/data/manpower/manpower-comparisons';
import { EngineerRoleConfig, ActualInputRecord, CostComparisonRecord } from '@/lib/types/manpower';
import { resolveProjectId } from '@/lib/identity/unified-project-registry';

export const manpowerRepository = {
  findAllRoleConfigs(): EngineerRoleConfig[] {
    return manpowerRoleConfigs;
  },

  findRoleConfigById(id: string): EngineerRoleConfig | null {
    return manpowerRoleConfigs.find((r) => r.id === id) ?? null;
  },

  findAllActualInputs(): ActualInputRecord[] {
    return manpowerActualInputs;
  },

  findActualInputsByProjectId(projectId: string): ActualInputRecord[] {
    const canonicalId = resolveProjectId(projectId);
    return manpowerActualInputs.filter((i) => i.projectId === canonicalId);
  },

  findAllComparisons(): CostComparisonRecord[] {
    return manpowerComparisons;
  },

  findComparisonsByProjectId(projectId: string): CostComparisonRecord[] {
    const canonicalId = resolveProjectId(projectId);
    return manpowerComparisons.filter((c) => c.projectId === canonicalId);
  }
};
