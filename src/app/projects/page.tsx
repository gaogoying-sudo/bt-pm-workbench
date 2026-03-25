import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { SnapshotContextPanel } from '@/components/shared/snapshot-context-panel';
import { SourceContextPanel } from '@/components/shared/source-context-panel';
import { projectService } from '@/server/services/project-service';
import { buildSnapshotContext } from '@/lib/snapshots/snapshot-helpers';
import { formatDate } from '@/lib/utils/format';

export default function ProjectsPage() {
  const projects = projectService.listProjects();
  const snapshotContext = buildSnapshotContext({ notes: '项目列表通过 project-service 统一获取。' });

  return (
    <PageContainer>
      <PageHeader title="项目列表 / Projects" description="统一项目总入口 — 通过 project-service 接入，消费统一身份注册表。" />

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
              <th className="px-4 py-3">项目 / Project</th>
              <th className="px-4 py-3">阶段 / Phase</th>
              <th className="px-4 py-3">状态 / Status</th>
              <th className="px-4 py-3">人力数据 / Manpower</th>
              <th className="px-4 py-3">版本 / Version</th>
              <th className="px-4 py-3">更新时间 / Updated</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <Link href={`/projects/${project.id}`} className="font-medium text-blue-700">{project.displayName}</Link>
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
          title="数据来源 / Source Context"
          sources={[
            { name: 'project-service', detail: '统一项目服务层，融合 base project + manpower project + unified identity。' },
            { name: 'unified-project-registry', detail: '统一项目身份注册表，消除 projectIdMap。' }
          ]}
        />
        <SnapshotContextPanel title="快照口径 / Snapshot Context" context={snapshotContext} />
      </section>
    </PageContainer>
  );
}
