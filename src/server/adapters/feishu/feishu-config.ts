export interface FeishuConfig {
  appId: string;
  appSecret: string;
  redirectUri: string;
  baseUrl: string; // default: https://open.feishu.cn
}

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is required for feishu auth mode`);
  return v;
}

export function getFeishuConfig(): FeishuConfig {
  return {
    appId: required('FEISHU_APP_ID'),
    appSecret: required('FEISHU_APP_SECRET'),
    redirectUri: required('FEISHU_REDIRECT_URI'),
    baseUrl: process.env.FEISHU_BASE_URL ?? 'https://open.feishu.cn'
  };
}

