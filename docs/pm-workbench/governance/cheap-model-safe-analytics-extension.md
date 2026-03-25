# Cheap-model Safe Analytics Extension (Guardrails)

This guide prevents metric drift and “shadow metrics”.

## High-risk extension points

- **Executive / project / version dashboards**: easy to add page-local “scores”
- **Snapshot compare**: easy to change delta meaning without versioning
- **Readiness**: easy to mix internal progress with external readiness
- **Quality vs risk**: easy to merge concepts into one label
- **Import/export mapping**: easy to hide degraded states

## Contract boundaries (do not bypass)

- Metrics: `GET /api/metrics` + `src/lib/types/metrics.ts`
- Data governance: `GET /api/data-governance` + `src/lib/types/data-quality.ts`
- Reviews/decisions: `GET /api/reviews` + `src/lib/types/reviews.ts`

## Common extension templates

### 1) Add a new business indicator card
- Add metric definition + version
- Add builder/service output
- Consume in page with `MetricBadge(metricCode)`
- Add one data quality check if inputs are optional

### 2) Add a new compare dimension
- Extend timeline point type under `src/lib/types/timeline-snapshot.ts`
- Add builder in `src/lib/snapshots/timeline-builders.ts`
- Add compare logic in `src/lib/snapshots/comparison-builders.ts`
- Add metric version record if interpretation changes

### 3) Add a scoring rule / threshold
- Add `ScoringRuleRecord` / `ThresholdRuleRecord` with version
- Document change reason and impacted pages

### 4) Add a review / decision hook
- Add a new `ReviewType` and seed examples
- Wire summary into `/projects/[projectId]` and `/executive-dashboard`

### 5) Add a new data quality check
- Implement in `src/server/services/data-governance-service.ts`
- Ensure it has evidence + suggested action

