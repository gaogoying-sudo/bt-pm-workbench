import { NextRequest } from 'next/server';
import { success, failure, toJsonResponse } from '@/server/contracts/response';
import { liveIssueService } from '@/server/services/live-issue-service';

export async function GET(_request: NextRequest) {
  const pack = liveIssueService.listPack();
  return toJsonResponse(success(pack, { source: 'live-issue-service' }));
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.severity || !body?.scope || !body?.source) return toJsonResponse(failure('missing required fields'), 400);
  const record = liveIssueService.create({
    title: body.title,
    severity: body.severity,
    scope: body.scope,
    source: body.source,
    description: body.description ?? '',
    affectedPages: body.affectedPages ?? [],
    triage: body.triage ?? { disposition: 'deferred', owner: 'unassigned', notes: '', hotfixCandidate: false },
    links: body.links ?? []
  });
  return toJsonResponse(success(record, { source: 'live-issue-service' }));
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.id || !body?.patch) return toJsonResponse(failure('id/patch required'), 400);
  const updated = liveIssueService.patch(body.id, body.patch);
  if (!updated) return toJsonResponse(failure('issue not found'), 404);
  return toJsonResponse(success(updated, { source: 'live-issue-service' }));
}

