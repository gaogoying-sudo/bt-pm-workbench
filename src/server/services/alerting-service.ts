import { alertRules } from '@/data/alerting/alert-rules';
import { actionPlaybooks } from '@/data/alerting/playbooks';
import { buildProjectExternalReadinessSummaries, buildVersionReleaseReadinessRecords } from '@/lib/integrations/readiness-builders';
import { buildProjectProgressTimelinePoints, buildVersionGovernanceTimelinePoints } from '@/lib/snapshots/timeline-builders';
import { metricRegistry } from '@/lib/metrics/metric-registry';
import { inputEventRepository } from '@/server/repositories/input-event-repository';
import { dataExchangeRepository } from '@/server/repositories/data-exchange-repository';
import { buildQualitySummary, buildVersionQualityGateRecords } from '@/lib/quality/quality-builders';
import { AlertEvidenceRef, AlertRecord, AlertingPack, ForecastRecord, LeadIndicatorRecord, TrendSignalRecord } from '@/lib/types/alerting';
import { RecommendationRecord } from '@/lib/types/recommendations';
import { alertingRepository } from '@/server/repositories/alerting-repository';

function nowIso() {
  return new Date().toISOString();
}

function dayISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

function pickBaselineDate(snapshotDate: string) {
  // v0: baseline is 28 days ago
  const d = new Date(snapshotDate);
  d.setDate(d.getDate() - 28);
  return dayISO(d);
}

function evidenceMetric(metricCode: string, details?: string): AlertEvidenceRef {
  return {
    kind: 'metric',
    refId: metricCode,
    label: `${metricCode}@${metricRegistry.getActiveVersion(metricCode) ?? 'v1'}`,
    details
  };
}

function evidenceLink(label: string, refId: string): AlertEvidenceRef {
  return { kind: 'link', refId, label };
}

function ensurePersisted(alerts: AlertRecord[], recs: RecommendationRecord[]) {
  // v0: upsert as-is (id is stable for same scope+date)
  alerts.forEach((a) => alertingRepository.upsertAlert(a));
  recs.forEach((r) => alertingRepository.upsertRecommendation(r));
}

function buildEventBacklogIndicator(): LeadIndicatorRecord {
  const drafts = inputEventRepository.listDrafts('awaiting-confirmation');
  const value = drafts.length;
  // post-launch calibration: reduce noise for small teams
  const status = value >= 10 ? 'blocked' : value >= 5 ? 'watching' : 'good';
  return {
    id: `lead-event-backlog`,
    indicatorType: 'backlog',
    scope: 'portfolio',
    scopeId: null,
    value,
    unit: 'drafts',
    status,
    summary: `Input inbox backlog: ${value} drafts awaiting confirmation`,
    evidence: [evidenceLink('Input Inbox', '/input-inbox'), { kind: 'event', refId: 'drafts.awaiting-confirmation', label: 'draft queue' }],
    generatedAt: nowIso()
  };
}

function buildProjectProgressDeltaSignals(snapshotDate: string, baselineDate: string, scopeId?: string | null): TrendSignalRecord[] {
  const current = buildProjectProgressTimelinePoints(snapshotDate);
  const baseline = buildProjectProgressTimelinePoints(baselineDate);
  const byId = new Map(baseline.map((p) => [p.projectId, p]));
  const list = scopeId ? current.filter((p) => p.projectId === scopeId) : current;
  return list
    .map((p) => {
      const b = byId.get(p.projectId);
      if (!b) return null;
      const delta = p.overallProgress - b.overallProgress;
      const severity = delta <= -0.15 ? 'critical' : delta <= -0.08 ? 'warning' : 'info';
      return {
        id: `trend-progress-${p.projectId}-${snapshotDate}`,
        signalType: delta < 0 ? 'slope-down' : 'threshold-breach',
        metricCode: 'project.progressDelta',
        metricVersion: metricRegistry.getActiveVersion('project.progressDelta') ?? 'v1',
        scope: 'project',
        scopeId: p.projectId,
        window: { baselineDate, snapshotDate },
        summary: `progress delta vs baseline: ${Math.round(delta * 100)}%`,
        severity,
        evidence: [evidenceMetric('project.progressDelta', `baseline=${b.overallProgress}, current=${p.overallProgress}`), evidenceLink('Project Progress', '/project-progress')],
        detectedAt: nowIso()
      } satisfies TrendSignalRecord;
    })
    .filter(Boolean) as TrendSignalRecord[];
}

