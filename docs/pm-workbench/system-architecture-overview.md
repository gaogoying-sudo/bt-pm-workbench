# PM-WORKBENCH 系统总框架

> 本文档基于当前仓库（`bt-pm-workbench`）已有的 68 个 TypeScript 模块、33 个 TSX 页面/组件、24 个 mock 数据文件和 11 个治理/产品文档逐一阅读后产出。
> 所有结论均指向仓库中的具体文件路径和代码结构，不脱离当前实现空想。

---

## 一、系统总定义

PM-WORKBENCH 是一个 **多项目运行管理系统（Multi-Project Operating Workbench）**。

它不是静态仪表盘，而是一个具备 **持续输入 → 聚合计算 → 回写传递 → 快照治理** 能力的运行系统，用于在多项目、多版本、多人员并行场景下，对项目执行、资源投入、人力成本、版本推进和交付风险进行统一管理与治理。

核心服务目标：

- 在一个统一视图中管理多个并行项目的执行进度、资源分配和成本投入
- 通过聚合与回写链路，让任务执行数据自动流转到资源、成本、版本治理等上游模块
- 通过快照机制，为每个时间节点保留可比较的治理基线
- 通过风险信号自动采集，将阻塞、逾期、资源压力等问题主动推到管理层视图
- 为未来低摩擦输入（语音/文本/消息 → 结构化回写）预留事件输入链路

## 二、系统不是什么

- 不是客户交付门户（Client Delivery Portal 是被管理的项目之一，不是本系统）
- 不是旧工作台或菜谱解析专项线的延续（已在 `docs/governance/project-definition.md` 中明确）
- 不是 OA / HR / ERP / 财务系统（人员数据未来来自飞书，成本数据仅做投入估算，不做财务核算）
- 不是纯前端看板工具（已具备 builder/selector/aggregator/writeback-mapper 构成的计算层）
- 不是一次性分析报告（设计为可持续维护的运行系统，文档和数据结构均支持迭代）

## 三、系统边界

### 系统内

- 项目主数据管理（项目、阶段、版本、所有权）
- 任务执行管理（工作项、依赖、执行记录、进度）
- 人员与资源管理（人员、角色、分配、招聘缺口）
- 人力成本管理（计划/实际对比、角色费率、回写适配）
- 版本治理（版本-项目关联、发布准备度、治理状态）
- 项目进度聚合（任务 → 阶段 → 项目 → 风险信号）
- 管理驾驶舱（跨项目健康、资源负载、版本推进、交付风险）
- 快照与时间维度（基线日、快照日、对比口径）
- 治理规则（隔离规则、版本策略、文档策略、引用策略）

### 系统外（预留接口，本轮不实现）

- 飞书登录与组织架构同步
- 真实数据库与 API 服务
- 权限与审计系统
- 语音/文本输入解析
- 供应链与外部系统集成
- 消息通知与协作流

---

## 四、系统分层框架

以下 8 层从底向上排列，每层标注在当前仓库中的具体落点、已有能力和缺口。

### Layer 1：身份与人员层（Identity & People）

**职责**：管理人员身份、组织归属、角色定义、可投入状态。未来飞书登录/组织/岗位/角色从这里进入系统。

**当前仓库落点**：

- `src/lib/types/people-resources.ts`：`PersonResourceRecord`（含 employeeType/status/primaryRoleId/skillTags/seniorityLevel/availabilityStatus/currentUtilization）
- `src/lib/types/people-resources.ts`：`ResourceRoleRecord`（角色定义，含 category/levelRange/defaultCapacity/defaultUtilizationRange）
- `src/data/resources/people-resources.ts`：8 条 mock 人员记录
- `src/data/resources/resource-roles.ts`：角色配置数据
- `src/data/resources/sensitive-cost-profiles.ts`：敏感成本信息（salaryBand/monthlyBaseCost/visibilityScope）

**已有能力**：人员主数据、角色定义、可投入状态、敏感成本分离

**缺口**：无身份认证；无登录态；人员 ID 是 mock 字符串，未来需与飞书人员 ID 统一映射；无组织/部门层级结构

**结构预留建议**：未来飞书登录后，在此层增加 `IdentityProvider` 接口和 `PersonIdentityMap`，将飞书 userId 映射为系统内 personId，其余层不需要感知飞书

