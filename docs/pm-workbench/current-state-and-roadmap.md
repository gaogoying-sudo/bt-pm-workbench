# PM-WORKBENCH 现状归位与实施路线图

> 本文档配合 `system-architecture-overview.md` 使用。
> 前者定义系统总框架，本文档回答：当前已有内容如何归位、后续该如何继续长。

---

## 一、当前现状归位

### 核心骨架（保留并持续增强）

以下内容是系统的承重结构，后续迭代应在其基础上增强，不应推翻重做：

| 模块 | 代表文件 | 归属层 | 说明 |
|---|---|---|---|
| 任务执行类型 | `src/lib/types/task-execution.ts` | L3 工作对象 | 25+ 字段的任务模型，含层级/依赖/分配关联/风险 |
| 任务执行聚合 | `src/lib/task-execution/*.ts`（6 个文件） | L5 聚合 | 从任务到阶段到项目到人员负载的完整聚合链 |
| 回写链路 | `writeback-mappers.ts` + `allocation-writeback-mappers.ts` + `actual-input-adapters.ts` | L5 聚合 | 任务→分配→人力成本的回写传递 |
| 资源聚合 | `src/lib/resources/*.ts`（5 个文件） | L5 聚合 | 分配聚合/利用率/资源压力/招聘缺口/回写预览 |
| 成本聚合 | `src/lib/manpower/*.ts`（5 个文件） | L5 聚合 | 成本比较/角色费率/回写适配/JSON 导入契约 |
| 项目进度 | `project-progress-builders.ts` + `project-risk-builders.ts` | L5 聚合 | 项目进度快照 + 6 种风险信号自动采集 |
| 版本治理 | `version-governance-builders.ts` + `release-readiness-builders.ts` + `version-risk-builders.ts` | L5 聚合 | 版本治理/准备度/版本风险 |
| 统一项目详情 | `project-detail-builders.ts` | L5 聚合 | 汇聚进度/资源/成本/版本/风险的统一快照 |
| 管理驾驶舱 | `dashboard-builders.ts` | L5 聚合 | 最顶层消费者 |
| 类型系统 | `src/lib/types/`（12 个文件） | L1-L6 | 覆盖全域 |
| 视图配置 | `src/lib/view-config/`（5 个文件） | L7 视图 | 双语标签/色调/筛选/状态标签 |
| 共享组件 | `src/components/shared/`（4 个文件） | L7 视图 | 数据来源/快照口径/规则口径/双语字段 |
| 治理文档 | `docs/governance/`（6 个文件） | 治理 | 隔离规则/版本策略/文档策略/引用策略 |

### 过渡实现（后续需要统一收口）

| 模块 | 代表文件 | 问题 | 建议处理 |
|---|---|---|---|
| 旧 Project 定义 | `src/lib/types/domain.ts` → `Project` | ID 格式与 ManpowerProject 不一致 | Phase 1 统一为 `project-xxx` 格式 |
| 旧 Task 定义 | `src/lib/types/domain.ts` → `Task` | 与 TaskExecutionRecord 并行，字段/枚举不一致 | Phase 1 将 `/tasks` 页面切换到 TaskExecutionRecord |
| 旧 VersionRecord | `src/lib/types/domain.ts` → `VersionRecord` | 与 VersionGovernanceRecord 并行 | Phase 2 评估合并 |
| projectIdMap 硬编码 | `project-detail-builders.ts` L11-14 + `[projectId]/page.tsx` L13-16 | 两处维护，新增项目必须手动同步 | Phase 1 引入统一映射 |
| 角色双轨 | `ResourceRoleRecord` vs `EngineerRoleConfig` | 通过模糊名称匹配桥接 | Phase 2 统一角色注册表 |
| Dashboard | `src/app/dashboard/page.tsx` + `lib/mock/overview.ts` | 使用简单统计，未接入聚合层 | Phase 1 切换到 executive-dashboard builder 或独立 builder |

### 页面壳子（后续视需要增强或合并）

