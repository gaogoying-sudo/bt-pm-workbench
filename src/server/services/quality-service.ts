import { qualityRepository } from '@/server/repositories/quality-repository';
import { ProjectQualitySnapshot, QualityCheckRecord } from '@/lib/types/quality';
import { resolveProjectId } from '@/lib/identity/unified-project-registry';

export const qualityService = {
  listChecksByProject(projectId: string): QualityCheckRecord[] {
    return qualityRepository.findChecksByProjectId(projectId);
  },

  listAllChecks(): QualityCheckRecord[] {
    return qualityRepository.findAllChecks();
  },

  getProjectQualitySnapshot(projectId: string): ProjectQualitySnapshot {
    const canonicalId = resolveProjectId(projectId);
    const checks = qualityRepository.findChecksByProjectId(canonicalId);
    const passed = checks.filter((c) => c.status === 'passed').length;
    const failed = checks.filter((c) => c.status === 'failed').length;
    const pending = checks.filter((c) => c.status === 'pending' || c.status === 'in-review').length;
    const criticalFailures = checks.filter((c) => c.status === 'failed' && c.severity === 'critical').length;
    const total = checks.length;
    const qualityScore = total > 0 ? passed / total : 0;

    return {
      projectId: canonicalId,
      totalChecks: total,
      passedChecks: passed,
      failedChecks: failed,
      pendingChecks: pending,
      criticalFailures,
      qualityScore,
      summary: total === 0
        ? 'No quality checks recorded yet.'
        : `${passed}/${total} checks passed (${Math.round(qualityScore * 100)}% pass rate).`
    };
  },

  getGateDefinitions(projectId: string) {
    return qualityRepository.findGatesByProjectId(projectId);
  }
};
