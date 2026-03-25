import { taskRepository } from '@/server/repositories/task-repository';
import { personRepository } from '@/server/repositories/person-repository';
import { buildTaskExecutionAggregates } from '@/lib/task-execution/task-aggregate-selectors';
import { buildStageExecutionAggregates } from '@/lib/task-execution/stage-aggregate-selectors';
import { buildProjectExecutionAggregates } from '@/lib/task-execution/project-aggregate-selectors';
import { buildPersonTaskLoadAggregates } from '@/lib/task-execution/person-load-selectors';
import { buildAllocationConsumptionAggregates } from '@/lib/task-execution/allocation-consumption-selectors';
import { buildTaskExecutionWritebackRecords } from '@/lib/task-execution/writeback-mappers';

export const taskService = {
  listTasks(filters?: { projectId?: string; stageId?: string; status?: string; ownerId?: string }) {
    let tasks = taskRepository.findAllTasks();
    if (filters?.projectId) tasks = tasks.filter((t) => t.projectId === filters.projectId);
    if (filters?.stageId) tasks = tasks.filter((t) => t.stageId === filters.stageId);
    if (filters?.status) tasks = tasks.filter((t) => t.status === filters.status);
    if (filters?.ownerId) tasks = tasks.filter((t) => t.ownerPersonId === filters.ownerId);
    return tasks;
  },

  getTaskById(id: string) {
    return taskRepository.findTaskById(id);
  },

  getTaskAggregates(snapshotDate?: string) {
    const tasks = taskRepository.findAllTasks();
    const activities = taskRepository.findAllActivities();
    return buildTaskExecutionAggregates(tasks, activities, snapshotDate);
  },

  getStageAggregates(snapshotDate?: string) {
    const links = taskRepository.findAllStageTaskLinks();
    const tasks = taskRepository.findAllTasks();
    const activities = taskRepository.findAllActivities();
    return buildStageExecutionAggregates(links, tasks, activities, snapshotDate);
  },

  getProjectAggregates(snapshotDate?: string) {
    const links = taskRepository.findAllStageTaskLinks();
    const tasks = taskRepository.findAllTasks();
    const activities = taskRepository.findAllActivities();
    return buildProjectExecutionAggregates(links, tasks, activities, snapshotDate);
  },

  getPersonLoads(snapshotDate?: string) {
    const people = personRepository.findAllPersons();
    const tasks = taskRepository.findAllTasks();
    const activities = taskRepository.findAllActivities();
    return buildPersonTaskLoadAggregates(people, tasks, activities, snapshotDate);
  },

  getAllocationConsumption(snapshotDate?: string) {
    const allocations = personRepository.findAllAllocations();
    const tasks = taskRepository.findAllTasks();
    const activities = taskRepository.findAllActivities();
    return buildAllocationConsumptionAggregates(allocations, tasks, activities, snapshotDate);
  },

  getWritebackRecords(snapshotDate?: string) {
    return buildTaskExecutionWritebackRecords(
      taskRepository.findAllTasks(),
      taskRepository.findAllActivities(),
      taskRepository.findAllStageTaskLinks(),
      personRepository.findAllAllocations(),
      snapshotDate
    );
  }
};
