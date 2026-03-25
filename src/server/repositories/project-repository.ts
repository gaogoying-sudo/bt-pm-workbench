import { projects } from '@/data/projects';
import { manpowerProjects } from '@/data/manpower/manpower-projects';
import { manpowerStagePlans } from '@/data/manpower/manpower-stage-plans';
import { manpowerPlanVersions } from '@/data/manpower/manpower-plan-versions';
import { Project } from '@/lib/types/domain';
import { ManpowerProject, ProjectStagePlan, PlanVersion } from '@/lib/types/manpower';
import { resolveProjectId, getProjectIdentity, UnifiedProjectIdentity } from '@/lib/identity/unified-project-registry';

export const projectRepository = {
  findAllBaseProjects(): Project[] {
    return projects;
  },

  findBaseProjectById(id: string): Project | null {
    const identity = getProjectIdentity(id);
    if (!identity) return null;
    return projects.find((p) => p.id === identity.legacyId) ?? null;
  },

  findAllManpowerProjects(): ManpowerProject[] {
    return manpowerProjects;
  },

  findManpowerProjectById(id: string): ManpowerProject | null {
    const canonicalId = resolveProjectId(id);
    return manpowerProjects.find((p) => p.id === canonicalId) ?? null;
  },

  findStagesByProjectId(projectId: string): ProjectStagePlan[] {
    const canonicalId = resolveProjectId(projectId);
    return manpowerStagePlans
      .filter((s) => s.projectId === canonicalId)
      .sort((a, b) => a.stageOrder - b.stageOrder);
  },

  findAllStages(): ProjectStagePlan[] {
    return manpowerStagePlans;
  },

  findPlanVersionsByProjectId(projectId: string): PlanVersion[] {
    const canonicalId = resolveProjectId(projectId);
    return manpowerPlanVersions.filter((v) => v.projectId === canonicalId);
  },

  findAllProjectIdentities(): UnifiedProjectIdentity[] {
    const { getAllProjectIdentities } = require('@/lib/identity/unified-project-registry');
    return getAllProjectIdentities();
  }
};
