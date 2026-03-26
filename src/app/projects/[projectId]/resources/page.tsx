import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { ProjectDetailTabs } from '@/components/projects/project-detail-tabs';
import { PeopleResourcesWorkbench } from '@/components/resources/people-resources-workbench';
import { ManpowerCostWorkbench } from '@/components/manpower/manpower-cost-workbench';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { manpowerProjects } from '@/data/manpower/manpower-projects';
import { resolveProjectId } from '@/lib/identity/unified-project-registry';

export default function ProjectResourcesTabPage({ params }: { params: { projectId: string } }) {
  const canonicalId = resolveProjectId(params.projectId);
  const exists = manpowerProjects.some((p) => p.id === canonicalId);
  if (!exists) notFound();

  return (
    <PageContainer>
      <ProjectDetailTabs projectId={params.projectId} activeKey="resources" />
      <PageHeader
        title="Project Resources / 资源与成本"
        description="项目视角资源中心：人员负载、角色归属、allocation 与成本对比（v0 mock）。"
      />

      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading people resources…</div>}>
        <PeopleResourcesWorkbench fixedProjectId={canonicalId} hideProjectFilter />
      </Suspense>

      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading manpower cost…</div>}>
        <ManpowerCostWorkbench fixedProjectId={canonicalId} hideProjectFilter />
      </Suspense>
    </PageContainer>
  );
}

