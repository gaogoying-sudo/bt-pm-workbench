# Persistence & Data Source Guide (PM-WORKBENCH)

## Data layers (current)

1. **Seed baseline data** (read-only, committed): `src/data/**`
2. **Mutable local persisted data** (durable, not committed): `.pmw-data/*.json` when `PMW_PERSISTENCE_MODE=file`
3. **Computed read models**: builders under `src/lib/**` (snapshots, comparisons, governance)
4. **Derived compare artifacts**: `/api/snapshots` response fields (timeline + comparisons)

## Current persistence contract

- `CollectionStore` interface: `src/server/persistence/persistence-contract.ts`
- Implementations:
  - memory: `src/server/persistence/memory-collection-store.ts`
  - file: `src/server/persistence/file-collection-store.ts`
- Facade used by repos: `src/server/persistence/local-store.ts`

## What is persisted today

Via `local-store` collections (durable when file mode):

- input events: raw / drafts / confirmed / writebacks
- snapshot batches

Other domains remain seed-based or in-memory mock arrays (explicitly considered **seed/fallback/fixture** for now).

## Switch strategy

- Start with `memory` for fast dev
- Use `file` when you want durable local behavior and to validate reset/backup workflows
- Future: replace `FileCollectionStore` with sqlite/postgres adapters behind `CollectionStore`

