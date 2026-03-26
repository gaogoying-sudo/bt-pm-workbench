'use client';

import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { useCurrentUser } from '@/components/identity/current-user-provider';
import { InfoCard } from '@/components/ui/info-card';

export default function MePage() {
  const { currentUserId, context } = useCurrentUser();

  return (
    <PageContainer>
      <PageHeader title="Me / 我的工作台" description="当前用户上下文：身份、可见范围与进入主流程的入口提示。" />

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        <InfoCard title="Current user" value={currentUserId} />
        <InfoCard title="Scope mode" value={context.projectScope.mode} />
        <InfoCard title="Project count" value={context.projectScope.projectIds.length} />
      </section>

      <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Where to start</h2>
        <p className="mt-2 text-sm text-slate-600">
          推荐从「项目列表 / Projects」进入项目详情页签（执行/进度/版本/资源/复盘），或直接从「输入收件箱 / Input Inbox」录入并确认写回。
        </p>
        <div className="mt-3 text-xs text-slate-500">
          当前权限范围由 buildCurrentUserContext 提供到 projectScope（mock/feishu session 都可影响）。
        </div>
      </section>
    </PageContainer>
  );
}

