import { addItem, getCollection, findById, removeItem } from '@/server/persistence/local-store';
import { UserSessionPersisted } from '@/server/auth/session-types';

const COLLECTION = 'sessions';

export const sessionRepository = {
  create(session: UserSessionPersisted) {
    addItem<UserSessionPersisted>(COLLECTION, session);
    return session;
  },
  get(id: string) {
    return findById<UserSessionPersisted>(COLLECTION, id);
  },
  delete(id: string) {
    return removeItem<UserSessionPersisted>(COLLECTION, id);
  },
  list() {
    return getCollection<UserSessionPersisted>(COLLECTION);
  }
};

