import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { tasks } from '@/data/tasks';

export default function TasksPage() {
  return (
    <PageContainer>
      <PageHeader title="Tasks" description="任务推进状态管理（首版静态展示）。" />
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600"><tr><th className="px-4 py-3">任务</th><th className="px-4 py-3">项目</th><th className="px-4 py-3">优先级</th><th className="px-4 py-3">状态</th><th className="px-4 py-3">阻塞原因</th><th className="px-4 py-3">下一步</th></tr></thead>
          <tbody>{tasks.map((task) => <tr key={task.id} className="border-t border-slate-100"><td className="px-4 py-3">{task.title}</td><td className="px-4 py-3">{task.projectId}</td><td className="px-4 py-3">{task.priority}</td><td className="px-4 py-3"><StatusBadge label={task.status} tone={task.status === 'blocked' ? 'danger' : 'default'} /></td><td className="px-4 py-3">{task.blocker}</td><td className="px-4 py-3">{task.nextAction}</td></tr>)}</tbody>
        </table>
      </div>
    </PageContainer>
  );
}
