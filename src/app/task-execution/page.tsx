import { redirect } from 'next/navigation';
import { LEGACY_BRIDGE_ROUTE_ID } from '@/lib/constants/legacy-routing';

/** @deprecated 全局任务执行入口已下线；请使用项目内「执行」页签。 */
export default function LegacyTaskExecutionPage() {
  redirect(`/projects/${LEGACY_BRIDGE_ROUTE_ID}/execution?from=legacy-global-task-execution`);
}
