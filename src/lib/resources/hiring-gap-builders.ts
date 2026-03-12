import { hiringDemands } from '@/data/resources/hiring-demands';
import { peopleResources } from '@/data/resources/people-resources';
import { HiringGapSnapshot } from '@/lib/types/resource-allocation';

export function buildHiringGapSnapshots(): HiringGapSnapshot[] {
  return hiringDemands.map((demand) => {
    const availableHeadcount = peopleResources.filter(
      (person) =>
        person.primaryRoleId === demand.roleId &&
        person.availabilityStatus !== 'fully-allocated' &&
        person.availabilityStatus !== 'unavailable'
    ).length;
    const mismatch = Math.max(0, demand.headcount - availableHeadcount);
    const mismatchLevel = mismatch >= 2 ? 'high' : mismatch === 1 ? 'medium' : 'low';

    return {
      projectId: demand.demandSourceProjectId,
      roleId: demand.roleId,
      demandHeadcount: demand.headcount,
      availableHeadcount,
      mismatchLevel,
      summary:
        mismatchLevel === 'high'
          ? '现有资源无法覆盖需求，需要招聘或跨项目调配 / Demand exceeds current supply; hiring or reallocation is needed.'
          : mismatchLevel === 'medium'
            ? '现有资源接近缺口，需要预留补位 / Supply is near the gap and needs backfill planning.'
            : '当前资源可基本覆盖需求 / Current supply can mostly cover the demand.'
    };
  });
}
