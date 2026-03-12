import { PageContainer } from '@/components/layout/page-container';
import { PeopleResourcesWorkbench } from '@/components/resources/people-resources-workbench';
import { PageHeader } from '@/components/ui/page-header';

export default function PeopleResourcesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="People & Resources"
        description="Project-facing resource center for people records, roles, capacity, allocations, hiring gaps and sensitive cost placeholders."
      />
      <PeopleResourcesWorkbench />
    </PageContainer>
  );
}