### Layer 2：项目主数据层（Project Master Data）

**职责**：统一管理项目定义、阶段划分、版本链、所有权和参与关系。

**当前仓库落点**：

- `src/lib/types/domain.ts`：`Project`（含 id/code/type/status/phase/owner/currentVersion/isSealed）
- `src/lib/types/manpower.ts`：`ManpowerProject`（含 id/code/status/priority/owner/currentPlanVersionId）、`ProjectStagePlan`（含 stageOrder/plannedStartDate/plannedEndDate/elasticityFactor）、`PlanVersion`（含 isBaseline/sourceType/status）
- `src/data/projects.ts`：5 条 Project 记录（ID 格式：`pm-workbench`）
- `src/data/manpower/manpower-projects.ts`：2 条 ManpowerProject 记录（ID 格式：`project-pm-workbench`）
- `src/data/manpower/manpower-stage-plans.ts`：阶段计划数据
- `src/data/manpower/manpower-plan-versions.ts`：计划版本数据

**已有能力**：项目基础信息、阶段定义与排序、计划版本与基线管理

**缺口（最关键的结构性问题）**：存在 **双重项目 ID 体系** — `domain.ts` 中的 `Project.id`（如 `pm-workbench`）与 `manpower.ts` 中的 `ManpowerProject.id`（如 `project-pm-workbench`）不一致，需要在 `project-detail-builders.ts` 和 `projects/[projectId]/page.tsx` 中维护硬编码的 `projectIdMap`。这是当前仓库最需要优先收口的问题。

### Layer 3：工作对象层（Work Object）

**职责**：定义系统中被管理的核心工作对象及其关系：任务、版本记录、文档记录、变更记录、引用记录、分配记录、招聘需求。

**当前仓库落点**：

- `src/lib/types/domain.ts`：`Task`、`VersionRecord`、`DocumentRecord`、`ChangeRecord`、`ReferenceRecord`
- `src/lib/types/task-execution.ts`：`TaskExecutionRecord`（更丰富的任务模型，含 taskType/taskLevel/stageId/parentTaskId/collaboratorPersonIds/relatedAllocationIds/riskLevel/blockerSummary/deliverableSummary）、`ProjectStageTaskLink`（任务-阶段关联，含 weight/isMilestoneRelated）、`TaskDependencyRecord`、`TaskActivityRecord`、`TaskViewPreset`
- `src/lib/types/people-resources.ts`：`ProjectAllocationRecord`（人员-项目分配，含 allocationRate/allocationMode/phaseIds）、`HiringDemandRecord`
- `src/lib/types/version-governance.ts`：`ReleaseWindowRecord`

**已有能力**：工作对象体系相当完整，`TaskExecutionRecord` 已经是一个具有工程深度的任务模型（含层级/依赖/分配关联/风险/阻塞）

**缺口**：`domain.ts` 中的 `Task` 与 `task-execution.ts` 中的 `TaskExecutionRecord` 是两套并行类型，前者被旧页面（`/tasks`）使用，后者被新 workbench 页面使用，需要统一收口。风险（Risk）和质量（Quality）在当前仓库中未分离 — 风险信号已存在于 `ProjectRiskSignal` 和 `VersionRiskSignal`，但质量维度（如交付物质量评审、代码质量门禁）尚未定义。

### Layer 4：事件输入层（Event & Input）

**职责**：定义外部输入如何进入系统并沉淀为结构化记录。未来语音/文本/表单/消息输入从这里进入。

**当前仓库落点**：

- `src/lib/types/task-execution.ts`：`TaskActivityRecord`（执行记录，含 recordType/progressDelta/spentWorkDays/riskFlag/blockerFlag/comment）
- `src/lib/types/manpower.ts`：`ActualInputRecord`（实际投入记录，含 sourceType: `manual-json | formula-import | timesheet-sync`）
- `src/lib/manpower/json-import-contracts.ts`：JSON 导入契约定义
- `src/data/task-execution/task-activity-records.ts`：mock 执行记录
- `src/data/manpower/manpower-actual-inputs.ts`：mock 实际投入记录

**已有能力**：已定义了执行记录和实际投入记录两种输入类型；`ActualInputRecord.sourceType` 已预留 `manual-json`、`formula-import`、`timesheet-sync` 三种输入源；`json-import-contracts.ts` 已定义了 JSON 导入的数据契约格式

