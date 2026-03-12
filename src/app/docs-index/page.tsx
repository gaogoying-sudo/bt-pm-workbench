import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { documentRecords } from '@/data/docs';

export default function DocsIndexPage() {
  return (
    <PageContainer>
      <PageHeader title="Docs Index" description="文档入口索引与读取顺序管理。" />
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600"><tr><th className="px-4 py-3">文档名称</th><th className="px-4 py-3">类型</th><th className="px-4 py-3">项目</th><th className="px-4 py-3">状态</th><th className="px-4 py-3">生效</th><th className="px-4 py-3">读取顺序</th></tr></thead>
          <tbody>{documentRecords.map((doc) => <tr key={doc.id} className="border-t border-slate-100"><td className="px-4 py-3">{doc.title}</td><td className="px-4 py-3">{doc.docType}</td><td className="px-4 py-3">{doc.projectId}</td><td className="px-4 py-3"><StatusBadge label={doc.status} tone={doc.status === 'active' ? 'success' : 'muted'} /></td><td className="px-4 py-3">{doc.isActive ? '是' : '否'}</td><td className="px-4 py-3">{doc.readOrder}</td></tr>)}</tbody>
        </table>
      </div>
    </PageContainer>
  );
}
