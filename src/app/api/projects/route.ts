import { NextRequest } from 'next/server';
import { projectService } from '@/server/services/project-service';
import { success, toJsonResponse } from '@/server/contracts/response';

export async function GET(_request: NextRequest) {
  const projects = projectService.listProjects();
  return toJsonResponse(success(projects, { total: projects.length, source: 'project-service' }));
}