| 页面 | 当前状态 | 建议 |
|---|---|---|
| `/tasks` | 直接读 `data/tasks.ts`，旧类型 | 考虑合并到 `/task-execution` 或切换到新类型 |
| `/versions` | 直接读 `data/versions.ts`，旧类型 | 考虑合并到 `/version-governance` |
| `/docs-index` | 直接读 `data/docs.ts`，简单列表 | 保留，后续增强为文档治理视图 |
| `/change-log` | 直接读 `data/changes.ts`，简单列表 | 保留，后续接入变更审批流 |
| `/references` | 直接读 `data/references.ts`，简单列表 | 保留，后续接入引用审批流 |
| `/settings` | 静态治理规则展示 | 保留，后续增加可配置项 |

### 最容易继续做乱的地方

1. **继续在 `domain.ts` 中新增类型**：所有新增对象应评估是放入 `domain.ts`（基础对象）还是放入专属模块类型文件
2. **新增页面不接入聚合层**：每个新页面必须先确认数据来源是 builder 输出还是直接读 mock，避免再产生"旧页面"
3. **在页面组件中做聚合计算**：计算逻辑应统一放在 `src/lib/` 下的 builder/selector 中，组件只消费结果
4. **新增项目数据不同步 projectIdMap**：在 ID 体系统一之前，每新增一个项目都需要更新映射

---

## 二、后续三阶段实施顺序

### Phase 1：系统定义与主数据/主链路收口

**目标**：让现有工程从「半成品拼装」进入「可控系统」状态

优先事项：

1. **统一项目 ID 体系**
   - 将 `domain.ts` 中 `Project.id` 统一为 `project-xxx` 格式（与 `ManpowerProject.id` 对齐）
   - 或引入 `UnifiedProjectIdentityMap`，在一处维护所有 ID 映射
   - 消除 `projectIdMap` 硬编码
   - 涉及文件：`data/projects.ts`、`domain.ts`、`project-detail-builders.ts`、`[projectId]/page.tsx`、所有引用 project.id 的旧页面

2. **统一任务类型**
   - 将 `/tasks` 页面切换到使用 `TaskExecutionRecord`
   - 评估 `domain.ts` 中的 `Task` 是否仍需保留（如是，降级为 `LegacyTask` 并标注）
   - 或者将 `/tasks` 合并到 `/task-execution`

3. **Dashboard 接入聚合层**
   - 让 `/dashboard` 消费 `buildExecutiveOverviewSnapshot()` 或新建 `buildDashboardOverview()`
   - 替换 `lib/mock/overview.ts` 的简单统计

4. **导航分组**
   - 将 Sidebar 14 个入口分为「核心运行视图」和「索引与配置」两组
   - 让用户清晰区分主力 workbench 页面和辅助索引页

### Phase 2：核心对象与事件输入/快照能力收口

**目标**：补齐系统的「输入端」和「时间维度」

优先事项：

1. **定义统一事件输入接口**
   - 设计 `InputChannel` 抽象：`parse(rawInput) → TaskActivityRecord | ActualInputRecord`
   - 为语音/文本/消息/表单输入预留适配器位置
   - 不实现语音解析，只定义链路

2. **定义质量维度**
   - 新增 `QualityCheckRecord` 或类似类型
   - 与 `ProjectRiskSignal` 分开，风险管概率/影响，质量管合规/评审
   - 在 builder 层预留质量聚合入口

3. **快照存储与历史对比**
   - 将 `MOCK_TODAY` 和固定日期替换为可配置的快照时间参数
   - 设计快照存储格式（即使暂存为 JSON 文件也行）
   - 支持至少「当前 vs 基线」两个时间点的比较

4. **角色注册表统一**
   - 将 `ResourceRoleRecord` 和 `EngineerRoleConfig` 合并为统一的 `RoleDefinition`
   - 消除 `role-cost-mappers.ts` 中的模糊名称匹配

5. **数据获取方式标准化**
   - 为 builder 函数引入数据源抽象（至少是参数注入）
   - 使后续替换为 API 调用时不需要改 builder 逻辑

### Phase 3：分模块增强与真实接入预留

**目标**：让系统具备真实运行的基础条件

优先事项：

1. **API 层设计与实现**
   - Next.js Route Handlers（`app/api/`）
   - 定义核心 API 契约（项目/任务/人员/分配/快照 CRUD）
   - builder 函数从 API 获取数据而非 import mock

