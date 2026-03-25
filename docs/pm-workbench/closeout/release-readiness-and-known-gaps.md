# Release Readiness & Known Gaps

## Release readiness (current)

Status: **ready with caveats**

### Caveats
- Feishu external identity binding UI not implemented yet (fallback keeps system runnable)
- Persistence is local (memory/file JSON), not a production DB

## Known gaps (transparent)

| Gap | Severity | Disposition | Notes |
|-----|----------|-------------|------|
| Feishu identity binding UI | High | Defer | Add binding page and org mapping logic |
| External mapping upsert semantics | Medium | Defer | Current binding store is add-only |
| Import conflict resolution | Medium | Defer | Preview supports required fields; add overwrite/merge UI later |

## What must be fixed before demo

- None required for basic demo (seed mode)  
- For mapping/import demo: use file persistence mode and run `/data-exchange` import preview/apply once

