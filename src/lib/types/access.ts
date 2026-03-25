export type PermissionId =
  | 'view:executive-dashboard'
  | 'view:projects'
  | 'view:people-resources'
  | 'view:manpower-cost'
  | 'view:task-execution'
  | 'view:input-inbox'
  | 'action:confirm-input'
  | 'action:writeback'
  | 'action:edit-allocations'
  | 'action:edit-quality';

export interface PermissionDefinition {
  id: PermissionId;
  label: string;
  description: string;
}

export interface PermissionGroup {
  id: string;
  name: string;
  permissionIds: PermissionId[];
}

export interface AccessPolicyRecord {
  id: string;
  name: string;
  permissionGroupIds: string[];
  notes?: string;
}

export interface ViewScopeRecord {
  id: string;
  name: string;
  scopeMode: 'all' | 'participating-only' | 'readonly-observer';
  notes?: string;
}

export interface UserAccessContext {
  userId: string;
  permissionIds: PermissionId[];
  viewScope: ViewScopeRecord;
  readOnly: boolean;
}

