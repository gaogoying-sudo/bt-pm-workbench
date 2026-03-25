# Demo Data & Reset Guide

## Demo data sources

- **Seed baseline data**: committed under `src/data/**` (stable)
- **Mutable local persisted data** (optional): `.pmw-data/*.json` when `PMW_PERSISTENCE_MODE=file`
  - sessions
  - input events (raw/drafts/confirmed/writebacks)
  - snapshot batches
  - data-exchange jobs/bundles/bindings

## Recommended demo mode

Use **file persistence mode** so you can demonstrate import/export history, mappings, and inbox flows with durable state.

```bash
PMW_PERSISTENCE_MODE=file PMW_DATA_DIR=.pmw-data npm run dev
```

## One-command demo reset

```bash
npm run pmw:demo:reset
```

After reset:
- restart dev server
- open `/closeout` → follow the role-based demo path

## Demo scenario (suggested)

1. Open `/executive-dashboard` → show readiness counters and deltas
2. Open `/projects/pm-workbench` → show readiness + mapping missing
3. Open `/data-exchange`:
   - run Import Preview + Apply to bind `externalProjectId`
   - run Export Supply Readiness (download JSON bundle)
4. Open `/projects/pm-workbench` again → mapping now present, readiness reasons updated
5. Open `/input-inbox` → capture → confirm → writeback → see recent events on project/task/executive pages

