import { metricRegistry } from '@/lib/metrics/metric-registry';

export const metricGovernanceService = {
  getMetricDictionary() {
    return metricRegistry.getDictionary();
  },

  getMetricContract(metricCode: string) {
    const def = metricRegistry.getMetricDefinition(metricCode);
    if (!def) return null;
    const version = metricRegistry.getActiveVersion(metricCode);
    return { definition: def, activeVersion: version };
  }
};

