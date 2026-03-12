import { TaskDependencyRecord } from '@/lib/types/task-execution';

export const taskDependencies: TaskDependencyRecord[] = [
  { id: 'dep-001', fromTaskId: 'task-pmw-design-system', toTaskId: 'task-pmw-epic-ui', dependencyType: 'finish-to-start', status: 'active', notes: 'Workbench epic needs shared design pattern closure.' },
  { id: 'dep-002', fromTaskId: 'task-pmw-design-system', toTaskId: 'task-pmw-resource-page', dependencyType: 'finish-to-start', status: 'active', notes: 'Resource page waits on common layout decision.' },
  { id: 'dep-003', fromTaskId: 'task-pmw-resource-page', toTaskId: 'task-pmw-task-center', dependencyType: 'soft-link', status: 'pending', notes: 'Task center reuses resource context and selectors.' },
  { id: 'dep-004', fromTaskId: 'task-ops-api-hardening', toTaskId: 'task-ops-epic-release', dependencyType: 'finish-to-start', status: 'active', notes: 'Integration stabilization blocked by API hardening.' },
  { id: 'dep-005', fromTaskId: 'task-ops-api-hardening', toTaskId: 'task-ops-regression', dependencyType: 'finish-to-start', status: 'active', notes: 'Regression package depends on stable interfaces.' },
  { id: 'dep-006', fromTaskId: 'task-ai-eval-framework', toTaskId: 'task-ai-epic-pilot', dependencyType: 'finish-to-start', status: 'resolved', notes: 'Evaluation framework is complete and unblocked.' },
  { id: 'dep-007', fromTaskId: 'task-ai-eval-framework', toTaskId: 'task-ai-ui-shell', dependencyType: 'soft-link', status: 'active', notes: 'UI shell needs final evaluation outputs to settle flows.' }
];
