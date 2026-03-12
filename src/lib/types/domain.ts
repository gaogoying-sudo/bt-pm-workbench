export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'sealed' | 'archived';
export type ProjectPhase = 'discovery' | 'design' | 'delivery' | 'stabilization' | 'maintenance';

export interface Project {
  id: string;
  name: string;
  code: string;
  type: 'internal' | 'client' | 'special' | 'workbench';
  status: ProjectStatus;
  phase: ProjectPhase;
  owner: string;
  currentVersion: string;
  mainDocument: string;
  isArchived: boolean;
  isSealed: boolean;
  summary: string;
  scope: string;
  nonScope: string;
  updatedAt: string;
  tags: string[];
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus =
  | 'not-started'
  | 'in-progress'
  | 'pending-confirmation'
  | 'blocked'
  | 'completed'
  | 'cancelled'
  | 'archived';

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  module: string;
  priority: TaskPriority;
  status: TaskStatus;
  owner: string;
  blocker: string;
  nextAction: string;
  updatedAt: string;
}

export type VersionStatus = 'draft' | 'pending-confirmation' | 'active' | 'archived';

export interface VersionRecord {
  id: string;
  projectId: string;
  objectType: string;
  objectName: string;
  version: string;
  status: VersionStatus;
  isActive: boolean;
  previousVersion: string | null;
  summary: string;
  updatedAt: string;
}

export type DocumentType =
  | 'master-index'
  | 'control-document'
  | 'version-matrix'
  | 'change-log'
  | 'references-list'
  | 'information-architecture'
  | 'topic-document'
  | 'archive';

export interface DocumentRecord {
  id: string;
  projectId: string;
  title: string;
  docType: DocumentType;
  status: 'draft' | 'reviewing' | 'active' | 'archived';
  isActive: boolean;
  readOrder: number;
  description: string;
  updatedAt: string;
}

export interface ChangeRecord {
  id: string;
  projectId: string;
  target: string;
  changeType: 'scope' | 'requirement' | 'document' | 'version' | 'task';
  summary: string;
  impactScope: string;
  versionImpact: 'none' | 'minor' | 'major';
  taskImpact: 'none' | 'partial' | 'full';
  status: 'open' | 'reviewing' | 'approved' | 'rejected' | 'implemented';
  updatedAt: string;
}

export interface ReferenceRecord {
  id: string;
  sourceProject: string;
  targetProject: string;
  objectName: string;
  referenceScope: string;
  purpose: string;
  isReadOnly: boolean;
  excludedContent: string;
  status: 'candidate' | 'approved' | 'rejected' | 'expired';
  updatedAt: string;
}
