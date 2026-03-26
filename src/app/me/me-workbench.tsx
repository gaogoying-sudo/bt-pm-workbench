'use client';

import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { useCurrentUser } from '@/components/identity/current-user-provider';
import { InfoCard } from '@/components/ui/info-card';

export function MeWorkbench({ legacyFrom }: { legacyFrom?: string }) {
  const { currentUserId, context } = useCurrentUser();

  return (
    <PageContainer>
      <PageHeader title="我的工作台" description="从这里进入项目主路径：项目详情页签与输入写回链路。" />

      {legacyFrom ? (
        <div className="mb-4 rounded-xl border border-amber-200/70 bg-amber-50/70 px-3 py-2 text-sm text-amber-900 shadow-sm shadow-amber-900/10">
          你来自旧入口：<span className="font-mono">{legacyFrom}</span>。建议改用主导航与项目内页签，避免两套路径混用。
        </div>
      ) : null}

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        <InfoCard title="当前用户" value={currentUserId} />
        <InfoCard title="可见范围模式" value={context.projectScope.mode} />
        <InfoCard title="可见项目数" value={context.projectScope.projectIds.length} />
      </section>

      <section className="pmw-surface mt-4 p-4">
        <h2 className="font-medium text-slate-900">从哪里开始</h2>
        <p className="mt-2 text-sm text-slate-600">
          推荐从「项目列表」进入项目详情页签（执行 / 进度 / 版本 / 资源 / 复盘），或直接从「输入收件箱」录入并确认写回。
        </p>
        <div className="mt-3 text-xs text-slate-500">
          当前权限范围由 buildCurrentUserContext 提供到 projectScope（mock/feishu session 都可影响）。
        </div>
      </section>
    </PageContainer>
  );
}
