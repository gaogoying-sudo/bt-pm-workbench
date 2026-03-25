import { peopleResources } from '@/data/resources/people-resources';
import { resourceRoles } from '@/data/resources/resource-roles';
import { projectAllocations } from '@/data/resources/project-allocations';
import { hiringDemands } from '@/data/resources/hiring-demands';
import { sensitiveCostProfiles } from '@/data/resources/sensitive-cost-profiles';
import { PersonResourceRecord, ResourceRoleRecord, ProjectAllocationRecord, HiringDemandRecord, SensitiveCostProfile } from '@/lib/types/people-resources';
import { resolveProjectId } from '@/lib/identity/unified-project-registry';

export const personRepository = {
  findAllPersons(): PersonResourceRecord[] {
    return peopleResources;
  },

  findPersonById(id: string): PersonResourceRecord | null {
    return peopleResources.find((p) => p.id === id) ?? null;
  },

  findAllRoles(): ResourceRoleRecord[] {
    return resourceRoles;
  },

  findRoleById(id: string): ResourceRoleRecord | null {
    return resourceRoles.find((r) => r.id === id) ?? null;
  },

  findAllAllocations(): ProjectAllocationRecord[] {
    return projectAllocations;
  },

  findAllocationsByProjectId(projectId: string): ProjectAllocationRecord[] {
    const canonicalId = resolveProjectId(projectId);
    return projectAllocations.filter((a) => a.projectId === canonicalId);
  },

  findAllocationsByPersonId(personId: string): ProjectAllocationRecord[] {
    return projectAllocations.filter((a) => a.personId === personId);
  },

  findAllHiringDemands(): HiringDemandRecord[] {
    return hiringDemands;
  },

  findAllSensitiveCostProfiles(): SensitiveCostProfile[] {
    return sensitiveCostProfiles;
  },

  findSensitiveCostProfileByPersonId(personId: string): SensitiveCostProfile | null {
    return sensitiveCostProfiles.find((p) => p.personId === personId) ?? null;
  }
};