function buildForecasts(snapshotDate: string): ForecastRecord[] {
  const quality = buildQualitySummary('portfolio', null);
  const backlog = inputEventRepository.listDrafts('awaiting-confirmation').length;
  const horizonDays = 14;
  return [
    {
      id: `fc-quality-${snapshotDate}`,
      forecastType: 'quality-readiness',
      scope: 'portfolio',
      scopeId: null,
      horizonDays,
      summary: quality.blockingGates > 0 ? 'Quality readiness likely blocked unless gates are resolved.' : 'Quality readiness stable if current gates remain passing.',
      confidence: 'medium',
      evidence: [evidenceMetric('project.qualityReadiness'), { kind: 'quality', refId: 'portfolio', label: 'quality summary' }],
      generatedAt: nowIso()
    },
    {
      id: `fc-backlog-${snapshotDate}`,
      forecastType: 'event-backlog',
      scope: 'portfolio',
      scopeId: null,
      horizonDays,
      summary: backlog >= 8 ? 'Input confirmation backlog is high; status will drift without triage.' : 'Input backlog within normal range.',
      confidence: backlog >= 8 ? 'high' : 'low',
      evidence: [{ kind: 'event', refId: 'drafts.awaiting-confirmation', label: 'draft queue', details: `${backlog}` }],
      generatedAt: nowIso()
    }
  ];
}

