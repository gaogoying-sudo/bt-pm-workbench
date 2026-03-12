import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { versions } from '@/data/versions';

export default function VersionsPage() {
  return (
    <PageContainer>
      <PageHeader title="Versions" description="版本链与当前有效版本管理。" />
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600"><tr><th className="px-4 py-3">对象</th><th className="px-4 py-3">项目</th><th className="px-4 py-3">版本号</th><th className="px-4 py-3">状态</th><th className="px-4 py-3">上一版本</th><th className="px-4 py-3">摘要</th></tr></thead>
          <tbody>{versions.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="px-4 py-3">{item.objectName}</td><td className="px-4 py-3">{item.projectId}</td><td className="px-4 py-3">{item.version}</td><td className="px-4 py-3"><StatusBadge label={item.status} tone={item.isActive ? 'success' : 'muted'} /></td><td className="px-4 py-3">{item.previousVersion ?? '-'}</td><td className="px-4 py-3">{item.summary}</td></tr>)}</tbody>
        </table>
      </div>
    </PageContainer>
  );
}
