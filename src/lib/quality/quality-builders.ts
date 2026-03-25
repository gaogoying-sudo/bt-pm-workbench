import {
  deliverableQualityRecords,
  qualityCheckRecords,
  qualityGateDefinitions,
  qualityIssueRecords
} from '@/data/quality/quality-check-records';
import {
  ProjectQualitySnapshot,
  QualityCheckRecord,
  QualityGateDefinition,
  QualitySummaryRecord,
  StageQualitySnapshot,
  VersionQualityGateRecord
} from '@/lib/types/quality';
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

export function buildStageQualitySnapshots(projectId: string): StageQualitySnapshot[] {
  const canonicalId = resolveProjectId(projectId);
  const checks = qualityCheckRecords.filter((c) => c.projectId === canonicalId && c.stageId);
  const stageGroups = new Map<string, QualityCheckRecord[]>();
  for (const check of checks) {
    const stageId = check.stageId!;
    const list = stageGroups.get(stageId) ?? [];
    list.push(check);
    stageGroups.set(stageId, list);
  }

  return [...stageGroups.entries()].map(([stageId, stageChecks]) => {
    const passed = stageChecks.filter((c) => c.status === 'passed').length;
    const failed = stageChecks.filter((c) => c.status === 'failed').length;
    const pending = stageChecks.filter((c) => c.status === 'pending' || c.status === 'in-review').length;
    const total = stageChecks.length;
    const qualityScore = total > 0 ? passed / total : 0;
    return {
      projectId: canonicalId,
      stageId,
      totalChecks: total,
      passedChecks: passed,
      failedChecks: failed,
      pendingChecks: pending,
      qualityScore,
      summary: total === 0 ? 'No checks.' : `${passed}/${total} passed.`
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

export function buildVersionQualityGateRecords(): VersionQualityGateRecord[] {
  // Lightweight mapping: infer version gate status from deliverables + issues for now.
  const versionIds = [...new Set(deliverableQualityRecords.map((d) => d.linkedVersionId).filter(Boolean))] as string[];

  return versionIds.map((linkedVersionId) => {
    const deliverables = deliverableQualityRecords.filter((d) => d.linkedVersionId === linkedVersionId);
    const issues = qualityIssueRecords.filter((i) => i.linkedVersionId === linkedVersionId && i.status !== 'closed');

    const passed = deliverables.filter((d) => d.reviewStatus === 'passed').length;
    const total = deliverables.length;
    const score = total > 0 ? passed / total : 0;
    const blocked = issues.some((i) => i.severity === 'critical' || i.severity === 'major');

    return {
      id: `vqg-${linkedVersionId}`,
      linkedVersionId,
      gateName: 'Release Quality Gate',
      gateStatus: blocked ? 'blocked' : score >= 0.8 ? 'passed' : 'pending',
      qualityScore: score,
      blockingIssues: issues.length,
      notes: total === 0 ? 'No deliverables linked yet.' : `${passed}/${total} deliverables passed.`
    };
  });
}

export function buildQualitySummary(scope: QualitySummaryRecord['scope'], scopeId: string | null): QualitySummaryRecord {
  const checks = scope === 'portfolio'
    ? qualityCheckRecords
    : scope === 'project'
      ? qualityCheckRecords.filter((c) => c.projectId === resolveProjectId(scopeId ?? ''))
      : [];

  const passed = checks.filter((c) => c.status === 'passed').length;
  const total = checks.length;
  const score = total > 0 ? passed / total : 0;

  const gates = scope === 'portfolio'
    ? buildVersionQualityGateRecords()
    : [];

  const blockingGates = gates.filter((g) => g.gateStatus === 'blocked').length;
  const openIssues = scope === 'portfolio'
    ? qualityIssueRecords.filter((i) => i.status !== 'closed').length
    : 0;

  return {
    scope,
    scopeId,
    totalChecks: total,
    qualityScore: score,
    blockingGates,
    openIssues,
    summary: total === 0 ? 'No quality data.' : `Quality score ${Math.round(score * 100)}%.`
  };
}
