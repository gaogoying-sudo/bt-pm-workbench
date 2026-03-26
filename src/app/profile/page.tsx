'use client';

import Link from 'next/link';
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
      <PageHeader
        title="个人资料"
        description="中文优先：这里只展示基础身份档案（演示数据）；人员主数据可通过 /api/persons 查看。"
      />

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        <InfoCard title="用户 ID" value={currentUserId} />
        <InfoCard title="主角色" value={person?.primaryRoleId ?? '-'} />
        <InfoCard title="部门" value={person?.profile.department ?? '-'} />
      </section>

      <section className="pmw-surface mt-4 p-4">
        <h2 className="font-medium text-slate-900">身份绑定（轻量）</h2>
        <p className="mt-2 text-sm text-slate-600">
          飞书绑定与组织同步仍为后续小任务；主数据可通过{' '}
          <Link className="text-blue-700" href="/api/persons">
            /api/persons
          </Link>{' '}
          校验。
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

