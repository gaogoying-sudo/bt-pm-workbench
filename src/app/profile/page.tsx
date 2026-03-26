'use client';

import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { useCurrentUser } from '@/components/identity/current-user-provider';
import { identityRegistry } from '@/lib/identity/identity-registry';
import { StatusBadge } from '@/components/ui/status-badge';
import { InfoCard } from '@/components/ui/info-card';

export default function ProfilePage() {
  const { currentUserId } = useCurrentUser();
  const person = identityRegistry.getPerson(currentUserId);

  return (
    <PageContainer>
      <PageHeader title="Profile / 个人资料" description="展示当前用户的基础档案信息（mock/seed）。" />

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        <InfoCard title="User ID" value={currentUserId} />
        <InfoCard title="Primary role" value={person?.primaryRoleId ?? '-'} />
        <InfoCard title="Department" value={person?.profile.department ?? '-'} />
      </section>

      <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Identity bindings</h2>
        <p className="mt-2 text-sm text-slate-600">
          当前版本只展示本地身份上下文；飞书绑定/组织同步 UI 与深度映射会在第 2 包继续补齐。
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <StatusBadge label={person?.status ?? 'unknown'} tone="muted" />
          <StatusBadge label={person?.profile.department ?? '-'} tone="muted" />
          <StatusBadge label={person?.profile.location ?? '-'} tone="muted" />
        </div>
      </section>
    </PageContainer>
  );
}

