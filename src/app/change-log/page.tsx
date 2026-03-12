import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { changes } from '@/data/changes';

export default function ChangeLogPage() {
  return (
    <PageContainer>
      <PageHeader title="Change Log" description="需求变更记录与影响追踪。" />
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600"><tr><th className="px-4 py-3">变更对象</th><th className="px-4 py-3">类型</th><th className="px-4 py-3">影响范围</th><th className="px-4 py-3">版本影响</th><th className="px-4 py-3">任务影响</th><th className="px-4 py-3">状态</th></tr></thead>
          <tbody>{changes.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="px-4 py-3">{item.target}</td><td className="px-4 py-3">{item.changeType}</td><td className="px-4 py-3">{item.impactScope}</td><td className="px-4 py-3">{item.versionImpact}</td><td className="px-4 py-3">{item.taskImpact}</td><td className="px-4 py-3"><StatusBadge label={item.status} tone={item.status === 'implemented' ? 'success' : 'warning'} /></td></tr>)}</tbody>
        </table>
      </div>
    </PageContainer>
  );
}
