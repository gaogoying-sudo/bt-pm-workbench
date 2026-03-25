import { PageContainer } from '@/components/layout/page-container';
import { ExecutiveDashboardWorkbench } from '@/components/executive-dashboard/executive-dashboard-workbench';
import { Suspense } from 'react';

export default function ExecutiveDashboardPage() {
  return (
    <PageContainer>
      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading executive dashboard…</div>}>
        <ExecutiveDashboardWorkbench />
      </Suspense>
    </PageContainer>
  );
}
