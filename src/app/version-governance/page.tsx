import { redirect } from 'next/navigation';
import { LEGACY_BRIDGE_ROUTE_ID } from '@/lib/constants/legacy-routing';

/** @deprecated 全局版本治理已下线；请使用项目内「版本」页签。 */
export default function LegacyVersionGovernancePage() {
  redirect(`/projects/${LEGACY_BRIDGE_ROUTE_ID}/version?from=legacy-global-version-governance`);
}
