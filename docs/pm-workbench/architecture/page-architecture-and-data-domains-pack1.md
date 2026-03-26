# PM-WORKBENCH 架构定型（第 1 包）：页面信息架构与数据域切分

> 目标：把一个“能力页集合”正式重构成“从使用者视角可理解、从产品页面可导航、从后台数据可管理”的系统骨架。第 1 包只做结构收口与域边界说明，不做全量旧页面迁移/持久化终态/视觉重设计。

## 0. 页面树（分类）

### 一级主入口（仅保留 6 个）
1. `GET /login`  
   - 登录入口（mock/feishu OAuth 最小链路）
2. `GET /me`  
   - 当前用户工作台（scope、角色视角提示）
3. `GET /projects`  
   - 项目列表（通过 `project-service` 消费统一项目身份）
4. `GET /input-inbox`  
   - 输入收件箱（Raw → Draft → Confirm → Writeback 主链路）
5. `GET /executive-dashboard`  
   - 管理驾驶舱（指标治理、质量可信度、主动预警与建议聚合）
6. `GET /data-exchange`  
   - 导入导出与外部协同（import preview/apply、export bundle、readiness 消费）

### 项目内页签（挂载到 `GET /projects/[projectId]`）
- `GET /projects/[projectId]`：概览页（项目基础信息 + 风险/质量边界 + 最近事件 + 外部映射）
- `GET /projects/[projectId]/execution`：执行页（任务执行聚合、依赖、风险提示、写回准备）
- `GET /projects/[projectId]/progress`：进度页（快照对比、阶段拆解、质量与风险聚合）
- `GET /projects/[projectId]/version`：版本页（项目关联版本的治理状态/发布准备度）
- `GET /projects/[projectId]/resources`：资源页（人员负载、allocation 关系、人力成本对比）
- `GET /projects/[projectId]/reviews`：复盘页（项目发布评审结论、经验沉淀）

### 辅助页（仅保留 3 个）
- `GET /projects/new`：新建项目入口骨架
- `GET /profile`：个人资料（当前用户身份与档案展示）
- `GET /admin`：后台管理入口骨架（运行与种子数据维护入口，RBAC 在第 2 包补齐）

### 后台管理页（第 1 包的页面层入口）
- 统一入口：`/admin`
- 具体“管理中心”在第 2 包继续拆分成域级页面（本包只做骨架收口）

### legacy / redirect 页（不进主导航）
- 不再出现在 sidebar 的全局能力页（仅用于过渡或替代路径提示）
  - `/dashboard`：仅做 redirect（见下）
  - `/task-execution`、`/project-progress`、`/version-governance`、`/people-resources`、`/manpower-cost`：保留但做 legacy 提示（不作为主路径）
  - `/tasks`、`/versions`、`/docs-index`、`/change-log`、`/references`、`/settings`：legacy 提示或隐藏
  - 本包不要求全量改完所有 legacy，只要求“结构定型并给出迁移策略可读性”。

## 1. 每页职责（使用者角色、场景、关键能力/不做什么）

> 角色视角来自 `CurrentUserProvider -> buildCurrentUserContext -> buildUserAccessContext`。

### `GET /login`
- 给谁用：未建立 session/或需要切换登录模式的用户
- 场景：进入系统前
- 关键能力：提供 Feishu OAuth 最小链路入口
- 不承担：组织同步、身份绑定 UI（第 2 包）
- 与其他页面关系：成功登录后建议跳转到 `/me`（再从 `/projects` 进入项目内页签）

### `GET /me`
- 给谁用：所有登录后用户
- 场景：需要确认自己当前可见范围（scope）时
- 关键能力：展示 `projectScope`（mode + projectIds）
- 不承担：权限审批/审计（第 2 包）
- 与其他页面关系：
  - 从这里进入：`/projects` / `/input-inbox` / `/executive-dashboard`

### `GET /projects`
- 给谁用：普通成员、项目经理、管理层（按权限消费列表）
- 场景：开始任何项目治理动作前
- 关键能力：统一项目身份（canonicalId/legacyId）与列表聚合
- 不承担：项目写回（写回在输入中心完成）
- 与其他页面关系：
  - 点击项目 -> `GET /projects/[projectId]`，再通过页签进入 execution/progress/version/resources/reviews

