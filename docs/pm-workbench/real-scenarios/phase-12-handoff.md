# Phase 12: Real Scenario Landing Handoff

## Selected scenarios (exactly 2)

1) **Scenario A: Weekly Sync / 日常进展更新（例会）**  
2) **Scenario B: Release Review / 版本发布评审**

## What became “real” (replaced placeholders)

- Input event payloads now support scenario-grade fields:
  - meetingId/meetingDate
  - decisionType (weekly-sync / release-review)
  - linkedVersionId + releaseDecision
  - followups[] (action items)
- Decision-note writeback now produces a **DecisionLogRecord + followups** (stored in local persistence).

## Key entry points

- `/input-inbox`: templates + confirm/writeback
- `/projects/[projectId]`: decisions + followups + alerts
- `/version-governance`: release review decision panel + version alerts

## What is still placeholder

- Full stage status machine and stage-level acceptance gate UI (kept lightweight)
- Auto-linking recommendation outcome → decision/review is still manual

## How cheap models should extend

- Add more scenario fields: `src/lib/types/input-events.ts` (do not add page-local state)
- Add more scenario rules:
  - writeback: `src/server/services/event-writeback-service.ts`
  - alerting: `src/server/services/alerting-service.ts`
- Keep governance boundaries (metrics + data quality + alerts) intact.