**缺口**：没有统一的 `Event` 或 `InputRecord` 抽象；没有事件队列或消费链路；语音/文本输入解析能力需要在此层预留 `InputChannel` 接口

**主链路预留**：未来低摩擦输入的流转路径应为：

```
语音/文本/消息 → InputChannel(parse) → TaskActivityRecord 或 ActualInputRecord → 进入聚合层
```

当前只做架构定义，不做功能实现。

### Layer 5：聚合与回写层（Aggregation & Write-back）

**职责**：这是系统的计算核心。将工作对象层的原始数据，通过 selector/builder/aggregator/writeback-mapper 逐级聚合，最终产出可被视图消费的快照。

**当前仓库落点（已形成完整聚合链路）**：

任务执行聚合链路：
- `src/lib/task-execution/task-aggregate-selectors.ts`：`buildTaskExecutionAggregates()` — 从 `TaskExecutionRecord` + `TaskActivityRecord` 生成 `TaskExecutionAggregate`
- `src/lib/task-execution/stage-aggregate-selectors.ts`：`buildStageExecutionAggregates()` — 从任务聚合 + `ProjectStageTaskLink.weight` 生成 `StageExecutionAggregate`
- `src/lib/task-execution/project-aggregate-selectors.ts`：`buildProjectExecutionAggregates()` — 从阶段聚合汇总生成 `ProjectExecutionAggregate`
- `src/lib/task-execution/person-load-selectors.ts`：`buildPersonTaskLoadAggregates()` — 从人员 + 任务生成 `PersonTaskLoadAggregate`
- `src/lib/task-execution/allocation-consumption-selectors.ts`：`buildAllocationConsumptionAggregates()` — 从分配 + 任务生成 `AllocationConsumptionAggregate`

回写链路：
- `src/lib/task-execution/writeback-mappers.ts`：`buildTaskExecutionWritebackRecords()` — 从任务聚合 + 分配 + 角色费率生成 `TaskExecutionWritebackRecord`（含 estimatedActualCost）
- `src/lib/resources/allocation-writeback-mappers.ts`：`buildAllocationWritebackPreviews()` — 从分配聚合 + 角色费率生成 `AllocationWritebackPreview`
- `src/lib/manpower/actual-input-adapters.ts`：`buildManpowerActualInputAdapterResults()` — 消费任务回写 + 分配回写，适配为人力成本层可用的 `ManpowerActualInputAdapterResult`

资源聚合链路：
- `src/lib/resources/allocation-selectors.ts`：`buildResourceAllocationAggregates()` — 从分配 + 任务 + 人员生成 `ResourceAllocationAggregate`
- `src/lib/resources/allocation-aggregators.ts`：`buildResourcePressureSnapshots()` / `buildAllocationUtilizationSnapshots()` — 生成资源压力和利用率快照
- `src/lib/resources/hiring-gap-builders.ts`：`buildHiringGapSnapshots()` — 生成招聘缺口快照

成本聚合链路：
- `src/lib/manpower/comparison-builders.ts`：`buildStageCostComparisonSnapshots()` / `buildProjectCostComparisonSnapshots()` — 消费回写适配结果，生成成本比较快照
- `src/lib/manpower/cost-calculators.ts`：`buildManpowerCostSummary()` / `buildRoleCostSnapshots()` — 生成成本汇总和角色成本快照

项目进度聚合链路：
- `src/lib/project-progress/project-progress-builders.ts`：`buildProjectProgressSnapshots()` / `buildProjectStageProgressSnapshots()` — 消费任务聚合 + 资源压力 + 回写，生成项目进度快照
- `src/lib/project-progress/project-risk-builders.ts`：`buildProjectRiskSignals()` — 从多源聚合生成风险信号

版本治理聚合链路：
- `src/lib/version-governance/version-governance-builders.ts`：`buildVersionGovernanceRecords()` — 消费项目进度 + 风险 + 回写，生成版本治理记录
- `src/lib/version-governance/release-readiness-builders.ts`：`buildReleaseReadinessRecords()` — 生成发布准备度
- `src/lib/version-governance/version-risk-builders.ts`：`buildVersionRiskSignals()` — 生成版本级风险信号

