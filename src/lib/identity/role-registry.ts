import { resourceRoles } from '@/data/resources/resource-roles';
import { manpowerRoleConfigs } from '@/data/manpower/manpower-role-configs';
import { ResourceRoleRecord } from '@/lib/types/people-resources';
import { EngineerRoleConfig } from '@/lib/types/manpower';

export interface UnifiedRoleDefinition {
  canonicalId: string;
  resourceRoleId: string | null;
  manpowerRoleId: string | null;
  name: string;
  category: string;
  defaultDailyRate: number;
  defaultMonthlyCost: number;
  defaultCapacity: number;
}

const roleRegistry = new Map<string, UnifiedRoleDefinition>();

function normalizeRoleName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function buildRoleRegistry() {
  if (roleRegistry.size > 0) return;

  const matchMap = new Map<string, { resource?: ResourceRoleRecord; manpower?: EngineerRoleConfig }>();

  for (const rr of resourceRoles) {
    const key = normalizeRoleName(rr.name.split(' ')[0]);
    const entry = matchMap.get(key) ?? {};
    entry.resource = rr;
    matchMap.set(key, entry);
  }

  for (const mr of manpowerRoleConfigs) {
    const key = normalizeRoleName(mr.name.split(' ')[0]);
    const entry = matchMap.get(key) ?? {};
    entry.manpower = mr;
    matchMap.set(key, entry);
  }

  for (const [, entry] of matchMap) {
    const rr = entry.resource;
    const mr = entry.manpower;
    const canonicalId = rr?.id ?? mr?.id ?? '';
    if (!canonicalId) continue;

    roleRegistry.set(canonicalId, {
      canonicalId,
      resourceRoleId: rr?.id ?? null,
      manpowerRoleId: mr?.id ?? null,
      name: rr?.name ?? mr?.name ?? '',
      category: rr?.category ?? mr?.roleType ?? 'unknown',
      defaultDailyRate: mr?.defaultDailyRate ?? 1800,
      defaultMonthlyCost: mr?.defaultMonthlyCost ?? 40000,
      defaultCapacity: rr?.defaultCapacity ?? mr?.defaultCapacity ?? 1
    });
  }
}

export function getRoleDefinition(roleId: string): UnifiedRoleDefinition | null {
  buildRoleRegistry();
  if (roleRegistry.has(roleId)) return roleRegistry.get(roleId)!;

  for (const [, def] of roleRegistry) {
    if (def.resourceRoleId === roleId || def.manpowerRoleId === roleId) return def;
  }
  return null;
}

export function getAllRoleDefinitions(): UnifiedRoleDefinition[] {
  buildRoleRegistry();
  return [...roleRegistry.values()];
}

export function getDailyRateForRole(roleId: string): number {
  return getRoleDefinition(roleId)?.defaultDailyRate ?? 1800;
}

export function getMonthlyRateForRole(roleId: string): number {
  return getRoleDefinition(roleId)?.defaultMonthlyCost ?? 40000;
}
