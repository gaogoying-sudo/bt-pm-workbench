'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { identityRegistry } from '@/lib/identity/identity-registry';
import { buildCurrentUserContext, buildUserAccessContext } from '@/lib/access/access-service';
import { CurrentUserContext } from '@/lib/types/identity';
import { UserAccessContext } from '@/lib/types/access';

const STORAGE_KEY = 'pmw.currentUserId';

interface CurrentUserState {
  currentUserId: string;
  context: CurrentUserContext;
  access: UserAccessContext;
  setCurrentUserId: (id: string) => void;
}

const CurrentUserCtx = createContext<CurrentUserState | null>(null);

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const defaultUserId = 'person-alice';
  const [currentUserId, setCurrentUserIdState] = useState(defaultUserId);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) setCurrentUserIdState(stored);
  }, []);

  function setCurrentUserId(id: string) {
    setCurrentUserIdState(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }

  const context = useMemo(() => buildCurrentUserContext(currentUserId), [currentUserId]);
  const access = useMemo(() => buildUserAccessContext(context), [context]);

  const value = useMemo(() => ({ currentUserId, context, access, setCurrentUserId }), [currentUserId, context, access]);

  return <CurrentUserCtx.Provider value={value}>{children}</CurrentUserCtx.Provider>;
}

export function useCurrentUser() {
  const v = useContext(CurrentUserCtx);
  if (!v) throw new Error('useCurrentUser must be used within CurrentUserProvider');
  return v;
}

export function CurrentUserSwitcher() {
  const { currentUserId, setCurrentUserId, context } = useCurrentUser();
  const persons = identityRegistry.listPersons();
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500">User</span>
      <select
        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
        value={currentUserId}
        onChange={(e) => setCurrentUserId(e.target.value)}
      >
        {persons.map((p) => (
          <option key={p.id} value={p.id}>
            {p.display.displayName} ({p.primaryRoleId})
          </option>
        ))}
      </select>
      <span className="text-xs text-slate-500">{context.projectScope.mode}</span>
    </div>
  );
}

