import { projects } from '@/data/projects';
import { manpowerProjects } from '@/data/manpower/manpower-projects';
import { manpowerStagePlans } from '@/data/manpower/manpower-stage-plans';
import { ManpowerProject, ProjectStagePlan } from '@/lib/types/manpower';
import { Project } from '@/lib/types/domain';

export interface UnifiedProjectIdentity {
  canonicalId: string;
  legacyId: string;
  routeId: string;
  code: string;
  displayName: string;
  hasManpowerData: boolean;
}

const registry = new Map<string, UnifiedProjectIdentity>();
const routeIndex = new Map<string, string>();
const legacyIndex = new Map<string, string>();

function deriveCanonicalId(legacyId: string): string {
  return legacyId.startsWith('project-') ? legacyId : `project-${legacyId}`;
}

function deriveLegacyId(canonicalId: string): string {
  return canonicalId.startsWith('project-') ? canonicalId.slice('project-'.length) : canonicalId;
}

function buildRegistry() {
  if (registry.size > 0) return;

  for (const p of projects) {
    const canonicalId = deriveCanonicalId(p.id);
    const legacyId = p.id;
    const routeId = legacyId;
    const hasManpower = manpowerProjects.some((mp) => mp.id === canonicalId);

    const identity: UnifiedProjectIdentity = {
      canonicalId,
      legacyId,
      routeId,
      code: p.code,
      displayName: p.name,
      hasManpowerData: hasManpower
    };

    registry.set(canonicalId, identity);
    routeIndex.set(routeId, canonicalId);
    legacyIndex.set(legacyId, canonicalId);
  }

  for (const mp of manpowerProjects) {
    if (!registry.has(mp.id)) {
      const legacyId = deriveLegacyId(mp.id);
      const identity: UnifiedProjectIdentity = {
        canonicalId: mp.id,
        legacyId,
        routeId: legacyId,
        code: mp.code,
        displayName: mp.name,
        hasManpowerData: true
      };
      registry.set(mp.id, identity);
      routeIndex.set(legacyId, mp.id);
      legacyIndex.set(legacyId, mp.id);
    }
  }
}

export function resolveProjectId(input: string): string {
  buildRegistry();
  if (registry.has(input)) return input;
  const fromRoute = routeIndex.get(input);
  if (fromRoute) return fromRoute;
  const fromLegacy = legacyIndex.get(input);
  if (fromLegacy) return fromLegacy;
  const derived = deriveCanonicalId(input);
  if (registry.has(derived)) return derived;
  return input;
}

export function getProjectIdentity(input: string): UnifiedProjectIdentity | null {
  buildRegistry();
  const canonicalId = resolveProjectId(input);
  return registry.get(canonicalId) ?? null;
}

export function getAllProjectIdentities(): UnifiedProjectIdentity[] {
  buildRegistry();
  return [...registry.values()];
}

export function getRouteIdForProject(canonicalId: string): string {
  const identity = getProjectIdentity(canonicalId);
  return identity?.routeId ?? canonicalId;
}

export function getCanonicalIdFromRoute(routeId: string): string {
  return resolveProjectId(routeId);
}

export function getBaseProject(input: string): Project | null {
  const identity = getProjectIdentity(input);
  if (!identity) return null;
  return projects.find((p) => p.id === identity.legacyId) ?? null;
}

export function getManpowerProject(input: string): ManpowerProject | null {
  const canonicalId = resolveProjectId(input);
  return manpowerProjects.find((p) => p.id === canonicalId) ?? null;
}

export function getProjectStages(input: string): ProjectStagePlan[] {
  const canonicalId = resolveProjectId(input);
  return manpowerStagePlans
    .filter((s) => s.projectId === canonicalId)
    .sort((a, b) => a.stageOrder - b.stageOrder);
}
