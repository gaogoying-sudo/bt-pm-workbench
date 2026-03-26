import { redirect } from 'next/navigation';
import { LEGACY_BRIDGE_ROUTE_ID } from '@/lib/constants/legacy-routing';

/** @deprecated 全局进度中心已下线；请使用项目内「进度」页签。 */
export default function LegacyProjectProgressPage() {
  redirect(`/projects/${LEGACY_BRIDGE_ROUTE_ID}/progress?from=legacy-global-project-progress`);
}
