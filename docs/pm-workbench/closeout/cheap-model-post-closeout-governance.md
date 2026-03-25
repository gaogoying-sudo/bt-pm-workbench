# Cheap-model Post-closeout Governance

This pack defines how lower-cost models should continue safely after closeout.

## Primary rule

Prefer **small, reversible changes** and keep foundation contracts stable.

## 5 recommended directions (safe)

1. **Feishu binding UI + org mapping**
   - start: `src/server/repositories/identity-binding-repository.ts`, `src/lib/types/identity.ts`
   - add: `/bind-identity` page (lightweight)

2. **Import templates (CSV)**
   - start: `src/lib/types/integrations.ts`, `src/server/services/data-exchange-service.ts`
   - add: CSV parser, field mapping, preview UI

3. **Conflict resolution**
   - start: import preview/apply pipeline
   - add: overwrite warnings, partial apply, manual fix required state

4. **Snapshot archiving**
   - start: snapshot batch persistence
   - add: store full timeline payload per batch for replay

5. **Action-level access guards**
   - start: `src/components/identity/access-guard.tsx`
   - add: disable/hide confirm/writeback/export actions based on permissions

## Don’t touch (unless you add tests)

- Any file listed in `foundation-closeout-and-boundary-freeze.md`

