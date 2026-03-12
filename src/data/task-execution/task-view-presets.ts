import { TaskViewPreset } from '@/lib/types/task-execution';

export const taskViewPresets: TaskViewPreset[] = [
  { id: 'tvp-001', name: 'Workbench delivery', viewType: 'project', projectIds: ['project-pm-workbench'], roleIds: ['res-role-frontend', 'res-role-product'], personIds: ['person-alice', 'person-dylan'], statusFilter: ['ready', 'in-progress', 'at-risk'], priorityFilter: ['p0', 'p1'], stageFilter: ['stage-pmw-2', 'stage-pmw-3'], notes: 'Focus on current workbench execution stream.' },
  { id: 'tvp-002', name: 'Blocked and risk', viewType: 'status', projectIds: ['project-ops-console', 'project-ai-copilot'], roleIds: [], personIds: [], statusFilter: ['blocked', 'at-risk'], priorityFilter: ['p0', 'p1'], stageFilter: [], notes: 'Used to surface blocker and high-risk tasks first.' },
  { id: 'tvp-003', name: 'Owner load', viewType: 'person', projectIds: [], roleIds: [], personIds: ['person-alice', 'person-ben', 'person-felix'], statusFilter: ['ready', 'in-progress', 'blocked'], priorityFilter: ['p0', 'p1', 'p2'], stageFilter: [], notes: 'Shows execution load for key owners.' },
  { id: 'tvp-004', name: 'Stage execution', viewType: 'stage', projectIds: ['project-ops-console'], roleIds: ['res-role-backend', 'res-role-qa'], personIds: [], statusFilter: ['in-progress', 'blocked', 'done'], priorityFilter: ['p0', 'p1'], stageFilter: ['stage-ops-3', 'stage-ops-4'], notes: 'Tracks stage-level execution and readiness.' }
];
