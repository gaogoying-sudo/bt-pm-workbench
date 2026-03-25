import { NextRequest } from 'next/server';
import { success, toJsonResponse } from '@/server/contracts/response';
import { reviewService } from '@/server/services/review-service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId') ?? undefined;
  const versionId = searchParams.get('versionId') ?? undefined;
  const pack = reviewService.listPack({ projectId: projectId ?? undefined, versionId: versionId ?? undefined });
  return toJsonResponse(success(pack, { source: 'review-service' }));
}