2. **飞书身份接入预留**
   - 在 Layer 1 实现 `IdentityProvider` 接口
   - 设计飞书 OAuth 登录流程（可先用 mock 身份验证通流程）
   - 将 `PersonResourceRecord.id` 与飞书 userId 建立映射

3. **权限与审计**
   - 基于飞书身份的角色权限（至少区分「查看者/编辑者/管理者」）
   - 操作审计日志

4. **旧页面增强或退役**
   - `/docs-index` → 文档治理视图（接入变更审批流）
   - `/change-log` → 变更审批流视图
   - `/references` → 引用审批流视图
   - `/tasks` + `/versions` → 评估是否合并到对应 workbench 页面

---

## 三、下一轮最值得继续做的 3 个模块

### 模块 1：统一项目 ID 与主数据收口（最高价值）

**为什么最值得做**：这是当前仓库中唯一横跨全部 builder/page/data 的结构性债务。每个新增项目都会因为 `projectIdMap` 硬编码而引入维护风险。解决它后，所有已有的 7 个 workbench 页面和 15+ 个 builder 函数的数据流转将自动畅通，不再需要任何映射补丁。

**预期工作量**：中等（主要是 ID 重命名和映射消除，不需要新增业务逻辑）

**承上启下**：收口后，Phase 2 的质量维度、事件输入、快照存储都可以直接使用统一 ID，不会再被双重 ID 问题干扰。

### 模块 2：Dashboard 接入聚合层 + 导航分组

**为什么最值得做**：`/dashboard` 是系统入口页面，但目前使用的是最简单的统计（`lib/mock/overview.ts`），与已经非常成熟的 `/executive-dashboard` 形成割裂。将 Dashboard 接入聚合层后，用户进入系统的第一印象就会从「半成品」变为「完整系统」。同时，导航分组让用户能快速区分核心运行视图和辅助索引页。

**预期工作量**：较小（`executive-dashboard` 的 builder 已经存在，只需让 Dashboard 消费它）

**承上启下**：Dashboard 升级后，可以进一步考虑是否将 `/dashboard` 和 `/executive-dashboard` 合并为一个可切换视角的入口。

### 模块 3：旧 Task 类型统一与 /tasks 页面收口

**为什么最值得做**：`domain.ts` 中的 `Task`（10 字段，旧枚举）与 `task-execution.ts` 中的 `TaskExecutionRecord`（25+ 字段，新枚举）并行存在，造成两套数据、两套页面、两套状态定义。这不仅让开发者困惑，也让后续模型在新增任务相关功能时容易选错类型。

**预期工作量**：中等（需要评估 `/tasks` 页面的去留，以及 `domain.ts` 中 Task 类型的处理方式）

**承上启下**：任务类型统一后，Phase 2 中定义的事件输入链路（`TaskActivityRecord`）和质量维度（`QualityCheckRecord`）才能有一个清晰的挂载点。

---

## 四、给下一轮模型的接力说明

你拿到的是 PM-WORKBENCH 第 1 包的系统总框架定义。当前仓库已有 7 个深度接入聚合层的 workbench 页面、15+ 个 builder/selector/aggregator/mapper、完整的回写链路和 12 个领域类型文件。

**下一轮应优先进入**：统一项目 ID 与主数据收口（上述模块 1）。

**原因**：这是唯一横跨全部模块的结构性债务，不解决它，后续所有新增项目和聚合都会被 `projectIdMap` 硬编码拖累。具体做法建议：

1. 将 `data/projects.ts` 中 `Project.id` 从 `pm-workbench` 改为 `project-pm-workbench`（与 `ManpowerProject.id` 对齐）
2. 消除 `project-detail-builders.ts` 和 `[projectId]/page.tsx` 中的 `projectIdMap`
3. 更新所有引用旧 ID 的页面和 mock 数据
4. 如果不想改旧 ID，则引入 `src/lib/project-identity/unified-project-map.ts`，在一处集中维护映射

**请勿推翻**：当前已有的聚合层（`src/lib/task-execution/`、`src/lib/resources/`、`src/lib/manpower/`、`src/lib/project-progress/`、`src/lib/version-governance/`、`src/lib/executive-dashboard/`）和 builder 体系——它们是这个系统中成熟度最高的部分，后续迭代应在其基础上增强。
