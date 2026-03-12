import { changes } from '@/data/changes';
import { documentRecords } from '@/data/docs';
import { projects } from '@/data/projects';
import { tasks } from '@/data/tasks';
import { versions } from '@/data/versions';

export const dashboardStats = {
  totalProjects: projects.length,
  activeProjects: projects.filter((item) => item.status === 'active').length,
  sealedProjects: projects.filter((item) => item.isSealed).length,
  highPriorityTasks: tasks.filter((item) => item.priority === 'high' || item.priority === 'critical').length,
  pendingConfirmations: tasks.filter((item) => item.status === 'pending-confirmation').length
};

export const recentVersions = versions.slice(0, 5);
export const recentDocuments = documentRecords.slice(0, 5);
export const recentChanges = changes.slice(0, 5);
