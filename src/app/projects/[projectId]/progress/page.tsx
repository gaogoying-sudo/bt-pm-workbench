import { PageHeader } from '@/components/ui/page-header';
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
    <>
      <PageHeader
        title="进度"
        description="消费 project_progress_snapshot + 快照与治理域、风险与质量域。"
      />
      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading progress…</div>}>
        <ProjectProgressWorkbench fixedProjectId={canonicalId} hideProjectFilter />
      </Suspense>
    </>
  );
}

