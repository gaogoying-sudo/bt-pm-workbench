import { buildProjectExternalReadinessSummaries } from '@/lib/integrations/readiness-builders';
import { dataExchangeRepository } from '@/server/repositories/data-exchange-repository';
import { metricRegistry } from '@/lib/metrics/metric-registry';
import { DataGovernancePack, DataQualityCheckRecord, DataDriftSignalRecord, HistoricalTrustMarker, RuleChangeImpactRecord } from '@/lib/types/data-quality';
import { buildProjectProgressTimelinePoints } from '@/lib/snapshots/timeline-builders';

function nowIso() {
  return new Date().toISOString();
}

function computeProgressDrift(scopeId: string | null, snapshotDate: string, baselineDate: string): DataDriftSignalRecord | null {
  const current = buildProjectProgressTimelinePoints(snapshotDate);
  const baseline = buildProjectProgressTimelinePoints(baselineDate);
  const filter = (list: typeof current) => (scopeId ? list.filter((p) => p.projectId === scopeId) : list);
  const avg = (list: typeof current) => (list.length === 0 ? 0 : list.reduce((s, p) => s + p.overallProgress, 0) / list.length);
  const c = avg(filter(current));
  const b = avg(filter(baseline));
  const delta = c - b;
  const severity = Math.abs(delta) >= 0.15 ? 'critical' : Math.abs(delta) >= 0.08 ? 'warning' : 'info';
  return {
    id: `drift-${snapshotDate}-${baselineDate}-${scopeId ?? 'portfolio'}`,
    metricCode: 'project.progressDelta',
    metricVersion: metricRegistry.getActiveVersion('project.progressDelta') ?? 'v1',
    scope: scopeId ? 'project' : 'portfolio',
    scopeId,
    baselineDate,
    snapshotDate,
    deltaSummary: `progress delta vs baseline: ${Math.round(delta * 100)}%`,
    severity,
    detectedAt: nowIso()
  };
}

export const dataGovernanceService = {
  getGovernancePack(args?: { scope?: 'portfolio' | 'project'; scopeId?: string | null; snapshotDate?: string; baselineDate?: string }) {
    const snapshotDate = args?.snapshotDate ?? new Date().toISOString().slice(0, 10);
    const baselineDate = args?.baselineDate ?? '2026-02-01';
    const scope = args?.scope ?? 'portfolio';
    const scopeId = scope === 'project' ? args?.scopeId ?? null : null;

    const checks: DataQualityCheckRecord[] = [];

    const readiness = buildProjectExternalReadinessSummaries();
    const bindings = dataExchangeRepository.listBindings();
    const missingMapping = readiness
      .filter((r) => r.readinessLevel !== 'ready')
      .filter((r) => !bindings.some((b) => b.internalType === 'project' && b.internalId === r.projectId && b.status === 'active'));

    const scopedMissing = scopeId ? missingMapping.filter((m) => m.projectId === scopeId) : missingMapping;
    if (scopedMissing.length > 0) {
      checks.push({
        id: `dq-mapping-missing-${scopeId ?? 'portfolio'}`,
        code: 'dq.external.mapping.missing',
        title: 'External mapping missing',
        description: 'External readiness is degraded when project external mapping is missing.',
        severity: scopeId ? 'warning' : 'info',
        status: scopeId ? 'warn' : 'warn',
        scope,
        scopeId,
        evidence: scopedMissing.slice(0, 6).map((m) => `project:${m.projectId}`),
        detectedAt: nowIso(),
        suggestedAction: 'Use /data-exchange import preview/apply to bind externalProjectId.'
      });
    }

    const driftSignals: DataDriftSignalRecord[] = [];
    const drift = computeProgressDrift(scopeId, snapshotDate, baselineDate);
    if (drift) driftSignals.push(drift);

    const ruleImpacts: RuleChangeImpactRecord[] = [
      {
        id: 'impact-health-v1',
        metricCode: 'project.healthScore',
        fromVersion: 'v1',
        toVersion: 'v1',
        changedAt: nowIso(),
        changedBy: 'system',
        changeReason: 'Governance freeze baseline',
        impactedPages: ['/executive-dashboard', '/projects/[projectId]'],
        recomputeRequired: false,
        notes: 'No change; placeholder for future rule version upgrades.'
      }
    ];

    const trustMarkers: HistoricalTrustMarker[] = [
      {
        id: `trust-${scopeId ?? 'portfolio'}`,
        scope,
        scopeId,
        trustLevel: checks.some((c) => c.severity === 'critical' && c.status === 'fail') ? 'untrusted' : checks.length > 0 ? 'caveated' : 'trusted',
        notes: checks.length > 0 ? 'Some checks warn; see data quality pack.' : 'No active warnings.',
        updatedAt: nowIso()
      }
    ];

    const pack: DataGovernancePack = {
      generatedAt: nowIso(),
      checks,
      driftSignals,
      ruleImpacts,
      trustMarkers
    };
    return pack;
  }
};

