import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { AccessGuard } from '@/components/identity/access-guard';

export default function ProjectsNewPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Projects New / 新建项目"
        description="第 1 包只补齐创建入口骨架：不在本轮实现完整写模型与持久化终态（第 2 包继续）。"
      />

      <AccessGuard permission="view:projects">
        <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Creation form (placeholder)</h2>
          <p className="mt-2 text-sm text-slate-600">当前系统以 seed/mock 数据为主；本页面只提供结构化入口。</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="project name (placeholder)" />
            <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white" type="button" disabled>
              Create (disabled)
            </button>
            <Link className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" href="/projects">
              Back to Projects
            </Link>
          </div>
        </section>
      </AccessGuard>
    </PageContainer>
  );
}

