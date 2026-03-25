# Testing & Regression Checklist (PM-WORKBENCH)

## Automated tests

```bash
npm run test
```

Coverage (minimum):
- unified project identity resolution
- input raw → draft → confirm → writeback
- snapshot compare generation (timeline points accept explicit dates)
- quality aggregation snapshot

## Manual smoke checklist

### Bootstrap
- `npm ci`
- `npm run dev`
- optional durable mode: `PMW_PERSISTENCE_MODE=file npm run dev`
- optional reset: `npm run pmw:reset:data`

### Health
- open `GET /api/health`

### Core pages
- `/projects`
- `/projects/[projectId]`
- `/task-execution`
- `/project-progress?snapshotDate=2026-03-25&baselineDate=2026-02-01&compareDate=2026-03-01`
- `/version-governance?snapshotDate=2026-03-25&baselineDate=2026-02-01&compareDate=2026-03-01`
- `/executive-dashboard?snapshotDate=2026-03-25&baselineDate=2026-02-01&compareDate=2026-03-01`

### Input event flow
- go to `/input-inbox`
- capture raw text
- confirm + writeback
- verify:
  - `/projects/[projectId]` shows recent confirmed events
  - `/task-execution` shows recent confirmed events
  - `/executive-dashboard` shows recent confirmed events

