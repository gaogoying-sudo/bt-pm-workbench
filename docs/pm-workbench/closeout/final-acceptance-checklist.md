# Final Acceptance Checklist (PM-WORKBENCH)

This checklist is designed to be **executable** (pages + APIs + commands), not a generic template.

## Bootstrap

- Install: `npm ci`
- Dev run: `npm run dev`
- Optional durable mode: `PMW_PERSISTENCE_MODE=file PMW_DATA_DIR=.pmw-data npm run dev`
- Reset demo data (durable mode): `npm run pmw:reset:data`

## Health

- `GET /api/health` should return `ok: true` + runtime config + collection counts.

## Auth / session

- Mock mode: `NEXT_PUBLIC_PMW_AUTH_MODE=mock` → Topbar user switcher works
- Feishu mode (optional): `PMW_AUTH_MODE=feishu` + `NEXT_PUBLIC_PMW_AUTH_MODE=feishu` + env configured
  - `GET /api/auth/feishu/login` returns login url
  - `GET /api/auth/session` returns a session after callback

## Core walkthrough (must not crash)

- `/executive-dashboard`
- `/projects`
- `/projects/pm-workbench`
- `/task-execution`
- `/project-progress?snapshotDate=2026-03-25&baselineDate=2026-02-01&compareDate=2026-03-01`
- `/version-governance?snapshotDate=2026-03-25&baselineDate=2026-02-01&compareDate=2026-03-01`

## Input events flow (must be human-in-the-loop)

- `/input-inbox`
  - capture raw text → draft appears
  - confirm → writeback record created
  - verify recent confirmed events appear in:
    - `/projects/pm-workbench`
    - `/task-execution`
    - `/executive-dashboard`

## Snapshot / quality

- `GET /api/snapshots?snapshotDate=2026-03-25&baselineDate=2026-02-01&compareDate=2026-03-01`
- `GET /api/quality`

## External collaboration (import/export/readiness)

- `/data-exchange`
  - import preview → apply (writes external mapping)
  - export bundle download (JSON)
- `GET /api/readiness?type=project`
- `GET /api/data-exchange`

## Automated checks

- `npm run typecheck`
- `npm run test`
- `npm run build`

