import { redirect } from 'next/navigation';
import { LEGACY_BRIDGE_ROUTE_ID } from '@/lib/constants/legacy-routing';

/** @deprecated 旧版本列表入口；主路径为项目详情 → 版本。 */
export default function LegacyVersionsPage() {
  redirect(`/projects/${LEGACY_BRIDGE_ROUTE_ID}/version?from=legacy-versions`);
}
