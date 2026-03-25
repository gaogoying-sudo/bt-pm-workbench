# PM-WORKBENCH Phase 3 Handoff — Unified Input Events + Human-in-the-loop Write-back

## 本轮完成摘要

本轮完成了“输入事件层与低摩擦结构化回写”的最小可用闭环：  
**Raw Input → Parsed Intent → Structured Draft → Confirmation Queue → Confirmed Event → Write-back → 影响治理链（risk/quality/progress/manpower/task activity）**。

## 新增/更新文件清单（关键）

### Domain / Contract
- `src/lib/types/input-events.ts`  
  RawInputRecord / ParsedInputIntent / StructuredDraftRecord / ConfirmedEventRecord / EventWritebackRecord  
  输入来源枚举、事件类型枚举、状态流转、目标引用 EventTargetRef、审计字段（createdBy/confirmedBy 等）

### Repositories / Services
- `src/server/repositories/input-event-repository.ts`（local-store 轻量持久化）
- `src/server/services/input-parser-service.ts`（规则解析）
- `src/server/services/input-resolver-service.ts`（基于 unified project + task 简易解析）
- `src/server/services/input-draft-service.ts`（raw→draft）
- `src/server/services/input-confirmation-service.ts`（confirm/reject）
- `src/server/services/event-writeback-service.ts`（confirmed→writeback）
- `src/lib/input-events/event-projection-store.ts`（risk event 的轻量投影存储）

### API
- `src/app/api/input-events/route.ts`（索引）
- `src/app/api/input-events/raw/route.ts`（POST capture raw → create draft）
- `src/app/api/input-events/drafts/route.ts`（GET list / PATCH update draft）
- `src/app/api/input-events/confirm/route.ts`（GET queue / POST confirm|reject + writeback）

### Frontend Entry
- `src/app/input-inbox/page.tsx`
- `src/components/input-events/input-inbox-workbench.tsx`
- `src/components/layout/sidebar.tsx`（新增导航入口）

### Consumption (3+ core pages)
- `src/app/projects/[projectId]/page.tsx`（项目维度 recent confirmed events）
- `src/components/task-execution/task-execution-workbench.tsx`（recent confirmed events + link to inbox）
- `src/components/executive-dashboard/executive-dashboard-workbench.tsx`（portfolio recent confirmed events）

## 已正式支持的输入事件类型（5+）

1. **progress update**：写回为 TaskActivityRecord（progress-update），影响项目进度聚合
2. **task activity**：写回为 TaskActivityRecord（worklog/risk/blocker/...）
3. **manpower actual input**：写回为 ActualInputRecord（进入人力成本比较链）
4. **risk event**：写入 projection store，并被 `buildProjectRiskSignals()` 消费为 `input-risk-event`
5. **quality check**：写回为 QualityCheckRecord（进入质量聚合与门禁摘要）

## 解析 → 确认 → 回写主链如何落地

- Capture：`POST /api/input-events/raw`  
  - 生成 `RawInputRecord`  
  - 同步生成 `StructuredDraftRecord`（awaiting-confirmation）
- Confirm/Reject：`POST /api/input-events/confirm`  
  - confirm：生成 `ConfirmedEventRecord` → 调用 writeback → 生成 `EventWritebackRecord`
  - reject：draft 进入 rejected（保留 warnings/trace）
- Writeback：`event-writeback-service.apply()`  
  - 对不同 eventType 分发到 task activity / manpower actual / quality / risk projection 等适配器

## 哪些仍然是轻量规则 / mock / local persistence

- Parser/Resolver 为 rule-based（关键词 + 简单匹配），未接入真实大模型
- local persistence 基于 `local-store` 的内存集合（刷新进程即丢失）
- risk event 暂为 projection store 轻量实现（用于让治理链真实消费）

## 给后续廉价模型的接力说明（3 个方向）

1. **把 draft 编辑从“通用输入框”升级为“按 eventType 的结构化表单”**  
   - 每个 payload 类型有专属字段校验与选择器（project/stage/task/person/role）
2. **把 projection store 升级为 snapshot batch 的一部分**  
   - confirmed event 写回后触发 snapshot batch 生成/更新，让 compare 真正可回放
3. **完善 resolver：统一目标引用**  
   - 基于 `unified-project-registry` + stage plans + task code 的更强解析；减少 unresolvedHints

