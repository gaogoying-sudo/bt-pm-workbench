import { NextRequest } from 'next/server';
import { success, failure, toJsonResponse } from '@/server/contracts/response';
import { sessionRepository } from '@/server/repositories/session-repository';
import { identityRegistry } from '@/lib/identity/identity-registry';

function getCookie(request: NextRequest, name: string): string | null {
  const cookie = request.headers.get('cookie') ?? '';
  const m = cookie.match(new RegExp(`${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export async function GET(request: NextRequest) {
  const sessionId = getCookie(request, 'pmw_session');
  if (!sessionId) return toJsonResponse(failure('No session'), 401);
  const session = sessionRepository.get(sessionId);
  if (!session) return toJsonResponse(failure('Invalid session'), 401);
  const person = identityRegistry.getPerson(session.personId);
  return toJsonResponse(success({ session, person }, { source: 'session' }));
}

export async function DELETE(request: NextRequest) {
  const sessionId = getCookie(request, 'pmw_session');
  if (sessionId) sessionRepository.delete(sessionId);
  const res = toJsonResponse(success({ ok: true }, { source: 'session' }));
  res.headers.set('set-cookie', 'pmw_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax');
  return res;
}

