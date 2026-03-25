type StoreData = Record<string, unknown[]>;

const store: StoreData = {};

export function getCollection<T>(name: string): T[] {
  return (store[name] as T[] | undefined) ?? [];
}

export function setCollection<T>(name: string, data: T[]): void {
  store[name] = data as unknown[];
}

export function addItem<T extends { id: string }>(name: string, item: T): void {
  const collection = getCollection<T>(name);
  collection.push(item);
  setCollection(name, collection);
}

export function updateItem<T extends { id: string }>(name: string, id: string, patch: Partial<T>): T | null {
  const collection = getCollection<T>(name);
  const index = collection.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const updated = { ...collection[index], ...patch } as T;
  collection[index] = updated;
  setCollection(name, collection);
  return updated;
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
  return getCollection<T>(name).find((item) => item.id === id) ?? null;
}

export function findByFilter<T>(name: string, predicate: (item: T) => boolean): T[] {
  return getCollection<T>(name).filter(predicate);
}
