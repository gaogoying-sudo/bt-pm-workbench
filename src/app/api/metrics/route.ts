import { NextRequest } from 'next/server';
import { success, failure, toJsonResponse } from '@/server/contracts/response';
import { metricGovernanceService } from '@/server/services/metric-governance-service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  if (code) {
    const contract = metricGovernanceService.getMetricContract(code);
    if (!contract) return toJsonResponse(failure('Metric not found'), 404);
    return toJsonResponse(success(contract, { source: 'metric-governance-service' }));
  }
  const dictionary = metricGovernanceService.getMetricDictionary();
  return toJsonResponse(success(dictionary, { total: dictionary.metrics.length, source: 'metric-governance-service' }));
}

