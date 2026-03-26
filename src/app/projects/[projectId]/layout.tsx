import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { readModelService } from '@/server/read-models/read-model-service';
import { ProjectLayoutShell } from '@/components/projects/project-layout-shell';

export default function ProjectSegmentLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const snapshot = readModelService.getProjectDetailSnapshot(params.projectId);
  if (!snapshot) notFound();

  return (
    <PageContainer>
      <ProjectLayoutShell projectId={params.projectId} snapshot={snapshot} />
      {children}
    </PageContainer>
  );
}
