# Post-launch: Known Issues & Safe Operating Range

## Known issues (v0)

Source of truth:
- `GET /api/live-issues` (seeded + persisted)

### Toolchain
- ESLint config `next/typescript` missing may break `next build` lint step depending on environment.
  - Disposition: accepted caveat (fix in toolchain alignment batch)

### Identity / Feishu
- Feishu binding UI not implemented
  - Disposition: deferred (requires binding page + org mapping)

## Safe operating range

Recommended:
- Use `PMW_PERSISTENCE_MODE=file` for trial runs and demos
- Always use `/input-inbox` confirmation flow for operational updates
- Keep external mapping updated when demonstrating readiness/export

Not recommended:
- Bypass input confirmation/writeback chain
- Add page-local “scores” or change metric meaning without version bump

Troubleshooting first stops:
- `/api/health`
- `/api/data-governance`
- `/api/alerting`
- `/api/live-issues`

