import Link from 'next/link';
import { IconChart, IconChevronRight, IconFolder, IconInbox, IconTag, IconUser } from '@/components/ui/icons';

export type ProjectDetailTabKey = 'overview' | 'execution' | 'progress' | 'version' | 'resources' | 'reviews';

const tabs: Array<{ key: ProjectDetailTabKey; label: string; hint: string; icon: React.ReactNode; href: (projectId: string) => string }> = [
  { key: 'overview', label: '概览', hint: '总览', icon: <IconFolder />, href: (projectId) => `/projects/${projectId}` },
  { key: 'execution', label: '执行', hint: '任务', icon: <IconInbox />, href: (projectId) => `/projects/${projectId}/execution` },
  { key: 'progress', label: '进度', hint: '快照', icon: <IconChart />, href: (projectId) => `/projects/${projectId}/progress` },
  { key: 'version', label: '版本', hint: '治理', icon: <IconTag />, href: (projectId) => `/projects/${projectId}/version` },
  { key: 'resources', label: '资源', hint: '人力', icon: <IconUser />, href: (projectId) => `/projects/${projectId}/resources` },
  { key: 'reviews', label: '复盘', hint: '决策', icon: <IconChevronRight />, href: (projectId) => `/projects/${projectId}/reviews` }
];

export function ProjectDetailTabs({
  projectId,
  activeKey
}: {
  projectId: string;
  activeKey: ProjectDetailTabKey;
}) {
  return (
    <nav className="mb-4 rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2 shadow-sm shadow-slate-900/5 backdrop-blur">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.href(projectId)}
            className={`group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
              t.key === activeKey
                ? 'border border-blue-300/60 bg-blue-600 text-white shadow-sm shadow-blue-900/20'
                : 'border border-slate-200/70 bg-white/80 text-slate-700 hover:bg-blue-50'
            }`}
          >
            <span className={`${t.key === activeKey ? 'text-white/90' : 'text-slate-400 group-hover:text-blue-600'}`}>
              {t.icon}
            </span>
            <span className="font-medium">{t.label}</span>
            <span className={`${t.key === activeKey ? 'text-white/70' : 'text-slate-400'} text-[11px]`}>{t.hint}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

