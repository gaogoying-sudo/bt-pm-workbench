import { PageContainer } from '@/components/layout/page-container';
import { ExecutiveDashboardWorkbench } from '@/components/executive-dashboard/executive-dashboard-workbench';
import { Suspense } from 'react';
import { AccessGuard } from '@/components/identity/access-guard';
import { readModelService } from '@/server/read-models/read-model-service';

export default function ExecutiveDashboardPage() {
  const portfolio = readModelService.getExecutivePortfolioSnapshot();
  return (
    <PageContainer>
      <p className="mb-3 text-xs text-slate-500">
        Read model: {portfolio.readModelKey} · {portfolio.generatedAt} · 组合概览项目数 {portfolio.overview.totalProjects}
      </p>
      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading executive dashboard…</div>}>
        <AccessGuard permission="view:executive-dashboard">
          <ExecutiveDashboardWorkbench />
        </AccessGuard>
      </Suspense>
    </PageContainer>
  );
}
