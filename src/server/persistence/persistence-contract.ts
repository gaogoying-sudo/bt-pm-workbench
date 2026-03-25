export interface CollectionStore {
  list<T>(collection: string): T[];
  set<T>(collection: string, items: T[]): void;
  upsert<T extends { id: string }>(collection: string, item: T): void;
  patch<T extends { id: string }>(collection: string, id: string, patch: Partial<T>): T | null;
  getById<T extends { id: string }>(collection: string, id: string): T | null;
  clear(collection: string): void;
}

