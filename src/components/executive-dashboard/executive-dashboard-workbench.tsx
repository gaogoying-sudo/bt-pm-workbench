'use client';

import { useMemo } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { InfoCard } from '@/components/ui/info-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { SnapshotContextPanel } from '@/components/shared/snapshot-context-panel';
import { SourceContextPanel } from '@/components/shared/source-context-panel';
import {
  buildDeliveryRiskSnapshots,
  buildExecutiveOverviewSnapshot,
  buildProjectHealthSnapshots,
  buildResourceHealthSnapshot,
  buildVersionHealthSnapshots
} from '@/lib/executive-dashboard/dashboard-builders';
import { mapRiskTone } from '@/lib/view-config/tone-mappers';

const percentFormatter = new Intl.NumberFormat('zh-CN', { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const currencyFormatter = new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 });

export function ExecutiveDashboardWorkbench() {
  const overview = useMemo(() => buildExecutiveOverviewSnapshot(), []);
  const projectHealth = useMemo(() => buildProjectHealthSnapshots(), []);
  const resourceHealth = useMemo(() => buildResourceHealthSnapshot(), []);
  const versionHealth = useMemo(() => buildVersionHealthSnapshots(), []);
  const deliveryRisks = useMemo(() => buildDeliveryRiskSnapshots(), []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="管理驾驶舱 / Executive Dashboard"
        description="面向管理视角集中查看项目健康、资源负载、版本推进、人力回写和关键交付风险。"
      />

      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <InfoCard title="项目总数 / Total Projects" value={overview.totalProjects} />
        <InfoCard title="进行中项目 / Active Projects" value={overview.activeProjects} />
        <InfoCard title="平均项目进度 / Average Progress" value={percentFormatter.format(overview.averageProjectProgress)} />
        <InfoCard title="高风险项目 / High-risk Projects" value={overview.highRiskProjects} />
        <InfoCard title="可发布版本 / Ready Versions" value={overview.readyVersions} />
        <InfoCard title="人力回写成本 / Write-back Cost" value={currencyFormatter.format(overview.totalWritebackCost)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="font-medium text-slate-900">项目健康区 / Project Health</h2>
            <p className="text-sm text-slate-500">直接消费项目进度快照，不在页面层重复聚合。</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">项目 / Project</th>
                  <th className="px-4 py-3">进度 / Progress</th>
                  <th className="px-4 py-3">状态 / Status</th>
                  <th className="px-4 py-3">阻塞 / Blocked</th>
                  <th className="px-4 py-3">高风险 / High Risk</th>
                  <th className="px-4 py-3">资源压力 / Resource Pressure</th>
                  <th className="px-4 py-3">版本 / Version</th>
                </tr>
              </thead>
              <tbody>
                {projectHealth.map((item) => (
                  <tr key={item.projectId} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{item.projectName}</div>
                      <div className="text-xs text-slate-500">{item.summary}</div>
                    </td>
                    <td className="px-4 py-3">{percentFormatter.format(item.progress)}</td>
                    <td className="px-4 py-3"><StatusBadge label={item.status} tone={mapRiskTone(item.status)} /></td>
                    <td className="px-4 py-3">{item.blockedTaskCount}</td>
                    <td className="px-4 py-3">{item.highRiskTaskCount}</td>
                    <td className="px-4 py-3"><StatusBadge label={item.resourcePressureLevel} tone={mapRiskTone(item.resourcePressureLevel)} /></td>
                    <td className="px-4 py-3">{item.versionName ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">资源与负载区 / Resource Health</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">人员总量 / Total People</div>
              <div className="mt-2">{resourceHealth.totalPeople}</div>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">已满载 / Fully Allocated</div>
              <div className="mt-2">{resourceHealth.fullyAllocatedCount}</div>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">部分可投入 / Partially Available</div>
              <div className="mt-2">{resourceHealth.partiallyAvailableCount}</div>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">高负载人员 / High-load People</div>
              <div className="mt-2">{resourceHealth.highLoadPeople}</div>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">稀缺角色 / Scarce Roles</div>
              <div className="mt-2">{resourceHealth.scarceRoleCount}</div>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-xs text-slate-500">{resourceHealth.summary}</div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">版本推进区 / Version Health</h2>
          <div className="mt-4 space-y-3">
            {versionHealth.map((item) => (
              <div key={item.linkedVersionId} className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-slate-900">{item.versionName}</div>
                  <StatusBadge label={item.releaseReadinessStatus} tone={mapRiskTone(item.releaseReadinessStatus)} />
                </div>
                <div className="mt-2">治理状态 / Governance: {item.governanceStatus}</div>
                <div className="mt-1">偏差 / Variance: {percentFormatter.format(item.variance)}</div>
                <div className="mt-1">风险数 / Risks: {item.activeRiskCount}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">人力投入与回写 / Manpower & Write-back</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">回写估算成本 / Estimated Write-back Cost</div>
              <div className="mt-2">{currencyFormatter.format(overview.totalWritebackCost)}</div>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium text-slate-900">版本可发布数 / Ready Versions</div>
              <div className="mt-2">{overview.readyVersions}</div>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-xs text-slate-500">
              该区块来自任务执行回写预览、项目进度快照与版本治理结果，不在驾驶舱单独重算成本。
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">风险雷达摘要 / Risk Summary</h2>
          <div className="mt-4 space-y-3">
            {deliveryRisks.map((risk, index) => (
              <div key={`${risk.title}-${index}`} className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-slate-900">{risk.title}</div>
                  <StatusBadge label={risk.severity} tone={mapRiskTone(risk.severity)} />
                </div>
                <div className="mt-2">{risk.summary}</div>
                <div className="mt-1 text-xs text-slate-500">{risk.sourceModule}</div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <SourceContextPanel
        title="来源说明区 / Source Context"
        sources={[
          { name: '项目进度中心 / Project Progress Center', detail: '提供项目健康快照、阻塞与资源压力信息。' },
          { name: '任务执行聚合层 / Task Execution Aggregation', detail: '提供人员负载、任务回写和执行口径支撑。' },
          { name: '版本治理中心 / Version Governance Center', detail: '提供版本准备度、治理状态和发布窗口占位。' },
          { name: '人力成本模块 / Manpower Cost', detail: '当前通过回写估算成本形成管理驾驶舱的人力投入摘要。' }
        ]}
      />

      <SnapshotContextPanel title="快照说明 / Snapshot Context" context={overview.snapshotContext} />
    </div>
  );
}
