import { redirect } from 'next/navigation';

/** @deprecated 旧任务列表入口；主路径为项目详情 → 执行。 */
export default function LegacyTasksPage() {
  redirect('/projects?from=legacy-tasks');
}