### `GET /projects/[projectId]`（概览）
- 给谁用：项目参与者 + 需要快速决策对齐的人
- 场景：需要“看清现状 + 最近事件 + 外部映射 + 复盘入口”
- 关键能力：项目快照聚合摘要、风险与质量边界展示、最近确认事件、外部 readiness/mapping 展示
- 不承担：大规模筛选/跨项目对比（跨项目在 executive-dashboard）
- 与其他页面关系：
  - 页签进入执行/进度/版本/资源/复盘
  - 最近事件：来自输入中心写回后的确认痕迹

### `GET /projects/[projectId]/execution`
- 给谁用：项目经理、交付负责人、任务执行者
- 场景：需要查看任务主链路、依赖与写回就绪范围
- 关键能力：复用现有 `TaskExecutionWorkbench`，并在页面级锁定 `fixedProjectId`
- 不承担：项目列表过滤与跨项目对比（只读项目范围）

### `GET /projects/[projectId]/progress`
- 给谁用：项目经理、质量/交付治理负责人
- 场景：需要“快照对比 + 阶段拆解 + 质量与风险聚合”
- 关键能力：复用现有 `ProjectProgressWorkbench`，页面级锁定项目
- 不承担：版本治理全局多版本筛选（版本在 `/version`）

### `GET /projects/[projectId]/version`
- 给谁用：版本负责人、管理层 release decision 参与者
- 场景：需要看到项目关联版本的治理状态与发布准备度
- 关键能力：基于 `projectVersionLinkRecords + buildVersionGovernanceRecords` 生成项目版本治理表（只展示该项目关联版本）
- 不承担：版本审批完整流程（写回仍通过输入中心）
- 与其他页面关系：可跳转到 `/projects/[projectId]/reviews`

### `GET /projects/[projectId]/resources`
- 给谁用：资源规划、交付负责人、成本/计划管理
- 场景：需要“人力负载 + allocation 关系 + 成本对比”
- 关键能力：复用现有 `PeopleResourcesWorkbench` 与 `ManpowerCostWorkbench`，页面级锁定项目并隐藏项目筛选控件
- 不承担：敏感财务全量权限隔离（第 2 包补齐）

### `GET /projects/[projectId]/reviews`
- 给谁用：复盘负责人、决策参与者、经验沉淀读者
- 场景：需要“发布评审结论 + lessons learned”
- 关键能力：`reviewService.listPack({ projectId })` 投影到 UI
- 不承担：决策写回（决策写回在版本页动作/输入中心 confirm）

### `GET /input-inbox`
- 给谁用：所有需要“结构化输入并获得写回”的参与者
- 场景：人机确认写回（human-in-the-loop）
- 关键能力：Raw → Draft → Confirm → Writeback 主链路；确认后更新核心域快照
- 不承担：自动审批/自动代执行（禁用自治 Agent）
- 与其他页面关系：
  - 写回后用户可从页面底部“去项目 / 去驾驶舱”回到对应结果页

### `GET /executive-dashboard`
- 给谁用：管理层、治理运营人员
- 场景：需要多项目健康、质量可信度、主动预警建议
- 关键能力：指标治理、质量可信度与主动预警建议聚合
- 不承担：单项目细节钻取（细节在项目内页签）

### `GET /data-exchange`
- 给谁用：外部协同管理员、数据对接负责人
- 场景：需要导入预览/应用、导出 bundle、查看 readiness
- 关键能力：外部 mapping/ready 消费与写回骨架
- 不承担：复杂冲突解决/重试与多格式模板（第 2 包）
- 与其他页面关系：支持“结果回看 -> 去项目/去版本治理”

### `GET /projects/new`
- 给谁用：具备 `view:projects` 权限的用户
- 场景：需要创建新项目
- 关键能力：提供创建入口骨架（表单可扩展）
- 不承担：写模型、持久化终态（第 2 包）

### `GET /profile`
- 给谁用：当前用户
- 场景：自查身份档案与当前 role
- 关键能力：展示 identityRegistry 的 mock/seed 档案信息
- 不承担：组织同步深度映射 UI（第 2 包）

### `GET /admin`
- 给谁用：拥有运营能力的角色（本包只提供入口骨架，RBAC 在第 2 包补齐）
- 场景：维护治理、规则校正、seed 管理入口
- 关键能力：把后台入口集中化，减少“能力页平铺”
- 不承担：生产级后台管理与审批链路

## 2. 页面与路由落地（与代码对应）

本包已新增/接入的路由骨架：
- `/me`、`/profile`、`/admin`、`/projects/new`
- `/projects/[projectId]/execution`
- `/projects/[projectId]/progress`
- `/projects/[projectId]/version`
- `/projects/[projectId]/resources`
- `/projects/[projectId]/reviews`

