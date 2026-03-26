import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import Link from 'next/link';
import { businessDomains } from '@/server/domains/business-domains';

export default function AdminPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Admin / 后台管理"
        description="五类管理入口（最小可运行）：与 9 大业务域 read/write 锚点关联，非空壳设置页。"
      />

      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">主数据管理</h2>
          <p className="mt-2 text-sm text-slate-600">项目、人员、任务主数据与统一身份。</p>
          <ul className="mt-3 space-y-1 text-sm text-blue-700">
            <li>
              <Link href="/api/projects">GET /api/projects</Link>
            </li>
            <li>
              <Link href="/api/persons">GET /api/persons</Link>
            </li>
            <li>
              <span className="text-slate-500">域锚点：</span> {businessDomains.projectMasterData.label}
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">规则与指标管理</h2>
          <p className="mt-2 text-sm text-slate-600">指标契约、治理快照与质量口径。</p>
          <ul className="mt-3 space-y-1 text-sm text-blue-700">
            <li>
              <Link href="/api/metrics">GET /api/metrics</Link>
            </li>
            <li>
              <Link href="/api/data-governance?scope=portfolio">GET /api/data-governance</Link>
            </li>
            <li>
              <Link href="/api/quality">GET /api/quality</Link>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">运行任务管理</h2>
          <p className="mt-2 text-sm text-slate-600">输入事件、写回与导出作业。</p>
          <ul className="mt-3 space-y-1 text-sm text-blue-700">
            <li>
              <Link href="/api/input-events">GET /api/input-events</Link>
            </li>
            <li>
              <Link href="/api/writeback">GET /api/writeback</Link>
            </li>
            <li>
              <Link href="/input-inbox">输入收件箱 UI</Link>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">问题与审计管理</h2>
          <p className="mt-2 text-sm text-slate-600">线上问题、预警与复盘收口。</p>
          <ul className="mt-3 space-y-1 text-sm text-blue-700">
            <li>
              <Link href="/api/live-issues">GET /api/live-issues</Link>
            </li>
            <li>
              <Link href="/api/alerting">GET /api/alerting</Link>
            </li>
            <li>
              <Link href="/closeout">Closeout / Runbook</Link>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 md:col-span-2 xl:col-span-1">
          <h2 className="font-medium text-slate-900">演示与种子数据管理</h2>
          <p className="mt-2 text-sm text-slate-600">本地持久化与演示数据说明（非生产终态）。</p>
          <ul className="mt-3 space-y-1 text-sm text-blue-700">
            <li>
              <Link href="/api/health">GET /api/health</Link>
            </li>
            <li>
              <span className="text-slate-600">种子与 mock：</span>
              <code className="text-xs">src/data/*</code>、<code className="text-xs">.pmw-data/*</code>
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-800">业务域注册（代码锚点）</p>
        <p className="mt-2">
          九域聚合入口：<code className="text-xs">src/server/domains/business-domains.ts</code>；读模型门面：{' '}
          <code className="text-xs">readModelService</code>。
        </p>
      </section>
    </PageContainer>
  );
}
