import { redirect } from 'next/navigation';

/** @deprecated 变更日志入口与 Closeout / Runbook 对齐。 */
export default function LegacyChangeLogPage() {
  redirect('/closeout?from=legacy-change-log');
}
