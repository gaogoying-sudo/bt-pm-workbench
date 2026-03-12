export type PersonEmployeeType = 'full-time' | 'contractor' | 'intern' | 'candidate';
export type PersonResourceStatus = 'active' | 'on-leave' | 'unavailable' | 'candidate' | 'pipeline' | 'archived';
export type AvailabilityStatus = 'available' | 'partially-available' | 'fully-allocated' | 'unavailable';

export interface PersonResourceRecord {
  id: string;
  name: string;
  displayName: string;
  employeeType: PersonEmployeeType;
  status: PersonResourceStatus;
  primaryRoleId: string;
  secondaryRoleIds: string[];
  department: string;
  skillTags: string[];
  seniorityLevel: string;
  location: string;
  joinDate: string;
  currentUtilization: number;
  availabilityStatus: AvailabilityStatus;
  availableCapacity: number;
  currentProjectIds: string[];
  notes: string;
  isSensitiveProfile: boolean;
}

export type ResourceRoleCategory =
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'qa'
  | 'product'
  | 'project-management'
  | 'design'
  | 'ai'
  | 'data'
  | 'platform'
  | 'operations';

export interface ResourceRoleRecord {
  id: string;
  name: string;
  category: ResourceRoleCategory;
  levelRange: string;
  skillKeywords: string[];
  defaultCapacity: number;
  defaultUtilizationRange: [number, number];
  notes: string;
}

export type AllocationMode = 'fixed' | 'floating' | 'backup' | 'tentative';
export type AllocationStatus = 'active' | 'planned' | 'ending-soon' | 'paused' | 'closed';

export interface ProjectAllocationRecord {
  id: string;
  personId: string;
  projectId: string;
  roleId: string;
  allocationRate: number;
  allocationMode: AllocationMode;
  startDate: string;
  endDate: string;
  phaseIds: string[];
  status: AllocationStatus;
  notes: string;
}

export type HiringDemandStatus = 'pending' | 'recruiting' | 'interviewing' | 'approved' | 'on-hold' | 'closed';
export type HiringUrgency = 'high' | 'medium' | 'low';

export interface HiringDemandRecord {
  id: string;
  roleId: string;
  targetLevel: string;
  demandSourceProjectId: string;
  demandPhaseId: string;
  plannedStartDate: string;
  expectedDuration: string;
  headcount: number;
  urgency: HiringUrgency;
  status: HiringDemandStatus;
  budgetRange: string;
  notes: string;
}

export type VisibilityScope = 'restricted' | 'finance-only' | 'admin-only' | 'masked';

export interface SensitiveCostProfile {
  id: string;
  personId: string;
  salaryBand: string;
  costCenter: string;
  monthlyBaseCost: number;
  variableCostRatio: number;
  currency: string;
  visibilityScope: VisibilityScope;
  isMocked: boolean;
  notes: string;
}
