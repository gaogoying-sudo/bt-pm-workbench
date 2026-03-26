import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { readModelService } from '@/server/read-models/read-model-service';

export default function ProjectVersionTabPage({ params }: { params: { projectId: string } }) {
  const pack = readModelService.getVersionGovernanceSnapshot(params.projectId);
  const records = pack.governanceRecords;

  const percentFormatter = new Intl.NumberFormat('zh-CN', { style: 'percent', maximumFractionDigits: 0 });

  return (
    <>
      <PageHeader
        title="版本治理"
        description="消费 version_governance_snapshot + 项目主数据 / 风险与质量 / 外部协同（readiness）。"
      />

      <section className="pmw-surface mt-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-medium text-slate-900">关联版本</h2>
            <p className="mt-1 text-sm text-slate-500">
              项目版本关联来自版本链路记录；治理状态来自版本治理聚合（演示数据口径）。
            </p>
          </div>
          <Link href={`/projects/${params.projectId}/reviews`} className="text-sm text-blue-700">
            去复盘与决策
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-50/60 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">版本</th>
                <th className="px-4 py-3">治理状态</th>
                <th className="px-4 py-3">发布准备度</th>
                <th className="px-4 py-3">偏差</th>
                <th className="px-4 py-3">风险数</th>
                <th className="px-4 py-3">阻塞项目数</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-sm text-slate-500">
                    当前项目暂无版本关联治理数据。
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100 hover:bg-blue-50/30">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{r.versionName}</div>
                      <div className="mt-1 text-xs text-slate-500">{r.linkedVersionId}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-700">{r.governanceStatus}</div>
                      <div className="mt-1 text-xs text-slate-500">{r.relationType}</div>
                    </td>
                    <td className="px-4 py-3">{r.releaseReadinessStatus}</td>
                    <td className="px-4 py-3">{percentFormatter.format(r.variance)}</td>
                    <td className="px-4 py-3">{r.activeRiskCount}</td>
                    <td className="px-4 py-3">{r.blockedProjectCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

