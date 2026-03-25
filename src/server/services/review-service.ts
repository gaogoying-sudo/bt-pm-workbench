import { reviewRepository } from '@/server/repositories/review-repository';

export const reviewService = {
  listPack(args?: { projectId?: string; versionId?: string }) {
    const { projectId, versionId } = args ?? {};
    const filter = (targets: any[]) => {
      if (!projectId && !versionId) return true;
      return targets.some((t) => {
        if (projectId && t.targetType === 'project' && t.targetId === projectId) return true;
        if (versionId && t.targetType === 'version' && t.targetId === versionId) return true;
        return false;
      });
    };
    const reviews = reviewRepository.listReviews().filter((r) => filter(r.scope));
    const decisions = reviewRepository.listDecisions().filter((d) => filter(d.scope.targets));
    const lessons = reviewRepository.listLessons().filter((l) => filter(l.scope.targets));
    return { reviews, decisions, lessons };
  }
};