并新增项目页签组件：
- `src/components/projects/project-detail-tabs.tsx`

## 3. 9 个后台数据域切分（核心对象、读写边界、页面消费）

> 第 1 包在“域切分可读性”上落地：用文档把现在的 repos/services/builders 映射到 9 个业务域。第 2 包再把 repo/service/写模型迁移到域目录结构与权限/幂等策略。

### Domain 1：身份与组织域（Identity & Org）
- 管什么：用户、档案、组织架构、角色定义、identity 绑定、session
- 不管什么：项目/任务执行写模型（只做身份来源）
- 核心对象（建议命名映射）：
  - `users`
  - `user_profiles`
  - `org_units`
  - `teams`
  - `roles`
  - `identity_bindings`
  - `user_sessions`
- 主写模型：`identity_bindings`、`user_sessions`
- 读模型来源：`identityRegistry` + `CurrentUserProvider` + `AccessGuard`
- 页面消费关系：
  - `/login`（发起 feishu session/绑定）
  - `/me` / `/profile`（读取当前用户与 scope）
  - 所有 `AccessGuard` 依赖：permission/viewScope 判断

### Domain 2：项目主数据域（Projects）
- 核心对象：
  - `projects`
  - `project_stages`
  - `project_versions`
  - `project_milestones`
  - `project_members`
  - `project_role_bindings`
- 主写模型：后续在第 2 包实现（本包仅骨架）
- 读模型来源：`projectRepository` / `projectService`
- 页面消费：
  - `/projects`（列表）
  - `/projects/[projectId]`（概览基础信息）
  - `/projects/[projectId]/execution/progress/resources`（项目锁定）

### Domain 3：任务执行域（Tasks）
- 核心对象：
  - `tasks`
  - `task_assignments`
  - `task_activities`
  - `task_dependencies`
  - `blockers`
- 主写模型：由输入中心 confirm 写回（event_writebacks -> task_activities 等）
- 读模型来源：现有 `taskExecutionRecords/taskActivityRecords/taskDependencies` 与 builder 聚合
- 页面消费：
  - `/projects/[projectId]/execution`（任务主链路、依赖、写回准备）
  - `/projects/[projectId]/progress`（阶段与风险聚合引用）

### Domain 4：输入事件域（Input Events）
- 核心对象：
  - `raw_inputs`
  - `parsed_drafts`
  - `input_confirmations`
  - `confirmed_events`
  - `event_writebacks`
  - `event_targets`
  - `event_audit_logs`
- 主写模型：`event_writebacks`、`confirmed_events`
- 读模型来源：`inputEventRepository` + `inputConfirmationService`
- 页面消费：
  - `/input-inbox`（队列、草稿、确认、写回痕迹）
- 写触发：
  - `/projects/[projectId]/execution/progress/version/resources/reviews` 均是读侧聚合（写入只来自输入中心）

### Domain 5：资源与人力投入域（Resources & Manpower）
- 核心对象：
  - `allocations`
  - `manpower_actual_inputs`
  - `resource_profiles`
  - `cost_rates`
  - `resource_pressure_records`
  - `hiring_demands`（placeholder）
- 主写模型：实际投入写回在第 2 包补齐（v0 目前为 preview）
- 读模型来源：现有资源/成本 mock 数据与 builders
- 页面消费：
  - `/projects/[projectId]/resources`（people 负载、allocation、成本对比）
  - `/projects/[projectId]/progress`（资源压力聚合引用）

### Domain 6：风险与质量域（Risks & Quality）
- 核心对象：
  - `risks`
  - `risk_events`
  - `quality_checks`
  - `quality_gates`
  - `defects`
  - `acceptance_records`
- 主写模型：由输入事件 confirm 写入（本包主要是读侧聚合骨架）
- 读模型来源：`qualityService` + 风险 builder
- 页面消费：
  - `/projects/[projectId]`（概览质量摘要）
  - `/projects/[projectId]/progress`（质量门禁/通过率）
  - `/projects/[projectId]/version`（版本治理质量门禁概念映射）

### Domain 7：快照与治理域（Snapshots & Governance）
- 核心对象：
  - `snapshot_batches`
  - `snapshot_points`
  - `comparison_records`
  - `metric_definitions`
  - `metric_versions`
  - `metric_values`
  - `rule_versions`
  - `alerts`
  - `recommendations`
