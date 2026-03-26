import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { ProjectDetailTabs } from '@/components/projects/project-detail-tabs';
import { ProjectProgressWorkbench } from '@/components/project-progress/project-progress-workbench';
import { Suspense } from 'react';
import { manpowerProjects } from '@/data/manpower/manpower-projects';
import { notFound } from 'next/navigation';
import { resolveProjectId } from '@/lib/identity/unified-project-registry';

export default function ProjectProgressTabPage({ params }: { params: { projectId: string } }) {
  const canonicalId = resolveProjectId(params.projectId);
  const exists = manpowerProjects.some((p) => p.id === canonicalId);
  if (!exists) notFound();

  return (
    <PageContainer>
      <ProjectDetailTabs projectId={params.projectId} activeKey="progress" />
      <PageHeader
        title="Project Progress / 项目进度"
        description="项目内进度视角：复用快照对比、阶段拆解、质量与风险聚合。"
      />
      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading progress…</div>}>
        <ProjectProgressWorkbench fixedProjectId={canonicalId} hideProjectFilter />
      </Suspense>
    </PageContainer>
  );
}

