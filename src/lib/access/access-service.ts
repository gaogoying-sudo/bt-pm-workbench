import { accessPolicies, permissionGroups, viewScopes } from '@/data/identity/access';
import { identityRegistry } from '@/lib/identity/identity-registry';
import { CurrentUserContext } from '@/lib/types/identity';
import { UserAccessContext, PermissionId } from '@/lib/types/access';
import { buildParticipationScope } from '@/lib/participation/participation-builders';

export function buildCurrentUserContext(userId: string): CurrentUserContext {
  const person = identityRegistry.getPerson(userId);
  const roleIds = person ? [person.primaryRoleId, ...person.secondaryRoleIds] : ['role-observer'];

  const permissionGroupIds = roleIds
    .map((rid) => identityRegistry.getRole(rid)?.permissionGroupId)
    .filter((x): x is string => Boolean(x));

  const projectScope = buildParticipationScope(userId);

  return {
    userId,
    orgUnitId: person?.orgUnitId ?? 'org-bt',
    teamId: person?.teamId ?? null,
    roleIds,
    permissionGroupIds,
    projectScope
  };
}

export function buildUserAccessContext(ctx: CurrentUserContext): UserAccessContext {
  const groupIds = [...new Set(ctx.permissionGroupIds)];
  const permissionIds = groupIds.flatMap((gid) => permissionGroups.find((g) => g.id === gid)?.permissionIds ?? []);
  const deduped = [...new Set(permissionIds)] as PermissionId[];

  // derive view scope by role
  const viewScope =
    ctx.roleIds.includes('role-exec')
      ? viewScopes.find((v) => v.id === 'vs-all')!
      : ctx.roleIds.includes('role-observer')
        ? viewScopes.find((v) => v.id === 'vs-observer')!
        : viewScopes.find((v) => v.id === 'vs-participating')!;

  const readOnly = viewScope.scopeMode === 'readonly-observer';

  return { userId: ctx.userId, permissionIds: deduped, viewScope, readOnly };
}

export function hasPermission(access: UserAccessContext, permissionId: PermissionId): boolean {
  return access.permissionIds.includes(permissionId);
}

