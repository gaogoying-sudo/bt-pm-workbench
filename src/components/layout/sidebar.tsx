import Link from 'next/link';

interface NavGroup {
  label: string;
  items: [string, string][];
}

const navGroups: NavGroup[] = [
  {
    label: '一级入口 / Primary',
    items: [
      ['登录 / Login', '/login'],
      ['我的工作台 / Me', '/me'],
      ['项目列表 / Projects', '/projects'],
      ['输入收件箱 / Input Inbox', '/input-inbox'],
      ['管理驾驶舱 / Executive Dashboard', '/executive-dashboard'],
      ['导入导出 / Data Exchange', '/data-exchange']
    ]
  },
  {
    label: '辅助 / Auxiliary',
    items: [
      ['新建项目 / Projects New', '/projects/new'],
      ['个人资料 / Profile', '/profile'],
      ['后台管理 / Admin', '/admin']
    ]
  },
  // Legacy/旧能力页面不进入主导航：通过内部 redirect/提示或项目内页签替代。
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
