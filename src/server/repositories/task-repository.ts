import { taskExecutionRecords } from '@/data/task-execution/task-execution-records';
import { taskActivityRecords } from '@/data/task-execution/task-activity-records';
import { taskDependencies } from '@/data/task-execution/task-dependencies';
import { projectStageTaskLinks } from '@/data/task-execution/project-stage-task-links';
import { taskViewPresets } from '@/data/task-execution/task-view-presets';
import { TaskExecutionRecord, TaskActivityRecord, TaskDependencyRecord, ProjectStageTaskLink, TaskViewPreset } from '@/lib/types/task-execution';
import { resolveProjectId } from '@/lib/identity/unified-project-registry';

export const taskRepository = {
  findAllTasks(): TaskExecutionRecord[] {
    return taskExecutionRecords;
  },

  findTaskById(id: string): TaskExecutionRecord | null {
    return taskExecutionRecords.find((t) => t.id === id) ?? null;
  },

  findTasksByProjectId(projectId: string): TaskExecutionRecord[] {
    const canonicalId = resolveProjectId(projectId);
    return taskExecutionRecords.filter((t) => t.projectId === canonicalId);
  },

  findAllActivities(): TaskActivityRecord[] {
    return taskActivityRecords;
  },

  findActivitiesByTaskId(taskId: string): TaskActivityRecord[] {
    return taskActivityRecords.filter((a) => a.taskId === taskId);
  },

  findAllDependencies(): TaskDependencyRecord[] {
    return taskDependencies;
  },

  findAllStageTaskLinks(): ProjectStageTaskLink[] {
    return projectStageTaskLinks;
  },

  findStageTaskLinksByProjectId(projectId: string): ProjectStageTaskLink[] {
    const canonicalId = resolveProjectId(projectId);
    return projectStageTaskLinks.filter((l) => l.projectId === canonicalId);
  },

  findAllViewPresets(): TaskViewPreset[] {
    return taskViewPresets;
  }
};
