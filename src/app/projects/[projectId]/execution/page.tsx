import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { Suspense } from 'react';
import { TaskExecutionWorkbench } from '@/components/task-execution/task-execution-workbench';
import { ProjectDetailTabs } from '@/components/projects/project-detail-tabs';
import { notFound } from 'next/navigation';
import { manpowerProjects } from '@/data/manpower/manpower-projects';
import { resolveProjectId } from '@/lib/identity/unified-project-registry';

export default function ProjectExecutionPage({ params }: { params: { projectId: string } }) {
  const canonicalId = resolveProjectId(params.projectId);
  const exists = manpowerProjects.some((p) => p.id === canonicalId);
  if (!exists) notFound();

  return (
    <PageContainer>
      <ProjectDetailTabs projectId={params.projectId} activeKey="execution" />
      <PageHeader
        title="Project Execution / 执行"
        description="项目内的任务执行聚合：任务主链路、依赖、风险提示与写回准备。"
      />
      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading execution…</div>}>
        <TaskExecutionWorkbench fixedProjectId={canonicalId} hideProjectFilter />
      </Suspense>
    </PageContainer>
  );
}

