import { redirect } from 'next/navigation';

/** @deprecated 设置入口收拢至后台管理与个人资料。 */
export default function LegacySettingsPage() {
  redirect('/admin?from=legacy-settings');
}