统一项目详情聚合：
- `src/lib/project-detail/project-detail-builders.ts`：`buildProjectDetailSnapshot()` — 汇聚进度/资源/成本/版本/风险，生成 `ProjectDetailSnapshot`

管理驾驶舱聚合：
- `src/lib/executive-dashboard/dashboard-builders.ts`：`buildExecutiveOverviewSnapshot()` / `buildProjectHealthSnapshots()` / `buildResourceHealthSnapshot()` / `buildVersionHealthSnapshots()` / `buildDeliveryRiskSnapshots()` — 最顶层消费者

**已有能力**：这一层是当前仓库中成熟度最高的部分。已经形成了从 `TaskExecutionRecord` 出发，经过任务 → 阶段 → 项目 → 回写 → 成本 → 进度 → 版本治理 → 驾驶舱的完整聚合链路和回写传递链路。

**缺口**：所有 builder 目前直接 import mock 数据数组（如 `import { taskExecutionRecords } from '@/data/...'`），未来需要替换为 API 调用或依赖注入。

### Layer 6：快照与时间维度层（Snapshot & Timeline）

**职责**：为聚合结果附加时间维度，支持基线、快照、比较。

**当前仓库落点**：

- `src/lib/types/snapshot.ts`：`SnapshotContext`（snapshotDate/baselineDate/compareDate/comparisonBasis/timelineLabel）、`SnapshotMetadata`
- `src/lib/snapshots/snapshot-helpers.ts`：`buildSnapshotContext()` / `buildSnapshotLabel()` — 使用固定 mock 日期（`DEFAULT_SNAPSHOT_DATE = '2026-03-12'`）
- `src/components/shared/snapshot-context-panel.tsx`：快照口径展示组件

**已有能力**：快照上下文结构已定义，所有聚合快照（ResourcePressureSnapshot/VersionGovernanceRecord/ExecutiveOverviewSnapshot 等）都携带 `SnapshotContext`

**缺口**：当前快照日期是硬编码的 mock 值；没有真正的快照存储/历史查询能力；没有时间线滑动或多快照比较 UI

### Layer 7：视图消费层（View & Consumption）

**职责**：将聚合与快照结果通过页面呈现给用户。每个页面不应自行重复计算，而应消费 builder 产出的快照。

**当前仓库落点（16 个路由页面）**：

已接入聚合层的页面（系统骨架）：
- `/task-execution`：消费全部任务聚合/阶段聚合/项目聚合/人员负载/分配消耗/回写预览
- `/people-resources`：消费资源分配聚合/利用率快照/招聘缺口/资源压力
- `/manpower-cost`：消费成本比较/回写适配/角色成本/成本汇总
- `/project-progress`：消费项目进度快照/阶段进度快照/风险信号/版本关联
- `/version-governance`：消费版本治理记录/项目关联/发布准备度/版本风险
- `/executive-dashboard`：消费项目健康/资源健康/版本健康/交付风险/回写成本
- `/projects/[projectId]`：消费 `ProjectDetailSnapshot`（统一汇聚进度/资源/成本/版本/风险）

仍为页面壳子或旧实现的页面（过渡状态）：
- `/dashboard`：使用 `src/lib/mock/overview.ts` 的简单统计，未接入聚合层
- `/projects`：直接读 `data/projects.ts` 列表
- `/tasks`：直接读 `data/tasks.ts`（使用 `domain.ts` 的旧 `Task` 类型）
- `/versions`：直接读 `data/versions.ts`
- `/docs-index`：直接读 `data/docs.ts`
- `/change-log`：直接读 `data/changes.ts`
- `/references`：直接读 `data/references.ts`
- `/settings`：静态治理规则展示

**已有能力**：7 个核心 workbench 页面已深度接入聚合层，每个页面都有 `SourceContextPanel`（标注数据来源）和 `SnapshotContextPanel`（标注快照口径）

**缺口**：旧页面和新 workbench 页面在导航中并列，视觉和数据口径不统一

### Layer 8：外部协同预留层（External Integration）

**职责**：预留未来外部系统接入的接口位置。

**当前仓库落点**：

- `ActualInputRecord.sourceType` 已预留 `timesheet-sync`（工时系统同步）
- `PlanVersion.sourceType` 已预留 `imported`（外部导入）
- `json-import-contracts.ts` 已定义 JSON 导入格式
- `SensitiveCostProfile.visibilityScope` 已预留 `finance-only`/`admin-only`（权限分级）
- `PersonResourceRecord` 中 `department`/`location` 字段可对接飞书组织架构

