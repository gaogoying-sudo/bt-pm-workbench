import { PersonResourceRecord } from '@/lib/types/people-resources';
import { TaskActivityRecord, TaskExecutionRecord } from '@/lib/types/task-execution';
import { PersonTaskLoadAggregate } from '@/lib/types/task-execution-aggregation';
import { buildTaskExecutionAggregates } from '@/lib/task-execution/task-aggregate-selectors';
import { MOCK_TODAY, buildLoadRiskLevel, buildPersonLoadSummary } from '@/lib/task-execution/summary-builders';

export function buildPersonTaskLoadAggregates(
  people: PersonResourceRecord[],
  tasks: TaskExecutionRecord[],
  activities: TaskActivityRecord[],
  today: string = MOCK_TODAY
): PersonTaskLoadAggregate[] {
  const taskAggregates = buildTaskExecutionAggregates(tasks, activities, today);

  return people.map((person) => {
    const ownedTasks = tasks.filter((task) => task.ownerPersonId === person.id);
    const collaboratorTasks = tasks.filter(
      (task) => task.ownerPersonId !== person.id && task.collaboratorPersonIds.includes(person.id)
    );
    const allRelatedTasks = [...ownedTasks, ...collaboratorTasks];
    const ownedAggregates = taskAggregates.filter((aggregate) => ownedTasks.some((task) => task.id === aggregate.taskId));
    const relatedProjectIds = [...new Set(allRelatedTasks.map((task) => task.projectId))];

    // v0 rule:
    // planned/actual work days for person load aggregate use owned tasks only.
    // collaboratorTaskCount is kept separately to avoid double counting shared work in aggregate totals.
    const highPriorityTaskCount = allRelatedTasks.filter((task) => task.priority === 'p0' || task.priority === 'p1').length;
    const blockedTaskCount = allRelatedTasks.filter(
      (task) => task.status === 'blocked' || task.blockerSummary !== 'No active blocker.'
    ).length;

    const loadRiskLevel = buildLoadRiskLevel({
      blockedTaskCount,
      highPriorityTaskCount,
      utilizationReference: person.currentUtilization,
      availabilityReference: person.availabilityStatus
    });

    return {
      personId: person.id,
      ownedTaskCount: ownedTasks.length,
      collaboratorTaskCount: collaboratorTasks.length,
      inProgressTaskCount: allRelatedTasks.filter((task) => task.status === 'in-progress' || task.status === 'ready').length,
      blockedTaskCount,
      highPriorityTaskCount,
      plannedWorkDays: ownedAggregates.reduce((sum, aggregate) => sum + aggregate.plannedWorkDays, 0),
      actualWorkDays: ownedAggregates.reduce((sum, aggregate) => sum + aggregate.actualWorkDays, 0),
      activitySpentWorkDays: ownedAggregates.reduce((sum, aggregate) => sum + aggregate.activitySpentWorkDays, 0),
      utilizationReference: person.currentUtilization,
      availabilityReference: person.availabilityStatus,
      relatedProjectIds,
      loadRiskLevel,
      summaryText: buildPersonLoadSummary({
        ownedTaskCount: ownedTasks.length,
        blockedTaskCount,
        highPriorityTaskCount,
        loadRiskLevel
      })
    };
  });
}
