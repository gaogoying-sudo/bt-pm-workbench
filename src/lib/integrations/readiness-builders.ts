import { buildProjectProgressSnapshots } from '@/lib/project-progress/project-progress-builders';
import { projectVersionLinkRecords } from '@/data/project-progress/project-version-link-records';
import { buildProjectRiskSignals } from '@/lib/project-progress/project-risk-builders';
import { buildProjectQualitySnapshots } from '@/lib/quality/quality-builders';
import { buildVersionQualityGateRecords } from '@/lib/quality/quality-builders';
import { buildVersionGovernanceRecords } from '@/lib/version-governance/version-governance-builders';
import {
  DeliveryReadinessRecord,
  ProjectExternalReadinessSummary,
  QualityGateExportSummary,
  ResourceReadinessRecord,
  RiskBlockerSummary,
  SupplyReadinessRecord,
  VersionReleaseReadinessRecord
} from '@/lib/integrations/external-ready-types';
import { dataExchangeRepository } from '@/server/repositories/data-exchange-repository';
import { buildSnapshotContext } from '@/lib/snapshots/snapshot-helpers';

function levelFromFlags(flags: { blocked?: boolean; ready?: boolean; partial?: boolean }) {
  if (flags.blocked) return 'blocked' as const;
  if (flags.ready) return 'ready' as const;
  if (flags.partial) return 'partially-ready' as const;
  return 'not-ready' as const;
}

export function buildRiskBlockerSummaries(): RiskBlockerSummary[] {
  const progress = buildProjectProgressSnapshots(projectVersionLinkRecords);
  return progress.map((p) => {
    const signals = buildProjectRiskSignals(p.projectId);
    const blockers = signals.filter((s) => s.severity === 'high');
    return {
      projectId: p.projectId,
      blockerCount: blockers.length,
      topBlockerTitle: blockers[0]?.title ?? null,
      notes: blockers.length > 0 ? 'High severity risk signals exist.' : 'No high severity blockers.'
    };
  });
}

export function buildQualityGateSummaries(): QualityGateExportSummary[] {
  const qs = buildProjectQualitySnapshots();
  return qs.map((q) => ({
    projectId: q.projectId,
    qualityScore: q.qualityScore,
    criticalFailures: q.criticalFailures,
    notes: q.criticalFailures > 0 ? 'Critical quality failures present.' : 'No critical failures.'
  }));
}

export function buildSupplyReadinessRecords(): SupplyReadinessRecord[] {
  const progress = buildProjectProgressSnapshots(projectVersionLinkRecords);
  const bindings = dataExchangeRepository.listBindings().filter((b) => b.internalType === 'project');

  return progress.map((p) => {
    const bind = bindings.find((b) => b.internalId === p.projectId && b.status === 'active');
    const missingMappings = bind ? [] : ['externalProjectId'];
    const blocked = p.blockedTaskCount > 0;
    const ready = !blocked && missingMappings.length === 0 && p.currentOverallProgress > 0.6;
    return {
      projectId: p.projectId,
      readinessLevel: levelFromFlags({ blocked, ready, partial: !blocked && p.currentOverallProgress > 0.3 }),
      missingMappings,
      blockers: blocked ? ['blocked tasks'] : [],
      notes: 'Supply readiness is external-consumer oriented; not equal to internal progress.'
    };
  });
}

export function buildDeliveryReadinessRecords(): DeliveryReadinessRecord[] {
  const risk = buildRiskBlockerSummaries();
  const quality = buildQualityGateSummaries();
  return risk.map((r) => {
    const q = quality.find((x) => x.projectId === r.projectId);
    const blocked = r.blockerCount > 0 || (q?.criticalFailures ?? 0) > 0;
    const ready = !blocked && (q?.qualityScore ?? 0) >= 0.8;
    return {
      projectId: r.projectId,
      readinessLevel: levelFromFlags({ blocked, ready, partial: !blocked }),
      riskBlockers: r.blockerCount > 0 ? ['risk blockers'] : [],
      qualityGates: (q?.qualityScore ?? 0) >= 0.8 ? ['quality score ok'] : ['quality score low'],
      notes: 'Delivery readiness uses risk+quality to determine external readiness.'
    };
  });
}

export function buildResourceReadinessRecords(): ResourceReadinessRecord[] {
  const progress = buildProjectProgressSnapshots(projectVersionLinkRecords);
  return progress.map((p) => ({
    projectId: p.projectId,
    readinessLevel: p.resourcePressureLevel === 'high' ? 'blocked' : p.resourcePressureLevel === 'medium' ? 'partially-ready' : 'ready',
    resourcePressureLevel: p.resourcePressureLevel,
    notes: 'Resource readiness derived from resource pressure level.'
  }));
}

export function buildProjectExternalReadinessSummaries(): ProjectExternalReadinessSummary[] {
  const ctx = buildSnapshotContext();
  const supply = buildSupplyReadinessRecords();
  const delivery = buildDeliveryReadinessRecords();
  const resource = buildResourceReadinessRecords();

  return supply.map((s) => {
    const d = delivery.find((x) => x.projectId === s.projectId);
    const r = resource.find((x) => x.projectId === s.projectId);
    const blocked = s.readinessLevel === 'blocked' || d?.readinessLevel === 'blocked' || r?.readinessLevel === 'blocked';
    const ready = s.readinessLevel === 'ready' && d?.readinessLevel === 'ready' && r?.readinessLevel === 'ready';
    const reasons = [
      ...s.missingMappings.map((m) => `missing mapping: ${m}`),
      ...(s.blockers.length ? [`supply blockers: ${s.blockers.join(', ')}`] : []),
      ...(d?.riskBlockers.length ? [`delivery risk: ${d.riskBlockers.join(', ')}`] : []),
      ...(d?.qualityGates.length ? [`quality: ${d.qualityGates.join(', ')}`] : []),
      r?.resourcePressureLevel ? `resource pressure: ${r.resourcePressureLevel}` : null
    ].filter(Boolean) as string[];

    return {
      projectId: s.projectId,
      snapshotDate: ctx.snapshotDate,
      readinessLevel: levelFromFlags({ blocked, ready, partial: !blocked && !ready }),
      exportReady: ready,
      supplyReady: s.readinessLevel === 'ready',
      deliveryReady: d?.readinessLevel === 'ready',
      reasons,
      notes: 'External readiness is designed for cross-system consumption triggers.'
    };
  });
}

export function buildVersionReleaseReadinessRecords(): VersionReleaseReadinessRecord[] {
  const governance = buildVersionGovernanceRecords();
  const gates = buildVersionQualityGateRecords();
  return governance.records.map((r) => {
    const gate = gates.find((g) => g.linkedVersionId === r.linkedVersionId) ?? null;
    const blocked = r.governanceStatus === 'blocked' || gate?.gateStatus === 'blocked';
    const ready = r.governanceStatus === 'ready-to-release' && gate?.gateStatus === 'passed';
    return {
      linkedVersionId: r.linkedVersionId,
      readinessLevel: levelFromFlags({ blocked, ready, partial: !blocked }),
      releaseReadinessStatus: r.releaseReadinessStatus,
      qualityGateStatus: gate?.gateStatus ?? null,
      notes: 'Version release readiness for external consumers.'
    };
  });
}

