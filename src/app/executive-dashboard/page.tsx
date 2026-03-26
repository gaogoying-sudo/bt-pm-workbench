import { PageContainer } from '@/components/layout/page-container';
import { ExecutiveDashboardWorkbench } from '@/components/executive-dashboard/executive-dashboard-workbench';
import { Suspense } from 'react';
import { AccessGuard } from '@/components/identity/access-guard';
import { readModelService } from '@/server/read-models/read-model-service';

export default function ExecutiveDashboardPage() {
  const portfolio = readModelService.getExecutivePortfolioSnapshot();
  return (
    <PageContainer>
      <div className="pmw-surface-muted mb-4 flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs text-slate-500">
        <span>
          组合概览：项目数 <span className="font-semibold text-slate-700">{portfolio.overview.totalProjects}</span>
        </span>
        <span className="font-mono">
          {portfolio.readModelKey} · {portfolio.generatedAt}
        </span>
      </div>
      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading executive dashboard…</div>}>
        <AccessGuard permission="view:executive-dashboard">
          <ExecutiveDashboardWorkbench />
        </AccessGuard>
      </Suspense>
    </PageContainer>
  );
}
