import { NextRequest } from 'next/server';
import { manpowerRepository } from '@/server/repositories/manpower-repository';
import { buildManpowerCostSummary, buildRoleCostSnapshots } from '@/lib/manpower/cost-calculators';
import { buildProjectCostComparisonSnapshots, buildStageCostComparisonSnapshots } from '@/lib/manpower/comparison-builders';
import { success, toJsonResponse } from '@/server/contracts/response';

export async function GET(_request: NextRequest) {
  const costSummary = buildManpowerCostSummary();
  const roleCosts = buildRoleCostSnapshots();
  const projectComparisons = buildProjectCostComparisonSnapshots();
  const stageComparisons = buildStageCostComparisonSnapshots();

  return toJsonResponse(success({
    costSummary,
    roleCosts,
    projectComparisons,
    stageComparisons
  }, { source: 'manpower-service' }));
}
