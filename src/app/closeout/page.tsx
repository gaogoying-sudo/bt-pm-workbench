import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { CloseoutWorkbench } from '@/components/closeout/closeout-workbench';
import { Suspense } from 'react';

export default function CloseoutPage() {
  return (
    <PageContainer>
      <PageHeader title="Closeout / 最终验收" description="最终验收清单、发布就绪、已知缺口、管理走查与 demo 路径集中入口。" />
      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading closeout pack…</div>}>
        <CloseoutWorkbench />
      </Suspense>
    </PageContainer>
  );
}

