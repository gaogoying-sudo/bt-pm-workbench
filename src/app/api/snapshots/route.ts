import { NextRequest } from 'next/server';
import { snapshotService } from '@/server/services/snapshot-service';
import { taskService } from '@/server/services/task-service';
import { success, toJsonResponse } from '@/server/contracts/response';
import {
  buildManpowerCostTimelinePoints,
  buildProjectProgressTimelinePoints,
  buildResourcePressureTimelinePoints,
  buildVersionGovernanceTimelinePoints
} from '@/lib/snapshots/timeline-builders';
import {
  compareManpowerCost,
  compareProjectProgress,
  compareResourcePressure,
  compareVersionGovernance
} from '@/lib/snapshots/comparison-builders';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const snapshotDate = searchParams.get('snapshotDate') ?? undefined;
  const baselineDate = searchParams.get('baselineDate') ?? undefined;
  const compareDate = searchParams.get('compareDate') ?? undefined;

  const context = snapshotService.resolveSnapshotContext({ snapshotDate, baselineDate, compareDate });
  const projectAggregates = taskService.getProjectAggregates(context.snapshotDate);
  const stageAggregates = taskService.getStageAggregates(context.snapshotDate);

  const points = {
    projectProgress: buildProjectProgressTimelinePoints(context.snapshotDate),
    versionGovernance: buildVersionGovernanceTimelinePoints(context.snapshotDate),
    resourcePressure: buildResourcePressureTimelinePoints(context.snapshotDate),
    manpowerCost: buildManpowerCostTimelinePoints(context.snapshotDate)
  };

  const baselinePoints = context.baselineDate
    ? {
        projectProgress: buildProjectProgressTimelinePoints(context.baselineDate),
        versionGovernance: buildVersionGovernanceTimelinePoints(context.baselineDate),
        resourcePressure: buildResourcePressureTimelinePoints(context.baselineDate),
        manpowerCost: buildManpowerCostTimelinePoints(context.baselineDate)
      }
    : null;

  const comparePoints = context.compareDate
    ? {
        projectProgress: buildProjectProgressTimelinePoints(context.compareDate),
        versionGovernance: buildVersionGovernanceTimelinePoints(context.compareDate),
        resourcePressure: buildResourcePressureTimelinePoints(context.compareDate),
        manpowerCost: buildManpowerCostTimelinePoints(context.compareDate)
      }
    : null;

  const comparisons = {
    projectProgress: points.projectProgress.map((p) =>
      compareProjectProgress(
        p.projectId,
        p,
        baselinePoints?.projectProgress.find((b) => b.projectId === p.projectId) ?? null,
        comparePoints?.projectProgress.find((c) => c.projectId === p.projectId) ?? null
      )
    ),
    versionGovernance: points.versionGovernance.map((p) =>
      compareVersionGovernance(
        p.linkedVersionId,
        p,
        baselinePoints?.versionGovernance.find((b) => b.linkedVersionId === p.linkedVersionId) ?? null,
        comparePoints?.versionGovernance.find((c) => c.linkedVersionId === p.linkedVersionId) ?? null
      )
    ),
    resourcePressure: points.resourcePressure.map((p) =>
      compareResourcePressure(
        p.projectId,
        p,
        baselinePoints?.resourcePressure.find((b) => b.projectId === p.projectId) ?? null,
        comparePoints?.resourcePressure.find((c) => c.projectId === p.projectId) ?? null
      )
    ),
    manpowerCost: points.manpowerCost.map((p) =>
      compareManpowerCost(
        p.projectId,
        p,
        baselinePoints?.manpowerCost.find((b) => b.projectId === p.projectId) ?? null,
        comparePoints?.manpowerCost.find((c) => c.projectId === p.projectId) ?? null
      )
    )
  };

  return toJsonResponse(success({
    context,
    projectAggregates,
    stageAggregates,
    timeline: {
      current: points,
      baseline: baselinePoints,
      compare: comparePoints
    },
    comparisons
  }, { snapshotDate: context.snapshotDate, source: 'snapshot-service' }));
}
