import { manpowerComparisons } from '@/data/manpower/manpower-comparisons';
import { manpowerProjects } from '@/data/manpower/manpower-projects';
import { buildManpowerActualInputAdapterResults } from '@/lib/manpower/actual-input-adapters';
import {
  ProjectCostComparisonSnapshot,
  StageCostComparisonSnapshot
} from '@/lib/types/manpower-calculation';

function resolveRiskLevel(varianceRate: number): 'low' | 'medium' | 'high' {
  if (varianceRate >= 0.2) return 'high';
  if (varianceRate >= 0.1) return 'medium';
  return 'low';
}

export function buildStageCostComparisonSnapshots(): StageCostComparisonSnapshot[] {
  const adapters = buildManpowerActualInputAdapterResults();
  return manpowerComparisons
    .filter((item) => item.stageId)
    .map((item) => {
      const adapter = adapters.find((result) => result.projectId === item.projectId && result.stageId === item.stageId);
      const actualCost = adapter?.adaptedActualCost ?? item.actualCost;
      const actualWorkDays = adapter?.adaptedActualWorkDays ?? item.actualPersonDays;
      const varianceCost = actualCost - item.plannedCost;
      const varianceRate = item.plannedCost === 0 ? 0 : varianceCost / item.plannedCost;

      return {
        projectId: item.projectId,
        stageId: item.stageId!,
        plannedWorkDays: item.plannedPersonDays,
        actualWorkDays,
        plannedCost: item.plannedCost,
        actualCost,
        varianceCost,
        varianceRate,
        riskLevel: resolveRiskLevel(Math.abs(varianceRate))
      };
    });
}

export function buildProjectCostComparisonSnapshots(): ProjectCostComparisonSnapshot[] {
  return manpowerProjects.map((project) => {
    const stageSnapshots = buildStageCostComparisonSnapshots().filter((snapshot) => snapshot.projectId === project.id);
    const plannedCost = stageSnapshots.reduce((sum, snapshot) => sum + snapshot.plannedCost, 0);
    const actualCost = stageSnapshots.reduce((sum, snapshot) => sum + snapshot.actualCost, 0);
    const plannedWorkDays = stageSnapshots.reduce((sum, snapshot) => sum + snapshot.plannedWorkDays, 0);
    const actualWorkDays = stageSnapshots.reduce((sum, snapshot) => sum + snapshot.actualWorkDays, 0);
    const varianceCost = actualCost - plannedCost;
    const varianceRate = plannedCost === 0 ? 0 : varianceCost / plannedCost;

    return {
      projectId: project.id,
      plannedWorkDays,
      actualWorkDays,
      plannedCost,
      actualCost,
      varianceCost,
      varianceRate,
      riskLevel: resolveRiskLevel(Math.abs(varianceRate))
    };
  });
}
