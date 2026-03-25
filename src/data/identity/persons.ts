import { peopleResources } from '@/data/resources/people-resources';
import { PersonRecord } from '@/lib/types/identity';
import { orgUnits } from '@/data/identity/org-units';
import { teams } from '@/data/identity/teams';

function mapOrgUnit(department?: string) {
  const dept = (department ?? '').toLowerCase();
  if (dept.includes('delivery')) return 'org-delivery';
  if (dept.includes('platform')) return 'org-platform';
  if (dept.includes('product')) return 'org-product';
  if (dept.includes('quality')) return 'org-quality';
  if (dept.includes('ai')) return 'org-ai';
  return 'org-bt';
}

function mapTeam(orgUnitId: string) {
  const t = teams.find((x) => x.orgUnitId === orgUnitId);
  return t?.id ?? null;
}

export const persons: PersonRecord[] = peopleResources.map((p) => {
  const orgUnitId = mapOrgUnit(p.department);
  const teamId = mapTeam(orgUnitId);

  const status =
    p.status === 'active' || p.status === 'on-leave' || p.status === 'candidate' || p.status === 'pipeline'
      ? (p.status as any)
      : 'active';

  // lightweight mapping from resource primary role to identity role
  const roleId =
    p.primaryRoleId.includes('pm') || p.primaryRoleId.includes('product')
      ? 'role-pm'
      : p.primaryRoleId.includes('qa')
        ? 'role-qa'
        : p.primaryRoleId.includes('design')
          ? 'role-dev'
          : 'role-dev';

  return {
    id: p.id,
    username: p.name,
    status,
    primaryRoleId: roleId,
    secondaryRoleIds: [],
    orgUnitId,
    teamId,
    display: { displayName: p.displayName, englishName: null, avatarUrl: null },
    profile: {
      personId: p.id,
      department: p.department,
      location: p.location,
      joinDate: p.joinDate,
      skillTags: p.skillTags,
      notes: p.notes
    }
  };
});

// add one executive placeholder for view scope testing
persons.unshift({
  id: 'person-exec',
  username: 'exec.placeholder',
  status: 'active',
  primaryRoleId: 'role-exec',
  secondaryRoleIds: [],
  orgUnitId: 'org-bt',
  teamId: null,
  display: { displayName: 'Exec Placeholder', englishName: 'Executive', avatarUrl: null },
  profile: { personId: 'person-exec', department: 'Leadership', location: 'Shanghai', joinDate: '2020-01-01', skillTags: ['Portfolio'], notes: 'Mock executive user.' }
});

