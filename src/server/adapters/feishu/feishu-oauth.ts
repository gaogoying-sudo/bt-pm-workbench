import { getFeishuConfig } from '@/server/adapters/feishu/feishu-config';

export interface FeishuTokenResult {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
}

export interface FeishuUserInfo {
  open_id?: string;
  union_id?: string;
  user_id?: string;
  name?: string;
  en_name?: string;
  avatar_url?: string;
  email?: string;
  mobile?: string;
  tenant_key?: string;
  department_id?: string;
}

export async function buildFeishuLoginUrl(state: string) {
  const cfg = getFeishuConfig();
  const url = new URL(`${cfg.baseUrl}/open-apis/authen/v1/index`);
  url.searchParams.set('app_id', cfg.appId);
  url.searchParams.set('redirect_uri', cfg.redirectUri);
  url.searchParams.set('state', state);
  return url.toString();
}

export async function exchangeCodeForToken(code: string): Promise<FeishuTokenResult> {
  const cfg = getFeishuConfig();
  const url = `${cfg.baseUrl}/open-apis/authen/v1/access_token`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      app_id: cfg.appId,
      app_secret: cfg.appSecret
    })
  });
  const json = await res.json();
  if (!res.ok || json?.code !== 0) {
    throw new Error(`Feishu token exchange failed: ${json?.msg ?? res.statusText}`);
  }
  return json.data as FeishuTokenResult;
}

export async function fetchFeishuUserInfo(accessToken: string): Promise<FeishuUserInfo> {
  const cfg = getFeishuConfig();
  const url = `${cfg.baseUrl}/open-apis/authen/v1/user_info`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const json = await res.json();
  if (!res.ok || json?.code !== 0) {
    throw new Error(`Feishu user info fetch failed: ${json?.msg ?? res.statusText}`);
  }
  return json.data as FeishuUserInfo;
}

