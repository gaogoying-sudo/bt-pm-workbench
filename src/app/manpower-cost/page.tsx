import { PageContainer } from '@/components/layout/page-container';
import { ManpowerCostWorkbench } from '@/components/manpower/manpower-cost-workbench';
import { PageHeader } from '@/components/ui/page-header';

export default function ManpowerCostPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Manpower Cost"
        description="Multi-project manpower and cost analysis workbench with role, stage, version and variance structure reserved for real data."
      />
      <ManpowerCostWorkbench />
    </PageContainer>
  );
}
