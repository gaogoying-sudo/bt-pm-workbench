import { PageContainer } from '@/components/layout/page-container';
import { InfoCard } from '@/components/ui/info-card';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { SnapshotContextPanel } from '@/components/shared/snapshot-context-panel';
import { SourceContextPanel } from '@/components/shared/source-context-panel';
import { dashboardStats, recentChanges, recentDocuments, recentVersions } from '@/lib/mock/overview';
import { formatDate } from '@/lib/utils/format';
import {
  buildExecutiveOverviewSnapshot,
  buildProjectHealthSnapshots,
  buildDeliveryRiskSnapshots
} from '@/lib/executive-dashboard/dashboard-builders';
import { buildSnapshotContext } from '@/lib/snapshots/snapshot-helpers';
import { qualityService } from '@/server/services/quality-service';

export default function DashboardPage() {
  const overview = buildExecutiveOverviewSnapshot();
  const projectHealth = buildProjectHealthSnapshots();
  const deliveryRisks = buildDeliveryRiskSnapshots();
  const qualitySummary = qualityService.listAllChecks();
  const qualityPassed = qualitySummary.filter((c) => c.status === 'passed').length;
  const snapshotContext = buildSnapshotContext({ notes: 'Dashboard 已接入 Executive Overview 聚合层。' });

  return (
    <PageContainer>
      <PageHeader title="驾驶舱 / Dashboard" description="多项目运行管理系统全局视图 — 聚合来自执行层、资源层、版本层、成本层和质量层的实时快照。" />

      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <InfoCard title="项目总数 / Projects" value={overview.totalProjects} />
        <InfoCard title="进行中 / Active" value={overview.activeProjects} />
        <InfoCard title="平均进度 / Avg Progress" value={`${Math.round(overview.averageProjectProgress * 100)}%`} />
        <InfoCard title="高风险 / High Risk" value={overview.highRiskProjects} />
        <InfoCard title="可发布 / Ready Versions" value={overview.readyVersions} />
        <InfoCard title="质量通过 / Quality Passed" value={`${qualityPassed}/${qualitySummary.length}`} />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-medium text-slate-900">项目健康概览 / Project Health</h2>
          <div className="space-y-2 text-sm">
            {projectHealth.slice(0, 5).map((ph) => (
              <div key={ph.projectId} className="flex items-center justify-between">
                <span className="text-slate-700">{ph.projectName}</span>
                <StatusBadge label={ph.status} tone={ph.status === 'active' ? 'success' : ph.status === 'at-risk' ? 'warning' : 'default'} />
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-medium text-slate-900">交付风险 / Delivery Risks</h2>
          <div className="space-y-2 text-sm">
            {deliveryRisks.slice(0, 5).map((dr, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="truncate text-slate-700">{dr.title}</span>
                <StatusBadge label={dr.severity} tone={dr.severity === 'high' ? 'danger' : dr.severity === 'medium' ? 'warning' : 'default'} />
              </div>
            ))}
            {deliveryRisks.length === 0 && <p className="text-slate-500">暂无交付风险信号。</p>}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-medium text-slate-900">最近版本更新 / Recent Versions</h2>
          <ul className="space-y-2 text-sm">
            {recentVersions.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>{item.objectName} · {item.version}</span>
                <StatusBadge label={item.status} tone={item.isActive ? 'success' : 'muted'} />
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-medium text-slate-900">最近文档变更 / Recent Documents</h2>
          <ul className="space-y-2 text-sm">
            {recentDocuments.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>{item.title}</span>
                <span className="text-slate-500">{formatDate(item.updatedAt)}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-medium text-slate-900">最近需求变更 / Recent Changes</h2>
          <ul className="space-y-2 text-sm">
            {recentChanges.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>{item.target}</span>
                <StatusBadge label={item.status} tone={item.status === 'implemented' ? 'success' : 'warning'} />
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-4 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <SourceContextPanel
          title="数据来源说明 / Source Context"
          sources={[
            { name: 'Executive Overview Builder', detail: '聚合项目健康、版本就绪和交付风险。' },
            { name: 'Quality Service', detail: '统一质量检查汇总。' },
            { name: 'Legacy Overview Data', detail: '版本/文档/变更索引数据。' }
          ]}
        />
        <SnapshotContextPanel title="快照口径 / Snapshot Context" context={snapshotContext} />
      </section>
    </PageContainer>
  );
}
