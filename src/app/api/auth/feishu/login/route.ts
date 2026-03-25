import { NextRequest } from 'next/server';
import { getRuntimeConfig } from '@/server/config/runtime-config';
import { failure, success, toJsonResponse } from '@/server/contracts/response';
import { buildFeishuLoginUrl } from '@/server/adapters/feishu/feishu-oauth';

export async function GET(_request: NextRequest) {
  const cfg = getRuntimeConfig();
  if (cfg.authMode !== 'feishu') {
    return toJsonResponse(failure('PMW_AUTH_MODE is not feishu'), 400);
  }
  const state = `st-${Date.now()}`;
  const url = await buildFeishuLoginUrl(state);
  return toJsonResponse(success({ url, state }, { source: 'feishu-login' }));
}

