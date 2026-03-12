import { ProjectStageTaskLink } from '@/lib/types/task-execution';

export const projectStageTaskLinks: ProjectStageTaskLink[] = [
  { id: 'pstl-001', projectId: 'project-pm-workbench', stageId: 'stage-pmw-2', taskId: 'task-pmw-epic-ui', sequence: 1, isMilestoneRelated: true, weight: 0.2, notes: 'Design-to-build bridge epic.' },
  { id: 'pstl-002', projectId: 'project-pm-workbench', stageId: 'stage-pmw-2', taskId: 'task-pmw-design-system', sequence: 2, isMilestoneRelated: false, weight: 0.12, notes: 'Supports shared page structure.' },
  { id: 'pstl-003', projectId: 'project-pm-workbench', stageId: 'stage-pmw-3', taskId: 'task-pmw-resource-page', sequence: 3, isMilestoneRelated: false, weight: 0.18, notes: 'People and resource center delivery.' },
  { id: 'pstl-004', projectId: 'project-pm-workbench', stageId: 'stage-pmw-3', taskId: 'task-pmw-task-center', sequence: 4, isMilestoneRelated: true, weight: 0.2, notes: 'Task execution center delivery chain.' },
  { id: 'pstl-005', projectId: 'project-ops-console', stageId: 'stage-ops-3', taskId: 'task-ops-api-hardening', sequence: 1, isMilestoneRelated: true, weight: 0.25, notes: 'Precedes integration stage.' },
  { id: 'pstl-006', projectId: 'project-ops-console', stageId: 'stage-ops-4', taskId: 'task-ops-epic-release', sequence: 2, isMilestoneRelated: true, weight: 0.35, notes: 'Main integration stabilization stream.' },
  { id: 'pstl-007', projectId: 'project-ops-console', stageId: 'stage-ops-4', taskId: 'task-ops-regression', sequence: 3, isMilestoneRelated: false, weight: 0.16, notes: 'QA release support.' },
  { id: 'pstl-008', projectId: 'project-ai-copilot', stageId: 'stage-copilot-2', taskId: 'task-ai-eval-framework', sequence: 1, isMilestoneRelated: true, weight: 0.18, notes: 'Enables pilot implementation.' },
  { id: 'pstl-009', projectId: 'project-ai-copilot', stageId: 'stage-copilot-3', taskId: 'task-ai-epic-pilot', sequence: 2, isMilestoneRelated: true, weight: 0.38, notes: 'Primary pilot execution stream.' },
  { id: 'pstl-010', projectId: 'project-ai-copilot', stageId: 'stage-copilot-3', taskId: 'task-ai-ui-shell', sequence: 3, isMilestoneRelated: false, weight: 0.1, notes: 'Operator shell delivery.' },
  { id: 'pstl-011', projectId: 'project-data-hub', stageId: 'stage-data-3', taskId: 'task-data-metrics', sequence: 1, isMilestoneRelated: false, weight: 0.22, notes: 'Paused metrics stream.' }
];
