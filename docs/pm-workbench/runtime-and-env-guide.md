# Runtime & Env Guide (PM-WORKBENCH)

## Environment variables

- `PMW_PERSISTENCE_MODE`: `memory` (default) | `file`
- `PMW_DATA_DIR`: default `.pmw-data` (ignored by git)
- `PMW_SEED_MODE`: `seed` (default) | `seed+fixtures`
- `PMW_DEBUG`: `1` to enable verbose debug (placeholder)
- `PMW_AUTH_MODE`: `mock` (default) | `feishu`
- `NEXT_PUBLIC_PMW_AUTH_MODE`: `mock` (default) | `feishu` (client-side switch)

### Feishu auth env (required when `PMW_AUTH_MODE=feishu`)

- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`
- `FEISHU_REDIRECT_URI`
- optional `FEISHU_BASE_URL` (default `https://open.feishu.cn`)

## Local run

```bash
npm ci
npm run dev
```

## File persistence mode (durable local JSON)

```bash
PMW_PERSISTENCE_MODE=file PMW_DATA_DIR=.pmw-data npm run dev
```

Reset local data:

```bash
npm run pmw:reset:data
```

## Health check

- `GET /api/health`

Returns runtime config + key collection counts (drafts/confirmed/writebacks/snapshot batches).

