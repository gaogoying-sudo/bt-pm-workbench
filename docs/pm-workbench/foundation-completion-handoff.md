# PM-WORKBENCH Foundation Completion Handoff

## 本轮完成了什么

本轮将 PM-WORKBENCH 从"已有较成熟聚合层但仍偏半成品的工作台"升级为"前后台主骨架完整、主数据统一、聚合链可持续、核心视图可运行"的基础版多项目运行管理系统。

### 正式落地清单

1. **统一项目身份体系 (Unified Project Identity)**
   - `src/lib/identity/unified-project-registry.ts` — 消除所有页面和 builder 中的 `projectIdMap`，统一 legacy id / canonical id / route id / manpower id 的解析方式
   - `src/lib/identity/role-registry.ts` — 统一角色定义与成本映射，桥接 ResourceRoleRecord 和 EngineerRoleConfig
   - `src/lib/identity/id-resolver.ts` — 通用 ID 解析入口，按命名空间（project/person/role/stage/task）统一处理

2. **后端主骨架 (Backend Skeleton)**
   - Repository 层: `src/server/repositories/` — project、task、person、manpower、quality、snapshot 六大 repository
   - Service 层: `src/server/services/` — project-service、task-service、quality-service、snapshot-service、dashboard-service
   - API Route 层: `src/app/api/` — 10 条正式 API route (projects, projects/[id], tasks, persons, allocations, manpower, snapshots, quality, risk, writeback)
   - Contract 层: `src/server/contracts/` — 统一 response shape（ApiResponse<T>）和 validation 工具
   - Persistence 层: `src/server/persistence/local-store.ts` — 轻量本地持久化抽象，后续可替换为真实数据库

3. **质量维度已进入系统骨架 (Quality Dimension)**
   - 类型: `src/lib/types/quality.ts` — QualityCheckRecord、QualityGateDefinition、ProjectQualitySnapshot
   - Mock 数据: `src/data/quality/quality-check-records.ts` — 5 条质量检查记录 + 2 条质量门禁定义
   - Builder: `src/lib/quality/quality-builders.ts` — 按项目聚合质量快照 + 质量门禁状态判断
   - Service: `src/server/services/quality-service.ts` — 统一质量查询入口
   - API: `src/app/api/quality/route.ts` — 质量数据 API
   - 质量与风险已在系统中独立定义和独立跟踪

4. **Builder 数据源抽象**
   - `project-detail-builders.ts` 已从直接引用 `projects` 和 `manpowerProjects` 数据文件 + 硬编码 `projectIdMap` 改为通过 `unified-project-registry` 的 `getBaseProject()` / `getManpowerProject()` / `getProjectIdentity()` 获取数据
   - 核心 builder 通过 service 层可获得统一数据源

5. **前端核心入口收口**
   - `/dashboard` — 已接入 Executive Overview 聚合层，展示项目健康、交付风险、质量通过率等正式聚合结果
   - `/projects` — 已切换至 `project-service`，展示统一身份（canonical id、manpower 接入状态）
   - `/projects/[projectId]` — 已移除 `projectIdMap`，通过统一身份注册表解析；新增质量摘要面板
   - `/tasks` — 已从旧 Task 类型切换至 TaskExecutionRecord，通过 `task-service` 获取数据
   - 导航已分组：核心运行视图 / 资源与成本 / 索引与治理 / 辅助

6. **Snapshot 正式能力**
   - `snapshot-helpers.ts` 已升级：DEFAULT_SNAPSHOT_DATE 改为动态当日日期
   - 新增 `buildMultiPointSnapshotContext()` 支持配置 snapshotDate / baselineDate / compareDate
   - `snapshotService.resolveSnapshotContext()` 可通过 API 参数配置快照日期
   - `/api/snapshots` API 支持 `?snapshotDate=&baselineDate=&compareDate=` 参数

### 仍然是预留而非正式实现