function buildAlertsAndRecommendations(snapshotDate: string, scope?: { scope: 'portfolio' | 'project' | 'version'; scopeId?: string | null }) {
  const baselineDate = pickBaselineDate(snapshotDate);
  const sScope = scope?.scope ?? 'portfolio';
  const sId = scope?.scopeId ?? null;

  const trendSignals = buildProjectProgressDeltaSignals(snapshotDate, baselineDate, sScope === 'project' ? sId : null);
  const leadIndicators: LeadIndicatorRecord[] = [buildEventBacklogIndicator()];
  const forecasts = buildForecasts(snapshotDate);

  const alerts: AlertRecord[] = [];
  const recs: RecommendationRecord[] = [];

  // Alert: input backlog
  const backlog = inputEventRepository.listDrafts('awaiting-confirmation').length;
  if (alertRules.find((r) => r.code === 'alert.input.backlog' && r.enabled) && backlog >= 5 && sScope === 'portfolio') {
    const severity = backlog >= 10 ? 'critical' : 'warning';
    const alertId = `alert-backlog-${snapshotDate}`;
    alerts.push({
      id: alertId,
      ruleCode: 'alert.input.backlog',
      title: '输入确认堆积 / Input confirmation backlog',
      severity,
      status: 'new',
      scope: 'portfolio',
      scopeId: null,
      targets: [],
      summary: `Drafts awaiting confirmation: ${backlog}`,
      why: 'Draft queue indicates writeback chain delay; project status may drift.',
      evidence: [{ kind: 'event', refId: 'drafts.awaiting-confirmation', label: 'draft queue', details: `${backlog}` }, evidenceLink('Input Inbox', '/input-inbox')],
      suggestedNextActions: ['Triage input inbox', 'Confirm or reject oldest drafts'],
      createdAt: nowIso(),
      lastUpdatedAt: nowIso(),
      lastUpdatedBy: null
    });
    const pb = actionPlaybooks.find((p) => p.code === 'playbook.backlog.cleanup')!;
    recs.push({
      id: `rec-${alertId}`,
      title: pb.name,
      priority: pb.defaultPriority,
      status: 'new',
      targets: [],
      playbookCode: pb.code,
      reason: { summary: 'Backlog detected from input draft queue.', linkedAlertId: alertId, linkedRuleCode: 'alert.input.backlog', evidence: alerts[alerts.length - 1].evidence },
      createdAt: nowIso(),
      lastUpdatedAt: nowIso(),
      lastUpdatedBy: null
    });
  }

  // Alert: external mapping gap (portfolio or project)
  if (alertRules.find((r) => r.code === 'alert.external.mapping.gap' && r.enabled)) {
    const readiness = buildProjectExternalReadinessSummaries();
    const bindings = dataExchangeRepository.listBindings();
    const missing = readiness
      .filter((r) => (sScope === 'project' ? r.projectId === sId : true))
      .filter((r) => r.readinessLevel !== 'ready')
      .filter((r) => !bindings.some((b) => b.internalType === 'project' && b.internalId === r.projectId && b.status === 'active'));
    if (missing.length > 0) {
      const alertId = `alert-mapping-gap-${sScope}-${sId ?? 'all'}-${snapshotDate}`;
      alerts.push({
        id: alertId,
        ruleCode: 'alert.external.mapping.gap',
        title: '外部映射缺失导致就绪降级 / External mapping gap',
        severity: sScope === 'project' ? 'warning' : 'info',
        status: 'new',
        scope: sScope === 'project' ? 'project' : 'portfolio',
        scopeId: sScope === 'project' ? sId : null,
        targets: missing.slice(0, 6).map((m) => ({ targetType: 'project', targetId: m.projectId })),
        summary: `${missing.length} project(s) degraded due to missing mapping`,
        why: 'External readiness requires stable external identifiers; missing mapping blocks export consumers.',
        evidence: [
          evidenceMetric('external.readiness'),
          { kind: 'readiness', refId: 'project', label: 'readiness summaries', details: `missing=${missing.length}` },
          evidenceLink('Data Exchange', '/data-exchange')
        ],
        suggestedNextActions: ['Bind externalProjectId via import apply', 'Recompute readiness reasons'],
        createdAt: nowIso(),
        lastUpdatedAt: nowIso(),
        lastUpdatedBy: null
      });
      const pb = actionPlaybooks.find((p) => p.code === 'playbook.external.mapping.fix')!;
      recs.push({
        id: `rec-${alertId}`,
        title: pb.name,
        priority: pb.defaultPriority,
        status: 'new',
        targets: alerts[alerts.length - 1].targets,
        playbookCode: pb.code,
        reason: { summary: 'Mapping gap detected from readiness + bindings.', linkedAlertId: alertId, linkedRuleCode: 'alert.external.mapping.gap', evidence: alerts[alerts.length - 1].evidence },
        createdAt: nowIso(),
        lastUpdatedAt: nowIso(),
        lastUpdatedBy: null
      });
    }
  }

  // Alert: progress delta down (project scope)
  if (alertRules.find((r) => r.code === 'alert.project.progress.delta.down' && r.enabled)) {
    const candidates = trendSignals.filter((t) => t.severity !== 'info' && (sScope === 'project' ? t.scopeId === sId : true));
    candidates.slice(0, 6).forEach((t) => {
      const alertId = `alert-progress-down-${t.scopeId}-${snapshotDate}`;
      alerts.push({
        id: alertId,
        ruleCode: 'alert.project.progress.delta.down',
        title: '进度偏差恶化 / Progress delta worsening',
        severity: t.severity,
        status: 'new',
        scope: 'project',
        scopeId: t.scopeId,
        targets: [{ targetType: 'project', targetId: t.scopeId! }],
        summary: t.summary,
        why: `Baseline(${t.window.baselineDate}) vs current(${t.window.snapshotDate}) shows negative delta.`,
        evidence: [...t.evidence, { kind: 'snapshot', refId: `${t.window.snapshotDate}`, label: 'snapshotDate' }],
        suggestedNextActions: ['Review blockers and risk signals', 'Increase review cadence', 'Confirm recent inputs/writebacks'],
        createdAt: nowIso(),
        lastUpdatedAt: nowIso(),
        lastUpdatedBy: null
      });
      const pb = actionPlaybooks.find((p) => p.code === 'playbook.owner.participation.fix')!;
      recs.push({
        id: `rec-${alertId}`,
        title: '加密评审并明确责任 / Increase review cadence and ownership',
        priority: t.severity === 'critical' ? 'p0' : 'p1',
        status: 'new',
        targets: [{ targetType: 'project', targetId: t.scopeId! }],
        playbookCode: pb.code,
        reason: { summary: `Progress delta worsening for ${t.scopeId}.`, linkedAlertId: alertId, linkedRuleCode: 'alert.project.progress.delta.down', evidence: alerts[alerts.length - 1].evidence },
        createdAt: nowIso(),
        lastUpdatedAt: nowIso(),
        lastUpdatedBy: null
      });
    });
  }

  // Alert: quality readiness down (portfolio-level)
  if (alertRules.find((r) => r.code === 'alert.project.quality.readiness.down' && r.enabled) && sScope === 'portfolio') {
    const qs = buildQualitySummary('portfolio', null);
    if (qs.blockingGates > 0 || qs.qualityScore < 0.8) {
      const alertId = `alert-quality-down-${snapshotDate}`;
      alerts.push({
        id: alertId,
        ruleCode: 'alert.project.quality.readiness.down',
        title: '质量就绪度下滑 / Quality readiness down',
        severity: qs.blockingGates > 0 ? 'critical' : 'warning',
        status: 'new',
        scope: 'portfolio',
        scopeId: null,
        targets: [],
        summary: `qualityScore=${Math.round(qs.qualityScore * 100)}%, blockingGates=${qs.blockingGates}`,
        why: 'Blocking gates or low pass rate indicates release risk.',
        evidence: [evidenceMetric('project.qualityReadiness'), { kind: 'quality', refId: 'portfolio', label: 'quality summary' }],
        suggestedNextActions: ['Tighten quality gate', 'Add checks and owners for pending issues'],
        createdAt: nowIso(),
        lastUpdatedAt: nowIso(),
        lastUpdatedBy: null
      });
      const pb = actionPlaybooks.find((p) => p.code === 'playbook.quality.gate.tighten')!;
      recs.push({
        id: `rec-${alertId}`,
        title: pb.name,
        priority: qs.blockingGates > 0 ? 'p0' : pb.defaultPriority,
        status: 'new',
        targets: [],
        playbookCode: pb.code,
        reason: { summary: 'Quality readiness degraded.', linkedAlertId: alertId, linkedRuleCode: 'alert.project.quality.readiness.down', evidence: alerts[alerts.length - 1].evidence },
        createdAt: nowIso(),
        lastUpdatedAt: nowIso(),
        lastUpdatedBy: null
      });
    }
  }

  // Version lead indicator: external release readiness blocked
  if (sScope === 'version') {
    const versions = buildVersionReleaseReadinessRecords();
    const item = versions.find((v) => v.linkedVersionId === sId) ?? null;
    if (item && item.readinessLevel !== 'ready') {
      leadIndicators.push({
        id: `lead-version-ready-${sId}-${snapshotDate}`,
        indicatorType: 'writeback-gap',
        scope: 'version',
        scopeId: sId ?? null,
        value: item.readinessLevel === 'blocked' ? 1 : 0,
        unit: 'blockers',
        status: item.readinessLevel === 'blocked' ? 'blocked' : 'watching',
        summary: `Version external readiness: ${item.readinessLevel}`,
        evidence: [evidenceMetric('version.releaseReadiness'), { kind: 'readiness', refId: 'version', label: 'release readiness', details: item.releaseReadinessStatus }],
        generatedAt: nowIso()
      });
    }
  }

  return { baselineDate, trendSignals, leadIndicators, forecasts, alerts, recs };
}

