import { manpowerComparisons } from '@/data/manpower/manpower-comparisons';
import { manpowerRoleConfigs } from '@/data/manpower/manpower-role-configs';
import { taskExecutionRecords } from '@/data/task-execution/task-execution-records';
import { buildSnapshotContext } from '@/lib/snapshots/snapshot-helpers';
import { buildManpowerActualInputAdapterResults } from '@/lib/manpower/actual-input-adapters';
import { mapResourceRoleToManpowerRole } from '@/lib/manpower/role-cost-mappers';
import { ManpowerCostSummary, RoleCostSnapshot } from '@/lib/types/manpower-calculation';
import { projectAllocations } from '@/data/resources/project-allocations';

export function buildManpowerCostSummary(): ManpowerCostSummary {
  const adapterResults = buildManpowerActualInputAdapterResults();

  return {
    totalPlannedCost: manpowerComparisons.reduce((sum, item) => sum + item.plannedCost, 0),
    totalActualCost: adapterResults.reduce((sum, item) => sum + item.adaptedActualCost, 0),
    totalVarianceCost:
      adapterResults.reduce((sum, item) => sum + item.adaptedActualCost, 0) -
      manpowerComparisons.reduce((sum, item) => sum + item.plannedCost, 0),
    totalPlannedWorkDays: manpowerComparisons.reduce((sum, item) => sum + item.plannedPersonDays, 0),
    totalActualWorkDays: adapterResults.reduce((sum, item) => sum + item.adaptedActualWorkDays, 0),
    snapshotContext: buildSnapshotContext({
      notes: '人力成本汇总由 comparison mock 与 task/allocation 回写适配结果共同构建 / Manpower summary combines comparison mocks with task/allocation adapter results.'
    })
  };
}

export function buildRoleCostSnapshots(): RoleCostSnapshot[] {
  return manpowerRoleConfigs.map((role) => {
    const relatedAllocations = projectAllocations.filter((allocation) => {
      const mappedRole = mapResourceRoleToManpowerRole(allocation.roleId);
      return mappedRole?.id === role.id;
    });
    const relatedTaskDays = taskExecutionRecords
      .filter((task) => task.relatedAllocationIds.some((allocationId) => relatedAllocations.some((allocation) => allocation.id === allocationId)))
      .reduce((sum, task) => sum + task.actualWorkDays, 0);

    return {
      roleId: role.id,
      roleName: role.name,
      defaultDailyRate: role.defaultDailyRate,
      defaultMonthlyCost: role.defaultMonthlyCost,
      mappedActualWorkDays: relatedTaskDays,
      estimatedActualCost: relatedTaskDays * role.defaultDailyRate
    };
  });
}
