import Link from 'next/link';
import { CurrentUserSwitcher } from '@/components/identity/current-user-provider';

const primaryLinks: [string, string][] = [
  ['Me', '/me'],
  ['Projects', '/projects'],
  ['Inbox', '/input-inbox'],
  ['Executive', '/executive-dashboard'],
  ['Exchange', '/data-exchange'],
  ['Login', '/login']
];

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-sm font-medium text-slate-800">BT PM Workbench</p>
        <nav className="flex flex-wrap gap-2 text-sm">
          {primaryLinks.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <CurrentUserSwitcher />
        <span className="rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-500">Mock data</span>
      </div>
    </header>
  );
}
