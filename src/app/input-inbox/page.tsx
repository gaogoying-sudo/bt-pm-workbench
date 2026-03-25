import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { InputInboxWorkbench } from '@/components/input-events/input-inbox-workbench';
import { Suspense } from 'react';

export default function InputInboxPage() {
  return (
    <PageContainer>
      <PageHeader
        title="输入收件箱 / Input Inbox"
        description="低摩擦输入 → 结构化草稿 → 人工确认 → 写回链路。此页是统一输入事件层的轻量入口与确认队列。"
      />
      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading input inbox…</div>}>
        <InputInboxWorkbench />
      </Suspense>
    </PageContainer>
  );
}

