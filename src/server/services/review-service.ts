import { reviewRepository } from '@/server/repositories/review-repository';

export const reviewService = {
  listPack(args?: { projectId?: string }) {
    const { projectId } = args ?? {};
    const filterByProject = (targets: any[]) => {
      if (!projectId) return true;
      return targets.some((t) => t.targetType === 'project' && t.targetId === projectId);
    };
    const reviews = reviewRepository.listReviews().filter((r) => filterByProject(r.scope));
    const decisions = reviewRepository.listDecisions().filter((d) => filterByProject(d.scope.targets));
    const lessons = reviewRepository.listLessons().filter((l) => filterByProject(l.scope.targets));
    return { reviews, decisions, lessons };
  }
};

