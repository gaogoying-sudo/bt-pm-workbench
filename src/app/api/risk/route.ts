import { NextRequest } from 'next/server';
import { buildProjectRiskSignals } from '@/lib/project-progress/project-risk-builders';
import { buildVersionRiskSignals } from '@/lib/version-governance/version-risk-builders';
import { snapshotRepository } from '@/server/repositories/snapshot-repository';
import { buildProjectProgressSnapshots } from '@/lib/project-progress/project-progress-builders';
import { success, toJsonResponse } from '@/server/contracts/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId') ?? undefined;

  const versionLinks = snapshotRepository.findAllVersionLinks();

  if (projectId) {
    const signals = buildProjectRiskSignals(projectId);
    return toJsonResponse(success({ projectRisks: signals }, { total: signals.length, source: 'risk-builders' }));
  }

  const progressSnapshots = buildProjectProgressSnapshots(versionLinks);
  const allProjectRisks = progressSnapshots.flatMap((s) => buildProjectRiskSignals(s.projectId));
  const linkedVersionIds = [...new Set(versionLinks.map((l) => l.linkedVersionId))];
  const versionRisks = buildVersionRiskSignals(linkedVersionIds, versionLinks, allProjectRisks);

  return toJsonResponse(success({
    projectRisks: allProjectRisks,
    versionRisks
  }, { total: allProjectRisks.length + versionRisks.length, source: 'risk-builders' }));
}
