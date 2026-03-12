import { PageContainer } from '@/components/layout/page-container';
import { InfoCard } from '@/components/ui/info-card';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { dashboardStats, recentChanges, recentDocuments, recentVersions } from '@/lib/mock/overview';
import { formatDate } from '@/lib/utils/format';

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader title="Dashboard" description="项目管理全局视图（Mock Data）" />
      <div className="grid gap-4 md:grid-cols-5">
        <InfoCard title="当前项目总数" value={dashboardStats.totalProjects} />
        <InfoCard title="进行中项目" value={dashboardStats.activeProjects} />
        <InfoCard title="已封板项目" value={dashboardStats.sealedProjects} />
        <InfoCard title="高优先级任务" value={dashboardStats.highPriorityTasks} />
        <InfoCard title="待确认事项" value={dashboardStats.pendingConfirmations} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-medium">最近版本更新</h2>
          <ul className="space-y-2 text-sm">
            {recentVersions.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>{item.objectName} · {item.version}</span>
                <StatusBadge label={item.status} tone={item.isActive ? 'success' : 'muted'} />
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-medium">最近文档变更</h2>
          <ul className="space-y-2 text-sm">
            {recentDocuments.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>{item.title}</span>
                <span className="text-slate-500">{formatDate(item.updatedAt)}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-medium">最近需求变更</h2>
          <ul className="space-y-2 text-sm">
            {recentChanges.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>{item.target}</span>
                <StatusBadge label={item.status} tone={item.status === 'implemented' ? 'success' : 'warning'} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageContainer>
  );
}