- 主写模型：规则/指标变更（第 2 包扩展）；本包 snapshot 为轻量生成
- 读模型来源：snapshot builders + metric/alert builders
- 页面消费：
  - `/executive-dashboard`（指标治理、质量可信度、主动预警）
  - `/projects/[projectId]/progress`（快照对比）
  - `/projects/[projectId]/version`（治理状态投影）

### Domain 8：复盘与决策域（Reviews & Decisions）
- 核心对象：
  - `reviews`
  - `postmortems`
  - `decision_logs`
  - `lessons_learned`
  - `followups`
- 主写模型：由输入事件 confirm（decision-note 等）写入 reviews/decision_logs
- 读模型来源：`reviewService`
- 页面消费：
  - `/projects/[projectId]/reviews`（决策与经验）
  - `/projects/[projectId]`（最近决策摘要）

### Domain 9：外部协同域（External Collaboration）
- 核心对象：
  - `external_systems`
  - `external_bindings`
  - `import_jobs`
  - `import_preview_rows`
  - `export_jobs`
  - `export_bundles`
  - `readiness_summaries`
  - `sync_status_records`
- 主写模型：import/apply 与 export/generate（本包为骨架）
- 读模型来源：`dataExchangeRepository` + readiness builders
- 页面消费：
  - `/data-exchange`（import/export 与 mapping）
  - `/projects/[projectId]`（外部 readiness / 映射）
  - `/projects/[projectId]/version`（外部 readiness 投影占位）

## 4. 读模型 / Snapshot 模型（页面引用的“该读什么”）

本包建议并已在页面层对齐以下读模型概念（当前由 builder 聚合实现，后续在第 2 包可迁移成真正持久化 snapshot）：
- `project_list_snapshot`：`/projects` 的列表口径
- `project_detail_snapshot`：`/projects/[projectId]` 概览摘要
- `project_execution_snapshot`：`/projects/[projectId]/execution` 的执行聚合口径
- `project_progress_snapshot`：`/projects/[projectId]/progress` 的快照对比口径
- `version_governance_snapshot`：`/projects/[projectId]/version` 的版本治理投影
- `resource_manpower_snapshot`：`/projects/[projectId]/resources` 的资源与成本聚合口径
- `executive_portfolio_snapshot`：`/executive-dashboard` 的多项目驾驶舱聚合口径
- `input_inbox_snapshot`：`/input-inbox` 的队列/确认/写回列表口径
- `readiness_summary_snapshot`：`/data-exchange` 与项目概览页的 external readiness 摘要口径

## 5. 页面-数据域映射（写入/读取边界）

### 写入触发（本包主要写侧）
- `/input-inbox`：触发 `raw_inputs -> parsed_drafts -> input_confirmations -> confirmed_events -> event_writebacks`（eventWritebackService）

### 读取消费（本包主要读侧）
- `/projects` / `/projects/[projectId]` / `/projects/[projectId]/*`：主要消费 Domains 2/3/5/6/7/8/9 的读模型聚合结果
- `/executive-dashboard`：主要消费 Domains 6/7 的治理读模型
- `/data-exchange`：主要消费 Domain 9（外部协同读模型与 mapping）
- `/me / /profile`：主要消费 Domain 1（identity 与 scope）

## 6. legacy 归位策略（保留/隐藏/redirect）

- 仅 redirect：
  - `/dashboard` -> `/executive-dashboard`
- 保留但不进主导航（legacy）：
  - `/task-execution`、`/project-progress`、`/version-governance`、`/people-resources`、`/manpower-cost`
  - `/tasks`、`/versions`、`/docs-index`、`/change-log`、`/references`、`/settings`
- 替代路径：
  - `task-execution/project-progress/version-governance/people-resources/manpower-cost`
    -> 改为分别通过 `projects/[projectId]` 的 `/execution /progress /version /resources` 页签进行钻取

## 7. 第 2 包边界（明确“下一轮继续做什么”）

第 2 包继续接线与迁移方向：
1. 飞书真实身份绑定 UI 与组织同步（完善 Domain 1 的主写模型落地）
2. 写回链幂等/冲突检测（加强 Domain 4 的 event_writebacks 可靠性）
3. 导入导出冲突提示/重试/更复杂模板（Domain 9 的可落地可靠性）
4. 将“读模型概念”落地为真实 snapshot 持久化与一致性重算（Domains 7）
5. 后台管理中心域级页面拆分（`/admin` -> 主数据管理 / 规则与指标管理 / 运行任务管理 / 问题与审计管理 / 演示与种子数据管理）
6. project creation 的写模型与持久化终态（`/projects/new` 从骨架变成可用）

