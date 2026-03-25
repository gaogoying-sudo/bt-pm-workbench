import { addItem, getCollection } from '@/server/persistence/local-store';
import { ExternalIdentityBindingRecord } from '@/server/auth/session-types';

const COLLECTION = 'identityBindings';

export const identityBindingRepository = {
  list() {
    return getCollection<ExternalIdentityBindingRecord>(COLLECTION);
  },
  find(provider: 'feishu', externalIdentityId: string) {
    return this.list().find((b) => b.provider === provider && b.externalIdentityId === externalIdentityId) ?? null;
  },
  upsert(binding: ExternalIdentityBindingRecord) {
    // simplistic: add-only; future: migrate to upsert by id
    addItem<ExternalIdentityBindingRecord>(COLLECTION, binding);
    return binding;
  }
};