**已有能力**：数据结构层面的预留字段

**缺口**：没有 API 层抽象；没有外部系统适配器接口定义

---

## 五、核心对象与关系

### 主要对象清单

| 对象 | 当前类型 | 所在文件 | 归属层 |
|---|---|---|---|
| 项目 | `Project` + `ManpowerProject` | `domain.ts` + `manpower.ts` | L2 项目主数据 |
| 阶段 | `ProjectStagePlan` | `manpower.ts` | L2 项目主数据 |
| 计划版本 | `PlanVersion` | `manpower.ts` | L2 项目主数据 |
| 任务（旧） | `Task` | `domain.ts` | L3 工作对象（过渡） |
| 任务（新） | `TaskExecutionRecord` | `task-execution.ts` | L3 工作对象（骨架） |
| 任务-阶段关联 | `ProjectStageTaskLink` | `task-execution.ts` | L3 工作对象 |
| 任务依赖 | `TaskDependencyRecord` | `task-execution.ts` | L3 工作对象 |
| 执行记录 | `TaskActivityRecord` | `task-execution.ts` | L4 事件输入 |
| 人员 | `PersonResourceRecord` | `people-resources.ts` | L1 身份与人员 |
| 角色 | `ResourceRoleRecord` + `EngineerRoleConfig` | `people-resources.ts` + `manpower.ts` | L1 身份与人员 |
| 分配 | `ProjectAllocationRecord` | `people-resources.ts` | L3 工作对象 |
| 招聘需求 | `HiringDemandRecord` | `people-resources.ts` | L3 工作对象 |
| 版本记录（旧） | `VersionRecord` | `domain.ts` | L3 工作对象（过渡） |
| 版本治理 | `VersionGovernanceRecord` | `version-governance.ts` | L5 聚合 |
| 文档 | `DocumentRecord` | `domain.ts` | L3 工作对象 |
| 变更 | `ChangeRecord` | `domain.ts` | L3 工作对象 |
| 引用 | `ReferenceRecord` | `domain.ts` | L3 工作对象 |
| 风险信号 | `ProjectRiskSignal` + `VersionRiskSignal` | `project-progress.ts` + `version-governance.ts` | L5 聚合 |
| 敏感成本 | `SensitiveCostProfile` | `people-resources.ts` | L1 身份与人员 |
| 快照上下文 | `SnapshotContext` | `snapshot.ts` | L6 快照 |

### 核心关系

```
Project (1) ──── (N) ProjectStagePlan ──── (N) ProjectStageTaskLink ──── (1) TaskExecutionRecord
    │                                                                           │
    │                                                                           ├── (N) TaskActivityRecord
    │                                                                           ├── (N) TaskDependencyRecord
    │                                                                           └── (N) ProjectAllocationRecord ── (1) PersonResourceRecord
    │                                                                                       │
    ├── (N) VersionRecord / VersionGovernanceRecord                                         ├── (1) ResourceRoleRecord
    ├── (N) DocumentRecord                                                                  └── (0..1) SensitiveCostProfile
    ├── (N) ChangeRecord
    └── (N) ReferenceRecord
```

### 风险与质量的关系（需分离）

当前仓库中「风险」已有独立信号体系（`ProjectRiskSignal` 含 6 种 signalType：`blocked-task`/`overdue-task`/`high-risk-task`/`resource-pressure`/`writeback-gap`/`stage-delay`）。

但「质量」尚未作为独立维度定义。在系统框架中应分开：
- **风险**：影响交付时间和资源的不确定性因素（已有）
- **质量**：交付物本身的完成度/合规度/评审结果（缺失，需在 Phase 2 定义 `QualityCheckRecord` 或类似对象）

---

## 六、核心主链路

### 主链路 1：任务执行 → 聚合 → 回写 → 成本

这是当前仓库中已经跑通的最长链路：

