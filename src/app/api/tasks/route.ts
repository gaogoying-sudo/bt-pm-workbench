import { NextRequest } from 'next/server';
import { taskService } from '@/server/services/task-service';
import { success, toJsonResponse } from '@/server/contracts/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId') ?? undefined;
  const stageId = searchParams.get('stageId') ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const ownerId = searchParams.get('ownerId') ?? undefined;
  const snapshotDate = searchParams.get('snapshotDate') ?? undefined;

  const tasks = taskService.listTasks({ projectId, stageId, status, ownerId });
  const aggregates = taskService.getTaskAggregates(snapshotDate);

  return toJsonResponse(success({
    tasks,
    aggregates,
    meta: { snapshotDate: snapshotDate ?? new Date().toISOString().slice(0, 10) }
  }, { total: tasks.length, source: 'task-service' }));
}
