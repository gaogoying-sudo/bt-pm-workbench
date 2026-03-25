import { projectRepository } from '@/server/repositories/project-repository';
import { taskRepository } from '@/server/repositories/task-repository';
import { personRepository } from '@/server/repositories/person-repository';
import { snapshotRepository } from '@/server/repositories/snapshot-repository';
import { resolveProjectId, getProjectIdentity } from '@/lib/identity/unified-project-registry';
import { buildProjectExecutionAggregates } from '@/lib/task-execution/project-aggregate-selectors';
import { buildProjectProgressSnapshots } from '@/lib/project-progress/project-progress-builders';
import { buildProjectRiskSignals } from '@/lib/project-progress/project-risk-builders';
import { buildResourcePressureSnapshots } from '@/lib/resources/resource-pressure-builders';
import { buildProjectCostComparisonSnapshots } from '@/lib/manpower/comparison-builders';
import { buildVersionGovernanceRecords } from '@/lib/version-governance/version-governance-builders';
import { ProjectDetailSnapshot } from '@/lib/types/project-detail';
import { buildSnapshotContext } from '@/lib/snapshots/snapshot-helpers';

export const projectService = {
  listProjects() {
    const baseProjects = projectRepository.findAllBaseProjects();
    return baseProjects.map((p) => {
      const identity = getProjectIdentity(p.id);
      return {
        ...p,
        canonicalId: identity?.canonicalId ?? p.id,
        displayName: identity?.displayName ?? p.name,
        hasManpowerData: identity?.hasManpowerData ?? false
      };
    });
  },

  getProjectDetail(routeId: string): ProjectDetailSnapshot | null {
    const canonicalId = resolveProjectId(routeId);
    const identity = getProjectIdentity(routeId);
    const baseProject = projectRepository.findBaseProjectById(routeId);
    if (!baseProject && !identity) return null;

    const versionLinks = snapshotRepository.findAllVersionLinks();
    const progressSnapshots = buildProjectProgressSnapshots(versionLinks);
    const progressSnapshot = progressSnapshots.find((s) => s.projectId === canonicalId);
    const riskSignals = buildProjectRiskSignals(canonicalId);
    const resourcePressure = buildResourcePressureSnapshots().find((s) => s.projectId === canonicalId);
    const costSnapshot = buildProjectCostComparisonSnapshots().find((s) => s.projectId === canonicalId);
    const versionLink = versionLinks.find((l) => l.projectId === canonicalId);
    const versionGovernance = buildVersionGovernanceRecords();
    const versionRecord = versionLink
      ? versionGovernance.records.find((r) => r.linkedVersionId === versionLink.linkedVersionId)
      : null;

    return {
      projectId: routeId,
      projectName: identity?.displayName ?? baseProject?.name ?? routeId,
      projectCode: identity?.code ?? baseProject?.code ?? '',
      basicSummary: baseProject?.summary ?? '',
      execution: {
        progress: progressSnapshot?.currentOverallProgress ?? 0,
        status: progressSnapshot?.progressStatus ?? baseProject?.status ?? 'planning',
        currentStage: null,
        blockedTaskCount: progressSnapshot?.blockedTaskCount ?? 0,
        highRiskTaskCount: progressSnapshot?.highRiskTaskCount ?? 0,
        summary: progressSnapshot?.latestSummary ?? 'Not yet linked with execution aggregation.'
      },
      resource: {
        resourcePressureLevel: resourcePressure?.pressureLevel ?? 'low',
        overloadedPeople: resourcePressure?.overloadedPeople ?? 0,
        constrainedPeople: resourcePressure?.constrainedPeople ?? 0,
        summary: resourcePressure?.summary ?? 'Resource pressure not linked yet.'
      },
      cost: {
        plannedCost: costSnapshot?.plannedCost ?? 0,
        actualCost: costSnapshot?.actualCost ?? 0,
        varianceCost: costSnapshot?.varianceCost ?? 0,
        summary: costSnapshot ? 'Cost from unified comparison builder.' : 'No cost snapshot yet.'
      },
      version: {
        versionName: versionLink?.versionName ?? baseProject?.currentVersion ?? null,
        governanceStatus: versionRecord?.governanceStatus ?? null,
        readinessStatus: versionRecord?.releaseReadinessStatus ?? null,
        variance: versionRecord?.variance ?? null,
        summary: versionRecord ? 'Version from governance builder.' : 'No version governance snapshot yet.'
      },
      risk: {
        riskCount: riskSignals.length,
        blockerCount: riskSignals.filter((s) => s.signalType === 'blocked-task').length,
        topSignalTitle: riskSignals[0]?.title ?? null,
        summary: riskSignals[0]?.summary ?? 'No aggregated risk signal.'
      },
      sourceContext: [
        'Project Progress Center',
        'Resource Allocation Layer',
        'Manpower Comparison Layer',
        'Version Governance Center'
      ],
      snapshotContext: buildSnapshotContext({
        notes: identity?.hasManpowerData
          ? `Linked with aggregated snapshots for ${identity.displayName}.`
          : 'Base project data only until more IDs are mapped.'
      })
    };
  },

  getProjectStages(routeId: string) {
    return projectRepository.findStagesByProjectId(routeId);
  }
};
