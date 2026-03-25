import { metricDictionaryPack } from '@/data/metrics/metric-dictionary';

export const metricRegistry = {
  getDictionary() {
    return metricDictionaryPack;
  },

  getMetricDefinition(code: string) {
    return metricDictionaryPack.metrics.find((m) => m.code === code) ?? null;
  },

  getActiveVersion(metricCode: string) {
    const v = metricDictionaryPack.versions.find((mv) => mv.metricCode === metricCode && mv.status === 'active');
    return v?.version ?? null;
  }
};

