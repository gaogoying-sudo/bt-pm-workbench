import { PageHeader } from '@/components/ui/page-header';
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
    <>
      <PageHeader
        title="资源与成本"
        description="消费 resource_manpower_snapshot + 身份与组织域（人员）与资源与人力投入域。"
      />

      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading people resources…</div>}>
        <PeopleResourcesWorkbench fixedProjectId={canonicalId} hideProjectFilter />
      </Suspense>

      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading manpower cost…</div>}>
        <ManpowerCostWorkbench fixedProjectId={canonicalId} hideProjectFilter />
      </Suspense>
    </>
  );
}

