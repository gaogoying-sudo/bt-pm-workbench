import { buildProjectDetailSnapshot } from '@/lib/project-detail/project-detail-builders';
import { buildProjectExecutionAggregates } from '@/lib/task-execution/project-aggregate-selectors';
import { projectStageTaskLinks } from '@/data/task-execution/project-stage-task-links';
import { taskExecutionRecords } from '@/data/task-execution/task-execution-records';
import { taskActivityRecords } from '@/data/task-execution/task-activity-records';
import { buildProjectProgressSnapshots } from '@/lib/project-progress/project-progress-builders';
import { projectVersionLinkRecords } from '@/data/project-progress/project-version-link-records';
import { resolveProjectId } from '@/lib/identity/unified-project-registry';
import { buildVersionGovernanceRecords } from '@/lib/version-governance/version-governance-builders';
import { buildResourcePressureSnapshots } from '@/lib/resources/resource-pressure-builders';
import { buildProjectCostComparisonSnapshots } from '@/lib/manpower/comparison-builders';
import {
  buildDeliveryRiskSnapshots,
  buildExecutiveOverviewSnapshot,
  buildProjectHealthSnapshots,
  buildResourceHealthSnapshot,
  buildVersionHealthSnapshots
} from '@/lib/executive-dashboard/dashboard-builders';
import { inputEventRepository } from '@/server/repositories/input-event-repository';
import { buildProjectExternalReadinessSummaries } from '@/lib/integrations/readiness-builders';
import { projectService } from '@/server/services/project-service';
import type { ProjectDetailSnapshot } from '@/lib/types/project-detail';
import type { ProjectExecutionAggregate } from '@/lib/types/task-execution-aggregation';
import type { ProjectProgressSnapshot } from '@/lib/types/project-progress';
import type { ExecutiveOverviewSnapshot } from '@/lib/types/executive-dashboard';

/** Formal read-model keys (Pack 2) — consumed by pages instead of ad-hoc page-local builders. */
export type ReadModelKey =
  | 'project_list_snapshot'
  | 'project_detail_snapshot'
  | 'project_execution_snapshot'
  | 'project_progress_snapshot'
  | 'version_governance_snapshot'
  | 'resource_manpower_snapshot'
  | 'executive_portfolio_snapshot'
  | 'input_inbox_snapshot'
  | 'readiness_summary_snapshot';

export interface ProjectListReadModel {
  readModelKey: 'project_list_snapshot';
  projects: ReturnType<typeof projectService.listProjects>;
  generatedAt: string;
}

export interface ProjectExecutionReadModel {
  readModelKey: 'project_execution_snapshot';
  routeId: string;
  canonicalProjectId: string;
  aggregate: ProjectExecutionAggregate | null;
}

export interface ProjectProgressReadModel {
  readModelKey: 'project_progress_snapshot';
  routeId: string;
  canonicalProjectId: string;
  snapshot: ProjectProgressSnapshot | null;
}

export interface VersionGovernanceReadModel {
  readModelKey: 'version_governance_snapshot';
  canonicalProjectId: string;
  linkedVersionIds: string[];
  governanceRecords: ReturnType<typeof buildVersionGovernanceRecords>['records'];
}

export interface ResourceManpowerReadModel {
  readModelKey: 'resource_manpower_snapshot';
  canonicalProjectId: string;
  resourcePressure: ReturnType<typeof buildResourcePressureSnapshots>[number] | null;
  costComparison: ReturnType<typeof buildProjectCostComparisonSnapshots>[number] | null;
}

export interface ExecutivePortfolioReadModel {
  readModelKey: 'executive_portfolio_snapshot';
  overview: ExecutiveOverviewSnapshot;
  projectHealth: ReturnType<typeof buildProjectHealthSnapshots>;
  resourceHealth: ReturnType<typeof buildResourceHealthSnapshot>;
  versionHealth: ReturnType<typeof buildVersionHealthSnapshots>;
  deliveryRisks: ReturnType<typeof buildDeliveryRiskSnapshots>;
  generatedAt: string;
}

export interface InputInboxReadModel {
  readModelKey: 'input_inbox_snapshot';
  rawCount: number;
  draftPendingCount: number;
  confirmedCount: number;
  generatedAt: string;
}

