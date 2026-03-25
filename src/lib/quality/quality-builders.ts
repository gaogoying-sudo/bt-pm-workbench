import { qualityCheckRecords, qualityGateDefinitions } from '@/data/quality/quality-check-records';
import { QualityCheckRecord, ProjectQualitySnapshot, QualityGateDefinition } from '@/lib/types/quality';
import { resolveProjectId } from '@/lib/identity/unified-project-registry';

export function buildProjectQualitySnapshots(): ProjectQualitySnapshot[] {
  const projectGroups = new Map<string, QualityCheckRecord[]>();
  for (const record of qualityCheckRecords) {
    const list = projectGroups.get(record.projectId) ?? [];
    list.push(record);
    projectGroups.set(record.projectId, list);
  }

  return [...projectGroups.entries()].map(([projectId, checks]) => {
    const passed = checks.filter((c) => c.status === 'passed').length;
    const failed = checks.filter((c) => c.status === 'failed').length;
    const pending = checks.filter((c) => c.status === 'pending' || c.status === 'in-review').length;
    const criticalFailures = checks.filter((c) => c.status === 'failed' && c.severity === 'critical').length;
    const total = checks.length;
    const qualityScore = total > 0 ? passed / total : 0;

    return {
      projectId,
      totalChecks: total,
      passedChecks: passed,
      failedChecks: failed,
      pendingChecks: pending,
      criticalFailures,
      qualityScore,
      summary: total === 0
        ? 'No quality checks recorded.'
        : `${passed}/${total} checks passed (${Math.round(qualityScore * 100)}%).`
    };
  });
}

export function buildQualityGateStatus(projectId: string): Array<{
  gate: QualityGateDefinition;
  checksPassed: number;
  checksRequired: number;
  gateStatus: 'passed' | 'blocked' | 'pending';
}> {
  const canonicalId = resolveProjectId(projectId);
  const gates = qualityGateDefinitions.filter((g) => g.projectId === canonicalId);
  const checks = qualityCheckRecords.filter((c) => c.projectId === canonicalId);

  return gates.map((gate) => {
    const relevantChecks = checks.filter((c) => gate.requiredCheckTypes.includes(c.checkType));
    const passed = relevantChecks.filter((c) => c.status === 'passed').length;
    const required = gate.requiredCheckTypes.length;
    const ratio = required > 0 ? passed / required : 0;

    return {
      gate,
      checksPassed: passed,
      checksRequired: required,
      gateStatus: ratio >= gate.passThreshold ? 'passed' : ratio > 0 ? 'pending' : 'blocked'
    };
  });
}
