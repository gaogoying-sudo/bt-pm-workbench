import { resolveProjectId, getProjectIdentity } from './unified-project-registry';

export type IdNamespace = 'project' | 'person' | 'role' | 'stage' | 'task' | 'allocation' | 'version';

export function resolveId(namespace: IdNamespace, rawId: string): string {
  if (namespace === 'project') return resolveProjectId(rawId);
  return rawId;
}

export function isValidProjectId(input: string): boolean {
  return getProjectIdentity(input) !== null;
}

export function toRouteParam(namespace: IdNamespace, canonicalId: string): string {
  if (namespace === 'project') {
    const identity = getProjectIdentity(canonicalId);
    return identity?.routeId ?? canonicalId;
  }
  return canonicalId;
}

export function fromRouteParam(namespace: IdNamespace, routeParam: string): string {
  if (namespace === 'project') return resolveProjectId(routeParam);
  return routeParam;
}