| 模块 | 状态 | 说明 |
|------|------|------|
| 飞书登录/组织同步 | 结构预留 | identity 层已预留，未接入真实 OAuth |
| 真实数据库 | 结构预留 | local-store 可替换，但当前仍为内存 mock |
| 权限系统 | 结构预留 | API route 无鉴权中间件 |
| 语音输入 | 未涉及 | 不在本轮范围 |
| 供应链集成 | 未涉及 | 不在本轮范围 |
| 全部 builder 数据源切换 | 部分完成 | project-detail-builders 已完成；其他 workbench 组件内的 builder 调用仍直接传入数据参数（已有参数化能力，但参数来源仍是 page 级 import） |
| 质量系统完整业务逻辑 | 占位 | 类型/mock/builder/service/API 骨架已建立，待业务细化 |

## 消除的历史结构问题

1. **`projectIdMap` 散落补丁** — 已从 `project-detail-builders.ts` 和 `projects/[projectId]/page.tsx` 中完全移除，替换为统一身份注册表
2. **双重角色来源** — `role-registry.ts` 桥接了 ResourceRoleRecord 和 EngineerRoleConfig，提供统一 `getRoleDefinition()` / `getDailyRateForRole()` 接口
3. **Dashboard 是静态 mock** — `/dashboard` 已接入 Executive Overview Builder + Quality Service 聚合结果
4. **Tasks 页面是旧类型孤岛** — `/tasks` 已切换至 TaskExecutionRecord + task-service
5. **无后端骨架** — 现有 10 条 API route + 6 repository + 5 service，覆盖全部核心对象
6. **风险与质量未分离** — quality 已独立建模（QualityCheckRecord vs RiskSignal），各自有独立的 builder、service、API

## 给下一轮模型的接力说明

### 后续最值得继续做的 3 个方向

**方向 1: 将剩余 workbench 组件的 builder 调用切换至 service 层**
- 当前 `task-execution-workbench.tsx`、`people-resources-workbench.tsx`、`manpower-cost-workbench.tsx` 等 workbench 组件仍在组件内直接 import 数据文件并传参给 builder
- 目标：改为通过 API fetch 或 server action 调用 service 层
- 切入文件：`src/components/task-execution/task-execution-workbench.tsx` → 改用 `/api/tasks` 或直接调用 `taskService`
- 优先级最高，因为这直接决定了前端是否能完全脱离 mock 数据直连

**方向 2: 补齐单项目详情页的子模块展开能力**
- 当前 `/projects/[projectId]` 展示了聚合摘要，但缺少"展开查看该项目下所有任务/所有资源分配/所有成本明细"的子页面或子面板
- 目标：为每个项目提供 task list、allocation breakdown、stage detail、cost breakdown 的详情展开
- 切入文件：`src/app/projects/[projectId]/page.tsx` → 新增 tab 或子路由
- 这是将"系统入口"变成"可操作工作台"的关键一步

**方向 3: 事件输入与 write-back 正式化**
- 当前 write-back chain 已有 builder（writeback-mappers、actual-input-adapters、allocation-writeback-mappers），也有 `/api/writeback` API
- 但缺少"用户可以通过表单/UI 提交 actual input"的前端入口，以及 write-back 结果持久化的后端处理
- 目标：在 task-execution 或单独页面中增加 actual input 表单，提交后通过 service 层走 write-back chain 并持久化结果
- 切入文件：`src/server/services/task-service.ts` 的 `getWritebackRecords()` → 增加 `submitActualInput()` 方法

### 每个方向的切入原则

1. 不要推翻现有 builder 逻辑，只替换数据来源
2. 新增 UI 时优先复用已有的 workbench 组件模式（useMemo + builder call + InfoCard/StatusBadge/SnapshotContextPanel）
3. 保持 API response 使用统一的 `ApiResponse<T>` 结构
4. 所有项目引用通过 `resolveProjectId()` 或 `getProjectIdentity()` 处理，不要新建 projectIdMap
5. 质量和风险保持独立跟踪
