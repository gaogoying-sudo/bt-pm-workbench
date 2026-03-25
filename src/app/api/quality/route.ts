import { NextRequest } from 'next/server';
import { qualityService } from '@/server/services/quality-service';
import { success, toJsonResponse } from '@/server/contracts/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId') ?? undefined;

  const checks = projectId
    ? qualityService.listChecksByProject(projectId)
    : qualityService.listAllChecks();
  const snapshot = projectId
    ? qualityService.getProjectQualitySnapshot(projectId)
    : null;
  const gates = projectId
    ? qualityService.getGateDefinitions(projectId)
    : [];

  return toJsonResponse(success({ checks, snapshot, gates }, { total: checks.length, source: 'quality-service' }));
}
