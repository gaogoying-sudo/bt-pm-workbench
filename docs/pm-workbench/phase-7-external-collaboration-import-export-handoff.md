# PM-WORKBENCH Phase 7 Handoff — External Collaboration / Import-Export / Readiness Foundation

## 本轮完成摘要

本轮将 PM-WORKBENCH 从“内部运行系统”升级为“外部协同中间层”骨架：  
落地 import/export job 主链、integration contract/payload schema/mapping 骨架，并把 external readiness 摘要接入核心页面。

## 新增/更新文件清单（关键）

### Import/Export & Integration domain
- `src/lib/types/integrations.ts`
- `src/data/integrations/external-systems.ts`
- `src/server/repositories/data-exchange-repository.ts`
- `src/server/services/data-exchange-service.ts`

### Readiness
- `src/lib/integrations/external-ready-types.ts`
- `src/lib/integrations/readiness-builders.ts`

### APIs
- `src/app/api/data-exchange/route.ts`
- `src/app/api/data-exchange/import/preview/route.ts`
- `src/app/api/data-exchange/import/apply/route.ts`
- `src/app/api/data-exchange/import/jobs/route.ts`
- `src/app/api/data-exchange/export/generate/route.ts`
- `src/app/api/data-exchange/export/jobs/route.ts`
- `src/app/api/data-exchange/export/bundles/[bundleId]/route.ts`

### UI entry
- `/data-exchange`: `src/app/data-exchange/page.tsx`
- `src/components/data-exchange/data-exchange-workbench.tsx`
- `src/components/layout/sidebar.tsx`（新增导航）

### Page wiring
- `/projects/[projectId]`：external readiness + external mapping panel
- `/version-governance`：external release readiness summary
- `/executive-dashboard`：portfolio external readiness counters

## import/export / integration contract 如何落地

- **Import**：JSON → preview（required fields 校验）→ apply（最小 apply：写入 ExternalIdentifierBinding）
- **Export**：基于 readiness builders 生成 bundle（JSON payload list）→ 生成 export job + bundle + audit → 下载

## 已支持的外部映射/校验/失败状态骨架

- required fields 校验（preview）
- apply 前必须 preview（无 preview 会拒绝）
- mapping missing 将直接影响 supply readiness（readiness reasons 可解释）
- retry/partial success 为 placeholder（job status 与 apply trace 已预留）

## 仍然是 placeholder / local adapter / mock target

- 无真实外部 API push/pull（仅本地 archive file target）
- 合同/Schema 为 v1 mock（但结构已成体系）
- mapping upsert 当前为 add-only（后续可升级为真正 upsert/merge）

## 后续便宜模型最适合继续接的 3 个方向

1. **CSV/Excel 模板与字段映射**：在 preview 中引入模板解析与字段映射 UI
2. **更强冲突处理**：duplicate/overwrite/partial apply 的细粒度策略与可重试 UI
3. **真实外部系统适配器**：基于 `DeliveryEnvelopeRecord` 与 `ExternalPayloadSchema` 增加 API target adapter（不改变 domain contract）

