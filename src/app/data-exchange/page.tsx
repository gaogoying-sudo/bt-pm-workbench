import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { DataExchangeWorkbench } from '@/components/data-exchange/data-exchange-workbench';
import { Suspense } from 'react';

export default function DataExchangePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Data Exchange / 导入导出"
        description="外部协同骨架：import preview/apply、export bundle/history、external mapping 与 readiness 消费入口。"
      />
      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading data exchange…</div>}>
        <DataExchangeWorkbench />
      </Suspense>
    </PageContainer>
  );
}

