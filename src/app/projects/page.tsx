import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { SnapshotContextPanel } from '@/components/shared/snapshot-context-panel';
import { SourceContextPanel } from '@/components/shared/source-context-panel';
import { readModelService } from '@/server/read-models/read-model-service';
import { buildSnapshotContext } from '@/lib/snapshots/snapshot-helpers';
import { formatDate } from '@/lib/utils/format';

export default function ProjectsPage() {
  const { projects, readModelKey, generatedAt } = readModelService.getProjectListSnapshot();
  const snapshotContext = buildSnapshotContext({
    notes: `项目列表 read model: ${readModelKey} @ ${generatedAt}（项目主数据域 + executive list）。`
  });

  return (
    <PageContainer>
      <PageHeader title="项目列表" description="统一项目入口：以项目为中心进入详情页签（执行 / 进度 / 版本 / 资源 / 复盘）。" />

      <div className="mb-4 flex gap-3">
        <input className="w-64 rounded-xl border border-slate-200/70 px-3 py-2 text-sm shadow-sm shadow-slate-900/5" placeholder="搜索项目（占位）" />
        <select className="rounded-xl border border-slate-200/70 px-3 py-2 text-sm shadow-sm shadow-slate-900/5">
          <option>按状态筛选（占位）</option>
        </select>
      </div>

      <div className="pmw-surface overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-50/60 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">项目</th>
              <th className="px-4 py-3">阶段</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">人力数据</th>
              <th className="px-4 py-3">版本</th>
              <th className="px-4 py-3">更新时间</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-slate-100 hover:bg-blue-50/30">
                <td className="px-4 py-3">
                  <Link href={`/projects/${project.id}`} className="font-medium text-blue-700 hover:text-blue-800">
                    {project.displayName}
                  </Link>
                  <div className="text-xs text-slate-500">{project.code} · {project.canonicalId}</div>
                </td>
                <td className="px-4 py-3">{project.phase}</td>
                <td className="px-4 py-3"><StatusBadge label={project.status} tone={project.isSealed ? 'warning' : 'default'} /></td>
                <td className="px-4 py-3">
                  <StatusBadge label={project.hasManpowerData ? '已接入' : '未接入'} tone={project.hasManpowerData ? 'success' : 'muted'} />
                </td>
                <td className="px-4 py-3">{project.currentVersion}</td>
                <td className="px-4 py-3">{formatDate(project.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-4 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <SourceContextPanel
          title="数据来源"
          sources={[
            { name: readModelKey, detail: `生成时间 ${generatedAt}；底层仍经 projectService.listProjects。` },
            { name: 'unified-project-registry', detail: '统一项目身份注册表。' }
          ]}
        />
        <SnapshotContextPanel title="快照口径" context={snapshotContext} />
      </section>
    </PageContainer>
  );
}
