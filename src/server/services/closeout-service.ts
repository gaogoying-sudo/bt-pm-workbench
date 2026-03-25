import { finalAcceptanceChecklist, releaseReadiness, roleWalkthroughs, demoReadiness, criticalGaps } from '@/data/closeout/final-acceptance';

export const closeoutService = {
  getCloseoutPack() {
    return {
      checklist: finalAcceptanceChecklist,
      releaseReadiness,
      criticalGaps,
      roleWalkthroughs,
      demoReadiness
    };
  }
};

