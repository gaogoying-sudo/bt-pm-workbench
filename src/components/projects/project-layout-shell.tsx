'use client';

import { usePathname } from 'next/navigation';
import { ProjectDetailTabs, type ProjectDetailTabKey } from '@/components/projects/project-detail-tabs';
import type { ProjectDetailSnapshot } from '@/lib/types/project-detail';

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
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{snapshot.projectName}</h1>
            <p className="mt-1 text-sm text-slate-600">{snapshot.basicSummary}</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>
              {snapshot.projectCode} · route <span className="font-mono">{snapshot.projectId}</span>
            </div>
            <div className="mt-1">
              阶段 / Stage: {snapshot.execution.currentStage ?? '—'} · 状态 / Status: {snapshot.execution.status}
            </div>
          </div>
        </div>
      </div>
      <ProjectDetailTabs projectId={projectId} activeKey={activeKey} />
    </div>
  );
}
