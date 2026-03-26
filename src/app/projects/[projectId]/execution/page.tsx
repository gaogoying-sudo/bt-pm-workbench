import { PageHeader } from '@/components/ui/page-header';
import { Suspense } from 'react';
import { TaskExecutionWorkbench } from '@/components/task-execution/task-execution-workbench';
import { notFound } from 'next/navigation';
import { manpowerProjects } from '@/data/manpower/manpower-projects';
import { resolveProjectId } from '@/lib/identity/unified-project-registry';

export default function ProjectExecutionPage({ params }: { params: { projectId: string } }) {
  const canonicalId = resolveProjectId(params.projectId);
  const exists = manpowerProjects.some((p) => p.id === canonicalId);
  if (!exists) notFound();

  return (
    <>
      <PageHeader
        title="Project Execution / 执行"
        description="消费 project_execution_snapshot + 任务执行域 / 输入事件域；写回经 input-event 与 writeback。"
      />
      <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading execution…</div>}>
        <TaskExecutionWorkbench fixedProjectId={canonicalId} hideProjectFilter />
      </Suspense>
    </>
  );
}

