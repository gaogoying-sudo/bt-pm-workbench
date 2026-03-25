import fs from 'node:fs';
import path from 'node:path';
import { CollectionStore } from '@/server/persistence/persistence-contract';

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export class FileCollectionStore implements CollectionStore {
  private dir: string;
  private cache: Record<string, unknown[] | undefined> = {};

  constructor(dir: string) {
    this.dir = dir;
    ensureDir(dir);
  }

  private filePath(collection: string) {
    return path.join(this.dir, `${collection}.json`);
  }

  private load(collection: string): unknown[] {
    if (this.cache[collection]) return this.cache[collection]!;
    const fp = this.filePath(collection);
    if (!fs.existsSync(fp)) {
      this.cache[collection] = [];
      return [];
    }
    const raw = fs.readFileSync(fp, 'utf-8');
    const parsed = JSON.parse(raw);
    const arr = Array.isArray(parsed) ? parsed : [];
    this.cache[collection] = arr;
    return arr;
  }

  private save(collection: string, items: unknown[]) {
    ensureDir(this.dir);
    const fp = this.filePath(collection);
    fs.writeFileSync(fp, JSON.stringify(items, null, 2), 'utf-8');
    this.cache[collection] = items;
  }

  list<T>(collection: string): T[] {
    return this.load(collection) as T[];
  }

  set<T>(collection: string, items: T[]): void {
    this.save(collection, items as unknown[]);
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
    return this.list<T>(collection).find((x) => x.id === id) ?? null;
  }

  clear(collection: string): void {
    this.set(collection, []);
  }
}

