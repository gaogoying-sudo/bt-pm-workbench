import { NextRequest } from 'next/server';
import { projectService } from '@/server/services/project-service';
import { qualityService } from '@/server/services/quality-service';
import { success, failure, toJsonResponse } from '@/server/contracts/response';

export async function GET(_request: NextRequest, { params }: { params: { projectId: string } }) {
  const detail = projectService.getProjectDetail(params.projectId);
  if (!detail) {
    return toJsonResponse(failure('Project not found'), 404);
  }

  const quality = qualityService.getProjectQualitySnapshot(params.projectId);
  const stages = projectService.getProjectStages(params.projectId);

  return toJsonResponse(success({ detail, quality, stages }, { source: 'project-service' }));
}
