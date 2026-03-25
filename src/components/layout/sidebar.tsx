import Link from 'next/link';

interface NavGroup {
  label: string;
  items: [string, string][];
}

const navGroups: NavGroup[] = [
  {
    label: '核心运行视图 / Core Views',
    items: [
      ['驾驶舱 / Dashboard', '/dashboard'],
      ['项目列表 / Projects', '/projects'],
      ['任务执行 / Task Execution', '/task-execution'],
      ['项目进度 / Project Progress', '/project-progress'],
      ['版本推进 / Version Governance', '/version-governance'],
      ['管理驾驶舱 / Executive Dashboard', '/executive-dashboard']
    ]
  },
  {
    label: '资源与成本 / Resources & Cost',
    items: [
      ['人员与资源 / People & Resources', '/people-resources'],
      ['人力成本 / Manpower Cost', '/manpower-cost']
    ]
  },
  {
    label: '索引与治理 / Index & Governance',
    items: [
      ['输入收件箱 / Input Inbox', '/input-inbox'],
      ['任务索引 / Tasks (Legacy)', '/tasks'],
      ['版本索引 / Versions', '/versions'],
      ['文档索引 / Docs Index', '/docs-index'],
      ['变更记录 / Change Log', '/change-log']
    ]
  },
  {
    label: '辅助 / Auxiliary',
    items: [
      ['参考资料 / References', '/references'],
      ['设置 / Settings', '/settings']
    ]
  }
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-50 px-4 py-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">PM-WORKBENCH</p>
        <p className="mt-1 text-sm text-slate-700">Multi-Project Operating Workbench</p>
      </div>
      <nav className="space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(([label, href]) => (
                <Link key={href} href={href} className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-white hover:text-slate-900">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
