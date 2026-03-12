export type TaskType =
  | 'planning'
  | 'product'
  | 'design'
  | 'frontend'
  | 'backend'
  | 'qa'
  | 'integration'
  | 'release'
  | 'operations'
  | 'data'
  | 'ai'
  | 'coordination';

export type TaskLevel = 'epic' | 'task' | 'subtask';
export type TaskStatus = 'not-started' | 'ready' | 'in-progress' | 'blocked' | 'at-risk' | 'done' | 'paused' | 'cancelled';
export type TaskPriority = 'p0' | 'p1' | 'p2' | 'p3';
export type TaskRiskLevel = 'low' | 'medium' | 'high';

export interface TaskExecutionRecord {
  id: string;
  taskCode: string;
  title: string;
  taskType: TaskType;
  taskLevel: TaskLevel;
  projectId: string;
  stageId: string;
  parentTaskId: string | null;
  ownerPersonId: string;
  collaboratorPersonIds: string[];
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate: string | null;
  actualEndDate: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  estimatedWorkDays: number;
  actualWorkDays: number;
  relatedAllocationIds: string[];
  dependencyTaskIds: string[];
  riskLevel: TaskRiskLevel;
  blockerSummary: string;
  deliverableSummary: string;
  notes: string;
}

export interface ProjectStageTaskLink {
  id: string;
  projectId: string;
  stageId: string;
  taskId: string;
  sequence: number;
  isMilestoneRelated: boolean;
  weight: number;
  notes: string;
}

export type DependencyType = 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'soft-link';
export type DependencyStatus = 'active' | 'resolved' | 'pending';

export interface TaskDependencyRecord {
  id: string;
  fromTaskId: string;
  toTaskId: string;
  dependencyType: DependencyType;
  status: DependencyStatus;
  notes: string;
}

export type ActivityRecordType = 'progress-update' | 'worklog' | 'blocker' | 'risk' | 'completion';

export interface TaskActivityRecord {
  id: string;
  taskId: string;
  recordDate: string;
  personId: string;
  recordType: ActivityRecordType;
  progressDelta: number;
  spentWorkDays: number;
  comment: string;
  riskFlag: boolean;
  blockerFlag: boolean;
}

export type TaskViewType = 'project' | 'person' | 'stage' | 'status';

export interface TaskViewPreset {
  id: string;
  name: string;
  viewType: TaskViewType;
  projectIds: string[];
  roleIds: string[];
  personIds: string[];
  statusFilter: TaskStatus[];
  priorityFilter: TaskPriority[];
  stageFilter: string[];
  notes: string;
}
