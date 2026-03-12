import { manpowerRoleConfigs } from '@/data/manpower/manpower-role-configs';
import { resourceRoles } from '@/data/resources/resource-roles';
import { AllocationWritebackPreview } from '@/lib/types/resource-allocation';
import { buildResourceAllocationAggregates } from '@/lib/resources/allocation-selectors';

export function buildAllocationWritebackPreviews(): AllocationWritebackPreview[] {
  return buildResourceAllocationAggregates().map((allocation) => {
    const resourceRole = resourceRoles.find((role) => role.id === allocation.roleId);
    const mappedManpowerRole = manpowerRoleConfigs.find((role) =>
      resourceRole ? role.name.toLowerCase().includes(resourceRole.name.split(' ')[0].toLowerCase()) : false
    );
    const estimatedActualCost = allocation.actualWorkDays * (mappedManpowerRole?.defaultDailyRate ?? 1800);

    return {
      id: `alloc-writeback-${allocation.allocationId}`,
      projectId: allocation.projectId,
      personId: allocation.personId,
      roleId: allocation.roleId,
      actualWorkDays: allocation.actualWorkDays,
      estimatedActualCost,
      notes: 'allocation 维度回写预览，供后续 manpower actual input adapter 消费 / Allocation-level write-back preview for later manpower adapter consumption.'
    };
  });
}
