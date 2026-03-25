import { AccessPolicyRecord, PermissionDefinition, PermissionGroup, ViewScopeRecord } from '@/lib/types/access';

export const permissionDefinitions: PermissionDefinition[] = [
  { id: 'view:executive-dashboard', label: 'Executive Dashboard', description: 'View portfolio executive dashboard.' },
  { id: 'view:projects', label: 'Projects', description: 'View projects and project detail.' },
  { id: 'view:people-resources', label: 'People & Resources', description: 'View people/resources workbench.' },
  { id: 'view:manpower-cost', label: 'Manpower Cost', description: 'View manpower cost workbench.' },
  { id: 'view:task-execution', label: 'Task Execution', description: 'View task execution workbench.' },
  { id: 'view:input-inbox', label: 'Input Inbox', description: 'View input inbox and drafts.' },
  { id: 'action:confirm-input', label: 'Confirm Input', description: 'Confirm/reject drafts.' },
  { id: 'action:writeback', label: 'Write-back', description: 'Apply writeback actions.' },
  { id: 'action:edit-allocations', label: 'Edit allocations', description: 'Edit staffing allocation (placeholder).' },
  { id: 'action:edit-quality', label: 'Edit quality', description: 'Edit quality records (placeholder).' }
];

export const permissionGroups: PermissionGroup[] = [
  {
    id: 'pg-exec',
    name: 'Executive',
    permissionIds: ['view:executive-dashboard', 'view:projects', 'view:task-execution', 'view:input-inbox']
  },
  {
    id: 'pg-pm',
    name: 'Project Manager',
    permissionIds: [
      'view:projects',
      'view:task-execution',
      'view:people-resources',
      'view:manpower-cost',
      'view:input-inbox',
      'action:confirm-input',
      'action:writeback'
    ]
  },
  {
    id: 'pg-quality',
    name: 'Quality',
    permissionIds: ['view:projects', 'view:task-execution', 'view:input-inbox', 'action:confirm-input', 'action:edit-quality']
  },
  {
    id: 'pg-member',
    name: 'Member',
    permissionIds: ['view:projects', 'view:task-execution', 'view:input-inbox', 'action:confirm-input', 'action:writeback']
  },
  {
    id: 'pg-observer',
    name: 'Observer',
    permissionIds: ['view:projects', 'view:task-execution', 'view:input-inbox']
  }
];

export const viewScopes: ViewScopeRecord[] = [
  { id: 'vs-all', name: 'All projects', scopeMode: 'all', notes: 'Portfolio view.' },
  { id: 'vs-participating', name: 'Participating only', scopeMode: 'participating-only', notes: 'Only projects user participates in.' },
  { id: 'vs-observer', name: 'Observer (readonly)', scopeMode: 'readonly-observer', notes: 'Readonly, participating only.' }
];

export const accessPolicies: AccessPolicyRecord[] = [
  { id: 'ap-exec', name: 'Executive policy', permissionGroupIds: ['pg-exec'], notes: 'Portfolio read view.' },
  { id: 'ap-pm', name: 'PM policy', permissionGroupIds: ['pg-pm'], notes: 'Project owner view.' },
  { id: 'ap-member', name: 'Member policy', permissionGroupIds: ['pg-member'], notes: 'Contributor view.' },
  { id: 'ap-quality', name: 'Quality policy', permissionGroupIds: ['pg-quality'], notes: 'Quality governance view.' },
  { id: 'ap-observer', name: 'Observer policy', permissionGroupIds: ['pg-observer'], notes: 'Readonly view.' }
];

