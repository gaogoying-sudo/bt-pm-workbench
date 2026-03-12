import { peopleResources } from '@/data/resources/people-resources';
import { buildSnapshotContext } from '@/lib/snapshots/snapshot-helpers';
import {
  AllocationUtilizationSnapshot,
  ResourcePressureSnapshot
} from '@/lib/types/resource-allocation';
import { buildResourceAllocationAggregates } from '@/lib/resources/allocation-selectors';

export function buildAllocationUtilizationSnapshots(): AllocationUtilizationSnapshot[] {
  return peopleResources.map((person) => {
    const personAllocations = buildResourceAllocationAggregates().filter((item) => item.personId === person.id);
    const totalAllocationRate = personAllocations.reduce((sum, item) => sum + item.allocationRate, 0);
    const utilizationStatus =
      totalAllocationRate > 1 || person.currentUtilization > 0.95
        ? 'overloaded'
        : totalAllocationRate >= 0.9
          ? 'full'
          : totalAllocationRate >= 0.5
            ? 'partial'
            : 'available';

    return {
      personId: person.id,
      totalAllocationRate,
      utilizationStatus,
      relatedProjectIds: [...new Set(personAllocations.map((item) => item.projectId))],
      summary: `当前分配率 ${Math.round(totalAllocationRate * 100)}%，可用状态 ${person.availabilityStatus} / Allocation ${Math.round(totalAllocationRate * 100)}%, availability ${person.availabilityStatus}.`
    };
  });
}

export function buildResourcePressureSnapshots(): ResourcePressureSnapshot[] {
  const allocationAggregates = buildResourceAllocationAggregates();
  const projectIds = [...new Set(allocationAggregates.map((item) => item.projectId))];

  return projectIds.map((projectId) => {
    const related = allocationAggregates.filter((item) => item.projectId === projectId);
    const overloadedPeople = related.filter((item) => item.utilizationPressure > 0.95).length;
    const constrainedPeople = related.filter((item) => item.utilizationPressure > 0.8).length;
    const pressureLevel = overloadedPeople > 0 ? 'high' : constrainedPeople > 1 ? 'medium' : 'low';

    return {
      projectId,
      overloadedPeople,
      constrainedPeople,
      pressureLevel,
      summary:
        pressureLevel === 'high'
          ? '存在超载分配，需要调配或补位 / Overloaded allocations require rebalancing or backfill.'
          : pressureLevel === 'medium'
            ? '存在资源紧张，需要持续观察 / Resource pressure needs monitoring.'
            : '资源压力整体可控 / Resource pressure remains manageable.',
      snapshotContext: buildSnapshotContext({
        notes: '资源压力快照由 allocation 聚合与人员利用率共同构建 / Resource pressure is built from allocation aggregates and people utilization.'
      })
    };
  });
}
