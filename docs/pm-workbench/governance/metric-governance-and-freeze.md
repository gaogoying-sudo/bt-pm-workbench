# Metric Governance & Freeze (v0)

Goal: make metrics **trustworthy** over time by freezing definitions and versions.

## What is frozen

- **Metric code** (identifier)
- **Definition + sources**
- **Active version** (e.g. `project.healthScore@v1`)
- **Rule / threshold version** (when applicable)
- **Interpretation** (bilingual labels + explanation)
- **Primary consuming pages**

## Single source of truth

- API: `GET /api/metrics`
- Registry: `src/lib/metrics/metric-registry.ts`
- Dictionary seed: `src/data/metrics/metric-dictionary.ts`

## Do / Don’t

### Do
- Add new metrics via dictionary pack + version record
- Reference metric code in pages, and show `MetricBadge` for version visibility
- Add data quality checks to explain trust caveats

### Don’t
- Don’t implement health/readiness formulas inside pages
- Don’t fork metric logic into random helper files
- Don’t change metric meaning without bumping version + documenting impact

## Adding a new metric (template)

1. Add `MetricDefinitionRecord` + `MetricVersionRecord`
2. Add formula/threshold/interpretation if needed
3. Wire to pages via builder/service output (not page-local compute)
4. Add a minimal data quality check if the metric depends on optional data

