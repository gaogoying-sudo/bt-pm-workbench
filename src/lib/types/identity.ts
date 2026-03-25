export type PersonStatus = 'active' | 'on-leave' | 'inactive' | 'candidate' | 'pipeline';

export interface DisplayProfile {
  displayName: string;
  englishName?: string | null;
  avatarUrl?: string | null;
}

export interface PersonProfile {
  personId: string;
  department?: string | null;
  location?: string | null;
  joinDate?: string | null;
  skillTags?: string[];
  notes?: string;
}

export interface PersonRecord {
  id: string; // personId
  username: string;
  status: PersonStatus;
  primaryRoleId: string;
  secondaryRoleIds: string[];
  orgUnitId: string;
  teamId: string | null;
  display: DisplayProfile;
  profile: PersonProfile;
}

export interface RoleDefinitionRecord {
  id: string; // roleId
  code: string;
  name: string;
  category: string;
  rateRefId?: string | null; // points to rate mapping contract
  permissionGroupId: string;
  capabilityTags?: string[];
}

export interface OrgUnitRecord {
  id: string; // orgUnitId
  name: string;
  parentOrgUnitId: string | null;
  pathLabel: string;
  managerPersonId: string | null;
  displayOrder: number;
}

export interface TeamRecord {
  id: string; // teamId
  name: string;
  orgUnitId: string;
  leadPersonId: string | null;
  notes?: string;
}

export interface IdentityBindingRecord {
  id: string;
  personId: string;
  provider: 'feishu-placeholder' | 'github-placeholder' | 'local';
  externalIdentityId: string;
  createdAt: string;
}

export interface UserSessionRecord {
  id: string;
  currentUserId: string;
  createdAt: string;
  expiresAt: string | null;
  notes?: string;
}

export interface CurrentUserContext {
  userId: string;
  orgUnitId: string;
  teamId: string | null;
  roleIds: string[];
  permissionGroupIds: string[];
  projectScope: {
    mode: 'all' | 'participating-only' | 'readonly-observer';
    projectIds: string[];
  };
}

