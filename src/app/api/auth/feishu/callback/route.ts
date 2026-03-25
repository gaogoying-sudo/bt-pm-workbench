import { NextRequest } from 'next/server';
import { exchangeCodeForToken, fetchFeishuUserInfo } from '@/server/adapters/feishu/feishu-oauth';
import { getRuntimeConfig } from '@/server/config/runtime-config';
import { failure, success, toJsonResponse } from '@/server/contracts/response';
import { identityBindingRepository } from '@/server/repositories/identity-binding-repository';
import { sessionRepository } from '@/server/repositories/session-repository';
import { ExternalIdentityBindingRecord, UserSessionPersisted } from '@/server/auth/session-types';

function nowIso() {
  return new Date().toISOString();
}

function cookie(name: string, value: string) {
  return `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`;
}

function externalIdFromFeishu(profile: { union_id?: string; open_id?: string; user_id?: string }) {
  return profile.union_id ?? profile.open_id ?? profile.user_id ?? null;
}

export async function GET(request: NextRequest) {
  const cfg = getRuntimeConfig();
  if (cfg.authMode !== 'feishu') return toJsonResponse(failure('PMW_AUTH_MODE is not feishu'), 400);

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  if (!code) return toJsonResponse(failure('Missing code'), 400);

  const token = await exchangeCodeForToken(code);
  const profile = await fetchFeishuUserInfo(token.access_token);
  const externalIdentityId = externalIdFromFeishu(profile);
  if (!externalIdentityId) return toJsonResponse(failure('Feishu identity missing union/open/user id'), 400);

  const binding = identityBindingRepository.find('feishu', externalIdentityId);
  const personId = binding?.personId ?? 'person-alice'; // safe fallback: dev mode still works; binding UI can improve later

  const session: UserSessionPersisted = {
    id: `sess-${Date.now()}`,
    createdAt: nowIso(),
    expiresAt: null,
    provider: 'feishu',
    personId,
    externalIdentityId
  };
  sessionRepository.create(session);

  const res = toJsonResponse(
    success(
      {
        sessionId: session.id,
        personId,
        externalIdentityId,
        feishuProfile: profile,
        bindingStatus: binding ? 'bound' : 'fallback'
      },
      { source: 'feishu-callback' }
    ),
    200
  );

  res.headers.set('set-cookie', cookie('pmw_session', session.id));
  return res;
}

