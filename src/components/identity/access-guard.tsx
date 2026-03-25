'use client';

import { useCurrentUser } from '@/components/identity/current-user-provider';
import { PermissionId } from '@/lib/types/access';
import { hasPermission } from '@/lib/access/access-service';

export function AccessGuard({
  permission,
  children,
  fallback
}: {
  permission: PermissionId;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { access } = useCurrentUser();
  if (!hasPermission(access, permission)) {
    return fallback ?? <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-500">Access denied.</div>;
  }
  return <>{children}</>;
}

