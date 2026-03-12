export type EngineerRoleType =
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'qa'
  | 'product-manager'
  | 'project-manager'
  | 'designer'
  | 'ai-engineer'
  | 'data-engineer'
  | 'platform-engineer';

export interface EngineerRoleConfig {
  id: string;
  name: string;
  roleType: EngineerRoleType;
  level: string;
  defaultDailyRate: number;
  defaultMonthlyCost: number;
  defaultUtilization: number;
  defaultCapacity: number;
  notes: string;
}

export type ManpowerProjectStatus = 'planning' | 'active' | 'at-risk' | 'on-hold' | 'completed';
export type ProjectPriority = 'P0' | 'P1' | 'P2' | 'P3';

export interface ManpowerProject {
  id: string;
  name: string;
  code: string;
  status: ManpowerProjectStatus;
  priority: ProjectPriority;
  owner: string;
  startDate: string;
  endDate: string;
  currentPlanVersionId: string;
  notes: string;
}

export type ProjectStageName =
  | '需求分析'
  | '方案设计'
  | '开发实现'
  | '联调测试'
  | '发布上线'
  | '运营迭代';

export interface ProjectStagePlan {
  id: string;
  projectId: string;
  versionId: string;
  stageName: ProjectStageName;
  stageOrder: number;
  plannedStartDate: string;
  plannedEndDate: string;
  elasticityFactor: number;
  elasticityNote: string;
  plannedRoleIds: string[];
  plannedPersonDays: number;
  plannedCost: number;
  actualInputPlaceholder: string;
  comparisonPlaceholder: string;
}

export type PlanVersionSourceType = 'manual' | 'imported' | 'adjusted';
export type PlanVersionStatus = 'draft' | 'active' | 'baseline' | 'superseded';

export interface PlanVersion {
  id: string;
  projectId: string;
  name: string;
  isBaseline: boolean;
  createdAt: string;
  description: string;
  sourceType: PlanVersionSourceType;
  status: PlanVersionStatus;
}

export interface ActualInputRecord {
  id: string;
  projectId: string;
  versionId: string;
  stageId?: string;
  roleId?: string;
  actualPersonDays: number;
  actualCost: number;
  sourceType: 'manual-json' | 'formula-import' | 'timesheet-sync';
  recordedAt: string;
  note: string;
}

export type ComparisonRiskLevel = 'low' | 'medium' | 'high';

export interface CostComparisonRecord {
  id: string;
  projectId: string;
  versionId: string;
  stageId?: string;
  plannedPersonDays: number;
  actualPersonDays: number;
  personDaysVariance: number;
  plannedCost: number;
  actualCost: number;
  costVariance: number;
  varianceRate: number;
  riskLevel: ComparisonRiskLevel;
  riskNote: string;
}
