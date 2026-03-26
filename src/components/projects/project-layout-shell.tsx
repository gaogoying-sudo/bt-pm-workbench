'use client';

import { usePathname } from 'next/navigation';
import { ProjectDetailTabs, type ProjectDetailTabKey } from '@/components/projects/project-detail-tabs';
import type { ProjectDetailSnapshot } from '@/lib/types/project-detail';
import { StatusBadge } from '@/components/ui/status-badge';
import { IconChart, IconFolder, IconTag } from '@/components/ui/icons';

function deriveActiveTab(pathname: string, projectId: string): ProjectDetailTabKey {
  const base = `/projects/${projectId}`;
  if (pathname === base || pathname === `${base}/`) return 'overview';
  if (pathname.includes('/execution')) return 'execution';
  if (pathname.includes('/progress')) return 'progress';
  if (pathname.includes('/version')) return 'version';
  if (pathname.includes('/resources')) return 'resources';
  if (pathname.includes('/reviews')) return 'reviews';
  return 'overview';
}

export function ProjectLayoutShell({
  projectId,
  snapshot
}: {
  projectId: string;
  snapshot: ProjectDetailSnapshot;
}) {
  const pathname = usePathname();
  const activeKey = deriveActiveTab(pathname, projectId);

  return (
    <div className="mb-4 space-y-3">
      <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-4 shadow-sm shadow-slate-900/5 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="pmw-title text-xl font-semibold text-slate-900">{snapshot.projectName}</h1>
              <span className="text-xs text-slate-400">
                {snapshot.projectCode} · <span className="font-mono">{snapshot.projectId}</span>
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{snapshot.basicSummary}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={`阶段：${snapshot.execution.currentStage ?? '—'}`} tone="muted" />
            <StatusBadge label={`状态：${snapshot.execution.status}`} tone={snapshot.execution.status === 'blocked' ? 'danger' : snapshot.execution.status === 'at-risk' ? 'warning' : 'success'} />
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="pmw-surface-muted flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-xs text-slate-500">项目进度</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 drop-shadow-sm">
                {Math.round((snapshot.execution.progress ?? 0) * 100)}%
              </p>
            </div>
            <span className="text-blue-600">
              <IconChart />
            </span>
          </div>
          <div className="pmw-surface-muted flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-xs text-slate-500">版本</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 drop-shadow-sm">{snapshot.version.versionName ?? '—'}</p>
            </div>
            <span className="text-blue-600">
              <IconTag />
            </span>
          </div>
          <div className="pmw-surface-muted flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-xs text-slate-500">阻塞 / 高风险</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 drop-shadow-sm">
                {snapshot.execution.blockedTaskCount ?? 0} / {snapshot.execution.highRiskTaskCount ?? 0}
              </p>
            </div>
            <span className="text-blue-600">
              <IconFolder />
            </span>
          </div>
        </div>
      </div>
      <ProjectDetailTabs projectId={projectId} activeKey={activeKey} />
    </div>
  );
}
