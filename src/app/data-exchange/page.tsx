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
        title="数据交换"
        description={`导入 / 导出 / 外部映射（演示）：就绪条目 ${readiness.summaries.length}（${readiness.readModelKey}）。`}
      />
      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading data exchange…</div>}>
        <DataExchangeWorkbench />
      </Suspense>
    </PageContainer>
  );
}

