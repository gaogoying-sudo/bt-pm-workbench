import { manpowerRoleConfigs } from '@/data/manpower/manpower-role-configs';
import { resourceRoles } from '@/data/resources/resource-roles';

export function mapResourceRoleToManpowerRole(roleId: string) {
  const resourceRole = resourceRoles.find((role) => role.id === roleId);
  if (!resourceRole) return undefined;

  return manpowerRoleConfigs.find((role) =>
    role.name.toLowerCase().includes(resourceRole.name.split(' ')[0].toLowerCase())
  );
}
