import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { referenceRecords } from '@/data/references';

export default function ReferencesPage() {
  return (
    <PageContainer>
      <PageHeader title="References" description="候选引用清单，避免旧成果污染当前项目。" />
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600"><tr><th className="px-4 py-3">来源项目</th><th className="px-4 py-3">对象</th><th className="px-4 py-3">用途</th><th className="px-4 py-3">只读</th><th className="px-4 py-3">不得带入</th><th className="px-4 py-3">状态</th></tr></thead>
          <tbody>{referenceRecords.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="px-4 py-3">{item.sourceProject}</td><td className="px-4 py-3">{item.objectName}</td><td className="px-4 py-3">{item.purpose}</td><td className="px-4 py-3">{item.isReadOnly ? '是' : '否'}</td><td className="px-4 py-3">{item.excludedContent}</td><td className="px-4 py-3"><StatusBadge label={item.status} tone={item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'danger' : 'warning'} /></td></tr>)}</tbody>
        </table>
      </div>
    </PageContainer>
  );
}
