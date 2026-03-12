import Link from 'next/link';

const navItems = [
  ['Dashboard', '/dashboard'],
  ['Projects', '/projects'],
  ['Manpower Cost', '/manpower-cost'],
  ['People & Resources', '/people-resources'],
  ['Task Execution', '/task-execution'],
  ['Tasks', '/tasks'],
  ['Versions', '/versions'],
  ['Docs Index', '/docs-index'],
  ['Change Log', '/change-log'],
  ['References', '/references'],
  ['Settings', '/settings']
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-50 px-4 py-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">PM-WORKBENCH</p>
        <p className="mt-1 text-sm text-slate-700">BT PM Workbench</p>
      </div>
      <nav className="space-y-1">
        {navItems.map(([label, href]) => (
          <Link key={href} href={href} className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-white hover:text-slate-900">
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
