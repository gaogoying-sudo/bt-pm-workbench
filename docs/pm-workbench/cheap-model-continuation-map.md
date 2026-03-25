# Cheap-model Continuation Map (PM-WORKBENCH)

This is the post-foundation handoff map for lower-cost models to continue feature work safely.

## Guardrails (do not break)
- unified project identity: `src/lib/identity/unified-project-registry.ts`
- snapshot timeline contract: `src/lib/types/timeline-snapshot.ts`
- input event domain: `src/lib/types/input-events.ts`
- identity domain: `src/lib/types/identity.ts`
- API response shape: `src/server/contracts/response.ts`

## Recommended 5 continuation directions

1. **Input Inbox form specialization**
   - start: `src/components/input-events/input-inbox-workbench.tsx`
   - task: replace generic patch inputs with per-eventType structured forms + validation
   - avoid: bypassing draft/confirmation

2. **Durable snapshot archiving**
   - start: `src/server/persistence/snapshot-batch-store.ts`
   - task: persist full timeline payload per batch (not only metadata) for replay/compare
   - avoid: embedding persistence in pages

3. **Participation as explicit data**
   - start: `src/lib/participation/participation-builders.ts`
   - task: introduce explicit `ProjectParticipationRecord` persistence + edit UI
   - avoid: hard-coded person name matching

4. **Access guards expansion**
   - start: `src/components/identity/access-guard.tsx`
   - task: action-level guards (confirm/writeback buttons, quality edit)
   - avoid: adding complex IAM platform

5. **Replace file persistence with sqlite**
   - start: `src/server/persistence/persistence-contract.ts`
   - task: add sqlite adapter behind `CollectionStore`
   - avoid: changing service/builder signatures

