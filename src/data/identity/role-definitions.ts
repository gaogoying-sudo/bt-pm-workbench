import { RoleDefinitionRecord } from '@/lib/types/identity';

export const roleDefinitions: RoleDefinitionRecord[] = [
  { id: 'role-exec', code: 'EXEC', name: 'Executive', category: 'management', permissionGroupId: 'pg-exec', capabilityTags: ['portfolio-view'] },
  { id: 'role-pm', code: 'PM', name: 'Project Manager', category: 'delivery', permissionGroupId: 'pg-pm', capabilityTags: ['project-owner', 'stage-owner'] },
  { id: 'role-dev', code: 'DEV', name: 'Engineer', category: 'engineering', permissionGroupId: 'pg-member', capabilityTags: ['task-owner', 'writeback'] },
  { id: 'role-qa', code: 'QA', name: 'QA', category: 'quality', permissionGroupId: 'pg-quality', capabilityTags: ['quality-check'] },
  { id: 'role-observer', code: 'OBS', name: 'Observer', category: 'observer', permissionGroupId: 'pg-observer', capabilityTags: ['readonly'] }
];

