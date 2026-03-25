export interface FeishuIdentityRecord {
  provider: 'feishu';
  openId: string | null;
  unionId: string | null;
  userId: string | null;
  tenantKey: string | null;
  name: string | null;
  enName: string | null;
  avatarUrl: string | null;
  departmentId: string | null;
}

export interface ExternalIdentityBindingRecord {
  id: string;
  provider: 'feishu';
  externalIdentityId: string; // unionId preferred, fallback openId/userId
  personId: string;
  createdAt: string;
  notes?: string;
}

export interface UserSessionPersisted {
  id: string;
  createdAt: string;
  expiresAt: string | null;
  provider: 'mock' | 'feishu';
  personId: string;
  externalIdentityId: string | null;
}

