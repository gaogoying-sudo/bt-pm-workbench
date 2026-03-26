import Link from 'next/link';
import { CurrentUserSwitcher } from '@/components/identity/current-user-provider';
import { IconArrows, IconChart, IconFolder, IconInbox, IconUser } from '@/components/ui/icons';
import type { ReactNode } from 'react';

const primaryLinks: Array<{ label: string; href: string; icon: ReactNode }> = [
  { label: '我的工作台', href: '/me', icon: <IconUser /> },
  { label: '项目', href: '/projects', icon: <IconFolder /> },
  { label: '输入收件箱', href: '/input-inbox', icon: <IconInbox /> },
  { label: '驾驶舱', href: '/executive-dashboard', icon: <IconChart /> },
  { label: '数据交换', href: '/data-exchange', icon: <IconArrows /> }
];

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/80 px-6 backdrop-blur">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-900/20">
            <IconChart size={18} />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">项目运营工作台</p>
            <p className="text-[11px] text-slate-400">PM Workbench</p>
          </div>
        </div>
        <nav className="hidden flex-wrap gap-1 text-sm md:flex">
          {primaryLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-slate-600 hover:bg-blue-50 hover:text-slate-900"
            >
              <span className="text-slate-400">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <CurrentUserSwitcher />
        <Link className="pmw-btn" href="/login">
          登录
        </Link>
        <span className="hidden rounded-xl border border-slate-200/70 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 md:inline-flex">
          演示数据
        </span>
      </div>
    </header>
  );
}
