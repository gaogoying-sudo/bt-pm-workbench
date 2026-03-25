import { getRuntimeConfig } from '@/server/config/runtime-config';
import { CollectionStore } from '@/server/persistence/persistence-contract';
import { MemoryCollectionStore } from '@/server/persistence/memory-collection-store';
import { FileCollectionStore } from '@/server/persistence/file-collection-store';

let storeImpl: CollectionStore | null = null;

function getStore(): CollectionStore {
  if (storeImpl) return storeImpl;
  const cfg = getRuntimeConfig();
  storeImpl = cfg.persistenceMode === 'file' ? new FileCollectionStore(cfg.dataDir) : new MemoryCollectionStore();
  return storeImpl;
}

export function getCollection<T>(name: string): T[] {
  return getStore().list<T>(name);
}

export function setCollection<T>(name: string, data: T[]): void {
  getStore().set<T>(name, data);
}

export function addItem<T extends { id: string }>(name: string, item: T): void {
  getStore().upsert<T>(name, item);
}

export function updateItem<T extends { id: string }>(name: string, id: string, patch: Partial<T>): T | null {
  return getStore().patch<T>(name, id, patch);
}

export function removeItem<T extends { id: string }>(name: string, id: string): boolean {
  const collection = getCollection<T>(name);
  const index = collection.findIndex((item) => item.id === id);
  if (index === -1) return false;
  collection.splice(index, 1);
  setCollection(name, collection);
  return true;
}

export function findById<T extends { id: string }>(name: string, id: string): T | null {
  return getStore().getById<T>(name, id);
}

export function findByFilter<T>(name: string, predicate: (item: T) => boolean): T[] {
  return getCollection<T>(name).filter(predicate);
}
