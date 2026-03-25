import { PageContainer } from '@/components/layout/page-container';
import { VersionGovernanceWorkbench } from '@/components/version-governance/version-governance-workbench';
import { Suspense } from 'react';

export default function VersionGovernancePage() {
  return (
    <PageContainer>
      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading version governance…</div>}>
        <VersionGovernanceWorkbench />
      </Suspense>
    </PageContainer>
  );
}
