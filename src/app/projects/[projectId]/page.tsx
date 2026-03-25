import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { SnapshotContextPanel } from '@/components/shared/snapshot-context-panel';
import { SourceContextPanel } from '@/components/shared/source-context-panel';
import { documentRecords } from '@/data/docs';
import { tasks } from '@/data/tasks';
import { versions } from '@/data/versions';
import { buildProjectDetailSnapshot } from '@/lib/project-detail/project-detail-builders';
import { buildProjectStageProgressSnapshots } from '@/lib/project-progress/project-progress-builders';
import { resolveProjectId, getProjectIdentity } from '@/lib/identity/unified-project-registry';
import { qualityService } from '@/server/services/quality-service';
import { inputEventRepository } from '@/server/repositories/input-event-repository';
import { buildProjectExternalReadinessSummaries } from '@/lib/integrations/readiness-builders';
import { dataExchangeRepository } from '@/server/repositories/data-exchange-repository';

const percentFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const currencyFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY',
  maximumFractionDigits: 0
});

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const snapshot = buildProjectDetailSnapshot(params.projectId);
  if (!snapshot) notFound();

  const identity = getProjectIdentity(params.projectId);
  const canonicalId = identity?.canonicalId ?? resolveProjectId(params.projectId);
  const recentEvents = inputEventRepository
    .listConfirmed()
    .filter((e) => e.targets.some((t) => t.targetType === 'project' && t.targetId === canonicalId))
    .slice(0, 8);

  const projectTasks = tasks.filter((item) => item.projectId === params.projectId).slice(0, 5);
  const projectVersions = versions.filter((item) => item.projectId === params.projectId).slice(0, 3);
  const projectDocs = documentRecords.filter((item) => item.projectId === params.projectId).slice(0, 4);
  const stageSnapshots = identity?.hasManpowerData ? buildProjectStageProgressSnapshots(canonicalId) : [];
  const qualitySnapshot = qualityService.getProjectQualitySnapshot(params.projectId);
  const readiness =
    buildProjectExternalReadinessSummaries().find((r) => r.projectId === canonicalId) ?? null;
  const externalBinding =
    dataExchangeRepository
      .listBindings()
      .find((b) => b.internalType === 'project' && b.internalId === canonicalId && b.status === 'active') ?? null;

  return (
    <PageContainer>
      <PageHeader title={`${snapshot.projectName} / Project Detail`} description={snapshot.basicSummary} />

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2">
          <h2 className="mb-3 font-medium text-slate-900">项目基础信息 / Basic Info</h2>
          <div className="space-y-2 text-sm text-slate-700">
            <p><strong>项目编码 / Code:</strong> {snapshot.projectCode}</p>
            <p><strong>项目进度摘要 / Progress Summary:</strong> {snapshot.execution.summary}</p>
            <p><strong>当前阶段 / Current Stage:</strong> {snapshot.execution.currentStage ?? '未映射 / Not Mapped'}</p>
            <p><strong>版本摘要 / Version Summary:</strong> {snapshot.version.summary}</p>
          </div>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-medium text-slate-900">风险与状态 / Risk & Status</h2>
          <div className="space-y-2 text-sm text-slate-700">
            <StatusBadge label={snapshot.execution.status} tone={snapshot.execution.status === 'blocked' ? 'danger' : snapshot.execution.status === 'at-risk' ? 'warning' : 'success'} />
            <p>阻塞数 / Blockers: {snapshot.execution.blockedTaskCount}</p>
            <p>高风险任务 / High-risk Tasks: {snapshot.execution.highRiskTaskCount}</p>
            <p>风险摘要 / Risk Summary: {snapshot.risk.summary}</p>
          </div>
        </article>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-medium text-slate-900">项目进度摘要 / Progress Summary</h3>
          <p className="text-sm text-slate-700">进度 / Progress: {percentFormatter.format(snapshot.execution.progress)}</p>
          <p className="mt-1 text-sm text-slate-700">状态 / Status: {snapshot.execution.status}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-medium text-slate-900">资源与负载摘要 / Resource Summary</h3>
          <p className="text-sm text-slate-700">资源压力 / Pressure: {snapshot.resource.resourcePressureLevel}</p>
          <p className="mt-1 text-sm text-slate-700">超载人数 / Overloaded: {snapshot.resource.overloadedPeople}</p>
          <p className="mt-1 text-xs text-slate-500">{snapshot.resource.summary}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-medium text-slate-900">人力投入摘要 / Manpower Summary</h3>
          <p className="text-sm text-slate-700">计划成本 / Planned Cost: {currencyFormatter.format(snapshot.cost.plannedCost)}</p>
          <p className="mt-1 text-sm text-slate-700">实际成本 / Actual Cost: {currencyFormatter.format(snapshot.cost.actualCost)}</p>
          <p className="mt-1 text-sm text-slate-700">偏差 / Variance: {currencyFormatter.format(snapshot.cost.varianceCost)}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-medium text-slate-900">版本关联摘要 / Version Summary</h3>
          <p className="text-sm text-slate-700">版本 / Version: {snapshot.version.versionName ?? '-'}</p>
          <p className="mt-1 text-sm text-slate-700">治理状态 / Governance: {snapshot.version.governanceStatus ?? '-'}</p>
          <p className="mt-1 text-sm text-slate-700">准备度 / Readiness: {snapshot.version.readinessStatus ?? '-'}</p>
        </article>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2">
          <h3 className="mb-3 font-medium text-slate-900">阶段执行概览 / Stage Execution</h3>
          {stageSnapshots.length > 0 ? (
            <div className="space-y-3 text-sm text-slate-700">
              {stageSnapshots.map((stage) => (
                <div key={stage.id} className="rounded-md border border-slate-200 p-3">
                  <div className="font-medium text-slate-900">{stage.stageName}</div>
                  <div className="mt-1">进度 / Progress: {percentFormatter.format(stage.stageProgress)}</div>
                  <div className="mt-1">任务数 / Tasks: {stage.taskCount}</div>
                  <div className="mt-1">风险提示 / Risk Hint: {stage.riskSummary}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">当前项目尚未接入阶段执行聚合 / No stage execution aggregate mapped yet.</p>
          )}
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-3 font-medium text-slate-900">风险与阻塞摘要 / Risk Summary</h3>
          <p className="text-sm text-slate-700">风险数 / Risks: {snapshot.risk.riskCount}</p>
          <p className="mt-1 text-sm text-slate-700">阻塞数 / Blockers: {snapshot.risk.blockerCount}</p>
          <p className="mt-1 text-sm text-slate-700">重点信号 / Top Signal: {snapshot.risk.topSignalTitle ?? '暂无 / None'}</p>
          <p className="mt-1 text-xs text-slate-500">{snapshot.risk.summary}</p>
        </article>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-medium text-slate-900">任务摘要 / Task Summary</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            {projectTasks.map((task) => <li key={task.id}>{task.title} / {task.status}</li>)}
          </ul>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-medium text-slate-900">版本摘要 / Version Summary</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            {projectVersions.map((item) => <li key={item.id}>{item.version} / {item.status}</li>)}
          </ul>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-medium text-slate-900">文档摘要 / Document Summary</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            {projectDocs.map((doc) => <li key={doc.id}>{doc.title}</li>)}
          </ul>
        </article>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-medium text-slate-900">质量摘要 / Quality Summary</h3>
          <p className="text-sm text-slate-700">质量检查 / Checks: {qualitySnapshot.totalChecks}</p>
          <p className="mt-1 text-sm text-slate-700">通过率 / Pass Rate: {percentFormatter.format(qualitySnapshot.qualityScore)}</p>
          <p className="mt-1 text-sm text-slate-700">失败 / Failed: {qualitySnapshot.failedChecks}  |  待审 / Pending: {qualitySnapshot.pendingChecks}</p>
          <p className="mt-1 text-xs text-slate-500">{qualitySnapshot.summary}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-medium text-slate-900">质量 vs 风险边界 / Quality vs Risk</h3>
          <p className="text-sm text-slate-700">风险关注不确定性与延期阻塞，质量关注交付物合规性与通过率。两者在系统中独立跟踪。</p>
          <p className="mt-1 text-sm text-slate-500">Risks track uncertainty/blockers; quality tracks deliverable compliance and pass rate. Tracked independently.</p>
        </article>
      </section>

      <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-2 font-medium text-slate-900">最近确认事件 / Recent Confirmed Events</h3>
        {recentEvents.length === 0 ? (
          <p className="text-sm text-slate-500">暂无事件。你可以去「输入收件箱」录入并确认写回。</p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-700">
            {recentEvents.map((evt) => (
              <li key={evt.id} className="rounded-md border border-slate-200 p-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{evt.eventType}</span>
                  <span className="text-xs text-slate-500">{evt.confirmedAt}</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">status: {evt.status}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-medium text-slate-900">外部就绪摘要 / External Readiness</h3>
          <p className="text-sm text-slate-700">Readiness: {readiness?.readinessLevel ?? '-'}</p>
          <p className="mt-1 text-sm text-slate-700">Export ready: {readiness?.exportReady ? 'Yes' : 'No'}</p>
          <p className="mt-1 text-xs text-slate-500">
            外部 readiness 用于外部系统消费/触发（备料/交付/报表），不等同于内部进度。
          </p>
          {readiness?.reasons?.length ? (
            <ul className="mt-2 list-disc pl-5 text-xs text-slate-600">
              {readiness.reasons.slice(0, 6).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          ) : null}
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-medium text-slate-900">外部映射 / External Mapping</h3>
          <p className="text-sm text-slate-700">External project id: {externalBinding?.externalIdentifier ?? '-'}</p>
          <p className="mt-1 text-xs text-slate-500">
            该映射由 import apply 或手工维护写入。缺失映射会导致 supply readiness 降级。
          </p>
        </article>
      </section>

      <section className="mt-4 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <SourceContextPanel
          title="数据来源说明 / Source Context"
          sources={snapshot.sourceContext.map((source) => ({
            name: source,
            detail: '当前项目详情优先消费 builder 结果；未映射项目则退回旧基础数据展示。'
          }))}
        />
        <SnapshotContextPanel title="快照口径 / Snapshot Context" context={snapshot.snapshotContext} />
      </section>
    </PageContainer>
  );
}
