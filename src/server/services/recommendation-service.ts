import { actionPlaybooks } from '@/data/alerting/playbooks';
import { alertingRepository } from '@/server/repositories/alerting-repository';
import { RecommendationRecord } from '@/lib/types/recommendations';

function nowIso() {
  return new Date().toISOString();
}

export const recommendationService = {
  list(args?: { scope?: 'portfolio' | 'project' | 'version'; scopeId?: string | null }) {
    const list = alertingRepository.listRecommendations();
    if (!args?.scope) return list;
    if (args.scope === 'portfolio') return list.filter((r) => r.targets.length === 0);
    const id = args.scopeId ?? null;
    return list.filter((r) => r.targets.some((t) => t.targetType === args.scope && t.targetId === id));
  },

  getPlaybooks() {
    return actionPlaybooks;
  },

  triage(args: { recommendationId: string; action: 'ack' | 'dismiss' | 'snooze' | 'start' | 'done'; actorPersonId: string; reason?: string; snoozedUntil?: string; outcomeSummary?: string }) {
    const list = alertingRepository.listRecommendations();
    const rec = list.find((r) => r.id === args.recommendationId);
    if (!rec) throw new Error('Recommendation not found');
    const patch: Partial<RecommendationRecord> = {
      lastUpdatedAt: nowIso(),
      lastUpdatedBy: { personId: args.actorPersonId }
    };
    if (args.action === 'ack') patch.status = 'acknowledged';
    if (args.action === 'dismiss') {
      patch.status = 'dismissed';
      patch.triage = { ...(rec.triage ?? {}), dismissedReason: args.reason ?? 'dismissed' };
    }
    if (args.action === 'snooze') {
      patch.status = 'snoozed';
      patch.triage = { ...(rec.triage ?? {}), snoozedUntil: args.snoozedUntil ?? new Date().toISOString().slice(0, 10) };
    }
    if (args.action === 'start') patch.status = 'in-progress';
    if (args.action === 'done') {
      patch.status = 'done';
      patch.outcome = { ...(rec.outcome ?? {}), resolvedAt: nowIso(), outcomeSummary: args.outcomeSummary ?? '' };
    }
    return alertingRepository.patchRecommendation(args.recommendationId, patch);
  }
};

