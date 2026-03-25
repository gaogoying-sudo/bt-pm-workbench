# Foundation Closeout & Boundary Freeze

This document freezes the foundation boundaries to prevent future work from regressing into ad-hoc patterns.

## Closeout statement (封板声明)

The following foundation layers are considered **closed for large refactors**:

- Unified project identity & ID governance
- Snapshot timeline & compare contracts
- Quality governance contracts (separate from risk)
- Input events domain with human-in-the-loop confirmation
- Identity/org/participation/access foundations
- Import/export domain + integration contract + readiness summaries
- Persistence contract (memory/file) + env/runtime config + health/test harness

## Do & Don’t

### Do
- Extend via **repository/service adapters** behind contracts
- Add features by consuming existing APIs/builders (not page-local mock imports)
- Keep risk and quality as independent dimensions
- Keep input event flow: raw → draft → confirm → writeback
- Add new external integrations via contract/schema + adapter layer (not one-off JSON)

### Don’t
- Don’t reintroduce `projectIdMap` or name-matching as primary identity glue
- Don’t bypass input confirmation and write directly from UI to domain objects
- Don’t create new snapshot/quality/identity types in pages or feature folders
- Don’t add a new “big center” to bypass core entry points

## Frozen contracts (touch carefully)

- `src/server/contracts/response.ts` (ApiResponse shape)
- `src/lib/identity/unified-project-registry.ts`
- `src/lib/types/timeline-snapshot.ts`
- `src/lib/types/quality.ts`
- `src/lib/types/input-events.ts`
- `src/lib/types/identity.ts` + `src/lib/types/access.ts`
- `src/lib/types/integrations.ts`
- `src/server/persistence/persistence-contract.ts`

