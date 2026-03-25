import { CurrentUserSwitcher } from '@/components/identity/current-user-provider';

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <p className="text-sm text-slate-600">Internal Project Governance Workbench</p>
      <div className="flex items-center gap-3">
        <CurrentUserSwitcher />
        <button className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700">Mock Data Mode</button>
      </div>
    </header>
  );
}
