import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { InputInboxWorkbench } from '@/components/input-events/input-inbox-workbench';
import { Suspense } from 'react';
import { AccessGuard } from '@/components/identity/access-guard';
import { readModelService } from '@/server/read-models/read-model-service';

export default function InputInboxPage() {
  const inbox = readModelService.getInputInboxSnapshot();
  return (
    <PageContainer>
      <PageHeader
        title="输入收件箱"
        description={`把零散输入收拢成可写回事件：原始 ${inbox.rawCount} · 草稿 ${inbox.draftPendingCount} · 已确认 ${inbox.confirmedCount}（${inbox.readModelKey}）。`}
      />
      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading input inbox…</div>}>
        <AccessGuard permission="view:input-inbox">
          <InputInboxWorkbench />
        </AccessGuard>
      </Suspense>
    </PageContainer>
  );
}

