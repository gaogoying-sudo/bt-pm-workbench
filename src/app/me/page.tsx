import { MeWorkbench } from '@/app/me/me-workbench';

export default function MePage({ searchParams }: { searchParams: { from?: string } }) {
  return <MeWorkbench legacyFrom={searchParams.from} />;
}
