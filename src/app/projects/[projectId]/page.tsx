import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { documentRecords } from '@/data/docs';
import { projects } from '@/data/projects';
import { tasks } from '@/data/tasks';
import { versions } from '@/data/versions';

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const project = projects.find((item) => item.id === params.projectId);
  if (!project) notFound();

  const projectTasks = tasks.filter((item) => item.projectId === project.id).slice(0, 5);
  const projectVersions = versions.filter((item) => item.projectId === project.id).slice(0, 3);
  const projectDocs = documentRecords.filter((item) => item.projectId === project.id).slice(0, 4);

  return (
    <PageContainer>
      <PageHeader title={`${project.name} (${project.code})`} description={project.summary} />
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2">
          <h2 className="mb-3 font-medium">项目基础信息</h2>
          <div className="space-y-2 text-sm">
            <p><strong>项目目标：</strong>{project.scope}</p>
            <p><strong>非范围：</strong>{project.nonScope}</p>
            <p><strong>当前阶段：</strong>{project.phase}</p>
            <p><strong>当前主对象：</strong>{project.name}</p>
            <p><strong>当前版本：</strong>{project.currentVersion}</p>
            <p><strong>当前主控文档：</strong>{project.mainDocument}</p>
          </div>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-medium">状态与风险</h2>
          <div className="space-y-2 text-sm">
            <StatusBadge label={project.status} tone={project.status === 'active' ? 'success' : 'warning'} />
            <p>封板：{project.isSealed ? '是' : '否'}</p>
            <p>归档：{project.isArchived ? '是' : '否'}</p>
            <p>阻塞项：{project.isSealed ? '封板期间仅允许修复' : '暂无严重阻塞'}</p>
          </div>
        </article>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-4"><h3 className="mb-2 font-medium">任务摘要</h3><ul className="space-y-2 text-sm">{projectTasks.map((task) => <li key={task.id}>{task.title} · {task.status}</li>)}</ul></article>
        <article className="rounded-lg border border-slate-200 bg-white p-4"><h3 className="mb-2 font-medium">版本摘要</h3><ul className="space-y-2 text-sm">{projectVersions.map((item) => <li key={item.id}>{item.version} · {item.status}</li>)}</ul></article>
        <article className="rounded-lg border border-slate-200 bg-white p-4"><h3 className="mb-2 font-medium">文档索引</h3><ul className="space-y-2 text-sm">{projectDocs.map((doc) => <li key={doc.id}>{doc.title}</li>)}</ul></article>
      </div>
    </PageContainer>
  );
}
