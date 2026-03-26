# 页面迁移与数据接线收口（第 2 包）

本文档说明 Pack 2 完成后的**正式主路径**、**读模型消费链**、**旧页处理**与**遗留项**。Pack 1 已定型的页面树与 9 域模型不在此重定义。

## 1. 新页面结构已接通

| 路径 | 说明 |
|------|------|
| `/login` | 登录说明与默认落地 `/me`、Executive 等入口 |
| `/me` | 我的工作台；`?from=` 显示 legacy 提示 |
| `/projects` | 项目列表，消费 `project_list_snapshot` |
| `/projects/new` | 新建入口：种子列表 + GET `/api/projects` + 占位表单 |
| `/projects/[projectId]` | 项目中枢 + 共享 layout（标题/阶段/页签） |
| `/projects/[projectId]/execution` … `/reviews` | 项目内页签 |
| `/input-inbox` | 输入事件域 + `input_inbox_snapshot` 摘要 |
| `/executive-dashboard` | 驾驶舱 + `executive_portfolio_snapshot` 元信息 |
| `/data-exchange` | 外部协同 + readiness 摘要 |
| `/profile` | 个人资料（身份注册表 mock） |
| `/admin` | 五类后台管理入口 + 域锚点说明 |

一级入口：**侧栏 Primary + 顶栏**（不再平铺旧能力页）。

## 2. 旧页面处理（redirect / legacy）

| 旧路径 | 行为 |
|--------|------|
| `/dashboard` | redirect → `/executive-dashboard`（既有） |
| `/task-execution` | redirect → `/projects/pm-workbench/execution?from=legacy-global-task-execution` |
| `/project-progress` | redirect → `/projects/pm-workbench/progress?...` |
| `/version-governance` | redirect → `/projects/pm-workbench/version?...` |
| `/people-resources` | redirect → `/projects/pm-workbench/resources?...` |
| `/manpower-cost` | redirect → `/projects/pm-workbench/resources?...` |
| `/tasks` | redirect → `/projects?from=legacy-tasks` |
| `/versions` | redirect → `/projects/pm-workbench/version?from=legacy-versions` |
| `/docs-index` | redirect → `/me?from=legacy-docs-index` |
| `/change-log` | redirect → `/closeout?from=legacy-change-log` |
| `/references` | redirect → `/me?from=legacy-references` |
| `/settings` | redirect → `/admin?from=legacy-settings` |

桥接默认项目 route id：`pm-workbench`（`LEGACY_BRIDGE_ROUTE_ID`）。

## 3. 九业务域在代码中的落点

| 域 | 主要锚点 |
|----|----------|
| 身份与组织 | `personRepository`、`identity-registry`、域定义见 `business-domains.ts` |
| 项目主数据 | `projectRepository`、`projectService`、`project_*_snapshot` |
| 任务执行 | `taskRepository`、任务 builders、`project_execution_snapshot` |
| 输入事件 | `inputEventRepository`、`input_inbox_snapshot` |
| 资源与人力投入 | builders + `resource_manpower_snapshot` |
| 风险与质量 | `qualityService`、质量 builders |
| 快照与治理 | `snapshotRepository`、进度/版本 builders、`project_progress_snapshot` / `version_governance_snapshot` |
| 复盘与决策 | `reviewService` |
| 外部协同 | `dataExchangeRepository`、import/export API、`readiness_summary_snapshot` |

聚合注册：`src/server/domains/business-domains.ts`。读模型门面：`src/server/read-models/read-model-service.ts`。

## 4. 页面 → 读模型 / 写入

| 页面 | 主要读模型 / 域 | 写入（概念） |
|------|------------------|--------------|
| `/projects` | `project_list_snapshot` | 无（列表只读） |
| `/projects/[projectId]` | `project_detail_snapshot` + 多域摘要 | 无 |
| `/execution` | `project_execution_snapshot` | 任务/写回经既有链路 |
| `/progress` | `project_progress_snapshot` | 无 |
| `/version` | `version_governance_snapshot` | 无 |
| `/resources` | `resource_manpower_snapshot`（概念）+ 工作台 | 无 |
| `/reviews` | `reviewService` | 经 `/api/reviews`（若启用） |
| `/input-inbox` | `input_inbox_snapshot` | `inputEventRepository` |
| `/executive-dashboard` | `executive_portfolio_snapshot` + 客户端 builders | 无 |
| `/data-exchange` | `readiness_summary_snapshot` + UI | import/export API |

## 5. 推荐路径 vs 兼容路径

- **推荐**：侧栏 Primary → 项目列表 → 项目详情页签；输入 → Inbox；全局视图 → Executive；外部数据 → Data Exchange；治理 → Admin / Closeout。
- **兼容**：带 `?from=legacy-*` 的 URL、旧全局路径（已 redirect）。

## 6. 遗留项（后续小任务，非新大包）

- 部分页面仍含客户端 builders（如 Executive 工作台内部），读模型已在页面层增加门面元数据，可逐步把展示块迁到纯服务端聚合。
- `projects/new` 的 POST 创建未开通；种子/本地持久化仍非生产终态。
- RBAC 与飞书登录仍为骨架；`input-event` 本地 store 带 demo 色彩。
- 未物理删除旧路由文件，仅改为 redirect，便于深链兼容。

## 7. 验收对照（Pack 2）

- 一级主入口与项目页签可运行；主导航不并列旧能力中心页。
- 九域在 `business-domains` + `read-model-service` 可定位。
- 迁移结果与路由对照以本文档与 Pack 1 文档共同为准。
