import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { SnapshotContextPanel } from '@/components/shared/snapshot-context-panel';
import { SourceContextPanel } from '@/components/shared/source-context-panel';
import { taskService } from '@/server/services/task-service';
import { snapshotService } from '@/server/services/snapshot-service';
import { getProjectIdentity } from '@/lib/identity/unified-project-registry';

export default function TasksPage() {
  const tasks = taskService.listTasks();
  const ctx = snapshotService.resolveSnapshotContext();

  return (
    <PageContainer>
      <PageHeader title="任务索引 / Tasks" description="基于 TaskExecutionRecord 的统一任务视图（原旧 Task 类型已收口至此页面，数据来源已切换至 task-service）。" />

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">任务 / Task</th>
              <th className="px-4 py-3">项目 / Project</th>
              <th className="px-4 py-3">阶段 / Stage</th>
              <th className="px-4 py-3">优先级 / Priority</th>
              <th className="px-4 py-3">状态 / Status</th>
              <th className="px-4 py-3">进度 / Progress</th>
              <th className="px-4 py-3">负责人 / Owner</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const identity = getProjectIdentity(task.projectId);
              return (
                <tr key={task.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{task.title}</td>
                  <td className="px-4 py-3">{identity?.displayName ?? task.projectId}</td>
                  <td className="px-4 py-3">{task.stageId ?? '-'}</td>
                  <td className="px-4 py-3">{task.priority}</td>
                  <td className="px-4 py-3">
                    <StatusBadge label={task.status} tone={task.status === 'blocked' ? 'danger' : task.status === 'done' ? 'success' : 'default'} />
                  </td>
                  <td className="px-4 py-3">{Math.round(task.progress * 100)}%</td>
                  <td className="px-4 py-3">{task.ownerPersonId ?? '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <section className="mt-4 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <SourceContextPanel
          title="数据来源 / Source Context"
          sources={[
            { name: 'task-service', detail: '统一任务服务层，消费 TaskExecutionRecord（非旧 Task 类型）。' },
            { name: 'unified-project-registry', detail: '项目名称通过统一身份注册表解析。' }
          ]}
        />
        <SnapshotContextPanel title="快照口径 / Snapshot Context" context={ctx} />
      </section>
    </PageContainer>
  );
}
