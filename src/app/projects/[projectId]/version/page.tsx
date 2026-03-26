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
        title="Project Version / 版本治理"
        description="消费 version_governance_snapshot + 项目主数据 / 风险与质量 / 外部协同（readiness）。"
      />

      <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-medium text-slate-900">Linked versions</h2>
            <p className="mt-1 text-sm text-slate-500">
              来自 `projectVersionLinkRecords` 的项目版本关联；governance 来自 `buildVersionGovernanceRecords()`。
            </p>
          </div>
          <Link href={`/projects/${params.projectId}/reviews`} className="text-sm text-blue-700">
            去复盘页 / Go to Reviews
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Version</th>
                <th className="px-4 py-3">Governance</th>
                <th className="px-4 py-3">Release Readiness</th>
                <th className="px-4 py-3">Δ Variance</th>
                <th className="px-4 py-3">Active Risks</th>
                <th className="px-4 py-3">Blocked Projects</th>
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
                  <tr key={r.id} className="border-t border-slate-100">
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

