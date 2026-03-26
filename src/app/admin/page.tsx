import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import Link from 'next/link';
import { AccessGuard } from '@/components/identity/access-guard';

export default function AdminPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Admin / 后台管理"
        description="第 1 包只做后台入口骨架：把维护治理与种子数据管理入口收口到一个页面（后续第 2 包补齐 RBAC）。"
      />

      <section className="mt-4 grid gap-4 md:grid-cols-2">
        <AccessGuard permission="view:executive-dashboard">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="font-medium text-slate-900">Runbook & Maintenance</h2>
            <p className="mt-2 text-sm text-slate-600">用于上线后维护治理、规则校正和已知问题回收。</p>
            <div className="mt-3">
              <Link className="text-sm text-blue-700" href="/closeout">
                打开 Closeout / Runbook
              </Link>
            </div>
          </div>
        </AccessGuard>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Seed Data Management (placeholder)</h2>
          <p className="mt-2 text-sm text-slate-600">本轮没有做生产级数据管理界面；第 2 包继续把 mock/seed 数据变成可管理的域模型。</p>
          <div className="mt-3 text-xs text-slate-500">当前无需额外页面。</div>
        </div>
      </section>
    </PageContainer>
  );
}

