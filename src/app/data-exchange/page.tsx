import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { DataExchangeWorkbench } from '@/components/data-exchange/data-exchange-workbench';
import { Suspense } from 'react';
import { readModelService } from '@/server/read-models/read-model-service';

export default function DataExchangePage() {
  const readiness = readModelService.getReadinessSummarySnapshot();
  return (
    <PageContainer>
      <PageHeader
        title="Data Exchange / 导入导出"
        description={`外部协同域：import/export API、bindings、readiness_summary_snapshot（项目就绪条目 ${readiness.summaries.length}）。`}
      />
      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading data exchange…</div>}>
        <DataExchangeWorkbench />
      </Suspense>
    </PageContainer>
  );
}

