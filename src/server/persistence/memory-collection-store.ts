import { CollectionStore } from '@/server/persistence/persistence-contract';

type StoreData = Record<string, unknown[]>;

export class MemoryCollectionStore implements CollectionStore {
  private store: StoreData = {};

  list<T>(collection: string): T[] {
    return (this.store[collection] as T[] | undefined) ?? [];
  }

  set<T>(collection: string, items: T[]): void {
    this.store[collection] = items as unknown[];
  }

  upsert<T extends { id: string }>(collection: string, item: T): void {
    const items = this.list<T>(collection).slice();
    const idx = items.findIndex((x) => x.id === item.id);
    if (idx === -1) items.push(item);
    else items[idx] = item;
    this.set(collection, items);
  }

  patch<T extends { id: string }>(collection: string, id: string, patch: Partial<T>): T | null {
    const items = this.list<T>(collection).slice();
    const idx = items.findIndex((x) => x.id === id);
    if (idx === -1) return null;
    const updated = { ...items[idx], ...patch } as T;
    items[idx] = updated;
    this.set(collection, items);
    return updated;
  }

  getById<T extends { id: string }>(collection: string, id: string): T | null {
    return this.list<T>(collection).find((x) => (x as any).id === id) ?? null;
  }

  clear(collection: string): void {
    this.set(collection, []);
  }
}

