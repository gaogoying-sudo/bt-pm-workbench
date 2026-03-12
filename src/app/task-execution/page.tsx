import { PageContainer } from '@/components/layout/page-container';
import { TaskExecutionWorkbench } from '@/components/task-execution/task-execution-workbench';
import { PageHeader } from '@/components/ui/page-header';

export default function TaskExecutionPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Task Execution"
        description="Execution center for project-stage-task chains, owners, dependencies, risks and progress placeholders."
      />
      <TaskExecutionWorkbench />
    </PageContainer>
  );
}
