# PM-WORKBENCH Phase 2 Handoff — Snapshot Timeline + Quality Governance

## 本轮完成摘要

本轮在 Phase 1 已完成的 unified project / write-back chain / 核心页面收口基础上，补齐 **时间维度（baseline/compare）** 与 **质量维度（独立于风险）** 的中层骨架，并将其真正接入核心页面。

## 新增/更新文件清单（核心）

- **多时点快照类型与对比对象**
  - `src/lib/types/timeline-snapshot.ts`
- **Timeline builders（4 条主链）**
  - `src/lib/snapshots/timeline-builders.ts`
  - `src/lib/snapshots/comparison-builders.ts`
  - `src/lib/snapshots/time-variation.ts`（mock 时间扰动：让不同日期产生可重复的“历史差异”）
- **轻量快照批次存储（回放能力）**
  - `src/server/persistence/snapshot-batch-store.ts`
  - `src/app/api/snapshots/batches/route.ts`
  - `src/app/api/snapshots/batches/[batchId]/route.ts`
- **快照 API 扩展（current/baseline/compare + comparisons）**
  - `src/app/api/snapshots/route.ts`
- **质量域扩展**
  - `src/lib/types/quality.ts`（新增 DeliverableQualityRecord / QualityIssueRecord / VersionQualityGateRecord / StageQualitySnapshot / QualitySummaryRecord）
  - `src/data/quality/quality-check-records.ts`（新增 deliverableQualityRecords / qualityIssueRecords）
  - `src/lib/quality/quality-builders.ts`（新增 stage snapshots / version quality gates / portfolio quality summary）
  - `src/server/services/quality-service.ts` + `src/app/api/quality/route.ts`（扩展输出）
- **共享 view-config 与 context 统一**
  - `src/lib/view-config/quality-labels.ts`
  - `src/lib/view-config/compare-labels.ts`
  - `src/lib/view-config/tone-mappers.ts`（新增 mapQualityTone）
  - `src/components/shared/snapshot-context-panel.tsx`（修正 compare 日期展示）
- **核心页面接入（至少 3 个）**
  - `src/components/project-progress/project-progress-workbench.tsx`
  - `src/components/version-governance/version-governance-workbench.tsx`
  - `src/components/executive-dashboard/executive-dashboard-workbench.tsx`
  - `src/app/project-progress/page.tsx` / `src/app/version-governance/page.tsx` / `src/app/executive-dashboard/page.tsx`（Suspense 包裹，兼容 useSearchParams）

## 哪几类 snapshot / compare 能力已正式跑通

- **Project Progress timeline**：`buildProjectProgressTimelinePoints(date)`
- **Version Governance timeline**：`buildVersionGovernanceTimelinePoints(date)`
- **Resource Pressure timeline**：`buildResourcePressureTimelinePoints(date)`
- **Manpower Cost timeline**：`buildManpowerCostTimelinePoints(date)`
- **Comparison records**：`comparisons.*`（current vs baseline/compare）
- **API**：`/api/snapshots?snapshotDate=YYYY-MM-DD&baselineDate=YYYY-MM-DD&compareDate=YYYY-MM-DD`

## 哪些页面已正式接入时间比较 + 质量维度

最低要求已满足（3 个核心页）：

- `/project-progress`：展示 Δ baseline / Δ compare + quality score（风险与质量独立）
- `/version-governance`：展示 release quality gate + Δ baseline/compare（版本进度）+ 保留原风险聚集
- `/executive-dashboard`：展示 portfolio 级 Δ baseline/compare（平均进度）+ portfolio quality summary

## 风险与质量如何拆分

- **风险**：延期/阻塞/资源压力/不确定性交付影响（已有 risk signal builders）  
- **质量**：交付物评审、质量门禁、质量问题闭环（本轮新增 quality types/builders/service/api）
- 页面层：风险区块继续使用 `mapRiskTone`；质量区块使用 `mapQualityTone` 与 `quality-labels`

## 仍然是轻量 mock / local persistence 的部分

- Timeline 差异目前通过 `time-variation.ts` 对不同日期做可重复的 mock 变动（保证 compare 有真实差异，但不依赖真实历史存档）
- SnapshotBatch 目前存储于 `local-store` 内存集合（刷新进程即丢失），用于“结构闭环与回放接口”落地

## 给后续廉价模型的接力说明（3 个方向）

1. **把 timeline 从“时间扰动 mock”升级为“真实存档快照”**  
   - 将 `/api/snapshots/batches` 创建批次时，把 4 条 timeline 的 current/baseline/compare 结果一起存入持久化（或 JSON 文件）  
   - 扩展 `snapshotBatchStore` 为文件存储或 sqlite（保持接口不变）

2. **把质量门禁与版本治理/发布准备度更紧密收口**  
   - 让 `VersionGovernanceRecord` 直接携带 `VersionQualityGateRecord`（builder 层合并，页面只消费）

3. **把 compare UI 从“摘要 delta cards”扩展为“列表/表格可展开对比”**  
   - 先从 `/project-progress` 的 stage 列表开始（每个 stage 展示 baseline/compare delta）

