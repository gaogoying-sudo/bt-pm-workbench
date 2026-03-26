import Link from 'next/link';

export type ProjectDetailTabKey = 'overview' | 'execution' | 'progress' | 'version' | 'resources' | 'reviews';

const tabs: Array<{ key: ProjectDetailTabKey; label: string; href: (projectId: string) => string }> = [
  { key: 'overview', label: '概览 / Overview', href: (projectId) => `/projects/${projectId}` },
  { key: 'execution', label: '执行 / Execution', href: (projectId) => `/projects/${projectId}/execution` },
  { key: 'progress', label: '进度 / Progress', href: (projectId) => `/projects/${projectId}/progress` },
  { key: 'version', label: '版本 / Version', href: (projectId) => `/projects/${projectId}/version` },
  { key: 'resources', label: '资源 / Resources', href: (projectId) => `/projects/${projectId}/resources` },
  { key: 'reviews', label: '复盘 / Reviews', href: (projectId) => `/projects/${projectId}/reviews` }
];

export function ProjectDetailTabs({
  projectId,
  activeKey
}: {
  projectId: string;
  activeKey: ProjectDetailTabKey;
}) {
  return (
    <nav className="mb-4 rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.href(projectId)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              t.key === activeKey
                ? 'border border-slate-900 bg-slate-900 text-white'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

