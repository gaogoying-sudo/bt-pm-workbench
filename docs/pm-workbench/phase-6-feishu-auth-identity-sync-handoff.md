# PM-WORKBENCH Phase 6 Handoff — Feishu Auth / Identity Sync / Access Binding (Minimal)

## 本轮完成摘要

本轮将系统从“mock session”推进到“可配置飞书真实登录主链”的最小可运行骨架：  
login entry → callback → token exchange → user profile fetch → session persistence → current user resolution → access guard。

同时保留 `mock` 模式（开发效率不受影响）。

## 新增/更新文件清单（关键）

### Auth routes
- `src/app/api/auth/feishu/login/route.ts`（生成飞书登录 url）
- `src/app/api/auth/feishu/callback/route.ts`（code→token→profile→session cookie）
- `src/app/api/auth/session/route.ts`（GET current session / DELETE logout）

### Feishu adapters
- `src/server/adapters/feishu/feishu-config.ts`
- `src/server/adapters/feishu/feishu-oauth.ts`

### Session / binding persistence
- `src/server/auth/session-types.ts`
- `src/server/repositories/session-repository.ts`
- `src/server/repositories/identity-binding-repository.ts`

### UI entry
- `src/app/login/page.tsx`
- `.env.example`（Feishu env 占位）
- `docs/pm-workbench/runtime-and-env-guide.md`（新增 auth env）

### Current user resolution
- `src/components/identity/current-user-provider.tsx`（client-side: `NEXT_PUBLIC_PMW_AUTH_MODE=feishu` 时拉 `/api/auth/session`）
- `src/server/config/runtime-config.ts`（新增 `authMode`）

## 飞书真实登录 / session / binding 主链如何落地

1. 配置 env：
   - `PMW_AUTH_MODE=feishu`
   - `NEXT_PUBLIC_PMW_AUTH_MODE=feishu`
   - `FEISHU_APP_ID / FEISHU_APP_SECRET / FEISHU_REDIRECT_URI`
2. 获取 login url：
   - `GET /api/auth/feishu/login` → `{ url }`
3. 飞书回调：
   - `GET /api/auth/feishu/callback?code=...`  
     - exchange token
     - fetch user profile
     - create persisted session (`sessions` collection, durable when file mode)
     - set cookie `pmw_session=...`
4. 前端 current user bootstrap：
   - `CurrentUserProvider` 在 feishu 模式调用 `GET /api/auth/session` → set currentUserId
5. Logout：
   - `DELETE /api/auth/session` 清 cookie + 删除 session

## 权限与视图范围如何绑定

Phase 4 的 `AccessGuard` 已存在；本轮提供真实 session 的 personId resolution，后续可以把：
external identity binding → personId → role/group → permissions/viewScope  
收口为真实组织使用的绑定链。

## 仍是 placeholder / fallback 的部分

- external identity -> person binding 目前默认 fallback 到 `person-alice`（避免真实登录接入破坏系统可跑性）
- org/team/role 真实同步仅预留结构，尚未实现全量同步与映射 UI
- 仍未引入生产级 IAM/SSO/审批流

## 后续便宜模型最适合继续接的 3 个方向

1. **Binding UI**：未绑定用户进入后引导选择/创建 PersonRecord 并写入 `identityBindings`
2. **Org mapping**：将飞书 departmentId 映射到 `OrgUnitRecord`（含同步状态记录）
3. **真实 guard 扩展**：把 action-level guard（confirm/writeback/edit quality）绑定到真实 session user

