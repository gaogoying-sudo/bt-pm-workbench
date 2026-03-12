import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { projects } from '@/data/projects';
import { formatDate } from '@/lib/utils/format';

export default function ProjectsPage() {
  return (
    <PageContainer>
      <PageHeader title="Projects" description="项目总览，支持后续扩展筛选和搜索。" />
      <div className="mb-4 flex gap-3">
        <input className="w-64 rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="搜索项目（占位）" />
        <select className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option>按状态筛选（占位）</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">项目</th><th className="px-4 py-3">阶段</th><th className="px-4 py-3">状态</th><th className="px-4 py-3">主控文档</th><th className="px-4 py-3">当前版本</th><th className="px-4 py-3">更新时间</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-slate-100">
                <td className="px-4 py-3"><Link href={`/projects/${project.id}`} className="font-medium text-blue-700">{project.name}</Link><div className="text-xs text-slate-500">{project.code}</div></td>
                <td className="px-4 py-3">{project.phase}</td>
                <td className="px-4 py-3"><StatusBadge label={project.status} tone={project.isSealed ? 'warning' : 'default'} /></td>
                <td className="px-4 py-3">{project.mainDocument}</td>
                <td className="px-4 py-3">{project.currentVersion}</td>
                <td className="px-4 py-3">{formatDate(project.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