export const alertingService = {
  getPack(args?: { scope?: 'portfolio' | 'project' | 'version'; scopeId?: string | null; snapshotDate?: string }) {
    const snapshotDate = args?.snapshotDate ?? dayISO(new Date());
    const scope = args?.scope ?? 'portfolio';
    const scopeId = args?.scopeId ?? null;
    const computed = buildAlertsAndRecommendations(snapshotDate, { scope, scopeId });
    ensurePersisted(computed.alerts, computed.recs);
    const pack: AlertingPack = {
      generatedAt: nowIso(),
      rules: alertRules,
      alerts: computed.alerts,
      trendSignals: computed.trendSignals,
      forecasts: computed.forecasts,
      leadIndicators: computed.leadIndicators
    };
    return pack;
  },

  listAlerts(args?: { scope?: 'portfolio' | 'project' | 'version'; scopeId?: string | null }) {
    const list = alertingRepository.listAlerts();
    if (!args?.scope) return list;
    return list.filter((a) => a.scope === args.scope && (args.scope === 'portfolio' ? true : a.scopeId === (args.scopeId ?? null)));
  },

  listRecommendations(args?: { scope?: 'portfolio' | 'project' | 'version'; scopeId?: string | null }) {
    const list = alertingRepository.listRecommendations();
    if (!args?.scope) return list;
    return list.filter((r) => {
      if (args.scope === 'portfolio') return r.targets.length === 0;
      const id = args.scopeId ?? null;
      return r.targets.some((t) => t.targetType === args.scope && t.targetId === id);
    });
  },

  triageAlert(args: { alertId: string; action: 'ack' | 'dismiss' | 'snooze' | 'resolve'; actorPersonId: string; reason?: string; snoozedUntil?: string; note?: string }) {
    const alert = alertingRepository.getAlert(args.alertId);
    if (!alert) throw new Error('Alert not found');
    const patch: Partial<AlertRecord> = {
      lastUpdatedAt: nowIso(),
      lastUpdatedBy: { personId: args.actorPersonId }
    };
    if (args.action === 'ack') {
      patch.status = 'acknowledged';
      patch.triage = { ...(alert.triage ?? {}), acknowledgedAt: nowIso() };
    }
    if (args.action === 'dismiss') {
      patch.status = 'dismissed';
      patch.triage = { ...(alert.triage ?? {}), dismissedReason: args.reason ?? 'dismissed' };
    }
    if (args.action === 'snooze') {
      patch.status = 'snoozed';
      patch.triage = { ...(alert.triage ?? {}), snoozedUntil: args.snoozedUntil ?? dayISO(new Date()) };
    }
    if (args.action === 'resolve') {
      patch.status = 'resolved';
      patch.triage = { ...(alert.triage ?? {}), resolvedAt: nowIso(), resolutionNote: args.note ?? '' };
    }
    return alertingRepository.patchAlert(args.alertId, patch);
  }
};

