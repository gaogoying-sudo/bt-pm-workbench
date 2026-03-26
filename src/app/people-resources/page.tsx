import { redirect } from 'next/navigation';
import { LEGACY_BRIDGE_ROUTE_ID } from '@/lib/constants/legacy-routing';

/** @deprecated 全局人员资源页已下线；请使用项目内「资源」页签（人员区块）。 */
export default function LegacyPeopleResourcesPage() {
  redirect(`/projects/${LEGACY_BRIDGE_ROUTE_ID}/resources?from=legacy-global-people-resources`);
}
