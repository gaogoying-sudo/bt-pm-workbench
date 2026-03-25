# PM-WORKBENCH Phase 4 Handoff — Identity / Org / Participation / Access Foundation

## 本轮完成摘要

本轮完成“人员身份 / 角色 / 组织 / 权限骨架”收口：建立统一 identity domain（person/role/org/team/session/current user），建立 participation 关系层，并提供轻量 access policy + guard，使系统具备“谁在操作、谁负责什么、谁能看什么”的最小可运行边界。

## 新增/更新文件清单（关键）

### Identity domain
- `src/lib/types/identity.ts`
- `src/data/identity/org-units.ts`
- `src/data/identity/teams.ts`
- `src/data/identity/role-definitions.ts`
- `src/data/identity/persons.ts`（从 `peopleResources` 映射生成 + exec placeholder）
- `src/lib/identity/identity-registry.ts`

### Access / View scope
- `src/lib/types/access.ts`
- `src/data/identity/access.ts`（permissions / groups / policies / viewScopes）
- `src/lib/access/access-service.ts`
- `src/components/identity/access-guard.tsx`（route/section guard）

### Participation layer
- `src/lib/participation/participation-builders.ts`（ProjectParticipationRecord + scope builder）

### Current user context (mock session)
- `src/components/identity/current-user-provider.tsx`（localStorage 记忆当前用户）
- `src/app/layout.tsx`（全局 provider）
- `src/components/layout/topbar.tsx`（CurrentUserSwitcher）

### Input events audit alignment
- `src/lib/types/input-events.ts`：actor 从 `actorId` → `personId`
- `src/app/api/input-events/*`：默认 actor 使用 person identity
- `src/server/services/event-writeback-service.ts`：写回 personId

### Page wiring (user perspective)
- `/executive-dashboard`：增加 `AccessGuard(view:executive-dashboard)`，并按参与范围做最小 scope
- `/input-inbox`：增加 `AccessGuard(view:input-inbox)`
- `/task-execution`：按 current user participation scope 过滤任务（最小差异）
- `/projects/[projectId]`：展示该项目 recent confirmed events（事件 audit 归位）

## 已正式支持的身份/组织/角色/参与关系

- **PersonRecord / RoleDefinitionRecord / OrgUnitRecord / TeamRecord / CurrentUserContext** 已落地
- **ProjectParticipationRecord** 已落地（由 allocation + task owner + PM currentProjectIds 推导）
- **current user switcher** 可切换用户视角（本地 mock session）

## current user context 与轻量权限骨架如何工作

- 当前用户由 `CurrentUserProvider` 管理（localStorage 保存）
- `buildCurrentUserContext()` 组合 person + role + participation scope
- `buildUserAccessContext()` 输出 permissionIds + viewScope + readOnly
- `AccessGuard` 用 permission 做 route/section 的最小访问控制

## 仍然是 mock / placeholder 的部分

- 无真实飞书 OAuth / 无真实通讯录同步（IdentityBindingRecord 仅预留）
- 权限为轻量 role/group + guard（非生产级 RBAC/ABAC）
- participation 关系由现有 mock 数据推导（后续可替换为真实 staffing/assignment 数据源）

## 给后续廉价模型的接力说明（3 个方向）

1. **把 input-events API 的 actor 绑定到 current user**（通过 cookie/header，将 CurrentUserSwitcher 同步到 API 请求）
2. **把 participation/ownership 从推导升级为显式数据**（增加 ProjectRoleBindingRecord / StageOwnershipRecord / TaskAssignmentRecord 的持久化与 UI 编辑入口）
3. **把 access policy 覆盖更多页面区块与操作**（例如确认按钮、写回按钮、质量编辑入口的 action-level guard）