```
TaskExecutionRecord + TaskActivityRecord
    │
    ▼ buildTaskExecutionAggregates()
TaskExecutionAggregate
    │
    ├──▼ buildStageExecutionAggregates()
    │   StageExecutionAggregate
    │       │
    │       ▼ buildProjectExecutionAggregates()
    │       ProjectExecutionAggregate
    │
    ├──▼ buildPersonTaskLoadAggregates()
    │   PersonTaskLoadAggregate
    │
    ├──▼ buildAllocationConsumptionAggregates()
    │   AllocationConsumptionAggregate
    │
    └──▼ buildTaskExecutionWritebackRecords()
        TaskExecutionWritebackRecord (含 estimatedActualCost)
            │
            ▼ buildAllocationWritebackPreviews()
            AllocationWritebackPreview
                │
                ▼ buildManpowerActualInputAdapterResults()
                ManpowerActualInputAdapterResult
                    │
                    ├──▼ buildStageCostComparisonSnapshots()
                    │   StageCostComparisonSnapshot
                    │
                    └──▼ buildProjectCostComparisonSnapshots()
                        ProjectCostComparisonSnapshot
```

### 主链路 2：项目进度 → 版本治理 → 驾驶舱

```
ProjectExecutionAggregate + StageExecutionAggregate + ResourcePressureSnapshot + WritebackRecord
    │
    ▼ buildProjectProgressSnapshots()
ProjectProgressSnapshot
    │
    ├──▼ buildProjectRiskSignals()
    │   ProjectRiskSignal[]
    │
    ├──▼ buildVersionGovernanceRecords()
    │   VersionGovernanceRecord + ReleaseReadinessRecord + VersionRiskSignal
    │
    └──▼ buildProjectDetailSnapshot()
        ProjectDetailSnapshot (汇聚 execution/resource/cost/version/risk)
            │
            ▼ buildExecutiveOverviewSnapshot() / buildProjectHealthSnapshots() / ...
            ExecutiveOverviewSnapshot（管理驾驶舱最终消费）
```

### 主链路 3（预留）：事件输入 → 结构化回写

```
语音/文本/消息/表单
    │
    ▼ InputChannel.parse() [未实现]
    │
    ├── TaskActivityRecord (进入主链路 1)
    └── ActualInputRecord  (进入成本比较)
```

---

## 七、视图配置与共享组件体系

当前仓库已建立的视图配置层：

- `src/lib/view-config/bilingual-label-builders.ts`：`BilingualLabel` + `makeBilingualLabel()` + `formatBilingualLabel()` — 全站双语标签基础设施
- `src/lib/view-config/label-maps.ts`：通用字段标签映射（project/stage/owner/status/progress/risk/summary/version/writeback）
- `src/lib/view-config/status-labels.ts`：各维度状态标签（taskStatus/projectProgressStatus/resourcePressure/availability/personStatus/releaseStatus/signalSeverity）
- `src/lib/view-config/tone-mappers.ts`：`mapRiskTone()` — 将风险/状态值映射为 UI 色调
- `src/lib/view-config/filter-options.ts`：`buildStatusOptions()` + 各维度筛选选项 + `commonViewModes`

共享 UI 组件：

- `src/components/shared/source-context-panel.tsx`：标注当前视图数据来源
- `src/components/shared/snapshot-context-panel.tsx`：展示快照口径（快照日/基线日/对比口径）
- `src/components/shared/rule-context-panel.tsx`：展示当前聚合规则说明
- `src/components/shared/bilingual-field-label.tsx`：双语字段标签组件

---

## 八、当前已有工程骨架判定

### 已具备「系统骨架」性质的部分

1. **类型系统**（12 个类型文件）：覆盖了从人员/项目/任务/分配/成本/版本治理/快照的完整领域模型
2. **聚合计算层**（15+ 个 builder/selector/aggregator/mapper 文件）：已形成从任务执行到成本回写到版本治理的完整计算链路
3. **回写链路**（writeback-mappers → allocation-writeback-mappers → actual-input-adapters）：已跑通任务 → 分配 → 人力成本的回写传递
4. **7 个核心 workbench 页面**：每个都深度消费聚合层，不是简单列表
5. **视图配置层**（bilingual-label/tone-mapper/filter-options/status-labels）：已为全站统一展示风格奠基
6. **共享组件**（SourceContextPanel/SnapshotContextPanel/RuleContextPanel）：已建立数据来源和口径可追溯的展示规范
7. **治理文档**（6 个 governance 文件）：隔离规则/版本策略/文档策略/引用策略/项目定义/范围边界

### 仍为页面壳子的部分

