import { ProjectRiskSignal } from '@/lib/types/project-progress';
import { VersionRiskSignal } from '@/lib/types/version-governance';

export function buildVersionRiskSignals(
  linkedVersionIds: string[],
  versionProjectLinks: Array<{ linkedVersionId: string; projectId: string }>,
  projectRiskSignals: ProjectRiskSignal[]
): VersionRiskSignal[] {
  const signals: VersionRiskSignal[] = [];

  linkedVersionIds.forEach((linkedVersionId) => {
    const relatedProjects = versionProjectLinks.filter((link) => link.linkedVersionId === linkedVersionId).map((link) => link.projectId);
    const relatedSignals = projectRiskSignals.filter((signal) => relatedProjects.includes(signal.projectId));

    if (relatedSignals.length > 0) {
      signals.push({
        id: `vrs-${linkedVersionId}-cluster`,
        linkedVersionId,
        signalType: 'risk-cluster',
        severity: relatedSignals.some((signal) => signal.severity === 'high') ? 'high' : 'medium',
        title: '版本风险聚集 / Version Risk Cluster',
        summary: `${relatedSignals.length} 个项目级风险信号正在影响当前版本治理 / Project-level risk signals are affecting this version.`,
        relatedProjectIds: relatedProjects,
        sourceType: 'project-risk-signal',
        suggestedAction: '按项目和阶段拆分风险治理清单 / Break mitigation down by project and stage.',
        status: 'open'
      });
    }
  });

  return signals;
}
