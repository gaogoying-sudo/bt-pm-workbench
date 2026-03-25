import { addItem, findById, getCollection, updateItem } from '@/server/persistence/local-store';
import { AlertRecord } from '@/lib/types/alerting';
import { RecommendationRecord } from '@/lib/types/recommendations';

const ALERTS = 'alerts';
const RECOMMENDATIONS = 'recommendations';

export const alertingRepository = {
  listAlerts(): AlertRecord[] {
    return getCollection<AlertRecord>(ALERTS);
  },
  upsertAlert(alert: AlertRecord) {
    addItem(ALERTS, alert);
  },
  getAlert(id: string) {
    return findById<AlertRecord>(ALERTS, id);
  },
  patchAlert(id: string, patch: Partial<AlertRecord>) {
    return updateItem<AlertRecord>(ALERTS, id, patch);
  },

  listRecommendations(): RecommendationRecord[] {
    return getCollection<RecommendationRecord>(RECOMMENDATIONS);
  },
  upsertRecommendation(rec: RecommendationRecord) {
    addItem(RECOMMENDATIONS, rec);
  },
  patchRecommendation(id: string, patch: Partial<RecommendationRecord>) {
    return updateItem<RecommendationRecord>(RECOMMENDATIONS, id, patch);
  }
};