1. `/dashboard`：使用简单统计，未接入聚合层
2. `/tasks`、`/versions`、`/docs-index`、`/change-log`、`/references`：直接读 `data/` 数组，使用旧 `domain.ts` 类型，没有 builder
3. `/settings`：静态展示

### 已进入 builder/aggregation/writeback 体系的模块

- 任务执行中心（task-execution）：完整
- 人员与资源（people-resources）：完整
- 人力成本（manpower-cost）：完整
- 项目进度（project-progress）：完整
- 版本治理（version-governance）：完整
- 管理驾驶舱（executive-dashboard）：完整
- 项目详情（projects/[projectId]）：已接入统一快照

### 仍为 legacy/分散状态的模块

- 旧 Task（`domain.ts` 中的 `Task` 类型 + `/tasks` 页面）
- 旧 VersionRecord（`domain.ts` 中的 `VersionRecord` + `/versions` 页面）
- Dashboard（`/dashboard` + `lib/mock/overview.ts`）
- 文档/变更/引用索引页面

---

## 九、当前主要结构性问题

### 问题 1：双重项目 ID 体系（最高优先级）

`domain.ts` 中 `Project.id = 'pm-workbench'`，`manpower.ts` 中 `ManpowerProject.id = 'project-pm-workbench'`。两套 ID 导致：
- `project-detail-builders.ts` 需要维护 `projectIdMap` 硬编码映射
- `/projects/[projectId]/page.tsx` 也需要重复维护同一个映射
- 新增项目时必须同步修改多处映射，极易遗漏

### 问题 2：双重任务类型定义

`domain.ts` 中的 `Task`（10 个字段，被 `/tasks` 页面使用）与 `task-execution.ts` 中的 `TaskExecutionRecord`（25+ 字段，被 workbench 页面使用）并行存在。两者字段名和状态枚举都不一致（如 `Task.priority = 'low'|'medium'|'high'|'critical'` vs `TaskExecutionRecord.priority = 'p0'|'p1'|'p2'|'p3'`）。

### 问题 3：角色定义双轨

`ResourceRoleRecord`（`people-resources.ts`）和 `EngineerRoleConfig`（`manpower.ts`）是两套角色定义。`role-cost-mappers.ts` 通过模糊名称匹配（`role.name.toLowerCase().includes(...)`）来桥接两者。

### 问题 4：聚合层直接 import mock 数据

所有 builder 函数直接 `import { xxx } from '@/data/...'`，没有通过参数注入或服务层间接引用。未来替换为真实 API 时，需要逐个修改每个 builder 的数据获取方式。

### 问题 5：快照时间维度硬编码

`MOCK_TODAY = '2026-03-12'`、`DEFAULT_SNAPSHOT_DATE = '2026-03-12'`、`DEFAULT_BASELINE_DATE = '2026-02-01'` 都是硬编码常量。无法做时间线滑动或历史快照对比。

### 问题 6：旧页面与新 workbench 页面并列

Sidebar 导航中 14 个入口并列，用户无法区分哪些是核心 workbench 页面（有聚合能力）、哪些只是旧索引页（简单列表）。需要分组或收口。

### 问题 7：质量维度缺失

风险信号体系已相当完整（6 种信号类型 + 项目级 + 版本级），但质量维度（交付物评审、代码质量、测试覆盖等）在类型系统和聚合层中完全缺失。

---

## 十、给下一轮模型的接力说明

本文档是 PM-WORKBENCH 的系统总框架定义（第 1 包）。后续模型拿到本文档后，请按以下顺序继续：

**下一轮应优先进入的模块：统一项目 ID 与主数据收口**

原因：这是当前仓库中唯一需要横跨全部 builder/page/data 的结构性问题。不解决它，后续所有新增项目和新增聚合都会被 `projectIdMap` 硬编码拖累。建议的做法是以 `ManpowerProject` 的 ID 格式（`project-xxx`）为准，统一 `domain.ts` 中 `Project.id` 的命名，或引入正式的 `UnifiedProjectIdentityMap`。

在完成 ID 收口后，再进入第 2 包（核心对象/数据结构与主链路定义收口）和第 3 包（分模块实施拆解与代码落位方案）。

请勿推翻当前已有的聚合层和 builder 体系——它们是这个系统中成熟度最高的部分。
