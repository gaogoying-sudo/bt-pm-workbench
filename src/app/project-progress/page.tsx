import { PageContainer } from '@/components/layout/page-container';
import { ProjectProgressWorkbench } from '@/components/project-progress/project-progress-workbench';
import { Suspense } from 'react';

export default function ProjectProgressPage() {
  return (
    <PageContainer>
      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading project progress…</div>}>
        <ProjectProgressWorkbench />
      </Suspense>
    </PageContainer>
  );
}
