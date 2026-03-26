import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { AccessGuard } from '@/components/identity/access-guard';
import { projectService } from '@/server/services/project-service';

export default function ProjectsNewPage() {
  const existing = projectService.listProjects().slice(0, 5);

  return (
    <PageContainer>
      <PageHeader
        title="新建项目"
        description="最小可运行：提供创建入口与主数据查看；完整写模型持久化留到后续小任务。"
      />

      <AccessGuard permission="view:projects">
        <section className="pmw-surface mt-4 p-4">
          <h2 className="font-medium text-slate-900">主数据 API</h2>
          <p className="mt-2 text-sm text-slate-600">
            当前创建仍以 seed 为主；可通过{' '}
            <Link className="text-blue-700" href="/api/projects">
              /api/projects
            </Link>{' '}
            校验项目主数据域列表。
          </p>
        </section>

        <section className="pmw-surface mt-4 p-4">
          <h2 className="font-medium text-slate-900">已有项目（种子）</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {existing.map((p) => (
              <li key={p.id}>
                <Link className="font-medium text-blue-700" href={`/projects/${p.id}`}>
                  {p.displayName}
                </Link>
                <span className="text-slate-500"> · {p.code}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="pmw-surface mt-4 p-4">
          <h2 className="font-medium text-slate-900">创建表单（占位）</h2>
          <p className="mt-2 text-sm text-slate-600">POST 写回项目主数据尚未在本包开通；避免与种子数据冲突。</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="rounded-xl border border-slate-200/70 px-3 py-2 text-sm shadow-sm shadow-slate-900/5" placeholder="项目名称（占位）" disabled />
            <button className="rounded-xl bg-slate-200 px-3 py-2 text-sm text-slate-500" type="button" disabled>
              创建（未启用）
            </button>
            <Link className="pmw-btn" href="/projects">
              返回项目列表
            </Link>
          </div>
        </section>
      </AccessGuard>
    </PageContainer>
  );
}