export interface ReadinessSummaryReadModel {
  readModelKey: 'readiness_summary_snapshot';
  summaries: ReturnType<typeof buildProjectExternalReadinessSummaries>;
  forProject: ReturnType<typeof buildProjectExternalReadinessSummaries>[number] | null;
}

/**
 * Single entry for Pack 2 page consumption: list/detail/execution/progress/version/resources/executive/inbox/readiness.
 */
export const readModelService = {
  getProjectListSnapshot(): ProjectListReadModel {
    return {
      readModelKey: 'project_list_snapshot',
      projects: projectService.listProjects(),
      generatedAt: new Date().toISOString()
    };
  },

  getProjectDetailSnapshot(routeId: string): ProjectDetailSnapshot | null {
    return buildProjectDetailSnapshot(routeId);
  },

  getProjectExecutionSnapshot(routeId: string): ProjectExecutionReadModel {
    const canonicalProjectId = resolveProjectId(routeId);
    const aggregates = buildProjectExecutionAggregates(
      projectStageTaskLinks,
      taskExecutionRecords,
      taskActivityRecords
    );
    return {
      readModelKey: 'project_execution_snapshot',
      routeId,
      canonicalProjectId,
      aggregate: aggregates.find((a) => a.projectId === canonicalProjectId) ?? null
    };
  },

  getProjectProgressSnapshot(routeId: string): ProjectProgressReadModel {
    const canonicalProjectId = resolveProjectId(routeId);
    const snapshots = buildProjectProgressSnapshots(projectVersionLinkRecords);
    return {
      readModelKey: 'project_progress_snapshot',
      routeId,
      canonicalProjectId,
      snapshot: snapshots.find((s) => s.projectId === canonicalProjectId) ?? null
    };
  },

  getVersionGovernanceSnapshot(routeId: string): VersionGovernanceReadModel {
    const canonicalProjectId = resolveProjectId(routeId);
    const links = projectVersionLinkRecords.filter((l) => l.projectId === canonicalProjectId);
    const linkedVersionIds = links.map((l) => l.linkedVersionId);
    const pack = buildVersionGovernanceRecords();
    return {
      readModelKey: 'version_governance_snapshot',
      canonicalProjectId,
      linkedVersionIds,
      governanceRecords: pack.records.filter((r) => linkedVersionIds.includes(r.linkedVersionId))
    };
  },

  getResourceManpowerSnapshot(routeId: string): ResourceManpowerReadModel {
    const canonicalProjectId = resolveProjectId(routeId);
    const pressure = buildResourcePressureSnapshots().find((s) => s.projectId === canonicalProjectId) ?? null;
    const cost = buildProjectCostComparisonSnapshots().find((s) => s.projectId === canonicalProjectId) ?? null;
    return {
      readModelKey: 'resource_manpower_snapshot',
      canonicalProjectId,
      resourcePressure: pressure,
      costComparison: cost
    };
  },

  getExecutivePortfolioSnapshot(): ExecutivePortfolioReadModel {
    return {
      readModelKey: 'executive_portfolio_snapshot',
      overview: buildExecutiveOverviewSnapshot(),
      projectHealth: buildProjectHealthSnapshots(),
      resourceHealth: buildResourceHealthSnapshot(),
      versionHealth: buildVersionHealthSnapshots(),
      deliveryRisks: buildDeliveryRiskSnapshots(),
      generatedAt: new Date().toISOString()
    };
  },

  getInputInboxSnapshot(): InputInboxReadModel {
    const drafts = inputEventRepository.listDrafts();
    return {
      readModelKey: 'input_inbox_snapshot',
      rawCount: inputEventRepository.listRaw().length,
      draftPendingCount: drafts.filter((d) =>
        ['parsed', 'draft', 'awaiting-confirmation'].includes(d.status)
      ).length,
      confirmedCount: inputEventRepository.listConfirmed().length,
      generatedAt: new Date().toISOString()
    };
  },

  getReadinessSummarySnapshot(routeId?: string): ReadinessSummaryReadModel {
    const summaries = buildProjectExternalReadinessSummaries();
    const canonical = routeId ? resolveProjectId(routeId) : null;
    return {
      readModelKey: 'readiness_summary_snapshot',
      summaries,
      forProject: canonical ? summaries.find((s) => s.projectId === canonical) ?? null : null
    };
  }
};
