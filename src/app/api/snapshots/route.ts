import { NextRequest } from 'next/server';
import { snapshotService } from '@/server/services/snapshot-service';
import { taskService } from '@/server/services/task-service';
import { success, toJsonResponse } from '@/server/contracts/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const snapshotDate = searchParams.get('snapshotDate') ?? undefined;
  const baselineDate = searchParams.get('baselineDate') ?? undefined;
  const compareDate = searchParams.get('compareDate') ?? undefined;

  const context = snapshotService.resolveSnapshotContext({ snapshotDate, baselineDate, compareDate });
  const projectAggregates = taskService.getProjectAggregates(context.snapshotDate);
  const stageAggregates = taskService.getStageAggregates(context.snapshotDate);

  return toJsonResponse(success({
    context,
    projectAggregates,
    stageAggregates
  }, { snapshotDate: context.snapshotDate, source: 'snapshot-service' }));
}
