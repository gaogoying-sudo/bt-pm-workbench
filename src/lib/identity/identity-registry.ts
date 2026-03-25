import { persons } from '@/data/identity/persons';
import { orgUnits } from '@/data/identity/org-units';
import { teams } from '@/data/identity/teams';
import { roleDefinitions } from '@/data/identity/role-definitions';
import { PersonRecord, OrgUnitRecord, TeamRecord, RoleDefinitionRecord } from '@/lib/types/identity';

export const identityRegistry = {
  listPersons(): PersonRecord[] {
    return persons;
  },
  getPerson(personId: string): PersonRecord | null {
    return persons.find((p) => p.id === personId) ?? null;
  },
  listOrgUnits(): OrgUnitRecord[] {
    return orgUnits.slice().sort((a, b) => a.displayOrder - b.displayOrder);
  },
  getOrgUnit(orgUnitId: string): OrgUnitRecord | null {
    return orgUnits.find((o) => o.id === orgUnitId) ?? null;
  },
  listTeams(): TeamRecord[] {
    return teams;
  },
  getTeam(teamId: string): TeamRecord | null {
    return teams.find((t) => t.id === teamId) ?? null;
  },
  listRoles(): RoleDefinitionRecord[] {
    return roleDefinitions;
  },
  getRole(roleId: string): RoleDefinitionRecord | null {
    return roleDefinitions.find((r) => r.id === roleId) ?? null;
  }
};

