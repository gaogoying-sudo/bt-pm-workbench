import Link from 'next/link';
import { IconArrows, IconChart, IconFolder, IconInbox, IconPlus, IconShield, IconUser } from '@/components/ui/icons';
import type { ReactNode } from 'react';

interface NavGroup {
  label: string;
  items: Array<{ label: string; href: string; icon?: ReactNode; note?: string }>;
}

const navGroups: NavGroup[] = [
  {
    label: '一级入口 / Primary',
    items: [
      { label: '登录', href: '/login', icon: <IconShield /> },
      { label: '我的工作台', href: '/me', icon: <IconUser /> },
      { label: '项目', href: '/projects', icon: <IconFolder /> },
      { label: '输入收件箱', href: '/input-inbox', icon: <IconInbox /> },
      { label: '管理驾驶舱', href: '/executive-dashboard', icon: <IconChart /> },
      { label: '数据交换', href: '/data-exchange', icon: <IconArrows /> }
    ]
  },
  {
    label: '辅助 / Auxiliary',
    items: [
      { label: '新建项目', href: '/projects/new', icon: <IconPlus />, note: '演示/种子' },
      { label: '个人资料', href: '/profile', icon: <IconUser />, note: '身份' },
      { label: '后台管理', href: '/admin', icon: <IconShield />, note: '治理' }
    ]
  },
  // Legacy/旧能力页面不进入主导航：通过内部 redirect/提示或项目内页签替代。
];

export function Sidebar() {
  return (
    <aside className="w-72 border-r border-slate-200/70 bg-white/70 px-4 py-6 backdrop-blur">
      <div className="mb-6 rounded-2xl border border-slate-200/70 bg-gradient-to-b from-blue-50 to-white p-4 shadow-sm shadow-slate-900/5">
        <p className="text-xs font-semibold tracking-wide text-slate-500">PM WORKBENCH</p>
        <p className="mt-1 text-base font-semibold text-slate-900">项目运营工作台</p>
        <p className="mt-1 text-xs text-slate-400">浅蓝主题 · 中文优先 · 演示友好</p>
      </div>
      <nav className="space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-slate-400">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-slate-900"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-slate-400 group-hover:text-blue-600">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </span>
                  {item.note ? <span className="text-[11px] text-slate-400">{item.note}</span> : null}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
